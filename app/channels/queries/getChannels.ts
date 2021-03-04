import { Ctx } from "blitz"
import db from "db"
import { WebClient } from "@slack/web-api"

export type GetChannelsInput = { limit?: number; cursor?: string }

export default async function getChannels({ limit = 300, cursor }: GetChannelsInput, ctx: Ctx) {
  ctx.session.$authorize()

  const user = await db.user.findFirst({ where: { id: ctx.session.userId } })

  const web = new WebClient(user?.slackAccessToken)

  const channels = await web.conversations.list({
    cursor,
    limit,
    types: "public_channel,private_channel",
  })

  return channels
}
