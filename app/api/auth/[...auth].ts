import { passportAuth } from "blitz"
import db from "db"
import { Strategy as SlackStrategy } from "passport-slack"

export default passportAuth({
  successRedirectUrl: "/",
  errorRedirectUrl: "/",
  strategies: [
    {
      strategy: new SlackStrategy(
        {
          clientID: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID,
          clientSecret: process.env.SLACK_CLIENT_SECRET,
          skipUserProfile: false,
          scope: ["identity.basic", "identity.email", "identity.avatar", "identity.team"],
          callbackURL:
            process.env.NODE_ENV === "production"
              ? `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/auth/slack/callback`
              : "http://localhost:3000/api/auth/slack/callback",
        },
        async (accessToken, _refreshToken, profile, done) => {
          const email = profile.user.email
          const avatarUrl = profile.user.image_192

          if (profile.team.id !== process.env.SLACK_TEAM_ID)
            done(new Error("This app is not configured for the requested workspace"))

          const user = await db.user.upsert({
            where: { email },
            create: {
              email,
              name: profile.displayName,
              slackUserId: profile.id,
              slackAccessToken: accessToken,
              avatarUrl,
            },
            update: { email, slackAccessToken: accessToken, avatarUrl },
          })
          const publicData = { userId: user.id, roles: [user.role], source: "slack" }
          done(null, { publicData })
        }
      ),
    },
  ],
})
