import getChannels from "app/channels/queries/getChannels"
import LabeledSelect from "app/components/LabeledSelect"
import { useQuery } from "blitz"

export default function SlackChannelPicker({ name, label }: { name: string; label: string }) {
  const [channels] = useQuery(getChannels, {})
  return (
    <LabeledSelect
      name={name}
      label={label}
      data={channels.channels as any}
      displayProperty="name"
      valueProperty="id"
      showErrorMessage={false}
    />
  )
}
