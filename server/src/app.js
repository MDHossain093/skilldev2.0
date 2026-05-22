import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.route.js"

const app = express()

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))

app.use(express.json())

app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
  res.send("SkillDev API Running")
})

export default app