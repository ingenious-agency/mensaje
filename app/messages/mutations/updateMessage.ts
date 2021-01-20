import { Ctx } from "blitz"
import db, { Prisma } from "db"
import { UpdateMessageInput } from "app/messages/validations"
import hasPermissions from "app/messages/queries/hasPermissions"

type UpdateMessageInputType = Pick<Prisma.MessageUpdateArgs, "data" | "where">

export default async function updateMessage({ where, data }: UpdateMessageInputType, ctx: Ctx) {
  ctx.session.authorize()
  hasPermissions(where.id, ctx)

  const { title, body } = UpdateMessageInput.parse(data)

  const message = await db.message.update({
    where,
    data: { title, body },
    include: { user: true, views: { include: { user: true } } },
  })

  return message
}
