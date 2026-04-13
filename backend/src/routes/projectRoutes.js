import { Router } from "express";
import { body, param } from "express-validator";
import {
  createProject,
  deleteProject,
  getProjectBySlug,
  getProjects,
  updateProject,
} from "../controllers/projectController.js";
import validateRequest from "../middleware/validateRequest.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { publicReadLimiter } from "../middleware/rateLimiter.js";

const router = Router();

const imageUrlValidation = body("imageUrl")
  .optional({ values: "falsy" })
  .trim()
  .custom((value) => value.startsWith("/") || /^https?:\/\/.+/i.test(value))
  .withMessage("Image URL must be an absolute URL or root-relative path");

const projectValidation = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 120 })
    .withMessage("Title must be 3-120 characters"),
  body("description")
    .trim()
    .isLength({ min: 20, max: 500 })
    .withMessage("Description must be 20-500 characters"),
  body("category")
    .isIn(["Web Dev", "Cyber Security", "AI"])
    .withMessage("Invalid category"),
  body("techStack")
    .isArray({ min: 1 })
    .withMessage("Tech stack must be a non-empty array"),
  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be boolean"),
  imageUrlValidation,
];

router.get("/", publicReadLimiter, getProjects);
router.get("/:slug", publicReadLimiter, getProjectBySlug);

router.post(
  "/",
  authMiddleware,
  projectValidation,
  validateRequest,
  createProject,
);

router.put(
  "/:id",
  authMiddleware,
  [
    param("id").isMongoId().withMessage("Invalid project id"),
    ...projectValidation,
  ],
  validateRequest,
  updateProject,
);

router.delete(
  "/:id",
  authMiddleware,
  [param("id").isMongoId().withMessage("Invalid project id")],
  validateRequest,
  deleteProject,
);

export default router;
