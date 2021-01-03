import { BlitzPage, useMutation, useParam, useQuery, useSession } from "blitz"
import getMessage from "app/messages/queries/getMessage"
import getChannel from "app/channels/queries/getChannel"
import ReactionPicker from "app/reactions/components/reaction-picker"
import Reactions from "app/reactions/components/reactions"
import createReaction from "app/reactions/mutations/createReaction"
import getReactions from "app/reactions/queries/getReactions"
import deleteReaction from "app/reactions/mutations/deleteReaction"

const getReactionsCondition = ({ messageId, userId, include }) => ({
  where: {
    message: { id: { equals: messageId } },
    user: { id: { [include ? "equals" : "not"]: userId } },
  },
})

const ShowMessage: BlitzPage = () => {
  const id = useParam("id", "string")
  const session = useSession()
  const [message] = useQuery(getMessage, { where: { id } })
  const [response] = useQuery(
    getChannel,
    { where: { id: message.slackChannelId } },
    { enabled: !!message }
  )
  const [othersReactions] = useQuery(
    getReactions,
    getReactionsCondition({ messageId: message.id, userId: session.userId, include: false }),
    { enabled: !!session.userId }
  )
  const [myReactions, { refetch: refetchMine }] = useQuery(
    getReactions,
    getReactionsCondition({ messageId: message.id, userId: session.userId, include: true }),
    { enabled: !!session.userId }
  )
  const [createReactionMutation] = useMutation(createReaction)
  const [deleteReactionMutation] = useMutation(deleteReaction)
  return (
    <div>
      <h1>{message.title}</h1>
      <p>{message.body}</p>
      <small>on #{response.channel.name}</small>
      {myReactions && othersReactions && (
        <>
          <Reactions
            mine={myReactions.reactions}
            others={othersReactions.reactions}
            onRemove={async (emoji) => {
              const reaction = myReactions.reactions.find((reaction) => reaction.emoji === emoji)
              if (reaction) {
                await deleteReactionMutation({
                  where: { id: reaction.id },
                })
                await refetchMine()
              }
            }}
          />
          <ReactionPicker
            onChange={async (emoji) => {
              await createReactionMutation({
                data: {
                  message: { connect: { id: message.id } },
                  emoji: Object.keys(emoji)[0],
                  alt: Object.values(emoji)[0],
                },
              })
              refetchMine()
            }}
          />
        </>
      )}
    </div>
  )
}

export default ShowMessage
