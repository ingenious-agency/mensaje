import { WebAPICallResult, WebClient } from "@slack/web-api"
import { Channel } from "app/channels/types"
import { AuthorizationError, Ctx, NotFoundError } from "blitz"
import db, { Prisma } from "db"

type GetMessageInput = Pick<Prisma.FindFirstMessageArgs, "where" | "include">

export default async function getMessage({ where }: GetMessageInput, ctx: Ctx) {
  ctx.session.authorize()
  const message = await db.message.findFirst({
    where,
    include: { user: true, views: { include: { user: true } } },
  })
  if (!message) throw new NotFoundError()

  const member = await isMember(ctx.session.userId, message?.slackChannelId)
  if (!member) throw new AuthorizationError()

  return message
}

async function isMember(userId, channelId) {
  const user = await db.user.findUnique({ where: { id: userId } })
  const web = new WebClient(user?.slackAccessToken)
  const result = (await web.users.conversations({
    user: user?.slackUserId,
    types: "public_channel,private_channel",
  })) as WebAPICallResult & { channels: Channel[] }

  return !!result.channels.find((channel) => channel.id === channelId)
}
