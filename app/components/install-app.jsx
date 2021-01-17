export default function InstallApp() {
  return (
    <div className="absolute h-screen w-screen bg-white flex items-center justify-center">
      <a
        href={`https://slack.com/oauth/v2/authorize?redirect_uri=${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/slack/install&client_id=2756934506.1603903113093&scope=commands&user_scope=users.profile:read,channels:read,chat:write,groups:read,reactions:write`}
      >
        <img
          alt="Add to Slack"
          height="40"
          width="139"
          src="https://platform.slack-edge.com/img/add_to_slack.png"
          srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
        />
      </a>
    </div>
  )
}
