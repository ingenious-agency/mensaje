import getMessage from "app/messages/queries/getMessage"
import { AuthenticationError, Ctx } from "blitz"

export default async function hasPermissions(id: string | undefined, ctx: Ctx): Promise<void> {
  const message = await getMessage({ where: { id } }, ctx)
  if (message.userId !== ctx.session.userId)
    throw new AuthenticationError("You are not allowed to access this resource")
}
