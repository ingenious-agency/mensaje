import { AuthorizationError, Ctx } from "blitz"
import db, { Prisma } from "db"
import getReaction from "app/reactions/queries/getReaction"

type DeleteReactionInput = Pick<Prisma.ReactionDeleteArgs, "where">

export default async function deleteReaction({ where }: DeleteReactionInput, ctx: Ctx) {
  ctx.session.authorize()

  let reaction = await getReaction({ where }, ctx)
  if (reaction.userId !== ctx.session.userId) throw new AuthorizationError()
  reaction = await db.reaction.delete({ where })

  return reaction
}
