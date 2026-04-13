import ApiError from "../utils/ApiError.js";

const resolveDuplicateKeyMessage = (error) => {
  const conflictFields = Object.keys(
    error?.keyPattern || error?.keyValue || {},
  );

  if (conflictFields.includes("idempotencyKey")) {
    return "Duplicate payment request detected. Please retry after a few seconds.";
  }

  if (
    conflictFields.some((field) =>
      ["cashfreeOrderId", "cashfreePaymentId", "receiptNumber"].includes(field),
    )
  ) {
    return "Payment record conflict detected. Please retry checkout.";
  }

  return "A duplicate data conflict was detected. Please retry.";
};

export const notFoundHandler = (_req, _res, next) => {
  next(new ApiError(404, "Route not found"));
};

export const errorHandler = (error, _req, res, _next) => {
  const isDuplicateKeyError = error?.code === 11000;
  const statusCode = isDuplicateKeyError ? 409 : error.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";
  const message = isDuplicateKeyError
    ? resolveDuplicateKeyMessage(error)
    : error.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(isProduction ? {} : { stack: error.stack }),
  });
};
