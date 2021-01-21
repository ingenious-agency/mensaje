import db from "db"
import { WebAPICallResult, WebClient } from "@slack/web-api"
import { NextApiRequest, NextApiResponse } from "next"

export default async function slack(req: NextApiRequest, res: NextApiResponse) {
  const web = new WebClient()

  const accessResponse = (await web.oauth.v2.access({
    code: req.query.code as string,
    client_id: process.env.SLACK_CLIENT_ID as string,
    client_secret: process.env.SLACK_CLIENT_SECRET as string,
    redirect_uri: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/slack/install`,
  })) as WebAPICallResult & { authed_user: { id: string; access_token: string } } & {
    team: { id: string }
  }

  if (!accessResponse.ok) {
    res.json(accessResponse)
    res.end()
  }

  if (accessResponse.team.id !== process.env.SLACK_TEAM_ID) {
    res.send("This app is not configured for the requested workspace")
    res.end()
  }

  const slackAccessToken = accessResponse.authed_user.access_token
  const slackUserId = accessResponse.authed_user.id

  const profileResponse = (await web.users.profile.get({
    token: slackAccessToken,
    user: slackUserId,
  })) as WebAPICallResult & { profile: { email: string; displayName: string } }

  if (!profileResponse.ok) {
    res.json(profileResponse)
    res.end()
  }

  const email = profileResponse.profile.email
  const name = profileResponse.profile.displayName
  const isInstalled = true

  await db.user.upsert({
    where: { email },
    create: {
      email,
      name,
      slackUserId,
      slackAccessToken,
      isInstalled,
    },
    update: { email, slackAccessToken, isInstalled },
  })

  res.redirect(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/`)
}
