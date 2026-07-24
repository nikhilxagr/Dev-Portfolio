import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SITE_PROFILE } from "@/constants/siteData";

const MotionDiv = motion.div;

// Three Core Pillar Identities
const PILLARS = [
  {
    id: "fullstack",
    number: "01",
    role: "FULL STACK",
    discipline: "ARCHITECT",
    code: "NODE // REACT // CLOUD",
    color: "#38bdf8", // Sky Blue
    glow: "rgba(56, 189, 248, 0.4)",
    borderColor: "rgba(56, 189, 248, 0.5)",
  },
  {
    id: "security",
    number: "02",
    role: "CYBERSECURITY",
    discipline: "DEFENDER",
    code: "ZERO TRUST // APPSEC",
    color: "#22c55e", // Emerald Green
    glow: "rgba(34, 197, 94, 0.4)",
    borderColor: "rgba(34, 197, 94, 0.5)",
  },
  {
    id: "uiux",
    number: "03",
    role: "UI / UX",
    discipline: "DESIGNER",
    code: "DESIGN SYSTEMS // UX",
    color: "#a855f7", // Purple/Violet
    glow: "rgba(168, 85, 247, 0.4)",
    borderColor: "rgba(168, 85, 247, 0.5)",
  },
];

const DURATION_MS = 2200;
const REDUCED_DURATION_MS = 800;

const PortfolioLoader = ({ onComplete }) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0); // 0, 1, 2 for pillars, 3 for convergence
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const totalDuration = prefersReducedMotion ? REDUCED_DURATION_MS : DURATION_MS;
    const stepInterval = totalDuration / 3.4;

    const timer1 = setTimeout(() => setActiveStep(1), stepInterval);
    const timer2 = setTimeout(() => setActiveStep(2), stepInterval * 2);
    const timer3 = setTimeout(() => setActiveStep(3), stepInterval * 2.8);

    const completeTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onComplete?.();
      }, 400);
    }, totalDuration);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(completeTimer);
    };
  }, [onComplete, prefersReducedMotion]);

  const currentPillar = PILLARS[Math.min(activeStep, 2)];

  return (
    <MotionDiv
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#03070d] text-white selection:bg-cyan-500 selection:text-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      role="status"
      aria-label="Initializing portfolio environment"
    >
      {/* Background Cybernetic Optics & Mesh Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.06),transparent_60%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top Precision Coordinates Header */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 sm:top-10 sm:left-10 sm:right-10">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>SYSTEM // ONLINE</span>
        </div>
        <div className="hidden sm:block text-slate-600">
          SECURE ENVIRONMENT V2.6
        </div>
        <div>
          LUCKNOW, IN // 26.8467° N
        </div>
      </div>

      {/* Main Center Cinematic Aperture Container */}
      <div className="relative flex w-full max-w-lg flex-col items-center justify-center px-6">
        
        {/* Futuristic Optics Diamond Frame */}
        <div className="relative flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40">
          
          {/* Outer Rotating Laser Diamond Ring */}
          <MotionDiv
            className="absolute inset-0 rounded-2xl border"
            style={{
              borderColor: currentPillar.borderColor,
              boxShadow: `0 0 30px ${currentPillar.glow}`,
            }}
            animate={{
              rotate: [0, 90, 180, 270, 360],
              scale: [0.95, 1.02, 0.95],
            }}
            transition={{
              rotate: { duration: 12, ease: "linear", repeat: Infinity },
              scale: { duration: 2, ease: "easeInOut", repeat: Infinity },
            }}
          />

          {/* Inner Counter-Rotating Reticle */}
          <MotionDiv
            className="absolute inset-3 rounded-xl border border-dashed border-white/20"
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 16, ease: "linear", repeat: Infinity }}
          />

          {/* Laser Corner Crosshairs */}
          <div className="absolute -top-2 -left-2 h-4 w-4 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute -top-2 -right-2 h-4 w-4 border-t-2 border-r-2 border-emerald-400" />
          <div className="absolute -bottom-2 -left-2 h-4 w-4 border-b-2 border-l-2 border-purple-400" />
          <div className="absolute -bottom-2 -right-2 h-4 w-4 border-b-2 border-r-2 border-cyan-400" />

          {/* Center Brand Moniker / Initial Prism */}
          <AnimatePresence mode="wait">
            <MotionDiv
              key={activeStep < 3 ? activeStep : "final"}
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.15 }}
              transition={{ duration: 0.25 }}
            >
              {activeStep < 3 ? (
                <>
                  <span
                    className="font-mono text-2xl font-black tracking-wider sm:text-3xl"
                    style={{ color: currentPillar.color }}
                  >
                    {currentPillar.number}
                  </span>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    {currentPillar.discipline}
                  </span>
                </>
              ) : (
                <span className="font-display text-2xl font-black tracking-[0.2em] text-white sm:text-3xl drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]">
                  NA
                </span>
              )}
            </MotionDiv>
          </AnimatePresence>
        </div>

        {/* Dynamic Identity Label Reveal */}
        <div className="mt-8 text-center min-h-[90px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {activeStep < 3 ? (
              <MotionDiv
                key={currentPillar.id}
                className="flex flex-col items-center gap-1.5"
                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: currentPillar.color }}
                  />
                  <h2
                    className="font-display text-xl font-black uppercase tracking-[0.2em] sm:text-2xl"
                    style={{ color: currentPillar.color }}
                  >
                    {currentPillar.role}
                  </h2>
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-400">
                  {currentPillar.code}
                </p>
              </MotionDiv>
            ) : (
              <MotionDiv
                key="signature"
                className="flex flex-col items-center gap-1.5"
                initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <h2 className="font-display text-2xl font-black uppercase tracking-[0.2em] text-white sm:text-3xl">
                  {SITE_PROFILE.fullName}
                </h2>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-400">
                  FULL STACK // CYBERSECURITY // UI/UX
                </p>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>

        {/* Triple Node Identity Indicator */}
        <div className="mt-6 flex items-center gap-3">
          {PILLARS.map((pillar, index) => {
            const isActive = activeStep === index || activeStep === 3;
            const isCurrent = activeStep === index;

            return (
              <div
                key={pillar.id}
                className="flex items-center gap-2 transition-all duration-300"
              >
                <div
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: isCurrent ? "28px" : "10px",
                    backgroundColor: isActive ? pillar.color : "rgba(100, 116, 139, 0.3)",
                    boxShadow: isCurrent ? `0 0 12px ${pillar.glow}` : "none",
                  }}
                />
              </div>
            );
          })}
        </div>

      </div>

      {/* Bottom Architectural Signature Footer */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-slate-600 sm:bottom-10 sm:left-10 sm:right-10">
        <div>
          ENGINEERING SECURE DIGITAL EXPERIENCES
        </div>
        <div className="hidden sm:block">
          PORTFOLIO 2026+
        </div>
      </div>
    </MotionDiv>
  );
};

export default PortfolioLoader;
