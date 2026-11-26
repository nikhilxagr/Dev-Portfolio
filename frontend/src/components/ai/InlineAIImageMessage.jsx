import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  Copy,
  Download,
  ExternalLink,
  Image as ImageIcon,
  LogIn,
  Maximize2,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useUserAuth } from "@/context/UserAuthContext";

const MotionDiv = motion.div;

const GENERATING_STEPS = [
  "Connecting to Cloudflare Workers AI...",
  "Initializing FLUX.2-dev model...",
  "Running latent diffusion steps...",
  "Synthesizing 1024x1024 output...",
  "Refining lighting and detail...",
  "Preparing image preview...",
];

const InlineAIImageMessage = ({ image, onRegenerate }) => {
  const { isDark } = useTheme();
  const { openSignInModal } = useUserAuth();
  const [stepIndex, setStepIndex] = useState(0);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const isGenerating = image?.status === "generating";
  const isCompleted = Boolean(image?.status === "completed" && image?.dataUrl);
  const isError = image?.status === "error";
  const isRequireAuth = Boolean(image?.requireAuth);

  useEffect(() => {
    if (!isGenerating) return undefined;
    const interval = window.setInterval(() => {
      setStepIndex((prev) => (prev + 1) % GENERATING_STEPS.length);
    }, 2200);
    return () => window.clearInterval(interval);
  }, [isGenerating]);

  // Lock background scroll and bind Escape while full-view preview is open
  useEffect(() => {
    if (!isPreviewOpen) return undefined;

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    if (window.__activeLenis && typeof window.__activeLenis.stop === "function") {
      window.__activeLenis.stop();
    }

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsPreviewOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      if (window.__activeLenis && typeof window.__activeLenis.start === "function") {
        window.__activeLenis.start();
      }
    };
  }, [isPreviewOpen]);

  const handleDownload = (e) => {
    if (e) e.stopPropagation();
    if (!image?.dataUrl) return;
    try {
      const link = document.createElement("a");
      link.href = image.dataUrl;
      const modelSlug = (image.model?.key || "ai").toLowerCase();
      const safeSlug = (image.prompt || "image")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .slice(0, 32);
      link.download = `nikhil-ai-${modelSlug}-${safeSlug}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open(image.dataUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopyPrompt = async (e) => {
    if (e) e.stopPropagation();
    if (!image?.prompt) return;
    try {
      await navigator.clipboard.writeText(image.prompt);
      setCopiedPrompt(true);
      window.setTimeout(() => setCopiedPrompt(false), 1800);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleOpenNewTab = (e) => {
    if (e) e.stopPropagation();
    if (!image?.dataUrl) return;
    window.open(image.dataUrl, "_blank", "noopener,noreferrer");
  };

  const previewModal =
    typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence>
            {isPreviewOpen && isCompleted && (
              <div
                className="fixed inset-0 z-[9999] flex flex-col bg-black/90 backdrop-blur-sm"
                data-lenis-prevent
                onWheel={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Full view generated image preview"
              >
                {/* Top Toolbar */}
                <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.08] bg-[#090a0f]/95 px-4 py-3 sm:px-6">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#eef0f5]">
                      {image.prompt || "Generated image preview"}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-[#7a8296] tabular-nums">
                      {image.model?.name || "FLUX.2-dev"} · 1024×1024
                      {image.durationMs ? ` · ${(image.durationMs / 1000).toFixed(1)}s` : ""}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {image.prompt && (
                      <button
                        type="button"
                        onClick={handleCopyPrompt}
                        title="Copy prompt"
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.1] bg-[#11141c] px-3 text-xs font-medium text-[#d1d5df] transition-colors hover:border-white/[0.2] hover:bg-[#1a1e28] hover:text-white"
                      >
                        {copiedPrompt ? (
                          <Check size={14} className="text-emerald-400" />
                        ) : (
                          <Copy size={14} />
                        )}
                        <span className="hidden sm:inline">
                          {copiedPrompt ? "Copied" : "Copy prompt"}
                        </span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleOpenNewTab}
                      title="Open in new tab"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.1] bg-[#11141c] px-3 text-xs font-medium text-[#d1d5df] transition-colors hover:border-white/[0.2] hover:bg-[#1a1e28] hover:text-white"
                    >
                      <ExternalLink size={14} />
                      <span className="hidden sm:inline">Open tab</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownload}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 text-xs font-medium text-slate-950 transition-colors hover:bg-emerald-400"
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(false)}
                      aria-label="Close image preview"
                      title="Close (Esc)"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-[#11141c] text-[#a3a9b8] transition-colors hover:border-white/[0.2] hover:bg-[#1a1e28] hover:text-white"
                    >
                      <X size={16} strokeWidth={1.6} />
                    </button>
                  </div>
                </div>

                {/* Click backdrop around image to close */}
                <div
                  className="flex min-h-0 flex-1 items-center justify-center p-4 sm:p-8"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  <MotionDiv
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative flex max-h-full max-w-full items-center justify-center overflow-hidden rounded-xl border border-white/[0.1] bg-[#0c0e14] shadow-2xl"
                  >
                    <img
                      src={image.dataUrl}
                      alt={image.prompt || "Full preview of generated AI image"}
                      className="max-h-[82vh] max-w-[92vw] w-auto h-auto object-contain select-none"
                    />
                  </MotionDiv>
                </div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="my-2 w-full max-w-xl">
        <AnimatePresence mode="wait">
          {/* 1. Generating Progress Card */}
          {isGenerating && (
            <MotionDiv
              key="generating-canvas"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className={`relative flex min-h-[280px] sm:min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-2xl border p-6 text-center sm:p-8 ${
                isDark
                  ? "border-white/[0.08] bg-[#11141c] text-[#eef0f5]"
                  : "border-black/[0.08] bg-[#f8fafc] text-slate-900"
              }`}
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border ${
                  isDark
                    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
                    : "border-emerald-600/25 bg-emerald-50 text-emerald-700"
                }`}
              >
                <ImageIcon size={22} strokeWidth={1.6} />
              </div>

              <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                Cloudflare · {image.model?.name || "FLUX.2-dev"}
              </p>

              <p className="mt-1.5 text-sm font-medium sm:text-base">
                {GENERATING_STEPS[stepIndex]}
              </p>

              {image?.prompt && (
                <p
                  className={`mt-1.5 max-w-sm line-clamp-2 text-xs ${
                    isDark ? "text-[#a3a9b8]" : "text-slate-600"
                  }`}
                >
                  &ldquo;{image.prompt}&rdquo;
                </p>
              )}

              <div
                className={`mt-6 h-1.5 w-48 sm:w-64 overflow-hidden rounded-full ${
                  isDark ? "bg-white/[0.08]" : "bg-black/[0.08]"
                }`}
              >
                <MotionDiv
                  className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                  style={{ width: "50%" }}
                />
              </div>
            </MotionDiv>
          )}

          {/* 2. Completed Generated Image */}
          {isCompleted && (
            <MotionDiv
              key="completed-image"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden rounded-2xl border transition-colors ${
                isDark
                  ? "border-white/[0.1] bg-[#11141c]"
                  : "border-black/[0.08] bg-white shadow-sm"
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Clickable Image Container -> Opens Full Preview */}
              <div className="relative aspect-square max-h-[460px] w-full overflow-hidden bg-[#0c0e14]">
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  aria-label="Open full-view image preview"
                  className="block h-full w-full cursor-zoom-in text-left focus:outline-none"
                >
                  <img
                    src={image.dataUrl}
                    alt={image.prompt || "Generated AI image"}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="eager"
                  />
                </button>

                {/* Top Floating Toolbar */}
                <div
                  className={`absolute top-3 right-3 z-10 flex items-center gap-1 rounded-xl border border-white/[0.15] bg-[#090a0f]/80 p-1 backdrop-blur-md transition-opacity duration-150 ${
                    isHovered ? "opacity-100" : "opacity-90 sm:opacity-0"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(true)}
                    title="Full preview"
                    aria-label="Full preview"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/[0.15]"
                  >
                    <Maximize2 size={15} strokeWidth={1.6} />
                  </button>

                  <button
                    type="button"
                    onClick={handleDownload}
                    title="Download image"
                    aria-label="Download image"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/[0.15]"
                  >
                    <Download size={15} strokeWidth={1.6} />
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenNewTab}
                    title="Open in new tab"
                    aria-label="Open in new tab"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/[0.15]"
                  >
                    <ExternalLink size={15} strokeWidth={1.6} />
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    title="Copy prompt"
                    aria-label="Copy prompt"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/[0.15]"
                  >
                    {copiedPrompt ? (
                      <Check size={15} className="text-emerald-400" />
                    ) : (
                      <Copy size={15} strokeWidth={1.6} />
                    )}
                  </button>
                </div>
              </div>

              {/* Meta & Action Footer */}
              <div
                className={`flex flex-col gap-2.5 border-t p-3.5 sm:p-4 ${
                  isDark
                    ? "border-white/[0.08] bg-[#0c0e14]"
                    : "border-black/[0.08] bg-[#f8fafc]"
                }`}
              >
                {image.prompt && (
                  <p
                    className={`line-clamp-2 text-xs font-medium sm:text-sm select-text ${
                      isDark ? "text-[#eef0f5]" : "text-slate-900"
                    }`}
                  >
                    &ldquo;{image.prompt}&rdquo;
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-600/25 bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                      <span>{image.model?.name || "FLUX.2-dev"}</span>
                    </span>

                    <span
                      className={`rounded-md border px-2 py-0.5 tabular-nums ${
                        isDark
                          ? "border-white/[0.08] bg-[#11141c] text-[#a3a9b8]"
                          : "border-black/[0.08] bg-white text-slate-600"
                      }`}
                    >
                      1024×1024
                    </span>

                    {image.durationMs && (
                      <span
                        className={`rounded-md border px-2 py-0.5 tabular-nums ${
                          isDark
                            ? "border-white/[0.08] bg-[#11141c] text-[#a3a9b8]"
                            : "border-black/[0.08] bg-white text-slate-600"
                        }`}
                      >
                        {(image.durationMs / 1000).toFixed(1)}s
                      </span>
                    )}

                    {image.quota?.remaining !== undefined && (
                      <span
                        className={`rounded-md border px-2 py-0.5 tabular-nums ${
                          isDark
                            ? "border-white/[0.08] bg-[#11141c] text-[#a3a9b8]"
                            : "border-black/[0.08] bg-white text-slate-600"
                        }`}
                      >
                        {image.quota.remaining}/10 left
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(true)}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        isDark
                          ? "border-white/[0.1] bg-[#11141c] text-[#eef0f5] hover:bg-[#1a1e28]"
                          : "border-black/[0.1] bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Maximize2 size={13} strokeWidth={1.6} />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownload}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                    >
                      <Download size={13} strokeWidth={1.6} />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            </MotionDiv>
          )}

          {/* 3. Error / Sign-in Required State */}
          {isError && (
            <MotionDiv
              key="error-card"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex max-w-md flex-col gap-3 rounded-2xl border p-4 sm:p-5 ${
                isRequireAuth
                  ? isDark
                    ? "border-emerald-500/25 bg-[#11141c] text-[#eef0f5]"
                    : "border-emerald-600/25 bg-emerald-50/40 text-slate-900"
                  : isDark
                    ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
                    : "border-rose-500/30 bg-rose-50 text-rose-800"
              }`}
            >
              {isRequireAuth ? (
                <>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <Sparkles size={18} strokeWidth={1.6} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold">
                        Free guest image credits used
                      </h4>
                      <p
                        className={`mt-1 text-xs leading-relaxed ${
                          isDark ? "text-[#a3a9b8]" : "text-slate-600"
                        }`}
                      >
                        Sign in to unlock{" "}
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          10 free daily image generations
                        </span>{" "}
                        with FLUX.2-dev. Text chat stays unlimited without an account.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end border-t border-black/[0.08] pt-3 dark:border-white/[0.08]">
                    <button
                      type="button"
                      onClick={() =>
                        openSignInModal({
                          title: "Sign in to unlock 10 daily AI image credits",
                          message:
                            "Sign in or register for free to get 10 image generations every day with FLUX.2-dev.",
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                    >
                      <LogIn size={14} strokeWidth={1.6} />
                      <span>Sign in for 10 daily credits</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2.5">
                    <AlertCircle size={18} className="mt-0.5 shrink-0 text-rose-500" />
                    <div className="flex-1 text-xs sm:text-sm">
                      <p className="font-medium">Image generation failed</p>
                      <p className="mt-0.5 opacity-85">
                        {image?.error ||
                          "Cloudflare FLUX.2-dev encountered an error. Please try again."}
                      </p>
                    </div>
                  </div>

                  {onRegenerate && (
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={onRegenerate}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/35 px-3 py-1.5 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-500/10 dark:text-rose-200"
                      >
                        <RotateCcw size={12} />
                        <span>Retry</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>

      {previewModal}
    </>
  );
};

export default InlineAIImageMessage;
