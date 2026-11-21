import mongoose from "mongoose";

export const AUTH_USER_DAILY_IMAGE_LIMIT = 10;
export const GUEST_TRIAL_IMAGE_LIMIT = 2;

const getTodayDateString = () => {
  // Use UTC YYYY-MM-DD for deterministic midnight resets
  const now = new Date();
  return now.toISOString().slice(0, 10);
};

const getTomorrowResetDate = () => {
  const tomorrow = new Date();
  tomorrow.setUTCHours(24, 0, 0, 0);
  return tomorrow;
};

const aiImageUsageSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
      default: getTodayDateString,
    },
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastPrompt: {
      type: String,
      default: "",
      maxlength: 500,
    },
    lastModel: {
      type: String,
      default: "flux-2-dev",
    },
    lastGeneratedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index ensuring one record per user/session per day
aiImageUsageSchema.index({ identifier: 1, date: 1 }, { unique: true });

// Static helper to get usage status (authenticated users get 10 daily; guests get 2 trial credits)
aiImageUsageSchema.statics.getQuotaStatus = async function (identifier, isAuthenticated = false) {
  const limit = isAuthenticated ? AUTH_USER_DAILY_IMAGE_LIMIT : GUEST_TRIAL_IMAGE_LIMIT;
  const today = getTodayDateString();

  let used = 0;
  if (isAuthenticated) {
    const record = await this.findOne({ identifier, date: today }).lean();
    used = record ? record.count : 0;
  } else {
    // For guests, check lifetime trial usage across all records for this identifier
    const records = await this.find({ identifier }).lean();
    used = records.reduce((sum, r) => sum + (r.count || 0), 0);
  }

  const remaining = Math.max(0, limit - used);
  const requireAuth = !isAuthenticated && remaining <= 0;

  return {
    limit,
    used,
    remaining,
    canGenerate: remaining > 0,
    requireAuth,
    isAuthenticated,
    resetsAt: isAuthenticated ? getTomorrowResetDate().toISOString() : null,
    date: today,
  };
};

// Static helper to atomically record successful generation
aiImageUsageSchema.statics.recordSuccess = async function (
  identifier,
  prompt = "",
  isAuthenticated = false,
  modelKey = "flux-2-dev"
) {
  const limit = isAuthenticated ? AUTH_USER_DAILY_IMAGE_LIMIT : GUEST_TRIAL_IMAGE_LIMIT;
  const today = getTodayDateString();
  const safePrompt = String(prompt).slice(0, 500);

  const updated = await this.findOneAndUpdate(
    { identifier, date: today },
    {
      $inc: { count: 1 },
      $set: {
        lastPrompt: safePrompt,
        lastModel: String(modelKey || "flux-2-dev"),
        lastGeneratedAt: new Date(),
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  let used = updated.count;
  if (!isAuthenticated) {
    const records = await this.find({ identifier }).lean();
    used = records.reduce((sum, r) => sum + (r.count || 0), 0);
  }

  const remaining = Math.max(0, limit - used);

  return {
    limit,
    used,
    remaining,
    canGenerate: remaining > 0,
    requireAuth: !isAuthenticated && remaining <= 0,
    isAuthenticated,
    resetsAt: isAuthenticated ? getTomorrowResetDate().toISOString() : null,
  };
};

const AiImageUsage = mongoose.model("AiImageUsage", aiImageUsageSchema);

export default AiImageUsage;

