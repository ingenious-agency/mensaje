import { Ctx } from "blitz"
import db, { Prisma } from "db"
import RemoveQueue from "app/api/reactions/remove"
import { authorize } from "app/guard"

export type DeleteReactionInput = Pick<Prisma.ReactionDeleteArgs, "where">

async function deleteReaction({ where }: DeleteReactionInput, ctx: Ctx) {
  ctx.session.authorize()
  const user = await db.user.findUnique({ where: { id: ctx.session.userId } })

  const reaction = await db.reaction.delete({
    where,
    include: { message: true },
  })

  if (reaction.message?.slackTimeStamp) {
    await RemoveQueue.enqueue({
      channel: reaction.message.slackChannelId,
      timestamp: reaction.message.slackTimeStamp,
      name: reaction.alt,
      userToken: user?.slackAccessToken as string,
    })
  }

  return reaction
}

export default authorize("delete", "reaction", deleteReaction)
