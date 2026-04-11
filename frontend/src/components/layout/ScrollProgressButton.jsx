import { useEffect, useMemo, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLocation } from "react-router-dom";

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
        className="pointer-events-auto group relative h-14 w-14 overflow-hidden rounded-full border border-cyan-300/35 bg-slate-950/75 shadow-[0_16px_36px_-20px_rgba(34,211,238,0.9)] backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[2px] rounded-full"
          style={{
            background: `conic-gradient(rgba(96,165,250,0.98) ${progressAngle}deg, rgba(148,163,184,0.26) ${progressAngle}deg 360deg)`,
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[6px] rounded-full border border-cyan-300/20 bg-slate-900/90"
        />

        <span className="relative z-10 inline-flex h-full w-full items-center justify-center">
          <ArrowUp
            size={18}
            className="text-cyan-100 transition-transform duration-300 group-hover:-translate-y-0.5"
          />
        </span>
      </button>
    </div>
  );
};

export default ScrollProgressButton;
