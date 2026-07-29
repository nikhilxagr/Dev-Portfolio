import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { env } from "../config/env.js";
import User from "../models/User.js";

export const userAuthMiddleware = async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new ApiError(401, "Sign in required to perform this action"));
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    if (payload.type !== "user") {
      next(new ApiError(401, "Invalid authentication token"));
      return;
    }

    const user = await User.findById(payload.userId).select("-passwordHash");
    if (!user) {
      next(new ApiError(401, "User account not found"));
      return;
    }

    req.user = user;
    next();
  } catch {
    next(new ApiError(401, "Session expired. Please sign in again."));
  }
};

export const optionalUserAuthMiddleware = async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next();
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    if (payload.type === "user") {
      const user = await User.findById(payload.userId).select("-passwordHash");
      if (user) {
        req.user = user;
      }
    }
  } catch {
    // Ignore invalid tokens for optional auth
  }

  next();
};
