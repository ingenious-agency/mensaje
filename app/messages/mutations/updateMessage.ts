import { Ctx } from "blitz"
import db, { Prisma } from "db"
import Guard from "app/guard/ability"

import { UpdateMessageInput } from "app/messages/validations"

export type UpdateMessageInputType = Pick<Prisma.MessageUpdateArgs, "data" | "where">

async function updateMessage({ where, data }: UpdateMessageInputType, ctx: Ctx) {
  ctx.session.authorize()

  const { title, body } = UpdateMessageInput.parse(data)

  const message = await db.message.update({
    where,
    data: { title, body },
    include: { user: true, views: { include: { user: true } } },
  })

  return message
}

export default Guard.authorize("update", "message", updateMessage)
