import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import AIMarkdownRenderer from './AIMarkdownRenderer';
import { useTheme } from '@/context/ThemeContext';
import NikhilAILogo from './NikhilAILogo';

const MESSAGE_VARIANTS = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
};

const DOT_VARIANTS = {
  idle: { y: 0, opacity: 0.4 },
  bounce: { y: -5, opacity: 1 },
};

const AIMessage = ({ message }) => {
  const { isDark } = useTheme();
  const isUser = message.role === 'user';
  const isError = message.isError;

  if (isUser) {
    return (
      <motion.div
        variants={MESSAGE_VARIANTS}
        initial="hidden"
        animate="visible"
        className="flex justify-end px-4 py-1.5"
      >
        <div
          className={`max-w-[82%] rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm font-medium leading-relaxed shadow-sm ${
            isDark
              ? 'bg-gradient-to-br from-emerald-500/20 to-sky-500/10 border border-emerald-500/25 text-slate-100'
              : 'bg-emerald-600 border border-emerald-700 text-white font-semibold'
          }`}
        >
          {message.content}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={MESSAGE_VARIANTS}
      initial="hidden"
      animate="visible"
      className="flex items-start gap-2.5 px-4 py-1.5"
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-black transition-all ${
          isError
            ? isDark
              ? 'border-rose-500/40 bg-rose-500/10 text-rose-400'
              : 'border-rose-400/40 bg-rose-50 text-rose-600'
            : isDark
            ? 'border-sky-500/40 bg-sky-500/10 text-sky-300'
            : 'border-sky-400 bg-sky-100 text-sky-700'
        }`}
      >
        {isError ? <AlertTriangle size={13} /> : <NikhilAILogo size={22} />}
      </div>

      <div
        className={`max-w-[88%] rounded-2xl rounded-tl-sm border-2 px-4 py-3 shadow-sm ${
          isError
            ? isDark
              ? 'border-rose-500/25 bg-rose-500/8 text-rose-300'
              : 'border-rose-400 bg-rose-50 text-rose-800'
            : isDark
            ? 'border-sky-500/15 bg-[#0a1929]'
            : 'border-slate-300 bg-slate-100/90 text-slate-950 shadow-xs'
        }`}
      >
        {message.isStreaming && !message.content ? (
          <div className="flex items-center gap-1.5 py-1 px-0.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                variants={DOT_VARIANTS}
                initial="idle"
                animate="bounce"
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
                className={`block h-2 w-2 rounded-full ${
                  isDark ? 'bg-sky-400' : 'bg-sky-500'
                }`}
              />
            ))}
          </div>
        ) : message.isStreaming && message.content ? (
          <div>
            <AIMarkdownRenderer content={message.content} />
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className={`inline-block h-3.5 w-0.5 rounded-full ml-0.5 translate-y-0.5 ${isDark ? 'bg-sky-400' : 'bg-sky-500'}`}
            />
          </div>
        ) : isError ? (
          <p className="text-sm leading-relaxed">{message.content}</p>
        ) : (
          <AIMarkdownRenderer content={message.content} />
        )}
      </div>
    </motion.div>
  );
};

export default AIMessage;
