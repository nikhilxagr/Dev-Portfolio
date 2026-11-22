import { useState, useRef, useCallback, useEffect } from 'react';
import {
  streamChat,
  generateAIImage,
  getAIImageQuota,
  getAIImageModels,
  getUserChatSessions,
  getUserChatSession,
  saveUserChatSession,
  patchUserChatSession,
  deleteUserChatSession,
  clearAllUserChatSessions,
} from '@/services/ai.service.js';
import { useUserAuth } from '@/context/UserAuthContext';

const MAX_STORED_MESSAGES = 50;
const SESSION_ID_KEY = 'nikhil_ai_session_id';
const ACTIVE_DB_SESSION_KEY = 'active_ai_session_id';

const generateClientSessionId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const getClientSessionId = () => {
  try {
    const existing = sessionStorage.getItem(SESSION_ID_KEY);
    if (existing) return existing;
    const id = generateClientSessionId();
    sessionStorage.setItem(SESSION_ID_KEY, id);
    return id;
  } catch {
    return generateClientSessionId();
  }
};

const useNikhilAI = () => {
  const { user } = useUserAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isDeepThink, setIsDeepThink] = useState(true);
  const [imageQuota, setImageQuota] = useState(null);
  const [availableImageModels, setAvailableImageModels] = useState([]);
  const [selectedImageModel, setSelectedImageModel] = useState(() => {
    try {
      return localStorage.getItem('portfolio_image_model') || 'flux-2-dev';
    } catch {
      return 'flux-2-dev';
    }
  });

  // Authenticated Chat Sessions & History
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(() => {
    try {
      return sessionStorage.getItem(ACTIVE_DB_SESSION_KEY) || null;
    } catch {
      return null;
    }
  });
  const [isSessionsLoading, setIsSessionsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const sessionId = useRef(getClientSessionId());
  const isGeneratingImageRef = useRef(false);
  const activeSessionIdRef = useRef(activeSessionId);

  useEffect(() => {
    activeSessionIdRef.current = activeSessionId;
  }, [activeSessionId]);

  const handleSelectImageModel = useCallback((modelKey) => {
    if (!modelKey) return;
    setSelectedImageModel(modelKey);
    try {
      localStorage.setItem('portfolio_image_model', modelKey);
    } catch {
      // ignore
    }
  }, []);

  const refreshImageQuota = useCallback(async () => {
    try {
      const q = await getAIImageQuota();
      if (q) setImageQuota(q);
    } catch {
      // ignore
    }
  }, []);

  // Fetch image models & quota on mount
  useEffect(() => {
    refreshImageQuota();
    getAIImageModels()
      .then((res) => {
        if (Array.isArray(res.models) && res.models.length > 0) {
          setAvailableImageModels(res.models);
        }
      })
      .catch(() => {});
  }, [refreshImageQuota]);

  // Load chat sessions when user is logged in
  const loadUserSessions = useCallback(async () => {
    if (!user) {
      setSessions([]);
      return;
    }
    setIsSessionsLoading(true);
    try {
      const list = await getUserChatSessions();
      setSessions(list);

      // If user had an active session saved in sessionStorage on refresh, load its messages
      const savedSessionId = sessionStorage.getItem(ACTIVE_DB_SESSION_KEY);
      if (savedSessionId) {
        const fullSession = await getUserChatSession(savedSessionId);
        if (fullSession && Array.isArray(fullSession.messages)) {
          setActiveSessionId(fullSession._id);
          setMessages(fullSession.messages);
        } else if (list.length > 0) {
          // If saved session no longer exists, clear
          sessionStorage.removeItem(ACTIVE_DB_SESSION_KEY);
          setActiveSessionId(null);
          setMessages([]);
        }
      }
    } catch {
      // ignore
    } finally {
      setIsSessionsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserSessions();
    } else {
      // Guest mode: clear sessions and active session id
      setSessions([]);
      setActiveSessionId(null);
      try {
        sessionStorage.removeItem(ACTIVE_DB_SESSION_KEY);
      } catch {
        // ignore
      }
    }
  }, [user, loadUserSessions]);

  // Persist session to MongoDB for authenticated users
  const persistSessionToBackend = useCallback(
    async (messagesToSave) => {
      if (!user) return; // Guests do NOT persist to backend or localStorage

      const validMessages = messagesToSave
        .filter((m) => !m.isStreaming)
        .slice(-MAX_STORED_MESSAGES);

      if (validMessages.length === 0) return;

      try {
        const saved = await saveUserChatSession({
          sessionId: activeSessionIdRef.current,
          messages: validMessages,
        });

        if (saved && saved._id) {
          if (!activeSessionIdRef.current || activeSessionIdRef.current !== saved._id) {
            setActiveSessionId(saved._id);
            try {
              sessionStorage.setItem(ACTIVE_DB_SESSION_KEY, saved._id);
            } catch {
              // ignore
            }
          }

          // Update local sessions list
          setSessions((prev) => {
            const exists = prev.some((s) => s._id === saved._id);
            if (exists) {
              return prev.map((s) =>
                s._id === saved._id
                  ? { ...s, title: saved.title, updatedAt: saved.updatedAt, messageCount: saved.messages?.length || 0 }
                  : s
              );
            }
            return [
              {
                _id: saved._id,
                title: saved.title,
                pinned: saved.pinned || false,
                isArchived: saved.isArchived || false,
                updatedAt: saved.updatedAt || new Date().toISOString(),
                createdAt: saved.createdAt || new Date().toISOString(),
                messageCount: saved.messages?.length || 0,
              },
              ...prev,
            ];
          });
        }
      } catch (err) {
        console.warn('[useNikhilAI] Could not persist session:', err.message);
      }
    },
    [user]
  );

  // Lock body scroll and listen for Escape key when open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleGlobalKeyDown = (e) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      };

      window.addEventListener('keydown', handleGlobalKeyDown);
      return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener('keydown', handleGlobalKeyDown);
      };
    }
  }, [isOpen]);

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

  const stopStreaming = useCallback(() => {
    abortRef.current?.();
    abortRef.current = null;
    setIsLoading(false);
    setIsStreaming(false);
    setMessages((prev) => {
      const updated = prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m));
      persistSessionToBackend(updated);
      return updated;
    });
  }, [persistSessionToBackend]);

  // New Chat: Starts a fresh thread
  const createNewChat = useCallback(() => {
    abortRef.current?.();
    abortRef.current = null;
    setMessages([]);
    setError(null);
    setIsLoading(false);
    setIsStreaming(false);
    setInputValue('');
    setActiveSessionId(null);
    try {
      sessionStorage.removeItem(ACTIVE_DB_SESSION_KEY);
    } catch {
      // ignore
    }
  }, []);

  // Switch to an existing chat session from history
  const selectSession = useCallback(
    async (id) => {
      if (!id || id === activeSessionId) return;
      abortRef.current?.();
      abortRef.current = null;
      setIsLoading(true);
      setError(null);
      try {
        const full = await getUserChatSession(id);
        if (full) {
          setActiveSessionId(full._id);
          try {
            sessionStorage.setItem(ACTIVE_DB_SESSION_KEY, full._id);
          } catch {
            // ignore
          }
          setMessages(full.messages || []);
        }
      } catch {
        setError('Failed to load conversation.');
      } finally {
        setIsLoading(false);
      }
    },
    [activeSessionId]
  );

  // Delete a specific chat session
  const deleteSession = useCallback(
    async (id) => {
      if (!id) return;
      try {
        const ok = await deleteUserChatSession(id);
        if (ok) {
          setSessions((prev) => prev.filter((s) => s._id !== id));
          if (activeSessionId === id) {
            createNewChat();
          }
        }
      } catch (err) {
        console.warn('[useNikhilAI] Delete session error:', err.message);
      }
    },
    [activeSessionId, createNewChat]
  );

  // Pin or unpin a session
  const togglePinSession = useCallback(async (id, currentPinned) => {
    if (!id) return;
    try {
      const updated = await patchUserChatSession(id, { pinned: !currentPinned });
      if (updated) {
        setSessions((prev) =>
          prev
            .map((s) => (s._id === id ? { ...s, pinned: updated.pinned } : s))
            .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || new Date(b.updatedAt) - new Date(a.updatedAt))
        );
      }
    } catch {
      // ignore
    }
  }, []);

  // Rename a session
  const renameSession = useCallback(async (id, newTitle) => {
    if (!id || !newTitle?.trim()) return;
    try {
      const updated = await patchUserChatSession(id, { title: newTitle.trim() });
      if (updated) {
        setSessions((prev) =>
          prev.map((s) => (s._id === id ? { ...s, title: updated.title } : s))
        );
      }
    } catch {
      // ignore
    }
  }, []);

  // Clear all chat history for user
  const clearAllSessions = useCallback(async () => {
    try {
      await clearAllUserChatSessions();
      setSessions([]);
      createNewChat();
    } catch {
      // ignore
    }
  }, [createNewChat]);

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

      // Handle /image command inline in chat
      if (trimmed.toLowerCase().startsWith('/image')) {
        if (isGeneratingImageRef.current || isLoading || isStreaming) {
          return;
        }

        const imagePrompt = trimmed.replace(/^\/image\s*/i, '').trim();

        if (!imagePrompt) {
          const helperMsgId = `assistant-${Date.now()}`;
          const helperList = [
            ...messages,
            userMsg,
            {
              id: helperMsgId,
              role: 'assistant',
              content:
                '✨ To generate an image, please describe what you want to see.\n\n**Example:** `/image a futuristic cyberpunk developer workstation with neon hologram screens`',
              timestamp: Date.now(),
              isStreaming: false,
            },
          ];
          setMessages(helperList);
          persistSessionToBackend(helperList);
          return;
        }

        // Lock synchronously: strictly one prompt = one image (no automatic multiple generations)
        isGeneratingImageRef.current = true;
        setInputValue('');

        const targetModelKey = selectedImageModel || 'flux-2-dev';
        const modelObj = availableImageModels.find((m) => m.key === targetModelKey);

        const assistantMsgId = `assistant-${Date.now()}`;
        const assistantImageMsg = {
          id: assistantMsgId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
          type: 'image',
          image: {
            status: 'generating',
            prompt: imagePrompt,
            model: modelObj || { key: targetModelKey, name: 'FLUX.2-dev' },
          },
        };

        const withGenerating = [...messages, userMsg, assistantImageMsg];
        setMessages(withGenerating);
        setIsLoading(true);
        setIsStreaming(false);

        try {
          const result = await generateAIImage({
            prompt: imagePrompt,
            model: targetModelKey,
          });

          const completedList = withGenerating.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  image: {
                    status: 'completed',
                    prompt: imagePrompt,
                    dataUrl: result.image,
                    model: result.model || modelObj,
                    durationMs: result.durationMs,
                    quota: result.quota,
                  },
                }
              : m
          );

          setMessages(completedList);
          persistSessionToBackend(completedList);

          if (result.quota) {
            setImageQuota(result.quota);
          }
        } catch (err) {
          const errMsg =
            err?.message || 'AI image generation failed. Please try again.';
          const requireAuth = Boolean(err?.requireAuth);

          const errorList = withGenerating.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  isError: true,
                  image: {
                    status: 'error',
                    prompt: imagePrompt,
                    model: modelObj || { key: targetModelKey, name: 'FLUX.2-dev' },
                    error: errMsg,
                    requireAuth,
                    quota: err?.quota,
                  },
                }
              : m
          );

          setMessages(errorList);
          persistSessionToBackend(errorList);

          if (err?.quota) {
            setImageQuota(err.quota);
          }
          setError(errMsg);
        } finally {
          isGeneratingImageRef.current = false;
          setIsLoading(false);
          setTimeout(() => inputRef.current?.focus(), 100);
        }
        return;
      }

      const assistantMsgId = `assistant-${Date.now()}`;
      const assistantMsg = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        isStreaming: true,
      };

      const updatedWithAssistant = [...messages, userMsg, assistantMsg];
      setMessages(updatedWithAssistant);
      setIsLoading(true);
      setIsStreaming(false);

      const history = messages
        .filter((m) => !m.isError && m.content)
        .slice(-10)
        .map(({ role, content }) => ({
          role,
          content: typeof content === 'string' ? content.slice(0, 2000) : '',
        }));

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
          setMessages((prev) => {
            const finalMessages = prev.map((m) =>
              m.id === assistantMsgId ? { ...m, isStreaming: false } : m,
            );
            persistSessionToBackend(finalMessages);
            return finalMessages;
          });
          abortRef.current = null;
          setTimeout(() => inputRef.current?.focus(), 100);
        },

        onError: (errorMessage) => {
          setIsLoading(false);
          setIsStreaming(false);
          setMessages((prev) => {
            const errorMessages = prev.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: errorMessage || 'Something went wrong. Please try again.',
                    isStreaming: false,
                    isError: true,
                  }
                : m,
            );
            persistSessionToBackend(errorMessages);
            return errorMessages;
          });
          setError(errorMessage);
          abortRef.current = null;
        },
      });
    },
    [inputValue, isLoading, isStreaming, messages, selectedImageModel, availableImageModels, persistSessionToBackend],
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

  const regenerateLastMessage = useCallback(() => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      sendMessage(lastUserMsg.content);
    }
  }, [messages, sendMessage]);

  return {
    isOpen,
    messages,
    isLoading,
    isStreaming,
    error,
    inputValue,
    isDeepThink,
    setIsDeepThink,
    openPanel,
    closePanel,
    togglePanel,
    sendMessage,
    stopStreaming,
    clearHistory: createNewChat,
    createNewChat,
    regenerateLastMessage,
    setInputValue,
    handleKeyDown,
    messagesEndRef,
    inputRef,
    hasMessages: messages.length > 0,
    imageQuota,
    refreshImageQuota,
    selectedImageModel,
    setSelectedImageModel: handleSelectImageModel,
    availableImageModels,
    // History & Session Management
    sessions,
    activeSessionId,
    isSessionsLoading,
    selectSession,
    deleteSession,
    togglePinSession,
    renameSession,
    clearAllSessions,
    loadUserSessions,
  };
};

export default useNikhilAI;
