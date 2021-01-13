import ReactionList from "app/reactions/components/reaction-list"
import createReaction from "app/reactions/mutations/createReaction"
import deleteReaction from "app/reactions/mutations/deleteReaction"
import getReactions from "app/reactions/queries/getReactions"
import { emojis } from "app/reactions/types"
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
  const [myReactions, { refetch, setQueryData }] = useQuery(
    getReactions,
    getReactionsCondition({ messageId, userId, include: true }),
    { enabled: !!userId }
  )
  const [createReactionMutation] = useMutation(createReaction)
  const [deleteReactionMutation] = useMutation(deleteReaction)
  return (
    <>
      {
        <ReactionList
          mine={myReactions?.reactions}
          others={othersReactions?.reactions}
          onCreate={async (emoji) => {
            setQueryData(
              {
                ...myReactions,
                reactions: myReactions.reactions.concat([
                  {
                    emoji: emoji,
                    alt: emojis[emoji],
                    id: "",
                    messageId,
                    userId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                ]),
                count: myReactions.count + 1,
              },
              { refetch: false }
            )
            await createReactionMutation({
              data: {
                message: { connect: { id: messageId } },
                emoji: emoji,
                alt: emojis[emoji],
              },
            })
            await refetch()
          }}
          onRemove={async (emoji) => {
            const reaction = myReactions.reactions.find((reaction) => reaction.emoji === emoji)
            if (reaction) {
              setQueryData(
                {
                  ...myReactions,
                  reactions: myReactions.reactions.filter((item) => item.id !== reaction?.id),
                  count: myReactions.count - 1,
                },
                { refetch: false }
              )
              await deleteReactionMutation({
                where: { id: reaction.id },
              })
              await refetch()
            }
          }}
        />
      }
    </>
  )
}
