import { runAIAnalysis } from "../utils/aiPrompt.js"
import prisma from "../config/db.js"

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

// Match the developer with real users from the database whose skills
// complement theirs, using the AI to rank and explain each match.
export const teamMatch = async (req, res) => {
  try {
    const { userId, profile, skills, projects } = req.body

    // All other users with their skills — the candidate pool.
    const users = await prisma.user.findMany({
      where: userId ? { id: { not: userId } } : undefined,
      select: {
        id: true,
        name: true,
        profile: { select: { bio: true, image: true } },
        skills: { select: { skill: { select: { name: true } } } },
        _count: { select: { projects: true } },
      },
    })

    const candidates = users.map((u) => ({
      id: u.id,
      name: u.name,
      bio: u.profile?.bio ?? null,
      image: u.profile?.image ?? null,
      projectCount: u._count.projects,
      skills: u.skills.map((s) => s.skill.name),
    }))

    if (candidates.length === 0) {
      return res.status(200).json({ matches: [], recommendedSkills: [] })
    }

    const result = await runAIAnalysis({
      profile,
      skills,
      projects,
      task: `Here is a pool of other developers on the platform:
${JSON.stringify(candidates.map(({ id, name, bio, skills: cs }) => ({ id, name, bio, skills: cs })))}

Pick the 3-6 developers whose skills BEST COMPLEMENT this developer's stack
(filling gaps, not duplicating). Also recommend skills the overall team should cover.
Return ONLY a JSON object of this exact shape:
{
  "matches": [{ "id": string, "role": string, "reason": string, "matchScore": number }],
  "recommendedSkills": string[]
}
- "id": must be one of the candidate ids above, exactly as given.
- "role": a short role title for them on the team (e.g. "Backend Engineer").
- "reason": one sentence on why they complement this developer.
- "matchScore": integer 0-100 rating how well they complement.
- "recommendedSkills": 4-8 skills the team should collectively cover.
Order matches by matchScore descending.`,
    })

    // Join AI picks back to the full candidate records; drop hallucinated ids.
    const byId = new Map(candidates.map((c) => [c.id, c]))
    const matches = (result.matches ?? [])
      .filter((m) => byId.has(m.id))
      .map((m) => ({ ...byId.get(m.id), role: m.role, reason: m.reason, matchScore: m.matchScore }))

    res.status(200).json({
      matches,
      recommendedSkills: result.recommendedSkills ?? [],
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

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
