import { BlitzPage, useRouterQuery } from "blitz"
import { Suspense } from "react"
import LoginButton from "app/auth/components/login-button"

const Home: BlitzPage = () => {
  const query: { installSuccess?: number } = useRouterQuery()

  return (
    <main className="flex justify-center items-center h-screen bg-black">
      <Suspense
        fallback={<p className="text-white absolute top-4 right-4 text-xs">Loading your name</p>}
      >
        <LoginButton />
      </Suspense>
      <img src="/logo.svg" alt="Mensaje Logo" />
      {query.installSuccess && (
        <p className="text-white absolute bottom-1/2 right-1/3 text-xs">
          Thanks for installing Mensaje
        </p>
      )}
    </main>
  )
}

export default Home
