"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export function LogoutButton() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const result = await authClient.getSession()
        setIsAuthenticated(Boolean(result.data?.user))
      } catch {
        setIsAuthenticated(false)
      }
    }

    void checkSession()
  }, [])

  const handleSignOut = async () => {
    await authClient.signOut()
    setIsAuthenticated(false)
    router.push("/login")
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button variant="outline" size="xs" onClick={handleSignOut}>
        Logout
      </Button>
    </div>
  )
}
