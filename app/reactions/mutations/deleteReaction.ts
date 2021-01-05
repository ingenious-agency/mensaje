import { AuthorizationError, Ctx } from "blitz"
import db, { Prisma } from "db"
import getReaction from "app/reactions/queries/getReaction"
import { WebClient } from "@slack/web-api"

type DeleteReactionInput = Pick<Prisma.ReactionDeleteArgs, "where">

export default async function deleteReaction({ where }: DeleteReactionInput, ctx: Ctx) {
  ctx.session.authorize()

  const existingReaction = await getReaction({ where }, ctx)
  if (existingReaction.userId !== ctx.session.userId) throw new AuthorizationError()
  const reaction = await db.reaction.delete({
    where,
    include: { message: { include: { user: true } } },
  })

  if (reaction.message?.slackTimeStamp) {
    const web = new WebClient(reaction.message.user?.slackAccessToken)
    web.reactions.remove({
      name: reaction.alt,
      timestamp: reaction.message?.slackTimeStamp,
      channel: reaction.message.slackChannelId,
    })
  }

  return reaction
}
