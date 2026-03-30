import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 24,
      default: "",
    },
    service: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1200,
    },
    status: {
      type: String,
      enum: ["new", "read"],
      default: "new",
    },
  },
  {
    timestamps: true,
  },
);

contactSchema.index({ createdAt: -1 });

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
