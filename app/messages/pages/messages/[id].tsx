import { BlitzPage, Link, useMutation, useParam, useQuery, useSession } from "blitz"
import getMessage from "app/messages/queries/getMessage"
import { Suspense, useEffect } from "react"
import SlackChannel, { SlackChannelFallback } from "app/messages/components/slack-channel"
import Reactions from "app/messages/components/reactions"
import BottomBar from "app/components/bottom-bar"
import LinkButton from "app/components/LinkButton"
import createMessageView from "app/messageViews/mutations/createMessageView"
import AvatarList from "app/components/avatar-list"
import Markdown from "app/components/markdown"

const ShowMessage: BlitzPage = () => {
  const id = useParam("id", "string")
  const session = useSession()
  const [message, { refetch }] = useQuery(getMessage, { where: { id } })
  const [createMessageViewMutation] = useMutation(createMessageView)

  useEffect(() => {
    async function logView() {
      if (!(id && session.userId)) return
      await createMessageViewMutation({ messageId: id })
      refetch()
    }
    logView()
  }, [id, session.userId, refetch, createMessageViewMutation])

  return (
    <div className="lg:max-w-3xl lg:m-auto lg:mt-9 m-8">
      <img className="w-44 h-44 mb-8" src="/logo-white.svg" alt="Mensaje Logo" />

      <div className="text-xss mb-4 flex items-center">
        <span className="mr-1">{message.user?.name} on </span>
        <Suspense fallback={<SlackChannelFallback />}>
          <SlackChannel channelId={message.slackChannelId} />
        </Suspense>
        <AvatarList
          className="ml-4"
          list={message.views.map((view) => {
            const initials = view.user?.name
              ? `${view.user.name?.split(" ")[0][0]}${view.user.name?.split(" ")[1][0]}`
              : view.user.email.substr(0, 2)
            return {
              name: view.user.name as string,
              initials,
              pictureUrl: view.user.avatarUrl ?? undefined,
            }
          })}
        />
      </div>

      <h1 className="text-4xl font-medium mb-6">{message.title}</h1>
      <Markdown>{message.body}</Markdown>
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
