export const runtime = "nodejs"

import { auth } from "@/lib/auth"
import { createDriveClient, resolveUploadFolderId, uploadFileToDrive } from "@/lib/drive"
import { getValidAccessToken } from "@/lib/token-refresh"
import { CATEGORY_FOLDERS, type Category } from "@/lib/constants"
import { NextResponse } from "next/server"

const MAX_FILE_SIZE = 25 * 1024 * 1024

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

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const category = formData.get("category") as string | null
    const filename = formData.get("filename") as string | null

    if (!file || !category || !filename) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    if (!(category in CATEGORY_FOLDERS)) {
      return NextResponse.json({ success: false, error: "Invalid category" }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: "File exceeds 25MB limit" }, { status: 400 })
    }

    const { accessToken, responseHeaders } = await getValidAccessToken(request.headers)

    const drive = createDriveClient(accessToken)

    const year = String(new Date().getFullYear())
    const folderId = await resolveUploadFolderId(drive, category as Category, year)

    const arrayBuffer = await file.arrayBuffer()
    const result = await uploadFileToDrive(drive, folderId, filename, arrayBuffer, file.type)

    const response = NextResponse.json({
      success: true,
      file: {
        id: result.id,
        name: result.name,
        webViewLink: result.webViewLink,
      },
    })

    for (const [key, value] of responseHeaders.entries()) {
      if (key.toLowerCase() === "set-cookie") {
        response.headers.append("Set-Cookie", value)
      }
    }

    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
