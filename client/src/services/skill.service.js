import axios from "axios"
import { getApiBaseUrl } from "@/lib/env"

const API = `${getApiBaseUrl()}/api/skills`

// Pass a userId to get only that user's skills; omit for the full catalog.
export const getSkills = async (userId) => {
  const response = await axios.get(API, {
    params: userId ? { userId } : {},
  })
  return response.data
}

export const createSkill = async (data) => {
  const response = await axios.post(API, data)
  return response.data
}

export const deleteSkill = async (id, userId) => {
  const response = await axios.delete(`${API}/${id}`, {
    params: userId ? { userId } : {},
  })
  return response.data
}
