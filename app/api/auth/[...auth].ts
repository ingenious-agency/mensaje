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
          clientID: process.env.SLACK_CLIENT_ID,
          clientSecret: process.env.SLACK_CLIENT_SECRET,
          skipUserProfile: false,
          scope: ["identity.basic", "identity.email", "identity.avatar", "identity.team"],
          callbackURL:
            process.env.NODE_ENV === "production"
              ? `${process.env.WEBSITE_URL}/api/auth/slack/callback`
              : "http://localhost:3000/api/auth/slack/callback",
        },
        async (accessToken, _refreshToken, profile, done) => {
          console.log("accessToken", accessToken)
          const email = profile.user.email
          console.log("email", email)
          const user = await db.user.upsert({
            where: { email },
            create: {
              email,
              name: profile.displayName,
              slackUserId: profile.id,
              slackAccessToken: accessToken,
            },
            update: { email, slackAccessToken: accessToken },
          })
          console.log("user", user)
          const publicData = { userId: user.id, roles: [user.role], source: "slack" }
          done(null, { publicData })
        }
      ),
    },
  ],
})
