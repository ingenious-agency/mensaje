import * as z from "zod"

export const MessageInput = z.object({
  title: z.string(),
  body: z.string(),
  slackChannelId: z.string(),
})
export type MessageInputType = z.infer<typeof MessageInput>
