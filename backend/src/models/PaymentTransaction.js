import mongoose from "mongoose";

const paymentTransactionSchema = new mongoose.Schema(
  {
    idempotencyKey: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 12,
      maxlength: 120,
    },
    serviceSlug: {
      type: String,
      required: true,
      trim: true,
    },
    serviceName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    amountInr: {
      type: Number,
      required: true,
      min: 1,
    },
    amountPaise: {
      type: Number,
      required: true,
      min: 100,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
      trim: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 160,
    },
    customerPhone: {
      type: String,
      trim: true,
      maxlength: 24,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
    },
    cashfreeOrderId: {
      type: String,
      trim: true,
      default: undefined,
    },
    cashfreePaymentId: {
      type: String,
      trim: true,
      default: undefined,
    },
    cashfreePaymentSessionId: {
      type: String,
      trim: true,
      default: "",
    },
    receiptNumber: {
      type: String,
      trim: true,
      default: undefined,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    failedAt: {
      type: Date,
      default: null,
    },
    refundedAt: {
      type: Date,
      default: null,
    },
    failureReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    receiptEmailStatus: {
      type: String,
      enum: ["pending", "sent", "failed", "skipped"],
      default: "pending",
    },
    receiptEmailError: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    receiptEmailSentAt: {
      type: Date,
      default: null,
    },
    lastWebhookEventId: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

paymentTransactionSchema.index({ createdAt: -1 });
paymentTransactionSchema.index({ customerEmail: 1, createdAt: -1 });
paymentTransactionSchema.index({ status: 1, createdAt: -1 });
paymentTransactionSchema.index(
  { cashfreeOrderId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      cashfreeOrderId: {
        $type: "string",
        $ne: "",
      },
    },
  },
);
paymentTransactionSchema.index(
  { cashfreePaymentId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      cashfreePaymentId: {
        $type: "string",
        $ne: "",
      },
    },
  },
);
paymentTransactionSchema.index(
  { receiptNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      receiptNumber: {
        $type: "string",
        $ne: "",
      },
    },
  },
);

const PaymentTransaction = mongoose.model(
  "PaymentTransaction",
  paymentTransactionSchema,
);

export const ensurePaymentTransactionIndexes = async () => {
  await PaymentTransaction.syncIndexes();
};

export default PaymentTransaction;
