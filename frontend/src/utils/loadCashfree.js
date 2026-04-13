const CASHFREE_SCRIPT_SRC = "https://sdk.cashfree.com/js/v3/cashfree.js";

const hasCashfreeObject = () =>
  typeof window !== "undefined" && typeof window.Cashfree !== "undefined";

export const loadCashfreeCheckout = () => {
  if (hasCashfreeObject()) {
    return Promise.resolve(true);
  }

  if (typeof document === "undefined") {
    return Promise.resolve(false);
  }

  const existingScript = document.querySelector(
    `script[src="${CASHFREE_SCRIPT_SRC}"]`,
  );

  if (existingScript) {
    return new Promise((resolve) => {
      existingScript.addEventListener("load", () => resolve(true), {
        once: true,
      });
      existingScript.addEventListener("error", () => resolve(false), {
        once: true,
      });
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = CASHFREE_SCRIPT_SRC;
    script.async = true;
    script.referrerPolicy = "no-referrer";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
