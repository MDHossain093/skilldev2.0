import { runAIAnalysis } from "../utils/aiPrompt.js"

// Shared helper: normalize the payload the client sends and run the prompt.
const analyze = async (req, res, task) => {
  try {
    const { profile, skills, projects, targetRole } = req.body

    const result = await runAIAnalysis({
      profile,
      skills,
      projects,
      task,
    })

    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

export const profileAnalysis = (req, res) =>
  analyze(
    req,
    res,
    `Analyze this developer's profile, skills, and projects.
Return ONLY a JSON object of this exact shape:
{ "strengths": string[], "weaknesses": string[] }
- "strengths": 3-6 concise strengths of the developer.
- "weaknesses": 3-6 concise areas to improve.
Each item must be a short phrase (max ~5 words).`
  )

export const skillGapAnalysis = (req, res) =>
  analyze(
    req,
    res,
    `The developer is targeting this role: "${req.body.targetRole || "their likely next role"}".
Compare their current skills to what that role requires.
Return ONLY a JSON object of this exact shape:
{ "skillGaps": string[] }
- "skillGaps": 4-8 specific skills or technologies they are currently missing for the target role.`
  )

export const recommendedSkills = (req, res) =>
  analyze(
    req,
    res,
    `Based on the developer's current stack and projects, recommend skills to learn next.
Return ONLY a JSON object of this exact shape:
{ "recommendedSkills": string[] }
- "recommendedSkills": 4-8 concrete skills/technologies that build naturally on what they already know.`
  )

export const roadmap = (req, res) =>
  analyze(
    req,
    res,
    `Create a step-by-step roadmap for this developer to reach the role: "${req.body.targetRole || "the next level in their career"}".
Return ONLY a JSON object of this exact shape:
{ "roadmap": string[] }
- "roadmap": an ordered array of 5-8 actionable steps, each a single sentence.`
  )

export const careerAdvice = (req, res) =>
  analyze(
    req,
    res,
    `Give this developer personalized, encouraging but practical career advice
based on their profile, skills, and projects.
Return ONLY a JSON object of this exact shape:
{ "careerAdvice": string }
- "careerAdvice": 2-4 sentences of tailored guidance.`
  )

export const timeline = (req, res) =>
  analyze(
    req,
    res,
    `Estimate a realistic timeline for this developer to reach the role: "${req.body.targetRole || "their next career goal"}",
given their current skills and projects.
Return ONLY a JSON object of this exact shape:
{ "timeline": string }
- "timeline": 1-3 sentences describing the estimated timeframe and what it depends on.`
  )
