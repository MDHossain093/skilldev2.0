import jwt from "jsonwebtoken"
import prisma from "../config/db.js"

/**
 * Extract a JWT from either the HttpOnly cookie (`token`)
 * or the Authorization header (`Bearer <token>`).
 */
const extractToken = (req) => {
  if (req.cookies?.token) return req.cookies.token

  const header = req.headers.authorization
  if (header && header.startsWith("Bearer ")) {
    return header.slice(7).trim()
  }
  return null
}

/**
 * Hard gate. Attaches `req.user` (full Prisma row minus password) on success.
 * Responds 401 if missing/invalid, 401 if token valid but user no longer exists,
 * 500 if JWT_SECRET is unset.
 */
export const requireAuth = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Server misconfigured: JWT_SECRET missing" })
    }

    const token = extractToken(req)
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" })
    }

    let payload
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * Soft gate. Same parsing as requireAuth, but never blocks.
 * `req.user` will be set when a valid token is present, otherwise undefined.
 * Useful for routes that are public but personalize the response.
 */
export const optionalAuth = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) return next()

    const token = extractToken(req)
    if (!token) return next()

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
      })
      if (user) req.user = user
    } catch (err) {
      // invalid token: ignore, continue unauthenticated
    }
    next()
  } catch (error) {
    next()
  }
}