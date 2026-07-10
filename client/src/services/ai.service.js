import axios from "axios"

const API = "http://localhost:5000/api/ai"

export const getProfileAnalysis = async (payload) => {
  const response = await axios.post(`${API}/profile-analysis`, payload)
  return response.data
}

export const getSkillGapAnalysis = async (payload) => {
  const response = await axios.post(`${API}/skill-gap`, payload)
  return response.data
}

export const getRecommendedSkills = async (payload) => {
  const response = await axios.post(`${API}/recommended-skills`, payload)
  return response.data
}

export const getRoadmap = async (payload) => {
  const response = await axios.post(`${API}/roadmap`, payload)
  return response.data
}

export const getCareerAdvice = async (payload) => {
  const response = await axios.post(`${API}/career-advice`, payload)
  return response.data
}

export const getTimeline = async (payload) => {
  const response = await axios.post(`${API}/timeline`, payload)
  return response.data
}
