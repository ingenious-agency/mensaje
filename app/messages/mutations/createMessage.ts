import { Ctx } from "blitz"
import db, { Prisma } from "db"
import { WebClient } from "@slack/web-api"
import { MessageInput } from "app/messages/validations"

type CreateMessageInput = Pick<Prisma.MessageCreateArgs, "data">
export default async function createMessage({ data }: CreateMessageInput, ctx: Ctx) {
  ctx.session.authorize()

  const { title, body, slackChannelId } = MessageInput.parse(data)

  const message = await db.message.create({
    data: { title, body, slackChannelId, user: { connect: { id: ctx.session.userId } } },
  })

  const web = new WebClient(process.env.SLACK_TOKEN)

  const user = await db.user.findUnique({ where: { id: ctx.session.userId } })

  await web.chat.postMessage({
    text: "",
    channel: slackChannelId,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${user?.name ?? user?.email} has published a new post`,
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
          text: `${body.substring(0, 250)}...`,
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
          url: `${process.env.WEBSITE_URL}/messages/${message.id}`,
          action_id: "button-action",
        },
      },
    ],
  })

  return message
}
