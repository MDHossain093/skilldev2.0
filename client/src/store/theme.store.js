import { create } from "zustand"

const STORAGE_KEY = "theme"

// Read the current theme from the DOM/localStorage (set by the pre-hydration
// script in layout.js). Defaults to "dark".
const getInitialTheme = () => {
  if (typeof window === "undefined") return "dark"
  return localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark"
}

const applyTheme = (theme) => {
  if (typeof document === "undefined") return
  const root = document.documentElement
  if (theme === "dark") root.classList.add("dark")
  else root.classList.remove("dark")
  localStorage.setItem(STORAGE_KEY, theme)
}

const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(),

  setTheme: (theme) => {
    applyTheme(theme)
    set({ theme })
  },

  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark"
    applyTheme(next)
    set({ theme: next })
  },
}))

export default useThemeStore
