import Project from "../models/Project.js";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { logSecurityEvent } from "../utils/securityAudit.js";
import { STATIC_PROJECTS } from "../constants/staticProjects.js";

const createSearchFilter = (search) => ({
  $or: [
    { title: { $regex: search, $options: "i" } },
    { description: { $regex: search, $options: "i" } },
    { techStack: { $regex: search, $options: "i" } },
  ],
});

const isDatabaseReady = (req) => {
  const ready = mongoose.connection.readyState === 1;
  req.app.locals.dbConnected = ready;
  return ready;
};

export const getProjects = async (req, res, next) => {
  try {
    const { category, search, featured, limit, includeDrafts } = req.query;
    const includeAll = includeDrafts === "true";

    let dbProjects = [];
    if (isDatabaseReady(req)) {
      try {
        dbProjects = await Project.find({}).sort({ createdAt: -1 }).lean();
      } catch (dbErr) {
        console.warn("[ProjectController] DB find error:", dbErr.message);
      }
    }

    // Merge static signature projects with DB overrides/creations by slug
    const mergedMap = new Map();
    STATIC_PROJECTS.forEach((p) => {
      mergedMap.set(p.slug, { ...p, status: p.status || "published" });
    });

    dbProjects.forEach((doc) => {
      const slugKey = doc.slug || String(doc._id);
      const base = mergedMap.get(slugKey) || {};
      mergedMap.set(slugKey, { ...base, ...doc });
    });

    let combined = Array.from(mergedMap.values());

    if (!includeAll) {
      combined = combined.filter((p) => p.status !== "draft");
    }

    if (category && category !== "All") {
      combined = combined.filter(
        (p) => (p.category || "").toLowerCase() === category.toLowerCase(),
      );
    }

    if (featured === "true") {
      combined = combined.filter((p) => Boolean(p.featured));
    }

    if (search) {
      const q = search.trim().toLowerCase();
      combined = combined.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q) ||
          (p.tagline || "").toLowerCase().includes(q) ||
          (Array.isArray(p.techStack) &&
            p.techStack.some((t) => String(t).toLowerCase().includes(q))),
      );
    }

    const parsedLimit = Number(limit) > 0 ? Math.min(Number(limit), 100) : 100;
    sendResponse(
      res,
      200,
      "Projects fetched successfully",
      combined.slice(0, parsedLimit),
    );
  } catch (error) {
    next(error);
  }
};

export const getProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    let project = null;
    const staticMatch = STATIC_PROJECTS.find((item) => item.slug === slug) || null;

    if (isDatabaseReady(req)) {
      try {
        const query = mongoose.Types.ObjectId.isValid(slug)
          ? { $or: [{ slug }, { _id: slug }] }
          : { slug };

        const dbProject = await Project.findOne(query).lean();
        if (dbProject) {
          if (dbProject.status === "draft") {
            throw new ApiError(404, "Project not found");
          }
          project = staticMatch ? { ...staticMatch, ...dbProject } : dbProject;
        }
      } catch (dbError) {
        if (dbError instanceof ApiError) throw dbError;
        console.warn(`[ProjectController] DB query error for '${slug}':`, dbError.message);
      }
    }

    if (!project) {
      project = staticMatch;
    }

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    sendResponse(res, 200, "Project fetched successfully", project);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    logSecurityEvent("ADMIN_PROJECT_CREATED", req, {
      projectId: project.id,
      slug: project.slug,
      title: project.title,
    });
    sendResponse(res, 201, "Project created successfully", project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const identifier = req.params.id;
    let project = null;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      project = await Project.findByIdAndUpdate(identifier, req.body, {
        new: true,
        runValidators: true,
      });
    }

    if (!project) {
      const slugToUse = req.body.slug || identifier;
      const staticSeed = STATIC_PROJECTS.find((item) => item.slug === slugToUse || item.slug === identifier);
      const mergedPayload = {
        ...(staticSeed ? { slug: staticSeed.slug, tags: staticSeed.tags } : {}),
        ...req.body,
        slug: staticSeed?.slug || slugToUse,
      };
      project = await Project.findOneAndUpdate(
        { slug: mergedPayload.slug },
        mergedPayload,
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
      );
    }

    logSecurityEvent("ADMIN_PROJECT_UPDATED", req, {
      projectId: project.id,
      slug: project.slug,
      title: project.title,
    });

    sendResponse(res, 200, "Project updated successfully", project);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const identifier = req.params.id;
    let project = null;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      project = await Project.findByIdAndDelete(identifier);
    } else {
      project = await Project.findOneAndDelete({ slug: identifier });
    }

    // If this was a static signature project, persist a draft tombstone so it hides from public portfolio
    if (!project) {
      const staticSeed = STATIC_PROJECTS.find((item) => item.slug === identifier);
      if (!staticSeed) {
        throw new ApiError(404, "Project not found");
      }
      await Project.findOneAndUpdate(
        { slug: staticSeed.slug },
        {
          title: staticSeed.title,
          slug: staticSeed.slug,
          description: staticSeed.description || staticSeed.tagline || staticSeed.title,
          category: ["Full Stack", "Web Dev", "Cyber Security", "AI", "Python"].includes(staticSeed.category)
            ? staticSeed.category
            : "Web Dev",
          techStack: staticSeed.tags?.length ? staticSeed.tags : ["Web"],
          status: "draft",
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
      logSecurityEvent("ADMIN_PROJECT_HIDDEN", req, { slug: staticSeed.slug, title: staticSeed.title });
      sendResponse(res, 200, "Project removed from public portfolio");
      return;
    }

    logSecurityEvent("ADMIN_PROJECT_DELETED", req, {
      projectId: project.id,
      slug: project.slug,
      title: project.title,
    });

    sendResponse(res, 200, "Project deleted successfully");
  } catch (error) {
    next(error);
  }
};
