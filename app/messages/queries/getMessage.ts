import Guard from "app/guard/ability"

import { Ctx, NotFoundError } from "blitz"
import db, { Prisma } from "db"

export type GetMessageInput = Pick<Prisma.MessageFindFirstArgs, "where" | "include">

async function getMessage({ where }: GetMessageInput, ctx: Ctx) {
  ctx.session.authorize()
  const message = await db.message.findFirst({
    where,
    include: { user: true, views: { include: { user: true } } },
  })

  if (!message) throw new NotFoundError()

  return message
}

export default Guard.authorize("read", "message", getMessage)
