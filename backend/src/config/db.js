import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "./env.js";

// Ensure Node.js uses reliable DNS servers for MongoDB Atlas SRV resolution
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore fallback if custom DNS setup is unavailable
}


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
