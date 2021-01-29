import { Ctx } from "blitz"
import db, { Prisma } from "db"
import { CreateMessageInput } from "app/messages/validations"
import CreateQueue from "app/api/messages/create"
import Guard from "app/guard/ability"

type CreateMessageInputType = Pick<Prisma.MessageCreateArgs, "data">

async function createMessage({ data }: CreateMessageInputType, ctx: Ctx) {
  ctx.session.authorize()
  const { title, body, slackChannelId } = CreateMessageInput.parse(data)

  const message = await db.message.create({
    data: { title, body, slackChannelId, user: { connect: { id: ctx.session.userId } } },
    include: { user: true },
  })

  if (message.user?.slackAccessToken && message.slackChannelId && process.env.NODE_ENV !== "test") {
    await CreateQueue.enqueue({
      userToken: message.user?.slackAccessToken,
      channel: message.slackChannelId,
      body,
      messageId: message.id,
      title,
    })
  }

  return message
}

export default Guard.authorize("create", "message", createMessage)
