import { Ctx } from "blitz"
import db from "db"

export default async function createMessageView({ messageId }: { messageId: string }, ctx: Ctx) {
  ctx.session.$authorize()

  const messageView = await db.messageView.upsert({
    create: {
      message: { connect: { id: messageId } },
      user: { connect: { id: ctx.session.userId } },
    },
    update: {
      updatedAt: new Date(),
    },
    where: {
      userId_messageId: {
        messageId,
        userId: ctx.session.userId,
      },
    },
  })

  return messageView
}
