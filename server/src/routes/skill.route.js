import express from "express"
import {
  createSkill,
  getSkills,
  deleteSkill,
} from "../controllers/skill.controller.js"

const router = express.Router()

router.post("/", createSkill)
router.get("/", getSkills)
router.delete("/:id", deleteSkill)

export default router