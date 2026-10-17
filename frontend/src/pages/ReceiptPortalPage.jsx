import { useState, useEffect } from "react";
import {
  KeyRound,
  MailCheck,
  Download,
  History,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Copy,
  Check,
  RefreshCw,
  Printer,
  Sparkles,
  ArrowRight,
  Lock,
  UserCheck,
  AlertCircle,
  ExternalLink,
  Send,
  FileCheck2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import SeoHead from "@/components/seo/SeoHead";
import { useUserAuth } from "@/context/UserAuthContext";
import { getErrorMessage } from "@/services/api";
import {
  getReceiptHistory,
  requestReceiptAccessCode,
  sendReceiptToEmail,
  toAbsoluteApiUrl,
  verifyReceiptAccessCode,
} from "@/services/payment.service";

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const formatCurrency = (amountInr) => {
  if (typeof amountInr !== "number") {
    const parsed = Number(amountInr);
    if (Number.isNaN(parsed)) return `₹${amountInr || "0"}`;
    amountInr = parsed;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amountInr);
};

const ReceiptPortalPage = () => {
  const { user, isAuthenticated } = useUserAuth();

  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [portalToken, setPortalToken] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: Code, 3: Verified Receipts
  const [resendCooldown, setResendCooldown] = useState(0);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [emailingReceipt, setEmailingReceipt] = useState("");
  const [emailSuccessMsg, setEmailSuccessMsg] = useState("");
  const [copiedReceiptId, setCopiedReceiptId] = useState("");

  // Auto-fill logged-in user email if available
  useEffect(() => {
    if (isAuthenticated && user?.email && !email) {
      setEmail(user.email);
    }
  }, [isAuthenticated, user?.email]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleRequestCode = async (event) => {
    if (event) event.preventDefault();
    setError("");
    setMessage("");

    const targetEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
      setError("Please enter a valid billing/payment email address.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await requestReceiptAccessCode(targetEmail);
      const backendMessage =
        response?.message ||
        "A 6-digit access code has been dispatched to your email.";
      setMessage(backendMessage);
      setCurrentStep(2);
      setResendCooldown(60);
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          "Could not send receipt access code. Please try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyCode = async (event) => {
    if (event) event.preventDefault();
    setError("");
    setMessage("");

    const codeToVerify = accessCode.trim();

    if (!/^\d{6}$/.test(codeToVerify)) {
      setError("Please enter the complete 6-digit access code sent to your email.");
      return;
    }

    setSubmitting(true);

    try {
      const verifyResponse = await verifyReceiptAccessCode({
        email: email.trim(),
        code: codeToVerify,
      });

      const token = verifyResponse?.data?.portalToken || "";
      setPortalToken(token);

      const historyResponse = await getReceiptHistory(token);
      const loadedReceipts = historyResponse?.data?.receipts || [];
      setReceipts(loadedReceipts);

      setCurrentStep(3);
      setMessage(
        loadedReceipts.length > 0
          ? `Verified! Found ${loadedReceipts.length} verified payment receipt${loadedReceipts.length > 1 ? "s" : ""}.`
          : "Verified! No paid receipts were found for this email address.",
      );
    } catch (verifyError) {
      setError(
        getErrorMessage(
          verifyError,
          "Invalid or expired access code. Please check your email and try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const refreshHistory = async () => {
    if (!portalToken) return;

    setRefreshing(true);
    setError("");

    try {
      const historyResponse = await getReceiptHistory(portalToken);
      const loadedReceipts = historyResponse?.data?.receipts || [];
      setReceipts(loadedReceipts);
      setMessage("Receipt history successfully refreshed.");
    } catch (historyError) {
      setError(
        getErrorMessage(historyError, "Could not refresh receipt history."),
      );
    } finally {
      setRefreshing(false);
    }
  };

  const handleEmailReceipt = async (receiptNumber) => {
    if (!portalToken || !receiptNumber) return;
    setEmailingReceipt(receiptNumber);
    setEmailSuccessMsg("");

    try {
      const result = await sendReceiptToEmail(receiptNumber, portalToken);
      setEmailSuccessMsg(
        result?.message || `Receipt #${receiptNumber} has been sent to your email!`,
      );
      setTimeout(() => setEmailSuccessMsg(""), 6000);
    } catch (err) {
      setError(
        getErrorMessage(err, "Failed to email receipt. Please try downloading directly."),
      );
    } finally {
      setEmailingReceipt("");
    }
  };

  const handleCopyReceiptId = (receiptNumber) => {
    if (!receiptNumber) return;
    navigator.clipboard.writeText(receiptNumber);
    setCopiedReceiptId(receiptNumber);
    setTimeout(() => setCopiedReceiptId(""), 3000);
  };

  const handlePrint = (downloadUrl) => {
    const fullUrl = toAbsoluteApiUrl(downloadUrl);
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <SeoHead
        title="Verified Receipts Portal | Nikhil Agrahari"
        description="Official receipt and invoice verification portal for payments, services, and contributions."
        pathname="/receipts"
        robots="noindex, nofollow"
      />

      <div className="min-h-screen bg-slate-950/60 pb-24 text-slate-100">
        <section className="section-wrap pt-12 sm:pt-20">
          <SectionTitle
            eyebrow="VERIFIED DIGITAL RECEIPTS & INVOICES"
            title="Receipt Access & Verification Portal"
            description="Verify your email with a secure 6-digit access code to retrieve, inspect, and download official signed tax receipts."
          />

          {/* Trust Pillars */}
          <div className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/30 px-3 py-1 font-medium text-cyan-300">
              <ShieldCheck size={14} className="text-cyan-400" /> 256-Bit SSL Encrypted
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/30 px-3 py-1 font-medium text-emerald-300">
              <Sparkles size={14} className="text-emerald-400" /> Real-Time OTP Verification
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-950/30 px-3 py-1 font-medium text-sky-300">
              <FileCheck2 size={14} className="text-sky-400" /> Signed PDF Documents
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-950/30 px-3 py-1 font-medium text-violet-300">
              <Mail size={14} className="text-violet-400" /> Instant Email Dispatch
            </span>
          </div>

          {/* Connected User Account Helper */}
          {isAuthenticated && user?.email && (
            <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-3.5 backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <div className="inline-flex items-center gap-2 text-cyan-200">
                  <UserCheck size={18} className="text-cyan-400 shrink-0" />
                  <span>
                    Signed in as <strong className="text-white">{user.name || "User"}</strong> (
                    <span className="font-mono text-cyan-300">{user.email}</span>)
                  </span>
                </div>
                {email !== user.email && (
                  <button
                    type="button"
                    onClick={() => setEmail(user.email)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-200 transition-colors hover:bg-cyan-500/25"
                  >
                    Use My Account Email
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 3-Step Interactive Stepper */}
          <div className="mx-auto mt-8 max-w-3xl">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              {/* Step 1 */}
              <div
                className={`relative flex flex-col items-center rounded-2xl border p-3 transition-all ${
                  currentStep === 1
                    ? "border-cyan-400/60 bg-cyan-950/40 shadow-lg shadow-cyan-500/10"
                    : currentStep > 1
                    ? "border-emerald-500/40 bg-emerald-950/20"
                    : "border-slate-800 bg-slate-900/40 opacity-60"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    currentStep > 1
                      ? "bg-emerald-500 text-slate-950 font-black"
                      : currentStep === 1
                      ? "bg-cyan-400 text-slate-950 font-black"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {currentStep > 1 ? <Check size={15} strokeWidth={3} /> : "1"}
                </div>
                <span className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-200">
                  Request Code
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">Enter email</span>
              </div>

              {/* Step 2 */}
              <div
                className={`relative flex flex-col items-center rounded-2xl border p-3 transition-all ${
                  currentStep === 2
                    ? "border-cyan-400/60 bg-cyan-950/40 shadow-lg shadow-cyan-500/10"
                    : currentStep > 2
                    ? "border-emerald-500/40 bg-emerald-950/20"
                    : "border-slate-800 bg-slate-900/40 opacity-60"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    currentStep > 2
                      ? "bg-emerald-500 text-slate-950 font-black"
                      : currentStep === 2
                      ? "bg-cyan-400 text-slate-950 font-black"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {currentStep > 2 ? <Check size={15} strokeWidth={3} /> : "2"}
                </div>
                <span className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-200">
                  Verify 6-Digit OTP
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">Enter code</span>
              </div>

              {/* Step 3 */}
              <div
                className={`relative flex flex-col items-center rounded-2xl border p-3 transition-all ${
                  currentStep === 3
                    ? "border-emerald-400/60 bg-emerald-950/40 shadow-lg shadow-emerald-500/10"
                    : "border-slate-800 bg-slate-900/40 opacity-60"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    currentStep === 3
                      ? "bg-emerald-400 text-slate-950 font-black"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  <ShieldCheck size={16} />
                </div>
                <span className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-200">
                  Verified Receipts
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  {receipts.length} loaded
                </span>
              </div>
            </div>
          </div>

          {/* Feedback Alerts */}
          <div className="mx-auto mt-6 max-w-3xl">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-4 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-950/30 p-4 text-sm text-rose-300 backdrop-blur-md"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0 text-rose-400" />
                  <div className="flex-1">
                    <p className="font-semibold text-rose-200">Verification Notice</p>
                    <p className="mt-0.5">{error}</p>
                  </div>
                </motion.div>
              )}

              {message && !error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-4 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4 text-sm text-emerald-300 backdrop-blur-md"
                >
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />
                  <div className="flex-1">
                    <p className="font-semibold text-emerald-200">Status Update</p>
                    <p className="mt-0.5">{message}</p>
                  </div>
                </motion.div>
              )}

              {emailSuccessMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-4 flex items-start gap-3 rounded-2xl border border-cyan-500/30 bg-cyan-950/30 p-4 text-sm text-cyan-300 backdrop-blur-md"
                >
                  <MailCheck size={18} className="mt-0.5 shrink-0 text-cyan-400" />
                  <div className="flex-1">
                    <p className="font-semibold text-cyan-200">Email Dispatched</p>
                    <p className="mt-0.5">{emailSuccessMsg}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Main 2-Column Portal Interface */}
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.1fr_1.35fr]">
            {/* Left Column: Verification Controls */}
            <article className="card-surface relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-7 backdrop-blur-xl">
              {/* Background ambient glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

              <div>
                {/* Step 1 Header & Form */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300 font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Payment Email</h2>
                      <p className="text-xs text-slate-400">Where you made payments or received receipts</p>
                    </div>
                  </div>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep(1);
                        setMessage("");
                        setError("");
                      }}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline"
                    >
                      Change
                    </button>
                  )}
                </div>

                <form onSubmit={handleRequestCode} className="mt-4 space-y-4">
                  <div>
                    <div className="relative">
                      <Mail
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="email"
                        required
                        placeholder="youremail@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        disabled={submitting || currentStep === 2}
                        className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-3 pl-10 pr-4 text-sm text-slate-100 shadow-inner outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-70 disabled:cursor-not-allowed font-medium"
                      />
                    </div>
                  </div>

                  {currentStep === 1 && (
                    <Button
                      type="submit"
                      disabled={submitting || !email.trim()}
                      className="w-full justify-center py-3 text-sm font-bold shadow-lg shadow-cyan-500/20"
                    >
                      {submitting ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          Sending Security Code...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send Access Code
                        </>
                      )}
                    </Button>
                  )}
                </form>

                {/* Step 2: 6-Digit Code Verification */}
                <div className={`mt-8 transition-opacity ${currentStep >= 2 ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300 font-bold text-sm">
                        2
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-white">6-Digit Security OTP</h2>
                        <p className="text-xs text-slate-400">Dispatched to {email || "your email"}</p>
                      </div>
                    </div>
                    {currentStep === 2 && (
                      <button
                        type="button"
                        onClick={handleRequestCode}
                        disabled={submitting || resendCooldown > 0}
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-50 disabled:no-underline underline"
                      >
                        {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend Code"}
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleVerifyCode} className="mt-4 space-y-4">
                    <div>
                      <div className="relative">
                        <KeyRound
                          size={17}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          autoComplete="one-time-code"
                          placeholder="••••••"
                          value={accessCode}
                          onChange={(event) =>
                            setAccessCode(event.target.value.replace(/\D/g, ""))
                          }
                          disabled={submitting || currentStep === 3}
                          className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-3 pl-10 pr-4 text-center text-lg font-mono font-bold tracking-[0.4em] text-cyan-200 shadow-inner outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-70 disabled:cursor-not-allowed placeholder:tracking-[0.2em] placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    {currentStep === 2 && (
                      <Button
                        type="submit"
                        disabled={submitting || accessCode.trim().length !== 6}
                        className="w-full justify-center py-3 text-sm font-bold shadow-lg shadow-cyan-500/20"
                      >
                        {submitting ? (
                          <>
                            <RefreshCw size={16} className="animate-spin" />
                            Verifying Code...
                          </>
                        ) : (
                          <>
                            <Lock size={16} />
                            Verify &amp; Load Invoices
                          </>
                        )}
                      </Button>
                    )}
                  </form>
                </div>
              </div>

              {/* Bottom Security Note */}
              <div className="mt-8 border-t border-slate-800/80 pt-4 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <Lock size={13} className="text-slate-400 shrink-0" />
                  <span>
                    Your receipt access session is secured with 256-bit SHA authentication tokens and auto-expires after 30 minutes of inactivity.
                  </span>
                </div>
              </div>
            </article>

            {/* Right Column: Receipts Vault & History */}
            <article className="card-surface relative flex flex-col overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-7 backdrop-blur-xl">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                    <History size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      Verified Receipt Vault
                      {receipts.length > 0 && (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                          {receipts.length} {receipts.length === 1 ? "Receipt" : "Receipts"}
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Official tax invoices and transaction records
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  className="px-3 py-1.5 text-xs font-semibold"
                  onClick={refreshHistory}
                  disabled={!portalToken || refreshing}
                >
                  <RefreshCw
                    size={14}
                    className={refreshing ? "animate-spin" : ""}
                  />
                  Refresh
                </Button>
              </div>

              {/* Body Content */}
              <div className="mt-6 flex-1 space-y-4">
                {currentStep < 3 && receipts.length === 0 ? (
                  <div className="flex h-full min-h-[340px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800/90 bg-slate-950/40 p-8 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-950/30 text-cyan-300 shadow-inner">
                      <ShieldCheck size={32} />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-slate-200">
                      Vault Locked for Privacy
                    </h3>
                    <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-slate-400">
                      Enter your payment email on the left and enter the 6-digit access code sent to your inbox to unlock your verified payment receipts and tax invoices.
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-cyan-400">
                      <span>Step 1: Request Code</span>
                      <ArrowRight size={14} />
                      <span>Step 2: Enter OTP</span>
                      <ArrowRight size={14} />
                      <span>Step 3: Download</span>
                    </div>
                  </div>
                ) : receipts.length === 0 ? (
                  <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-950/40 p-8 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-950/30 text-amber-300">
                      <AlertCircle size={28} />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-slate-200">
                      No Receipts Found for this Address
                    </h3>
                    <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-400">
                      We verified your email (<span className="font-mono text-cyan-300">{email}</span>), but there are no completed paid transactions registered under it.
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Tip: If you paid using a different email address on Cashfree, click{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep(1);
                          setMessage("");
                          setError("");
                        }}
                        className="text-cyan-400 underline font-semibold"
                      >
                        Change Email
                      </button>{" "}
                      to request access for that address.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {receipts.map((item) => (
                      <div
                        key={item.receiptNumber}
                        className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-5 shadow-xl transition-all hover:border-emerald-500/40"
                      >
                        {/* Digital Voucher Top Watermark Seal */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="rounded-full border border-emerald-500/30 bg-emerald-950/50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                              {item.status || "PAID"} &amp; VERIFIED
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-semibold text-slate-400">
                              {item.receiptNumber}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyReceiptId(item.receiptNumber)}
                              className="rounded-lg border border-slate-700/60 bg-slate-800/60 p-1 text-slate-400 transition hover:bg-slate-700 hover:text-white"
                              title="Copy Receipt Number"
                            >
                              {copiedReceiptId === item.receiptNumber ? (
                                <Check size={13} className="text-emerald-400" />
                              ) : (
                                <Copy size={13} />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Voucher Main Content */}
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              Service / Contribution
                            </span>
                            <p className="text-sm font-bold text-white mt-0.5">
                              {item.serviceName}
                            </p>
                            {item.customerName && (
                              <p className="text-xs text-slate-400 mt-0.5">
                                Client: {item.customerName}
                              </p>
                            )}
                          </div>

                          <div className="sm:text-right">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              Total Paid
                            </span>
                            <p className="text-lg font-black text-emerald-300 mt-0.5">
                              {formatCurrency(item.amountInr)}
                            </p>
                          </div>
                        </div>

                        {/* Metadata Row */}
                        <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-slate-950/60 p-2.5 text-[11px] text-slate-400 border border-slate-800/60">
                          <div>
                            <span className="text-slate-500 block">Date of Payment:</span>
                            <span className="text-slate-300 font-medium">{formatDate(item.paidAt)}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Transaction Reference:</span>
                            <span className="font-mono text-slate-300 truncate block">
                              {item.orderId || item.paymentId || "Direct Checkout"}
                            </span>
                          </div>
                        </div>

                        {/* Perforated Divider */}
                        <div className="relative my-4 flex items-center">
                          <div className="absolute -left-7 h-4 w-4 rounded-full bg-slate-950 border-r border-emerald-500/30" />
                          <div className="w-full border-t border-dashed border-slate-800" />
                          <div className="absolute -right-7 h-4 w-4 rounded-full bg-slate-950 border-l border-emerald-500/30" />
                        </div>

                        {/* Voucher Actions */}
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Direct PDF Download */}
                          <a
                            href={toAbsoluteApiUrl(item.downloadUrl)}
                            download={`${item.receiptNumber}.pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:brightness-110 active:scale-95"
                          >
                            <Download size={15} />
                            Download PDF Invoice
                          </a>

                          {/* Email Receipt To Me */}
                          <button
                            type="button"
                            onClick={() => handleEmailReceipt(item.receiptNumber)}
                            disabled={emailingReceipt === item.receiptNumber}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/30 px-3.5 py-2.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/20 disabled:opacity-50"
                            title="Send PDF to email"
                          >
                            {emailingReceipt === item.receiptNumber ? (
                              <RefreshCw size={14} className="animate-spin text-cyan-400" />
                            ) : (
                              <Mail size={14} className="text-cyan-400" />
                            )}
                            <span className="hidden sm:inline">
                              {emailingReceipt === item.receiptNumber ? "Sending..." : "Email to Me"}
                            </span>
                          </button>

                          {/* Print Invoice */}
                          <button
                            type="button"
                            onClick={() => handlePrint(item.downloadUrl)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-800/50 px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white"
                            title="Print / Open Invoice"
                          >
                            <Printer size={14} />
                            <span className="hidden sm:inline">Print</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </div>
        </section>
      </div>
    </>
  );
};

export default ReceiptPortalPage;
