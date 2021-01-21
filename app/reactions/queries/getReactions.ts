import { authorize } from "app/guard"
import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetReactionsInput = Pick<Prisma.FindManyReactionArgs, "where" | "orderBy" | "skip" | "take">

async function getReactions({ where, orderBy, skip = 0, take }: GetReactionsInput, ctx: Ctx) {
  ctx.session.authorize()

  const reactions = await db.reaction.findMany({
    where,
    orderBy,
    take,
    skip,
  })

  const count = await db.reaction.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    reactions,
    nextPage,
    hasMore,
    count,
  }
}

export default authorize("read", "reaction", getReactions)
