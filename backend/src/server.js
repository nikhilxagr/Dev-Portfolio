import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/db.js";
import { ensurePaymentTransactionIndexes } from "./models/PaymentTransaction.js";

let server;
let reconnectTimerId = null;

const DB_RECONNECT_INTERVAL_MS = 15000;

const canStartWithoutDatabase = () =>
  env.nodeEnv === "development" || env.allowStartWithoutDb;

const clearReconnectTimer = () => {
  if (!reconnectTimerId) {
    return;
  }

  clearInterval(reconnectTimerId);
  reconnectTimerId = null;
};

const connectAndPrepareDatabase = async () => {
  await connectDatabase();
  await ensurePaymentTransactionIndexes();
};

const scheduleReconnect = () => {
  if (reconnectTimerId) {
    return;
  }

  reconnectTimerId = setInterval(async () => {
    if (app.locals.dbConnected === true) {
      clearReconnectTimer();
      return;
    }

    try {
      await connectAndPrepareDatabase();
      app.locals.dbConnected = true;
      console.log("Database reconnected");
      clearReconnectTimer();
    } catch (error) {
      console.warn(`Database reconnect attempt failed: ${error.message}`);
    }
  }, DB_RECONNECT_INTERVAL_MS);
};

const startServer = async () => {
  let dbConnected = false;

  try {
    await connectAndPrepareDatabase();
    dbConnected = true;
    console.log("Database connected and indexes ensured");
  } catch (error) {
    if (!canStartWithoutDatabase()) {
      throw error;
    }

    console.warn(
      "Database connection failed. Starting backend in limited mode because ALLOW_START_WITHOUT_DB is enabled.",
    );
    console.warn(`MongoDB error: ${error.message}`);
    scheduleReconnect();
  }

  app.locals.dbConnected = dbConnected;

  server = app.listen(env.port, () => {
    console.log(`Backend running on port ${env.port}`);
  });
};

const gracefulShutdown = async (signal) => {
  console.log(`${signal} received. Closing server...`);
  clearReconnectTimer();

  if (server) {
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

startServer().catch((error) => {
  console.error("Failed to start backend:", error);

  if (error?.name === "MongooseServerSelectionError") {
    console.error(
      "MongoDB Atlas connection failed. Verify Atlas Network Access (IP allowlist), cluster status (not paused), and MongoDB user credentials.",
    );
  }

  process.exit(1);
});
