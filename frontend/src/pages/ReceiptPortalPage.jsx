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
  ArrowRight,
  Lock,
  UserCheck,
  AlertCircle,
  FileCheck2,
  Send,
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

const MotionDiv = motion.div;

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
  let value = amountInr;
  if (typeof value !== "number") {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return `₹${amountInr || "0"}`;
    value = parsed;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(value);
};

const ReceiptPortalPage = () => {
  const { user, isAuthenticated } = useUserAuth();

  const [email, setEmail] = useState(() => (isAuthenticated && user?.email ? user.email : ""));
  const [accessCode, setAccessCode] = useState("");
  const [portalToken, setPortalToken] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [emailingReceipt, setEmailingReceipt] = useState("");
  const [emailSuccessMsg, setEmailSuccessMsg] = useState("");
  const [copiedReceiptId, setCopiedReceiptId] = useState("");

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setEmail((prev) => prev || user.email);
    }
  }, [isAuthenticated, user?.email]);

  useEffect(() => {
    if (resendCooldown <= 0) return undefined;
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
          ? `Verified. Found ${loadedReceipts.length} payment receipt${loadedReceipts.length > 1 ? "s" : ""}.`
          : "Verified. No paid receipts were found for this email address.",
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
      setMessage("Receipt history refreshed.");
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
        result?.message || `Receipt #${receiptNumber} has been sent to your email.`,
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

      <section className="section-wrap pt-6 sm:pt-8 pb-24">
        <SectionTitle
          eyebrow="Verified Digital Receipts & Invoices"
          title="Receipt Access & Verification Portal"
          description="Verify your email with a 6-digit access code to inspect and download official payment receipts."
        />

        <div className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-2.5 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-3 py-1 font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
            <ShieldCheck size={14} strokeWidth={1.5} /> 256-Bit SSL Encrypted
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1 font-medium text-ink-700 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-ink-300">
            <KeyRound size={14} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" /> OTP Verification
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1 font-medium text-ink-700 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-ink-300">
            <FileCheck2 size={14} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" /> Signed PDF Documents
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1 font-medium text-ink-700 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-ink-300">
            <Mail size={14} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" /> Email Dispatch
          </span>
        </div>

        {isAuthenticated && user?.email && (
          <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-emerald-600/25 bg-emerald-500/[0.06] p-3.5 dark:border-emerald-500/25">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="inline-flex items-center gap-2 text-ink-800 dark:text-ink-200">
                <UserCheck size={17} strokeWidth={1.5} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>
                  Signed in as <strong className="font-semibold text-ink-950 dark:text-ink-50">{user.name || "User"}</strong> (
                  <span className="font-mono text-xs text-emerald-700 dark:text-emerald-300">{user.email}</span>)
                </span>
              </div>
              {email !== user.email && (
                <button
                  type="button"
                  onClick={() => setEmail(user.email)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-300"
                >
                  Use My Account Email
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mx-auto mt-8 max-w-3xl">
          <div className="grid grid-cols-3 gap-2 text-center sm:gap-4">
            <div
              className={`flex flex-col items-center rounded-2xl border p-2.5 sm:p-3.5 transition-colors ${
                currentStep === 1
                  ? "border-emerald-600/40 bg-emerald-500/[0.08] dark:border-emerald-500/40"
                  : currentStep > 1
                  ? "border-emerald-600/25 bg-white dark:border-emerald-500/25 dark:bg-[#11141c]"
                  : "border-black/[0.08] bg-white opacity-60 dark:border-white/[0.08] dark:bg-[#11141c]"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-semibold tabular-nums ${
                  currentStep >= 1
                    ? "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-ink-950"
                    : "bg-black/[0.06] text-ink-500 dark:bg-white/[0.08] dark:text-ink-400"
                }`}
              >
                {currentStep > 1 ? <Check size={15} strokeWidth={2} /> : "1"}
              </div>
              <span className="mt-2 text-xs font-semibold text-ink-950 dark:text-ink-50">
                Request Code
              </span>
              <span className="hidden text-xs text-ink-500 dark:text-ink-400 sm:inline">Enter email</span>
            </div>

            <div
              className={`flex flex-col items-center rounded-2xl border p-2.5 sm:p-3.5 transition-colors ${
                currentStep === 2
                  ? "border-emerald-600/40 bg-emerald-500/[0.08] dark:border-emerald-500/40"
                  : currentStep > 2
                  ? "border-emerald-600/25 bg-white dark:border-emerald-500/25 dark:bg-[#11141c]"
                  : "border-black/[0.08] bg-white opacity-60 dark:border-white/[0.08] dark:bg-[#11141c]"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-semibold tabular-nums ${
                  currentStep >= 2
                    ? "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-ink-950"
                    : "bg-black/[0.06] text-ink-500 dark:bg-white/[0.08] dark:text-ink-400"
                }`}
              >
                {currentStep > 2 ? <Check size={15} strokeWidth={2} /> : "2"}
              </div>
              <span className="mt-2 text-xs font-semibold text-ink-950 dark:text-ink-50">
                Verify OTP
              </span>
              <span className="hidden text-xs text-ink-500 dark:text-ink-400 sm:inline">Enter 6-digit code</span>
            </div>

            <div
              className={`flex flex-col items-center rounded-2xl border p-2.5 sm:p-3.5 transition-colors ${
                currentStep === 3
                  ? "border-emerald-600/40 bg-emerald-500/[0.08] dark:border-emerald-500/40"
                  : "border-black/[0.08] bg-white opacity-60 dark:border-white/[0.08] dark:bg-[#11141c]"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  currentStep === 3
                    ? "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-ink-950"
                    : "bg-black/[0.06] text-ink-500 dark:bg-white/[0.08] dark:text-ink-400"
                }`}
              >
                <ShieldCheck size={16} strokeWidth={1.5} />
              </div>
              <span className="mt-2 text-xs font-semibold text-ink-950 dark:text-ink-50">
                Verified Receipts
              </span>
              <span className="hidden font-mono text-xs tabular-nums text-ink-500 dark:text-ink-400 sm:inline">
                {receipts.length} loaded
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-3xl">
          <AnimatePresence mode="wait">
            {error && (
              <MotionDiv
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-700 dark:text-rose-300"
              >
                <AlertCircle size={17} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold">Verification Notice</p>
                  <p className="mt-0.5">{error}</p>
                </div>
              </MotionDiv>
            )}

            {message && !error && (
              <MotionDiv
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 flex items-start gap-3 rounded-xl border border-emerald-600/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300"
              >
                <CheckCircle2 size={17} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold">Status Update</p>
                  <p className="mt-0.5">{message}</p>
                </div>
              </MotionDiv>
            )}

            {emailSuccessMsg && (
              <MotionDiv
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 flex items-start gap-3 rounded-xl border border-emerald-600/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300"
              >
                <MailCheck size={17} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold">Email Dispatched</p>
                  <p className="mt-0.5">{emailSuccessMsg}</p>
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 grid gap-6 lg:grid-cols-[1.1fr_1.35fr]">
          <article className="flex flex-col justify-between rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
            <div>
              <div className="flex items-center justify-between border-b border-black/[0.08] pb-4 dark:border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-600/25 bg-emerald-500/10 font-mono text-sm font-semibold text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
                    1
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-ink-950 dark:text-ink-50">Payment Email</h2>
                    <p className="text-xs text-ink-500 dark:text-ink-400">Where you made payments or received receipts</p>
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
                    className="text-xs font-medium text-emerald-600 underline hover:text-emerald-500 dark:text-emerald-400"
                  >
                    Change
                  </button>
                )}
              </div>

              <form onSubmit={handleRequestCode} className="mt-4 space-y-4">
                <div className="relative">
                  <Mail
                    size={16}
                    strokeWidth={1.5}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
                  />
                  <input
                    type="email"
                    required
                    placeholder="youremail@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={submitting || currentStep === 2}
                    className="w-full rounded-xl border border-black/[0.1] bg-[#f8fafc] py-3 pr-4 pl-10 text-sm text-ink-950 outline-none transition-colors focus:border-emerald-600 disabled:cursor-not-allowed disabled:opacity-65 dark:border-white/[0.1] dark:bg-[#0c0e14] dark:text-ink-50 dark:focus:border-emerald-500"
                  />
                </div>

                {currentStep === 1 && (
                  <Button
                    type="submit"
                    disabled={submitting || !email.trim()}
                    className="w-full justify-center py-3 text-sm"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw size={15} strokeWidth={1.5} className="animate-spin" />
                        Sending Security Code...
                      </>
                    ) : (
                      <>
                        <Send size={15} strokeWidth={1.5} />
                        Send Access Code
                      </>
                    )}
                  </Button>
                )}
              </form>

              <div className={`mt-8 transition-opacity ${currentStep >= 2 ? "opacity-100" : "pointer-events-none opacity-45"}`}>
                <div className="flex items-center justify-between border-b border-black/[0.08] pb-4 dark:border-white/[0.08]">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-600/25 bg-emerald-500/10 font-mono text-sm font-semibold text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
                      2
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-ink-950 dark:text-ink-50">6-Digit Security OTP</h2>
                      <p className="text-xs text-ink-500 dark:text-ink-400">Sent to {email || "your email"}</p>
                    </div>
                  </div>
                  {currentStep === 2 && (
                    <button
                      type="button"
                      onClick={handleRequestCode}
                      disabled={submitting || resendCooldown > 0}
                      className="text-xs font-medium text-emerald-600 underline hover:text-emerald-500 disabled:no-underline disabled:opacity-50 dark:text-emerald-400"
                    >
                      {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend Code"}
                    </button>
                  )}
                </div>

                <form onSubmit={handleVerifyCode} className="mt-4 space-y-4">
                  <div className="relative">
                    <KeyRound
                      size={16}
                      strokeWidth={1.5}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
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
                      className="w-full rounded-xl border border-black/[0.1] bg-[#f8fafc] py-3 pr-4 pl-10 text-center font-mono text-lg font-semibold tracking-[0.4em] tabular-nums text-ink-950 outline-none transition-colors placeholder:tracking-[0.2em] placeholder:text-ink-400 focus:border-emerald-600 disabled:cursor-not-allowed disabled:opacity-65 dark:border-white/[0.1] dark:bg-[#0c0e14] dark:text-emerald-300 dark:placeholder:text-ink-600 dark:focus:border-emerald-500"
                    />
                  </div>

                  {currentStep === 2 && (
                    <Button
                      type="submit"
                      disabled={submitting || accessCode.trim().length !== 6}
                      className="w-full justify-center py-3 text-sm"
                    >
                      {submitting ? (
                        <>
                          <RefreshCw size={15} strokeWidth={1.5} className="animate-spin" />
                          Verifying Code...
                        </>
                      ) : (
                        <>
                          <Lock size={15} strokeWidth={1.5} />
                          Verify &amp; Load Invoices
                        </>
                      )}
                    </Button>
                  )}
                </form>
              </div>
            </div>

            <div className="mt-8 border-t border-black/[0.08] pt-4 text-xs text-ink-500 dark:border-white/[0.08] dark:text-ink-400">
              <div className="flex items-start gap-2">
                <Lock size={13} strokeWidth={1.5} className="mt-0.5 shrink-0 text-ink-400" />
                <span>
                  Your receipt session is verified with short-lived SHA tokens and expires automatically after 30 minutes of inactivity.
                </span>
              </div>
            </div>
          </article>

          <article className="flex flex-col rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.08] pb-4 dark:border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/25 dark:text-emerald-400">
                  <History size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="flex items-center gap-2 text-base font-semibold text-ink-950 dark:text-ink-50">
                    Verified Receipt Vault
                    {receipts.length > 0 && (
                      <span className="rounded-full border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-medium tabular-nums text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
                        {receipts.length} {receipts.length === 1 ? "Receipt" : "Receipts"}
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-ink-500 dark:text-ink-400">
                    Official tax invoices and transaction records
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                className="px-3 py-1.5 text-xs"
                onClick={refreshHistory}
                disabled={!portalToken || refreshing}
              >
                <RefreshCw
                  size={14}
                  strokeWidth={1.5}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </Button>
            </div>

            <div className="mt-6 flex-1 space-y-4">
              {currentStep < 3 && receipts.length === 0 ? (
                <div className="flex h-full min-h-[340px] flex-col items-center justify-center rounded-xl border border-dashed border-black/[0.12] bg-[#f8fafc] p-8 text-center dark:border-white/[0.12] dark:bg-[#0c0e14]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-600/25 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/25 dark:text-emerald-400">
                    <ShieldCheck size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-ink-950 dark:text-ink-50">
                    Vault Locked for Privacy
                  </h3>
                  <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-ink-600 dark:text-ink-400">
                    Enter your payment email and the 6-digit access code sent to your inbox to unlock your verified receipts.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <span>Step 1: Request Code</span>
                    <ArrowRight size={13} strokeWidth={1.5} />
                    <span>Step 2: Enter OTP</span>
                    <ArrowRight size={13} strokeWidth={1.5} />
                    <span>Step 3: Download</span>
                  </div>
                </div>
              ) : receipts.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-black/[0.08] bg-[#f8fafc] p-8 text-center dark:border-white/[0.08] dark:bg-[#0c0e14]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-black/[0.08] bg-white text-ink-700 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-ink-300">
                    <AlertCircle size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-ink-950 dark:text-ink-50">
                    No Receipts Found for This Address
                  </h3>
                  <p className="mt-2 max-w-md text-xs leading-relaxed text-ink-600 dark:text-ink-400">
                    Your email (<span className="font-mono text-emerald-700 dark:text-emerald-300">{email}</span>) is verified, but no completed transactions are registered under it.
                  </p>
                  <p className="mt-2 text-xs text-ink-500 dark:text-ink-400">
                    If you paid with a different email on Cashfree,{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep(1);
                        setMessage("");
                        setError("");
                      }}
                      className="font-medium text-emerald-600 underline dark:text-emerald-400"
                    >
                      switch address
                    </button>{" "}
                    to request access for it.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {receipts.map((item) => (
                    <div
                      key={item.receiptNumber}
                      className="rounded-xl border border-black/[0.08] bg-[#f8fafc] p-5 transition-colors hover:border-emerald-600/30 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:hover:border-emerald-500/30"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/[0.06] pb-3 dark:border-white/[0.06]">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                          <span className="rounded-full border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
                            {item.status || "Paid"} &amp; Verified
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-medium tabular-nums text-ink-600 dark:text-ink-400">
                            {item.receiptNumber}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyReceiptId(item.receiptNumber)}
                            className="rounded-lg border border-black/[0.08] bg-white p-1.5 text-ink-500 transition-colors hover:text-ink-950 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-ink-400 dark:hover:text-ink-50"
                            title="Copy Receipt Number"
                          >
                            {copiedReceiptId === item.receiptNumber ? (
                              <Check size={13} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Copy size={13} strokeWidth={1.5} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div>
                          <span className="text-xs text-ink-500 dark:text-ink-400">
                            Service / Contribution
                          </span>
                          <p className="mt-0.5 text-sm font-semibold text-ink-950 dark:text-ink-50">
                            {item.serviceName}
                          </p>
                          {item.customerName && (
                            <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
                              Client: {item.customerName}
                            </p>
                          )}
                        </div>

                        <div className="sm:text-right">
                          <span className="text-xs text-ink-500 dark:text-ink-400">
                            Total Paid
                          </span>
                          <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                            {formatCurrency(item.amountInr)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg border border-black/[0.06] bg-white p-2.5 text-xs text-ink-600 dark:border-white/[0.06] dark:bg-[#11141c] dark:text-ink-400">
                        <div>
                          <span className="block text-[11px] text-ink-500 dark:text-ink-400">Date of Payment</span>
                          <span className="font-medium tabular-nums text-ink-900 dark:text-ink-200">{formatDate(item.paidAt)}</span>
                        </div>
                        <div>
                          <span className="block text-[11px] text-ink-500 dark:text-ink-400">Transaction Reference</span>
                          <span className="block truncate font-mono text-ink-900 dark:text-ink-200">
                            {item.orderId || item.paymentId || "Direct Checkout"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-black/[0.06] pt-4 dark:border-white/[0.06]">
                        <a
                          href={toAbsoluteApiUrl(item.downloadUrl)}
                          download={`${item.receiptNumber}.pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-black/[0.08] bg-ink-950 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink-900 dark:border-white/[0.1] dark:bg-emerald-500 dark:text-ink-950 dark:hover:bg-emerald-400"
                        >
                          <Download size={14} strokeWidth={1.5} />
                          Download PDF Invoice
                        </a>

                        <button
                          type="button"
                          onClick={() => handleEmailReceipt(item.receiptNumber)}
                          disabled={emailingReceipt === item.receiptNumber}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-black/[0.08] bg-white px-3.5 py-2 text-xs font-medium text-ink-800 transition-colors hover:border-emerald-600/35 disabled:opacity-50 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-ink-200 dark:hover:border-emerald-500/35"
                          title="Send PDF to email"
                        >
                          {emailingReceipt === item.receiptNumber ? (
                            <RefreshCw size={14} strokeWidth={1.5} className="animate-spin text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Mail size={14} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
                          )}
                          <span className="hidden sm:inline">
                            {emailingReceipt === item.receiptNumber ? "Sending..." : "Email to Me"}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePrint(item.downloadUrl)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-xs font-medium text-ink-700 transition-colors hover:border-emerald-600/35 hover:text-ink-950 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-ink-300 dark:hover:border-emerald-500/35 dark:hover:text-ink-50"
                          title="Print / Open Invoice"
                        >
                          <Printer size={14} strokeWidth={1.5} />
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
    </>
  );
};

export default ReceiptPortalPage;
