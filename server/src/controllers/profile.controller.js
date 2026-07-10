import prisma from "../config/db.js"

// Only these fields exist on the Profile model — whitelist so unknown
// keys sent by the client (e.g. portfolio/location) don't break Prisma.
const pickProfileFields = (body = {}) => {
  const { bio, github, linkedin, image } = body
  return { bio, github, linkedin, image }
}

// GET /api/profile/:userId — returns the user's profile, or an empty
// object if they haven't created one yet (never 404 for a valid user).
export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params

    const profile = await prisma.profile.findUnique({
      where: { userId },
    })

    res.status(200).json(profile ?? {})
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// PUT /api/profile/:userId — creates the profile if missing, otherwise updates it.
export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params
    const data = pickProfileFields(req.body)

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    })

    res.status(200).json(profile)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
