import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SITE_PROFILE } from "@/constants/siteData";

const MotionDiv = motion.div;

// Two Core Pillars (Removed UI/UX as requested)
const PILLARS = [
  {
    id: "fullstack",
    number: "01",
    role: "FULL STACK",
    discipline: "DEVELOPER",
    code: "REACT // NODE // MERN",
    color: "#38bdf8",
    glow: "rgba(56, 189, 248, 0.4)",
    borderColor: "rgba(56, 189, 248, 0.5)",
  },
  {
    id: "security",
    number: "02",
    role: "CYBERSECURITY",
    discipline: "ENGINEER",
    code: "APPSEC // OWASP // DEFENSE",
    color: "#22c55e",
    glow: "rgba(34, 197, 94, 0.4)",
    borderColor: "rgba(34, 197, 94, 0.5)",
  },
];

const DURATION_MS = 1000;
const REDUCED_DURATION_MS = 400;

const PortfolioLoader = ({ onComplete }) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const totalDuration = prefersReducedMotion ? REDUCED_DURATION_MS : DURATION_MS;
    const stepInterval = totalDuration / 2.5;

    const timer1 = setTimeout(() => setActiveStep(1), stepInterval);
    const timer2 = setTimeout(() => setActiveStep(2), stepInterval * 1.8);

    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, totalDuration);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(completeTimer);
    };
  }, [onComplete, prefersReducedMotion]);

  const currentPillar = PILLARS[Math.min(activeStep, 1)];

  return (
    <MotionDiv
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#03070d] text-white selection:bg-cyan-500 selection:text-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      role="status"
      aria-label="Loading portfolio"
    >
      {/* Subtle Background Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.06),transparent_60%)]" />

      {/* Top Bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 sm:top-8 sm:left-10 sm:right-10">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>SYSTEM // ONLINE</span>
        </div>
        <div className="hidden sm:block text-slate-600">
          PORTFOLIO CLI V2.6
        </div>
        <div>
          LUCKNOW, IN 🇮🇳
        </div>
      </div>

      {/* Main Center Container */}
      <div className="relative flex w-full max-w-md flex-col items-center justify-center px-6">
        
        {/* Diamond Frame */}
        <div className="relative flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
          <MotionDiv
            className="absolute inset-0 rounded-2xl border transition-colors duration-200"
            style={{
              borderColor: currentPillar.borderColor,
              boxShadow: `0 0 25px ${currentPillar.glow}`,
            }}
            animate={{
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              rotate: { duration: 8, ease: "linear", repeat: Infinity },
            }}
          />

          {/* Corner accents */}
          <div className="absolute -top-1.5 -left-1.5 h-3.5 w-3.5 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 border-t-2 border-r-2 border-emerald-400" />
          <div className="absolute -bottom-1.5 -left-1.5 h-3.5 w-3.5 border-b-2 border-l-2 border-emerald-400" />
          <div className="absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 border-b-2 border-r-2 border-cyan-400" />

          {/* Moniker */}
          <AnimatePresence mode="wait">
            <MotionDiv
              key={activeStep < 2 ? activeStep : "final"}
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.18 }}
            >
              {activeStep < 2 ? (
                <>
                  <span
                    className="font-mono text-2xl font-black tracking-wider sm:text-3xl"
                    style={{ color: currentPillar.color }}
                  >
                    {currentPillar.number}
                  </span>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    {currentPillar.discipline}
                  </span>
                </>
              ) : (
                <span className="font-display text-2xl font-black tracking-[0.18em] text-white sm:text-3xl drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]">
                  NA
                </span>
              )}
            </MotionDiv>
          </AnimatePresence>
        </div>

        {/* Dynamic Label Reveal */}
        <div className="mt-6 text-center min-h-[70px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {activeStep < 2 ? (
              <MotionDiv
                key={currentPillar.id}
                className="flex flex-col items-center gap-1"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: currentPillar.color }}
                  />
                  <h2
                    className="font-display text-lg font-black uppercase tracking-[0.18em] sm:text-xl"
                    style={{ color: currentPillar.color }}
                  >
                    {currentPillar.role}
                  </h2>
                </div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  {currentPillar.code}
                </p>
              </MotionDiv>
            ) : (
              <MotionDiv
                key="signature"
                className="flex flex-col items-center gap-1"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <h2 className="font-display text-xl font-black uppercase tracking-[0.18em] text-white sm:text-2xl">
                  {SITE_PROFILE.fullName}
                </h2>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-400">
                  FULL STACK // CYBERSECURITY ENGINEER
                </p>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>

        {/* Node Indicators */}
        <div className="mt-4 flex items-center gap-2.5">
          {PILLARS.map((pillar, index) => {
            const isActive = activeStep === index || activeStep === 2;
            const isCurrent = activeStep === index;

            return (
              <div
                key={pillar.id}
                className="h-1.5 rounded-full transition-all duration-200"
                style={{
                  width: isCurrent ? "24px" : "8px",
                  backgroundColor: isActive ? pillar.color : "rgba(100, 116, 139, 0.3)",
                  boxShadow: isCurrent ? `0 0 10px ${pillar.glow}` : "none",
                }}
              />
            );
          })}
        </div>

      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-slate-600 sm:bottom-8 sm:left-10 sm:right-10">
        <div>
          ENGINEERING SECURE DIGITAL EXPERIENCES
        </div>
        <div className="hidden sm:block">
          PORTFOLIO 2026
        </div>
      </div>
    </MotionDiv>
  );
};

export default PortfolioLoader;
