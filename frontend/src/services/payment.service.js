import { api, getApiBaseUrl } from "@/services/api";
import { loadCashfreeCheckout } from "@/utils/loadCashfree";

const RECEIPT_SESSION_KEY = "portfolio_last_receipt";
const BACKEND_WARMUP_COOLDOWN_MS = 2 * 60 * 1000;
const BACKEND_WARMUP_TIMEOUT_MS = 6000;
const BACKEND_WARMUP_SUCCESS_MESSAGE =
  "Backend wakeup successful: Server is running.";

let backendWarmupInFlight = null;
let backendWarmupLastRunAt = 0;
let backendWarmupLoggedSuccess = false;

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

const createRequestTimeoutSignal = (timeoutMs) => {
  if (
    typeof AbortSignal !== "undefined" &&
    typeof AbortSignal.timeout === "function"
  ) {
    return {
      signal: AbortSignal.timeout(timeoutMs),
      cleanup: () => {},
    };
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  return {
    signal: controller.signal,
    cleanup: () => {
      window.clearTimeout(timeoutId);
    },
  };
};

export const prewarmBackendForCheckout = async ({
  force = false,
  includeCashfreeScript = true,
} = {}) => {
  if (typeof window === "undefined") {
    return {
      backendReady: false,
      scriptReady: false,
      skipped: true,
      reason: "not-browser",
    };
  }

  if (!force && backendWarmupInFlight) {
    return backendWarmupInFlight;
  }

  const withinCooldown =
    Date.now() - backendWarmupLastRunAt < BACKEND_WARMUP_COOLDOWN_MS;

  if (!force && withinCooldown) {
    if (includeCashfreeScript) {
      void loadCashfreeCheckout().catch(() => false);
    }

    return {
      backendReady: true,
      scriptReady: false,
      skipped: true,
      reason: "cooldown",
    };
  }

  backendWarmupInFlight = (async () => {
    const healthUrl = toAbsoluteApiUrl("/health");
    const { signal, cleanup } = createRequestTimeoutSignal(
      BACKEND_WARMUP_TIMEOUT_MS,
    );

    let backendReady = false;

    try {
      const response = await fetch(healthUrl, {
        method: "GET",
        cache: "no-store",
        signal,
      });

      backendReady = response.ok;

      if (backendReady) {
        backendWarmupLastRunAt = Date.now();

        if (!backendWarmupLoggedSuccess) {
          console.info(BACKEND_WARMUP_SUCCESS_MESSAGE);
          backendWarmupLoggedSuccess = true;
        }
      }
    } catch {
      backendReady = false;
    } finally {
      cleanup();
    }

    let scriptReady = false;

    if (includeCashfreeScript) {
      scriptReady = await loadCashfreeCheckout();
    }

    return {
      backendReady,
      scriptReady,
      skipped: false,
      reason: backendReady ? "success" : "failed",
    };
  })();

  try {
    return await backendWarmupInFlight;
  } finally {
    backendWarmupInFlight = null;
  }
};

export const createPaymentOrder = async (payload) => {
  const { data } = await api.post("/payments/create-order", payload);
  return data;
};

export const createSupportPaymentOrder = async (payload) => {
  const { data } = await api.post("/payments/create-support-order", payload);
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
