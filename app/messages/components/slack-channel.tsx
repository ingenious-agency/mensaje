import getChannel from "app/channels/queries/getChannel"
import { useQuery } from "blitz"

export default function SlackChannel({ channelId }: { channelId: string }) {
  const [response] = useQuery(getChannel, { where: { id: channelId } }, { enabled: !!channelId })
  return <small>on #{response.channel.name}</small>
}
