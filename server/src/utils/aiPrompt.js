import { getLlm } from "../services/ai.service.js"

export const runAIAnalysis = async ({
  profile,
  skills,
  projects,
  task,
}) => {
  const llm = getLlm()

  if (!llm) {
    throw new Error(
      "GOOGLE_API_KEY or GEMINI_API_KEY is not configured."
    )
  }

  const response = await llm.invoke(`
You are a senior software engineering mentor.

Developer Profile:
${JSON.stringify(profile)}

Skills:
${JSON.stringify(skills)}

Projects:
${JSON.stringify(projects)}

Task:
${task}

IMPORTANT: Return ONLY a raw JSON object. Do NOT wrap it in markdown code blocks or backticks.
`)

  // Strip markdown fences if the model includes them anyway
  let raw = response.content.trim()
  if (raw.startsWith("```")) {
    raw = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim()
  }

  return JSON.parse(raw)
}
