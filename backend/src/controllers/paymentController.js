import crypto from "crypto";
import mongoose from "mongoose";
import PaymentTransaction from "../models/PaymentTransaction.js";
import ReceiptAccessCode from "../models/ReceiptAccessCode.js";
import PaymentWebhookEvent from "../models/PaymentWebhookEvent.js";
import ApiError from "../utils/ApiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { getServiceBySlug } from "../constants/servicesCatalog.js";
import {
  createDownloadToken,
  createPortalToken,
  verifyDownloadToken,
  verifyPortalToken,
} from "../utils/tokenSigner.js";
import {
  getRazorpayClient,
  isRazorpayConfigured,
  verifyRazorpayPaymentSignature,
  verifyRazorpayWebhookSignature,
} from "../utils/razorpayClient.js";
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

const getPaymentMismatchReason = (transaction, paymentEntity) => {
  if (!paymentEntity || typeof paymentEntity !== "object") {
    return "missing_payment_entity";
  }

  if (
    paymentEntity.order_id &&
    paymentEntity.order_id !== transaction.razorpayOrderId
  ) {
    return "order_mismatch";
  }

  const normalizedCurrency = String(paymentEntity.currency || "").toUpperCase();
  if (normalizedCurrency && normalizedCurrency !== transaction.currency) {
    return "currency_mismatch";
  }

  if (
    typeof paymentEntity.amount === "number" &&
    paymentEntity.amount !== transaction.amountPaise
  ) {
    return "amount_mismatch";
  }

  return "";
};

const normalizeEmail = (value) => String(value).toLowerCase().trim();

const isDatabaseReady = (req) => {
  const ready = mongoose.connection.readyState === 1;
  req.app.locals.dbConnected = ready;
  return ready;
};

const ensurePaymentConfigured = () => {
  if (!isRazorpayConfigured()) {
    throw new ApiError(
      503,
      "Payment gateway is not configured yet. Please contact support.",
    );
  }
};

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

const getBaseUrl = (req) => `${req.protocol}://${req.get("host")}`;

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
  orderId: transaction.razorpayOrderId,
  paymentId: transaction.razorpayPaymentId,
  emailStatus: transaction.receiptEmailStatus,
  downloadUrl: buildDownloadUrl(transaction),
});

