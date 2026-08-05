import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { SendHorizonal, Square } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const MAX_CHARS = 500;

const AIInputBar = ({
  value,
  onChange,
  onKeyDown,
  onSend,
  isLoading,
  isStreaming,
  inputRef,
}) => {
  const { isDark } = useTheme();
  const isBusy = isLoading || isStreaming;
  const charCount = value.length;
  const isNearLimit = charCount > 400;
  const isOverLimit = charCount > MAX_CHARS;

  // Auto-fit textarea height
  useEffect(() => {
    const ta = inputRef?.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [value, inputRef]);

  const handleSend = () => {
    if (!isBusy && value.trim() && !isOverLimit) {
      onSend();
    }
  };

  return (
    <div
      className={`border-t px-3 py-3 ${
        isDark ? 'border-white/8' : 'border-slate-200 bg-slate-50/50'
      }`}
    >
      <div
        className={`flex items-end gap-2 rounded-2xl border px-3 py-2 transition-all duration-200 ${
          isDark
            ? 'border-sky-500/25 bg-[#070f1a] focus-within:border-sky-500/50 focus-within:shadow-[0_0_0_1px_rgba(56,189,248,0.15)]'
            : 'border-sky-300 bg-white focus-within:border-sky-500 focus-within:shadow-[0_0_0_2px_rgba(2,132,199,0.18)] shadow-xs'
        }`}
      >
        <textarea
          ref={inputRef}
          id="nikhil-ai-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask about Nikhil…"
          rows={1}
          disabled={isBusy}
          aria-label="Message Nikhil AI"
          aria-describedby="nikhil-ai-char-count"
          className={`max-h-[120px] min-h-[24px] flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-sm disabled:cursor-not-allowed ${
            isDark
              ? 'text-slate-100 placeholder-slate-600'
              : 'text-slate-900 placeholder-slate-500 font-medium'
          }`}
          style={{ scrollbarWidth: 'none' }}
        />

        <motion.button
          type="button"
          onClick={handleSend}
          disabled={isBusy || !value.trim() || isOverLimit}
          aria-label={isBusy ? 'AI is responding…' : 'Send message'}
          whileHover={!isBusy && value.trim() ? { scale: 1.1 } : {}}
          whileTap={!isBusy && value.trim() ? { scale: 0.9 } : {}}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
            isBusy || !value.trim() || isOverLimit
              ? isDark
                ? 'bg-white/5 text-slate-600 cursor-not-allowed'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              : isDark
              ? 'bg-sky-500/20 text-sky-300 hover:bg-sky-500/35 border border-sky-500/30'
              : 'bg-sky-600 text-white hover:bg-sky-700 shadow-sm border border-sky-700'
          }`}
        >
          {isStreaming ? (
            <Square size={13} className="fill-current" />
          ) : (
            <SendHorizonal size={15} />
          )}
        </motion.button>
      </div>

      <div className="mt-1.5 flex items-center justify-between px-1">
        <span
          className={`text-[10px] font-medium ${
            isDark ? 'text-slate-600' : 'text-slate-500'
          }`}
        >
          Enter to send · Shift+Enter for newline
        </span>
        <span
          id="nikhil-ai-char-count"
          className={`text-[10px] font-semibold tabular-nums transition-colors ${
            isOverLimit
              ? 'text-rose-500'
              : isNearLimit
              ? isDark
                ? 'text-amber-400'
                : 'text-amber-600'
              : isDark
              ? 'text-slate-600'
              : 'text-slate-400'
          }`}
          aria-live="polite"
        >
          {charCount}/{MAX_CHARS}
        </span>
      </div>
    </div>
  );
};

export default AIInputBar;
