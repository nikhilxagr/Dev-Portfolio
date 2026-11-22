import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CircleCheckBig, Download, Mail, RefreshCw } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import SeoHead from "@/components/seo/SeoHead";
import { QUICK_CONTACT } from "@/constants/siteData";
import { getErrorMessage } from "@/services/api";
import {
  getLatestReceipt,
  persistLatestReceipt,
  toAbsoluteApiUrl,
  verifyServicePayment,
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

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderIdFromQuery = useMemo(
    () =>
      String(
        searchParams.get("order_id") || searchParams.get("orderId") || "",
      ).trim(),
    [searchParams],
  );

  const receiptState = useMemo(() => getLatestReceipt(), []);
  const [receipt, setReceipt] = useState(receiptState?.receipt || null);
  const [isVerifying, setIsVerifying] = useState(
    Boolean(!receiptState?.receipt && orderIdFromQuery),
  );
  const [verificationInfo, setVerificationInfo] = useState("");
  const [verificationError, setVerificationError] = useState("");

  useEffect(() => {
    if (receipt || !orderIdFromQuery) {
      return;
    }

    let isMounted = true;

    const verifyOrder = async () => {
      setIsVerifying(true);
      setVerificationError("");
      setVerificationInfo("Verifying payment with Cashfree...");

      try {
        const verifyResponse = await verifyServicePayment({
          orderId: orderIdFromQuery,
        });
        const nextReceipt = verifyResponse?.data?.receipt || null;

        if (nextReceipt) {
          persistLatestReceipt({ receipt: nextReceipt });
          if (isMounted) {
            setReceipt(nextReceipt);
            setVerificationInfo("Payment verified successfully.");
          }
          return;
        }

        if (isMounted) {
          setVerificationInfo(
            verifyResponse?.message ||
              "Payment is pending. Complete payment and refresh this page.",
          );
        }
      } catch (error) {
        if (isMounted) {
          setVerificationError(
            getErrorMessage(
              error,
              "Could not verify payment yet. Retry from receipt history or contact billing support.",
            ),
          );
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    };

    verifyOrder();

    return () => {
      isMounted = false;
    };
  }, [orderIdFromQuery, receipt]);

  return (
    <>
      <SeoHead
        title="Payment Success"
        description="Payment confirmation route with receipt download and billing support references."
        pathname="/payment/success"
        robots="noindex, nofollow"
      />

      <section className="section-wrap pt-6 sm:pt-8 pb-20">
        <SectionTitle
          eyebrow="Payment Confirmed"
          title="Payment Confirmation"
          description="Your transaction has been verified and the receipt is ready for access and download."
        />

        {verificationInfo ? (
          <p className="mt-4 rounded-xl border border-emerald-600/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300">
            {verificationInfo}
          </p>
        ) : null}

        {verificationError ? (
          <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
            {verificationError}
          </p>
        ) : null}

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c]">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
              <CircleCheckBig size={14} strokeWidth={1.5} />
              Verified Payment
            </div>

            {isVerifying ? (
              <>
                <h2 className="mt-4 text-2xl font-semibold text-ink-950 dark:text-ink-50">
                  Verifying Payment Status
                </h2>
                <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">
                  Please wait while we validate your transaction and prepare the
                  receipt.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button to="/receipts" className="min-w-[200px]">
                    Open Receipt History
                  </Button>
                </div>
              </>
            ) : null}

            {!isVerifying && receipt ? (
              <>
                <h2 className="mt-4 text-2xl font-semibold text-ink-950 dark:text-ink-50">
                  Receipt Ready for Download
                </h2>
                <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">
                  Payment references are attached to your receipt for future
                  support and verification.
                </p>

                <div className="mt-4 grid gap-3 rounded-xl border border-black/[0.08] bg-[#f8fafc] p-4 text-sm text-ink-700 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-ink-300 sm:grid-cols-2">
                  <p>
                    <span className="text-xs text-ink-500 dark:text-ink-400">Receipt Number</span>
                    <br />
                    <span className="font-mono font-semibold tabular-nums text-ink-950 dark:text-ink-50">
                      {receipt.receiptNumber}
                    </span>
                  </p>
                  <p>
                    <span className="text-xs text-ink-500 dark:text-ink-400">Payment For</span>
                    <br />
                    <span className="font-semibold text-ink-950 dark:text-ink-50">
                      {receipt.serviceName}
                    </span>
                  </p>
                  <p>
                    <span className="text-xs text-ink-500 dark:text-ink-400">Amount</span>
                    <br />
                    <span className="font-mono font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                      INR {receipt.amountInr}
                    </span>
                  </p>
                  <p>
                    <span className="text-xs text-ink-500 dark:text-ink-400">Paid At</span>
                    <br />
                    <span className="font-semibold tabular-nums text-ink-950 dark:text-ink-50">
                      {formatDate(receipt.paidAt)}
                    </span>
                  </p>
                  <p>
                    <span className="text-xs text-ink-500 dark:text-ink-400">Order ID</span>
                    <br />
                    <span className="break-all font-mono text-xs text-ink-700 dark:text-ink-300">
                      {receipt.orderId}
                    </span>
                  </p>
                  <p>
                    <span className="text-xs text-ink-500 dark:text-ink-400">Payment ID</span>
                    <br />
                    <span className="break-all font-mono text-xs text-ink-700 dark:text-ink-300">
                      {receipt.paymentId}
                    </span>
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    href={toAbsoluteApiUrl(receipt.downloadUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="min-w-[200px]"
                  >
                    <Download size={15} strokeWidth={1.5} /> Download Receipt
                  </Button>
                  <Button
                    to="/receipts"
                    variant="secondary"
                    className="min-w-[200px]"
                  >
                    <RefreshCw size={15} strokeWidth={1.5} /> Receipt History
                  </Button>
                </div>
              </>
            ) : null}

            {!isVerifying && !receipt ? (
              <>
                <h2 className="mt-4 text-2xl font-semibold text-ink-950 dark:text-ink-50">
                  Receipt Session Not Found
                </h2>
                <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">
                  Your payment may still be pending. Open receipt history and
                  verify using your payment email or retry checkout.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button to="/receipts" className="min-w-[200px]">
                    Open Receipt History
                  </Button>
                  <Button
                    to="/services"
                    variant="ghost"
                    className="min-w-[200px]"
                  >
                    Back to Services
                  </Button>
                </div>
              </>
            ) : null}
          </article>

          <aside className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c]">
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Confirmation Support
            </p>
            <h3 className="mt-2 text-lg font-semibold text-ink-950 dark:text-ink-50">
              Need Billing Help?
            </h3>
            <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">
              If you need payment confirmation again, share your receipt number
              through official support.
            </p>

            <a
              href={`mailto:${QUICK_CONTACT.billingEmail}`}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-black/[0.08] bg-[#f8fafc] px-3 py-2 text-sm text-ink-900 transition-colors hover:border-emerald-600/35 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-ink-100"
            >
              <Mail size={15} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
              {QUICK_CONTACT.billingEmail}
            </a>

            <p className="mt-4 text-xs text-ink-500 dark:text-ink-400">
              Refund requests are accepted within 7 days from payment date as
              per policy.
            </p>
            <Button
              to={QUICK_CONTACT.refundPolicyPath}
              variant="ghost"
              className="mt-3 w-full"
            >
              Read Refund Policy
            </Button>
          </aside>
        </div>
      </section>
    </>
  );
};

export default PaymentSuccessPage;
