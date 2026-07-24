import axios from "axios"
import { getApiBaseUrl } from "./env"

const api = axios.create({
  baseURL: `${getApiBaseUrl()}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

export default api
