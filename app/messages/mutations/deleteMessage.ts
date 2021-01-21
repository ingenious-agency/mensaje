import { Ctx } from "blitz"
import db, { Prisma } from "db"
import { authorize } from "app/guard"

export type DeleteMessageInput = Pick<Prisma.MessageDeleteArgs, "where">

async function deleteMessage({ where }: DeleteMessageInput, ctx: Ctx) {
  ctx.session.authorize()

  const message = await db.message.delete({ where })

  return message
}

export default authorize("delete", "message", deleteMessage)
