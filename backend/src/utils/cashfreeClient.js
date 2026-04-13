import crypto from "crypto";
import { env } from "../config/env.js";

const CASHFREE_API_VERSION = "2023-08-01";

const normalizeEnvironment = (value) =>
  String(value || "")
    .trim()
    .toLowerCase() === "production"
    ? "production"
    : "sandbox";

const buildBaseUrl = (mode) =>
  mode === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

const safeCompare = (left, right) => {
  const leftBuffer = Buffer.from(String(left || ""), "utf8");
  const rightBuffer = Buffer.from(String(right || ""), "utf8");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const createHmacCandidates = (secret, payload) => {
  const rawBuffer = Buffer.isBuffer(payload)
    ? payload
    : Buffer.from(String(payload || ""), "utf8");

  const hex = crypto
    .createHmac("sha256", secret)
    .update(rawBuffer)
    .digest("hex");
  const base64 = crypto
    .createHmac("sha256", secret)
    .update(rawBuffer)
    .digest("base64");

  return [hex, base64];
};

const getHeaders = () => ({
  "x-client-id": env.cashfreeAppId,
  "x-client-secret": env.cashfreeSecretKey,
  "x-api-version": CASHFREE_API_VERSION,
  "content-type": "application/json",
});

const requestCashfree = async (path, { method = "GET", body } = {}) => {
  if (!isCashfreeConfigured()) {
    throw new Error("Cashfree credentials are not configured");
  }

  const mode = getCashfreeMode();
  const url = `${buildBaseUrl(mode)}${path}`;

  const response = await fetch(url, {
    method,
    headers: getHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  const rawText = await response.text();
  let payload = null;

  if (rawText) {
    try {
      payload = JSON.parse(rawText);
    } catch {
      payload = { message: rawText };
    }
  }

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      `Cashfree API error (${response.status})`;
    const error = new Error(message);
    error.statusCode = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
};

export const isCashfreeConfigured = () =>
  Boolean(env.cashfreeAppId && env.cashfreeSecretKey);

export const getCashfreeMode = () =>
  normalizeEnvironment(env.cashfreeEnvironment);

export const createCashfreeOrder = async (request) =>
  requestCashfree("/orders", {
    method: "POST",
    body: request,
  });

export const fetchCashfreeOrder = async (orderId) =>
  requestCashfree(`/orders/${encodeURIComponent(orderId)}`);

export const fetchCashfreeOrderPayments = async (orderId) =>
  requestCashfree(`/orders/${encodeURIComponent(orderId)}/payments`);

export const verifyCashfreeWebhookSignature = ({
  rawBody,
  signature,
  timestamp,
}) => {
  if (!env.cashfreeWebhookSecret || !signature || !rawBody) {
    return false;
  }

  const bodyBuffer = Buffer.isBuffer(rawBody)
    ? rawBody
    : Buffer.from(String(rawBody || ""), "utf8");

  const payloadWithDot = Buffer.from(
    `${String(timestamp || "")}.${bodyBuffer.toString("utf8")}`,
    "utf8",
  );
  const payloadWithoutDot = Buffer.from(
    `${String(timestamp || "")}${bodyBuffer.toString("utf8")}`,
    "utf8",
  );

  const candidates = [
    ...createHmacCandidates(env.cashfreeWebhookSecret, bodyBuffer),
    ...createHmacCandidates(env.cashfreeWebhookSecret, payloadWithDot),
    ...createHmacCandidates(env.cashfreeWebhookSecret, payloadWithoutDot),
  ];

  return candidates.some((candidate) => safeCompare(candidate, signature));
};
