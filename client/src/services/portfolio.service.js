import axios from "axios"

const BASE = "http://localhost:5000/api/portfolio"
const creds = { withCredentials: true }

// Owner view — server derives userId from JWT cookie
export const getMyPortfolio = async (userId) => {
  const r = await axios.get(`${BASE}/${userId}`, creds)
  return r.data // { portfolio }
}

export const upsertPortfolio = async (userId, payload) => {
  const r = await axios.put(`${BASE}/${userId}`, payload, creds)
  return r.data
}

export const toggleVisibility = async (userId, toggles) => {
  const r = await axios.patch(`${BASE}/${userId}/toggles`, toggles, creds)
  return r.data
}

export const setPublish = async (userId, isPublished) => {
  const r = await axios.post(
    `${BASE}/${userId}/publish`,
    { isPublished },
    creds
  )
  return r.data
}

// Public — no auth required
export const getPublicPortfolio = async (username) => {
  const r = await axios.get(`${BASE}/public/${username}`)
  return r.data
}
