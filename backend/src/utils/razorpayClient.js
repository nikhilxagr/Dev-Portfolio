import crypto from "crypto";
import Razorpay from "razorpay";
import { env } from "../config/env.js";

const hasConfig = Boolean(env.razorpayKeyId && env.razorpayKeySecret);

const razorpayClient = hasConfig
  ? new Razorpay({
      key_id: env.razorpayKeyId,
      key_secret: env.razorpayKeySecret,
    })
  : null;

const safeCompare = (left, right) => {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

export const isRazorpayConfigured = () => Boolean(razorpayClient);

export const getRazorpayClient = () => {
  if (!razorpayClient) {
    throw new Error("Razorpay credentials are not configured");
  }

  return razorpayClient;
};

export const verifyRazorpayPaymentSignature = ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  if (!env.razorpayKeySecret) {
    return false;
  }

  const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(payload)
    .digest("hex");

  return safeCompare(expectedSignature, razorpaySignature || "");
};

export const verifyRazorpayWebhookSignature = ({ rawBody, signature }) => {
  if (!env.razorpayWebhookSecret || !signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", env.razorpayWebhookSecret)
    .update(rawBody)
    .digest("hex");

  return safeCompare(expectedSignature, signature);
};
