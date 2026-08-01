import { auth } from "./auth"

export async function getValidAccessToken(headers: Headers): Promise<{
  accessToken: string
  responseHeaders: Headers
}> {
  const result = await auth.api.getAccessToken({
    headers,
    body: {
      providerId: "google",
    },
    returnHeaders: true,
  })

  if (!result || !result.response) {
    throw new Error("Session expired")
  }

  return {
    accessToken: result.response.accessToken,
    responseHeaders: result.headers,
  }
}
