import { Link } from "react-router-dom";
import { ShieldCheck, ReceiptText, Mail, BadgeCheck } from "lucide-react";
import { LEGAL_LINKS, QUICK_CONTACT } from "@/constants/siteData";

const legalQuickLinks = LEGAL_LINKS.filter((item) =>
  ["Terms and Conditions", "Privacy Policy"].includes(item.label),
);

const trustPoints = [
  {
    title: "Secure Razorpay Checkout",
    detail:
      "Cards, UPI, net banking, and wallets are processed on Razorpay encrypted pages.",
    icon: ShieldCheck,
  },
  {
    title: "Instant Payment Receipt",
    detail:
      "Every successful payment generates a downloadable receipt with order and payment references.",
    icon: ReceiptText,
  },
  {
    title: "Professional Support Channel",
    detail: `Billing support is available at ${QUICK_CONTACT.supportEmail}.`,
    icon: Mail,
  },
  {
    title: "7-Day Refund Request Window",
    detail:
      "Clear refund policy terms are visible before checkout and inside your receipt.",
    icon: BadgeCheck,
  },
];

const PaymentTrustPanel = () => {
  return (
    <aside className="card-surface rounded-3xl p-6">
      <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">
        Payment Confidence
      </p>
      <h3 className="mt-2 text-xl font-semibold text-cyan-100">
        Secure and Verifiable Checkout
      </h3>
      <div className="mt-4 grid gap-3">
        {trustPoints.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-3"
            >
              <div className="flex items-center gap-2">
                <Icon size={16} className="text-cyan-200" />
                <p className="text-sm font-semibold text-cyan-100">
                  {item.title}
                </p>
              </div>
              <p className="mt-1 text-xs text-slate-300">{item.detail}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <Link
          to={QUICK_CONTACT.refundPolicyPath}
          className="rounded-full border border-cyan-300/35 px-3 py-1 text-cyan-100 transition hover:border-cyan-300"
        >
          View Refund Policy
        </Link>
        {legalQuickLinks.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="rounded-full border border-cyan-300/35 px-3 py-1 text-cyan-100 transition hover:border-cyan-300"
          >
            {item.label}
          </Link>
        ))}
        <a
          href={`mailto:${QUICK_CONTACT.billingEmail}`}
          className="rounded-full border border-cyan-300/35 px-3 py-1 text-cyan-100 transition hover:border-cyan-300"
        >
          Billing Contact
        </a>
      </div>
    </aside>
  );
};

export default PaymentTrustPanel;
