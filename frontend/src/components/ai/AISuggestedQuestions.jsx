import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import NikhilAILogo from './NikhilAILogo';

const SUGGESTED_QUESTIONS = [
  'Tell me about Nikhil',
  'What projects has he built?',
  'Why should I hire him?',
  'What technologies does he know?',
  'Explain Vistagram',
  'What certifications does he have?',
  'Is he available for work?',
  'How can I contact Nikhil?',
  'Show his resume details',
];

const CONTAINER_VARIANTS = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 8, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
};

const AISuggestedQuestions = ({ onSelect }) => {
  const { isDark } = useTheme();

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-6">
      <div className="text-center">
        <div
          className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border text-2xl font-black ${
            isDark
              ? 'border-sky-500/30 bg-sky-500/10 text-sky-300'
              : 'border-sky-300 bg-sky-100 text-sky-700 shadow-xs'
          }`}
        >
          <NikhilAILogo size={52} />
        </div>
        <h3
          className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}
        >
          Hi, I&apos;m Nikhil AI
        </h3>
        <p
          className={`mt-1 text-xs leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-slate-600 font-medium'
          }`}
        >
          Your guide to Nikhil&apos;s portfolio.
          <br />
          Ask me anything about him.
        </p>
      </div>

      <motion.div
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap justify-center gap-2"
      >
        {SUGGESTED_QUESTIONS.map((q) => (
          <motion.button
            key={q}
            variants={ITEM_VARIANTS}
            type="button"
            onClick={() => onSelect(q)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
              isDark
                ? 'border-sky-500/30 bg-sky-500/8 text-sky-300 hover:border-sky-400/60 hover:bg-sky-500/15 hover:text-sky-200'
                : 'border-sky-300 bg-white text-sky-900 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-950 shadow-xs'
            }`}
          >
            {q}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default AISuggestedQuestions;
