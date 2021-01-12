import { BlitzPage } from "blitz"
import { Suspense } from "react"
import LoginButton from "app/auth/components/login-button"

const Home: BlitzPage = () => {
  return (
    <main className="flex justify-center items-center h-screen bg-black">
      <Suspense fallback={<p className="text-white absolute top-4 right-4">Loading your name</p>}>
        <LoginButton />
      </Suspense>
      <img src="/logo.svg" alt="Mensaje Logo" />
    </main>
  )
}

export default Home
