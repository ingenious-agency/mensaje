import getChannel from "app/channels/queries/getChannel"
import { useQuery } from "blitz"

export type SlackChannelProps = JSX.IntrinsicElements["small"] & { channelId: string }
export default function SlackChannel({ className = "", channelId, ...rest }: SlackChannelProps) {
  const [response] = useQuery(getChannel, { where: { id: channelId } }, { enabled: !!channelId })
  return (
    <small className={`text-xss ${className}`} {...rest}>
      <span className="bg-gray-300 py-1 px-2">#{response.channel.name}</span>
    </small>
  )
}

export function SlackChannelFallback({ className = "", ...rest }: JSX.IntrinsicElements["small"]) {
  return (
    <small className={`text-xss ${className}`} {...rest}>
      <span className="bg-gray-300 py-1 px-2">loading...</span>
    </small>
  )
}
