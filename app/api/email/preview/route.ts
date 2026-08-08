export const runtime = "nodejs"

import { auth } from "@/lib/auth"
import { getMiyuEmailPreview } from "@/lib/email"
import { getValidAccessToken } from "@/lib/token-refresh"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      )
    }

    if (session.user.email !== process.env.ALLOWED_GOOGLE_EMAIL) {
      return NextResponse.json(
        { success: false, error: "Unauthorized email" },
        { status: 403 }
      )
    }

    const { accessToken } = await getValidAccessToken(request.headers)
    const preview = await getMiyuEmailPreview(accessToken)

    return NextResponse.json({ success: true, preview })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
