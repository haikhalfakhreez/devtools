import { getSessionCookie } from "better-auth/cookies"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const protectedPaths = ["/upload", "/api/drive"]
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  if (!isProtected) {
    return NextResponse.next()
  }

  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: "better-auth",
  })

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/upload/:path*", "/api/drive/:path*"],
}
