import mongoose from "mongoose";

import { env } from "./env.js";

export async function connectDatabase() {
  if (!env.MONGODB_URI) {
    console.warn(
      "MongoDB connection skipped because MONGODB_URI is not configured yet.",
    );
    return;
  }

  await mongoose.connect(env.MONGODB_URI);
  console.log("MongoDB connected successfully.");
}
