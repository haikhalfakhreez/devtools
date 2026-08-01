export const runtime = "nodejs"

import { auth } from "@/lib/auth"
import { sendMiyuEmail } from "@/lib/email"
import { getValidAccessToken } from "@/lib/token-refresh"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    if (session.user.email !== process.env.ALLOWED_GOOGLE_EMAIL) {
      return NextResponse.json({ success: false, error: "Unauthorized email" }, { status: 403 })
    }

    const { accessToken } = await getValidAccessToken(request.headers)
    const result = await sendMiyuEmail(accessToken, session.user.email)

    return NextResponse.json({ success: true, result })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
