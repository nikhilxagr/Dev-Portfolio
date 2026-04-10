import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const MotionDiv = motion.div;
const LOADER_DURATION_MS = 1800;
const REDUCED_MOTION_DURATION_MS = 700;
const FINISH_DELAY_MS = 280;
const STATUS_STAGES = [
  { threshold: 0, label: "Loading portfolio" },
  { threshold: 45, label: "Preparing content" },
  { threshold: 80, label: "Almost ready" },
  { threshold: 100, label: "Ready" },
];

const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);

const PortfolioLoader = ({ onComplete }) => {
  const prefersReducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const completionTriggeredRef = useRef(false);

  useEffect(() => {
    const duration = prefersReducedMotion
      ? REDUCED_MOTION_DURATION_MS
      : LOADER_DURATION_MS;
    const stepMs = prefersReducedMotion ? 80 : 32;
    const startTime = window.performance.now();
    let intervalId = null;

    const updateProgress = () => {
      const currentTime = window.performance.now();
      const elapsed = currentTime - startTime;
      const normalized = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(normalized) * 100;
      setProgress(easedProgress);

      if (normalized >= 1) {
        window.clearInterval(intervalId);
      }
    };

    updateProgress();
    intervalId = window.setInterval(updateProgress, stepMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [prefersReducedMotion]);

  const roundedProgress = Math.min(100, Math.round(progress));
  const currentStatus = useMemo(() => {
    for (let index = STATUS_STAGES.length - 1; index >= 0; index -= 1) {
      if (roundedProgress >= STATUS_STAGES[index].threshold) {
        return STATUS_STAGES[index].label;
      }
    }

    return STATUS_STAGES[0].label;
  }, [roundedProgress]);

  useEffect(() => {
    if (roundedProgress < 100 || completionTriggeredRef.current) {
      return;
    }

    completionTriggeredRef.current = true;

    const finishTimeoutId = window.setTimeout(() => {
      onComplete?.();
    }, FINISH_DELAY_MS);

    return () => {
      window.clearTimeout(finishTimeoutId);
    };
  }, [onComplete, roundedProgress]);

  return (
    <MotionDiv
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050b14]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0.12 : 0.22,
        ease: "easeOut",
      }}
      aria-live="polite"
      role="status"
      aria-label="Loading portfolio"
    >
      <MotionDiv
        className="relative flex w-[min(92vw,420px)] flex-col gap-5 rounded-2xl border border-cyan-300/20 bg-slate-950/88 px-6 py-7 text-center shadow-[0_14px_38px_rgba(2,8,20,0.46)]"
        initial={{ y: prefersReducedMotion ? 0 : 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: prefersReducedMotion ? 0.1 : 0.2,
          ease: "easeOut",
        }}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/45 bg-cyan-300/10">
          <div className="h-2.5 w-2.5 rounded-full bg-cyan-200" />
        </div>

        <div>
          <p className="font-display text-lg uppercase tracking-[0.16em] text-cyan-100">
            Nikhil Agrahari
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-emerald-200">
            Full Stack and Security Portfolio
          </p>
        </div>

        <div className="w-full">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-slate-400">
            <span>{currentStatus}</span>
            <span className="font-display text-sm tracking-[0.16em] text-cyan-100">
              {roundedProgress}%
            </span>
          </div>

          <div
            className="relative mt-2 h-2 overflow-hidden rounded-full border border-cyan-300/25 bg-slate-900/85"
            role="progressbar"
            aria-label="Portfolio loading progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={roundedProgress}
          >
            <MotionDiv
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-cyan-200"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{
                duration: prefersReducedMotion ? 0.08 : 0.22,
                ease: "linear",
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.13em] text-slate-500">
            {STATUS_STAGES.map((stage) => (
              <span
                key={stage.threshold}
                className={
                  roundedProgress >= stage.threshold
                    ? "text-emerald-200"
                    : "text-slate-600"
                }
              >
                {stage.threshold}
              </span>
            ))}
          </div>
        </div>
      </MotionDiv>
    </MotionDiv>
  );
};

export default PortfolioLoader;
