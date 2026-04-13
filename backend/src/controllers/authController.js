import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { env } from "../config/env.js";
import { logSecurityEvent } from "../utils/securityAudit.js";

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "")
      .toLowerCase()
      .trim();

    if (normalizedEmail !== env.adminEmail) {
      logSecurityEvent("ADMIN_LOGIN_FAILED", req, {
        reason: "email_mismatch",
        attemptedEmail: normalizedEmail,
      });
      throw new ApiError(401, "Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(
      password,
      env.adminPasswordHash,
    );
    if (!isValidPassword) {
      logSecurityEvent("ADMIN_LOGIN_FAILED", req, {
        reason: "password_mismatch",
        attemptedEmail: normalizedEmail,
      });
      throw new ApiError(401, "Invalid credentials");
    }

    const token = jwt.sign(
      { email: env.adminEmail, role: "admin" },
      env.jwtSecret,
      {
        expiresIn: env.jwtExpiresIn,
      },
    );

    logSecurityEvent("ADMIN_LOGIN_SUCCESS", req, {
      email: normalizedEmail,
    });

    sendResponse(res, 200, "Admin login successful", {
      token,
      admin: {
        email: env.adminEmail,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyAdminSession = (req, res) => {
  sendResponse(res, 200, "Token is valid", {
    email: req.user.email,
    role: req.user.role,
  });
};
