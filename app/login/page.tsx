import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { GoogleSignInButton } from "@/components/google-signin-button"

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    redirect("/upload")
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-8 shadow-sm">
        <h1 className="text-xl font-medium">Receipt Uploader</h1>
        <p className="text-sm text-muted-foreground">Upload receipts to Google Drive</p>
        <GoogleSignInButton />
      </div>
    </div>
  )
}
