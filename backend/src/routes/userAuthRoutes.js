import { Router } from "express";
import { body } from "express-validator";
import {
  initiateGoogleAuth,
  handleGoogleCallback,
  handleGoogleCredential,
  registerUser,
  loginUser,
  getCurrentUser,
  updateCurrentUser,
} from "../controllers/userAuthController.js";
import { userAuthMiddleware } from "../middleware/userAuthMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  userAuthLimiter,
  oauthLimiter,
  userProfileLimiter,
} from "../middleware/rateLimiter.js";

const router = Router();

// OAuth Routes
router.get("/google", oauthLimiter, initiateGoogleAuth);
router.get("/google/callback", oauthLimiter, handleGoogleCallback);
router.post("/google/credential", userAuthLimiter, handleGoogleCredential);

// Email / Password Auth
router.post(
  "/register",
  userAuthLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validateRequest,
  registerUser,
);

router.post(
  "/login",
  userAuthLimiter,
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  loginUser,
);

// Profile endpoints
router.get("/me", userProfileLimiter, userAuthMiddleware, getCurrentUser);
router.put("/me", userProfileLimiter, userAuthMiddleware, updateCurrentUser);

export default router;
