import crypto from "crypto";
import mongoose from "mongoose";
import PaymentTransaction from "../models/PaymentTransaction.js";
import ReceiptAccessCode from "../models/ReceiptAccessCode.js";
import PaymentWebhookEvent from "../models/PaymentWebhookEvent.js";
import ApiError from "../utils/ApiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import {
  getServiceBySlug,
  SUPPORT_PAYMENT_CONFIG,
} from "../constants/servicesCatalog.js";
import {
  createDownloadToken,
  createPortalToken,
  verifyDownloadToken,
  verifyPortalToken,
} from "../utils/tokenSigner.js";
import {
  createCashfreeOrder,
  fetchCashfreeOrderPayments,
  getCashfreeMode,
  isCashfreeConfigured,
  verifyCashfreeWebhookSignature,
} from "../utils/cashfreeClient.js";
import { buildReceiptPdfBuffer } from "../utils/receiptPdf.js";
import {
  isReceiptEmailEnabled,
  sendReceiptAccessCodeEmail,
  sendReceiptEmail,
} from "../services/receiptEmail.service.js";
import { env } from "../config/env.js";
import { logSecurityEvent } from "../utils/securityAudit.js";

const MAX_HISTORY_ITEMS = 60;
const MAX_OTP_ATTEMPTS = 5;

const failTransaction = async (transaction, reason) => {
  transaction.status = "failed";
  transaction.failedAt = new Date();
  transaction.failureReason = reason;
  await transaction.save();
};

const normalizeEmail = (value) => String(value).toLowerCase().trim();
const normalizePhone = (value) => String(value || "").replace(/\D/g, "");
const normalizeOrigin = (value) =>
  String(value || "")
    .trim()
    .replace(/\/+$/, "");

const isSuccessPaymentStatus = (status) =>
  ["SUCCESS", "CAPTURED", "PAID"].includes(
    String(status || "")
      .trim()
      .toUpperCase(),
  );

const isFailurePaymentStatus = (status) =>
  ["FAILED", "CANCELLED", "USER_DROPPED", "EXPIRED"].includes(
    String(status || "")
      .trim()
      .toUpperCase(),
  );

const toSortableTime = (value) => {
  const parsed = new Date(value || 0).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

const sortPaymentsByLatest = (payments = []) =>
  [...payments].sort((left, right) => {
    const leftTime = Math.max(
      toSortableTime(left.payment_completion_time),
      toSortableTime(left.payment_time),
    );
    const rightTime = Math.max(
      toSortableTime(right.payment_completion_time),
      toSortableTime(right.payment_time),
    );

    return rightTime - leftTime;
  });

const pickLatestPayment = (payments = []) =>
  sortPaymentsByLatest(payments)[0] || null;

const pickSuccessfulPayment = (payments = []) =>
  sortPaymentsByLatest(payments).find((payment) =>
    isSuccessPaymentStatus(payment?.payment_status),
  ) || null;

const createGatewayOrderId = (transaction) => {
  const idSuffix = transaction._id.toString().slice(-12);
  return `order_${idSuffix}_${Date.now()}`;
};

const getAllowedCheckoutOrigin = (req) => {
  const requestOrigin = normalizeOrigin(req.get("origin"));

  if (requestOrigin && env.allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }

  if (
    requestOrigin &&
    env.allowedOriginRegex &&
    env.allowedOriginRegex.test(requestOrigin)
  ) {
    return requestOrigin;
  }

  const fallbackOrigin = normalizeOrigin(env.allowedOrigins[0]);
  if (fallbackOrigin) {
    return fallbackOrigin;
  }

  return null;
};

const isDatabaseReady = (req) => {
  const ready = mongoose.connection.readyState === 1;
  req.app.locals.dbConnected = ready;
  return ready;
};

const ensurePaymentConfigured = () => {
  if (!isCashfreeConfigured()) {
    throw new ApiError(
      503,
      "Payment gateway is not configured yet. Please contact support.",
    );
  }
};

const normalizeSupportAmount = (value) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
    return NaN;
  }

  return parsed;
};

const getBaseUrl = (req) => `${req.protocol}://${req.get("host")}`;

