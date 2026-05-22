import { create } from "zustand"

const useAuthStore = create((set) => ({
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null,

  token:
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null,

  login: (user, token) => {
    localStorage.setItem(
      "user",
      JSON.stringify(user)
    )

    localStorage.setItem("token", token)

    set({
      user,
      token,
    })
  },

  logout: () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")

    set({
      user: null,
      token: null,
    })
  },
}))

export default useAuthStore