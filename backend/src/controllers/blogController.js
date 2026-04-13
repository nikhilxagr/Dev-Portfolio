import Blog from "../models/Blog.js";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { logSecurityEvent } from "../utils/securityAudit.js";

const createSearchFilter = (search) => ({
  $or: [
    { title: { $regex: search, $options: "i" } },
    { content: { $regex: search, $options: "i" } },
    { tags: { $regex: search, $options: "i" } },
  ],
});

const isDatabaseReady = (req) => {
  const ready = mongoose.connection.readyState === 1;
  req.app.locals.dbConnected = ready;
  return ready;
};

export const getBlogs = async (req, res, next) => {
  try {
    if (!isDatabaseReady(req)) {
      sendResponse(
        res,
        200,
        "Blogs service is running in fallback mode while database reconnects.",
        [],
      );
      return;
    }

    const { search, limit } = req.query;
    const filters = { status: "published" };

    if (search) {
      Object.assign(filters, createSearchFilter(search.trim()));
    }

    const parsedLimit = Number(limit) > 0 ? Math.min(Number(limit), 50) : 100;
    const blogs = await Blog.find(filters)
      .sort({ publishedAt: -1 })
      .limit(parsedLimit);

    sendResponse(res, 200, "Blogs fetched successfully", blogs);
  } catch (error) {
    next(error);
  }
};

export const getBlogBySlug = async (req, res, next) => {
  try {
    if (!isDatabaseReady(req)) {
      throw new ApiError(
        503,
        "Blog details are temporarily unavailable while database reconnects.",
      );
    }

    const { slug } = req.params;
    const query = mongoose.Types.ObjectId.isValid(slug)
      ? { $or: [{ slug }, { _id: slug }], status: "published" }
      : { slug, status: "published" };

    const blog = await Blog.findOne(query);

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    sendResponse(res, 200, "Blog fetched successfully", blog);
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body);
    logSecurityEvent("ADMIN_BLOG_CREATED", req, {
      blogId: blog.id,
      slug: blog.slug,
      title: blog.title,
    });
    sendResponse(res, 201, "Blog created successfully", blog);
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    logSecurityEvent("ADMIN_BLOG_UPDATED", req, {
      blogId: blog.id,
      slug: blog.slug,
      title: blog.title,
    });

    sendResponse(res, 200, "Blog updated successfully", blog);
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    logSecurityEvent("ADMIN_BLOG_DELETED", req, {
      blogId: blog.id,
      slug: blog.slug,
      title: blog.title,
    });

    sendResponse(res, 200, "Blog deleted successfully");
  } catch (error) {
    next(error);
  }
};
