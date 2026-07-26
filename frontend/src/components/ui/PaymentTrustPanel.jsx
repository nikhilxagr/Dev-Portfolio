import { Link } from "react-router-dom";
import { ShieldCheck, ReceiptText, Mail, BadgeCheck } from "lucide-react";
import { LEGAL_LINKS, QUICK_CONTACT } from "@/constants/siteData";

const legalQuickLinks = LEGAL_LINKS.filter((item) =>
  ["Terms and Conditions", "Privacy Policy"].includes(item.label),
);

const trustPoints = [
  {
    title: "Secure Cashfree Checkout",
    detail:
      "Cards, UPI, net banking, and wallets are processed on Cashfree encrypted pages.",
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
    <aside className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)]">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
        // Payment Confidence
      </p>
      <h3 className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
        Secure and Verifiable Checkout
      </h3>
      
      <div className="mt-4 grid gap-3">
        {trustPoints.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-slate-50/90 p-3.5 dark:border-emerald-500/20 dark:bg-[#020803]/80"
            >
              <div className="flex items-center gap-2">
                <Icon size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                  {item.title}
                </p>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {item.detail}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <Link
          to={QUICK_CONTACT.refundPolicyPath}
          className="rounded-full border border-slate-300 bg-white px-3.5 py-1.5 font-semibold text-slate-800 hover:border-emerald-500 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:border-emerald-400 transition"
        >
          View Refund Policy
        </Link>
        {legalQuickLinks.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="rounded-full border border-slate-300 bg-white px-3.5 py-1.5 font-semibold text-slate-800 hover:border-emerald-500 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:border-emerald-400 transition"
          >
            {item.label}
          </Link>
        ))}
        <a
          href={`mailto:${QUICK_CONTACT.billingEmail}`}
          className="rounded-full border border-slate-300 bg-white px-3.5 py-1.5 font-semibold text-slate-800 hover:border-emerald-500 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:border-emerald-400 transition"
        >
          Billing Contact
        </a>
      </div>
    </aside>
  );
};

export default PaymentTrustPanel;
