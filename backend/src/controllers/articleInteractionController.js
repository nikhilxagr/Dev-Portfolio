import mongoose from "mongoose";
import ArticleInteraction from "../models/ArticleInteraction.js";
import ApiError from "../utils/ApiError.js";
import { sendResponse } from "../utils/apiResponse.js";

const isDatabaseReady = (req) => {
  const ready = mongoose.connection.readyState === 1;
  req.app.locals.dbConnected = ready;
  return ready;
};

// GET /api/articles/:articleId/interactions (Public, optional auth for hasLiked status)
export const getArticleInteractions = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    if (!articleId) {
      throw new ApiError(400, "Article ID is required");
    }

    const cleanArticleId = articleId.toLowerCase().trim();

    if (!isDatabaseReady(req)) {
      sendResponse(res, 200, "Interactions retrieved (offline mode)", {
        articleId: cleanArticleId,
        likesCount: 0,
        hasLiked: false,
        comments: [],
      });
      return;
    }

    const interaction = await ArticleInteraction.findOne({ articleId: cleanArticleId });

    if (!interaction) {
      sendResponse(res, 200, "Interactions retrieved", {
        articleId: cleanArticleId,
        likesCount: 0,
        hasLiked: false,
        comments: [],
      });
      return;
    }

    const currentUserId = req.user?._id ? req.user._id.toString() : null;
    const hasLiked = currentUserId
      ? interaction.likes.some((id) => id.toString() === currentUserId)
      : false;

    // Return comments sorted newest first
    const comments = [...interaction.comments].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    sendResponse(res, 200, "Interactions retrieved", {
      articleId: cleanArticleId,
      likesCount: interaction.likes.length,
      hasLiked,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/articles/:articleId/like (Requires User Auth)
export const toggleArticleLike = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    if (!articleId) {
      throw new ApiError(400, "Article ID is required");
    }

    if (!req.user) {
      throw new ApiError(401, "Sign in required to like this article");
    }

    const cleanArticleId = articleId.toLowerCase().trim();

    if (!isDatabaseReady(req)) {
      throw new ApiError(503, "Database is temporarily unavailable");
    }

    let interaction = await ArticleInteraction.findOne({ articleId: cleanArticleId });

    if (!interaction) {
      interaction = new ArticleInteraction({
        articleId: cleanArticleId,
        likes: [],
        comments: [],
      });
    }

    const currentUserId = req.user._id.toString();
    const alreadyLikedIndex = interaction.likes.findIndex(
      (id) => id.toString() === currentUserId
    );

    let hasLiked = false;

    if (alreadyLikedIndex > -1) {
      interaction.likes.splice(alreadyLikedIndex, 1);
      hasLiked = false;
    } else {
      interaction.likes.push(req.user._id);
      hasLiked = true;
    }

    await interaction.save();

    sendResponse(res, 200, hasLiked ? "Article liked" : "Article unliked", {
      articleId: cleanArticleId,
      hasLiked,
      likesCount: interaction.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/articles/:articleId/comments (Requires User Auth)
export const addArticleComment = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { content } = req.body;

    if (!articleId) {
      throw new ApiError(400, "Article ID is required");
    }

    if (!req.user) {
      throw new ApiError(401, "Sign in required to comment");
    }

    const cleanContent = typeof content === "string" ? content.trim() : "";
    if (!cleanContent) {
      throw new ApiError(400, "Comment content cannot be empty");
    }

    if (cleanContent.length > 1000) {
      throw new ApiError(400, "Comment cannot exceed 1000 characters");
    }

    const cleanArticleId = articleId.toLowerCase().trim();

    if (!isDatabaseReady(req)) {
      throw new ApiError(503, "Database is temporarily unavailable");
    }

    let interaction = await ArticleInteraction.findOne({ articleId: cleanArticleId });

    if (!interaction) {
      interaction = new ArticleInteraction({
        articleId: cleanArticleId,
        likes: [],
        comments: [],
      });
    }

    const newComment = {
      userId: req.user._id,
      userName: req.user.name || "Anonymous",
      userAvatar: req.user.avatar || "",
      content: cleanContent,
      createdAt: new Date(),
    };

    interaction.comments.push(newComment);
    await interaction.save();

    const savedComment = interaction.comments[interaction.comments.length - 1];

    sendResponse(res, 201, "Comment added successfully", {
      comment: savedComment,
      commentsCount: interaction.comments.length,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/articles/:articleId/comments/:commentId (Requires User Auth)
export const deleteArticleComment = async (req, res, next) => {
  try {
    const { articleId, commentId } = req.params;

    if (!articleId || !commentId) {
      throw new ApiError(400, "Article ID and Comment ID are required");
    }

    if (!req.user) {
      throw new ApiError(401, "Sign in required");
    }

    const cleanArticleId = articleId.toLowerCase().trim();

    if (!isDatabaseReady(req)) {
      throw new ApiError(503, "Database is temporarily unavailable");
    }

    const interaction = await ArticleInteraction.findOne({ articleId: cleanArticleId });
    if (!interaction) {
      throw new ApiError(404, "Article interactions not found");
    }

    const comment = interaction.comments.id(commentId);
    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    // Only allow comment creator or admin to delete
    const isOwner = comment.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new ApiError(403, "You do not have permission to delete this comment");
    }

    interaction.comments.pull({ _id: commentId });
    await interaction.save();

    sendResponse(res, 200, "Comment deleted successfully", {
      commentId,
      commentsCount: interaction.comments.length,
    });
  } catch (error) {
    next(error);
  }
};
