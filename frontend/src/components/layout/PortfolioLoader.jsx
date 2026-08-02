import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Portfolio Loader Component
 * 
 * Animation Sequence:
 * 1. "NIK" rises & slides in from left, "HIL" rises & slides in from right (0.8s).
 * 2. Merges in center to form complete "NIKHIL" with glow burst & tagline (0.6s hold).
 * 3. Slower, silky-smooth glide & scale directly to the Navbar logo position ("NIKHIL") over 1.3s on mobile & desktop.
 */
const PortfolioLoader = ({ onComplete }) => {
  const prefersReducedMotion = useReducedMotion();
  
  // Phase 0: Entrance (NIK left, HIL right)
  // Phase 1: Joined in center ("NIKHIL" complete + glow + tagline hold)
  // Phase 2: Slower graceful flight to Navbar logo position + curtain fade
  const [phase, setPhase] = useState(0);
  const [targetPos, setTargetPos] = useState({ x: 0, y: -250, scale: 0.36 });

  useEffect(() => {
    const updateTargetPosition = () => {
      const el = document.getElementById("navbar-logo-text");
      if (el) {
        const rect = el.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const targetCenterX = rect.left + rect.width / 2;
        const targetCenterY = rect.top + rect.height / 2;

        setTargetPos({
          x: targetCenterX - centerX,
          y: targetCenterY - centerY,
          // Calculate scale based on initial loader text height vs navbar text height
          scale: rect.height ? Math.min(rect.height / 56, 0.45) : 0.36,
        });
      } else {
        // Fallback positioning if element rect isn't measured yet
        const isDesktop = window.innerWidth >= 1280;
        setTargetPos({
          x: isDesktop ? -(window.innerWidth / 2 - 120) : 0,
          y: -(window.innerHeight / 2 - 32),
          scale: 0.36,
        });
      }
    };

    updateTargetPosition();
    // Re-measure after small delay to ensure full layout render
    const raf = requestAnimationFrame(updateTargetPosition);
    window.addEventListener("resize", updateTargetPosition);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateTargetPosition);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 500);
      return () => clearTimeout(timer);
    }

    // Timeline control:
    // 0ms -> 800ms: NIK & HIL rise & merge
    // 800ms -> 1400ms: Complete NIKHIL glow hold
    // 1400ms -> 2700ms: Slower, graceful glide to Navbar logo (1.3s duration)
    // 2750ms: Complete
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => onComplete?.(), 2750);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050d14] text-white"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="font-outfit text-4xl font-black tracking-[0.16em] uppercase bg-gradient-to-r from-teal-300 via-emerald-400 to-lime-400 bg-clip-text text-transparent">
          NIKHIL
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 2 ? 0 : 1 }}
      transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1], delay: phase === 2 ? 0.15 : 0 }}
      role="status"
      aria-label="Loading portfolio"
    >
      {/* Background Dark Curtain Overlay */}
      <motion.div
        className="absolute inset-0 bg-[#050d14]"
        animate={{ opacity: phase === 2 ? 0 : 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Subtle Tech Grid lines */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(52,211,153,0.15),transparent_65%)]" />
      </motion.div>

      {/* Center Animated Stage */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        
        {/* Combined Brand Name Wrapper */}
        <motion.div
          className="flex items-center justify-center"
          animate={
            phase === 2
              ? {
                  x: targetPos.x,
                  y: targetPos.y,
                  scale: targetPos.scale,
                }
              : phase === 1
              ? { scale: [1, 1.06, 1], x: 0, y: 0 }
              : { scale: 1, x: 0, y: 0 }
          }
          transition={{
            duration: phase === 2 ? 1.3 : 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* NIK — Rising & Sliding from Left */}
          <motion.span
            className="font-outfit text-5xl sm:text-7xl md:text-8xl font-black tracking-[0.16em] uppercase bg-gradient-to-r from-teal-300 via-emerald-400 to-lime-400 bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(52,211,153,0.75)] inline-block"
            initial={{ x: "-45vw", y: 45, opacity: 0, filter: "blur(10px)" }}
            animate={{ x: 0, y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            NIK
          </motion.span>

          {/* HIL — Rising & Sliding from Right */}
          <motion.span
            className="font-outfit text-5xl sm:text-7xl md:text-8xl font-black tracking-[0.16em] uppercase bg-gradient-to-r from-teal-300 via-emerald-400 to-lime-400 bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(52,211,153,0.75)] inline-block"
            initial={{ x: "45vw", y: 45, opacity: 0, filter: "blur(10px)" }}
            animate={{ x: 0, y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            HIL
          </motion.span>
        </motion.div>

        {/* Minimal Subtitle / Tagline */}
        <motion.div
          className="mt-4 flex items-center gap-3 font-mono text-[10px] sm:text-xs tracking-[0.32em] text-emerald-400/90 uppercase font-semibold"
          initial={{ opacity: 0, y: 12 }}
          animate={{
            opacity: phase === 1 ? 1 : 0,
            y: phase === 1 ? 0 : phase === 2 ? -15 : 12,
          }}
          transition={{ duration: phase === 2 ? 0.4 : 0.35, ease: "easeOut" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>FULL STACK // CYBERSECURITY ENGINEER</span>
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
        </motion.div>
      </div>

      {/* Subtle Corner Status Watermark */}
      <motion.div
        className="absolute bottom-6 right-6 font-mono text-[10px] tracking-[0.25em] text-slate-500/70 uppercase"
        animate={{ opacity: phase === 2 ? 0 : 0.7 }}
        transition={{ duration: 0.5 }}
      >
        NIKHIL // 2026
      </motion.div>
    </motion.div>
  );
};

export default PortfolioLoader;
