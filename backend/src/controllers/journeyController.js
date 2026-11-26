import mongoose from "mongoose";
import JourneyEntry from "../models/JourneyEntry.js";
import ApiError from "../utils/ApiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { logSecurityEvent } from "../utils/securityAudit.js";

const isDatabaseReady = (req) => {
  const ready = mongoose.connection.readyState === 1;
  req.app.locals.dbConnected = ready;
  return ready;
};

export const getJourneyEntries = async (req, res, next) => {
  try {
    if (!isDatabaseReady(req)) {
      sendResponse(res, 200, "Journey entries loaded in static fallback mode.", []);
      return;
    }

    const includeAll = req.query.includeDrafts === "true";
    const filters = includeAll ? {} : { status: "published" };

    const entries = await JourneyEntry.find(filters)
      .sort({ year: 1, duration: 1, createdAt: 1 })
      .lean();

    sendResponse(res, 200, "Journey entries fetched successfully", entries);
  } catch (error) {
    next(error);
  }
};

export const createJourneyEntry = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (payload.id && !payload.entryId) {
      payload.entryId = payload.id;
    }
    const entry = await JourneyEntry.create(payload);
    logSecurityEvent("ADMIN_JOURNEY_CREATED", req, {
      entryId: entry.entryId,
      title: entry.title,
    });
    sendResponse(res, 201, "Journey milestone created successfully", entry);
  } catch (error) {
    next(error);
  }
};

export const updateJourneyEntry = async (req, res, next) => {
  try {
    const identifier = req.params.id;
    const payload = { ...req.body };
    if (payload.id && !payload.entryId) {
      payload.entryId = payload.id;
    }

    let entry = null;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      entry = await JourneyEntry.findByIdAndUpdate(identifier, payload, {
        new: true,
        runValidators: true,
      });
    }

    if (!entry) {
      const entryId = (payload.entryId || identifier).toLowerCase();
      entry = await JourneyEntry.findOneAndUpdate(
        { entryId },
        { ...payload, entryId },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
      );
    }

    logSecurityEvent("ADMIN_JOURNEY_UPDATED", req, {
      entryId: entry.entryId,
      title: entry.title,
    });

    sendResponse(res, 200, "Journey milestone updated successfully", entry);
  } catch (error) {
    next(error);
  }
};

export const deleteJourneyEntry = async (req, res, next) => {
  try {
    const identifier = req.params.id;
    let entry = null;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      entry = await JourneyEntry.findByIdAndDelete(identifier);
    } else {
      entry = await JourneyEntry.findOneAndDelete({ entryId: identifier.toLowerCase() });
    }

    if (!entry) {
      await JourneyEntry.findOneAndUpdate(
        { entryId: identifier.toLowerCase() },
        {
          entryId: identifier.toLowerCase(),
          year: Number(req.query.year) || 2025,
          title: String(req.query.title || identifier).slice(0, 150),
          description: "Hidden from public journey timeline.",
          status: "draft",
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
      logSecurityEvent("ADMIN_JOURNEY_HIDDEN", req, { entryId: identifier });
      sendResponse(res, 200, "Milestone hidden from public timeline");
      return;
    }

    logSecurityEvent("ADMIN_JOURNEY_DELETED", req, {
      entryId: entry.entryId,
      title: entry.title,
    });

    sendResponse(res, 200, "Journey milestone deleted successfully");
  } catch (error) {
    next(error);
  }
};
