import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: (user, token) => {
        if (typeof window !== "undefined") {
          document.cookie = `token=${token}; Path=/; Max-Age=${ONE_WEEK_SECONDS}; SameSite=Lax`
          localStorage.setItem("token", token)
          localStorage.setItem("user", JSON.stringify(user))
        }

        set({
          user,
          token,
        })
      },

      logout: () => {
        if (typeof window !== "undefined") {
          document.cookie = "token=; Path=/; Max-Age=0; SameSite=Lax"
          localStorage.removeItem("token")
          localStorage.removeItem("user")
        }

        set({
          user: null,
          token: null,
        })
      },
    }),
    {
      name: "auth-storage-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state, error) => {
        if (error) console.error("[auth-store] rehydrate error", error)
      },
    }
  )
)

export default useAuthStore

// Eagerly trigger rehydration as soon as this module loads on the client.
// This avoids the "stuck before rehydration" trap where components subscribed
// only via selectors miss the rehydration setState and never re-render.
if (typeof window !== "undefined") {
  useAuthStore.persist.hasHydrated()
}
