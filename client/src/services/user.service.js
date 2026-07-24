import axios from "axios"
import { getApiBaseUrl } from "@/lib/env"

const API = `${getApiBaseUrl()}/api/users`

export const getUsers = async () => {
  const response = await axios.get(API)
  return response.data
}

export const getUserById = async (id) => {
  const response = await axios.get(`${API}/${id}`)
  return response.data
}
