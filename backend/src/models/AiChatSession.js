import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, default: "" },
    timestamp: { type: Number, default: Date.now },
    type: { type: String, enum: ["text", "image"], default: "text" },
    image: {
      status: { type: String, default: "" },
      prompt: { type: String, default: "" },
      dataUrl: { type: String, default: "" },
      model: { type: mongoose.Schema.Types.Mixed, default: null },
      durationMs: { type: Number, default: 0 },
      quota: { type: mongoose.Schema.Types.Mixed, default: null },
      error: { type: String, default: "" },
      requireAuth: { type: Boolean, default: false },
    },
    isError: { type: Boolean, default: false },
  },
  { _id: false }
);

const aiChatSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      default: "New chat",
    },
    messages: [messageSchema],
    pinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

aiChatSessionSchema.index({ userId: 1, updatedAt: -1 });
aiChatSessionSchema.index({ userId: 1, pinned: -1, updatedAt: -1 });

const AiChatSession = mongoose.model("AiChatSession", aiChatSessionSchema);

export default AiChatSession;
