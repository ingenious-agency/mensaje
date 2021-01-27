import { BlitzPage, useRouter } from "blitz"
import { Suspense, useEffect } from "react"
import LoginButton from "app/auth/components/login-button"
import { useCurrentUser } from "app/hooks/useCurrentUser"

const Home: BlitzPage = () => {
  const router = useRouter()
  useEffect(() => {
    if (localStorage && localStorage.getItem("backTo")) {
      const backTo = localStorage.getItem("backTo") as string
      localStorage.removeItem("backTo")
      router.push(backTo)
    }
  }, [router])
  return (
    <main className="flex flex-col justify-center items-center h-screen bg-black">
      <Suspense
        fallback={<p className="text-white absolute top-4 right-4 text-xs">Loading your name</p>}
      >
        <LoginButton />
      </Suspense>
      <img className="w-44 h-44" src="/logo.svg" alt="Mensaje Logo" />
      <Suspense
        fallback={<p className="text-white text-xs mt-8">Loading your welcome message...</p>}
      >
        <WelcomeMessage />
      </Suspense>
    </main>
  )
}

function WelcomeMessage() {
  const user = useCurrentUser()
  const router = useRouter()
  return (
    <p className="text-white text-xs mt-8">
      Welcome to Mensaje.{" "}
      {user ? (
        user.isInstalled ? (
          `You already have the app installed.`
        ) : (
          <>
            Please{" "}
            <a
              className="underline"
              href={`https://slack.com/oauth/v2/authorize?redirect_uri=${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/slack/install&client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID}&scope=commands&user_scope=users.profile:read,channels:read,chat:write,groups:read,reactions:write`}
            >
              install the app
            </a>{" "}
            to continue.
          </>
        )
      ) : (
        <>
          Please{" "}
          <a className="underline" href={`/api/auth/slack?redirectUrl=${router.asPath}`}>
            login
          </a>{" "}
          to continue.
        </>
      )}
    </p>
  )
}

export default Home
