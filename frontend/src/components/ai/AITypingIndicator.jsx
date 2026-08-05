import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import NikhilAILogo from './NikhilAILogo';

const DOT_VARIANTS = {
  idle: { y: 0, opacity: 0.4 },
  bounce: { y: -5, opacity: 1 },
};

const AITypingIndicator = () => {
  const { isDark } = useTheme();

  return (
    <div className="flex items-start gap-2.5 px-4 py-2">
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-black ${
          isDark
            ? 'border-sky-500/40 bg-sky-500/10 text-sky-300'
            : 'border-sky-400/40 bg-sky-50 text-sky-600'
        }`}
      >
        <NikhilAILogo size={14} />
      </div>

      <div
        className={`flex items-center gap-1.5 rounded-2xl rounded-tl-sm px-4 py-3 ${
          isDark
            ? 'bg-[#0c1a2e] border border-sky-500/20'
            : 'bg-sky-50/80 border border-sky-200/60'
        }`}
      >
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
    </div>
  );
};

export default AITypingIndicator;
