const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

const hasRazorpayObject = () =>
  typeof window !== "undefined" && typeof window.Razorpay !== "undefined";

export const loadRazorpayCheckout = () => {
  if (hasRazorpayObject()) {
    return Promise.resolve(true);
  }

  if (typeof document === "undefined") {
    return Promise.resolve(false);
  }

  const existingScript = document.querySelector(
    `script[src="${RAZORPAY_SCRIPT_SRC}"]`,
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
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.referrerPolicy = "no-referrer";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
