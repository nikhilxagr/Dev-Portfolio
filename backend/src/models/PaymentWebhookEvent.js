import mongoose from "mongoose";

const paymentWebhookEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 220,
    },
    eventType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    receivedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  },
);

paymentWebhookEventSchema.index(
  { receivedAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 45 },
);

const PaymentWebhookEvent = mongoose.model(
  "PaymentWebhookEvent",
  paymentWebhookEventSchema,
);

export default PaymentWebhookEvent;
