import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userAuthRoutes from "./routes/userAuthRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import journeyRoutes from "./routes/journeyRoutes.js";
import siteContentRoutes from "./routes/siteContentRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import articleInteractionRoutes from "./routes/articleInteractionRoutes.js";
import { applySecurityMiddleware } from "./middleware/securityMiddleware.js";
import {
  generalLimiter,
  contactLimiter,
} from "./middleware/rateLimiter.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";
import { env } from "./config/env.js";

const app = express();

// Required behind Render proxy for accurate req.ip and rate limiting.
app.set("trust proxy", env.trustProxyHops);

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json", limit: "300kb" }),
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

applySecurityMiddleware(app);
app.use(generalLimiter);

app.use("/api", (req, res, next) => {
  if (!["POST", "PUT", "PATCH"].includes(req.method)) {
    next();
    return;
  }

  if (req.path === "/payments/webhook") {
    next();
    return;
  }

  const hasBody =
    Number(req.headers["content-length"] || 0) > 0 ||
    Boolean(req.headers["transfer-encoding"]);

  if (hasBody && !req.is("application/json")) {
    res.status(415).json({
      success: false,
      message: "Content-Type must be application/json",
    });
    return;
  }

  next();
});

app.get("/api/health", (req, res) => {
  const dbConnected = Boolean(req.app.locals.dbConnected);

  res.status(200).json({
    success: true,
    message: "API is healthy",
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      dbConnected,
    },
  });
});

app.use("/api", (req, res, next) => {
  const allowWithoutDb = [
    "/health",
    "/auth/login",
    "/auth/verify",
    "/payments/config-status",
  ];
  const allowReadFallbackWithoutDb =
    req.method === "GET" &&
    /^\/(projects|blogs|articles|journey|site-content)\b/.test(req.path);
  // AI routes never need DB — always allow
  const isAiRoute = req.path.startsWith("/ai");

  if (allowWithoutDb.includes(req.path) || allowReadFallbackWithoutDb || isAiRoute) {
    next();
    return;
  }

  if (req.app.locals.dbConnected === false) {
    res.status(503).json({
      success: false,
      message:
        "Database is currently unavailable. API is running in limited mode.",
    });
    return;
  }

  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/user-auth", userAuthRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/journey", journeyRoutes);
app.use("/api/site-content", siteContentRoutes);
app.use("/api/articles", articleInteractionRoutes);
app.use("/api/contact", contactLimiter, contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/newsletter", newsletterRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