const buildCashfreeReturnUrl = (req) => {
  const checkoutOrigin = getAllowedCheckoutOrigin(req);
  const base = checkoutOrigin || getBaseUrl(req);
  return `${base}/payment/success?order_id={order_id}`;
};

const buildCashfreeNotifyUrl = (req) =>
  `${getBaseUrl(req)}/api/payments/webhook`;

const createReceiptNumber = () => {
  const timestamp = Date.now();
  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `RCP-${timestamp}-${randomPart}`;
};

const createOtp = () =>
  String(Math.floor(Math.random() * 1000000)).padStart(6, "0");

const createOtpHash = (email, otpCode) =>
  crypto
    .createHmac("sha256", env.paymentReceiptTokenSecret)
    .update(`${normalizeEmail(email)}:${otpCode}`)
    .digest("hex");

const buildDownloadUrl = (transaction) => {
  const downloadToken = createDownloadToken({
    receiptNumber: transaction.receiptNumber,
    email: transaction.customerEmail,
  });

  return `/api/payments/receipts/${encodeURIComponent(
    transaction.receiptNumber,
  )}/download?token=${encodeURIComponent(downloadToken)}`;
};

const sendReceiptEmailForTransaction = async (transaction, req) => {
  if (!transaction.receiptNumber || transaction.receiptEmailStatus === "sent") {
    return;
  }

  if (!isReceiptEmailEnabled()) {
    if (transaction.receiptEmailStatus !== "skipped") {
      transaction.receiptEmailStatus = "skipped";
      transaction.receiptEmailError = "Receipt email is disabled";
      await transaction.save();
    }
    return;
  }

  try {
    const pdfBuffer = await buildReceiptPdfBuffer(transaction);
    const downloadUrl = `${getBaseUrl(req)}${buildDownloadUrl(transaction)}`;

    await sendReceiptEmail({
      customerName: transaction.customerName,
      customerEmail: transaction.customerEmail,
      receiptNumber: transaction.receiptNumber,
      serviceName: transaction.serviceName,
      amountInr: transaction.amountInr,
      paidAt: transaction.paidAt,
      downloadUrl,
      pdfBuffer,
    });

    transaction.receiptEmailStatus = "sent";
    transaction.receiptEmailError = "";
    transaction.receiptEmailSentAt = new Date();
    await transaction.save();
  } catch (error) {
    transaction.receiptEmailStatus = "failed";
    transaction.receiptEmailError = error.message || "Receipt email failed";
    await transaction.save();
  }
};

const getReceiptPayload = (transaction) => ({
  receiptNumber: transaction.receiptNumber,
  serviceName: transaction.serviceName,
  amountInr: transaction.amountInr,
  currency: transaction.currency,
  paidAt: transaction.paidAt,
  orderId: transaction.cashfreeOrderId,
  paymentId: transaction.cashfreePaymentId,
  emailStatus: transaction.receiptEmailStatus,
  downloadUrl: buildDownloadUrl(transaction),
});

export const getPaymentConfigStatus = (_req, res) => {
  const hasCashfreeAppId = Boolean(env.cashfreeAppId);
  const hasCashfreeSecretKey = Boolean(env.cashfreeSecretKey);
  const receiptEmailConfigured = Boolean(
    env.resendApiKey && env.paymentFromEmail,
  );
  const checkoutReady = hasCashfreeAppId && hasCashfreeSecretKey;

  sendResponse(res, 200, "Payment configuration status fetched", {
    gateway: "cashfree",
    mode: checkoutReady ? getCashfreeMode() : "not-configured",
    checkoutReady,
    webhookReady: checkoutReady && Boolean(env.cashfreeWebhookSecret),
    receiptTokenReady: Boolean(env.paymentReceiptTokenSecret),
    receiptEmailEnabled: env.paymentReceiptEmailEnabled,
    receiptEmailReady: env.paymentReceiptEmailEnabled
      ? receiptEmailConfigured
      : false,
  });
};

