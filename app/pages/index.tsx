import { BlitzPage, useMutation } from "blitz"
import logout from "app/auth/mutations/logout"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import LoginButton from "app/auth/components/login-button"

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    return (
      <>
        <button
          className="button small"
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Logout
        </button>
        <div>
          User id: <code>{currentUser.id}</code>
          <br />
          User role: <code>{currentUser.role}</code>
        </div>
      </>
    )
  } else {
    return <LoginButton />
  }
}

const Home: BlitzPage = () => {
  return (
    <div className="container">
      <main>
        <UserInfo />
      </main>
    </div>
  )
}

export default Home
