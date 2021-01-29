import Guard from "app/guard/ability"

import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetReactionsInput = Pick<Prisma.ReactionFindManyArgs, "where" | "orderBy" | "skip" | "take">

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

export default Guard.authorize("read", "reaction", getReactions)
