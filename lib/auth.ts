import { betterAuth } from "better-auth"

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      accessType: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/gmail.send",
      ],
      getToken: async (data) => {
        const response = await fetch("https://googleapis.com", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            code: data.code,
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            redirect_uri: data.redirectURI,
            grant_type: "authorization_code",
          }),
        })

        const tokens = await response.json()

        if (tokens?.refresh_token) {
          console.log("\n=============================================")
          console.log("👉 COPY THIS REFRESH TOKEN FOR YOUR ENV FILE:")
          console.log(tokens.refresh_token)
          console.log("=============================================\n")
        } else {
          console.log(
            "⚠️ No refresh token returned. Clear your Google App permissions or browser cookies and retry."
          )
        }

        return {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          idToken: tokens.id_token,
          expiresIn: tokens.expires_in,
        }
      },
    },
  },
  account: {
    storeStateStrategy: "cookie",
    storeAccountCookie: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwe",
      maxAge: 60 * 60 * 24 * 7,
    },
  },
})
