import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  LogIn,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useUserAuth } from '@/context/UserAuthContext';

const MotionDiv = motion.div;

const GENERATING_STEPS = [
  'Connecting to Cloudflare Workers AI...',
  'Initializing FLUX.2-dev generative model...',
  'Executing 25 latent diffusion steps...',
  'Synthesizing 1024×1024 pixels...',
  'Enhancing details and color grading...',
  'Finalizing high-res image render...',
];

const InlineAIImageMessage = ({ image, onRegenerate }) => {
  const { isDark } = useTheme();
  const { openSignInModal } = useUserAuth();
  const [stepIndex, setStepIndex] = useState(0);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isGenerating = image?.status === 'generating';
  const isCompleted = image?.status === 'completed' && image?.dataUrl;
  const isError = image?.status === 'error';
  const isRequireAuth = Boolean(image?.requireAuth);

  // Cycle status messages every 2.2s during generation
  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % GENERATING_STEPS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleDownload = () => {
    if (!image?.dataUrl) return;
    try {
      const link = document.createElement('a');
      link.href = image.dataUrl;
      const modelSlug = (image.model?.key || 'ai').toLowerCase();
      const safeSlug = (image.prompt || 'image')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .slice(0, 32);
      link.download = `nikhil-ai-${modelSlug}-${safeSlug}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open(image.dataUrl, '_blank');
    }
  };

  const handleCopyPrompt = async () => {
    if (!image?.prompt) return;
    try {
      await navigator.clipboard.writeText(image.prompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleOpenNewTab = () => {
    if (!image?.dataUrl) return;
    window.open(image.dataUrl, '_blank');
  };

  return (
    <div className="w-full max-w-xl my-2">
      <AnimatePresence mode="wait">
        {/* ==========================================================
            1. GENERATING ANIMATION (GEMINI-STYLE GLOWING SHIMMER CANVAS)
            ========================================================== */}
        {isGenerating && (
          <MotionDiv
            key="generating-canvas"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className={`relative rounded-3xl p-0.5 overflow-hidden shadow-2xl transition-all ${
              isDark
                ? 'bg-gradient-to-r from-sky-500/30 via-purple-500/30 to-emerald-500/30'
                : 'bg-gradient-to-r from-sky-400/40 via-purple-400/40 to-emerald-400/40 shadow-lg'
            }`}
          >
            <div
              className={`relative rounded-[22px] overflow-hidden p-6 sm:p-8 flex flex-col items-center justify-center text-center min-h-[300px] sm:min-h-[340px] ${
                isDark ? 'bg-[#121212]' : 'bg-slate-50'
              }`}
            >
              {/* Shimmer sweep effect */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]"
                style={{
                  animation: 'shimmerSweep 2.2s infinite ease-in-out',
                }}
              />

              {/* Gemini-Style Glowing Multi-layered Star Aura */}
              <div className="relative mb-5 flex items-center justify-center">
                {/* Ambient glowing radial aura */}
                <div className="absolute h-28 w-28 rounded-full bg-gradient-to-tr from-sky-500/30 via-purple-500/25 to-emerald-500/30 blur-2xl animate-pulse" />

                {/* Rotating subtle orbital ring */}
                <div className="absolute h-20 w-20 rounded-full border border-sky-400/20 border-dashed animate-spin [animation-duration:10s]" />

                {/* Center glowing badge */}
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-[0_0_25px_rgba(56,189,248,0.5)]">
                  <Sparkles size={24} className="text-white animate-pulse" />
                </div>
              </div>

              {/* Step Status Text */}
              <div className="relative z-10 flex flex-col items-center gap-1.5 max-w-sm">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-ping" />
                  <span>Cloudflare · {image.model?.name || 'Image Studio'}</span>
                </div>

                <div
                  className={`text-sm sm:text-base font-semibold transition-all duration-300 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {GENERATING_STEPS[stepIndex]}
                </div>

                {image?.prompt && (
                  <p className="text-xs text-slate-400 line-clamp-2 italic px-2 mt-1">
                    “{image.prompt}”
                  </p>
                )}
              </div>

              {/* Animated progress bar */}
              <div className="relative z-10 w-48 sm:w-64 h-1.5 rounded-full bg-white/10 overflow-hidden mt-6">
                <MotionDiv
                  className="h-full bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 rounded-full"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    ease: 'easeInOut',
                  }}
                  style={{ width: '50%' }}
                />
              </div>
            </div>
          </MotionDiv>
        )}

        {/* ==========================================================
            2. COMPLETED IMAGE VIEW (INLINE IN CHAT)
            ========================================================== */}
        {isCompleted && (
          <MotionDiv
            key="completed-image"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`group relative rounded-3xl border overflow-hidden transition-all shadow-xl ${
              isDark
                ? 'border-white/10 bg-[#141414] shadow-[0_10px_40px_rgba(0,0,0,0.6)]'
                : 'border-slate-200 bg-white shadow-lg'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Image Preview Canvas */}
            <div className="relative aspect-square max-h-[460px] w-full overflow-hidden bg-black/40">
              <img
                src={image.dataUrl}
                alt={image.prompt || 'Generated by Cloudflare FLUX.2-dev'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                loading="eager"
              />

              {/* Top Floating Action Pill (visible on hover or always on touch devices) */}
              <div
                className={`absolute top-3 right-3 flex items-center gap-1.5 p-1 rounded-2xl backdrop-blur-md transition-opacity duration-200 ${
                  isHovered ? 'opacity-100' : 'opacity-90 sm:opacity-0'
                } bg-black/60 border border-white/15`}
              >
                {/* Download */}
                <button
                  type="button"
                  onClick={handleDownload}
                  title="Download full resolution JPEG"
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-white hover:bg-white/20 transition-all active:scale-95"
                >
                  <Download size={15} />
                </button>

                {/* Open in new tab */}
                <button
                  type="button"
                  onClick={handleOpenNewTab}
                  title="Open full image in new tab"
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-white hover:bg-white/20 transition-all active:scale-95"
                >
                  <ExternalLink size={15} />
                </button>

                {/* Copy Prompt */}
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  title="Copy prompt"
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-white hover:bg-white/20 transition-all active:scale-95"
                >
                  {copiedPrompt ? (
                    <Check size={15} className="text-emerald-400" />
                  ) : (
                    <Copy size={15} />
                  )}
                </button>
              </div>
            </div>

            {/* Bottom Meta & Action Bar */}
            <div
              className={`p-3.5 sm:p-4 flex flex-col gap-2.5 border-t ${
                isDark ? 'border-white/8 bg-[#181818]' : 'border-slate-100 bg-slate-50'
              }`}
            >
              {/* Prompt Description */}
              {image.prompt && (
                <div className="text-xs sm:text-sm font-medium line-clamp-2 select-text">
                  “{image.prompt}”
                </div>
              )}

              {/* Badges + Download Button Row */}
              <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>{image.model?.name || 'FLUX.2-dev'}</span>
                    {image.model?.badge && (
                      <span className="text-[10px] opacity-75">· {image.model.badge}</span>
                    )}
                  </span>

                  <span className="px-2 py-0.5 rounded-full bg-white/5 font-mono">
                    1024×1024
                  </span>

                  {image.durationMs && (
                    <span className="px-2 py-0.5 rounded-full bg-white/5 font-mono">
                      {(image.durationMs / 1000).toFixed(1)}s
                    </span>
                  )}

                  {image.quota?.remaining !== undefined && (
                    <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
                      {image.quota.remaining}/10 left
                    </span>
                  )}
                </div>

                {/* Direct Download Button */}
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition-transform active:scale-95"
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </MotionDiv>
        )}

        {/* ==========================================================
            3. ERROR STATE / SIGN IN UNLOCK
            ========================================================== */}
        {isError && (
          <MotionDiv
            key="error-card"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 sm:p-5 rounded-3xl border flex flex-col gap-3 max-w-md shadow-xl ${
              isRequireAuth
                ? isDark
                  ? 'border-sky-500/30 bg-gradient-to-br from-sky-500/10 via-purple-500/10 to-[#121212] text-slate-200'
                  : 'border-sky-400 bg-sky-50 text-slate-800'
                : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
            }`}
          >
            {isRequireAuth ? (
              <>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    <Sparkles size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-sky-400">
                      Free Guest Image Credits Used
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      You’ve used your 2 free guest trial image generations. Sign in or create an account to get <strong>10 free generations every day</strong> with FLUX.2-dev!
                    </p>
                    <div className="text-[11px] text-slate-400 mt-1">
                      💡 Text-to-text chat is always 100% free and unlimited.
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() =>
                      openSignInModal({
                        title: 'Sign in to unlock 10 daily AI image credits',
                        message:
                          'Sign in or register for free to get 10 image generations every day with FLUX.2-dev.',
                      })
                    }
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-black shadow-md transition-all active:scale-95"
                  >
                    <LogIn size={14} />
                    <span>Sign In to Unlock 10 Credits</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-2.5">
                  <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs sm:text-sm">
                    <div className="font-semibold text-rose-200">
                      Image Generation Notice
                    </div>
                    <div className="text-rose-300/90 mt-0.5">
                      {image?.error || 'Cloudflare FLUX.2-dev encountered an error. Please try again.'}
                    </div>
                  </div>
                </div>

                {onRegenerate && (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={onRegenerate}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 transition-colors"
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
  );
};

export default InlineAIImageMessage;
