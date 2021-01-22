import AvatarList, { Avatar, AvatarType } from "app/components/avatar-list"

export type UserSiderProps = React.ComponentProps<typeof AvatarList>

function UserList({ users }) {
  return (
    <div>
      {users?.map((avatar: AvatarType, i) => (
        <div key={i} className="flex items-center first:pt-0 pt-8">
          <Avatar className="" avatar={avatar} size="big"></Avatar>
          <span className="pl-3" style={{ color: "#999999" }}>
            {avatar.name}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function UserSider({ list, handleOnClick, ...rest }: UserSiderProps) {
  return (
    <>
      <div
        aria-hidden="true"
        onClick={() => handleOnClick()}
        className={`fixed top-0 lg:right-1/4 md:right-1/3 right-2/3 h-7 w-7 rounded-full flex items-center justify-center cursor-pointer mr-2 mt-2`}
        style={{ background: "#F2F2F2" }}
      >
        <img src="/close.png" alt="Close" />
      </div>
      <div className="container z-10 lg:w-1/4 md:w-1/3 w-2/3 bg-black p-5 fixed top-0 right-0 max-h-full overflow-y-scroll">
        <UserList users={list} />
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar {
          background-color: black;
        }

        ::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.5);
        }

        @media (min-width: 1024px) {
          #__next {
            width: 75%;
          }
        }
      `}</style>

      <style jsx scoped>{`
        .container::-webkit-scrollbar-thumb {
          background-color: transparent;
        }
      `}</style>
    </>
  )
}
