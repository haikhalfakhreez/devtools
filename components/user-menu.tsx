"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

interface UserMenuProps {
  email: string
}

export function UserMenu({ email }: UserMenuProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/login")
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">{email}</span>
      <Button variant="outline" size="xs" onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  )
}
