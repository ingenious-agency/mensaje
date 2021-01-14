import createReaction from "app/reactions/mutations/createReaction"
import deleteReaction from "app/reactions/mutations/deleteReaction"
import getReactions from "app/reactions/queries/getReactions"
import { EmojiKey, emojis } from "app/reactions/types"
import { useMutation, useQuery, setQueryData } from "blitz"
import { groupBy, pipe, pick, size, compact, curry } from "lodash/fp"

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
  const [myReactions, { refetch }] = useQuery(
    getReactions,
    getReactionsCondition({ messageId, userId, include: true }),
    { enabled: !!userId }
  )
  const [createReactionMutation] = useMutation(createReaction)
  const [deleteReactionMutation] = useMutation(deleteReaction)

  const count = (key) =>
    pipe(
      compact,
      groupBy("emoji"),
      pick(key),
      size,
      curry((size: number) => (size > 0 ? `${size}` : null))
    )

  const onCreate = async (emoji) => {
    try {
      const queryData = {
        ...myReactions,
        reactions: myReactions.reactions.concat([
          {
            emoji: emoji,
            alt: emojis[emoji],
            id: new Date().getTime().toString(),
            messageId,
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),
        count: myReactions.count + 1,
      }
      setQueryData(
        getReactions,
        getReactionsCondition({ messageId, userId, include: true }),
        queryData,
        { refetch: false }
      )
      await createReactionMutation({
        data: {
          message: { connect: { id: messageId } },
          emoji: emoji,
          alt: emojis[emoji],
        },
      })
    } catch (e) {
      console.error(e)
    } finally {
      await refetch()
    }
  }

  const onRemove = async (emoji) => {
    const reaction = myReactions.reactions.find((reaction) => reaction.emoji === emoji)
    if (!reaction) return

    try {
      const queryData = {
        ...myReactions,
        reactions: myReactions.reactions.filter((item) => item.id !== reaction?.id),
        count: myReactions.count - 1,
      }
      setQueryData(
        getReactions,
        getReactionsCondition({ messageId, userId, include: true }),
        queryData,
        { refetch: false }
      )
      await deleteReactionMutation({
        where: { id: reaction.id },
      })
    } catch (e) {
      console.error(e)
    } finally {
      await refetch()
    }
  }

  return (
    <div className="flex">
      {Object.keys(emojis).map((key: EmojiKey) => {
        const mine = myReactions?.reactions ?? []
        const others = othersReactions?.reactions ?? []
        const amount = count(key)([...mine, ...others])
        const selected = mine.map((reaction) => reaction.emoji).includes(key)
        return (
          <button
            key={key}
            style={{
              width: selected ? 51 : 39,
              height: 26,
              borderRadius: selected ? 100 : 76.5,
              outline: 0,
            }}
            className={`flex items-center justify-center mr-2 cursor-pointer hover:bg-gray-350 border-none ${
              selected && "bg-gray-350"
            }`}
            onClick={() => {
              if (myReactions.reactions?.map((reaction) => reaction.emoji).includes(key)) {
                onRemove(key)
              } else {
                onCreate(key)
              }
            }}
          >
            {key}{" "}
            {amount && (
              <small style={{ color: "#4D4D4D" }} className="text-xs ml-2">
                {amount}
              </small>
            )}
          </button>
        )
      })}
    </div>
  )
}
