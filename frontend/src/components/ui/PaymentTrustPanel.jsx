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
    detail: "Transparent scope, daily milestone updates & modular clean architecture.",
    icon: Layers,
  },
  {
    title: "Security-Aware Architecture",
    detail: "Built to OWASP security guidelines with input validation & defensive code.",
    icon: ShieldCheck,
  },
  {
    title: "Fast Communication Loop",
    detail: "Direct 1-on-1 founder support with rapid turnaround times & post-launch help.",
    icon: TimerReset,
  },
];

const checkoutAssurances = [
  {
    title: "Secure Cashfree Checkout",
    detail: "Cards, UPI, net banking & wallets on 256-bit encrypted gateway.",
    icon: Lock,
  },
  {
    title: "Instant Payment Receipt",
    detail: "Auto-generated downloadable invoice with order & payment references.",
    icon: ReceiptText,
  },
  {
    title: "7-Day Refund Window",
    detail: "Clear, transparent refund terms before project commencement.",
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
        "relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/90 p-5 sm:p-6 shadow-xl backdrop-blur-xl transition-all",
        "dark:border-emerald-500/25 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)]",
        className,
      )}
    >
      {/* Subtle ambient light */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Header with Title and Trust Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            {includeHighlights
              ? "Execution Assurance & Secure Checkout"
              : "Secure and Verifiable Checkout"}
          </h3>
        </div>

        {/* Status Trust Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
            <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400" />
            256-Bit SSL
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
            <BadgeCheck size={13} className="text-emerald-600 dark:text-emerald-400" />
            Cashfree Verified
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
            <TimerReset size={13} className="text-emerald-600 dark:text-emerald-400" />
            7-Day Refund Promise
          </span>
        </div>
      </div>

      {/* Grid of Concise Trust Points */}
      <div
        className={clsx(
          "mt-4.5 grid gap-3",
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
              className="group rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 transition-all duration-200 hover:border-emerald-500/30 hover:bg-white dark:border-emerald-500/15 dark:bg-[#020803]/80 dark:hover:border-emerald-500/30 dark:hover:bg-[#041207]/90"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                  <Icon size={14} />
                </div>
                <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white leading-tight">
                  {item.title}
                </h4>
              </div>
              <p className="mt-1 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed pl-[38px]">
                {item.detail}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer Strip with Support Info & Legal Links */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-3 dark:border-emerald-500/20 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium text-[11px] sm:text-xs">
          <Mail size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Billing support:</span>
          <a
            href={`mailto:${QUICK_CONTACT.billingEmail}`}
            className="font-semibold text-slate-800 hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-400 underline underline-offset-2"
          >
            {QUICK_CONTACT.billingEmail}
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Link
            to={QUICK_CONTACT.refundPolicyPath}
            className="rounded-full border border-slate-300/80 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-emerald-500 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:border-emerald-400 transition"
          >
            Refund Policy
          </Link>
          {legalQuickLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full border border-slate-300/80 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-emerald-500 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:border-emerald-400 transition"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="rounded-full border border-slate-300/80 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-emerald-500 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:border-emerald-400 transition"
          >
            Billing Contact
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default PaymentTrustPanel;
