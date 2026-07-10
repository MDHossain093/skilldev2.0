import express from "express"
import {
  profileAnalysis,
  skillGapAnalysis,
  recommendedSkills,
  roadmap,
  careerAdvice,
  timeline,
} from "../controllers/ai.controller.js"

const router = express.Router()

router.post("/profile-analysis", profileAnalysis)
router.post("/skill-gap", skillGapAnalysis)
router.post("/recommended-skills", recommendedSkills)
router.post("/roadmap", roadmap)
router.post("/career-advice", careerAdvice)
router.post("/timeline", timeline)

export default router
