import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { logSecurityEvent } from "../utils/securityAudit.js";

export const getAdminUsers = async (req, res, next) => {
  try {
    const { search = "", provider = "all", limit = "100" } = req.query;
    const filters = {};

    if (provider === "google" || provider === "local") {
      filters.authProvider = provider;
    }

    if (search.trim()) {
      const q = search.trim();
      filters.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
      ];
    }

    const parsedLimit = Number(limit) > 0 ? Math.min(Number(limit), 200) : 100;
    const users = await User.find(filters)
      .select("-passwordHash -__v")
      .sort({ lastLoginAt: -1, createdAt: -1 })
      .limit(parsedLimit)
      .lean();

    sendResponse(res, 200, "Registered users fetched successfully", users);
  } catch (error) {
    next(error);
  }
};

export const updateAdminUser = async (req, res, next) => {
  try {
    const allowedFields = [
      "name",
      "email",
      "phone",
      "bio",
      "location",
      "website",
      "avatar",
      "isEmailVerified",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      throw new ApiError(400, "No valid user fields provided for update");
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .select("-passwordHash -__v")
      .lean();

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    logSecurityEvent("ADMIN_USER_UPDATED", req, {
      targetUserId: req.params.id,
      email: user.email,
      fields: Object.keys(updates),
    });

    sendResponse(res, 200, "User details updated successfully", user);
  } catch (error) {
    if (error?.code === 11000) {
      next(new ApiError(409, "A user with this email already exists"));
      return;
    }
    next(error);
  }
};

export const deleteAdminUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).lean();
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    logSecurityEvent("ADMIN_USER_DELETED", req, {
      targetUserId: req.params.id,
      email: user.email,
    });

    sendResponse(res, 200, "User account removed");
  } catch (error) {
    next(error);
  }
};
