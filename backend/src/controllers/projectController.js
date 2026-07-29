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
    const { category, search, featured, limit } = req.query;

    if (!isDatabaseReady(req)) {
      let filtered = [...STATIC_PROJECTS];
      if (category && category !== "All") {
        filtered = filtered.filter((p) => p.category === category);
      }
      if (featured === "true") {
        filtered = filtered.filter((p) => p.featured);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            (p.techStack && p.techStack.some((t) => t.toLowerCase().includes(q))),
        );
      }
      const parsedLimit = Number(limit) > 0 ? Math.min(Number(limit), 30) : 100;
      sendResponse(
        res,
        200,
        "Projects fetched successfully",
        filtered.slice(0, parsedLimit),
      );
      return;
    }

    const filters = { status: "published" };

    if (category && category !== "All") {
      filters.category = category;
    }

    if (featured === "true") {
      filters.featured = true;
    }

    if (search) {
      Object.assign(filters, createSearchFilter(search.trim()));
    }

    const parsedLimit = Number(limit) > 0 ? Math.min(Number(limit), 30) : 100;

    let projects = [];
    try {
      projects = await Project.find(filters)
        .sort({ createdAt: -1 })
        .limit(parsedLimit);
    } catch (dbErr) {
      console.warn("[ProjectController] DB find error:", dbErr.message);
    }

    // Merge or fallback to static signature projects if DB is empty for this query
    if (!projects || projects.length === 0) {
      projects = STATIC_PROJECTS.filter((p) => {
        if (category && category !== "All" && p.category !== category) return false;
        if (featured === "true" && !p.featured) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
          );
        }
        return true;
      }).slice(0, parsedLimit);
    }

    sendResponse(res, 200, "Projects fetched successfully", projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    let project = null;

    if (isDatabaseReady(req)) {
      try {
        const query = mongoose.Types.ObjectId.isValid(slug)
          ? { $or: [{ slug }, { _id: slug }], status: "published" }
          : { slug, status: "published" };

        project = await Project.findOne(query);
      } catch (dbError) {
        console.warn(`[ProjectController] DB query error for '${slug}':`, dbError.message);
      }
    }

    // Fallback to static signature projects if not found in MongoDB
    if (!project) {
      project = STATIC_PROJECTS.find((item) => item.slug === slug) || null;
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
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
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
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      throw new ApiError(404, "Project not found");
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
