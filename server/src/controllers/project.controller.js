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

export const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
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

    await prisma.project.delete({
      where: { id },
    })

    res.status(200).json({
      message: "Project deleted",
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}