import crypto from "crypto";
import { env } from "../config/env.js";

const base64UrlEncode = (value) =>
  Buffer.from(value, "utf8").toString("base64url");

const base64UrlDecode = (value) =>
  Buffer.from(value, "base64url").toString("utf8");

const sign = (payload) => {
  const payloadBase64 = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", env.paymentReceiptTokenSecret)
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
};

const verify = (token) => {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return { valid: false, payload: null, reason: "missing-token" };
  }

  const [payloadBase64, signature] = token.split(".");
  const expectedSignature = crypto
    .createHmac("sha256", env.paymentReceiptTokenSecret)
    .update(payloadBase64)
    .digest("base64url");

  const providedBuffer = Buffer.from(signature || "", "utf8");
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return { valid: false, payload: null, reason: "invalid-signature" };
  }

  let payload;

  try {
    payload = JSON.parse(base64UrlDecode(payloadBase64));
  } catch {
    return { valid: false, payload: null, reason: "invalid-payload" };
  }

  if (!payload?.exp || Date.now() > payload.exp) {
    return { valid: false, payload: null, reason: "token-expired" };
  }

  return { valid: true, payload, reason: "ok" };
};

const createExp = (minutes) => Date.now() + minutes * 60 * 1000;

export const createDownloadToken = ({ receiptNumber, email }) =>
  sign({
    scope: "receipt-download",
    receiptNumber,
    email,
    exp: createExp(env.paymentDownloadTokenTtlMinutes),
  });

export const verifyDownloadToken = (token) => verify(token);

export const createPortalToken = ({ email }) =>
  sign({
    scope: "receipt-history",
    email,
    exp: createExp(env.paymentPortalTokenTtlMinutes),
  });

export const verifyPortalToken = (token) => verify(token);
