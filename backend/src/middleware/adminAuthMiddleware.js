import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { env } from "../config/env.js";
import { logSecurityEvent } from "../utils/securityAudit.js";

export const adminAuthMiddleware = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logSecurityEvent("ADMIN_AUTH_MISSING_TOKEN", req);
    next(new ApiError(401, "Authorization token is required"));
    return;
  }

  const token = authHeader.split(" ")[1];

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logSecurityEvent("ADMIN_AUTH_EXPIRED_TOKEN", req);
      next(new ApiError(401, "Token has expired"));
      return;
    }

    logSecurityEvent("ADMIN_AUTH_INVALID_TOKEN", req);
    next(new ApiError(401, "Invalid or malformed token"));
    return;
  }

  if (
    payload.role !== "admin" ||
    payload.type !== "admin" ||
    payload.iss !== "portfolio-api" ||
    payload.aud !== "portfolio-admin"
  ) {
    logSecurityEvent("ADMIN_AUTH_FORBIDDEN", req, {
      role: payload.role,
      type: payload.type,
      iss: payload.iss,
      aud: payload.aud,
    });
    next(new ApiError(403, "Access forbidden: Admin authorization required"));
    return;
  }

  req.user = payload;
  next();
};

export default adminAuthMiddleware;