export const createPaymentOrder = async (req, res, next) => {
  let transaction = null;

  try {
    if (!isDatabaseReady(req)) {
      throw new ApiError(
        503,
        "Payments are temporarily unavailable while database reconnects.",
      );
    }

    ensurePaymentConfigured();

    const {
      serviceSlug,
      customerName,
      customerEmail,
      customerPhone = "",
      notes = "",
      idempotencyKey,
    } = req.body;

    const service = getServiceBySlug(serviceSlug);

    if (!service) {
      throw new ApiError(400, "Invalid service selected for checkout");
    }

    const normalizedEmail = normalizeEmail(customerEmail);
    const normalizedPhone = normalizePhone(customerPhone);

    if (normalizedPhone.length !== 10) {
      throw new ApiError(
        400,
        "A valid 10-digit phone number is required for checkout",
      );
    }

    transaction = await PaymentTransaction.findOne({ idempotencyKey });

    if (transaction && transaction.status === "paid") {
      const data = {
        alreadyPaid: true,
        transactionRef: transaction.id,
        receipt: transaction.receiptNumber
          ? getReceiptPayload(transaction)
          : null,
      };
      sendResponse(
        res,
        200,
        "Payment already completed for this request",
        data,
      );
      return;
    }

    if (!transaction) {
      transaction = await PaymentTransaction.create({
        idempotencyKey,
        serviceSlug: service.slug,
        serviceName: service.name,
        amountInr: service.amountInr,
        amountPaise: service.amountPaise,
        currency: service.currency,
        customerName: customerName.trim(),
        customerEmail: normalizedEmail,
        customerPhone: normalizedPhone,
        notes: notes.trim(),
      });
    }

    if (!transaction.cashfreeOrderId || !transaction.cashfreePaymentSessionId) {
      const gatewayOrderId = createGatewayOrderId(transaction);
      const cashfreeOrder = await createCashfreeOrder({
        order_id: gatewayOrderId,
        order_amount: Number(transaction.amountInr.toFixed(2)),
        order_currency: transaction.currency,
        customer_details: {
          customer_id: `cust_${transaction._id.toString().slice(-12)}`,
          customer_name: transaction.customerName,
          customer_email: transaction.customerEmail,
          customer_phone: transaction.customerPhone,
        },
        order_meta: {
          return_url: buildCashfreeReturnUrl(req),
          notify_url: buildCashfreeNotifyUrl(req),
        },
        order_note:
          transaction.notes ||
          `Services page checkout for ${transaction.serviceName}`,
      });

      if (!cashfreeOrder?.order_id || !cashfreeOrder?.payment_session_id) {
        throw new ApiError(
          502,
          "Unable to initialize payment session. Please try again.",
        );
      }

      transaction.cashfreeOrderId = cashfreeOrder.order_id;
      transaction.cashfreePaymentSessionId = cashfreeOrder.payment_session_id;
      transaction.status = "created";
      transaction.failureReason = "";
      transaction.failedAt = null;
      await transaction.save();
    }

    sendResponse(res, 201, "Payment order created successfully", {
      transactionRef: transaction.id,
      checkout: {
        gateway: "cashfree",
        appId: env.cashfreeAppId,
        environment: getCashfreeMode(),
        paymentSessionId: transaction.cashfreePaymentSessionId,
        orderId: transaction.cashfreeOrderId,
        amount: transaction.amountInr,
        currency: transaction.currency,
        name: env.paymentBusinessName,
        description: transaction.serviceName,
        returnUrl: buildCashfreeReturnUrl(req),
        notes: {
          serviceSlug: transaction.serviceSlug,
          transactionRef: transaction.id,
        },
      },
      service: {
        slug: transaction.serviceSlug,
        name: transaction.serviceName,
        amountInr: transaction.amountInr,
      },
    });
  } catch (error) {
    if (transaction && !transaction.cashfreeOrderId) {
      transaction.status = "failed";
      transaction.failedAt = new Date();
      transaction.failureReason = error.message || "Order creation failed";
      await transaction.save();
    }

    next(error);
  }
};

