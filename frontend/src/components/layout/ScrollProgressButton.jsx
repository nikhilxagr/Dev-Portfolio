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
    const updateState = () => {
      const metrics = getScrollMetrics();
      setScrollState({
        progress: metrics.progress,
        isVisible: metrics.isVisible,
      });
    };

    updateState();
    window.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);

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
      className={`pointer-events-none fixed bottom-5 right-4 z-50 transition-all duration-300 sm:bottom-7 sm:right-6 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <button
        type="button"
        onClick={handleScrollToTop}
        aria-label={`Back to top. Page progress ${progressPercent}%`}
        className={`pointer-events-auto group relative h-13 w-13 sm:h-14 sm:w-14 overflow-hidden rounded-full border backdrop-blur transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 ${
          isDark
            ? "border-emerald-500/30 bg-[#050d14]/90 shadow-[0_8px_25px_rgba(52,211,153,0.3)] focus-visible:ring-emerald-400"
            : "border-emerald-500/40 bg-white/95 shadow-[0_8px_25px_rgba(16,185,129,0.25)] focus-visible:ring-emerald-600"
        }`}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[2px] rounded-full"
          style={{ background: ringGradient }}
        />
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-[5px] rounded-full border ${
            isDark
              ? "border-emerald-500/20 bg-[#030a05]"
              : "border-emerald-500/30 bg-slate-50"
          }`}
        />

        <span className="relative z-10 inline-flex h-full w-full items-center justify-center">
          <ArrowUp
            size={18}
            className={`transition-transform duration-300 group-hover:-translate-y-0.5 ${
              isDark ? "text-emerald-400" : "text-emerald-700 font-black"
            }`}
          />
        </span>
      </button>
    </div>
  );
};

export default ScrollProgressButton;
