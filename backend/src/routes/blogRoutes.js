import { Router } from "express";
import { body, param } from "express-validator";
import {
  createBlog,
  deleteBlog,
  getBlogBySlug,
  getBlogs,
  updateBlog,
} from "../controllers/blogController.js";
import validateRequest from "../middleware/validateRequest.js";
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";
import { publicReadLimiter } from "../middleware/rateLimiter.js";

const router = Router();

const imageUrlValidation = body("imageUrl")
  .optional({ values: "falsy" })
  .trim()
  .custom((value) => value.startsWith("/") || /^https?:\/\/.+/i.test(value))
  .withMessage("Image URL must be an absolute URL or root-relative path");

const blogValidation = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("Title must be 3-150 characters"),
  body("content")
    .trim()
    .isLength({ min: 20 })
    .withMessage("Content must be at least 20 characters"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("status")
    .optional()
    .isIn(["published", "draft"])
    .withMessage("Invalid status"),
  imageUrlValidation,
];

router.get("/", publicReadLimiter, getBlogs);
router.get("/:slug", publicReadLimiter, getBlogBySlug);

router.post("/", adminAuthMiddleware, blogValidation, validateRequest, createBlog);

router.put(
  "/:id",
  adminAuthMiddleware,
  [param("id").trim().notEmpty().withMessage("Blog id or slug is required"), ...blogValidation],
  validateRequest,
  updateBlog,
);

router.delete(
  "/:id",
  adminAuthMiddleware,
  [param("id").trim().notEmpty().withMessage("Blog id or slug is required")],
  validateRequest,
  deleteBlog,
);

export default router;
