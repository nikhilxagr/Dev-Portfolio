import { Router } from "express";
import { body, param, query } from "express-validator";
import {
  createPaymentOrder,
  downloadReceipt,
  getPaymentConfigStatus,
  getReceiptHistory,
  handleCashfreeWebhook,
  requestReceiptAccessCode,
  verifyPayment,
  verifyReceiptAccessCode,
} from "../controllers/paymentController.js";
import { getServiceBySlug } from "../constants/servicesCatalog.js";
import {
  otpLimiter,
  paymentLimiter,
  paymentVerifyLimiter,
  webhookLimiter,
} from "../middleware/rateLimiter.js";
import validateRequest from "../middleware/validateRequest.js";

const router = Router();

router.get("/config-status", getPaymentConfigStatus);

router.post(
  "/create-order",
  paymentLimiter,
  [
    body("serviceSlug")
      .trim()
      .custom((value) => Boolean(getServiceBySlug(value)))
      .withMessage("Please select a valid service"),
    body("customerName")
      .trim()
      .isLength({ min: 2, max: 120 })
      .withMessage("Name must be 2-120 characters"),
    body("customerEmail").isEmail().withMessage("Valid email is required"),
    body("customerPhone")
      .trim()
      .matches(/^\d{10}$/)
      .withMessage("Phone must be a valid 10-digit number"),
    body("notes")
      .optional({ values: "falsy" })
      .trim()
      .isLength({ max: 500 })
      .withMessage("Notes must be up to 500 characters"),
    body("idempotencyKey")
      .trim()
      .matches(/^[A-Za-z0-9_-]{12,120}$/)
      .withMessage("Invalid idempotency key"),
  ],
  validateRequest,
  createPaymentOrder,
);

router.post(
  "/verify",
  paymentVerifyLimiter,
  [
    body("orderId")
      .trim()
      .isLength({ min: 8, max: 80 })
      .withMessage("Invalid order id"),
  ],
  validateRequest,
  verifyPayment,
);

router.post("/webhook", webhookLimiter, handleCashfreeWebhook);

router.get(
  "/receipts/:receiptNumber/download",
  [
    param("receiptNumber")
      .trim()
      .isLength({ min: 8, max: 64 })
      .withMessage("Invalid receipt number"),
    query("token").trim().notEmpty().withMessage("Receipt token is required"),
  ],
  validateRequest,
  downloadReceipt,
);

router.post(
  "/receipts/request-access",
  otpLimiter,
  [body("email").isEmail().withMessage("Valid email is required")],
  validateRequest,
  requestReceiptAccessCode,
);

router.post(
  "/receipts/verify-access",
  otpLimiter,
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("code")
      .trim()
      .matches(/^\d{6}$/)
      .withMessage("Access code must be 6 digits"),
  ],
  validateRequest,
  verifyReceiptAccessCode,
);

router.get(
  "/receipts/history",
  [query("token").trim().notEmpty().withMessage("Portal token is required")],
  validateRequest,
  getReceiptHistory,
);

export default router;
