import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import AIMessage from './AIMessage';
import AISuggestedQuestions from './AISuggestedQuestions';
import { useTheme } from '@/context/ThemeContext';

const AIMessageList = ({
  messages,
  isLoading,
  onSuggestedSelect,
  messagesEndRef,
}) => {
  const { isDark } = useTheme();
  const containerRef = useRef(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const hasMessages = messages.length > 0;

  // Toggle "Scroll to bottom" button based on scroll position
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBottom(distanceToBottom > 80);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messagesEndRef]);

  // Auto-scroll on new messages or streaming tokens
  useEffect(() => {
    if (messagesEndRef?.current && !showScrollBottom) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isLoading, messagesEndRef, showScrollBottom]);

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        data-lenis-prevent="true"
        data-lenis-prevent-touch="true"
        className={`h-full overflow-y-auto py-2 ai-chat-scroll ${
          isDark
            ? 'scrollbar-thumb-sky-500/20 scrollbar-track-transparent'
            : 'scrollbar-thumb-sky-400/20 scrollbar-track-transparent'
        }`}
        role="log"
        aria-label="Nikhil AI conversation"
        aria-live="polite"
      >
        {!hasMessages ? (
          <AISuggestedQuestions onSelect={onSuggestedSelect} />
        ) : (
          <div className="flex flex-col gap-0.5 pb-2">
            {messages.map((message) => (
              <AIMessage key={message.id} message={message} />
            ))}

            <div ref={messagesEndRef} className="h-1" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Floating scroll down button */}
      <AnimatePresence>
        {showScrollBottom && (
          <motion.button
            type="button"
            onClick={scrollToBottom}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.15 }}
            aria-label="Scroll to bottom"
            className={`absolute bottom-3 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-all hover:scale-110 active:scale-90 ${
              isDark
                ? 'border-sky-400/40 bg-[#071322]/90 text-sky-300 shadow-[0_4px_16px_rgba(56,189,248,0.3)]'
                : 'border-sky-400/50 bg-white/95 text-sky-700 shadow-[0_4px_16px_rgba(2,132,199,0.2)]'
            }`}
          >
            <ChevronDown size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIMessageList;
