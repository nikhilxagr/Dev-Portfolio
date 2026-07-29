import { Router } from "express";
import { body } from "express-validator";
import {
  initiateGoogleAuth,
  handleGoogleCallback,
  handleGoogleCredential,
  registerUser,
  loginUser,
  getCurrentUser,
} from "../controllers/userAuthController.js";
import { userAuthMiddleware } from "../middleware/userAuthMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = Router();

// OAuth Routes
router.get("/google", initiateGoogleAuth);
router.get("/google/callback", handleGoogleCallback);
router.post("/google/credential", handleGoogleCredential);

// Email / Password Auth
router.post(
  "/register",
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
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  loginUser,
);

// Profile endpoint
router.get("/me", userAuthMiddleware, getCurrentUser);

export default router;
