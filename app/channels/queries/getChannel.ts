import { Ctx } from "blitz"
import db from "db"
import { WebAPICallResult, WebClient } from "@slack/web-api"
import { Channel } from "../types"

export type GetChannelInput = { where: { id: string } }
export type Result = WebAPICallResult & { channel: Channel }

export default async function getChannel({ where }: GetChannelInput, ctx: Ctx): Promise<Result> {
  ctx.session.authorize()

  const user = await db.user.findFirst({ where: { id: ctx.session.userId } })

  const web = new WebClient(user?.slackAccessToken)

  const channel = (await web.conversations.info({ channel: where.id })) as Result

  return channel
}
