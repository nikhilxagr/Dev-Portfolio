import { Router } from "express";
import { body, validationResult } from "express-validator";
import { chatStream, aiHealth } from "../ai/controllers/chat.controller.js";
import { aiChatLimiter } from "../middleware/rateLimiter.js";

const router = Router();

const validateChatInput = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required.")
    .isLength({ max: 500 })
    .withMessage("Message must be 500 characters or fewer.")
    .isString()
    .withMessage("Message must be a string."),

  body("history")
    .optional()
    .isArray({ max: 12 })
    .withMessage("History must be an array with at most 12 entries."),

  body("history.*.role")
    .optional()
    .isIn(["user", "assistant"])
    .withMessage("History role must be 'user' or 'assistant'."),

  body("history.*.content")
    .optional()
    .isString()
    .isLength({ max: 2000 })
    .withMessage("History content must be a string under 2000 characters."),

  body("sessionId")
    .optional()
    .isString()
    .isLength({ max: 64 })
    .withMessage("sessionId must be a string under 64 characters."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({
        success: false,
        message: "Invalid request data.",
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
      return;
    }
    next();
  },
];

router.post("/chat", aiChatLimiter, validateChatInput, chatStream);
router.get("/health", aiHealth);

export default router;
