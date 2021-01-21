import { take, slice } from "lodash"

export type AvatarListProps = {
  list?: { name: string; initials: string; pictureUrl?: string }[]
  toggleUserSlider: Function
} & JSX.IntrinsicElements["div"]

export function getColor(string: string) {
  const code = string.charCodeAt(0)
  if (code <= 57) return "red"
  if (code <= 69) return "orange"
  if (code <= 74) return "green"
  if (code <= 79) return "blue"
  if (code <= 84) return "sky-blue"
  if (code <= 90) return "purple"
}

export default function AvatarList({
  className = "",
  list,
  toggleUserSlider = () => {},
  ...rest
}: AvatarListProps) {
  if (!list) return null

  const avatars = take(list, 5)
  const remaining = slice(list, 5)
  return (
    <div className={`${className}`} {...rest}>
      <div className="flex">
        {avatars.map((avatar) => {
          if (avatar.pictureUrl) {
            return (
              <img
                key={avatar.name}
                src={avatar.pictureUrl}
                className="h-7 w-7 bg-contain inline rounded-full -ml-2 first:ml-0 border-2 border-white"
                alt={avatar.name}
              />
            )
          } else {
            return (
              <div
                key={avatar.name}
                title={avatar.name}
                className={`h-7 w-7 text-xss rounded-full flex items-center justify-center cursor-default -ml-2 first:ml-0 bg-gradient-to-t border-2 border-white text-white from-avatars-${getColor(
                  avatar.initials
                )}-start to-avatars-${getColor(avatar.initials)}-end`}
              >
                {avatar.initials}
              </div>
            )
          }
        })}
        {remaining && remaining.length > 0 && (
          <div
            aria-hidden="true"
            onClick={() => toggleUserSlider(remaining)}
            title={remaining.map((avatar) => avatar.name).join(", ")}
            className={`h-7 w-7 text-xss rounded-full flex items-center justify-center text-gray-700 cursor-default -ml-2 first:ml-0 border-2 border-white bg-gray-350 cursor-pointer`}
          >
            +{remaining.length}
          </div>
        )}
      </div>
    </div>
  )
}
