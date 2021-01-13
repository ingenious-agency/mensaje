import { WebClient } from "@slack/web-api"
import { Queue } from "quirrel/blitz"

export type RemoveType = {
  name: string
  timestamp: string
  channel: string
  userToken: string
}

export default Queue<RemoveType>(
  "api/reactions/remove",
  async ({ name, timestamp, channel, userToken }) => {
    const web = new WebClient(userToken)
    web.reactions.remove({ name, timestamp, channel })
  }
)
