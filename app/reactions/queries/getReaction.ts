import { authorize } from "app/guard"
import { Ctx, NotFoundError } from "blitz"
import db, { Prisma } from "db"

type GetReactionInput = Pick<Prisma.FindFirstReactionArgs, "where">

async function getReaction({ where }: GetReactionInput, ctx: Ctx) {
  ctx.session.authorize()

  const reaction = await db.reaction.findFirst({ where })

  if (!reaction) throw new NotFoundError()

  return reaction
}

export default authorize("read", "reaction", getReaction)
