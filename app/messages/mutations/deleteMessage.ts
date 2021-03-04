import { Ctx } from "blitz"
import db, { Prisma } from "db"
import Guard from "app/guard/ability"

export type DeleteMessageInput = Pick<Prisma.MessageDeleteArgs, "where">

async function deleteMessage({ where }: DeleteMessageInput, ctx: Ctx) {
  ctx.session.$authorize()

  const message = await db.message.delete({ where })

  return message
}

export default Guard.authorize("delete", "message", deleteMessage)
