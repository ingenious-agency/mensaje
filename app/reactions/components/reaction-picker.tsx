import { EmojiKey, emojis } from "app/reactions/types"

export type Emoji = Record<EmojiKey, string>
export type ReactionPickerProps = {
  onChange: (emoji: Emoji) => void
}
export default function ReactionPicker({ onChange }: ReactionPickerProps) {
  return (
    <select
      onBlur={(event) =>
        onChange({ [event.target.value]: emojis[event.target.value] } as Record<EmojiKey, string>)
      }
    >
      {Object.keys(emojis).map((key) => (
        <option key={key} value={key}>
          {key}
        </option>
      ))}
    </select>
  )
}
