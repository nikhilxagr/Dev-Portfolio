import { api, getApiBaseUrl } from "@/services/api";

const RECEIPT_SESSION_KEY = "portfolio_last_receipt";

const canUseStorage = () =>
  typeof window !== "undefined" && Boolean(window.sessionStorage);

const safeParse = (value) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const createPaymentOrder = async (payload) => {
  const { data } = await api.post("/payments/create-order", payload);
  return data;
};

export const verifyServicePayment = async (payload) => {
  const { data } = await api.post("/payments/verify", payload);
  return data;
};

export const requestReceiptAccessCode = async (email) => {
  const { data } = await api.post("/payments/receipts/request-access", {
    email,
  });
  return data;
};

export const verifyReceiptAccessCode = async ({ email, code }) => {
  const { data } = await api.post("/payments/receipts/verify-access", {
    email,
    code,
  });
  return data;
};

export const getReceiptHistory = async (token) => {
  const { data } = await api.get("/payments/receipts/history", {
    params: { token },
  });
  return data;
};

export const persistLatestReceipt = (receiptPayload) => {
  if (!canUseStorage()) {
    return;
  }

  window.sessionStorage.setItem(
    RECEIPT_SESSION_KEY,
    JSON.stringify(receiptPayload || {}),
  );
};

export const getLatestReceipt = () => {
  if (!canUseStorage()) {
    return null;
  }

  return safeParse(window.sessionStorage.getItem(RECEIPT_SESSION_KEY));
};

export const clearLatestReceipt = () => {
  if (!canUseStorage()) {
    return;
  }

  window.sessionStorage.removeItem(RECEIPT_SESSION_KEY);
};

export const toAbsoluteApiUrl = (relativeOrAbsolutePath = "") => {
  if (!relativeOrAbsolutePath) {
    return "";
  }

  if (/^https?:\/\//i.test(relativeOrAbsolutePath)) {
    return relativeOrAbsolutePath;
  }

  const normalizedPath = relativeOrAbsolutePath.startsWith("/")
    ? relativeOrAbsolutePath
    : `/${relativeOrAbsolutePath}`;

  let baseUrl = getApiBaseUrl().replace(/\/$/, "");
  let finalPath = normalizedPath;

  if (baseUrl.endsWith("/api") && normalizedPath.startsWith("/api/")) {
    finalPath = normalizedPath.slice(4);
  }

  return `${baseUrl}${finalPath}`;
};
