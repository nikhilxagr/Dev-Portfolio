import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import Contact from "../models/Contact.js";
import PaymentTransaction from "../models/PaymentTransaction.js";
import PaymentWebhookEvent from "../models/PaymentWebhookEvent.js";
import Project from "../models/Project.js";
import {
  SUPPORT_PAYMENT_CONFIG,
  getServiceBySlug,
} from "../constants/servicesCatalog.js";
import { env } from "../config/env.js";
import { sendResponse } from "../utils/apiResponse.js";
import {
  getCashfreeMode,
  isCashfreeConfigured,
} from "../utils/cashfreeClient.js";

const ALLOWED_RANGE_DAYS = new Set([7, 30, 90]);
const DEFAULT_RANGE_DAYS = 30;
const MAX_PAYMENT_HISTORY = 150;

const toRangeDays = (value) => {
  const parsed = Number(value);
  if (ALLOWED_RANGE_DAYS.has(parsed)) {
    return parsed;
  }

  return DEFAULT_RANGE_DAYS;
};

const toRangeStart = (days) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000);

const normalizeStatusFilter = (value) => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  if (!normalized || normalized === "all") {
    return "all";
  }

  if (["created", "paid", "failed", "refunded"].includes(normalized)) {
    return normalized;
  }

  return "all";
};

const normalizeServiceFilter = (value) => {
  const normalized = String(value || "").trim();
  if (!normalized || normalized === "all") {
    return "all";
  }

  if (normalized === "support" || normalized === SUPPORT_PAYMENT_CONFIG.slug) {
    return SUPPORT_PAYMENT_CONFIG.slug;
  }

  if (getServiceBySlug(normalized)) {
    return normalized;
  }

  return "all";
};

const formatPayment = (transaction) => ({
  id: transaction._id,
  orderId: transaction.cashfreeOrderId || "",
  paymentId: transaction.cashfreePaymentId || "",
  amountInr: transaction.amountInr,
  currency: transaction.currency,
  status: transaction.status,
  customerName: transaction.customerName,
  customerEmail: transaction.customerEmail,
  customerPhone: transaction.customerPhone,
  serviceName: transaction.serviceName,
  serviceSlug: transaction.serviceSlug,
  createdAt: transaction.createdAt,
  paidAt: transaction.paidAt,
  receiptNumber: transaction.receiptNumber || "",
});

const isDatabaseReady = (req) => {
  const ready = mongoose.connection.readyState === 1;
  req.app.locals.dbConnected = ready;
  return ready;
};

const normalizeTotals = (aggregation, key) => {
  if (!Array.isArray(aggregation) || aggregation.length === 0) {
    return 0;
  }

  return Number(aggregation[0]?.[key]) || 0;
};

