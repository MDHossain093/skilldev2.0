import { create } from "zustand"
import {
  getMyPortfolio,
  upsertPortfolio,
  toggleVisibility,
  setPublish,
} from "@/services/portfolio.service"

// Editor state. Not persisted: each visit re-fetches from the server, which is
// the source of truth. (Username uniqueness, conflict resolution, etc. all
// happen server-side.)
const usePortfolioStore = create((set, get) => ({
  portfolio: null,
  loading: false,
  saving: false,
  error: null,

  load: async (userId) => {
    set({ loading: true, error: null })
    try {
      const { portfolio } = await getMyPortfolio(userId)
      set({ portfolio: portfolio || null, loading: false })
    } catch (e) {
      // 404 / null portfolio is expected for first-time editors — treat as no-op
      if (e?.response?.status === 404 || e?.response?.status === 403) {
        set({ portfolio: null, loading: false, error: null })
        return
      }
      set({
        loading: false,
        error: e?.response?.data?.message || "Failed to load portfolio",
      })
    }
  },

  save: async (userId, patch) => {
    set({ saving: true, error: null })
    try {
      const { portfolio } = await upsertPortfolio(userId, patch)
      set({ portfolio, saving: false })
    } catch (e) {
      set({
        saving: false,
        error: e?.response?.data?.message || "Failed to save",
      })
      throw e
    }
  },

  toggle: async (userId, toggles) => {
    set({ error: null })
    try {
      const { portfolio } = await toggleVisibility(userId, toggles)
      set({ portfolio })
    } catch (e) {
      set({
        error: e?.response?.data?.message || "Failed to update toggles",
      })
    }
  },

  publish: async (userId, isPublished) => {
    set({ error: null })
    try {
      const { portfolio } = await setPublish(userId, isPublished)
      set({ portfolio })
    } catch (e) {
      set({
        error: e?.response?.data?.message || "Failed to publish",
      })
    }
  },

  clear: () => set({ portfolio: null, error: null }),
}))

export default usePortfolioStore
