import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div;
const MotionButton = motion.button;

const AIFloatingButton = ({ isOpen, onClick }) => {
  return (
    <AnimatePresence>
      {!isOpen && (
        <MotionDiv
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="fixed bottom-4 right-4 z-[998] sm:bottom-6 sm:right-6"
        >
          <MotionButton
            type="button"
            onClick={onClick}
            aria-label="Open Nikhil AI assistant"
            aria-expanded={false}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-black/[0.10] bg-white px-3.5 text-sm font-medium text-slate-900 shadow-sm transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 dark:border-white/[0.12] dark:bg-[#11141c] dark:text-[#eef0f5] dark:shadow-none dark:hover:border-white/[0.20] dark:hover:bg-[#1a1e28]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            <span>Ask</span>
          </MotionButton>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};

export default AIFloatingButton;
