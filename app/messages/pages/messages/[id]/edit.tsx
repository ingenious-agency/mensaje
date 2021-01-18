import Form, { FORM_ERROR } from "app/components/Form"
import LabeledTextField from "app/components/LabeledTextField"
import LabeledTextArea from "app/components/LabeledTextArea"
import { UpdateMessageInput } from "app/messages/validations"
import { BlitzPage, useMutation, useParam, useQuery, useRouter } from "blitz"
import updateMessage from "app/messages/mutations/updateMessage"
import getMessage from "app/messages/queries/getMessage"

const EditMessage: BlitzPage = () => {
  const router = useRouter()
  const id = useParam("id", "string")
  const [message, { setQueryData }] = useQuery(getMessage, { where: { id } })
  const [updateMessageMutation, { isLoading }] = useMutation(updateMessage)
  return (
    <div className="lg:max-w-3xl lg:m-auto lg:mt-9 m-8">
      <img src="/logo-white.svg" alt="Mensaje Logo" />
      <Form
        isLoading={isLoading}
        submitText="Update Message"
        schema={UpdateMessageInput}
        initialValues={message}
        onSubmit={async (values) => {
          try {
            const message = await updateMessageMutation({ data: values, where: { id } })
            setQueryData(message)
            router.push(`/messages/${message.id}`)
          } catch (error) {
            return { [FORM_ERROR]: error.toString() }
          }
        }}
      >
        <LabeledTextField name="title" label="Title" placeholder="Title" />
        <LabeledTextArea name="body" label="Body" placeholder="Body" />
      </Form>
    </div>
  )
}

export default EditMessage
