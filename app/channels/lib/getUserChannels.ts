import { User } from "@prisma/client"
import { WebAPICallResult, WebClient } from "@slack/web-api"
import { Channel } from "../types"

export default async function getUserChannels({ user }: { user: User }) {
  const web = new WebClient(user.slackAccessToken)
  const result = (await web.users.conversations({
    user: user?.slackUserId,
    types: "public_channel,private_channel",
  })) as WebAPICallResult & { channels: Channel[] }

  return result.channels
}
