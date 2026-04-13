const SENSITIVE_KEY_PARTS = [
  "password",
  "token",
  "secret",
  "signature",
  "authorization",
  "cookie",
  "codehash",
];

const clampString = (value, maxLength = 180) => {
  if (typeof value !== "string") {
    return value;
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
};

const maskEmail = (value) => {
  const email = String(value || "")
    .trim()
    .toLowerCase();
  const atIndex = email.indexOf("@");

  if (atIndex <= 1) {
    return "***";
  }

  const name = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);

  return `${name[0]}***${name[name.length - 1]}@${domain}`;
};

const isSensitiveKey = (key) => {
  const normalized = String(key || "").toLowerCase();
  return SENSITIVE_KEY_PARTS.some((part) => normalized.includes(part));
};

const sanitizeValue = (key, value) => {
  if (isSensitiveKey(key)) {
    return "[REDACTED]";
  }

  if (Array.isArray(value)) {
    return value.slice(0, 20).map((item) => sanitizeValue(key, item));
  }

  if (value && typeof value === "object") {
    return Object.entries(value).reduce((acc, [nestedKey, nestedValue]) => {
      acc[nestedKey] = sanitizeValue(nestedKey, nestedValue);
      return acc;
    }, {});
  }

  if (typeof value === "string" && key.toLowerCase().includes("email")) {
    return maskEmail(value);
  }

  return clampString(value);
};

export const logSecurityEvent = (event, req, details = {}) => {
  if (!event) {
    return;
  }

  const payload = {
    ts: new Date().toISOString(),
    event,
    method: req?.method || "",
    path: req?.originalUrl || req?.url || "",
    ip: req?.ip || "",
    actor: req?.user?.email ? maskEmail(req.user.email) : "anonymous",
    userAgent: clampString(req?.headers?.["user-agent"] || "", 220),
    details: sanitizeValue("details", details),
  };

  console.info(`[security] ${JSON.stringify(payload)}`);
};
