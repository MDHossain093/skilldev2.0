"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useAuthStore from "@/store/auth.store"

export default function AuthLayout({ children }) {
  const router = useRouter()
  const token = useAuthStore((s) => s.token)
  // `useAuthStore.persist` is only available on the client. On the server we
  // default `hydrated` to `false` so the layout renders the spinner; the
  // client useEffect below then subscribes and flips it once rehydration ends.
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // React 19's react-hooks/set-state-in-effect lint rule disallows
    // synchronous setState() inside an effect body. queueMicrotask defers
    // the set into the next microtask so React's commit phase completes
    // first, which satisfies the rule and preserves the original semantics.
    const flip = () => queueMicrotask(() => setHydrated(true))
    if (useAuthStore.persist?.hasHydrated()) flip()
    const unsubFinish = useAuthStore.persist?.onFinishHydration(flip)
    return () => unsubFinish?.()
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (token) router.replace("/dashboard")
  }, [hydrated, token, router])

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (token) return null

  return <>{children}</>
}