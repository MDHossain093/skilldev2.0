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
        }

        set({
          user,
          token,
        })
      },

      logout: () => {
        if (typeof window !== "undefined") {
          document.cookie = "token=; Path=/; Max-Age=0; SameSite=Lax"
        }

        set({
          user: null,
          token: null,
        })
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useAuthStore