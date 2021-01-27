import db from "db"
import { CronJob } from "quirrel/blitz"
import { WebAPICallResult, WebClient } from "@slack/web-api"
import toSlackMarkdown from "slackify-markdown"

function buildTitle({ name }: { name: string }) {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Hello ${name}, these are the messages you've missed yesterday`,
      },
    },
    {
      type: "divider",
    },
  ]
}

function buildMessage({ title, body }: { title: string; body: string }) {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*${title}*\n${toSlackMarkdown(`${body.substring(0, 150)}...`)}`,
    },
  }
}

function buildActions({ id }: { id: string }) {
  return {
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Read it",
          emoji: true,
        },
        value: "click_me_123",
        url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/messages/${id}`,
      },
    ],
  }
}

export default CronJob(
  "api/slack/inbox",
  "0 10 * * 0-5", // Every day of the week at 10am
  async (_job) => {
    try {
      const web = new WebClient(process.env.SLACK_TOKEN)
      const users = await db.user.findMany()

      for (let user of users) {
        // Gets the already seen messages
        const viewed = await db.messageView.findMany({
          where: { userId: user.id },
          select: { messageId: true },
        })
        const viewedIds = viewed.map((v) => v.messageId)

        // Gets user's channels
        const channelsResponse = (await web.users.conversations({
          token: user.slackAccessToken,
          types: "public_channel,private_channel",
          user: user.slackUserId,
        })) as WebAPICallResult & { channels: { id: string }[] }

        if (!channelsResponse.ok) continue

        const channelIds = channelsResponse.channels.map((channel) => channel.id)

        const missing = await db.message.findMany({
          where: { id: { notIn: viewedIds }, slackChannelId: { in: channelIds } },
          select: { title: true, body: true, id: true },
        })

        if (missing.length === 0) continue

        const conversation = (await web.conversations.open({
          users: user.slackUserId,
        })) as WebAPICallResult & { channel: { id: string } }

        if (!conversation.ok) continue

        const blocks = buildTitle({ name: user.name ?? user.email })

        for (let { title, body, id } of missing) {
          blocks.push(buildMessage({ title, body }))
          blocks.push(buildActions({ id }))
        }

        web.chat.postMessage({ channel: conversation.channel.id, blocks, text: "" })
      }
    } catch (e) {
      console.error(e)
    }
  }
)
