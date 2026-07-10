import prisma from "../config/db.js"


export const createProject = async (req, res) => {
  try {
    console.log("BODY:", req.body)
    
    const {
      title,
      description,
      githubUrl,
      liveUrl,
      techStack,
      userId,
    } = req.body

    const project = await prisma.project.create({
      data: {
        title,
        description,
        githubUrl,
        liveUrl,
        techStack,
        userId,
      },
    })

    res.status(201).json(project)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: error.message,
    })
  }
}

// GET /api/projects?userId=X -> only that user's projects
// GET /api/projects          -> all projects (kept for backwards compatibility)
export const getProjects = async (req, res) => {
  try {
    const { userId } = req.query

    const projects = await prisma.project.findMany({
      where: userId ? { userId } : undefined,
      orderBy: {
        createdAt: "desc",
      },
    })

    res.status(200).json(projects)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.query

    // Only delete if the project belongs to this user.
    const result = await prisma.project.deleteMany({
      where: userId ? { id, userId } : { id },
    })

    if (result.count === 0) {
      return res.status(404).json({ message: "Project not found" })
    }

    res.status(200).json({
      message: "Project deleted",
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}