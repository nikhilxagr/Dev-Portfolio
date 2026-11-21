import { Router } from "express";
import crypto from "crypto";
import { chatStream, aiHealth } from "../ai/controllers/chat.controller.js";
import { aiChatLimiter, aiImageLimiter } from "../middleware/rateLimiter.js";
import { optionalUserAuthMiddleware, userAuthMiddleware } from "../middleware/userAuthMiddleware.js";
import { cloudflareImageService } from "../ai/services/cloudflareImage.service.js";
import {
  getPublicImageModelsList,
  getImageModelByKey,
  DEFAULT_IMAGE_MODEL_KEY,
} from "../ai/services/imageModelRegistry.js";
import AiImageUsage from "../models/AiImageUsage.js";
import {
  listUserSessions,
  getUserSession,
  saveUserSession,
  patchUserSession,
  deleteUserSession,
  clearAllUserSessions,
} from "../ai/controllers/chatSession.controller.js";

const router = Router();

// Helper to determine tracking identifier (user ID or hashed client IP)
const resolveClientIdentifier = (req) => {
  if (req.user && req.user._id) {
    return `user_${req.user._id}`;
  }

  const clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "";
  const hash = crypto
    .createHash("sha256")
    .update(`${clientIp}-${userAgent}`)
    .digest("hex")
    .slice(0, 32);

  return `anon_${hash}`;
};

const validateChatInput = (req, res, next) => {
  const rawMessage = req.body?.message;

  if (!rawMessage || typeof rawMessage !== "string" || !rawMessage.trim()) {
    res.status(400).json({
      success: false,
      message: "Message is required and cannot be empty.",
    });
    return;
  }

  // Gracefully cap message length up to 1500 chars
  req.body.message = rawMessage.trim().slice(0, 1500);

  // Gracefully sanitize history without throwing 422 errors
  if (Array.isArray(req.body.history)) {
    req.body.history = req.body.history
      .filter(
        (m) =>
          m &&
          typeof m === "object" &&
          ["user", "assistant"].includes(m.role) &&
          typeof m.content === "string" &&
          m.content.trim()
      )
      .slice(-12)
      .map((m) => ({
        role: m.role,
        content: m.content.slice(0, 3000),
      }));
  } else {
    req.body.history = [];
  }

  if (typeof req.body.sessionId !== "string") {
    req.body.sessionId = "default";
  } else {
    req.body.sessionId = req.body.sessionId.slice(0, 64);
  }

  next();
};

// Concurrency lock to prevent multiple simultaneous image generations per client
const activeImageGenerations = new Set();

// Chat Assistant Endpoints (Unlimited text-to-text chat for all users)
router.post("/chat", aiChatLimiter, validateChatInput, chatStream);
router.get("/health", aiHealth);

// Cloudflare Multi-Model AI Image Studio Endpoints
router.get("/image-models", (_req, res) => {
  try {
    const models = getPublicImageModelsList();
    res.status(200).json({
      success: true,
      defaultModel: DEFAULT_IMAGE_MODEL_KEY,
      models,
    });
  } catch (error) {
    console.error(`[aiRoutes] Image models list error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve available image models.",
    });
  }
});

router.get("/image-quota", optionalUserAuthMiddleware, async (req, res) => {
  try {
    const identifier = resolveClientIdentifier(req);
    const isAuthenticated = Boolean(req.user);
    const quota = await AiImageUsage.getQuotaStatus(identifier, isAuthenticated);
    res.status(200).json({
      success: true,
      quota,
    });
  } catch (error) {
    console.error(`[aiRoutes] Quota check error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve image generation quota.",
    });
  }
});

router.post(
  "/generate-image",
  aiImageLimiter,
  optionalUserAuthMiddleware,
  async (req, res) => {
    const rawPrompt = req.body?.prompt;
    const requestedModel = req.body?.model || DEFAULT_IMAGE_MODEL_KEY;

    if (!rawPrompt || typeof rawPrompt !== "string" || !rawPrompt.trim()) {
      res.status(400).json({
        success: false,
        message: "A text prompt is required to generate an image.",
      });
      return;
    }

    const trimmedPrompt = rawPrompt.trim();
    if (trimmedPrompt.length > 500) {
      res.status(400).json({
        success: false,
        message: "Prompt is too long. Please keep it under 500 characters.",
      });
      return;
    }

    // Validate requested model against backend registry allowlist
    const modelConfig = getImageModelByKey(requestedModel);
    if (!modelConfig) {
      res.status(400).json({
        success: false,
        message: `Unknown image model "${requestedModel}". Please choose a model from the allowed models list.`,
      });
      return;
    }

    if (!modelConfig.enabled) {
      res.status(400).json({
        success: false,
        message: `Model "${modelConfig.name}" is currently disabled. Please select an active model.`,
      });
      return;
    }

    const identifier = resolveClientIdentifier(req);
    const isAuthenticated = Boolean(req.user);

    // 1. Concurrency mutex: Strictly prevent multiple / auto generations for the same client
    if (activeImageGenerations.has(identifier)) {
      res.status(429).json({
        success: false,
        message:
          "An image is already currently generating for your session. Please wait for it to complete.",
      });
      return;
    }

    try {
      // 2. Enforce MongoDB shared daily limit (10 daily for auth, 2 trial for guests) across ALL models
      const quota = await AiImageUsage.getQuotaStatus(identifier, isAuthenticated);
      if (!quota.canGenerate) {
        if (!isAuthenticated) {
          res.status(403).json({
            success: false,
            requireAuth: true,
            message:
              "You have used your 2 free guest image generations. Please sign in or create an account to get 10 free generations every day across all models!",
            quota,
          });
          return;
        }

        res.status(429).json({
          success: false,
          requireAuth: false,
          message:
            "Daily limit of 10 image generations reached. Your quota resets tomorrow at midnight UTC.",
          quota,
        });
        return;
      }

      // Lock client session during generation
      activeImageGenerations.add(identifier);

      // 3. Call Cloudflare Workers AI with the chosen model
      const result = await cloudflareImageService.generateImage({
        prompt: trimmedPrompt,
        modelKey: modelConfig.key,
      });

      // 4. Atomically record successful generation under shared limit with model key
      const updatedQuota = await AiImageUsage.recordSuccess(
        identifier,
        trimmedPrompt,
        isAuthenticated,
        modelConfig.key
      );

      res.status(200).json({
        success: true,
        image: result.dataUrl,
        prompt: trimmedPrompt,
        model: result.model,
        durationMs: result.durationMs,
        quota: updatedQuota,
      });
    } catch (error) {
      console.error(`[aiRoutes] Image generation error: ${error.message}`);
      res.status(500).json({
        success: false,
        message:
          error.message ||
          `Failed to generate image with ${modelConfig.name}.`,
      });
    } finally {
      activeImageGenerations.delete(identifier);
    }
  }
);

// Authenticated User Chat History & Sessions Management (Persistent in MongoDB)
router.get("/sessions", userAuthMiddleware, listUserSessions);
router.get("/sessions/:id", userAuthMiddleware, getUserSession);
router.post("/sessions", userAuthMiddleware, saveUserSession);
router.patch("/sessions/:id", userAuthMiddleware, patchUserSession);
router.delete("/sessions/:id", userAuthMiddleware, deleteUserSession);
router.delete("/sessions", userAuthMiddleware, clearAllUserSessions);

export default router;
