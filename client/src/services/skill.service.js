import axios from "axios"

const API = "http://localhost:5000/api/skills"

export const getSkills = async () => {
  const response = await axios.get(API)
  return response.data
}

export const createSkill = async (data) => {
  const response = await axios.post(API, data)
  return response.data
}

export const deleteSkill = async (id) => {
  const response = await axios.delete(`${API}/${id}`)
  return response.data
}