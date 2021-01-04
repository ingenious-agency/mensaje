import Form, { FORM_ERROR } from "app/components/Form"
import LabeledTextField from "app/components/LabeledTextField"
import { UpdateMessageInput } from "app/messages/validations"
import { BlitzPage, useMutation, useParam, useQuery, useRouter } from "blitz"
import updateMessage from "app/messages/mutations/updateMessage"
import getMessage from "app/messages/queries/getMessage"

const EditMessage: BlitzPage = () => {
  const router = useRouter()
  const id = useParam("id", "string")
  const [message, { refetch }] = useQuery(getMessage, { where: { id } })
  const [updateMessageMutation] = useMutation(updateMessage)
  return (
    <div>
      <Form
        submitText="Update Message"
        schema={UpdateMessageInput}
        initialValues={message}
        onSubmit={async (values) => {
          try {
            const message = await updateMessageMutation({ data: values, where: { id } })
            await refetch()
            router.push(`/messages/${message.id}`)
          } catch (error) {
            return { [FORM_ERROR]: error.toString() }
          }
        }}
      >
        <LabeledTextField name="title" label="Title" placeholder="Title" />
        <LabeledTextField name="body" label="Body" placeholder="Body" />
      </Form>
    </div>
  )
}

export default EditMessage
