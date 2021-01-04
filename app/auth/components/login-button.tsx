import { Link } from "blitz"

export default function LoginButton() {
  return (
    <Link href="/api/auth/slack">
      <a className="button small">
        <strong>Login</strong>
      </a>
    </Link>
  )
}
