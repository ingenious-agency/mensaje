import { WebClient } from "@slack/web-api"
import { Queue } from "quirrel/blitz"
import db from "db"
import toSlackMarkdown from "slackify-markdown"

export type CreateType = {
  messageId: string
  body: string
  title: string
  channel: string
  userToken: string
}

export default Queue<CreateType>(
  "api/messages/create",
  async ({ messageId, body, title, channel, userToken }) => {
    const web = new WebClient(userToken)
    const slackMessage = await web.chat.postMessage({
      text: "",
      channel: channel,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: title,
            emoji: true,
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: toSlackMarkdown(`${body.substring(0, 250)}...`),
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Read the complete post*",
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "Go",
              emoji: true,
            },
            value: "click_me_123",
            url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/messages/${messageId}`,
            action_id: "button-action",
          },
        },
      ],
    })

    console.log(slackMessage.ts)

    await db.message.update({
      data: { slackTimeStamp: slackMessage.ts as string },
      where: { id: messageId },
    })
  }
)
