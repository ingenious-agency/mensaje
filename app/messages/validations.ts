import * as z from "zod"

export const CreateMessageInput = z.object({
  title: z.string().min(5),
  body: z.string().min(200),
  slackChannelId: z.string().refine((arg) => {
    return !arg.match(/Slack channel/)
  }, "Please select a channel"),
})
export type CreateMessageInputType = z.infer<typeof CreateMessageInput>

export const UpdateMessageInput = z.object({
  title: z.string().min(5).optional(),
  body: z.string().min(200).optional(),
})
export type UpdateMessageInputType = z.infer<typeof UpdateMessageInput>
