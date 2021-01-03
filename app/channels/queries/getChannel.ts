import { Ctx } from "blitz"
import { WebAPICallResult, WebClient } from "@slack/web-api"
import { Channel } from "../types"

export type GetChannelInput = { where: { id: string } }
export type Result = WebAPICallResult & { channel: Channel }

export default async function getChannel({ where }: GetChannelInput, ctx: Ctx): Promise<Result> {
  ctx.session.authorize()

  const web = new WebClient(process.env.SLACK_TOKEN)

  const channel = (await web.conversations.info({ channel: where.id })) as Result

  return channel
}
