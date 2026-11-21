import { useState } from "react";
import { Mail, Check, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { subscribeNewsletter } from "@/services/newsletter.service";

export default function NewsletterSubscriptionCard({ className = "" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
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
          "Subscribed. Check your inbox for the welcome digest and featured notes.",
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
      className={`rounded-2xl border border-black/[0.08] bg-white p-7 sm:p-10 dark:border-white/[0.08] dark:bg-[#11141c] ${className}`}
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
          Engineering Dispatches
        </p>

        <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.02em] leading-snug text-slate-900 sm:text-3xl dark:text-[#eef0f5]">
          Subscribe to{" "}
          <span className="text-emerald-600 dark:text-emerald-400">
            Engineering Docs
          </span>
        </h3>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-[#a3a9b8]">
          Receive system design notes, backend architecture writeups, and new blog posts directly in your inbox.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto mt-7 max-w-xl">
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <div className="relative w-full">
              <Mail
                size={16}
                strokeWidth={1.5}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#7a8296]"
              />
              <input
                type="email"
                id="newsletter-email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                disabled={status === "loading" || status === "success"}
                placeholder="you@example.com"
                className="h-11 w-full rounded-lg border border-black/[0.08] bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-emerald-600 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#eef0f5] dark:placeholder:text-[#7a8296] dark:focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className={`inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg px-5 text-sm font-medium transition-colors duration-150 sm:w-auto ${
                status === "success"
                  ? "bg-emerald-600 text-white cursor-default dark:bg-emerald-500 dark:text-slate-950"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
              }`}
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={15} strokeWidth={1.5} className="animate-spin" />
                  <span>Subscribing</span>
                </>
              ) : status === "success" ? (
                <>
                  <Check size={15} strokeWidth={1.5} />
                  <span>Subscribed</span>
                </>
              ) : (
                <>
                  <span>Subscribe</span>
                  <ArrowRight size={15} strokeWidth={1.5} />
                </>
              )}
            </button>
          </div>

          {status === "success" && (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-emerald-600/25 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300">
              <Check size={14} strokeWidth={1.5} className="shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {status === "error" && (
            <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-center text-xs font-medium text-rose-700 dark:text-rose-400">
              {message}
            </div>
          )}
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 dark:text-[#7a8296]">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={14} strokeWidth={1.5} className="text-emerald-700 dark:text-emerald-400" />
            <span>Zero spam</span>
          </span>
          <span>·</span>
          <span>Email digest via Nodemailer</span>
          <span>·</span>
          <span>Unsubscribe anytime</span>
        </div>
      </div>
    </div>
  );
}
