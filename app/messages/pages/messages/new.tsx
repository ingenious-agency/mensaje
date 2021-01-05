import Form, { FORM_ERROR } from "app/components/Form"
import LabeledTextField from "app/components/LabeledTextField"
import LabeledTextArea from "app/components/LabeledTextArea"
import createMessage from "app/messages/mutations/createMessage"
import { CreateMessageInput } from "app/messages/validations"
import { BlitzPage, useMutation, useRouter } from "blitz"
import { Suspense } from "react"
import SlackChannelPicker from "app/messages/components/slack-channel-picker"

const NewMessage: BlitzPage = () => {
  const router = useRouter()
  const [createMessageMutation] = useMutation(createMessage)

  return (
    <div>
      <Form
        submitText="Create Message"
        schema={CreateMessageInput}
        initialValues={{ title: "", body: "", slackChannelId: "" }}
        onSubmit={async (values) => {
          try {
            const message = await createMessageMutation({ data: values })
            router.push(`/messages/${message.id}`)
          } catch (error) {
            return { [FORM_ERROR]: error.toString() }
          }
        }}
      >
        <LabeledTextField name="title" label="Title" placeholder="Title" />
        <LabeledTextArea name="body" label="Body" placeholder="Body" />
        <Suspense fallback={<p>Loading channels</p>}>
          <SlackChannelPicker name="slackChannelId" label="Slack channel" />
        </Suspense>
      </Form>
    </div>
  )
}

export default NewMessage
