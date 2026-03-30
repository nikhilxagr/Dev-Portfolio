import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

async function startServer() {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      console.log(
        `Portfolio API server running on http://localhost:${env.PORT}`,
      );
    });
  } catch (error) {
    console.error("Failed to start the server.", error);
    process.exit(1);
  }
}

startServer();
