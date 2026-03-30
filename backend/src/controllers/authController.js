import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { env } from "../config/env.js";

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    if (normalizedEmail !== env.adminEmail) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(
      password,
      env.adminPasswordHash,
    );
    if (!isValidPassword) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = jwt.sign(
      { email: env.adminEmail, role: "admin" },
      env.jwtSecret,
      {
        expiresIn: env.jwtExpiresIn,
      },
    );

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
