import Project from "../models/Project.js";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import { sendResponse } from "../utils/apiResponse.js";

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
    if (!isDatabaseReady(req)) {
      sendResponse(
        res,
        200,
        "Projects service is running in fallback mode while database reconnects.",
        [],
      );
      return;
    }

    const { category, search, featured, limit } = req.query;
    const filters = { status: "published" };

    if (category) {
      filters.category = category;
    }

    if (featured === "true") {
      filters.featured = true;
    }

    if (search) {
      Object.assign(filters, createSearchFilter(search.trim()));
    }

    const parsedLimit = Number(limit) > 0 ? Math.min(Number(limit), 30) : 100;

    const projects = await Project.find(filters)
      .sort({ createdAt: -1 })
      .limit(parsedLimit);

    sendResponse(res, 200, "Projects fetched successfully", projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectBySlug = async (req, res, next) => {
  try {
    if (!isDatabaseReady(req)) {
      throw new ApiError(
        503,
        "Project details are temporarily unavailable while database reconnects.",
      );
    }

    const { slug } = req.params;
    const query = mongoose.Types.ObjectId.isValid(slug)
      ? { $or: [{ slug }, { _id: slug }], status: "published" }
      : { slug, status: "published" };

    const project = await Project.findOne(query);

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

    sendResponse(res, 200, "Project deleted successfully");
  } catch (error) {
    next(error);
  }
};
