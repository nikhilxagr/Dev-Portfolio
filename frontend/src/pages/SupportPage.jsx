import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Coffee,
  Rocket,
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BadgeCheck,
  Globe,
  FileCheck2,
  Code2,
  Award,
  ArrowRight,
  Gift,
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
  { amount: 49, label: "Buy a Coffee ☕", desc: "Small boost" },
  { amount: 99, label: "Supporter 🚀", desc: "Popular option" },
  { amount: 149, label: "Developer Pack 💻", desc: "Help tools & hosting" },
  { amount: 199, label: "Patron 🌟", desc: "Fund open source" },
  { amount: 499, label: "Sponsor 🏆", desc: "Major contributor" },
  { amount: 999, label: "Gold Supporter 🥇", desc: "Key project patron" },
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
      "Every contribution generates an official digital PDF receipt instantly saved to your account portal.",
    icon: FileCheck2,
  },
];

const SUPPORT_FAQS = [
  {
    q: "Why contribute to this work?",
    a: "Your contribution helps maintain free developer tools, fund cloud server infrastructure for live labs, and create open-source web development and cybersecurity resources for students and engineers.",
  },
  {
    q: "How is my payment processed?",
    a: "Payments are processed securely via Cashfree using 256-bit SSL encryption. We support UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, and Wallets. No PIN or card numbers are stored on this site.",
  },
  {
    q: "Will I receive an official payment receipt?",
    a: "Yes! As soon as your contribution completes, an automated digital receipt is generated and linked to your account. You can view or download it anytime from the Receipt Portal (/receipts).",
  },
  {
    q: "Can I contribute a custom amount?",
    a: "Absolutely. You can select one of the quick preset amounts or enter any custom whole INR value between ₹1 and ₹50,000 in the contribution form.",
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
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "auth_return_url",
          window.location.pathname + window.location.search
        );
      }
      window.location.href = getGoogleAuthUrl();
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

      <section className="section-wrap pt-4 sm:pt-6 pb-24">
        
        {/* Hero Header Section */}
        <FadeInUp>
          <div className="text-center max-w-4xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-lime-400/40 bg-lime-400/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-lime-600 dark:text-lime-300 shadow-sm mb-4">
              <HeartHandshake size={14} className="text-lime-400" />
              COMMUNITY SUPPORT &amp; OPEN-SOURCE FUEL
            </span>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-[1.05]">
              SUPPORT THIS <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">ENGINEERING WORK</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              If the tools, security writeups, or open-source projects have been useful, consider contributing to support server hosting, research, and continuous builds.
            </p>
          </div>
        </FadeInUp>

        {/* Top 3 Impact Highlights */}
        <div className="grid gap-5 sm:grid-cols-3 mb-12">
          {supportHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="group rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-md backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 dark:border-emerald-500/20 dark:bg-[#030d07]/90 dark:hover:border-emerald-400/50"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <Icon size={22} />
                </div>
                <h2 className="mt-4 text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  {item.title}
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {item.summary}
                </p>
              </article>
            );
          })}
        </div>

        {/* Notifications */}
        {paymentError ? (
          <p className="mb-6 rounded-2xl border border-rose-300/40 bg-rose-500/10 px-5 py-3.5 text-xs sm:text-sm font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <Zap size={16} className="shrink-0" />
            {paymentError}
          </p>
        ) : null}
        {paymentInfo ? (
          <p className="mb-6 rounded-2xl border border-emerald-300/40 bg-emerald-500/10 px-5 py-3.5 text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <Sparkles size={16} className="shrink-0 animate-spin-slow" />
            {paymentInfo}
          </p>
        ) : null}

        {/* Two-Column Form & Trust Layout */}
        <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-start">
          
          {/* Left Column: Contribution Form */}
          <article className="rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/95 dark:shadow-[0_16px_50px_rgba(0,10,2,0.75)] relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400" />

            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Gift size={13} /> DIGITAL CONTRIBUTION FORM
                </span>
                <h3 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Contribution &amp; Support Jar
                </h3>
              </div>
              <span className="rounded-full border border-lime-500/30 bg-lime-500/10 px-3 py-1 text-[11px] font-extrabold text-lime-700 dark:text-lime-300">
                INR 1 - 50,000
              </span>
            </div>

            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Select a quick contribution preset or enter your custom amount. Every contribution generates an official digital PDF receipt.
            </p>

            {!isLoggedIn ? (
              <div className="mt-6 rounded-2xl border border-emerald-500/40 bg-slate-50 dark:bg-slate-900/90 p-6 text-center shadow-md">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                  <GoogleIcon />
                </div>
                <h4 className="mt-3 text-base font-extrabold text-slate-900 dark:text-white">
                  Sign In Required to Support
                </h4>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                  Please sign in with Google first to unlock the contribution form and receive your official digital receipt.
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
                  className="mt-5 inline-flex items-center justify-center gap-2.5 rounded-xl bg-slate-900 dark:bg-white px-6 py-3 text-xs font-black text-white dark:text-slate-900 shadow-md hover:scale-[1.02] transition"
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                
                {/* Preset Amount Pills */}
                <div>
                  <p className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">
                    Select Preset Amount:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {supportPillPresets.map((preset) => {
                      const selected = Number(supportForm.amountInr) === preset.amount;

                      return (
                        <button
                          key={preset.amount}
                          type="button"
                          onClick={() =>
                            updateSupportForm("amountInr", String(preset.amount))
                          }
                          className={`rounded-2xl border p-3 text-left transition-all duration-200 ${
                            selected
                              ? "border-lime-400 bg-lime-400/15 dark:bg-lime-400/10 text-slate-950 dark:text-white shadow-[0_0_15px_rgba(163,230,53,0.3)] ring-2 ring-lime-400/40"
                              : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-slate-700"
                          }`}
                        >
                          <p className="font-outfit text-base font-black text-slate-900 dark:text-white">
                            ₹{preset.amount}
                          </p>
                          <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 truncate mt-0.5">
                            {preset.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Form Inputs Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    Full Name
                    <input
                      type="text"
                      value={supportForm.customerName}
                      onChange={(event) =>
                        updateSupportForm("customerName", event.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-lime-500 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white"
                      placeholder="Your full name"
                    />
                  </label>

                  <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    Email <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold ml-1">(Signed-in Email 🔒)</span>
                    <input
                      type="email"
                      readOnly
                      value={supportForm.customerEmail}
                      className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 px-3.5 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-not-allowed font-semibold outline-none"
                      placeholder="you@example.com"
                    />
                  </label>

                  <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    Phone Number (for Cashfree &amp; WhatsApp Receipt)
                    <input
                      type="text"
                      value={supportForm.customerPhone}
                      onChange={(event) =>
                        updateSupportForm("customerPhone", event.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-lime-500 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white"
                      placeholder="9876543210"
                    />
                  </label>

                  <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
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
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-black text-slate-900 outline-none focus:border-lime-500 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white"
                      placeholder="Enter custom amount"
                    />
                  </label>
                </div>

                {/* Optional Message Field */}
                <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  Optional Support Message / Note:
                  <textarea
                    value={supportForm.notes}
                    onChange={(event) =>
                      updateSupportForm("notes", event.target.value)
                    }
                    maxLength={500}
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-lime-500 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white"
                    placeholder="Write a message to Nikhil (optional)..."
                  />
                </label>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-1">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <ShieldCheck size={14} /> 256-bit SSL Encrypted
                  </span>
                  <span>7-Day Refund Terms Apply</span>
                </div>

                {/* Pay Button */}
                <button
                  type="button"
                  disabled={processing}
                  onClick={handleSupportPayment}
                  className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-400 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_4px_25px_rgba(163,230,53,0.45)] hover:shadow-[0_6px_32px_rgba(163,230,53,0.65)] hover:scale-[1.01] transition-all"
                >
                  <CreditCard size={18} />
                  {processing
                    ? "Opening Cashfree Gateway..."
                    : `Proceed to Secure Contribution (₹${supportForm.amountInr || 99})`}
                </button>
              </div>
            )}
          </article>

          {/* Right Column: Support Context & Trust Sidebar */}
          <div className="space-y-6">
            
            {/* Why Support Jar */}
            <aside className="rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-7 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/95 dark:shadow-[0_16px_50px_rgba(0,10,2,0.75)]">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <BadgeCheck size={13} /> TRANSPARENT IMPACT
              </span>
              <h3 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                Where Does Support Go?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Your contributions directly keep the technical ecosystem running and free for everyone:
              </p>

              <ul className="mt-4 space-y-3 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="mt-0.5 text-emerald-500 shrink-0" />
                  <span><strong>Server &amp; Cloud Hosting:</strong> Pays for Render, Vercel, and MongoDB database clusters running live apps.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="mt-0.5 text-emerald-500 shrink-0" />
                  <span><strong>Open-Source Developer Tools:</strong> Funds continuous updates to the Cyber Tools &amp; DSA Visualizer labs.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="mt-0.5 text-emerald-500 shrink-0" />
                  <span><strong>Free Educational Guides:</strong> Supports writing cybersecurity writeups and full-stack engineering blogs.</span>
                </li>
              </ul>
            </aside>

            {/* Payment Gateway Trust Panel */}
            <PaymentTrustPanel />
          </div>
        </div>

        {/* Support FAQ Accordion */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              // SUPPORT FAQS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
              Common questions about contributions, receipts, and security.
            </p>
          </div>

          <div className="space-y-3">
            {SUPPORT_FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-slate-200 bg-white/90 dark:border-emerald-500/20 dark:bg-[#030d07]/90 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-4 p-4 text-left font-extrabold text-sm sm:text-base text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle size={18} className="text-emerald-500 shrink-0" />
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp size={18} className="text-emerald-500 shrink-0" />
                    ) : (
                      <ChevronDown size={18} className="text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen ? (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-emerald-500/10">
                      {faq.a}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/60 via-slate-950 to-teal-950/60 p-8 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-emerald-500/10 blur-3xl" />
          
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3.5 py-1 text-xs font-extrabold text-emerald-300 mb-3">
            <Globe size={13} /> LOOKING FOR DEDICATED SERVICES?
          </span>

          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
            Explore Dedicated Engineering Services &amp; Projects
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium max-w-xl mx-auto leading-relaxed">
            Looking to hire for a custom web build, API architecture, or 1:1 code mentorship? Explore structured service plans or view live projects.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button to="/services" className="min-w-[190px]">
              <Sparkles size={16} /> View Service Plans
            </Button>
            <Button to="/projects" variant="secondary" className="min-w-[180px]">
              <Code2 size={16} /> Explore Open Projects
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default SupportPage;
