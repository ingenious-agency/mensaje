import Guard from "app/guard/ability"

import { Ctx } from "blitz"
import db, { Prisma } from "db"

export type GetMessageInput = Pick<Prisma.FindFirstMessageArgs, "where" | "include">

async function getMessage({ where }: GetMessageInput, ctx: Ctx) {
  ctx.session.authorize()
  const message = await db.message.findFirst({
    where,
    include: { user: true, views: { include: { user: true } } },
  })

  return message
}

export default Guard.authorize("read", "message", getMessage)
