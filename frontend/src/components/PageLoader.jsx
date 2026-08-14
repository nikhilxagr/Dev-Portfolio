import { useTheme } from "@/context/ThemeContext";

const PageLoader = () => {
  const { isDark } = useTheme();

  return (
    <div
      aria-label="Loading page content"
      aria-live="polite"
      className="flex min-h-[85vh] w-full flex-col items-center justify-center px-4"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Subtle glowing ring spinner */}
        <div className="relative flex h-10 w-10 items-center justify-center">
          <div
            className={`absolute inset-0 animate-spin rounded-full border-2 border-t-transparent ${
              isDark
                ? "border-emerald-400/80 border-t-transparent shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                : "border-emerald-600/80 border-t-transparent shadow-[0_0_15px_rgba(16,185,129,0.25)]"
            }`}
          />
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              isDark ? "bg-emerald-400 animate-pulse" : "bg-emerald-600 animate-pulse"
            }`}
          />
        </div>

        {/* Minimal status text */}
        <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider uppercase">
          <span className={isDark ? "text-slate-400" : "text-slate-500"}>
            Loading view
          </span>
          <span className="flex gap-0.5 text-emerald-500">
            <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
