import { Link } from "react-router-dom";
import {
  ShieldCheck,
  ReceiptText,
  Mail,
  BadgeCheck,
  Layers,
  TimerReset,
  Lock,
} from "lucide-react";
import clsx from "clsx";
import { LEGAL_LINKS, QUICK_CONTACT } from "@/constants/siteData";

const legalQuickLinks = LEGAL_LINKS.filter((item) =>
  ["Terms and Conditions", "Privacy Policy"].includes(item.label),
);

const serviceHighlights = [
  {
    title: "Execution-First Delivery",
    detail: "Transparent scope, daily milestone updates, and modular clean architecture.",
    icon: Layers,
  },
  {
    title: "Security-Aware Architecture",
    detail: "Built to OWASP guidelines with input validation and defensive API controls.",
    icon: ShieldCheck,
  },
  {
    title: "Fast Communication Loop",
    detail: "Direct 1-on-1 developer support with predictable turnaround and post-launch help.",
    icon: TimerReset,
  },
];

const checkoutAssurances = [
  {
    title: "Secure Cashfree Checkout",
    detail: "Cards, UPI, net banking, and wallets over 256-bit encrypted gateway.",
    icon: Lock,
  },
  {
    title: "Instant Payment Receipt",
    detail: "Auto-generated downloadable invoice with order and payment references.",
    icon: ReceiptText,
  },
  {
    title: "7-Day Refund Window",
    detail: "Clear, transparent refund terms available prior to project commencement.",
    icon: BadgeCheck,
  },
];

const defaultTrustPoints = [
  {
    title: "Secure Cashfree Checkout",
    detail: "Cards, UPI, net banking, and wallets are processed on Cashfree encrypted pages.",
    icon: Lock,
  },
  {
    title: "Instant Payment Receipt",
    detail: "Every successful payment generates a downloadable receipt with order references.",
    icon: ReceiptText,
  },
  {
    title: "Professional Support Channel",
    detail: `Billing support is available directly at ${QUICK_CONTACT.supportEmail}.`,
    icon: Mail,
  },
  {
    title: "7-Day Refund Request Window",
    detail: "Clear refund policy terms are visible before checkout and inside your receipt.",
    icon: BadgeCheck,
  },
];

const PaymentTrustPanel = ({ includeHighlights = false, className = "" }) => {
  const points = includeHighlights
    ? [...serviceHighlights, ...checkoutAssurances]
    : defaultTrustPoints;

  return (
    <aside
      className={clsx(
        "rounded-2xl border border-black/[0.08] bg-white p-5 sm:p-6",
        "dark:border-white/[0.08] dark:bg-[#11141c]",
        className,
      )}
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h3 className="text-lg font-semibold text-ink-950 dark:text-ink-50 sm:text-xl">
          {includeHighlights
            ? "Execution Assurance & Secure Checkout"
            : "Secure and Verifiable Checkout"}
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
            <ShieldCheck size={13} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
            256-Bit SSL
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
            <BadgeCheck size={13} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
            Cashfree Verified
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
            <TimerReset size={13} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
            7-Day Refund Promise
          </span>
        </div>
      </div>

      <div
        className={clsx(
          "mt-5 grid gap-3",
          includeHighlights
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1 sm:grid-cols-2",
        )}
      >
        {points.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-xl border border-black/[0.08] bg-[#f8fafc] p-3.5 transition-colors hover:border-emerald-600/30 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:hover:border-emerald-500/30"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-600/25 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/25 dark:text-emerald-400">
                  <Icon size={14} strokeWidth={1.5} />
                </div>
                <h4 className="text-xs font-semibold leading-tight text-ink-950 dark:text-ink-50 sm:text-[13px]">
                  {item.title}
                </h4>
              </div>
              <p className="mt-1.5 pl-[38px] text-xs leading-relaxed text-ink-600 dark:text-ink-400">
                {item.detail}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.08] pt-3.5 text-xs dark:border-white/[0.08]">
        <div className="flex items-center gap-1.5 text-ink-600 dark:text-ink-400">
          <Mail size={13} strokeWidth={1.5} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>Billing support:</span>
          <a
            href={`mailto:${QUICK_CONTACT.billingEmail}`}
            className="font-medium text-ink-900 underline underline-offset-2 hover:text-emerald-600 dark:text-ink-200 dark:hover:text-emerald-400"
          >
            {QUICK_CONTACT.billingEmail}
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Link
            to={QUICK_CONTACT.refundPolicyPath}
            className="rounded-full border border-black/[0.08] bg-[#f8fafc] px-2.5 py-1 text-[11px] font-medium text-ink-700 transition-colors hover:border-emerald-600/35 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-ink-300 dark:hover:border-emerald-500/35"
          >
            Refund Policy
          </Link>
          {legalQuickLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full border border-black/[0.08] bg-[#f8fafc] px-2.5 py-1 text-[11px] font-medium text-ink-700 transition-colors hover:border-emerald-600/35 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-ink-300 dark:hover:border-emerald-500/35"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="rounded-full border border-black/[0.08] bg-[#f8fafc] px-2.5 py-1 text-[11px] font-medium text-ink-700 transition-colors hover:border-emerald-600/35 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-ink-300 dark:hover:border-emerald-500/35"
          >
            Billing Contact
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default PaymentTrustPanel;
