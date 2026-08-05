import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Wifi, WifiOff } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import AIMessageList from './AIMessageList';
import AIInputBar from './AIInputBar';
import NikhilAILogo from './NikhilAILogo';

const PANEL_VARIANTS = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.92,
    transformOrigin: 'bottom right',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transformOrigin: 'bottom right',
    transition: {
      type: 'spring',
      stiffness: 380,
      damping: 30,
      mass: 0.9,
    },
  },
  exit: {
    opacity: 0,
    y: 16,
    scale: 0.94,
    transformOrigin: 'bottom right',
    transition: { duration: 0.18, ease: 'easeIn' },
  },
};

const AIChatPanel = ({
  isOpen,
  messages,
  isLoading,
  isStreaming,
  inputValue,
  onClose,
  onClear,
  onSend,
  onInputChange,
  onKeyDown,
  onSuggestedSelect,
  messagesEndRef,
  inputRef,
  hasMessages,
}) => {
  const { isDark } = useTheme();
  const isKnowledgeReady = true;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="ai-chat-panel"
          variants={PANEL_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-label="Nikhil AI assistant"
          className={`fixed top-20 bottom-20 left-3 right-3 z-[997] flex flex-col overflow-hidden rounded-3xl border-2 shadow-2xl sm:top-24 sm:bottom-20 sm:right-24 sm:left-auto ${
            isDark
              ? 'border-sky-500/20 bg-[#050e1a] shadow-[0_32px_80px_rgba(0,0,0,0.6)] text-slate-100'
              : 'border-slate-300 bg-white shadow-[0_25px_70px_rgba(0,0,0,0.25)] text-slate-950'
          }`}
          style={{
            width: 'min(400px, calc(100vw - 24px))',
            height: 'calc(100dvh - 160px)',
            maxHeight: '680px',
          }}
        >
          {/* Ambient top border glow */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-60"
            style={{
              background: isDark
                ? 'linear-gradient(90deg, transparent, rgba(56,189,248,0.5), rgba(34,197,94,0.3), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(2,132,199,0.6), rgba(16,185,129,0.5), transparent)',
            }}
          />

          {/* Header */}
          <div
            className={`flex items-center gap-3 px-4 py-3.5 border-b ${
              isDark
                ? 'border-white/8 bg-[#060f1d]/60'
                : 'border-slate-200 bg-slate-100/90'
            }`}
          >
            <div
              className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 text-sm font-black ${
                isDark
                  ? 'border-sky-500/40 bg-gradient-to-br from-sky-500/20 to-emerald-500/10 text-sky-300'
                  : 'border-sky-500 bg-sky-100 text-sky-800 shadow-xs'
              }`}
            >
              <NikhilAILogo size={28} />
              <span
                className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 bg-emerald-500"
                style={{
                  borderColor: isDark ? '#050e1a' : 'white',
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <h2
                className={`text-sm font-black leading-tight ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
              >
                Nikhil AI
              </h2>
              <p
                className={`text-[10px] font-bold ${
                  isDark ? 'text-emerald-400' : 'text-emerald-700'
                }`}
              >
                Portfolio assistant · Always online
              </p>
            </div>

            {hasMessages && (
              <button
                type="button"
                onClick={onClear}
                aria-label="Clear conversation"
                title="Clear conversation"
                className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all hover:scale-105 active:scale-95 ${
                  isDark
                    ? 'border-white/10 bg-white/5 text-slate-500 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-600 shadow-xs'
                }`}
              >
                <Trash2 size={14} />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close AI assistant"
              className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all hover:scale-105 active:scale-95 ${
                isDark
                  ? 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                  : 'border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-200 hover:text-black shadow-xs'
              }`}
            >
              <X size={15} />
            </button>
          </div>

          {/* Status Bar */}
          <div
            className={`flex items-center gap-2 px-4 py-1.5 text-[10px] font-bold border-b ${
              isDark
                ? 'border-white/5 bg-[#040c18]/40 text-slate-500'
                : 'border-slate-200 bg-slate-100 text-slate-700'
            }`}
          >
            {isKnowledgeReady ? (
              <Wifi size={10} className={isDark ? 'text-emerald-500' : 'text-emerald-700'} />
            ) : (
              <WifiOff size={10} className="text-amber-500" />
            )}
            <span>
              {isKnowledgeReady
                ? 'Grounded in portfolio knowledge · Powered by Gemini'
                : 'Knowledge loading…'}
            </span>
          </div>

          {/* Feed */}
          <AIMessageList
            messages={messages}
            isLoading={isLoading}
            onSuggestedSelect={onSuggestedSelect}
            messagesEndRef={messagesEndRef}
          />

          {/* Input Bar */}
          <AIInputBar
            value={inputValue}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            onSend={onSend}
            isLoading={isLoading}
            isStreaming={isStreaming}
            inputRef={inputRef}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIChatPanel;
