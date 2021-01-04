import { BlitzPage, Link, useParam, useQuery, useSession } from "blitz"
import getMessage from "app/messages/queries/getMessage"
import { Suspense } from "react"
import SlackChannel from "app/messages/components/slack-channel"
import Reactions from "app/messages/components/reactions"

const ShowMessage: BlitzPage = () => {
  const id = useParam("id", "string")
  const session = useSession()
  const [message] = useQuery(getMessage, { where: { id } })

  return (
    <div>
      <h1>{message.title}</h1>
      <p>{message.body}</p>
      <p>
        {message.userId === session.userId && (
          <Link href={`/messages/${message.id}/edit`}>
            <a>Edit</a>
          </Link>
        )}
      </p>
      <Suspense fallback="#channel">
        <SlackChannel channelId={message.slackChannelId} />
      </Suspense>
      <Suspense fallback="Loading reactions">
        <Reactions messageId={message.id} userId={session.userId} />
      </Suspense>
    </div>
  )
}

export default ShowMessage
