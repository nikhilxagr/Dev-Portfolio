import mongoose from "mongoose";

const siteContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "main",
      trim: true,
    },
    sections: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

const SiteContent = mongoose.model("SiteContent", siteContentSchema);

export default SiteContent;
