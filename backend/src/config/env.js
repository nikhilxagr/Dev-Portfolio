import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";
const isDevelopment = nodeEnv === "development";

const developmentFallbacks = {
  MONGODB_URI: "mongodb://127.0.0.1:27017/devportfolio",
  JWT_SECRET: "dev_jwt_secret_for_local_portfolio_2026",
  ADMIN_EMAIL: "admin@example.com",
  ADMIN_PASSWORD_HASH:
    "$2b$10$/6XDoyq46vS/GYEkCkttMugFHJ8rGci5n2JJ7qGu3tWSFPsKFTR.u",
};

const readRequiredVariable = (name, aliases = []) => {
  const acceptedNames = [name, ...aliases];
  const runtimeName = acceptedNames.find((variableName) =>
    Boolean(process.env[variableName]),
  );
  const runtimeValue = runtimeName ? process.env[runtimeName] : undefined;
  const fallbackValue = isDevelopment ? developmentFallbacks[name] : undefined;
  const value = runtimeValue || fallbackValue;

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${acceptedNames.join(
        " or ",
      )}. Set it in Render service Environment settings.`,
    );
  }

  if (!runtimeValue && fallbackValue) {
    console.warn(`[env] ${name} is not set. Using development fallback value.`);
  }

  return value;
};

const mongoUri = readRequiredVariable("MONGODB_URI", ["DATABASE_URL"]);
const jwtSecret = readRequiredVariable("JWT_SECRET");
const adminEmail = readRequiredVariable("ADMIN_EMAIL").toLowerCase();
const adminPasswordHash = readRequiredVariable("ADMIN_PASSWORD_HASH");

if (jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must contain at least 32 characters");
}

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const normalizeOrigin = (origin) => origin.trim().replace(/\/+$/, "");

const parseAllowedOrigins = (value) => {
  return [...new Set(value.split(",").map(normalizeOrigin).filter(Boolean))];
};

const parseOptionalRegex = (pattern, variableName) => {
  if (!pattern) {
    return null;
  }

  try {
    return new RegExp(pattern);
  } catch {
    throw new Error(`Invalid ${variableName} regular expression`);
  }
};

export const env = {
  nodeEnv,
  port: parseNumber(process.env.PORT, 5000),
  mongoUri,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  adminEmail,
  adminPasswordHash,
  allowedOrigins: parseAllowedOrigins(
    process.env.ALLOWED_ORIGINS || "http://localhost:5173",
  ),
  allowedOriginRegex: parseOptionalRegex(
    process.env.ALLOWED_ORIGIN_REGEX,
    "ALLOWED_ORIGIN_REGEX",
  ),
  dbMaxPoolSize: parseNumber(process.env.DB_MAX_POOL_SIZE, 25),
  dbMinPoolSize: parseNumber(process.env.DB_MIN_POOL_SIZE, 5),
};