export const createSupportPaymentOrder = async (req, res, next) => {
  let transaction = null;

  try {
    if (!isDatabaseReady(req)) {
      throw new ApiError(
        503,
        "Payments are temporarily unavailable while database reconnects.",
      );
    }

    ensurePaymentConfigured();

    const {
      amountInr,
      customerName,
      customerEmail,
      customerPhone = "",
      notes = "",
      idempotencyKey,
    } = req.body;

    const normalizedEmail = normalizeEmail(customerEmail);
    const normalizedPhone = normalizePhone(customerPhone);
    const normalizedAmountInr = normalizeSupportAmount(amountInr);

    if (
      !Number.isInteger(normalizedAmountInr) ||
      normalizedAmountInr < SUPPORT_PAYMENT_CONFIG.minAmountInr ||
      normalizedAmountInr > SUPPORT_PAYMENT_CONFIG.maxAmountInr
    ) {
      throw new ApiError(
        400,
        `Support amount must be between INR ${SUPPORT_PAYMENT_CONFIG.minAmountInr} and INR ${SUPPORT_PAYMENT_CONFIG.maxAmountInr}`,
      );
    }

    if (normalizedPhone.length !== 10) {
      throw new ApiError(
        400,
        "A valid 10-digit phone number is required for checkout",
      );
    }

    transaction = await PaymentTransaction.findOne({ idempotencyKey });

    if (transaction && transaction.status === "paid") {
      const data = {
        alreadyPaid: true,
        transactionRef: transaction.id,
        receipt: transaction.receiptNumber
          ? getReceiptPayload(transaction)
          : null,
      };
      sendResponse(
        res,
        200,
        "Payment already completed for this request",
        data,
      );
      return;
    }

    if (!transaction) {
      transaction = await PaymentTransaction.create({
        idempotencyKey,
        serviceSlug: SUPPORT_PAYMENT_CONFIG.slug,
        serviceName: SUPPORT_PAYMENT_CONFIG.name,
        amountInr: normalizedAmountInr,
        amountPaise: normalizedAmountInr * 100,
        currency: SUPPORT_PAYMENT_CONFIG.currency,
        customerName: customerName.trim(),
        customerEmail: normalizedEmail,
        customerPhone: normalizedPhone,
        notes: notes.trim(),
      });
    }

    if (!transaction.cashfreeOrderId || !transaction.cashfreePaymentSessionId) {
      const gatewayOrderId = createGatewayOrderId(transaction);
      const cashfreeOrder = await createCashfreeOrder({
        order_id: gatewayOrderId,
        order_amount: Number(transaction.amountInr.toFixed(2)),
        order_currency: transaction.currency,
        customer_details: {
          customer_id: `cust_${transaction._id.toString().slice(-12)}`,
          customer_name: transaction.customerName,
          customer_email: transaction.customerEmail,
          customer_phone: transaction.customerPhone,
        },
        order_meta: {
          return_url: buildCashfreeReturnUrl(req),
          notify_url: buildCashfreeNotifyUrl(req),
        },
        order_note:
          transaction.notes ||
          "Support contribution via Services support section",
      });

      if (!cashfreeOrder?.order_id || !cashfreeOrder?.payment_session_id) {
        throw new ApiError(
          502,
          "Unable to initialize payment session. Please try again.",
        );
      }

      transaction.cashfreeOrderId = cashfreeOrder.order_id;
      transaction.cashfreePaymentSessionId = cashfreeOrder.payment_session_id;
      transaction.status = "created";
      transaction.failureReason = "";
      transaction.failedAt = null;
      await transaction.save();
    }

    logSecurityEvent("PAYMENT_SUPPORT_ORDER_CREATED", req, {
      transactionRef: transaction.id,
      amountInr: transaction.amountInr,
      orderId: transaction.cashfreeOrderId,
      serviceSlug: transaction.serviceSlug,
    });

    sendResponse(res, 201, "Support payment order created successfully", {
      transactionRef: transaction.id,
      checkout: {
        gateway: "cashfree",
        appId: env.cashfreeAppId,
        environment: getCashfreeMode(),
        paymentSessionId: transaction.cashfreePaymentSessionId,
        orderId: transaction.cashfreeOrderId,
        amount: transaction.amountInr,
        currency: transaction.currency,
        name: env.paymentBusinessName,
        description: transaction.serviceName,
        returnUrl: buildCashfreeReturnUrl(req),
        notes: {
          serviceSlug: transaction.serviceSlug,
          transactionRef: transaction.id,
        },
      },
      service: {
        slug: transaction.serviceSlug,
        name: transaction.serviceName,
        amountInr: transaction.amountInr,
      },
    });
  } catch (error) {
    if (transaction && !transaction.cashfreeOrderId) {
      transaction.status = "failed";
      transaction.failedAt = new Date();
      transaction.failureReason = error.message || "Order creation failed";
      await transaction.save();
    }

    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    if (!isDatabaseReady(req)) {
      throw new ApiError(
        503,
        "Payment verification is temporarily unavailable. Please try again.",
      );
    }

    ensurePaymentConfigured();

    const orderId = String(req.body.orderId || "").trim();

    const transaction = await PaymentTransaction.findOne({
      cashfreeOrderId: orderId,
    });

    if (!transaction) {
      throw new ApiError(404, "Payment order not found");
    }

    let gatewayPayments;

    try {
      gatewayPayments = await fetchCashfreeOrderPayments(orderId);
    } catch {
      logSecurityEvent("PAYMENT_VERIFY_LOOKUP_FAILED", req, {
        orderId,
      });
      throw new ApiError(
        502,
        "Unable to validate payment details right now. Please try again.",
      );
    }

    const successfulPayment = pickSuccessfulPayment(gatewayPayments || []);

    if (!successfulPayment) {
      const latestPayment = pickLatestPayment(gatewayPayments || []);

      if (
        latestPayment &&
        isFailurePaymentStatus(latestPayment.payment_status)
      ) {
        await failTransaction(
          transaction,
          `payment_${String(latestPayment.payment_status || "failed").toLowerCase()}`,
        );
      }

      logSecurityEvent("PAYMENT_VERIFY_FAILED", req, {
        orderId,
        reason: latestPayment?.payment_status || "payment_pending",
      });

      sendResponse(
        res,
        202,
        latestPayment && isFailurePaymentStatus(latestPayment.payment_status)
          ? "Payment attempt was not successful. Please retry checkout."
          : "Payment is pending. Complete payment and refresh this page.",
        {
          transactionRef: transaction.id,
          orderId,
          status: transaction.status,
        },
      );
      return;
    }

    const normalizedCurrency = String(
      successfulPayment.payment_currency || transaction.currency,
    ).toUpperCase();
    if (normalizedCurrency !== transaction.currency) {
      await failTransaction(transaction, "gateway_currency_mismatch");
      logSecurityEvent("PAYMENT_VERIFY_FAILED", req, {
        orderId,
        reason: "currency_mismatch",
      });
      throw new ApiError(400, "Payment verification failed integrity checks");
    }

    const paymentAmount = Number(
      successfulPayment.payment_amount || successfulPayment.order_amount || 0,
    );
    if (
      !Number.isFinite(paymentAmount) ||
      Math.abs(paymentAmount - transaction.amountInr) > 0.01
    ) {
      await failTransaction(transaction, "gateway_amount_mismatch");
      logSecurityEvent("PAYMENT_VERIFY_FAILED", req, {
        orderId,
        reason: "amount_mismatch",
      });
      throw new ApiError(400, "Payment verification failed integrity checks");
    }

    const isAlreadyPaid = transaction.status === "paid";

    transaction.status = "paid";
    transaction.cashfreePaymentId = String(
      successfulPayment.cf_payment_id || transaction.cashfreePaymentId || "",
    );
    transaction.cashfreePaymentSessionId = String(
      successfulPayment.payment_group || transaction.cashfreePaymentSessionId || "",
    );
    transaction.paidAt =
      transaction.paidAt ||
      new Date(
        successfulPayment.payment_completion_time ||
          successfulPayment.payment_time ||
          Date.now(),
      );
    transaction.failedAt = null;
    transaction.failureReason = "";

    if (!transaction.receiptNumber) {
      transaction.receiptNumber = createReceiptNumber();
    }

    await transaction.save();
    await sendReceiptEmailForTransaction(transaction, req);

    logSecurityEvent("PAYMENT_VERIFY_SUCCESS", req, {
      orderId,
      paymentId: transaction.cashfreePaymentId,
      receiptNumber: transaction.receiptNumber,
      alreadyPaid: isAlreadyPaid,
    });

    sendResponse(
      res,
      200,
      isAlreadyPaid
        ? "Payment already verified"
        : "Payment verified successfully",
      {
        transactionRef: transaction.id,
        receipt: getReceiptPayload(transaction),
      },
    );
  } catch (error) {
    next(error);
  }
};

