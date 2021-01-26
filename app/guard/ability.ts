import { Ctx, NotFoundError } from "blitz"
import db from "db"
import { IGuard } from "@blitz-guard/core"
import getUserChannels from "app/channels/lib/getUserChannels"
import { UpdateMessageInputType } from "app/messages/mutations/updateMessage"
import { DeleteMessageInput } from "app/messages/mutations/deleteMessage"
import { GetMessageInput } from "app/messages/queries/getMessage"
import { CreateReactionInput } from "app/reactions/mutations/createReaction"
import { DeleteReactionInput } from "app/reactions/mutations/deleteReaction"

export default async function ability(ctx: Ctx, { can, cannot }: IGuard<typeof db>) {
  if (ctx.session.isAuthorized()) {
    // Messages
    can("read", "message", async ({ where }: GetMessageInput) => {
      const messageRequest = db.message.findFirst({ where: { id: where?.id } })
      const userRequest = db.user.findUnique({ where: { id: ctx.session.userId ?? undefined } })
      const [message, user] = await db.$transaction([messageRequest, userRequest])
      if (!message || !user) throw new NotFoundError()

      const channels = await getUserChannels({ user })

      return !!channels.find((channel) => channel.id === message.slackChannelId)
    })
    can("create", "message")
    can("update", "message", async ({ where }: UpdateMessageInputType) => {
      const message = await db.message.findUnique({ where: { id: where.id } })
      if (!message) throw new NotFoundError()
      return message.userId === ctx.session.userId
    })
    can("delete", "message", async ({ where }: DeleteMessageInput) => {
      const message = await db.message.findUnique({ where: { id: where.id } })
      if (!message) throw new NotFoundError()
      return message.userId === ctx.session.userId
    })

    // Reactions
    can("create", "reaction", async ({ data }: CreateReactionInput) => {
      const messageRequest = db.message.findUnique({
        where: { id: data?.message?.connect?.id as string },
      })
      const userRequest = db.user.findUnique({ where: { id: ctx.session.userId ?? undefined } })
      const [message, user] = await db.$transaction([messageRequest, userRequest])
      if (!message || !user) throw new NotFoundError()

      const channels = await getUserChannels({ user })

      return !!channels.find((channel) => channel.id === message.slackChannelId)
    })
    can("delete", "reaction", async ({ where }: DeleteReactionInput) => {
      const reactionRequest = db.reaction.findUnique({
        where: { id: where?.id },
        include: { message: true },
      })
      const userRequest = db.user.findUnique({ where: { id: ctx.session.userId ?? undefined } })
      const [reaction, user] = await db.$transaction([reactionRequest, userRequest])
      if (!reaction || !user) throw new NotFoundError()

      if (reaction.userId !== user.id) return false

      const channels = await getUserChannels({ user })

      return !!channels.find((channel) => channel.id === reaction?.message?.slackChannelId)
    })
    can("read", "reaction")
  }
}
