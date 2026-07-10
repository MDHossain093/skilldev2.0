import { GoogleGenAI } from "@google/genai"

export const getLlm = () => {
  const apiKey =
    process.env.GOOGLE_API_KEY ??
    process.env.GEMINI_API_KEY

  if (!apiKey) {
    return null
  }

  const ai = new GoogleGenAI({ apiKey })

  return {
    invoke: async (input) => {
      const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",
        input,
      })

      return { content: interaction.output_text }
    },
  }
}
