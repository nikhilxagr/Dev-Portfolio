import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div;
const MotionButton = motion.button;

export const AskGlyph = ({ className = '' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={`shrink-0 text-slate-800 transition-colors duration-150 group-hover:text-emerald-600 dark:text-[#eef0f5] dark:group-hover:text-emerald-400 ${className}`}
  >
    {/* Open orbital aperture ring */}
    <path
      d="M14.6 5.25A7.25 7.25 0 1 0 19.2 11.35"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Tapered diagonal vector slash */}
    <path
      d="M4.5 19.2C8.8 14.1 13.6 9.3 19.6 4.4C15.2 10.4 10.4 15.2 4.5 19.2Z"
      fill="currentColor"
    />
  </svg>
);

const AIFloatingButton = ({ isOpen, onClick }) => {
  return (
    <AnimatePresence>
      {!isOpen && (
        <MotionDiv
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="hidden xl:block fixed bottom-4 right-4 z-[998] sm:bottom-6 sm:right-6"
        >
          <MotionButton
            type="button"
            onClick={onClick}
            aria-label="Open Nikhil AI assistant"
            aria-expanded={false}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="group inline-flex h-10 items-center gap-2 rounded-lg border border-black/[0.10] bg-white px-4 text-sm font-medium text-slate-900 shadow-sm transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 dark:border-white/[0.12] dark:bg-[#11141c] dark:text-[#eef0f5] dark:shadow-none dark:hover:border-white/[0.24] dark:hover:bg-[#181c26]"
          >
            <AskGlyph />
            <span>Ask</span>
          </MotionButton>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};

export default AIFloatingButton;
