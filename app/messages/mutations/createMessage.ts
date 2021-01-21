import { Ctx } from "blitz"
import db, { Prisma } from "db"
import { CreateMessageInput } from "app/messages/validations"
import CreateQueue from "app/api/messages/create"
import { authorize } from "app/guard"

type CreateMessageInputType = Pick<Prisma.MessageCreateArgs, "data">

async function createMessage({ data }: CreateMessageInputType, ctx: Ctx) {
  ctx.session.authorize()
  const { title, body, slackChannelId } = CreateMessageInput.parse(data)

  const message = await db.message.create({
    data: { title, body, slackChannelId, user: { connect: { id: ctx.session.userId } } },
    include: { user: true },
  })

  if (message.user?.slackAccessToken && message.slackChannelId) {
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

export default authorize("create", "message", createMessage)
