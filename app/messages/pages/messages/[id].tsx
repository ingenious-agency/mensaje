import { BlitzPage, Link, useParam, useQuery, useSession } from "blitz"
import Markdown from "markdown-to-jsx"
import getMessage from "app/messages/queries/getMessage"
import { Suspense } from "react"
import SlackChannel, { SlackChannelFallback } from "app/messages/components/slack-channel"
import Reactions from "app/messages/components/reactions"
import BottomBar from "app/components/bottom-bar"
import LinkButton from "app/components/LinkButton"

const ShowMessage: BlitzPage = () => {
  const id = useParam("id", "string")
  const session = useSession()
  const [message] = useQuery(getMessage, { where: { id } })

  return (
    <div className="max-w-3xl m-auto mt-9">
      <img src="/logo-white.svg" alt="Mensaje Logo" className="mb-8" />

      <div className="text-xss mb-4">
        {message.user?.name} on{" "}
        <Suspense fallback={<SlackChannelFallback />}>
          <SlackChannel channelId={message.slackChannelId} />
        </Suspense>
      </div>

      <h1 className="text-4xl font-medium mb-6">{message.title}</h1>
      <Markdown
        options={{
          forceWrapper: true,
          overrides: {
            a: {
              props: {
                className: "leading-relaxed text-blue-default hover:underline",
              },
            },
            p: {
              props: {
                className: "text-light",
              },
            },
          },
        }}
      >
        {message.body}
      </Markdown>
      <BottomBar>
        <div>
          <Suspense fallback="Loading reactions">
            <Reactions messageId={message.id} userId={session.userId} />
          </Suspense>
        </div>
        {message.userId === session.userId && (
          <Link href={`/messages/${message.id}/edit`}>
            <LinkButton>Edit</LinkButton>
          </Link>
        )}
      </BottomBar>
    </div>
  )
}

export default ShowMessage
