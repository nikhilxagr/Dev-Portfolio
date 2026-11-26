import { Router } from "express";
import { body, param } from "express-validator";
import {
  getJourneyEntries,
  createJourneyEntry,
  updateJourneyEntry,
  deleteJourneyEntry,
} from "../controllers/journeyController.js";
import validateRequest from "../middleware/validateRequest.js";
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";
import { publicReadLimiter } from "../middleware/rateLimiter.js";

const router = Router();

const journeyValidation = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 160 })
    .withMessage("Title must be 3-160 characters"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be 10-1000 characters"),
  body("year")
    .isInt({ min: 2015, max: 2100 })
    .withMessage("Year must be between 2015 and 2100"),
  body("status")
    .optional()
    .isIn(["published", "draft"])
    .withMessage("Invalid status"),
];

router.get("/", publicReadLimiter, getJourneyEntries);

router.post(
  "/",
  adminAuthMiddleware,
  journeyValidation,
  validateRequest,
  createJourneyEntry,
);

router.put(
  "/:id",
  adminAuthMiddleware,
  [
    param("id").trim().notEmpty().withMessage("Milestone id or key is required"),
    ...journeyValidation,
  ],
  validateRequest,
  updateJourneyEntry,
);

router.delete(
  "/:id",
  adminAuthMiddleware,
  [param("id").trim().notEmpty().withMessage("Milestone id or key is required")],
  validateRequest,
  deleteJourneyEntry,
);

export default router;
