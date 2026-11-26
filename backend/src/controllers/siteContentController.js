import mongoose from "mongoose";
import SiteContent from "../models/SiteContent.js";
import ApiError from "../utils/ApiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { logSecurityEvent } from "../utils/securityAudit.js";

const ALLOWED_SECTIONS = new Set(["profile", "about", "skills", "contact", "services"]);

const isDatabaseReady = (req) => {
  const ready = mongoose.connection.readyState === 1;
  req.app.locals.dbConnected = ready;
  return ready;
};

export const getSiteContent = async (req, res, next) => {
  try {
    if (!isDatabaseReady(req)) {
      sendResponse(res, 200, "Site content loaded in default mode", { sections: {} });
      return;
    }

    const doc = await SiteContent.findOne({ key: "main" }).lean();
    sendResponse(res, 200, "Site content fetched successfully", {
      sections: doc?.sections || {},
      updatedAt: doc?.updatedAt || null,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSiteContent = async (req, res, next) => {
  try {
    const incomingSections = req.body?.sections;
    if (!incomingSections || typeof incomingSections !== "object" || Array.isArray(incomingSections)) {
      throw new ApiError(400, "sections object is required");
    }

    const existing = await SiteContent.findOne({ key: "main" }).lean();
    const mergedSections = { ...(existing?.sections || {}) };

    Object.entries(incomingSections).forEach(([sectionKey, sectionValue]) => {
      if (!ALLOWED_SECTIONS.has(sectionKey)) return;
      if (sectionValue && typeof sectionValue === "object") {
        mergedSections[sectionKey] = sectionValue;
      }
    });

    const updated = await SiteContent.findOneAndUpdate(
      { key: "main" },
      { key: "main", sections: mergedSections },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).lean();

    logSecurityEvent("ADMIN_SITE_CONTENT_UPDATED", req, {
      updatedKeys: Object.keys(incomingSections).filter((k) => ALLOWED_SECTIONS.has(k)),
    });

    sendResponse(res, 200, "Portfolio site content updated successfully", {
      sections: updated.sections || {},
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};
