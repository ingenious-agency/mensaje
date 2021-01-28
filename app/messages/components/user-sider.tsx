import AvatarList, { Avatar, AvatarType } from "app/components/avatar-list"
import { useSiderContext } from "utils/contexts/sider-context"

export type UserSiderProps = React.ComponentProps<typeof AvatarList>

const ScrollbarStyles = () => (
  <div>
    <style jsx global>{`
      ::-webkit-scrollbar {
        background-color: black;
      }

      ::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.5);
      }

      body {
        overflow: hidden;
      }
    `}</style>
  </div>
)

function UserList({ users }) {
  return (
    <div className="p-5">
      {users?.map((avatar: AvatarType, i) => (
        <div key={i} className="flex items-center first:pt-0 mt-4">
          <Avatar avatar={avatar} size="big"></Avatar>
          <span className="pl-3" style={{ color: "#999999" }}>
            {avatar.name}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function UserSider({ list, ...rest }: UserSiderProps) {
  const { isSiderOpen, toggleSider } = useSiderContext()

  return (
    <>
      <div
        {...rest}
        aria-hidden="true"
        onClick={toggleSider}
        className={`${
          isSiderOpen ? "lg:left-3/4 left-1/3 -m-10" : "left-full"
        } z-10 fixed top-0 h-7 w-7 rounded-full flex items-center justify-center cursor-pointer mr-2 mt-2 transition-all duration-500`}
        style={{ background: "#F2F2F2" }}
      >
        <img src="/close.png" alt="Close" />
      </div>

      <div
        className={`container z-10 bg-black fixed top-0 bottom-0 max-h-full overflow-y-scroll transition-all duration-500 ${
          isSiderOpen ? "lg:left-3/4 left-1/3" : "left-full"
        }`}
      >
        <UserList users={list} />
      </div>

      {isSiderOpen && <ScrollbarStyles />}

      <style jsx scoped>{`
        .container::-webkit-scrollbar-thumb {
          background-color: transparent;
        }
      `}</style>
    </>
  )
}
