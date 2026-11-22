import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import NikhilAILogo from './NikhilAILogo';

const MotionDiv = motion.div;
const MotionButton = motion.button;

const AIFloatingButton = ({ isOpen, onClick }) => {
  const { isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <AnimatePresence>
      {!isOpen && (
        <MotionDiv
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed bottom-3 right-3 z-[998] sm:bottom-6 sm:right-6"
        >
          {/* Glow effect */}
          <MotionDiv
            className="absolute inset-0 rounded-full"
            animate={{
              scale: [1, 1.45, 1],
              opacity: [0.4, 0, 0.4],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              background: isDark
                ? 'radial-gradient(circle, rgba(56,189,248,0.35) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(2,132,199,0.25) 0%, transparent 70%)',
            }}
          />

          <MotionDiv
            className="absolute inset-0 rounded-full"
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.4,
            }}
            style={{
              background: isDark
                ? 'radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(22,163,74,0.2) 0%, transparent 70%)',
            }}
          />

          {/* Main trigger button */}
          <MotionButton
            type="button"
            onClick={onClick}
            aria-label="Open Nikhil AI assistant"
            aria-expanded={false}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 shadow-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              isDark
                ? 'border-sky-400/50 bg-[#050d14] shadow-[0_0_30px_rgba(56,189,248,0.40),0_0_60px_rgba(34,197,94,0.15)] focus-visible:ring-sky-400 focus-visible:ring-offset-[#050d14]'
                : 'border-sky-400 bg-white shadow-[0_8px_30px_rgba(2,132,199,0.32),0_0_0_1px_rgba(2,132,199,0.15)] focus-visible:ring-sky-500 focus-visible:ring-offset-white'
            }`}
          >
            <div
              className="absolute inset-0 rounded-full opacity-80"
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, rgba(56,189,248,0.18) 0%, rgba(34,197,94,0.12) 100%)'
                  : 'linear-gradient(135deg, rgba(2,132,199,0.15) 0%, rgba(16,185,129,0.10) 100%)',
              }}
            />

            <span className="relative z-10">
              <NikhilAILogo size={42} />
            </span>
          </MotionButton>

          {/* Tooltip on hover */}
          <AnimatePresence>
            {isHovered && (
              <MotionDiv
                initial={{ opacity: 0, x: 8, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 8, scale: 0.9 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className={`hidden sm:block pointer-events-none absolute right-[calc(100%+10px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border px-3.5 py-1.5 text-xs font-extrabold shadow-xl ${
                  isDark
                    ? 'border-sky-500/40 bg-[#050d14]/95 text-sky-300 backdrop-blur-md shadow-[0_4px_20px_rgba(56,189,248,0.25)]'
                    : 'border-sky-300 bg-white/98 text-sky-950 backdrop-blur-md shadow-[0_4px_20px_rgba(2,132,199,0.20)]'
                }`}
              >
                Ask Nikhil AI
              </MotionDiv>
            )}
          </AnimatePresence>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};

export default AIFloatingButton;
