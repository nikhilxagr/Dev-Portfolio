import { useEffect, useMemo, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

const VISIBILITY_SCROLL_OFFSET = 180;

const getScrollMetrics = () => {
  if (typeof window === "undefined") {
    return { scrollTop: 0, progress: 0, isVisible: false };
  }

  const doc = document.documentElement;
  const scrollTop = window.scrollY || doc.scrollTop || 0;
  const scrollableHeight = doc.scrollHeight - doc.clientHeight;
  const progress =
    scrollableHeight > 0
      ? Math.min(1, Math.max(0, scrollTop / scrollableHeight))
      : 0;

  return {
    scrollTop,
    progress,
    isVisible: scrollTop > VISIBILITY_SCROLL_OFFSET,
  };
};

const ScrollProgressButton = () => {
  const location = useLocation();
  const { isDark } = useTheme();
  const [{ progress, isVisible }, setScrollState] = useState(() => {
    const metrics = getScrollMetrics();
    return { progress: metrics.progress, isVisible: metrics.isVisible };
  });

  useEffect(() => {
    let ticking = false;
    const updateState = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const metrics = getScrollMetrics();
          setScrollState((prev) => {
            const nextProgress = Math.round(metrics.progress * 100) / 100;
            if (
              prev.isVisible === metrics.isVisible &&
              Math.abs(prev.progress - nextProgress) < 0.01
            ) {
              ticking = false;
              return prev;
            }
            ticking = false;
            return { progress: nextProgress, isVisible: metrics.isVisible };
          });
        });
        ticking = true;
      }
    };

    updateState();
    window.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const metrics = getScrollMetrics();
      setScrollState({
        progress: metrics.progress,
        isVisible: metrics.isVisible,
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [location.pathname]);

  const progressAngle = useMemo(() => Math.round(progress * 360), [progress]);
  const progressPercent = useMemo(() => Math.round(progress * 100), [progress]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ringGradient = isDark
    ? `conic-gradient(#34d399 ${progressAngle}deg, rgba(255,255,255,0.12) ${progressAngle}deg 360deg)`
    : `conic-gradient(#059669 ${progressAngle}deg, rgba(0,0,0,0.12) ${progressAngle}deg 360deg)`;

  return (
    <div
      className={`pointer-events-none fixed bottom-4 right-4 z-[99] transition-all duration-300 sm:bottom-6 sm:right-6 ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-6 opacity-0 scale-90"
      }`}
    >
      <button
        type="button"
        onClick={handleScrollToTop}
        aria-label={`Back to top. Page progress ${progressPercent}%`}
        className={`pointer-events-auto group relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center overflow-hidden rounded-full border backdrop-blur-md transition-all duration-300 active:scale-90 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 ${
          isDark
            ? "border-emerald-500/40 bg-[#050d14]/90 shadow-[0_6px_20px_rgba(52,211,153,0.35)] focus-visible:ring-emerald-400 text-emerald-400"
            : "border-emerald-600/40 bg-white/95 shadow-[0_6px_20px_rgba(16,185,129,0.25)] focus-visible:ring-emerald-600 text-emerald-700"
        }`}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0.5 rounded-full"
          style={{ background: ringGradient }}
        />
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-[3px] rounded-full border ${
            isDark
              ? "border-emerald-500/20 bg-[#030a05]"
              : "border-emerald-500/20 bg-white"
          }`}
        />

        <span className="relative z-10 flex items-center justify-center">
          <ArrowUp
            size={18}
            className={`transition-transform duration-300 group-hover:-translate-y-0.5 ${
              isDark ? "text-emerald-400" : "text-emerald-700 font-extrabold"
            }`}
          />
        </span>
      </button>
    </div>
  );
};

export default ScrollProgressButton;
