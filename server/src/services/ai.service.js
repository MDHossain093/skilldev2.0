import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

export const getLlm = () => {
  const apiKey =
    process.env.GOOGLE_API_KEY ??
    process.env.GEMINI_API_KEY

  if (!apiKey) {
    return null
  }

  return new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey,
    temperature: 0.7,
  })
}
