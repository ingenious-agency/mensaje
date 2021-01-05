import { Ctx } from "blitz"
import db, { Prisma } from "db"
import { WebClient } from "@slack/web-api"

type CreateReactionInput = Pick<Prisma.ReactionCreateArgs, "data">
export default async function createReaction({ data }: CreateReactionInput, ctx: Ctx) {
  ctx.session.authorize()

  const existingReaction = await db.reaction.findFirst({
    where: {
      userId: ctx.session.userId,
      messageId: data.message?.connect?.id,
      emoji: data.emoji,
    },
  })
  if (existingReaction) return existingReaction

  const reaction = await db.reaction.create({
    data: { ...data, user: { connect: { id: ctx.session.userId } } },
    include: { message: { include: { user: true } } },
  })

  if (reaction.message?.slackTimeStamp) {
    const web = new WebClient(reaction.message.user?.slackAccessToken)
    web.reactions.add({
      name: data.alt,
      timestamp: reaction.message?.slackTimeStamp,
      channel: reaction.message.slackChannelId,
    })
  }

  return reaction
}
