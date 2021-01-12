import Form, { FORM_ERROR } from "app/components/Form"
import LabeledTextField from "app/components/LabeledTextField"
import LabeledTextArea from "app/components/LabeledTextArea"
import createMessage from "app/messages/mutations/createMessage"
import { CreateMessageInput } from "app/messages/validations"
import { BlitzPage, useMutation, useRouter, useRouterQuery } from "blitz"
import { Suspense } from "react"
import SlackChannelPicker from "app/messages/components/slack-channel-picker"

const NewMessage: BlitzPage = () => {
  const router = useRouter()
  const query = useRouterQuery()
  const channel = Object.keys(query).includes("channel")
    ? (query["channel"] as string)
    : "Slack channel"
  const [createMessageMutation] = useMutation(createMessage)

  return (
    <div className="max-w-3xl m-auto mt-9">
      <img src="/logo-white.svg" alt="Mensaje Logo" />
      <Form
        submitText="Create Message"
        schema={CreateMessageInput}
        initialValues={{ title: "", body: "", slackChannelId: channel }}
        onSubmit={async (values) => {
          try {
            const message = await createMessageMutation({ data: values })
            router.push(`/messages/${message.id}`)
          } catch (error) {
            return { [FORM_ERROR]: error.toString() }
          }
        }}
        bottomContent={() => {
          return (
            <Suspense fallback={<p>Loading channels</p>}>
              <SlackChannelPicker name="slackChannelId" label="Slack channel" />
            </Suspense>
          )
        }}
      >
        <LabeledTextField name="title" label="Title" placeholder="Title" />
        <LabeledTextArea name="body" label="Body" placeholder="Body" />
      </Form>
    </div>
  )
}

export default NewMessage
