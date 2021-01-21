import {
  AppProps,
  ErrorComponent,
  useRouter,
  AuthenticationError,
  AuthorizationError,
  useRouterQuery,
} from "blitz"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"
import { queryCache } from "react-query"
import Layout from "app/layouts/Layout"

import "app/styles/index.css"
import { useEffect } from "react"

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <ErrorBoundary
      FallbackComponent={RootErrorFallback}
      resetKeys={[router.asPath]}
      onReset={() => {
        // This ensures the Blitz useQuery hooks will automatically refetch
        // data any time you reset the error boundary
        queryCache.resetErrorBoundaries()
      }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ErrorBoundary>
  )
}

function RootErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const router = useRouter()
  const queryString = useRouterQuery()
  useEffect(() => {
    if (error && (error as any)?.code === "slack_webapi_platform_error") {
      localStorage.setItem("backTo", router.asPath)
    }
  }, [error, router])

  if (error instanceof AuthenticationError) {
    return (
      <main className="flex flex-col justify-center items-center h-screen bg-black">
        <img src="/logo.svg" alt="Mensaje Logo" />
        <p className="text-white text-xs mt-8">
          Please{" "}
          <a className="underline" href={`/api/auth/slack?redirectUrl=${router.asPath}`}>
            login
          </a>{" "}
          to continue.
        </p>
      </main>
    )
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={(error as any).statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else if ((error as any)?.code === "slack_webapi_platform_error") {
    return (
      <main className="flex flex-col justify-center items-center h-screen bg-black">
        <img src="/logo.svg" alt="Mensaje Logo" />
        <p className="text-white text-xs mt-8">
          Please{" "}
          <a
            className="underline"
            href={`https://slack.com/oauth/v2/authorize?redirect_uri=${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/slack/install&client_id=2756934506.1603903113093&scope=commands&user_scope=users.profile:read,channels:read,chat:write,groups:read,reactions:write`}
          >
            install the app
          </a>{" "}
          to continue.
        </p>
      </main>
    )
  } else if ((error as any)?.statusCode === 401) {
    return (
      <main className="flex flex-col justify-center items-center h-screen bg-black">
        <img src="/logo.svg" alt="Mensaje Logo" />
        <p className="text-white text-xs mt-8">
          {queryString?.authError ?? "You are not authorized to access this page"}
        </p>
      </main>
    )
  } else {
    return (
      <ErrorComponent
        statusCode={(error as any)?.statusCode || 400}
        title={JSON.stringify(error)}
      />
    )
  }
}