export const getAdminOverview = async (req, res, next) => {
  try {
    const rangeDays = toRangeDays(req.query.range);
    const rangeStart = toRangeStart(rangeDays);
    const rangeMatch = { createdAt: { $gte: rangeStart } };

    const [
      paymentsByStatus,
      paidTotals,
      supportTotals,
      contactsTotal,
      contactsNew,
      contactsUnread,
      projectsTotal,
      projectsNew,
      blogsTotal,
      blogsNew,
      recentPayments,
    ] = await Promise.all([
      PaymentTransaction.aggregate([
        { $match: rangeMatch },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            amountInr: { $sum: "$amountInr" },
          },
        },
      ]),
      PaymentTransaction.aggregate([
        { $match: { ...rangeMatch, status: "paid" } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            amountInr: { $sum: "$amountInr" },
          },
        },
      ]),
      PaymentTransaction.aggregate([
        {
          $match: {
            ...rangeMatch,
            status: "paid",
            serviceSlug: SUPPORT_PAYMENT_CONFIG.slug,
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            amountInr: { $sum: "$amountInr" },
          },
        },
      ]),
      Contact.countDocuments(rangeMatch),
      Contact.countDocuments({ ...rangeMatch, status: "new" }),
      Contact.countDocuments({ status: "new" }),
      Project.countDocuments({}),
      Project.countDocuments(rangeMatch),
      Blog.countDocuments({}),
      Blog.countDocuments(rangeMatch),
      PaymentTransaction.find(rangeMatch)
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const statusCounts = paymentsByStatus.reduce(
      (acc, entry) => {
        acc[entry._id] = Number(entry.count) || 0;
        acc.amounts[entry._id] = Number(entry.amountInr) || 0;
        acc.total += Number(entry.count) || 0;
        return acc;
      },
      {
        total: 0,
        amounts: {},
        created: 0,
        paid: 0,
        failed: 0,
        refunded: 0,
      },
    );

    const paidRevenue = normalizeTotals(paidTotals, "amountInr");
    const paidCount = normalizeTotals(paidTotals, "count");
    const supportRevenue = normalizeTotals(supportTotals, "amountInr");
    const supportCount = normalizeTotals(supportTotals, "count");
    const serviceRevenue = Math.max(paidRevenue - supportRevenue, 0);
    const serviceCount = Math.max(paidCount - supportCount, 0);

    sendResponse(res, 200, "Admin overview loaded", {
      rangeDays,
      payments: {
        total: statusCounts.total,
        created: statusCounts.created || 0,
        paid: statusCounts.paid || 0,
        failed: statusCounts.failed || 0,
        refunded: statusCounts.refunded || 0,
        revenueInr: paidRevenue,
        supportRevenueInr: supportRevenue,
        supportCount,
        serviceRevenueInr: serviceRevenue,
        serviceCount,
      },
      contacts: {
        total: contactsTotal,
        new: contactsNew,
        unread: contactsUnread,
      },
      content: {
        projectsTotal,
        projectsNew,
        blogsTotal,
        blogsNew,
      },
      recentPayments: recentPayments.map(formatPayment),
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminPaymentsHistory = async (req, res, next) => {
  try {
    const rangeDays = toRangeDays(req.query.range);
    const rangeStart = toRangeStart(rangeDays);
    const status = normalizeStatusFilter(req.query.status);
    const service = normalizeServiceFilter(req.query.service);
    const limit = Math.min(Number(req.query.limit) || 60, MAX_PAYMENT_HISTORY);

    const match = {
      createdAt: { $gte: rangeStart },
    };

    if (status !== "all") {
      match.status = status;
    }

    if (service !== "all") {
      match.serviceSlug = service;
    }

    const [payments, totalCount, statusCounts] = await Promise.all([
      PaymentTransaction.find(match)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean(),
      PaymentTransaction.countDocuments(match),
      PaymentTransaction.aggregate([
        { $match: match },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const counts = statusCounts.reduce(
      (acc, entry) => {
        acc[entry._id] = Number(entry.count) || 0;
        return acc;
      },
      {
        created: 0,
        paid: 0,
        failed: 0,
        refunded: 0,
      },
    );

    sendResponse(res, 200, "Payment history loaded", {
      rangeDays,
      totalCount,
      statusCounts: counts,
      items: payments.map(formatPayment),
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminSystemStatus = async (req, res, next) => {
  try {
    const dbConnected = isDatabaseReady(req);
    const lastWebhook = await PaymentWebhookEvent.findOne()
      .sort({ receivedAt: -1 })
      .lean();
    const lastPayment = await PaymentTransaction.findOne()
      .sort({ createdAt: -1 })
      .select("createdAt status")
      .lean();

    const gatewayConfigured = isCashfreeConfigured();
    const receiptEmailConfigured = Boolean(
      env.resendApiKey && env.paymentFromEmail,
    );

    sendResponse(res, 200, "System status loaded", {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      dbConnected,
      gateway: {
        provider: "cashfree",
        mode: gatewayConfigured ? getCashfreeMode() : "not-configured",
        configured: gatewayConfigured,
        webhookReady: gatewayConfigured && Boolean(env.cashfreeWebhookSecret),
        receiptTokenReady: Boolean(env.paymentReceiptTokenSecret),
        receiptEmailEnabled: env.paymentReceiptEmailEnabled,
        receiptEmailReady: env.paymentReceiptEmailEnabled
          ? receiptEmailConfigured
          : false,
        lastWebhookAt: lastWebhook?.receivedAt || null,
        lastPaymentAt: lastPayment?.createdAt || null,
      },
    });
  } catch (error) {
    next(error);
  }
};
