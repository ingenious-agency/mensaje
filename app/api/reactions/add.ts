import { WebClient } from "@slack/web-api"
import { Queue } from "quirrel/blitz"

export type AddType = {
  name: string
  timestamp: string
  channel: string
  userToken: string
}

export default Queue<AddType>(
  "api/reactions/add",
  async ({ name, timestamp, channel, userToken }) => {
    const web = new WebClient(userToken)
    web.reactions.add({ name, timestamp, channel })
  }
)
