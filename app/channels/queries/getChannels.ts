import { Ctx } from "blitz"
import { WebClient } from "@slack/web-api"

export type GetChannelsInput = { limit?: number; cursor?: string }

export default async function getChannels({ limit = 200, cursor }: GetChannelsInput, ctx: Ctx) {
  ctx.session.authorize()

  const web = new WebClient(process.env.SLACK_TOKEN)

  const channels = await web.conversations.list({ cursor, limit })

  return channels
}
