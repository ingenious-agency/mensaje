import * as z from "zod"

export const CreateMessageInput = z.object({
  title: z.string(),
  body: z.string(),
  slackChannelId: z.string(),
})
export type CreateMessageInputType = z.infer<typeof CreateMessageInput>

export const UpdateMessageInput = z.object({
  title: z.string(),
  body: z.string(),
})
export type UpdateMessageInputType = z.infer<typeof UpdateMessageInput>
