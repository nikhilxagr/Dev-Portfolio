import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Rocket,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BadgeCheck,
  Globe,
  FileCheck2,
  Code2,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import Button from "@/components/ui/Button";
import SeoHead from "@/components/seo/SeoHead";
import PaymentTrustPanel from "@/components/ui/PaymentTrustPanel";
import FadeInUp from "@/components/animations/FadeInUp";
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

const supportPillPresets = [
  { amount: 49, label: "Buy a Coffee", desc: "Small boost" },
  { amount: 99, label: "Supporter", desc: "Popular option" },
  { amount: 149, label: "Developer Pack", desc: "Help tools & hosting" },
  { amount: 199, label: "Patron", desc: "Fund open source" },
  { amount: 499, label: "Sponsor", desc: "Major contributor" },
  { amount: 999, label: "Gold Supporter", desc: "Key project patron" },
];

const supportHighlights = [
  {
    title: "100% Free Open-Source Work",
    summary:
      "All developer tools, security practical writeups, and algorithm visualizers remain completely free for everyone.",
    icon: Code2,
  },
  {
    title: "Server & Hosting Fuel",
    summary:
      "Directly funds backend servers, database clusters, domain renewals, and API bandwidth for live portfolio labs.",
    icon: Rocket,
  },
  {
    title: "Instant Digital Receipts",
    summary:
      "Every contribution generates an official digital PDF receipt saved directly to your account receipt portal.",
    icon: FileCheck2,
  },
];

const SUPPORT_FAQS = [
  {
    q: "Why contribute to this work?",
    a: "Your contribution helps maintain free developer tools, fund cloud server infrastructure for live labs, and build open-source web engineering and security guides.",
  },
  {
    q: "How is my payment processed?",
    a: "Payments are processed securely via Cashfree using 256-bit SSL encryption. We support UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, and Wallets. No PIN or card numbers are stored on this site.",
  },
  {
    q: "Will I receive an official payment receipt?",
    a: "Yes. As soon as your contribution completes, an automated digital receipt is generated and linked to your account. You can view or download it anytime from the Receipt Portal (/receipts).",
  },
  {
    q: "Can I contribute a custom amount?",
    a: "Yes. You can select one of the quick preset amounts or enter any custom whole INR value between ₹1 and ₹50,000 in the contribution form.",
  },
];

const SupportPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUserAuth();
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentInfo, setPaymentInfo] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
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
      return "Enter a valid 10-digit phone number for Cashfree checkout.";
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
      const returnUrl =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "/support";
      if (typeof window !== "undefined") {
        sessionStorage.setItem("auth_return_url", returnUrl);
      }
      window.location.href = getGoogleAuthUrl(returnUrl);
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

      setPaymentInfo("Preparing secure checkout session...");

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

      setPaymentInfo("Redirecting to secure Cashfree payment portal...");

      const result = await cashfree.checkout({
        paymentSessionId: checkout.paymentSessionId,
        redirectTarget: "_self",
      });

      if (result?.error) {
        throw new Error(
          result.error?.message ||
            "Cashfree checkout could not be opened. Please retry."
        );
      }

      if (!result?.redirect) {
        navigate(
          `/payment/success?order_id=${encodeURIComponent(checkout.orderId)}`
        );
      }
    } catch (error) {
      setPaymentError(
        getErrorMessage(error, "Could not initialize payment gateway.")
      );
      setProcessing(false);
    }
  };

  return (
    <>
      <SeoHead
        title="Support My Work | Nikhil Agrahari"
        description="Support Nikhil Agrahari's open-source projects, developer tools, and security labs with a custom contribution via secure Cashfree checkout."
        pathname="/support"
        keywords={[
          "support nikhil agrahari",
          "support open source work",
          "cashfree contribution",
          "developer tip jar",
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Support", path: "/support" },
        ])}
      />

      <section className="section-wrap pt-6 sm:pt-8 pb-24">
        <FadeInUp>
          <div className="mx-auto mb-12 max-w-4xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
              <HeartHandshake size={14} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
              Community Support &amp; Open-Source Work
            </span>

            <h1 className="font-display text-3xl font-semibold tracking-tight leading-[1.08] text-ink-950 dark:text-ink-50 sm:text-4xl lg:text-5xl">
              Support This <span className="text-emerald-600 dark:text-emerald-400">Engineering Work</span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-base">
              If the tools, security writeups, or open-source projects have been useful, consider contributing to support server hosting, research, and ongoing releases.
            </p>
          </div>
        </FadeInUp>

        <div className="mb-12 grid gap-5 sm:grid-cols-3">
          {supportHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-2xl border border-black/[0.08] bg-white p-6 transition-colors duration-200 hover:border-emerald-600/30 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-emerald-500/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/25 dark:text-emerald-400">
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <h2 className="mt-4 text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                  {item.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                  {item.summary}
                </p>
              </article>
            );
          })}
        </div>

        {paymentError ? (
          <p className="mb-6 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-700 dark:text-rose-300">
            <AlertCircle size={16} strokeWidth={1.5} className="shrink-0" />
            {paymentError}
          </p>
        ) : null}
        {paymentInfo ? (
          <p className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-600/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300">
            <RefreshCw size={15} strokeWidth={1.5} className="shrink-0" />
            {paymentInfo}
          </p>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-start">
          <article className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Digital contribution
                </span>
                <h3 className="mt-1 text-2xl font-semibold text-ink-950 dark:text-ink-50">
                  Contribution &amp; Support Jar
                </h3>
              </div>
              <span className="rounded-full border border-emerald-600/25 bg-emerald-500/10 px-3 py-0.5 font-mono text-xs font-medium tabular-nums text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
                INR 1 - 50,000
              </span>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              Select a preset amount or enter your custom value. Every contribution generates an official digital PDF receipt.
            </p>

            {!isLoggedIn ? (
              <div className="mt-6 rounded-xl border border-black/[0.08] bg-[#f8fafc] p-6 text-center dark:border-white/[0.08] dark:bg-[#0c0e14]">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.08] bg-white dark:border-white/[0.08] dark:bg-[#11141c]">
                  <GoogleIcon />
                </div>
                <h4 className="mt-3 text-base font-semibold text-ink-950 dark:text-ink-50">
                  Sign in required to support
                </h4>
                <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-ink-600 dark:text-ink-400">
                  Sign in with Google first to unlock the contribution form and link your official digital receipt.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem(
                        "auth_return_url",
                        window.location.pathname + window.location.search
                      );
                    }
                    window.location.href = getGoogleAuthUrl();
                  }}
                  className="mt-5 inline-flex items-center justify-center gap-2.5 rounded-lg border border-black/[0.08] bg-ink-950 px-5 py-2.5 text-xs font-medium text-white transition-colors hover:bg-ink-900 dark:border-white/[0.1] dark:bg-white dark:text-ink-950 dark:hover:bg-ink-100"
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                <div>
                  <p className="mb-2 text-xs font-medium text-ink-700 dark:text-ink-300">
                    Select preset amount
                  </p>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {supportPillPresets.map((preset) => {
                      const selected = Number(supportForm.amountInr) === preset.amount;

                      return (
                        <button
                          key={preset.amount}
                          type="button"
                          onClick={() =>
                            updateSupportForm("amountInr", String(preset.amount))
                          }
                          className={`rounded-xl border p-3 text-left transition-colors duration-150 ${
                            selected
                              ? "border-emerald-600/50 bg-emerald-500/10 text-ink-950 dark:border-emerald-500/50 dark:bg-emerald-500/15 dark:text-ink-50"
                              : "border-black/[0.08] bg-[#f8fafc] text-ink-700 hover:border-emerald-600/30 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-ink-300 dark:hover:border-emerald-500/30"
                          }`}
                        >
                          <p className="font-mono text-base font-semibold tabular-nums text-ink-950 dark:text-ink-50">
                            ₹{preset.amount}
                          </p>
                          <p className="mt-0.5 truncate text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            {preset.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-xs font-medium text-ink-800 dark:text-ink-200">
                    Full Name
                    <input
                      type="text"
                      value={supportForm.customerName}
                      onChange={(event) =>
                        updateSupportForm("customerName", event.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-black/[0.1] bg-[#f8fafc] px-3.5 py-2.5 text-sm text-ink-950 outline-none focus:border-emerald-600 dark:border-white/[0.1] dark:bg-[#0c0e14] dark:text-ink-50 dark:focus:border-emerald-500"
                      placeholder="Your full name"
                    />
                  </label>

                  <label className="text-xs font-medium text-ink-800 dark:text-ink-200">
                    Email <span className="ml-1 text-[11px] text-emerald-600 dark:text-emerald-400">(Verified)</span>
                    <input
                      type="email"
                      readOnly
                      value={supportForm.customerEmail}
                      className="mt-1 w-full cursor-not-allowed rounded-xl border border-black/[0.08] bg-black/[0.03] px-3.5 py-2.5 text-sm text-ink-500 outline-none dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-ink-400"
                      placeholder="you@example.com"
                    />
                  </label>

                  <label className="text-xs font-medium text-ink-800 dark:text-ink-200">
                    Phone Number (Cashfree &amp; Receipt)
                    <input
                      type="text"
                      value={supportForm.customerPhone}
                      onChange={(event) =>
                        updateSupportForm("customerPhone", event.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-black/[0.1] bg-[#f8fafc] px-3.5 py-2.5 text-sm tabular-nums text-ink-950 outline-none focus:border-emerald-600 dark:border-white/[0.1] dark:bg-[#0c0e14] dark:text-ink-50 dark:focus:border-emerald-500"
                      placeholder="9876543210"
                    />
                  </label>

                  <label className="text-xs font-medium text-ink-800 dark:text-ink-200">
                    Custom Support Amount (INR ₹)
                    <input
                      type="text"
                      inputMode="numeric"
                      value={supportForm.amountInr}
                      onChange={(event) =>
                        updateSupportForm(
                          "amountInr",
                          event.target.value.replace(/\D/g, "")
                        )
                      }
                      className="mt-1 w-full rounded-xl border border-black/[0.1] bg-[#f8fafc] px-3.5 py-2.5 text-sm font-medium tabular-nums text-ink-950 outline-none focus:border-emerald-600 dark:border-white/[0.1] dark:bg-[#0c0e14] dark:text-ink-50 dark:focus:border-emerald-500"
                      placeholder="Enter custom amount"
                    />
                  </label>
                </div>

                <label className="block text-xs font-medium text-ink-800 dark:text-ink-200">
                  Optional Support Message
                  <textarea
                    value={supportForm.notes}
                    onChange={(event) =>
                      updateSupportForm("notes", event.target.value)
                    }
                    maxLength={500}
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-black/[0.1] bg-[#f8fafc] px-3.5 py-2.5 text-sm text-ink-950 outline-none focus:border-emerald-600 dark:border-white/[0.1] dark:bg-[#0c0e14] dark:text-ink-50 dark:focus:border-emerald-500"
                    placeholder="Write a note to Nikhil (optional)..."
                  />
                </label>

                <div className="flex items-center justify-between pt-1 text-xs text-ink-500 dark:text-ink-400">
                  <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck size={14} strokeWidth={1.5} /> 256-bit SSL Encrypted
                  </span>
                  <span>7-day refund terms apply</span>
                </div>

                <button
                  type="button"
                  disabled={processing}
                  onClick={handleSupportPayment}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/[0.08] bg-ink-950 py-3.5 text-sm font-medium text-white transition-colors hover:bg-ink-900 disabled:opacity-60 dark:border-white/[0.1] dark:bg-emerald-500 dark:text-ink-950 dark:hover:bg-emerald-400"
                >
                  <CreditCard size={16} strokeWidth={1.5} />
                  {processing
                    ? "Opening Cashfree Gateway..."
                    : `Proceed to Secure Contribution (₹${supportForm.amountInr || 99})`}
                </button>
              </div>
            )}
          </article>

          <div className="space-y-6">
            <aside className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <BadgeCheck size={14} strokeWidth={1.5} /> Transparent impact
              </span>
              <h3 className="mt-1 text-xl font-semibold text-ink-950 dark:text-ink-50">
                Where Does Support Go?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                Contributions keep the labs, tools, and writeups free and accessible:
              </p>

              <ul className="mt-4 space-y-3 text-sm text-ink-700 dark:text-ink-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span><strong className="font-semibold">Server &amp; Cloud Hosting:</strong> Covers Render, Vercel, and MongoDB Atlas runtime costs.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span><strong className="font-semibold">Open-Source Developer Tools:</strong> Supports improvements to Cyber Tools and the DSA Visualizer.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span><strong className="font-semibold">Free Educational Guides:</strong> Supports security writeups and full-stack engineering articles.</span>
                </li>
              </ul>
            </aside>

            <PaymentTrustPanel />
          </div>
        </div>

        <div className="mx-auto mt-20 max-w-4xl">
          <div className="mb-10 text-center">
            <span className="font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Support FAQs
            </span>
            <h2 className="mt-1 text-2xl font-semibold text-ink-950 dark:text-ink-50 sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-1.5 text-sm text-ink-600 dark:text-ink-400">
              Common questions about contributions, receipts, and security.
            </p>
          </div>

          <div className="space-y-3">
            {SUPPORT_FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.q}
                  className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white transition-colors dark:border-white/[0.08] dark:bg-[#11141c]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 p-4 text-left text-sm font-semibold text-ink-950 transition-colors hover:text-emerald-600 dark:text-ink-50 dark:hover:text-emerald-400 sm:text-base"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle size={17} strokeWidth={1.5} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp size={17} strokeWidth={1.5} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <ChevronDown size={17} strokeWidth={1.5} className="shrink-0 text-ink-400" />
                    )}
                  </button>

                  {isOpen ? (
                    <div className="border-t border-black/[0.06] px-4 pt-3 pb-4 text-sm leading-relaxed text-ink-600 dark:border-white/[0.06] dark:text-ink-300">
                      {faq.a}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-black/[0.08] bg-white p-8 text-center dark:border-white/[0.08] dark:bg-[#11141c] sm:p-10">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
            <Globe size={13} strokeWidth={1.5} /> Looking for dedicated services?
          </span>

          <h2 className="text-2xl font-semibold tracking-tight text-ink-950 dark:text-ink-50 sm:text-3xl">
            Explore Engineering Services &amp; Projects
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-600 dark:text-ink-300">
            Need help with a full-stack web application, backend API architecture, or code review? Explore structured service plans or open-source builds.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button to="/services" variant="primary">
              <span>View Service Plans</span>
              <ArrowRight size={15} strokeWidth={1.5} />
            </Button>
            <Button to="/projects" variant="ghost">
              <Code2 size={15} strokeWidth={1.5} />
              <span>Explore Open Projects</span>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default SupportPage;
