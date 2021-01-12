import { ReactNode, Suspense } from "react"
import { Head } from "blitz"
import Loader from "app/components/loader"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "mensaje"}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </>
  )
}

export default Layout
