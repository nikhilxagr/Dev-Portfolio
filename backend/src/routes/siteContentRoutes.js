import { Router } from "express";
import {
  getSiteContent,
  updateSiteContent,
} from "../controllers/siteContentController.js";
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";
import { publicReadLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.get("/", publicReadLimiter, getSiteContent);
router.put("/", adminAuthMiddleware, updateSiteContent);

export default router;
