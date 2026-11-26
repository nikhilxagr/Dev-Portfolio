import mongoose from "mongoose";

const toEntrySlug = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const journeyEntrySchema = new mongoose.Schema(
  {
    entryId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    year: {
      type: Number,
      required: true,
      min: 2015,
      max: 2100,
    },
    category: {
      type: String,
      trim: true,
      default: "Certifications",
    },
    mode: {
      type: String,
      trim: true,
      default: "Online",
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 160,
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "Milestone",
    },
    organization: {
      type: String,
      trim: true,
      maxlength: 160,
      default: "",
    },
    duration: {
      type: String,
      trim: true,
      maxlength: 40,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    imageFit: {
      type: String,
      enum: ["cover", "contain", "contain-dark"],
      default: "cover",
    },
    hasCertificate: {
      type: Boolean,
      default: false,
    },
    certificateUrl: {
      type: String,
      trim: true,
      default: "",
    },
    tag: {
      type: String,
      trim: true,
      maxlength: 60,
      default: "Milestone",
    },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

journeyEntrySchema.pre("validate", function journeyIdHook(next) {
  if (!this.entryId && this.title) {
    const base = toEntrySlug(this.title) || "milestone";
    this.entryId = `${base}-${this.year || new Date().getFullYear()}`;
  }
  next();
});

journeyEntrySchema.index({ year: 1, duration: 1 });

const JourneyEntry = mongoose.model("JourneyEntry", journeyEntrySchema);

export default JourneyEntry;
