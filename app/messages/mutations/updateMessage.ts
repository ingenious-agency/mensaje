import { Ctx } from "blitz"
import db, { Prisma } from "db"
import { Pick2 } from "ts-multipick"
import { MessageInput } from "app/messages/validations"
import hasPermissions from "app/messages/queries/hasPermissions"

type WhereUpdateMessageInput = Pick<Prisma.MessageUpdateArgs, "where">
type DataUpdateMessageInput = Pick2<
  Pick<Prisma.MessageUpdateArgs, "data">,
  "data",
  "title" | "body"
>
type UpdateMessageInput = WhereUpdateMessageInput & DataUpdateMessageInput

export default async function updateMessage({ where, data }: UpdateMessageInput, ctx: Ctx) {
  ctx.session.authorize()
  hasPermissions(where.id, ctx)

  const { title, body } = MessageInput.parse(data)

  const message = await db.message.update({ where: { ...where }, data: { title, body } })

  return message
}
