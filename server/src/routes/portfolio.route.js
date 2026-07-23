import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  getMyPortfolio,
  upsertPortfolio,
  updateToggles,
  setPublish,
  getPublicPortfolio,
} from "../controllers/portfolio.controller.js";

const router = Router();

// Public route — must be declared before the requireAuth-protected router
router.get("/public/:username", getPublicPortfolio);

// All routes below require authentication.
router.use(requireAuth);

router.get("/:userId", getMyPortfolio);
router.put("/:userId", upsertPortfolio);
router.patch("/:userId/toggles", updateToggles);
router.post("/:userId/publish", setPublish);

export default router;
