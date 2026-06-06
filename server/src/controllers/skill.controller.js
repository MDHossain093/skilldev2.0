import prisma from "../config/db.js"

export const createSkill = async (req, res) => {
  try {
    const { name } = req.body

    const skill = await prisma.skill.create({
      data: { name }
    })

    res.status(201).json(skill)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const getSkills = async (req, res) => {
  try {
    const skills = await prisma.skill.findMany()

    res.status(200).json(skills)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params

    await prisma.skill.delete({
      where: { id }
    })

    res.status(200).json({
      message: "Skill deleted"
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}