export const getPaymentConfigStatus = (_req, res) => {
  const hasRazorpayKeyId = Boolean(env.razorpayKeyId);
  const hasRazorpayKeySecret = Boolean(env.razorpayKeySecret);
  const receiptEmailConfigured = Boolean(
    env.resendApiKey && env.paymentFromEmail,
  );
  const checkoutReady = hasRazorpayKeyId && hasRazorpayKeySecret;

  sendResponse(res, 200, "Payment configuration status fetched", {
    mode: env.razorpayKeyId.startsWith("rzp_live_")
      ? "live"
      : hasRazorpayKeyId
        ? "test"
        : "not-configured",
    checkoutReady,
    webhookReady: checkoutReady && Boolean(env.razorpayWebhookSecret),
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
        customerPhone: customerPhone.trim(),
        notes: notes.trim(),
      });
    }

    if (!transaction.razorpayOrderId) {
      const razorpay = getRazorpayClient();
      const razorpayOrder = await razorpay.orders.create({
        amount: service.amountPaise,
        currency: service.currency,
        receipt: `svc-${transaction._id.toString().slice(-10)}`,
        notes: {
          serviceSlug: service.slug,
          customerEmail: normalizedEmail,
        },
      });

      transaction.razorpayOrderId = razorpayOrder.id;
      transaction.status = "created";
      transaction.failureReason = "";
      transaction.failedAt = null;
      await transaction.save();
    }

    sendResponse(res, 201, "Payment order created successfully", {
      transactionRef: transaction.id,
      checkout: {
        key: env.razorpayKeyId,
        orderId: transaction.razorpayOrderId,
        amount: transaction.amountPaise,
        currency: transaction.currency,
        name: env.paymentBusinessName,
        description: transaction.serviceName,
        prefill: {
          name: transaction.customerName,
          email: transaction.customerEmail,
          contact: transaction.customerPhone,
        },
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
    if (transaction && !transaction.razorpayOrderId) {
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

    const {
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    } = req.body;

    const transaction = await PaymentTransaction.findOne({ razorpayOrderId });

    if (!transaction) {
      throw new ApiError(404, "Payment order not found");
    }

    const isValidSignature = verifyRazorpayPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValidSignature) {
      await failTransaction(transaction, "signature_verification_failed");
      logSecurityEvent("PAYMENT_VERIFY_FAILED", req, {
        orderId: razorpayOrderId,
        reason: "signature_mismatch",
      });
      throw new ApiError(400, "Payment signature verification failed");
    }

    let gatewayPayment;

    try {
      const razorpay = getRazorpayClient();
      gatewayPayment = await razorpay.payments.fetch(razorpayPaymentId);
    } catch {
      logSecurityEvent("PAYMENT_VERIFY_LOOKUP_FAILED", req, {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
      });
      throw new ApiError(
        502,
        "Unable to validate payment details right now. Please try again.",
      );
    }

    const mismatchReason = getPaymentMismatchReason(
      transaction,
      gatewayPayment,
    );

    if (mismatchReason) {
      await failTransaction(transaction, `gateway_${mismatchReason}`);
      logSecurityEvent("PAYMENT_VERIFY_FAILED", req, {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        reason: mismatchReason,
      });
      throw new ApiError(400, "Payment verification failed integrity checks");
    }

    const isAlreadyPaid = transaction.status === "paid";

    transaction.status = "paid";
    transaction.razorpayPaymentId = razorpayPaymentId;
    transaction.razorpaySignature = razorpaySignature;
    transaction.paidAt = transaction.paidAt || new Date();
    transaction.failedAt = null;
    transaction.failureReason = "";

    if (!transaction.receiptNumber) {
      transaction.receiptNumber = createReceiptNumber();
    }

    await transaction.save();
    await sendReceiptEmailForTransaction(transaction, req);

    logSecurityEvent("PAYMENT_VERIFY_SUCCESS", req, {
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
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

export const handleRazorpayWebhook = async (req, res, next) => {
  try {
    if (!isDatabaseReady(req)) {
      throw new ApiError(
        503,
        "Webhook processing unavailable while database reconnects",
      );
    }

    const signatureHeader = req.headers["x-razorpay-signature"];
    const signature = Array.isArray(signatureHeader)
      ? signatureHeader[0]
      : signatureHeader;

    if (!signature || !Buffer.isBuffer(req.body)) {
      throw new ApiError(400, "Invalid webhook payload");
    }

    const isValidWebhook = verifyRazorpayWebhookSignature({
      rawBody: req.body,
      signature,
    });

    if (!isValidWebhook) {
      logSecurityEvent("PAYMENT_WEBHOOK_REJECTED", req, {
        reason: "invalid_signature",
      });
      throw new ApiError(401, "Webhook signature verification failed");
    }

    const payload = JSON.parse(req.body.toString("utf8"));

    const headerEventId = req.headers["x-razorpay-event-id"];
    const eventId = Array.isArray(headerEventId)
      ? headerEventId[0]
      : headerEventId ||
        `${payload.event}:${payload.created_at || Date.now()}:${
          payload.payload?.payment?.entity?.id || "na"
        }`;

    const alreadyProcessed = await PaymentWebhookEvent.findOne({ eventId });

    if (alreadyProcessed) {
      logSecurityEvent("PAYMENT_WEBHOOK_DUPLICATE", req, { eventId });
      sendResponse(res, 200, "Webhook event already processed", { eventId });
      return;
    }

    await PaymentWebhookEvent.create({
      eventId,
      eventType: payload.event || "unknown",
    });

    const paymentEntity = payload.payload?.payment?.entity;
    const orderId = paymentEntity?.order_id;

    if (!orderId) {
      logSecurityEvent("PAYMENT_WEBHOOK_NO_ORDER", req, {
        eventId,
        eventType: payload.event,
      });
      sendResponse(res, 200, "Webhook processed without order reference", {
        eventId,
      });
      return;
    }

    const transaction = await PaymentTransaction.findOne({
      razorpayOrderId: orderId,
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

    if (["payment.captured", "payment.authorized"].includes(payload.event)) {
      const mismatchReason = getPaymentMismatchReason(
        transaction,
        paymentEntity,
      );

      if (mismatchReason) {
        await failTransaction(transaction, `webhook_${mismatchReason}`);
        logSecurityEvent("PAYMENT_WEBHOOK_MISMATCH", req, {
          eventId,
          eventType: payload.event,
          orderId,
          reason: mismatchReason,
        });
        sendResponse(res, 202, "Webhook accepted with integrity mismatch", {
          eventId,
          eventType: payload.event,
        });
        return;
      }

      transaction.status = "paid";
      transaction.razorpayPaymentId =
        transaction.razorpayPaymentId || paymentEntity?.id || null;
      transaction.paidAt = transaction.paidAt || new Date();
      transaction.failedAt = null;
      transaction.failureReason = "";

      if (!transaction.receiptNumber) {
        transaction.receiptNumber = createReceiptNumber();
      }

      await transaction.save();
      await sendReceiptEmailForTransaction(transaction, req);
      logSecurityEvent("PAYMENT_WEBHOOK_MARKED_PAID", req, {
        eventId,
        eventType: payload.event,
        orderId,
        receiptNumber: transaction.receiptNumber,
      });
    } else if (payload.event === "payment.failed") {
      transaction.status = "failed";
      transaction.failedAt = new Date();
      transaction.failureReason =
        paymentEntity?.error_description || "Payment failed at gateway";
      await transaction.save();
      logSecurityEvent("PAYMENT_WEBHOOK_MARKED_FAILED", req, {
        eventId,
        orderId,
      });
    } else if (["refund.created", "refund.processed"].includes(payload.event)) {
      transaction.status = "refunded";
      transaction.refundedAt = new Date();
      await transaction.save();
      logSecurityEvent("PAYMENT_WEBHOOK_MARKED_REFUNDED", req, {
        eventId,
        orderId,
      });
    } else {
      await transaction.save();
      logSecurityEvent("PAYMENT_WEBHOOK_IGNORED_EVENT", req, {
        eventId,
        eventType: payload.event,
        orderId,
      });
    }

    sendResponse(res, 200, "Webhook processed successfully", {
      eventId,
      eventType: payload.event,
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
      orderId: transaction.razorpayOrderId,
      paymentId: transaction.razorpayPaymentId,
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
