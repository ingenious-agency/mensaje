import Form, { FORM_ERROR } from "app/components/Form"
import { LabeledSelect } from "app/components/LabeledSelect"
import LabeledTextField from "app/components/LabeledTextField"
import createMessage from "app/messages/mutations/createMessage"
import getChannels from "app/channels/queries/getChannels"
import { MessageInput } from "app/messages/validations"
import { BlitzPage, useMutation, useQuery } from "blitz"

const NewMessage: BlitzPage = () => {
  const [createMessageMutation] = useMutation(createMessage)
  const [channels] = useQuery(getChannels, {})
  return (
    <div>
      <Form
        submitText="Create Message"
        schema={MessageInput}
        initialValues={{ title: "", body: "", slackChannelId: "" }}
        onSubmit={async (values) => {
          try {
            await createMessageMutation({ data: values })
          } catch (error) {
            return { [FORM_ERROR]: error.toString() }
          }
        }}
      >
        <LabeledTextField name="title" label="Title" placeholder="Title" />
        <LabeledTextField name="body" label="Body" placeholder="Body" />
        <LabeledSelect
          name="slackChannelId"
          label="Slack channel"
          data={channels.channels as any}
          displayProperty="name"
          valueProperty="id"
        />
      </Form>
    </div>
  )
}

export default NewMessage
