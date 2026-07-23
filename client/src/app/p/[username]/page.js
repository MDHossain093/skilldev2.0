"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import Link from "next/link"

import ModernTemplate from "@/components/portfolio/ModernTemplate"
import MinimalTemplate from "@/components/portfolio/MinimalTemplate"
import { getPublicPortfolio } from "@/services/portfolio.service"

export default function PublicPortfolioPage() {
  const params = useParams()
  const username = params?.username

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFoundFlag, setNotFoundFlag] = useState(false)

  useEffect(() => {
    if (!username) return
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotFoundFlag(false)
    getPublicPortfolio(username)
      .then((res) => {
        if (cancelled) return
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData(res)
      })
      .catch((e) => {
        if (cancelled) return
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNotFoundFlag(true)
      })
      .finally(() => {
        if (!cancelled) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false)
    }
      })
    return () => {
      cancelled = true
    }
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (notFoundFlag || !data || !data.portfolio) {
    notFound()
  }

  const Template = data.portfolio.template === "minimal" ? MinimalTemplate : ModernTemplate

  return (
    <main className="min-h-screen bg-background">
      <Template data={data} />
      <footer className="border-t border-border/40 py-6 text-center">
        <Link
          href="/"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Built with SkillDev
        </Link>
      </footer>
    </main>
  )
}
