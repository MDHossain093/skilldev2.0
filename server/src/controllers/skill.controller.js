import prisma from "../config/db.js"

// Add a skill to a specific user.
// `Skill` is a global catalog (unique name); `UserSkill` links a user to it.
export const createSkill = async (req, res) => {
  try {
    const { name, userId } = req.body

    if (!userId) {
      return res.status(400).json({ message: "userId is required" })
    }
    if (!name?.trim()) {
      return res.status(400).json({ message: "Skill name is required" })
    }

    // Reuse the skill row if it already exists, otherwise create it.
    const skill = await prisma.skill.upsert({
      where: { name: name.trim() },
      update: {},
      create: { name: name.trim() },
    })

    // Link it to the user (ignore if the link already exists).
    await prisma.userSkill.upsert({
      where: { userId_skillId: { userId, skillId: skill.id } },
      update: {},
      create: { userId, skillId: skill.id },
    })

    res.status(201).json(skill)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/skills          -> all skills in the ecosystem (for Search page)
// GET /api/skills?userId=X -> only that user's skills
export const getSkills = async (req, res) => {
  try {
    const { userId } = req.query

    if (userId) {
      const links = await prisma.userSkill.findMany({
        where: { userId },
        select: { skill: { select: { id: true, name: true } } },
      })
      return res.status(200).json(links.map((l) => l.skill))
    }

    const skills = await prisma.skill.findMany()
    res.status(200).json(skills)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE /api/skills/:skillId?userId=X
// Removes only this user's link to the skill — the global skill row stays.
export const deleteSkill = async (req, res) => {
  try {
    const { id: skillId } = req.params
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({ message: "userId is required" })
    }

    await prisma.userSkill.deleteMany({
      where: { userId, skillId },
    })

    res.status(200).json({ message: "Skill removed" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
