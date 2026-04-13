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

const readOptionalVariable = (name, aliases = []) => {
  const acceptedNames = [name, ...aliases];
  const runtimeName = acceptedNames.find((variableName) =>
    Boolean(process.env[variableName]),
  );
  const runtimeValue = runtimeName ? process.env[runtimeName] : undefined;
  const fallbackValue = isDevelopment ? developmentFallbacks[name] : undefined;

  return runtimeValue || fallbackValue || "";
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

const parseBoolean = (value, fallback = false) => {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();

  if (["1", "true", "yes", "y", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "n", "off"].includes(normalized)) {
    return false;
  }

  return fallback;
};

const normalizeOrigin = (origin) => origin.trim().replace(/\/+$/, "");

const parseAllowedOrigins = (value) => {
  return [...new Set(value.split(",").map(normalizeOrigin).filter(Boolean))];
};

const parseOptionalRegex = (pattern, variableName) => {
  if (!pattern) {
    return null;
  }

  const normalized = pattern.trim();

  if ([".*", ".+", "^.*$", "^.+$"].includes(normalized)) {
    throw new Error(
      `${variableName} is too permissive. Use an explicit domain pattern.`,
    );
  }

  if (normalized.length > 180) {
    throw new Error(`${variableName} exceeds maximum allowed length`);
  }

  try {
    return new RegExp(normalized);
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
  trustProxyHops: Math.max(0, parseNumber(process.env.TRUST_PROXY_HOPS, 1)),
  allowStartWithoutDb: parseBoolean(process.env.ALLOW_START_WITHOUT_DB, false),
  dbMaxPoolSize: parseNumber(process.env.DB_MAX_POOL_SIZE, 25),
  dbMinPoolSize: parseNumber(process.env.DB_MIN_POOL_SIZE, 5),
  cashfreeAppId: readOptionalVariable("CASHFREE_APP_ID"),
  cashfreeSecretKey: readOptionalVariable("CASHFREE_SECRET_KEY"),
  cashfreeEnvironment:
    readOptionalVariable("CASHFREE_ENVIRONMENT") || "sandbox",
  cashfreeWebhookSecret: readOptionalVariable("CASHFREE_WEBHOOK_SECRET"),
  resendApiKey: readOptionalVariable("RESEND_API_KEY"),
  paymentFromEmail: readOptionalVariable("PAYMENT_FROM_EMAIL"),
  paymentBusinessName:
    readOptionalVariable("PAYMENT_BUSINESS_NAME") || "Nikhil Agrahari",
  paymentSupportEmail:
    readOptionalVariable("PAYMENT_SUPPORT_EMAIL") || adminEmail,
  paymentRefundPolicyUrl:
    readOptionalVariable("PAYMENT_REFUND_POLICY_URL") ||
    "https://example.com/refund-policy",
  paymentReceiptTokenSecret:
    readOptionalVariable("PAYMENT_RECEIPT_TOKEN_SECRET") ||
    (isDevelopment ? jwtSecret : ""),
  paymentAccessCodeTtlMinutes: Math.max(
    3,
    parseNumber(process.env.PAYMENT_ACCESS_CODE_TTL_MINUTES, 10),
  ),
  paymentPortalTokenTtlMinutes: Math.max(
    5,
    parseNumber(process.env.PAYMENT_PORTAL_TOKEN_TTL_MINUTES, 30),
  ),
  paymentDownloadTokenTtlMinutes: Math.max(
    5,
    parseNumber(process.env.PAYMENT_DOWNLOAD_TOKEN_TTL_MINUTES, 20),
  ),
  paymentReceiptEmailEnabled: parseBoolean(
    process.env.PAYMENT_RECEIPT_EMAIL_ENABLED,
    false,
  ),
};

const hasCashfreeAppId = Boolean(env.cashfreeAppId);
const hasCashfreeSecretKey = Boolean(env.cashfreeSecretKey);

if (hasCashfreeAppId !== hasCashfreeSecretKey) {
  throw new Error(
    "CASHFREE_APP_ID and CASHFREE_SECRET_KEY must be set together",
  );
}

const normalizedCashfreeEnvironment = String(
  env.cashfreeEnvironment || "sandbox",
)
  .trim()
  .toLowerCase();

if (!["sandbox", "production"].includes(normalizedCashfreeEnvironment)) {
  throw new Error(
    "CASHFREE_ENVIRONMENT must be either 'sandbox' or 'production'",
  );
}

env.cashfreeEnvironment = normalizedCashfreeEnvironment;

if (hasCashfreeAppId && !env.cashfreeWebhookSecret) {
  console.warn(
    "[env] CASHFREE_WEBHOOK_SECRET is not set. Webhook signature verification is bypassed.",
  );
}

if (!env.paymentReceiptTokenSecret) {
  throw new Error(
    "Missing required environment variable: PAYMENT_RECEIPT_TOKEN_SECRET",
  );
}

if (
  env.paymentReceiptEmailEnabled &&
  (!env.resendApiKey || !env.paymentFromEmail)
) {
  throw new Error(
    "PAYMENT_RECEIPT_EMAIL_ENABLED=true requires RESEND_API_KEY and PAYMENT_FROM_EMAIL",
  );
}
