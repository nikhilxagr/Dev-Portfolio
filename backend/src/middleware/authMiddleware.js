import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { env } from "../config/env.js";

const authMiddleware = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new ApiError(401, "Authorization token is required"));
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = payload;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
};

export default authMiddleware;