const extractCashfreeOrderId = (payload) =>
  payload?.data?.order?.order_id ||
  payload?.data?.payment?.order_id ||
  payload?.order?.order_id ||
  payload?.payment?.order_id ||
  payload?.order_id ||
  "";

const extractCashfreePaymentStatus = (payload) =>
  payload?.data?.payment?.payment_status ||
  payload?.payment?.payment_status ||
  payload?.payment_status ||
  "";

const extractCashfreeEventType = (payload) =>
  payload?.type || payload?.event || "unknown";

export const handleCashfreeWebhook = async (req, res, next) => {
  try {
    if (!isDatabaseReady(req)) {
      throw new ApiError(
        503,
        "Webhook processing unavailable while database reconnects",
      );
    }

    const signatureHeader = req.headers["x-webhook-signature"];
    const timestampHeader = req.headers["x-webhook-timestamp"];
    const signature = Array.isArray(signatureHeader)
      ? signatureHeader[0]
      : signatureHeader;
    const timestamp = Array.isArray(timestampHeader)
      ? timestampHeader[0]
      : timestampHeader;

    if (!Buffer.isBuffer(req.body)) {
      throw new ApiError(400, "Invalid webhook payload");
    }

    if (env.cashfreeWebhookSecret && !signature) {
      throw new ApiError(401, "Webhook signature is missing");
    }

    if (env.cashfreeWebhookSecret) {
      const isValidWebhook = verifyCashfreeWebhookSignature({
        rawBody: req.body,
        signature,
        timestamp,
      });

      if (!isValidWebhook) {
        logSecurityEvent("PAYMENT_WEBHOOK_REJECTED", req, {
          reason: "invalid_signature",
        });
        throw new ApiError(401, "Webhook signature verification failed");
      }
    }

    const payload = JSON.parse(req.body.toString("utf8"));

    const headerEventId =
      req.headers["x-webhook-id"] || req.headers["x-webhook-event-id"];
    const eventId = Array.isArray(headerEventId)
      ? headerEventId[0]
      : headerEventId ||
        `${extractCashfreeEventType(payload)}:${Date.now()}:${extractCashfreeOrderId(payload) || "na"}`;

    const alreadyProcessed = await PaymentWebhookEvent.findOne({ eventId });

    if (alreadyProcessed) {
      logSecurityEvent("PAYMENT_WEBHOOK_DUPLICATE", req, { eventId });
      sendResponse(res, 200, "Webhook event already processed", { eventId });
      return;
    }

    await PaymentWebhookEvent.create({
      eventId,
      eventType: extractCashfreeEventType(payload),
    });

    const orderId = String(extractCashfreeOrderId(payload) || "").trim();
    const eventType = extractCashfreeEventType(payload);
    const paymentStatus = extractCashfreePaymentStatus(payload);

    if (!orderId) {
      logSecurityEvent("PAYMENT_WEBHOOK_NO_ORDER", req, {
        eventId,
        eventType,
      });
      sendResponse(res, 200, "Webhook processed without order reference", {
        eventId,
      });
      return;
    }

    const transaction = await PaymentTransaction.findOne({
      cashfreeOrderId: orderId,
    });

    if (!transaction) {
      logSecurityEvent("PAYMENT_WEBHOOK_NO_TRANSACTION", req, {
        eventId,
        orderId,
      });
      sendResponse(res, 200, "Webhook processed with no matching transaction", {
        eventId,
      });
      return;
    }

    transaction.lastWebhookEventId = eventId;

    let gatewayPayments;

    try {
      gatewayPayments = await fetchCashfreeOrderPayments(orderId);
    } catch {
      logSecurityEvent("PAYMENT_WEBHOOK_LOOKUP_FAILED", req, {
        eventId,
        orderId,
      });
      throw new ApiError(502, "Unable to validate webhook payment details");
    }

    const successfulPayment = pickSuccessfulPayment(gatewayPayments || []);
    const latestPayment = pickLatestPayment(gatewayPayments || []);

    if (successfulPayment) {
      transaction.status = "paid";
      transaction.cashfreePaymentId = String(
        successfulPayment.cf_payment_id || transaction.cashfreePaymentId || "",
      );
      transaction.cashfreePaymentSessionId = String(
        successfulPayment.payment_group || transaction.cashfreePaymentSessionId || "",
      );
      transaction.paidAt =
        transaction.paidAt ||
        new Date(
          successfulPayment.payment_completion_time ||
            successfulPayment.payment_time ||
            Date.now(),
        );
      transaction.failedAt = null;
      transaction.failureReason = "";

      if (!transaction.receiptNumber) {
        transaction.receiptNumber = createReceiptNumber();
      }

      await transaction.save();
      await sendReceiptEmailForTransaction(transaction, req);

      logSecurityEvent("PAYMENT_WEBHOOK_MARKED_PAID", req, {
        eventId,
        eventType,
        orderId,
        paymentStatus,
        receiptNumber: transaction.receiptNumber,
      });
    } else if (
      latestPayment &&
      isFailurePaymentStatus(latestPayment.payment_status)
    ) {
      await failTransaction(
        transaction,
        `payment_${String(latestPayment.payment_status || "failed").toLowerCase()}`,
      );
      logSecurityEvent("PAYMENT_WEBHOOK_MARKED_FAILED", req, {
        eventId,
        eventType,
        orderId,
        paymentStatus: latestPayment.payment_status,
      });
    } else {
      await transaction.save();
      logSecurityEvent("PAYMENT_WEBHOOK_IGNORED_EVENT", req, {
        eventId,
        eventType,
        orderId,
        paymentStatus,
      });
    }

    sendResponse(res, 200, "Webhook processed successfully", {
      eventId,
      eventType,
    });
  } catch (error) {
    next(error);
  }
};

