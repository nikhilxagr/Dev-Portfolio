import { useMemo } from "react";
import { CircleCheckBig, Download, Mail, RefreshCw } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import SeoHead from "@/components/seo/SeoHead";
import { QUICK_CONTACT } from "@/constants/siteData";
import { getLatestReceipt, toAbsoluteApiUrl } from "@/services/payment.service";

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
  const receiptState = useMemo(() => getLatestReceipt(), []);
  const receipt = receiptState?.receipt || null;

  return (
    <>
      <SeoHead
        title="Payment Success"
        description="Payment confirmation route with receipt download and billing support references."
        pathname="/payment/success"
        robots="noindex, nofollow"
      />

      <section className="section-wrap pt-12 sm:pt-20">
        <SectionTitle
          eyebrow="Payment Confirmed"
          title="Your Service Booking Is Confirmed"
          description="Payment verification is complete. Save the receipt for your records and support references."
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="card-surface rounded-3xl p-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-300/15 px-3 py-1 text-xs uppercase tracking-[0.14em] text-emerald-200">
              <CircleCheckBig size={14} />
              Verified Payment
            </div>

            {receipt ? (
              <>
                <h2 className="mt-4 text-2xl font-semibold text-cyan-100">
                  Receipt Ready for Download
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  Payment references are now attached to your receipt for future
                  support and validation.
                </p>

                <div className="mt-4 grid gap-3 rounded-2xl border border-cyan-300/20 bg-slate-900/75 p-4 text-sm text-slate-200 sm:grid-cols-2">
                  <p>
                    <span className="text-slate-400">Receipt Number</span>
                    <br />
                    <span className="font-semibold text-cyan-100">
                      {receipt.receiptNumber}
                    </span>
                  </p>
                  <p>
                    <span className="text-slate-400">Service</span>
                    <br />
                    <span className="font-semibold text-cyan-100">
                      {receipt.serviceName}
                    </span>
                  </p>
                  <p>
                    <span className="text-slate-400">Amount</span>
                    <br />
                    <span className="font-semibold text-cyan-100">
                      INR {receipt.amountInr}
                    </span>
                  </p>
                  <p>
                    <span className="text-slate-400">Paid At</span>
                    <br />
                    <span className="font-semibold text-cyan-100">
                      {formatDate(receipt.paidAt)}
                    </span>
                  </p>
                  <p>
                    <span className="text-slate-400">Order ID</span>
                    <br />
                    <span className="break-all text-xs text-slate-200">
                      {receipt.orderId}
                    </span>
                  </p>
                  <p>
                    <span className="text-slate-400">Payment ID</span>
                    <br />
                    <span className="break-all text-xs text-slate-200">
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
                    <Download size={16} /> Download Receipt
                  </Button>
                  <Button
                    to="/receipts"
                    variant="secondary"
                    className="min-w-[200px]"
                  >
                    <RefreshCw size={16} /> Receipt History
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="mt-4 text-2xl font-semibold text-cyan-100">
                  Receipt Session Not Found
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  Your payment may still be successful. Open receipt history and
                  verify using your payment email.
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
            )}
          </article>

          <aside className="card-surface rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">
              Confirmation Support
            </p>
            <h3 className="mt-2 text-lg font-semibold text-cyan-100">
              Need Billing Help?
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              If you need payment confirmation again, share your receipt number
              through official support.
            </p>

            <a
              href={`mailto:${QUICK_CONTACT.billingEmail}`}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-slate-900/70 px-3 py-2 text-sm text-cyan-100"
            >
              <Mail size={16} />
              {QUICK_CONTACT.billingEmail}
            </a>

            <p className="mt-4 text-xs text-slate-400">
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
