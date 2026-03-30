import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDatabase = async () => {
  await mongoose.connect(env.mongoUri, {
    maxPoolSize: env.dbMaxPoolSize,
    minPoolSize: env.dbMinPoolSize,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
  });
};

export const disconnectDatabase = async () => {
  await mongoose.connection.close();
};
