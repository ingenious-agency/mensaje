import { useCurrentUser } from "app/hooks/useCurrentUser"
import { useMutation } from "blitz"
import logout from "app/auth/mutations/logout"

export default function LoginButton() {
  const user = useCurrentUser()
  const [logoutMutation] = useMutation(logout)
  return (
    <div className="text-white absolute top-4 right-4">
      {user ? `${user?.name || user?.email} | ` : <a href="/api/auth/slack">Login</a>}
      {user && <button onClick={async () => await logoutMutation()}>Logout</button>}
    </div>
  )
}
