import { env } from "../config/env.js";

export function getHealthStatus(_request, response) {
  response.status(200).json({
    status: "ok",
    service: "nikhil-agrahari-portfolio-api",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}
