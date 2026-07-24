import axios from "axios"
import { getApiBaseUrl } from "@/lib/env"

const API = `${getApiBaseUrl()}/api/profile`

export const getProfile = async (userId) => {
  const response = await axios.get(`${API}/${userId}`)
  return response.data
}

export const updateProfile = async (userId, data) => {
  const response = await axios.put(`${API}/${userId}`, data)
  return response.data
}