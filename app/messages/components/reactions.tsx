import { Reaction } from "@prisma/client"
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
  return (
    <div className="flex">
      {Object.keys(emojis).map((key: EmojiKey) => {
        return <ReactionButton key={key} emoji={key} messageId={messageId} userId={userId} />
      })}
    </div>
  )
}

type ReactionButtonProps = {
  messageId: string
  userId: string
  emoji: EmojiKey
}

function ReactionButton({ messageId, userId, emoji }: ReactionButtonProps) {
  const [reactionsQuery, { refetch }] = useQuery(getReactions, {
    where: { message: { id: { equals: messageId } }, emoji },
  })
  const [createReactionMutation, { isLoading: isCreating }] = useMutation(createReaction)
  const [deleteReactionMutation, { isLoading: isDeleting }] = useMutation(deleteReaction)
  const reaction: Reaction | undefined = reactionsQuery?.reactions
    ? reactionsQuery.reactions.find((item) => item.userId === userId)
    : undefined
  return (
    <button
      style={{
        width: reaction ? 51 : 39,
        height: 26,
        borderRadius: reaction ? 100 : 76.5,
        outline: 0,
      }}
      className={`flex items-center justify-center mr-2 cursor-pointer hover:bg-gray-350 border-none ${
        reaction && "bg-gray-350"
      }`}
      disabled={isCreating || isDeleting}
      onClick={async () => {
        try {
          if (reaction !== undefined) {
            await deleteReactionMutation({
              where: { id: reaction.id },
            })
            setQueryData(
              getReactions,
              {
                where: { message: { id: { equals: messageId } }, emoji },
              },
              {
                ...reactionsQuery,
                count: reactionsQuery.count - 1,
                reactions: [...reactionsQuery.reactions.filter((item) => item.userId !== userId)],
              },
              { refetch: false }
            )
          } else {
            await createReactionMutation({
              data: {
                message: { connect: { id: messageId } },
                emoji: emoji,
                alt: emojis[emoji],
              },
            })
            setQueryData(
              getReactions,
              {
                where: { message: { id: { equals: messageId } }, emoji },
              },
              {
                ...reactionsQuery,
                count: reactionsQuery.count + 1,
                reactions: reactionsQuery.reactions.concat([
                  {
                    emoji,
                    alt: emojis[emoji],
                    id: new Date().getTime().toString(),
                    messageId,
                    userId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                ]),
              },
              { refetch: false }
            )
          }
        } catch (e) {
          console.error(e)
        }
      }}
    >
      {emoji}{" "}
      {reactionsQuery.reactions.length > 0 && (
        <small style={{ color: "#4D4D4D" }} className="text-xs ml-2">
          {reactionsQuery.reactions.length}
        </small>
      )}
    </button>
  )
}
