import { useState, useRef, useCallback, useEffect } from 'react';
import { streamChat } from '@/services/ai.service.js';

const STORAGE_KEY = 'nikhil_ai_history';
const MAX_STORED_MESSAGES = 50;
const SESSION_ID_KEY = 'nikhil_ai_session_id';

const generateSessionId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const loadHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveHistory = (messages) => {
  try {
    const toSave = messages
      .filter((m) => !m.isStreaming)
      .slice(-MAX_STORED_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // localStorage unavailable
  }
};

const getSessionId = () => {
  try {
    const existing = sessionStorage.getItem(SESSION_ID_KEY);
    if (existing) return existing;
    const id = generateSessionId();
    sessionStorage.setItem(SESSION_ID_KEY, id);
    return id;
  } catch {
    return generateSessionId();
  }
};

const useNikhilAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => loadHistory());
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const sessionId = useRef(getSessionId());

  // Save history on changes
  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  // Auto-scroll when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Cleanup active stream on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.();
    };
  }, []);

  const openPanel = useCallback(() => setIsOpen(true), []);
  const closePanel = useCallback(() => setIsOpen(false), []);
  const togglePanel = useCallback(() => setIsOpen((prev) => !prev), []);

  const clearHistory = useCallback(() => {
    abortRef.current?.();
    abortRef.current = null;
    setMessages([]);
    setError(null);
    setIsLoading(false);
    setIsStreaming(false);
    setInputValue('');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text ?? inputValue).trim();
      if (!trimmed || isLoading || isStreaming) return;

      abortRef.current?.();
      abortRef.current = null;

      setError(null);
      setInputValue('');

      const userMsg = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      };

      const assistantMsgId = `assistant-${Date.now()}`;
      const assistantMsg = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsLoading(true);
      setIsStreaming(false);

      const history = messages
        .filter((m) => !m.isError)
        .slice(-12)
        .map(({ role, content }) => ({ role, content }));

      abortRef.current = streamChat({
        message: trimmed,
        history,
        sessionId: sessionId.current,

        onToken: (token) => {
          setIsLoading(false);
          setIsStreaming(true);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: m.content + token, isStreaming: true }
                : m,
            ),
          );
        },

        onComplete: () => {
          setIsLoading(false);
          setIsStreaming(false);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId ? { ...m, isStreaming: false } : m,
            ),
          );
          abortRef.current = null;
          setTimeout(() => inputRef.current?.focus(), 100);
        },

        onError: (errorMessage) => {
          setIsLoading(false);
          setIsStreaming(false);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: errorMessage || 'Something went wrong. Please try again.',
                    isStreaming: false,
                    isError: true,
                  }
                : m,
            ),
          );
          setError(errorMessage);
          abortRef.current = null;
        },
      });
    },
    [inputValue, isLoading, isStreaming, messages],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage],
  );

  return {
    isOpen,
    messages,
    isLoading,
    isStreaming,
    error,
    inputValue,
    openPanel,
    closePanel,
    togglePanel,
    sendMessage,
    clearHistory,
    setInputValue,
    handleKeyDown,
    messagesEndRef,
    inputRef,
    hasMessages: messages.length > 0,
  };
};

export default useNikhilAI;
