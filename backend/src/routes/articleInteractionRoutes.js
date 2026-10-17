import { Router } from "express";
import {
  getArticleInteractions,
  toggleArticleLike,
  addArticleComment,
  deleteArticleComment,
} from "../controllers/articleInteractionController.js";
import {
  userAuthMiddleware,
  optionalUserAuthMiddleware,
} from "../middleware/userAuthMiddleware.js";
import { publicReadLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.get(
  "/:articleId/interactions",
  optionalUserAuthMiddleware,
  publicReadLimiter,
  getArticleInteractions
);

router.post("/:articleId/like", userAuthMiddleware, toggleArticleLike);

router.post("/:articleId/comments", userAuthMiddleware, addArticleComment);

router.delete(
  "/:articleId/comments/:commentId",
  userAuthMiddleware,
  deleteArticleComment
);

export default router;
