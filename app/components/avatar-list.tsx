import { take, slice } from "lodash"
import { useSiderContext } from "utils/contexts/sider-context"

export type AvatarListProps = {
  list?: AvatarType[]
} & JSX.IntrinsicElements["div"]

export type AvatarProps = {
  avatar: AvatarType
  size?: "small" | "big"
} & JSX.IntrinsicElements["div"]

export type AvatarType = {
  name: string
  initials: string
  pictureUrl?: string
}

export function getColor(string: string) {
  const code = string.charCodeAt(0)
  if (code <= 57) return "red"
  if (code <= 69) return "orange"
  if (code <= 74) return "green"
  if (code <= 79) return "blue"
  if (code <= 84) return "sky-blue"
  if (code <= 90) return "purple"
}

export function Avatar({ avatar: { name, pictureUrl, initials }, size = "small" }: AvatarProps) {
  return (
    <>
      {pictureUrl ? (
        <img
          key={name}
          src={pictureUrl}
          className={`${
            size === "big" ? "h-9 w-9" : "h-7 w-7"
          } bg-contain inline rounded-full first:ml-0 -ml-2 select-none`}
          alt={name}
        />
      ) : (
        <div
          key={name}
          title={name}
          className={`${
            size === "big" ? "h-9 w-9" : "h-7 w-7"
          } select-none text-xss rounded-full flex items-center justify-center cursor-default first:ml-0 -ml-2 bg-gradient-to-t text-white from-avatars-${getColor(
            initials
          )}-start to-avatars-${getColor(initials)}-end`}
        >
          {initials}
        </div>
      )}
    </>
  )
}

export default function AvatarList({ className = "", list, ...rest }: AvatarListProps) {
  const { toggleSider } = useSiderContext()

  if (!list) return null

  const avatars = take(list, 5)
  const remaining = slice(list, 5)
  return (
    <div className={`${className}`} {...rest}>
      <div className="flex">
        {avatars.map((avatar: AvatarType) => {
          return <Avatar key={avatar.name} avatar={avatar} />
        })}
        {remaining && remaining.length > 0 && (
          <div
            aria-hidden="true"
            onClick={() => toggleSider()}
            title={remaining.map((avatar) => avatar.name).join(", ")}
            className={`select-none h-7 w-7 text-xss rounded-full flex items-center justify-center text-gray-700 -ml-2 first:ml-0 border-2 border-white bg-gray-350 cursor-pointer`}
          >
            +{remaining.length}
          </div>
        )}
      </div>
    </div>
  )
}
