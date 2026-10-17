import { useState } from "react";
import { Mail, Check, Loader2, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { subscribeNewsletter } from "@/services/newsletter.service";

export default function NewsletterSubscriptionCard({ className = "" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailRegex.test(cleanEmail)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      setStatus("loading");
      setMessage("");

      const response = await subscribeNewsletter(cleanEmail, "engineering-docs-bottom");

      setStatus("success");
      setMessage(
        response?.message ||
          "You're subscribed! Check your inbox for your welcome digest & featured blueprints.",
      );
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to subscribe right now. Please try again later.",
      );
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-white/[0.08] bg-white/90 dark:bg-[#07130c]/90 p-7 sm:p-10 shadow-xl backdrop-blur-xl transition-all duration-300 ${className}`}
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lime-400/10 blur-[90px]" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-[90px]" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-lime-500/30 dark:border-lime-400/20 bg-lime-500/[0.06] dark:bg-lime-400/[0.05] px-3.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-lime-600 dark:text-lime-300 mb-4">
          <Sparkles size={12} className="text-lime-500" />
          <span>ENGINEERING DISPATCHES</span>
        </div>

        {/* Title */}
        <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-snug">
          Subscribe to{" "}
          <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Engineering Docs
          </span>
        </h3>

        {/* Subtitle */}
        <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Receive in-depth system design blueprints, distributed caching architectures, and practical engineering notes straight to your inbox.
        </p>

        {/* Subscription Form */}
        <form onSubmit={handleSubmit} className="mt-8 max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                disabled={status === "loading" || status === "success"}
                placeholder="Enter your email address..."
                className="w-full rounded-2xl border border-slate-300/80 dark:border-white/10 bg-slate-50/80 dark:bg-black/40 pl-11 pr-4 py-3 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none backdrop-blur-md transition-all focus:border-lime-500 dark:focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 shadow-xs"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className={`shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-mono text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md ${
                status === "success"
                  ? "bg-emerald-500 text-white cursor-default"
                  : "bg-lime-400 text-slate-950 hover:bg-lime-300 hover:shadow-[0_0_20px_rgba(163,230,53,0.4)] active:scale-[0.98]"
              }`}
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : status === "success" ? (
                <>
                  <Check size={15} />
                  <span>Subscribed!</span>
                </>
              ) : (
                <>
                  <span>Subscribe</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>

          {/* Feedback messages */}
          {status === "success" && (
            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2">
              <Check size={14} className="shrink-0 text-emerald-500" />
              <span>{message}</span>
            </div>
          )}

          {status === "error" && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-medium text-red-600 dark:text-red-400 text-center">
              {message}
            </div>
          )}
        </form>

        {/* Trust Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-zinc-500 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-lime-500" />
            <span>Zero Spam Guarantee</span>
          </div>
          <span>•</span>
          <span>Nodemailer Powered Dispatch</span>
          <span>•</span>
          <span>Unsubscribe Anytime</span>
        </div>
      </div>
    </div>
  );
}
