import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import xss from "xss";
import { env } from "../config/env.js";

const isBinaryLike = (value) =>
  Buffer.isBuffer(value) ||
  (ArrayBuffer.isView(value) && !(value instanceof DataView));

const sanitizePayload = (value, parentKey = "") => {
  if (isBinaryLike(value)) {
    return value;
  }

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
  if (!target || typeof target !== "object" || isBinaryLike(target)) {
    return;
  }

  for (const key of Object.keys(target)) {
    target[key] = sanitizePayload(target[key], key);
  }
};

const sanitizeNoSqlKeysInPlace = (target) => {
  if (!target || typeof target !== "object" || isBinaryLike(target)) {
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
        const isDevLocalhost =
          env.nodeEnv !== "production" &&
          Boolean(normalizedOrigin) &&
          /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin);
        const isAllowedByList =
          !normalizedOrigin || env.allowedOrigins.includes(normalizedOrigin);
        const isAllowedByRegex =
          Boolean(normalizedOrigin) &&
          Boolean(env.allowedOriginRegex) &&
          env.allowedOriginRegex.test(normalizedOrigin);

        if (isAllowedByList || isAllowedByRegex || isDevLocalhost) {
          callback(null, true);
          return;
        }
        callback(new Error("CORS policy blocked this origin"));
      },
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      maxAge: 3600,
    }),
  );

  app.use((_req, res, next) => {
    res.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), payment=(self \"https://sdk.cashfree.com\")",
    );
    next();
  });

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          baseUri: ["'self'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
          formAction: [
            "'self'",
            "https://accounts.google.com",
            "https://api.cashfree.com",
            "https://cashfree.com",
            "https://*.cashfree.com",
          ],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            "https://accounts.google.com",
            "https://ssl.gstatic.com",
            "https://sdk.cashfree.com",
            "https://va.vercel-scripts.com",
          ],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          imgSrc: ["'self'", "data:", "blob:", "https:"],
          fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
          connectSrc: [
            "'self'",
            "https:",
            "wss:",
            "https://accounts.google.com",
            "https://oauth2.googleapis.com",
            "https://www.googleapis.com",
            "https://*.cashfree.com",
          ],
          frameSrc: [
            "'self'",
            "https://accounts.google.com",
            "https://cashfree.com",
            "https://*.cashfree.com",
          ],
          upgradeInsecureRequests: [],
        },
      },
      frameguard: { action: "deny" },
      noSniff: true,
      xssFilter: true,
      hidePoweredBy: true,
      hsts:
        env.nodeEnv === "production"
          ? {
              maxAge: 31536000,
              includeSubDomains: true,
              preload: true,
            }
          : false,
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      crossOriginResourcePolicy: { policy: "cross-origin" },
      xDnsPrefetchControl: { allow: false },
    }),
  );
  app.use(hpp());
  app.use(compression());
  app.use(noSqlSanitizeMiddleware);
  app.use(xssSanitizeMiddleware);
};
