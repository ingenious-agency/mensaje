import { AuthorizationError, Ctx } from "blitz"
import db, { Prisma } from "db"
import getReaction from "app/reactions/queries/getReaction"
import RemoveQueue from "app/api/reactions/remove"

type DeleteReactionInput = Pick<Prisma.ReactionDeleteArgs, "where">

const delay = (ms = 4000) => new Promise((resolve) => setTimeout(resolve, ms))

export default async function deleteReaction({ where }: DeleteReactionInput, ctx: Ctx) {
  ctx.session.authorize()

  await delay()
  const existingReaction = await getReaction({ where }, ctx)
  if (existingReaction.userId !== ctx.session.userId) throw new AuthorizationError()
  const reaction = await db.reaction.delete({
    where,
    include: { message: { include: { user: true } } },
  })

  if (reaction.message?.slackTimeStamp && reaction.message.user?.slackAccessToken) {
    await RemoveQueue.enqueue({
      channel: reaction.message.slackChannelId,
      timestamp: reaction.message.slackTimeStamp,
      name: reaction.alt,
      userToken: reaction.message.user?.slackAccessToken,
    })
  }

  return reaction
}
