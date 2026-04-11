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
    razorpayOrderId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      default: null,
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      default: null,
    },
    razorpaySignature: {
      type: String,
      trim: true,
      default: "",
    },
    receiptNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      default: null,
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

const PaymentTransaction = mongoose.model(
  "PaymentTransaction",
  paymentTransactionSchema,
);

export default PaymentTransaction;
