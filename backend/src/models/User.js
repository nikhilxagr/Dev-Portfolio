import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 160,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    avatar: {
      type: String,
      default: "",
      trim: true,
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
    },
    authProvider: {
      type: String,
      enum: ["google", "local"],
      default: "local",
    },
    passwordHash: {
      type: String,
      default: "",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user"],
      default: "user",
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ createdAt: -1 });

const User = mongoose.model("User", userSchema);

export default User;
