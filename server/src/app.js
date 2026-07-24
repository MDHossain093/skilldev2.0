import express from "express"
import cors from "cors"

import authRoutes from "./routes/auth.route.js"
import skillRoutes from "./routes/skill.route.js"
import projectRoutes from "./routes/project.route.js"
import aiRoutes from "./routes/ai.route.js"
import userRoutes from "./routes/user.route.js"
import profileRoutes from "./routes/profile.route.js"

const app = express()

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://skilldev2-0-8yljymvv3-mdhossain093s-projects.vercel.app",
]

const corsOptions = {
  origin(origin, callback) {
    // Allow same-origin / curl (no Origin header) and explicitly listed origins.
    // Also allow any Vercel preview deployment (`*.vercel.app`).
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true)
    }
    return callback(new Error("Not allowed by CORS"))
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

// Middleware FIRST
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes AFTER middleware
app.use("/api/auth", authRoutes)
app.use("/api/skills", skillRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/users", userRoutes)
app.use("/api/profile", profileRoutes)
app.get("/", (req, res) => {
  res.send("SkillDev API Running")
})

export default app