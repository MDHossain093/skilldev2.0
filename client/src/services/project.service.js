import axios from "axios"
import { getApiBaseUrl } from "@/lib/env"

const API = `${getApiBaseUrl()}/api/projects`

// Pass a userId to get only that user's projects.
export const getProjects = async (userId) => {
  const response = await axios.get(API, {
    params: userId ? { userId } : {},
  })
  return response.data
}

export const createProject = async (data) => {
  const response = await axios.post(API, data)
  return response.data
}

export const deleteProject = async (id, userId) => {
  const response = await axios.delete(`${API}/${id}`, {
    params: userId ? { userId } : {},
  })
  return response.data
}
