const { sessionMiddleware, simpleRolesIsAuthorized } = require("@blitzjs/server")
const { BlitzGuardMiddleware } = require("@blitz-guard/core/dist/middleware.js")

module.exports = {
  middleware: [
    BlitzGuardMiddleware({
      excluded: [
        "/api/auth/slack",
        "/api/auth/slack/callback",
        "/api/slack/install",
        "/api/auth/mutations/logout",
      ],
    }),
    sessionMiddleware({
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
  /* Uncomment this to customize the webpack config
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    return config
  },
  */
}
