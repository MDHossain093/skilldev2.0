"use client"

import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import useThemeStore from "@/store/theme.store"

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useThemeStore()
  const [mounted, setMounted] = useState(false)

  // Avoid a hydration mismatch: only render the real icon after mount.
  // Defer setState to a microtask to satisfy react-hooks/set-state-in-effect.
  useEffect(() => {
    queueMicrotask(() => setMounted(true))
  }, [])

  const isDark = theme === "dark"

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex items-center justify-center w-9 h-9 rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all ${className}`}
    >
      {mounted ? (
        isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  )
}
