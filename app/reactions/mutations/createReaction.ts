import { Ctx } from "blitz"
import AddQueue from "app/api/reactions/add"
import db, { Prisma } from "db"
import Guard from "app/guard/ability"

export type CreateReactionInput = Pick<Prisma.ReactionCreateArgs, "data">

async function createReaction({ data }: CreateReactionInput, ctx: Ctx) {
  ctx.session.authorize()

  const existingReaction = await db.reaction.findFirst({
    where: {
      userId: ctx.session.userId,
      messageId: data.message?.connect?.id,
      emoji: data.emoji,
    },
  })
  if (existingReaction) return existingReaction

  // Add the user connection to data
  data.user = { connect: { id: ctx.session.userId } }

  const reaction = await db.reaction.create({
    data: data,
    include: { message: { include: { user: true } } },
  })

  if (reaction.message?.slackTimeStamp && process.env.NODE_ENV !== "test") {
    await AddQueue.enqueue({
      channel: reaction.message.slackChannelId,
      timestamp: reaction.message.slackTimeStamp,
      name: data.alt,
      userToken: reaction.message.user?.slackAccessToken as string,
    })
  }

  return reaction
}

export default Guard.authorize("create", "reaction", createReaction)
