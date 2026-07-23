"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useAuthStore from "@/store/auth.store"

export default function AuthLayout({ children }) {
  const router = useRouter()
  const token = useAuthStore((s) => s.token)
  const hasHydrated = useAuthStore((s) => s.hasHydrated)

  useEffect(() => {
    if (!hasHydrated) return
    if (token) router.replace("/dashboard")
  }, [hasHydrated, token, router])

  if (!hasHydrated || token) return null

  return <>{children}</>
}