import { Ctx } from "blitz"
import AddQueue from "app/api/reactions/add"
import db, { Prisma } from "db"

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

  if (reaction.message?.slackTimeStamp && reaction.message.user?.slackAccessToken) {
    await AddQueue.enqueue({
      channel: reaction.message.slackChannelId,
      timestamp: reaction.message.slackTimeStamp,
      name: data.alt,
      userToken: reaction.message.user?.slackAccessToken,
    })
  }

  return reaction
}
