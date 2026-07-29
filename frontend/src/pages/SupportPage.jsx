import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, HeartHandshake } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import SeoHead from "@/components/seo/SeoHead";
import {
  createSupportPaymentOrder,
  prewarmBackendForCheckout,
  persistLatestReceipt,
} from "@/services/payment.service";
import { getErrorMessage } from "@/services/api";
import { loadCashfreeCheckout } from "@/utils/loadCashfree";
import { createBreadcrumbSchema } from "@/utils/seo";
import { useUserAuth } from "@/context/UserAuthContext";
import { getGoogleAuthUrl } from "@/services/userAuth.service";
import { SUPPORT_PAYMENT_CONFIG } from "@/constants/siteData";

const GoogleIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const SupportPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, openSignInModal } = useUserAuth();
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentInfo, setPaymentInfo] = useState("");
  const [supportForm, setSupportForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    amountInr: String(SUPPORT_PAYMENT_CONFIG.quickAmounts[1] || 99),
    notes: "",
  });

  useEffect(() => {
    if (user) {
      setSupportForm((prev) => ({
        ...prev,
        customerName: user.name || prev.customerName,
        customerEmail: user.email || prev.customerEmail,
      }));
    }
  }, [user]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      prewarmBackendForCheckout().catch(() => undefined);
    }, 350);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  const updateSupportForm = (field, value) => {
    setSupportForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const generateIdempotencyKey = (prefix = "support") => {
    if (typeof window !== "undefined" && window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }

    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const validateSupportForm = () => {
    if (supportForm.customerName.trim().length < 2) {
      return "Please enter a valid name before checkout.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supportForm.customerEmail.trim())) {
      return "Please enter a valid email for payment confirmation.";
    }

    const normalizedPhone = supportForm.customerPhone.replace(/\D/g, "");
    if (!/^\d{10}$/.test(normalizedPhone)) {
      return "Enter a valid 10-digit phone number for checkout.";
    }

    const normalizedAmount = String(supportForm.amountInr || "").trim();

    if (!/^\d+$/.test(normalizedAmount)) {
      return "Support amount must be a whole INR value.";
    }

    const amountInr = Number(normalizedAmount);

    if (
      amountInr < SUPPORT_PAYMENT_CONFIG.minAmountInr ||
      amountInr > SUPPORT_PAYMENT_CONFIG.maxAmountInr
    ) {
      return `Support amount must be between INR ${SUPPORT_PAYMENT_CONFIG.minAmountInr} and INR ${SUPPORT_PAYMENT_CONFIG.maxAmountInr}.`;
    }

    if (supportForm.notes.trim().length > 500) {
      return "Support message must be up to 500 characters.";
    }

    return "";
  };

  const handleSupportPayment = async () => {
    setPaymentError("");
    setPaymentInfo("");

    if (!isLoggedIn) {
      openSignInModal({
        title: "Sign In to Continue",
        subtitle: "Please sign in with Google or Email before completing your support contribution.",
      });
      return;
    }

    const validationError = validateSupportForm();
    if (validationError) {
      setPaymentError(validationError);
      return;
    }

    setProcessing(true);

    try {
      const normalizedAmountInr = Number(supportForm.amountInr);
      const orderPayload = {
        amountInr: normalizedAmountInr,
        customerName: supportForm.customerName.trim(),
        customerEmail: supportForm.customerEmail.trim(),
        customerPhone: supportForm.customerPhone.replace(/\D/g, ""),
        idempotencyKey: generateIdempotencyKey("support"),
        notes:
          supportForm.notes.trim() ||
          `Support contribution of INR ${normalizedAmountInr}`,
      };

      setPaymentInfo("Preparing secure checkout...");

      const [orderResponse, scriptLoaded] = await Promise.all([
        createSupportPaymentOrder(orderPayload),
        loadCashfreeCheckout(),
      ]);

      const alreadyPaidReceipt = orderResponse?.data?.receipt;
      if (orderResponse?.data?.alreadyPaid && alreadyPaidReceipt) {
        persistLatestReceipt({
          receipt: alreadyPaidReceipt,
          serviceSlug: SUPPORT_PAYMENT_CONFIG.slug,
        });
        navigate("/payment/success");
        return;
      }

      if (!scriptLoaded || typeof window.Cashfree !== "function") {
        throw new Error("Unable to load Cashfree checkout. Please try again.");
      }

      const checkout = orderResponse?.data?.checkout;

      if (!checkout?.orderId || !checkout?.paymentSessionId) {
        throw new Error("Checkout initialization failed. Please retry.");
      }

      const cashfree = window.Cashfree({
        mode: checkout.environment === "production" ? "production" : "sandbox",
      });

      setPaymentInfo("Redirecting to secure Cashfree checkout...");

      const result = await cashfree.checkout({
        paymentSessionId: checkout.paymentSessionId,
        redirectTarget: "_self",
      });

      if (result?.error) {
        throw new Error(
          result.error?.message ||
            "Cashfree checkout could not be opened. Please retry.",
        );
      }

      if (!result?.redirect) {
        navigate(
          `/payment/success?order_id=${encodeURIComponent(checkout.orderId)}`,
        );
      }
    } catch (error) {
      setPaymentError(
        getErrorMessage(error, "Could not initialize payment gateway."),
      );
      setProcessing(false);
    }
  };

  return (
    <>
      <SeoHead
        title="Support Me"
        description="Support Nikhil Agrahari with a custom contribution through secure Cashfree checkout and instant receipt generation."
        pathname="/support"
        keywords={[
          "support nikhil",
          "support contribution",
          "cashfree support payment",
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Support", path: "/support" },
        ])}
      />

      <section className="section-wrap pt-12 sm:pt-20">
        <SectionTitle
          mobileCenter={false}
          eyebrow="Contribution Support"
          title="Support This Work"
          description="If the work is useful, you can contribute any amount through secure checkout and receive an instant receipt."
          className="mx-auto max-w-3xl text-center"
        />

        {paymentError ? (
          <p className="mx-auto mt-4 max-w-4xl rounded-xl border border-rose-300/35 bg-rose-300/10 px-4 py-3 text-sm text-rose-200">
            {paymentError}
          </p>
        ) : null}
        {paymentInfo ? (
          <p className="mx-auto mt-4 max-w-4xl rounded-xl border border-emerald-300/35 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-200">
            {paymentInfo}
          </p>
        ) : null}

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.12fr_0.88fr] xl:items-start">
          <article className="card-surface rounded-3xl p-6">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-emerald-200">
              <HeartHandshake size={14} />
              Contribution Form
            </p>
            <h3 className="mt-2 text-xl font-semibold text-cyan-100">
              Fill Form and Pay Now
            </h3>
            <p className="mt-1 text-sm text-slate-300">
              Contribution range: INR {SUPPORT_PAYMENT_CONFIG.minAmountInr} to
              INR {SUPPORT_PAYMENT_CONFIG.maxAmountInr}.
            </p>

            {!isLoggedIn ? (
              <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center shadow-lg">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                  <GoogleIcon />
                </div>
                <h4 className="mt-3 text-base font-extrabold text-white">
                  Sign In Required to Support
                </h4>
                <p className="mt-1 text-xs text-slate-300 max-w-sm mx-auto font-medium">
                  Please sign in with your Google account first to access the contribution form and receive your official payment receipt.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem(
                        "auth_return_url",
                        window.location.pathname + window.location.search,
                      );
                    }
                    window.location.href = getGoogleAuthUrl();
                  }}
                  className="mt-5 inline-flex items-center justify-center gap-3 rounded-xl bg-white text-slate-900 font-extrabold px-6 py-3 text-xs shadow-md hover:bg-slate-100 transition"
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </button>
              </div>
            ) : (
              <>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-300">
                    Full Name
                    <input
                      type="text"
                      value={supportForm.customerName}
                      onChange={(event) =>
                        updateSupportForm("customerName", event.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-cyan-300/25 dark:bg-slate-950/80 dark:text-slate-100 dark:focus:border-cyan-300"
                      placeholder="Your full name"
                    />
                  </label>

                  <label className="text-xs font-bold text-slate-800 dark:text-slate-300">
                    Email <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold ml-1">(Account Email 🔒)</span>
                    <input
                      type="email"
                      readOnly
                      value={supportForm.customerEmail}
                      className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 cursor-not-allowed font-semibold outline-none"
                      placeholder="you@example.com"
                    />
                  </label>

                  <label className="text-xs font-bold text-slate-800 dark:text-slate-300">
                    Phone
                    <input
                      type="text"
                      value={supportForm.customerPhone}
                      onChange={(event) =>
                        updateSupportForm("customerPhone", event.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-cyan-300/25 dark:bg-slate-950/80 dark:text-slate-100 dark:focus:border-cyan-300"
                      placeholder="9876543210"
                    />
                  </label>

                  <label className="text-xs font-bold text-slate-800 dark:text-slate-300">
                    Amount (INR)
                    <input
                      type="text"
                      inputMode="numeric"
                      value={supportForm.amountInr}
                      onChange={(event) =>
                        updateSupportForm(
                          "amountInr",
                          event.target.value.replace(/\D/g, ""),
                        )
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-cyan-300/25 dark:bg-slate-950/80 dark:text-slate-100 dark:focus:border-cyan-300"
                      placeholder="99"
                    />
                  </label>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
                    Quick amounts
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {SUPPORT_PAYMENT_CONFIG.quickAmounts.map((amount) => {
                      const selected = Number(supportForm.amountInr) === amount;

                      return (
                        <button
                          key={amount}
                          type="button"
                          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                            selected
                              ? "border-cyan-300/70 bg-cyan-300/20 text-cyan-100"
                              : "border-cyan-300/25 bg-slate-900/70 text-slate-300 hover:border-cyan-300/45"
                          }`}
                          onClick={() =>
                            updateSupportForm("amountInr", String(amount))
                          }
                        >
                          INR {amount}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="mt-4 block text-xs text-slate-300">
                  Message (optional)
                  <textarea
                    value={supportForm.notes}
                    onChange={(event) =>
                      updateSupportForm("notes", event.target.value)
                    }
                    maxLength={500}
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-cyan-300/25 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300"
                    placeholder="Write a short support note"
                  />
                </label>

                <p className="mt-3 text-xs text-slate-400">
                  By continuing, you agree to transparent payment terms and the
                  7-day refund policy.
                </p>

                <div className="mt-4">
                  <Button
                    type="button"
                    className="w-full"
                    disabled={processing}
                    onClick={handleSupportPayment}
                  >
                    <CreditCard size={16} />
                    {processing ? "Opening Checkout..." : "Pay Now"}
                  </Button>
                </div>
              </>
            )}
          </article>

          <aside className="card-surface rounded-3xl p-6 xl:sticky xl:top-28">
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">
              Support Context
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-cyan-100">
              Why this Support Jar?
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              This helps me keep sharing useful projects, guides, and learning
              content consistently.
            </p>

            <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-cyan-200">
                Trust and Security
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                <li>Secure checkout via Cashfree</li>
                <li>UPI, cards, netbanking, wallets, pay later</li>
                <li>No card number or UPI PIN stored on this site</li>
              </ul>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                to="/projects"
                variant="secondary"
                className="flex-1 min-w-[170px]"
              >
                Explore Projects
              </Button>
              <Button
                to="/contact"
                variant="ghost"
                className="flex-1 min-w-[170px]"
              >
                Contact Me
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

export default SupportPage;
