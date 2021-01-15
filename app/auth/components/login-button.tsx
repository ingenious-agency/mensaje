import { useCurrentUser } from "app/hooks/useCurrentUser"
import { useMutation, useRouter } from "blitz"
import logout from "app/auth/mutations/logout"

export default function LoginButton() {
  const user = useCurrentUser()
  const router = useRouter()
  const [logoutMutation] = useMutation(logout)
  return (
    <div className="text-white absolute top-2 right-2 text-xs">
      {user ? (
        `${user?.name || user?.email} | `
      ) : (
        <a href={`/api/auth/slack?redirectUrl=${router.asPath}`}>Login</a>
      )}
      {user && <button onClick={async () => await logoutMutation()}>Logout</button>}
    </div>
  )
}
