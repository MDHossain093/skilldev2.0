import axios from "axios"

const API = "http://localhost:5000/api/projects"

export const getProjects = async () => {
  const response = await axios.get(API)
  return response.data
}

export const createProject = async (data) => {
  const response = await axios.post(API, data)
  return response.data
}

export const deleteProject = async (id) => {
  const response = await axios.delete(`${API}/${id}`)
  return response.data
}