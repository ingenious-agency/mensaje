import { WebAPICallResult, WebClient } from "@slack/web-api"
import { Channel } from "app/channels/types"
import { AuthorizationError, Ctx, NotFoundError } from "blitz"
import db, { Prisma } from "db"

type GetMessageInput = Pick<Prisma.FindFirstMessageArgs, "where">

export default async function getMessage({ where }: GetMessageInput, ctx: Ctx) {
  ctx.session.authorize()

  const message = await db.message.findFirst({ where })
  if (!message) throw new NotFoundError()

  const member = await isMember(ctx.session.userId, message?.slackChannelId)
  if (!member) throw new AuthorizationError("You are not allowed to access")

  return message
}

async function isMember(userId, channelId) {
  const user = await db.user.findUnique({ where: { id: userId } })
  const web = new WebClient(process.env.SLACK_TOKEN)
  const result = (await web.users.conversations({
    user: user?.slackUserId,
  })) as WebAPICallResult & { channels: Channel[] }

  return !!result.channels.find((channel) => channel.id === channelId)
}
