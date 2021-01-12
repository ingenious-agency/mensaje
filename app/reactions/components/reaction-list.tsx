import { Reaction } from "@prisma/client"
import Button from "app/components/Button"
import { EmojiKey, emojis } from "app/reactions/types"
import { groupBy, pipe, pick, size, compact, curry } from "lodash/fp"

export type ReactionListProps = {
  mine?: Reaction[]
  others?: Reaction[]
  onRemove: (emoji: EmojiKey) => void
  onCreate: (emoji: EmojiKey) => void
}

export type ReactionRecord = Record<EmojiKey, { count: number; hasMine: boolean; title: string }>

export default function ReactionList({
  mine = [],
  others = [],
  onRemove,
  onCreate,
}: ReactionListProps) {
  const count = (key) =>
    pipe(
      compact,
      groupBy("emoji"),
      pick(key),
      size,
      curry((size: number) => (size > 0 ? `${size}` : null))
    )
  return (
    <div className="flex">
      {Object.keys(emojis).map((key: EmojiKey) => {
        const amount = count(key)([...mine, ...others])
        const selected = mine?.map((reaction) => reaction.emoji).includes(key)
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
              if (mine?.map((reaction) => reaction.emoji).includes(key)) {
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
