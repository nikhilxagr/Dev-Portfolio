import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import xss from "xss";
import { env } from "../config/env.js";

const sanitizePayload = (value, parentKey = "") => {
  if (typeof value === "string") {
    if (parentKey.toLowerCase().includes("password")) {
      return value;
    }
    return xss(value.trim());
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizePayload(item, parentKey));
  }

  if (value && typeof value === "object") {
    return Object.keys(value).reduce((accumulator, key) => {
      accumulator[key] = sanitizePayload(value[key], key);
      return accumulator;
    }, {});
  }

  return value;
};

const sanitizeObjectInPlace = (target) => {
  if (!target || typeof target !== "object") {
    return;
  }

  for (const key of Object.keys(target)) {
    target[key] = sanitizePayload(target[key], key);
  }
};

const sanitizeNoSqlKeysInPlace = (target) => {
  if (!target || typeof target !== "object") {
    return;
  }

  if (Array.isArray(target)) {
    for (const item of target) {
      sanitizeNoSqlKeysInPlace(item);
    }
    return;
  }

  for (const key of Object.keys(target)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete target[key];
      continue;
    }

    sanitizeNoSqlKeysInPlace(target[key]);
  }
};

export const xssSanitizeMiddleware = (req, _res, next) => {
  sanitizeObjectInPlace(req.body);
  sanitizeObjectInPlace(req.query);
  sanitizeObjectInPlace(req.params);
  next();
};

export const noSqlSanitizeMiddleware = (req, _res, next) => {
  sanitizeNoSqlKeysInPlace(req.body);
  sanitizeNoSqlKeysInPlace(req.query);
  sanitizeNoSqlKeysInPlace(req.params);
  next();
};

export const applySecurityMiddleware = (app) => {
  app.use(
    cors({
      origin: (origin, callback) => {
        const normalizedOrigin = origin ? origin.replace(/\/+$/, "") : "";
        const isAllowedByList =
          !normalizedOrigin || env.allowedOrigins.includes(normalizedOrigin);
        const isAllowedByRegex =
          Boolean(normalizedOrigin) &&
          Boolean(env.allowedOriginRegex) &&
          env.allowedOriginRegex.test(normalizedOrigin);

        if (isAllowedByList || isAllowedByRegex) {
          callback(null, true);
          return;
        }
        callback(new Error("CORS policy blocked this origin"));
      },
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    }),
  );

  app.use(helmet());
  app.use(hpp());
  app.use(compression());
  app.use(noSqlSanitizeMiddleware);
  app.use(xssSanitizeMiddleware);
};
