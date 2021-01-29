import { Ctx } from "blitz"
import db, { Prisma } from "db"
import RemoveQueue from "app/api/reactions/remove"
import Guard from "app/guard/ability"

export type DeleteReactionInput = Pick<Prisma.ReactionDeleteArgs, "where">

async function deleteReaction({ where }: DeleteReactionInput, ctx: Ctx) {
  ctx.session.authorize()

  const reaction = await db.reaction.delete({
    where,
    include: { message: { include: { user: true } } },
  })

  if (reaction.message?.slackTimeStamp) {
    await RemoveQueue.enqueue({
      channel: reaction.message.slackChannelId,
      timestamp: reaction.message.slackTimeStamp,
      name: reaction.alt,
      userToken: reaction.message.user?.slackAccessToken as string,
    })
  }

  return reaction
}

export default Guard.authorize("delete", "reaction", deleteReaction)
