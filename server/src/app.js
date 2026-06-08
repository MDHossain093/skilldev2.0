import express from "express"
import cors from "cors"

import authRoutes from "./routes/auth.route.js"
import skillRoutes from "./routes/skill.route.js"
import projectRoutes from "./routes/project.route.js"

const app = express()

const corsOptions = {
  origin: "http://localhost:3000",
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
app.get("/", (req, res) => {
  res.send("SkillDev API Running")
})

export default app