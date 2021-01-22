import Form, { FORM_ERROR } from "app/components/Form"
import LabeledTextField from "app/components/LabeledTextField"
import createMessage from "app/messages/mutations/createMessage"
import { CreateMessageInput } from "app/messages/validations"
import { BlitzPage, useMutation, useRouter, useRouterQuery } from "blitz"
import { Suspense } from "react"
import SlackChannelPicker from "app/messages/components/slack-channel-picker"
import LabeledMarkDownField from "app/components/labeled-markdown"

const NewMessage: BlitzPage = () => {
  const router = useRouter()
  const query = useRouterQuery()
  const channel = Object.keys(query).includes("channel")
    ? (query["channel"] as string)
    : "Slack channel"
  const [createMessageMutation, { isLoading }] = useMutation(createMessage)

  return (
    <div className="lg:max-w-3xl lg:m-auto lg:mt-9 m-8">
      <img className="w-44 h-44" src="/logo-white.svg" alt="Mensaje Logo" />
      <Form
        isLoading={isLoading}
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
        <LabeledMarkDownField name="body" label="Body" placeholder="Body" />
      </Form>
    </div>
  )
}

export default NewMessage
