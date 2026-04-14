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
import { SUPPORT_PAYMENT_CONFIG } from "@/constants/siteData";

const SupportPage = () => {
  const navigate = useNavigate();
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
          eyebrow="Support Me"
          title="Support My Work"
          className="mx-auto max-w-3xl text-center"
        />
        <p className="mx-auto mt-3 max-w-3xl text-center text-slate-300">
          If my work helps you, you can contribute any amount and pay through
          secure Cashfree checkout.
        </p>

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

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-slate-300">
                Full Name
                <input
                  type="text"
                  value={supportForm.customerName}
                  onChange={(event) =>
                    updateSupportForm("customerName", event.target.value)
                  }
                  className="mt-1 w-full rounded-xl border border-cyan-300/25 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300"
                  placeholder="Your full name"
                />
              </label>

              <label className="text-xs text-slate-300">
                Email
                <input
                  type="email"
                  value={supportForm.customerEmail}
                  onChange={(event) =>
                    updateSupportForm("customerEmail", event.target.value)
                  }
                  className="mt-1 w-full rounded-xl border border-cyan-300/25 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300"
                  placeholder="you@example.com"
                />
              </label>

              <label className="text-xs text-slate-300">
                Phone
                <input
                  type="text"
                  value={supportForm.customerPhone}
                  onChange={(event) =>
                    updateSupportForm("customerPhone", event.target.value)
                  }
                  className="mt-1 w-full rounded-xl border border-cyan-300/25 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300"
                  placeholder="9876543210"
                />
              </label>

              <label className="text-xs text-slate-300">
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
                  className="mt-1 w-full rounded-xl border border-cyan-300/25 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300"
                  placeholder="99"
                />
              </label>
            </div>

            <div className="mt-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
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
