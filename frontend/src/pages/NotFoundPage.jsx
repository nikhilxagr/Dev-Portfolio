import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Compass, Home, RefreshCw, Terminal } from "lucide-react";
import Button from "@/components/ui/Button";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";

const NotFoundPage = () => {
  const [countdown, setCountdown] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isPaused) return undefined;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, isPaused]);

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-16 sm:py-24">
      <SeoHead
        title="404 — Page Not Found"
        description="The requested page could not be found on Nikhil Agrahari's Portfolio."
        pathname="/404"
        robots="noindex, follow"
      />

      {/* Ambient background glowing circles */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px] dark:bg-emerald-400/15" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px] dark:bg-cyan-400/12" />

      <FadeInUp className="relative z-10 w-full max-w-2xl">
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-2xl backdrop-blur-2xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_20px_60px_rgba(0,10,2,0.85)] sm:p-10 text-center">
          
          {/* Top Cyber Error Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-emerald-600 dark:border-emerald-400/30 dark:text-emerald-300">
            <AlertTriangle size={14} className="animate-pulse text-amber-500" />
            <span>ERR_404 // ROUTE_NOT_FOUND</span>
          </div>

          {/* Glowing 404 Visual Display */}
          <div className="relative my-6">
            <h1 className="font-display text-7xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-9xl">
              <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(52,211,153,0.5)]">
                404
              </span>
            </h1>
            <p className="mt-2 text-base font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-200 sm:text-lg">
              Lost in Cyberspace?
            </p>
          </div>

          <p className="mx-auto max-w-md text-xs leading-relaxed text-slate-600 dark:text-slate-300/90 sm:text-sm">
            The page or practical route you requested does not exist or has been relocated to another sector.
          </p>

          {/* Interactive Terminal Auto-Redirect Countdown Bar */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left dark:border-emerald-500/25 dark:bg-[#020803]/80">
            <div className="flex items-center justify-between font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <span className="flex items-center gap-1.5">
                <Terminal size={13} />
                AUTO_ROUTING_DIAGNOSTIC
              </span>
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] text-slate-500 hover:bg-slate-200 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white transition"
              >
                <RefreshCw size={10} className={isPaused ? "" : "animate-spin"} />
                {isPaused ? "Resume Redirect" : "Pause Timer"}
              </button>
            </div>

            {/* Countdown Progress Bar */}
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-emerald-950">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                  initial={{ width: "100%" }}
                  animate={{ width: isPaused ? `${(countdown / 5) * 100}%` : `${(countdown / 5) * 100}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>
              <span className="font-mono text-xs font-black text-slate-800 dark:text-emerald-300">
                {countdown}s
              </span>
            </div>

            <p className="mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {isPaused
                ? "Auto-redirect paused. Select a destination below or click Resume."
                : `Redirecting to homepage automatically in ${countdown} second${countdown === 1 ? "" : "s"}...`}
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              to="/"
              className="w-full sm:w-auto justify-center border border-emerald-500/40 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black hover:from-emerald-400 hover:to-lime-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]"
            >
              <Home size={15} />
              Return to Home Now
            </Button>
            <Link
              to="/projects"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-800 hover:bg-slate-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20 transition-all duration-200"
            >
              <Compass size={15} />
              Explore Projects
            </Link>
          </div>
        </div>
      </FadeInUp>
    </section>
  );
};

export default NotFoundPage;
