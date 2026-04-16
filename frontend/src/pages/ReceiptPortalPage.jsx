import { useState } from "react";
import { KeyRound, MailCheck, Download, History } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import SeoHead from "@/components/seo/SeoHead";
import { getErrorMessage } from "@/services/api";
import {
  getReceiptHistory,
  requestReceiptAccessCode,
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

const ReceiptPortalPage = () => {
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [portalToken, setPortalToken] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRequestCode = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid payment email address.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await requestReceiptAccessCode(email.trim());
      const debugCode = response?.data?.debugCode;
      const backendMessage =
        response?.message ||
        "If matching receipts exist, an access code has been sent to your email.";
      setMessage(
        debugCode
          ? `Access code sent. Development code: ${debugCode}`
          : backendMessage,
      );
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
    event.preventDefault();
    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(accessCode.trim())) {
      setError("Access code must be 6 digits.");
      return;
    }

    setSubmitting(true);

    try {
      const verifyResponse = await verifyReceiptAccessCode({
        email: email.trim(),
        code: accessCode.trim(),
      });
      const token = verifyResponse?.data?.portalToken || "";
      setPortalToken(token);

      const historyResponse = await getReceiptHistory(token);
      setReceipts(historyResponse?.data?.receipts || []);
      setMessage("Receipt history loaded successfully.");
    } catch (verifyError) {
      setError(
        getErrorMessage(
          verifyError,
          "Could not verify access code. Please check and try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const refreshHistory = async () => {
    if (!portalToken) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const historyResponse = await getReceiptHistory(portalToken);
      setReceipts(historyResponse?.data?.receipts || []);
      setMessage("Receipt history refreshed.");
    } catch (historyError) {
      setError(
        getErrorMessage(historyError, "Could not refresh receipt history."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SeoHead
        title="Receipt History"
        description="Secure portal for payment receipt access and download history."
        pathname="/receipts"
        robots="noindex, nofollow"
      />

      <section className="section-wrap pt-12 sm:pt-20">
        <SectionTitle
          eyebrow="Receipt Portal"
          title="Receipt Access Portal"
          description="Request an access code and download verified receipts using your payment email."
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <article className="card-surface rounded-3xl p-6">
            <h2 className="text-lg font-semibold text-cyan-100">
              Step 1: Request Access Code
            </h2>
            <form onSubmit={handleRequestCode} className="mt-3 space-y-3">
              <label className="block text-sm text-slate-200">
                Payment Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-cyan-300/25 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-300"
                />
              </label>
              <Button type="submit" disabled={submitting} className="w-full">
                <MailCheck size={16} />
                {submitting ? "Sending..." : "Send Access Code"}
              </Button>
            </form>

            <h2 className="mt-6 text-lg font-semibold text-cyan-100">
              Step 2: Verify Code
            </h2>
            <form onSubmit={handleVerifyCode} className="mt-3 space-y-3">
              <label className="block text-sm text-slate-200">
                6-Digit Access Code
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={accessCode}
                  onChange={(event) =>
                    setAccessCode(event.target.value.replace(/\D/g, ""))
                  }
                  className="mt-1 w-full rounded-xl border border-cyan-300/25 bg-slate-950/80 px-4 py-2.5 text-sm tracking-[0.2em] text-slate-200 outline-none focus:border-cyan-300"
                />
              </label>
              <Button type="submit" disabled={submitting} className="w-full">
                <KeyRound size={16} />
                {submitting ? "Verifying..." : "Verify and Load Receipts"}
              </Button>
            </form>

            {error ? (
              <p className="mt-3 text-sm text-rose-300">{error}</p>
            ) : null}
            {message ? (
              <p className="mt-3 text-sm text-emerald-300">{message}</p>
            ) : null}
          </article>

          <article className="card-surface rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-cyan-100">
                <History size={18} /> Receipt History
              </h2>
              <Button
                type="button"
                variant="ghost"
                className="px-3 py-2"
                onClick={refreshHistory}
                disabled={!portalToken || submitting}
              >
                Refresh
              </Button>
            </div>

            {receipts.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-slate-900/70 p-4 text-sm text-slate-300">
                No receipts loaded yet. Complete the verification step to view
                payment history.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {receipts.map((item) => (
                  <div
                    key={item.receiptNumber}
                    className="rounded-2xl border border-cyan-300/20 bg-slate-900/70 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-cyan-100">
                        {item.serviceName}
                      </p>
                      <span className="rounded-full border border-emerald-300/35 bg-emerald-300/10 px-2 py-1 text-xs text-emerald-200">
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      Receipt: {item.receiptNumber}
                    </p>
                    <p className="text-xs text-slate-400">
                      Amount: INR {item.amountInr}
                    </p>
                    <p className="text-xs text-slate-400">
                      Paid At: {formatDate(item.paidAt)}
                    </p>

                    <Button
                      href={toAbsoluteApiUrl(item.downloadUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 w-full"
                    >
                      <Download size={16} /> Download Receipt
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>
      </section>
    </>
  );
};

export default ReceiptPortalPage;
