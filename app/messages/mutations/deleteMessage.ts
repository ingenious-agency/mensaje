import { Ctx } from "blitz"
import db, { Prisma } from "db"
import hasPermissions from "app/messages/queries/hasPermissions"

type DeleteMessageInput = Pick<Prisma.MessageDeleteArgs, "where">

export default async function deleteMessage({ where }: DeleteMessageInput, ctx: Ctx) {
  ctx.session.authorize()
  hasPermissions(where.id, ctx)

  const message = await db.message.delete({ where })

  return message
}
