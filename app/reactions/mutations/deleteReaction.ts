import { AuthorizationError, Ctx } from "blitz"
import db, { Prisma, User } from "db"
import getReaction from "app/reactions/queries/getReaction"
import RemoveQueue from "app/api/reactions/remove"

type DeleteReactionInput = Pick<Prisma.ReactionDeleteArgs, "where">

export default async function deleteReaction({ where }: DeleteReactionInput, ctx: Ctx) {
  ctx.session.authorize()
  const user = (await db.user.findUnique({ where: { id: ctx.session.userId } })) as User

  const existingReaction = await getReaction({ where }, ctx)
  if (existingReaction.userId !== ctx.session.userId) throw new AuthorizationError()

  const reaction = await db.reaction.delete({
    where,
    include: { message: true },
  })

  if (reaction.message?.slackTimeStamp) {
    await RemoveQueue.enqueue({
      channel: reaction.message.slackChannelId,
      timestamp: reaction.message.slackTimeStamp,
      name: reaction.alt,
      userToken: user.slackAccessToken,
    })
  }

  return reaction
}