export const downloadReceipt = async (req, res, next) => {
  try {
    if (!isDatabaseReady(req)) {
      throw new ApiError(503, "Receipt service temporarily unavailable");
    }

    const { receiptNumber } = req.params;
    const { token } = req.query;

    const tokenResult = verifyDownloadToken(token);

    if (!tokenResult.valid) {
      throw new ApiError(401, "Receipt access token is invalid or expired");
    }

    if (tokenResult.payload.scope !== "receipt-download") {
      throw new ApiError(401, "Invalid receipt token scope");
    }

    if (tokenResult.payload.receiptNumber !== receiptNumber) {
      throw new ApiError(403, "Receipt token does not match this receipt");
    }

    const transaction = await PaymentTransaction.findOne({ receiptNumber });

    if (!transaction) {
      throw new ApiError(404, "Receipt not found");
    }

    if (tokenResult.payload.email !== transaction.customerEmail) {
      throw new ApiError(403, "Receipt token identity mismatch");
    }

    const pdfBuffer = await buildReceiptPdfBuffer(transaction);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${transaction.receiptNumber}.pdf"`,
    );
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

export const requestReceiptAccessCode = async (req, res, next) => {
  try {
    if (!isDatabaseReady(req)) {
      throw new ApiError(503, "Receipt access is temporarily unavailable");
    }

    const normalizedEmail = normalizeEmail(req.body.email);

    const hasReceipts = await PaymentTransaction.exists({
      customerEmail: normalizedEmail,
      receiptNumber: { $ne: null },
      status: { $in: ["paid", "refunded"] },
    });

    if (!hasReceipts) {
      logSecurityEvent("RECEIPT_ACCESS_REQUESTED", req, {
        email: normalizedEmail,
        hasReceipts: false,
      });
      sendResponse(
        res,
        200,
        "If matching receipts exist, an access code has been sent.",
      );
      return;
    }

    const code = createOtp();
    const codeHash = createOtpHash(normalizedEmail, code);
    const expiresAt = new Date(
      Date.now() + env.paymentAccessCodeTtlMinutes * 60 * 1000,
    );

    await ReceiptAccessCode.findOneAndUpdate(
      { email: normalizedEmail },
      {
        codeHash,
        expiresAt,
        attempts: 0,
        consumedAt: null,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    const emailResult = await sendReceiptAccessCodeEmail({
      email: normalizedEmail,
      code,
    });

    logSecurityEvent("RECEIPT_ACCESS_REQUESTED", req, {
      email: normalizedEmail,
      hasReceipts: true,
      emailDeliverySkipped: Boolean(emailResult.skipped),
      emailDeliverySent: Boolean(emailResult.sent),
    });

    const responseData = {
      email: normalizedEmail,
      expiresInMinutes: env.paymentAccessCodeTtlMinutes,
    };

    if (env.nodeEnv === "development" && !emailResult.sent) {
      responseData.debugCode = code;
    }

    if (emailResult.skipped) {
      sendResponse(
        res,
        200,
        "If matching receipts exist, receipt access email is temporarily unavailable. Contact billing support.",
        {
          ...responseData,
          emailDeliveryAvailable: false,
          supportEmail: env.paymentSupportEmail,
        },
      );
      return;
    }

    sendResponse(
      res,
      200,
      "If matching receipts exist, an access code has been sent.",
      {
        ...responseData,
        emailDeliveryAvailable: true,
      },
    );
  } catch (error) {
    next(error);
  }
};

export const verifyReceiptAccessCode = async (req, res, next) => {
  try {
    if (!isDatabaseReady(req)) {
      throw new ApiError(503, "Receipt access is temporarily unavailable");
    }

    const normalizedEmail = normalizeEmail(req.body.email);
    const code = String(req.body.code || "").trim();

    const accessCode = await ReceiptAccessCode.findOne({
      email: normalizedEmail,
    });

    if (
      !accessCode ||
      accessCode.consumedAt ||
      accessCode.expiresAt <= new Date()
    ) {
      throw new ApiError(400, "Access code is invalid or expired");
    }

    const expectedHash = createOtpHash(normalizedEmail, code);
    const validCode =
      expectedHash.length === accessCode.codeHash.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedHash, "utf8"),
        Buffer.from(accessCode.codeHash, "utf8"),
      );

    if (!validCode) {
      accessCode.attempts += 1;
      if (accessCode.attempts >= MAX_OTP_ATTEMPTS) {
        accessCode.consumedAt = new Date();
      }
      await accessCode.save();
      logSecurityEvent("RECEIPT_ACCESS_VERIFY_FAILED", req, {
        email: normalizedEmail,
        attempts: accessCode.attempts,
      });
      throw new ApiError(400, "Access code is invalid or expired");
    }

    accessCode.consumedAt = new Date();
    await accessCode.save();

    const portalToken = createPortalToken({ email: normalizedEmail });

    logSecurityEvent("RECEIPT_ACCESS_VERIFY_SUCCESS", req, {
      email: normalizedEmail,
    });

    sendResponse(res, 200, "Receipt access verified", {
      portalToken,
      expiresInMinutes: env.paymentPortalTokenTtlMinutes,
    });
  } catch (error) {
    next(error);
  }
};

export const getReceiptHistory = async (req, res, next) => {
  try {
    if (!isDatabaseReady(req)) {
      throw new ApiError(503, "Receipt history is temporarily unavailable");
    }

    const { token } = req.query;
    const tokenResult = verifyPortalToken(token);

    if (!tokenResult.valid) {
      throw new ApiError(401, "Portal token is invalid or expired");
    }

    if (tokenResult.payload.scope !== "receipt-history") {
      throw new ApiError(401, "Invalid portal token scope");
    }

    const receipts = await PaymentTransaction.find({
      customerEmail: tokenResult.payload.email,
      status: { $in: ["paid", "refunded"] },
      receiptNumber: { $ne: null },
    })
      .sort({ paidAt: -1, createdAt: -1 })
      .limit(MAX_HISTORY_ITEMS);

    const response = receipts.map((transaction) => ({
      receiptNumber: transaction.receiptNumber,
      serviceName: transaction.serviceName,
      amountInr: transaction.amountInr,
      currency: transaction.currency,
      status: transaction.status,
      paidAt: transaction.paidAt,
      orderId: transaction.cashfreeOrderId,
      paymentId: transaction.cashfreePaymentId,
      downloadUrl: buildDownloadUrl(transaction),
    }));

    sendResponse(res, 200, "Receipt history fetched successfully", {
      email: tokenResult.payload.email,
      receipts: response,
    });
  } catch (error) {
    next(error);
  }
};
