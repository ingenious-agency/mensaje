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
    <div className="lg:max-w-3xl lg:m-auto lg:mt-9 m-8">
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
                className: "text-light mb-4",
              },
            },
            h1: {
              props: {
                className: "text-base font-medium mb-2 mt-8",
              },
            },
            li: {
              props: {
                className: "list-disc list-inside",
              },
            },
            code: {
              props: {
                className: "font-mono px-1 text-sm",
                style: {
                  color: "#FF7E32",
                },
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
