import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120,
  },
  userAvatar: {
    type: String,
    default: "",
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const articleInteractionSchema = new mongoose.Schema(
  {
    articleId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

const ArticleInteraction = mongoose.model(
  "ArticleInteraction",
  articleInteractionSchema
);

export default ArticleInteraction;
