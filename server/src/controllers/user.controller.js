import prisma from "../config/db.js"

// List all users with their skills (for the developers directory).
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        profile: {
          select: { bio: true, image: true },
        },
        skills: {
          select: { skill: { select: { id: true, name: true } } },
        },
        _count: {
          select: { projects: true },
        },
      },
    })

    // Flatten the UserSkill join so the client gets a plain skills array.
    const result = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      createdAt: u.createdAt,
      bio: u.profile?.bio ?? null,
      image: u.profile?.image ?? null,
      projectCount: u._count.projects,
      skills: u.skills.map((s) => s.skill),
    }))

    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Full public profile for a single user: profile, skills and projects.
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        profile: {
          select: {
            bio: true,
            github: true,
            linkedin: true,
            image: true,
          },
        },
        skills: {
          select: { skill: { select: { id: true, name: true } } },
        },
        projects: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            description: true,
            githubUrl: true,
            liveUrl: true,
            techStack: true,
            createdAt: true,
          },
        },
      },
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      profile: user.profile ?? null,
      skills: user.skills.map((s) => s.skill),
      projects: user.projects,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
