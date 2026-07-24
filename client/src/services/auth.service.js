import axios from "axios"
import { getApiBaseUrl } from "@/lib/env"

const API = `${getApiBaseUrl()}/api/auth`

export const registerUser = async (data) => {
  const response = await axios.post(
    `${API}/register`,
    data
  )

  return response.data
}

export const loginUser = async (data) => {
  const response = await axios.post(
    `${API}/login`,
    data
  )

  return response.data
}