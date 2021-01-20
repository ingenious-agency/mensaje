import { take, slice } from "lodash"

export type AvatarListProps = {
  list?: { name: string; initials: string; pictureUrl?: string }[]
} & JSX.IntrinsicElements["div"]

function getColor(string: string) {
  const code = string.charCodeAt(0)
  if (code <= 57) return "red"
  if (code <= 69) return "orange"
  if (code <= 74) return "green"
  if (code <= 79) return "blue"
  if (code <= 84) return "sky-blue"
  if (code <= 90) return "purple"
}

export default function AvatarList({ className = "", list, ...rest }: AvatarListProps) {
  if (!list) return null

  const avatars = take(list, 5)
  const remaining = slice(list, 5)
  return (
    <div className={`${className}`} {...rest}>
      <div className="flex">
        {avatars.map((avatar, index) => {
          return (
            <div
              key={index}
              title={avatar.name}
              className={`h-6 w-6 text-xss rounded-full flex items-center justify-center text-white cursor-default -ml-2 first:ml-0 border border-white bg-gradient-to-t from-avatars-${getColor(
                avatar.initials
              )}-start to-avatars-${getColor(avatar.initials)}-end`}
            >
              {avatar.pictureUrl ? (
                <img
                  src={avatar.pictureUrl}
                  className="h-6 w-6 bg-contain inline rounded-full"
                  alt={avatar.name}
                />
              ) : (
                avatar.initials
              )}
            </div>
          )
        })}
        {remaining && remaining.length > 0 && (
          <div
            title={remaining.map((avatar) => avatar.name).join(", ")}
            className={`h-6 w-6 text-xss rounded-full flex items-center justify-center text-gray-700 cursor-default -ml-2 first:ml-0 bg-gray-350`}
          >
            +{remaining.length}
          </div>
        )}
        {}
      </div>
    </div>
  )
}
