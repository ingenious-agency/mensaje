import { Reaction } from "@prisma/client"
import { EmojiKey, emojis } from "app/reactions/types"

export type ReactionsProps = {
  mine: Reaction[]
  others: Reaction[]
  onRemove: (emoji: EmojiKey) => void
}

export type ReactionRecord = Record<EmojiKey, { count: number; hasMine: boolean; title: string }>

export default function Reactions({ mine, others, onRemove }: ReactionsProps) {
  const reduce = (hasMine) => (acc, item) => {
    if (acc[item.emoji]) {
      acc[item.emoji].count = acc[item.emoji].count + 1
      acc[item.emoji].hasMine = hasMine
    } else {
      acc[item.emoji] = { hasMine, count: 1, title: emojis[item.emoji] }
    }
    return acc
  }
  const list: ReactionRecord = mine.reduce(reduce(true), others.reduce(reduce(false), {}))

  return (
    <ul>
      {Object.keys(list).map((key: EmojiKey) => (
        <li key={key}>
          {key} - {list[key].count} -{" "}
          {list[key].hasMine && <button onClick={() => onRemove(key)}>-</button>}
        </li>
      ))}
    </ul>
  )
}
