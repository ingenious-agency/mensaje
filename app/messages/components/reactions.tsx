import ReactionPicker from "app/reactions/components/reaction-picker"
import ReactionList from "app/reactions/components/reaction-list"
import createReaction from "app/reactions/mutations/createReaction"
import deleteReaction from "app/reactions/mutations/deleteReaction"
import getReactions from "app/reactions/queries/getReactions"
import { useMutation, useQuery } from "blitz"

const getReactionsCondition = ({ messageId, userId, include }) => ({
  where: {
    message: { id: { equals: messageId } },
    user: { id: { [include ? "equals" : "not"]: userId } },
  },
})

export type ReactionsProps = {
  messageId: string
  userId: string
}

export default function Reactions({ messageId, userId }: ReactionsProps) {
  const [othersReactions] = useQuery(
    getReactions,
    getReactionsCondition({ messageId, userId, include: false }),
    { enabled: !!userId }
  )
  const [myReactions, { refetch: refetchMine }] = useQuery(
    getReactions,
    getReactionsCondition({ messageId, userId, include: true }),
    { enabled: !!userId }
  )
  const [createReactionMutation] = useMutation(createReaction)
  const [deleteReactionMutation] = useMutation(deleteReaction)
  return (
    <>
      {myReactions && othersReactions && (
        <ReactionList
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
      )}
      <ReactionPicker
        onChange={async (emoji) => {
          await createReactionMutation({
            data: {
              message: { connect: { id: messageId } },
              emoji: Object.keys(emoji)[0],
              alt: Object.values(emoji)[0],
            },
          })
          await refetchMine()
        }}
      />
    </>
  )
}
