import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { applySecurityMiddleware } from "./middleware/securityMiddleware.js";
import {
  generalLimiter,
  authLimiter,
  contactLimiter,
} from "./middleware/rateLimiter.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "300kb" }));
app.use(express.urlencoded({ extended: true }));

applySecurityMiddleware(app);
app.use(generalLimiter);

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

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/contact", contactLimiter, contactRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
