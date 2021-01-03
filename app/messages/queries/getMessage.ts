import { Ctx, NotFoundError } from "blitz"
import db, { Prisma } from "db"

type GetMessageInput = Pick<Prisma.FindFirstMessageArgs, "where">

//TOOD: check if logged in user is a member of the channel
export default async function getMessage({ where }: GetMessageInput, ctx: Ctx) {
  ctx.session.authorize()

  const message = await db.message.findFirst({ where })

  if (!message) throw new NotFoundError()

  return message
}
