import mongoose from "mongoose";

const receiptAccessCodeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 160,
    },
    codeHash: {
      type: String,
      required: true,
      trim: true,
      maxlength: 128,
    },
    attempts: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    consumedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

receiptAccessCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const ReceiptAccessCode = mongoose.model(
  "ReceiptAccessCode",
  receiptAccessCodeSchema,
);

export default ReceiptAccessCode;
