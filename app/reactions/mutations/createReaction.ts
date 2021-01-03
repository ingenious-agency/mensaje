import { Ctx, NotFoundError } from "blitz"
import db, { Prisma, Reaction } from "db"
import getReaction from "app/reactions/queries/getReaction"

type CreateReactionInput = Pick<Prisma.ReactionCreateArgs, "data">
export default async function createReaction({ data }: CreateReactionInput, ctx: Ctx) {
  ctx.session.authorize()

  let reaction: Reaction
  try {
    reaction = await getReaction(
      {
        where: {
          userId: ctx.session.userId,
          messageId: data.message?.connect?.id,
          emoji: data.emoji,
        },
      },
      ctx
    )
  } catch (e) {
    if (e instanceof NotFoundError) {
      reaction = await db.reaction.create({
        data: { ...data, user: { connect: { id: ctx.session.userId } } },
      })
    } else {
      throw e
    }
  }

  return reaction
}
