import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Compass, Home, RefreshCw, Terminal } from "lucide-react";
import Button from "@/components/ui/Button";
import SeoHead from "@/components/seo/SeoHead";

const MotionDiv = motion.div;

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
    <section className="relative flex min-h-[78vh] items-center justify-center px-4 py-12 sm:py-16">
      <SeoHead
        title="404 - Page Not Found"
        description="The requested page could not be found on Nikhil Agrahari's Portfolio."
        pathname="/404"
        robots="noindex, follow"
      />

      <MotionDiv
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-2xl"
      >
        <div className="rounded-2xl border border-black/[0.08] bg-white p-6 text-center dark:border-white/[0.08] dark:bg-[#11141c] sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-3.5 py-1 font-mono text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
            <AlertTriangle size={14} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
            <span>Error 404 · Route not found</span>
          </div>

          <div className="my-6">
            <h1 className="font-display text-6xl font-semibold tracking-tight tabular-nums text-emerald-600 dark:text-emerald-400 sm:text-8xl">
              404
            </h1>
            <p className="mt-2 text-lg font-semibold text-ink-950 dark:text-ink-50">
              Page could not be found
            </p>
          </div>

          <p className="mx-auto max-w-md text-sm leading-relaxed text-ink-600 dark:text-ink-300">
            The route you requested does not exist or has moved. You can return home or continue exploring projects.
          </p>

          <div className="mt-8 rounded-xl border border-black/[0.08] bg-[#f8fafc] p-4 text-left dark:border-white/[0.08] dark:bg-[#0c0e14]">
            <div className="flex items-center justify-between font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <span className="flex items-center gap-1.5">
                <Terminal size={13} strokeWidth={1.5} />
                Auto-redirect timer
              </span>
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium text-ink-600 transition-colors hover:bg-black/[0.04] hover:text-ink-950 dark:text-ink-400 dark:hover:bg-white/[0.06] dark:hover:text-ink-100"
              >
                <RefreshCw size={11} strokeWidth={1.5} />
                {isPaused ? "Resume redirect" : "Pause timer"}
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-black/[0.08] dark:bg-white/[0.08]">
                <MotionDiv
                  className="h-full bg-emerald-600 dark:bg-emerald-500"
                  initial={{ width: "100%" }}
                  animate={{ width: `${(countdown / 5) * 100}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>
              <span className="font-mono text-xs font-semibold tabular-nums text-ink-950 dark:text-emerald-400">
                {countdown}s
              </span>
            </div>

            <p className="mt-2 text-xs text-ink-600 dark:text-ink-400">
              {isPaused
                ? "Auto-redirect paused. Pick a route below or resume."
                : `Redirecting to the homepage in ${countdown} second${countdown === 1 ? "" : "s"}...`}
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button to="/" variant="primary" className="w-full justify-center sm:w-auto">
              <Home size={15} strokeWidth={1.5} />
              Return to Home
            </Button>
            <Link
              to="/projects"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-black/[0.1] bg-[#f8fafc] px-5 py-2.5 text-xs font-medium text-ink-800 transition-colors hover:border-emerald-600/35 hover:text-ink-950 dark:border-white/[0.1] dark:bg-[#0c0e14] dark:text-ink-200 dark:hover:border-emerald-500/35 sm:w-auto"
            >
              <Compass size={15} strokeWidth={1.5} />
              Explore Projects
            </Link>
          </div>
        </div>
      </MotionDiv>
    </section>
  );
};

export default NotFoundPage;
