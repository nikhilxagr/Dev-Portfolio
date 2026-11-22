import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SquarePen,
  Search,
  Pin,
  Library,
  Brain,
  Mic,
  MicOff,
  ArrowUp,
  Square,
  Plus,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Sun,
  Moon,
  X,
  ChevronDown,
  Sparkles,
  Zap,
  Folder,
  Edit3,
  Globe,
  Terminal,
  Shield,
  FileText,
  ChevronRight,
  Images,
  Image as ImageIcon,
  PanelLeft,
  PanelLeftClose,
  CalendarCheck,
  Plug,
  LayoutGrid,
  MessageSquare,
  MoreHorizontal,
  Share2,
  Trash2,
  Lock,
  Archive,
  PinOff,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useUserAuth } from '@/context/UserAuthContext';
import AIMarkdownRenderer from './AIMarkdownRenderer';
import NikhilAILogo from './NikhilAILogo';
import InlineAIImageMessage from './InlineAIImageMessage';

const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionButton = motion.button;

const SUGGESTED_CARDS = [
  {
    icon: Images,
    title: 'Create an image or sticker (FLUX.2-dev)',
    isImagePrompt: true,
  },
  {
    icon: Folder,
    title: 'Explore projects & tech stack',
    query: 'Tell me about Nikhil’s top projects and his technical stack',
  },
  {
    icon: Edit3,
    title: 'Show resume & experience details',
    query: 'Show his resume details',
  },
  {
    icon: Globe,
    title: 'Get contact info & booking details',
    query: 'How can I contact or hire Nikhil?',
  },
  {
    icon: Terminal,
    title: 'Ask about cybersecurity & BCA journey',
    query: 'Tell me about his cybersecurity skills, certifications, and journey',
  },
];

const KNOWLEDGE_TOPICS = [
  { id: 'resume', name: 'Resume & Bio', icon: FileText, desc: 'Education, contact & summary' },
  { id: 'projects', name: 'Projects & Work', icon: Folder, desc: 'Kanoon AI, InTube, SnapURL...' },
  { id: 'skills', name: 'Technical Skills', icon: Terminal, desc: 'Python, MERN, Cybersecurity' },
  { id: 'experience', name: 'Experience & Roles', icon: Edit3, desc: 'Internships, Freelance, Projects' },
  { id: 'journey', name: 'Education & Timeline', icon: Shield, desc: 'BCA at BBDU, Self-taught roadmap' },
  { id: 'certificates', name: 'Certifications', icon: Sparkles, desc: 'TryHackMe, Python, Security' },
];

const FALLBACK_IMAGE_MODELS = [
  {
    key: 'flux-1-schnell',
    name: 'FLUX.1 Schnell',
    displayName: 'FLUX.1 Schnell — Fast',
    description: 'Fast image generation for quick ideas and iterations.',
    badge: 'Fast',
    enabled: true,
  },
  {
    key: 'flux-2-klein-4b',
    name: 'FLUX.2 Klein 4B',
    displayName: 'FLUX.2 Klein 4B — Balanced',
    description: 'Balanced image generation with quality and speed.',
    badge: 'Balanced',
    enabled: true,
  },
  {
    key: 'flux-2-dev',
    name: 'FLUX.2-dev',
    displayName: 'FLUX.2-dev — High Detail',
    description: 'Detailed image generation for complex prompts.',
    badge: 'High Detail',
    enabled: true,
    isDefault: true,
  },
  {
    key: 'flux-2-klein-9b',
    name: 'FLUX.2 Klein 9B',
    displayName: 'FLUX.2 Klein 9B — Advanced',
    description: 'Advanced generation with higher-quality output.',
    badge: 'Advanced',
    enabled: true,
  },
  {
    key: 'leonardo-phoenix',
    name: 'Leonardo Phoenix',
    displayName: 'Leonardo Phoenix — Artistic',
    description: 'Artistic image generation for creative styles.',
    badge: 'Artistic',
    enabled: true,
  },
  {
    key: 'leonardo-lucid',
    name: 'Leonardo Lucid Origin',
    displayName: 'Leonardo Lucid — Creative',
    description: 'Creative and cinematic image generation.',
    badge: 'Creative',
    enabled: true,
  },
];

const AIChatPanel = ({
  isOpen = true,
  isStandalone = false,
  messages = [],
  isLoading = false,
  isStreaming = false,
  inputValue = '',
  hasMessages = false,
  isDeepThink = true,
  onToggleDeepThink,
  onClose,
  onClear,
  onStop,
  onRegenerate,
  onSend,
  onInputChange,
  onKeyDown,
  onSuggestedSelect,
  messagesEndRef,
  imageQuota = null,
  selectedImageModel = 'flux-2-dev',
  onSelectImageModel,
  availableImageModels = [],
  sessions = [],
  activeSessionId = null,
  isSessionsLoading = false,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
  onClearAllSessions,
  onNewChat,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, openSignInModal, openProfileModal } = useUserAuth();

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    try {
      return localStorage.getItem('ai_sidebar_expanded') !== 'false';
    } catch {
      return true;
    }
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [openMenuSessionId, setOpenMenuSessionId] = useState(null);
  const [renamingSessionId, setRenamingSessionId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  const [isMicActive, setIsMicActive] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const [feedbackMap, setFeedbackMap] = useState({});
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showImageModelPicker, setShowImageModelPicker] = useState(false);
  const [showLibraryDrawer, setShowLibraryDrawer] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [isImageMode, setIsImageMode] = useState(false);

  const modelsList =
    Array.isArray(availableImageModels) && availableImageModels.length > 0
      ? availableImageModels
      : FALLBACK_IMAGE_MODELS;

  const currentModel =
    modelsList.find((m) => m.key === selectedImageModel) ||
    modelsList.find((m) => m.key === 'flux-2-dev') ||
    modelsList[0];

  const activeImageMode =
    isImageMode || inputValue.trim().toLowerCase().startsWith('/image');

  const containerRef = useRef(null);
  const localTextareaRef = useRef(null);
  const recognitionRef = useRef(null);

  const toggleSidebarExpanded = useCallback(() => {
    setIsSidebarExpanded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('ai_sidebar_expanded', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Close context menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.chat-session-menu')) {
        setOpenMenuSessionId(null);
      }
    };
    if (openMenuSessionId) {
      document.addEventListener('click', handleOutsideClick);
      return () => document.removeEventListener('click', handleOutsideClick);
    }
  }, [openMenuSessionId]);

  // Auto-resize textarea using local DOM reference
  useEffect(() => {
    const el = localTextareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(Math.max(el.scrollHeight, 24), 140)}px`;
  }, [inputValue]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => localTextareaRef.current?.focus(), 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Scroll detection for scroll-to-bottom button
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBottom(distanceToBottom > 120);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesEndRef]);

  // Web Speech API for voice dictation
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isMicActive) {
      recognitionRef.current?.stop();
      setIsMicActive(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsMicActive(true);
      recognition.onend = () => setIsMicActive(false);
      recognition.onerror = () => setIsMicActive(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          const newValue = inputValue ? `${inputValue} ${transcript}` : transcript;
          onInputChange(newValue);
        }
        setIsMicActive(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsMicActive(false);
    }
  };

  // Text-to-speech for AI answers
  const toggleSpeechSynthesis = (msgId, text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`~[\]]/g, '').slice(0, 1000);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Copy text to clipboard
  const handleCopy = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleFeedback = (id, type) => {
    setFeedbackMap((prev) => ({
      ...prev,
      [id]: prev[id] === type ? null : type,
    }));
  };

  const handlePromptClick = (query) => {
    setShowPlusMenu(false);
    if (onSuggestedSelect) {
      onSuggestedSelect(query);
    } else {
      onInputChange(query);
      setTimeout(() => onSend(query), 50);
    }
  };

  const handleToggleImageMode = () => {
    if (activeImageMode) {
      setIsImageMode(false);
      if (inputValue.trim().toLowerCase().startsWith('/image')) {
        onInputChange(inputValue.replace(/^\/image\s*/i, ''));
      }
    } else {
      setIsImageMode(true);
    }
    setTimeout(() => {
      localTextareaRef.current?.focus();
    }, 60);
  };

  const handleStartImagePrompt = () => {
    setShowPlusMenu(false);
    setIsImageMode(true);
    setTimeout(() => {
      localTextareaRef.current?.focus();
    }, 60);
  };

  const handleSendIntercept = (overrideText) => {
    if (isLoading || isStreaming) return;
    const rawText = (overrideText ?? inputValue).trim();
    if (!rawText) return;

    let finalText = rawText;
    if (activeImageMode && !finalText.toLowerCase().startsWith('/image')) {
      finalText = `/image ${finalText}`;
    }

    onInputChange(''); // Synchronously clear input immediately to prevent any second click or keydown
    setIsImageMode(false); // Reset image mode after dispatch
    if (onSend) {
      onSend(finalText);
    }
  };

  const handleKeyDownInternal = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isLoading || isStreaming) return;
      handleSendIntercept();
      return;
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  // Google Gemini-style Model Selection Dropdown Menu (Faithful to uploaded design)
  const renderGeminiModelMenu = (direction = 'down') => {
    return (
      <AnimatePresence>
        {showImageModelPicker && (
          <MotionDiv
            initial={{ opacity: 0, y: direction === 'down' ? 6 : -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction === 'down' ? 6 : -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className={`absolute left-0 ${
              direction === 'down' ? 'top-full mt-2' : 'bottom-full mb-2'
            } w-80 sm:w-88 rounded-2xl border p-2.5 shadow-2xl z-50 backdrop-blur-xl ${
              isDark
                ? 'border-white/12 bg-[#1e1f20] text-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.85)]'
                : 'border-slate-300 bg-[#f7f8fa] text-slate-900 shadow-2xl'
            }`}
          >
            {/* Top "Auto" Card (Matching screenshot) */}
            <button
              type="button"
              onClick={() => {
                onSelectImageModel?.('flux-2-dev');
                setShowImageModelPicker(false);
              }}
              className={`w-full flex flex-col items-start p-3 rounded-xl border text-left transition-all mb-2 ${
                selectedImageModel === 'flux-2-dev'
                  ? isDark
                    ? 'border-white/25 bg-white/10 text-white'
                    : 'border-slate-400 bg-white text-slate-950 shadow-xs'
                  : isDark
                  ? 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-slate-300'
                  : 'border-slate-200 bg-white/60 hover:bg-white text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-sm">Auto</span>
                {selectedImageModel === 'flux-2-dev' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-white font-mono">
                    Active
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400 mt-0.5">
                Adapts to your needs · FLUX.2-dev
              </span>
            </button>

            {/* Model Options List (Matching screenshot with checkmark & two-line layout) */}
            <div className="flex flex-col gap-0.5 max-h-72 overflow-y-auto pr-0.5">
              {modelsList.map((model) => {
                const isSelected = model.key === selectedImageModel;
                const titleMap = {
                  'flux-2-dev': 'Everyday help',
                  'flux-1-schnell': 'Fast iterations',
                  'flux-2-klein-4b': 'Balanced fidelity',
                  'flux-2-klein-9b': 'Deeper analysis',
                  'leonardo-phoenix': 'Artistic styling',
                  'leonardo-lucid': 'Creative & cinematic',
                };
                const title = titleMap[model.key] || model.name;

                return (
                  <button
                    key={model.key}
                    type="button"
                    disabled={!model.enabled}
                    onClick={() => {
                      onSelectImageModel?.(model.key);
                      setShowImageModelPicker(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                      isSelected
                        ? isDark
                          ? 'bg-white/10 text-white'
                          : 'bg-slate-200/80 text-slate-950 font-medium'
                        : isDark
                        ? 'hover:bg-white/5 text-slate-300 hover:text-white'
                        : 'hover:bg-slate-200/50 text-slate-700 hover:text-slate-900'
                    } ${!model.enabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Checkmark or Alignment Spacer (Matches screenshot exactly) */}
                      <div className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                        {isSelected && <Check size={14} className="text-white" strokeWidth={2.5} />}
                      </div>

                      {/* Two-line text: Title on top, model name below */}
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold leading-tight truncate">
                          {title}
                        </span>
                        <span className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                          {model.name}
                        </span>
                      </div>
                    </div>

                    {/* Badge on Right (Matches screenshot [New] pill) */}
                    <span
                      className={`shrink-0 ml-2 text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        isSelected
                          ? isDark
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-300 text-slate-900'
                          : isDark
                          ? 'bg-white/5 text-slate-400'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {model.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Footer (Matching screenshot "Thinking level" footer style) */}
            <div className="flex items-center justify-between px-3 pt-2.5 mt-2 border-t border-white/10 text-[11px] text-slate-400">
              <span>Cloudflare Workers AI</span>
              <span className="font-mono">10 Daily Credits</span>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    );
  };

  const allSessions = Array.isArray(sessions) ? sessions : [];

  const renderSessionItem = (session) => {
    const isActive = session._id === activeSessionId;
    const isMenuOpen = openMenuSessionId === session._id;
    const isRenaming = renamingSessionId === session._id;

    return (
      <div
        key={session._id}
        className={`group relative flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all ${
          isActive
            ? isDark
              ? 'bg-white/12 text-white font-medium shadow-xs'
              : 'bg-slate-200 text-slate-950 font-medium'
            : isDark
            ? 'text-slate-300 hover:bg-white/6 hover:text-white'
            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
        }`}
      >
        {isRenaming ? (
          <input
            type="text"
            autoFocus
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onRenameSession?.(session._id, renameValue);
                setRenamingSessionId(null);
              } else if (e.key === 'Escape') {
                setRenamingSessionId(null);
              }
            }}
            onBlur={() => {
              onRenameSession?.(session._id, renameValue);
              setRenamingSessionId(null);
            }}
            className="w-full bg-black/40 border border-white/20 rounded px-2 py-0.5 text-xs text-white focus:outline-hidden"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              onSelectSession?.(session._id);
              setIsMobileSidebarOpen(false);
            }}
            className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
          >
            <MessageSquare size={14} className="shrink-0 text-slate-400 group-hover:text-slate-200" />
            <span className="truncate">{session.title || 'New chat'}</span>
          </button>
        )}

        {/* Right Action: 3-dots Context Menu */}
        <div className="flex items-center gap-1 shrink-0 ml-1 chat-session-menu relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuSessionId((prev) => (prev === session._id ? null : session._id));
            }}
            className={`p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${
              isMenuOpen ? 'opacity-100 bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="More options"
          >
            <MoreHorizontal size={14} />
          </button>

          {/* Floating Context Menu */}
          {isMenuOpen && (
            <div
              className={`absolute right-0 sm:left-full sm:right-auto top-full sm:top-0 sm:ml-1 w-44 rounded-xl border p-1 shadow-2xl z-50 backdrop-blur-2xl ${
                isDark
                  ? 'border-white/15 bg-[#1e1f20] text-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.9)]'
                  : 'border-slate-300 bg-white text-slate-800 shadow-2xl'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setRenamingSessionId(session._id);
                  setRenameValue(session.title);
                  setOpenMenuSessionId(null);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-white/10 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <Edit3 size={14} />
                  <span>Rename</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">R</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleCopy(session._id, window.location.href);
                  setOpenMenuSessionId(null);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs hover:bg-white/10 transition-colors text-left"
              >
                <Share2 size={14} />
                <span>Share</span>
              </button>

              <div className="h-px bg-white/10 my-1" />

              <button
                type="button"
                onClick={() => {
                  onDeleteSession?.(session._id);
                  setOpenMenuSessionId(null);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors font-medium text-left"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      {/* Top Header & Navigation */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden px-2 py-3">
        {/* Header row: Brand + Toggle Icon */}
        <div className="flex items-center justify-between px-2 py-1 mb-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <NikhilAILogo size={24} />
            <span className="font-semibold text-base tracking-tight text-white">
              NikhilGPT
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleSidebarExpanded}
              title="Collapse sidebar"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all hidden sm:flex"
            >
              <PanelLeftClose size={17} />
            </button>

            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              title="Close sidebar"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all sm:hidden flex"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Action List: Only New chat and Images */}
        <div className="space-y-0.5 shrink-0 mb-3">
          {/* New chat */}
          <button
            type="button"
            onClick={() => {
              if (onNewChat) onNewChat();
              else onClear();
              setIsMobileSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all text-slate-200 hover:bg-white/10 text-left"
          >
            <SquarePen size={18} className="text-slate-300 shrink-0" />
            <span>New chat</span>
          </button>

          {/* Images */}
          <button
            type="button"
            onClick={() => {
              handleToggleImageMode();
              setIsMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${
              activeImageMode
                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Images size={18} className="text-slate-300 shrink-0" />
              <span>Images</span>
            </div>
            {activeImageMode && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono">
                Active
              </span>
            )}
          </button>
        </div>

        {/* Recents Section */}
        <div className="flex-1 min-h-0 flex flex-col pt-2 border-t border-white/8">
          <div className="flex items-center justify-between px-3 py-1 mb-1 shrink-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Recents
            </span>
            {user && allSessions.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all chat history?')) {
                    onClearAllSessions?.();
                  }
                }}
                className="text-[10px] text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                title="Clear all chat history"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="space-y-0.5 overflow-y-auto pr-1 flex-1">
            {user ? (
              isSessionsLoading ? (
                <div className="px-3 py-2 text-xs text-slate-500 animate-pulse">
                  Loading chats...
                </div>
              ) : allSessions.length > 0 ? (
                allSessions.map((session) => renderSessionItem(session))
              ) : (
                <div className="px-3 py-2 text-xs text-slate-500 italic">
                  No previous chats yet
                </div>
              )
            ) : (
              <div className="p-3 my-1 rounded-xl bg-white/[0.03] border border-white/8 text-xs space-y-2">
                <p className="text-slate-400 leading-relaxed">
                  Chats reset on refresh in guest mode. Sign in to save your chat history!
                </p>
                <button
                  type="button"
                  onClick={() => openSignInModal({ title: 'Sign in to save chat history' })}
                  className="w-full py-1.5 px-3 rounded-lg font-semibold bg-white text-black hover:bg-slate-200 transition-all text-center"
                >
                  Sign in
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom User Profile Section (Matching screenshot exactly) */}
      <div className="p-2 border-t border-white/10 shrink-0">
        {user ? (
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors">
            <button
              type="button"
              onClick={() => openProfileModal?.()}
              className="flex items-center gap-2.5 min-w-0 text-left w-full"
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white shrink-0 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <span>{userInitial}</span>
                )}
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-black bg-emerald-500" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-white truncate">
                  {user.name || 'Nikhil Agrahari'}
                </span>
                <span className="text-xs text-slate-400 font-mono">Free</span>
              </div>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors">
            <button
              type="button"
              onClick={() => openSignInModal({ title: 'Sign in to save chat history' })}
              className="flex items-center gap-2.5 min-w-0 text-left flex-1"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-300 shrink-0">
                NA
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-white truncate">Guest User</span>
                <span className="text-xs text-slate-400">Ephemeral</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => openSignInModal({ title: 'Sign in to save chat history' })}
              className="text-xs px-2.5 py-1 rounded-full font-semibold bg-white text-black hover:bg-slate-200 transition-all shrink-0 font-medium"
            >
              Sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderSlimDock = () => (
    <aside
      className={`hidden sm:flex flex-col items-center justify-between py-3.5 px-2 w-14 border-r shrink-0 z-20 ${
        isDark ? 'border-white/10 bg-[#000000]' : 'border-slate-200 bg-[#f3f4f6]'
      }`}
    >
      <div className="flex flex-col items-center gap-3 w-full">
        {/* Toggle Expand Sidebar */}
        <button
          type="button"
          onClick={toggleSidebarExpanded}
          title="Expand sidebar"
          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
            isDark
              ? 'text-slate-400 hover:bg-white/10 hover:text-white'
              : 'text-slate-600 hover:bg-slate-200 hover:text-black'
          }`}
        >
          <PanelLeft size={18} />
        </button>

        {/* Nikhil AI Logo */}
        <button
          type="button"
          onClick={() => (onNewChat ? onNewChat() : onClear())}
          title="Nikhil AI — New conversation"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl transition-transform hover:scale-105 active:scale-95"
        >
          <NikhilAILogo size={32} />
        </button>

        {/* New Chat */}
        <button
          type="button"
          onClick={() => (onNewChat ? onNewChat() : onClear())}
          title="New chat"
          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
            isDark
              ? 'text-slate-400 hover:bg-white/10 hover:text-white'
              : 'text-slate-600 hover:bg-slate-200 hover:text-black'
          }`}
        >
          <SquarePen size={18} />
        </button>

        {/* Images */}
        <button
          type="button"
          onClick={handleToggleImageMode}
          title={
            activeImageMode
              ? 'Image Mode active (FLUX.2-dev) - click to switch back to chat'
              : 'Activate FLUX.2-dev Image Generator'
          }
          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
            activeImageMode
              ? isDark
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                : 'bg-sky-100 text-sky-700 border border-sky-300'
              : isDark
              ? 'text-slate-400 hover:bg-white/10 hover:text-white'
              : 'text-slate-600 hover:bg-slate-200 hover:text-black'
          }`}
        >
          <Images size={18} />
        </button>
      </div>

      {/* Bottom Avatar */}
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={toggleSidebarExpanded}
          title="Expand sidebar"
          className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          <span>{userInitial}</span>
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-black bg-emerald-500" />
        </button>
      </div>
    </aside>
  );

  if (!isOpen && !isStandalone) {
    return null;
  }

  const userInitial = user?.name ? user.name.slice(0, 2).toUpperCase() : 'NA';

  return (
    <AnimatePresence>
      <MotionDiv
        key="full-page-ai-chat"
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.99 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-0 z-[1000] flex h-screen w-screen overflow-hidden font-sans select-text ${
          isDark
            ? 'bg-[#0d0d0d] text-[#ececec]'
            : 'bg-[#f9f9f9] text-[#0d0d0d]'
        }`}
      >
        {/* Mobile Slide-out Drawer */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs sm:hidden"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 240 }}
                className={`fixed inset-y-0 left-0 z-50 w-72 sm:hidden border-r shadow-2xl flex flex-col ${
                  isDark ? 'bg-[#000000] border-white/10' : 'bg-[#f3f4f6] border-slate-200'
                }`}
              >
                {renderSidebarContent()}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ========================================================
            DESKTOP SIDEBAR: FULL EXPANDED VS SLIM DOCK (Direct ChatGPT style)
            ======================================================== */}
        {isSidebarExpanded ? (
          <aside
            className={`hidden sm:flex flex-col w-64 border-r shrink-0 z-20 h-full ${
              isDark ? 'border-white/10 bg-[#000000]' : 'border-slate-200 bg-[#f3f4f6]'
            }`}
          >
            {renderSidebarContent()}
          </aside>
        ) : (
          renderSlimDock()
        )}

        {/* ========================================================
            MAIN CHAT WORKSPACE
            ======================================================== */}
        <div className="flex flex-1 flex-col h-full min-w-0 relative overflow-hidden">
          {/* Top Bar */}
          <header
            className={`flex items-center justify-between px-4 sm:px-6 h-14 border-b shrink-0 z-10 transition-colors ${
              isDark
                ? 'border-white/8 bg-[#0d0d0d]'
                : 'border-slate-200 bg-white'
            }`}
          >
            {/* Left: Mobile / Collapse Button + Model Selector Dropdown */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(true)}
                title="Open chat history"
                className={`sm:hidden flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  isDark
                    ? 'text-slate-400 hover:bg-white/10 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <PanelLeft size={18} />
              </button>

              {!isSidebarExpanded && (
                <button
                  type="button"
                  onClick={toggleSidebarExpanded}
                  title="Open sidebar"
                  className={`hidden sm:flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                    isDark
                      ? 'text-slate-400 hover:bg-white/10 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <PanelLeft size={18} />
                </button>
              )}

              <div className="relative">
              <button
                type="button"
                onClick={() => setShowModelMenu((prev) => !prev)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                  isDark
                    ? 'text-slate-200 hover:bg-white/8'
                    : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Nikhil AI</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isDark
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : 'bg-sky-100 text-sky-800 border border-sky-300'
                    }`}
                  >
                    2.5 Flash + Grok
                  </span>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {/* Model Info Popover */}
              <AnimatePresence>
                {showModelMenu && (
                  <MotionDiv
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute left-0 mt-1.5 w-72 rounded-2xl border p-3.5 shadow-2xl z-50 backdrop-blur-xl ${
                      isDark
                        ? 'border-white/10 bg-[#171717] text-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
                        : 'border-slate-200 bg-white text-slate-900 shadow-2xl'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/8 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <span>Engine Pipeline</span>
                      <span className="text-emerald-400">Ultra-Fast</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/5">
                        <Zap size={16} className="text-sky-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold">Gemini 2.5 Flash</div>
                          <div className="text-[11px] text-slate-400">
                            Streaming UI tokens in ~2 seconds with smart fallback.
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/5">
                        <Sparkles size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold">Grok Knowledge Extractor</div>
                          <div className="text-[11px] text-slate-400">
                            Extracts targeted facts from portfolio dataset.
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/5">
                        <Images size={16} className="text-purple-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold">Cloudflare FLUX.2-dev</div>
                          <div className="text-[11px] text-slate-400">
                            Inline real AI image generation via /image command.
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/5">
                        <Library size={16} className="text-blue-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold">11 Knowledge Modules</div>
                          <div className="text-[11px] text-slate-400">
                            Resume, Projects, Skills, Timeline, Certs & FAQs.
                          </div>
                        </div>
                      </div>
                    </div>
                  </MotionDiv>
                )}
              </AnimatePresence>
            </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Image Credits Badge (Guest trial vs Authenticated daily) */}
              {user ? (
                <div
                  title="Daily FLUX.2-dev image credits (resets midnight UTC). Text chat is always unlimited!"
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                    isDark
                      ? 'border-sky-500/30 bg-sky-500/10 text-sky-300'
                      : 'border-sky-300 bg-sky-50 text-sky-800'
                  }`}
                >
                  <span>{imageQuota ? `${imageQuota.remaining}/10 credits` : '10/10 credits'}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    openSignInModal({
                      title: 'Sign in for 10 daily AI image credits',
                      message:
                        'Sign in or register for free to unlock 10 daily image generations. Text chat is always free & unlimited!',
                    })
                  }
                  title="Guest trial credits. Click to sign in and unlock 10 credits every day! Text chat is unlimited."
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-transform hover:scale-105 active:scale-95 ${
                    (imageQuota?.remaining ?? 2) > 0
                      ? isDark
                        ? 'border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20'
                        : 'border-purple-300 bg-purple-50 text-purple-800'
                      : isDark
                      ? 'border-amber-500/40 bg-amber-500/15 text-amber-300 animate-pulse'
                      : 'border-amber-400 bg-amber-50 text-amber-800'
                  }`}
                >
                  <span>
                    {(imageQuota?.remaining ?? 2) > 0
                      ? `${imageQuota?.remaining ?? 2}/2 guest credit${(imageQuota?.remaining ?? 2) === 1 ? '' : 's'}`
                      : 'Sign in for credits'}
                  </span>
                </button>
              )}

              {/* Mobile Images Tab toggle */}
              <button
                type="button"
                onClick={handleStartImagePrompt}
                title="Create Image (/image)"
                className={`sm:hidden flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  inputValue.trim().toLowerCase().startsWith('/image')
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                    : isDark
                    ? 'text-slate-400 hover:bg-white/10 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Images size={16} />
              </button>

              {/* Mobile New Chat */}
              <button
                type="button"
                onClick={onClear}
                title="New chat"
                className={`sm:hidden flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  isDark
                    ? 'text-slate-400 hover:bg-white/10 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <SquarePen size={16} />
              </button>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  isDark
                    ? 'text-slate-400 hover:bg-white/10 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* Close / Back to Portfolio button */}
              <button
                type="button"
                onClick={onClose}
                title="Back to Portfolio (Esc)"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all hover:scale-105 active:scale-95 ${
                  isDark
                    ? 'border-white/15 bg-white/8 text-slate-200 hover:bg-white/15 hover:text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-xs'
                }`}
              >
                <span>Back</span>
                <span className="hidden sm:inline-block text-[10px] opacity-60 font-mono">Esc</span>
                <X size={14} className="ml-0.5" />
              </button>
            </div>
          </header>

          {/* ========================================================
              CHAT AREA: EMPTY STATE VS CONVERSATION STATE
              ======================================================== */}
          <main
            ref={containerRef}
            onScroll={handleScroll}
            data-lenis-prevent="true"
            data-lenis-prevent-touch="true"
            className="flex-1 overflow-y-auto flex flex-col relative"
          >
            {!hasMessages ? (
                /* ========================================================
                   EMPTY STATE (IDENTICAL TO CHATGPT DESKTOP SCREENSHOT)
                   ======================================================== */
                <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-2xl w-full mx-auto my-auto select-none">
                  {/* Big Centered Heading */}
                  <MotionH1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`text-3xl sm:text-4xl md:text-[2.65rem] font-semibold tracking-tight text-center mb-8 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    What’s on your mind today?
                  </MotionH1>

                  {/* Centered Capsule Input Box (Matching screenshot) */}
                  <MotionDiv
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 }}
                    className="w-full relative"
                  >
                    <div
                      className={`w-full rounded-3xl border transition-all duration-200 shadow-2xl p-3 sm:p-3.5 flex flex-col gap-2 ${
                        isDark
                          ? 'border-white/12 bg-[#212121] focus-within:border-white/25 focus-within:shadow-[0_0_30px_rgba(255,255,255,0.06)]'
                          : 'border-slate-300 bg-white focus-within:border-slate-400 shadow-xl'
                      }`}
                    >
                      {/* Slash Command / Multi-Model Studio Banner & Model Selector */}
                      {activeImageMode && (
                        <div
                          className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-2xl transition-all mx-1 mb-0.5 ${
                            isDark
                              ? 'bg-white/[0.04] border border-white/10'
                              : 'bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {/* Left: Gemini-style Model Selector Pill & Dropdown */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowImageModelPicker((prev) => !prev)}
                              title="Switch AI image generation model"
                              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                                isDark
                                  ? 'bg-[#282a2c] hover:bg-[#37393b] text-white border border-white/10 shadow-sm'
                                  : 'bg-slate-200 hover:bg-slate-300 text-slate-900 border border-slate-300 shadow-sm'
                              }`}
                            >
                              <span>{currentModel.name}</span>
                              <ChevronDown
                                size={14}
                                className={`text-slate-400 transition-transform duration-200 ${
                                  showImageModelPicker ? 'rotate-180' : ''
                                }`}
                              />
                            </button>

                            {/* Google Gemini Model Selection Dropdown Menu */}
                            {renderGeminiModelMenu('down')}
                          </div>

                          {/* Right: Shared Credits & Exit Button */}
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 font-sans">
                              {user
                                ? `${imageQuota?.remaining ?? 10}/10 daily credits`
                                : `${imageQuota?.remaining ?? 2}/2 guest credits`}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setIsImageMode(false);
                                setShowImageModelPicker(false);
                                if (inputValue.trim().toLowerCase().startsWith('/image')) {
                                  onInputChange(inputValue.replace(/^\/image\s*/i, ''));
                                }
                              }}
                              title="Turn off image model"
                              className="text-slate-400 hover:text-white p-1 rounded-full transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Text Area */}
                      <div className="flex items-start gap-2.5 px-1 pt-1">
                        <textarea
                          ref={localTextareaRef}
                          value={inputValue}
                          onChange={(e) => onInputChange(e.target.value)}
                          onKeyDown={handleKeyDownInternal}
                          placeholder={
                            activeImageMode
                              ? `Describe the image you want to generate with ${currentModel.name}...`
                              : 'Ask Nikhil AI...'
                          }
                          rows={1}
                          disabled={isLoading || isStreaming}
                          className={`ai-chat-textarea w-full resize-none border-0 bg-transparent text-base sm:text-[1.05rem] leading-relaxed outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${
                            isDark
                              ? 'text-white placeholder-slate-500'
                              : 'text-slate-900 placeholder-slate-400'
                          }`}
                          style={{
                            scrollbarWidth: 'none',
                            maxHeight: '140px',
                            outline: 'none',
                            border: 'none',
                            boxShadow: 'none',
                          }}
                        />
                      </div>

                      {/* Capsule Bottom Row: Left '+' & Image Model Button, Right Controls (Think, Mic, Submit) */}
                      <div className="flex items-center justify-between pt-1">
                        {/* Left: Quick Actions Popover (+) & Image Model Button */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowPlusMenu((prev) => !prev)}
                              title="Quick topics and suggestions"
                              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                                showPlusMenu
                                  ? isDark
                                    ? 'border-white/30 bg-white/20 text-white'
                                    : 'border-slate-400 bg-slate-200 text-black'
                                  : isDark
                                  ? 'border-white/10 hover:border-white/25 hover:bg-white/10 text-slate-400 hover:text-white'
                                  : 'border-slate-300 hover:bg-slate-100 text-slate-600'
                              }`}
                            >
                              <Plus size={16} />
                            </button>

                            {/* Plus Popover (Opens below the capsule in empty state) */}
                            <AnimatePresence>
                              {showPlusMenu && (
                                <MotionDiv
                                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                                  transition={{ duration: 0.15 }}
                                  className={`absolute left-0 top-full mt-2.5 w-72 rounded-2xl border p-2.5 shadow-2xl z-50 backdrop-blur-xl ${
                                    isDark
                                      ? 'border-white/12 bg-[#1b1b1b] text-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
                                      : 'border-slate-200 bg-white text-slate-900 shadow-2xl'
                                  }`}
                                >
                                  <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Quick Knowledge Topics
                                  </div>
                                  <div className="flex flex-col gap-1 mt-1">
                                    {KNOWLEDGE_TOPICS.map((topic) => {
                                      const Icon = topic.icon;
                                      return (
                                        <button
                                          key={topic.id}
                                          type="button"
                                          onClick={() => handlePromptClick(`Tell me about Nikhil's ${topic.name}`)}
                                          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-left transition-all ${
                                            isDark
                                              ? 'hover:bg-white/8 text-slate-200'
                                              : 'hover:bg-slate-100 text-slate-800'
                                          }`}
                                        >
                                          <Icon size={14} className="text-sky-400 shrink-0" />
                                          <div className="min-w-0 flex-1 truncate">
                                            <div className="font-semibold">{topic.name}</div>
                                            <div className="text-[10px] text-slate-400 truncate">{topic.desc}</div>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </MotionDiv>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Image Model Toggle Button (Right side of '+' icon) */}
                          <button
                            type="button"
                            onClick={handleToggleImageMode}
                            title={
                              activeImageMode
                                ? 'Image Mode active - click to switch back to chat'
                                : 'Activate AI Image Studio'
                            }
                            className={`flex h-8 items-center gap-1.5 px-2.5 rounded-full border text-xs font-medium transition-all ${
                              activeImageMode
                                ? isDark
                                  ? 'border-sky-500/60 bg-sky-500/20 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                                  : 'border-sky-400 bg-sky-100 text-sky-800'
                                : isDark
                                ? 'border-white/10 hover:border-white/25 hover:bg-white/10 text-slate-400 hover:text-white'
                                : 'border-slate-300 hover:bg-slate-100 text-slate-600'
                            }`}
                          >
                            <ImageIcon size={15} className={activeImageMode ? 'text-sky-400' : ''} />
                            <span>{activeImageMode ? currentModel.name : 'Image'}</span>
                          </button>
                        </div>

                        {/* Right: Think Pill, Mic, and Circular Send Button (Matching screenshot!) */}
                        <div className="flex items-center gap-2">
                          {/* Think Pill Button */}
                          <button
                            type="button"
                            onClick={onToggleDeepThink}
                            title={isDeepThink ? 'Deep Think: Active' : 'Enable Deep Think'}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                              isDeepThink
                                ? isDark
                                  ? 'border-sky-500/50 bg-sky-500/15 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                                  : 'border-sky-500 bg-sky-50 text-sky-800 shadow-xs'
                                : isDark
                                ? 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                                : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <Brain size={14} className={isDeepThink ? 'text-sky-400 animate-pulse' : ''} />
                            <span>Think</span>
                          </button>

                          {/* Mic Button */}
                          <button
                            type="button"
                            onClick={toggleSpeechRecognition}
                            title={isMicActive ? 'Listening... click to stop' : 'Voice input'}
                            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                              isMicActive
                                ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.6)]'
                                : isDark
                                ? 'text-slate-400 hover:text-white hover:bg-white/10'
                                : 'text-slate-600 hover:text-black hover:bg-slate-100'
                            }`}
                          >
                            {isMicActive ? <MicOff size={16} /> : <Mic size={16} />}
                          </button>

                          {/* Send / Action Button (Circular blue button matching screenshot!) */}
                          <button
                            type="button"
                            onClick={() => inputValue.trim() && handleSendIntercept()}
                            disabled={!inputValue.trim() || isLoading || isStreaming}
                            title="Send prompt"
                            className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-all ${
                              inputValue.trim()
                                ? 'bg-[#2563eb] hover:bg-blue-600 text-white shadow-md active:scale-90'
                                : isDark
                                ? 'bg-white/10 text-slate-500 cursor-not-allowed'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            <ArrowUp size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </MotionDiv>

                  {/* Quick Action Prompt List Below Input (Matching screenshot exactly) */}
                  <MotionDiv
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.12 }}
                    className="w-full mt-6 flex flex-col gap-2"
                  >
                    {SUGGESTED_CARDS.map((card, i) => {
                      const CardIcon = card.icon;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            if (card.isImagePrompt) {
                              handleStartImagePrompt();
                            } else {
                              handlePromptClick(card.query);
                            }
                          }}
                          className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left transition-all ${
                            isDark
                              ? 'hover:bg-white/5 text-slate-300 hover:text-white'
                              : 'hover:bg-slate-200/70 text-slate-700 hover:text-slate-950'
                          }`}
                        >
                          <CardIcon
                            size={17}
                            className={isDark ? 'text-slate-400 shrink-0' : 'text-slate-600 shrink-0'}
                          />
                          <span className="text-sm font-medium">{card.title}</span>
                        </button>
                      );
                    })}
                  </MotionDiv>
                </div>
              ) : (
              /* ========================================================
                 CONVERSATION STATE (CHATGPT THREAD VIEW)
                 ======================================================== */
              <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 pb-36 flex flex-col gap-6">
                {messages.map((message) => {
                  const isUser = message.role === 'user';
                  const isError = message.isError;
                  const isSpeakingThis = speakingId === message.id;
                  const isCopiedThis = copiedId === message.id;

                  if (isUser) {
                    return (
                      <div key={message.id} className="flex justify-end w-full">
                        <div
                          className={`max-w-[85%] rounded-3xl px-5 py-3 text-base leading-relaxed break-words shadow-sm ${
                            isDark
                              ? 'bg-[#2f2f2f] text-slate-100'
                              : 'bg-slate-200 text-slate-900 font-medium'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    );
                  }

                  if (message.type === 'image') {
                    return (
                      <div key={message.id} className="flex items-start gap-3 w-full">
                        {/* Nikhil AI Avatar */}
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 mt-1 shadow-xs">
                          <NikhilAILogo size={22} />
                        </div>

                        {/* Inline Image Component */}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-2">
                            <span>Nikhil AI</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 font-mono font-medium border border-sky-500/30">
                              FLUX.2-dev
                            </span>
                          </div>

                          <InlineAIImageMessage
                            image={message.image}
                            onRegenerate={() => onSend(`/image ${message.image?.prompt}`)}
                          />
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={message.id} className="flex items-start gap-3 w-full">
                      {/* Nikhil AI Avatar */}
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 mt-1 shadow-xs">
                        <NikhilAILogo size={22} />
                      </div>

                      {/* AI Content & Action Bar */}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-400 mb-1.5">
                          Nikhil AI
                        </div>

                        {/* Markdown Body */}
                        <div
                          className={`text-base leading-relaxed break-words ${
                            isError
                              ? 'text-rose-400 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20'
                              : isDark
                              ? 'text-slate-200'
                              : 'text-slate-900'
                          }`}
                        >
                          {message.content ? (
                            <AIMarkdownRenderer content={message.content} />
                          ) : (
                            /* Typing dot animation */
                            <div className="flex items-center gap-1.5 py-2">
                              <span className="h-2 w-2 rounded-full bg-sky-400 animate-bounce" />
                              <span className="h-2 w-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.15s]" />
                              <span className="h-2 w-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.3s]" />
                            </div>
                          )}
                        </div>

                        {/* Action buttons below response (Copy, TTS, Feedback, Regenerate) */}
                        {!message.isStreaming && message.content && (
                          <div className="flex items-center gap-2 mt-3 pt-2 text-slate-400 text-xs">
                            {/* Copy button */}
                            <button
                              type="button"
                              onClick={() => handleCopy(message.id, message.content)}
                              title="Copy response"
                              className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
                                isDark
                                  ? 'hover:bg-white/10 hover:text-white'
                                  : 'hover:bg-slate-200 hover:text-black'
                              }`}
                            >
                              {isCopiedThis ? (
                                <>
                                  <Check size={13} className="text-emerald-400" />
                                  <span className="text-emerald-400 text-[11px]">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={13} />
                                  <span className="text-[11px]">Copy</span>
                                </>
                              )}
                            </button>

                            {/* Text to Speech button */}
                            <button
                              type="button"
                              onClick={() => toggleSpeechSynthesis(message.id, message.content)}
                              title={isSpeakingThis ? 'Stop speaking' : 'Read aloud'}
                              className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
                                isSpeakingThis
                                  ? 'text-sky-400 bg-sky-500/10'
                                  : isDark
                                  ? 'hover:bg-white/10 hover:text-white'
                                  : 'hover:bg-slate-200 hover:text-black'
                              }`}
                            >
                              {isSpeakingThis ? <VolumeX size={13} /> : <Volume2 size={13} />}
                              <span className="text-[11px]">{isSpeakingThis ? 'Stop' : 'Listen'}</span>
                            </button>

                            {/* Thumbs Up */}
                            <button
                              type="button"
                              onClick={() => handleFeedback(message.id, 'up')}
                              title="Good response"
                              className={`p-1 rounded-lg transition-all ${
                                feedbackMap[message.id] === 'up'
                                  ? 'text-emerald-400 bg-emerald-500/10'
                                  : isDark
                                  ? 'hover:bg-white/10 hover:text-white'
                                  : 'hover:bg-slate-200 hover:text-black'
                              }`}
                            >
                              <ThumbsUp size={13} />
                            </button>

                            {/* Thumbs Down */}
                            <button
                              type="button"
                              onClick={() => handleFeedback(message.id, 'down')}
                              title="Poor response"
                              className={`p-1 rounded-lg transition-all ${
                                feedbackMap[message.id] === 'down'
                                  ? 'text-rose-400 bg-rose-500/10'
                                  : isDark
                                  ? 'hover:bg-white/10 hover:text-white'
                                  : 'hover:bg-slate-200 hover:text-black'
                              }`}
                            >
                              <ThumbsDown size={13} />
                            </button>

                            {/* Retry / Regenerate */}
                            {onRegenerate && (
                              <button
                                type="button"
                                onClick={onRegenerate}
                                title="Regenerate response"
                                className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
                                  isDark
                                    ? 'hover:bg-white/10 hover:text-white'
                                    : 'hover:bg-slate-200 hover:text-black'
                                }`}
                              >
                                <RotateCcw size={13} />
                                <span className="text-[11px]">Retry</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} className="h-4" aria-hidden="true" />
              </div>
            )}
          </main>

          {/* ========================================================
              PINNED BOTTOM INPUT CAPSULE (WHEN CHATTING)
              ======================================================== */}
          {hasMessages && (
            <div
              className={`absolute bottom-0 inset-x-0 pt-6 pb-4 px-4 sm:px-6 pointer-events-none ${
                isDark
                  ? 'bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/90 to-transparent'
                  : 'bg-gradient-to-t from-[#f9f9f9] via-[#f9f9f9]/90 to-transparent'
              }`}
            >
              <div className="max-w-3xl w-full mx-auto pointer-events-auto">
                {/* Scroll to bottom button */}
                <AnimatePresence>
                  {showScrollBottom && (
                    <div className="flex justify-center mb-2">
                      <MotionButton
                        type="button"
                        onClick={scrollToBottom}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-lg border backdrop-blur-md transition-transform hover:scale-105 active:scale-95 ${
                          isDark
                            ? 'border-white/15 bg-[#1f1f1f]/95 text-slate-200'
                            : 'border-slate-300 bg-white text-slate-800'
                        }`}
                      >
                        <span>Scroll down</span>
                        <ChevronDown size={14} />
                      </MotionButton>
                    </div>
                  )}
                </AnimatePresence>

                {/* Capsule Input Box */}
                <div
                  className={`w-full rounded-3xl border transition-all duration-200 shadow-2xl p-3 sm:p-3.5 flex flex-col gap-2 ${
                    isDark
                      ? 'border-white/12 bg-[#212121] focus-within:border-white/25 shadow-[0_0_40px_rgba(0,0,0,0.6)]'
                      : 'border-slate-300 bg-white focus-within:border-slate-400 shadow-xl'
                  }`}
                >
                  {/* Slash Command / Multi-Model Studio Banner & Model Selector */}
                  {activeImageMode && (
                    <div
                      className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-2xl transition-all mx-1 mb-0.5 ${
                        isDark
                          ? 'bg-white/[0.04] border border-white/10'
                          : 'bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {/* Left: Gemini-style Model Selector Pill & Dropdown (Upward) */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowImageModelPicker((prev) => !prev)}
                          title="Switch AI image generation model"
                          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                            isDark
                              ? 'bg-[#282a2c] hover:bg-[#37393b] text-white border border-white/10 shadow-sm'
                              : 'bg-slate-200 hover:bg-slate-300 text-slate-900 border border-slate-300 shadow-sm'
                          }`}
                        >
                          <span>{currentModel.name}</span>
                          <ChevronDown
                            size={14}
                            className={`text-slate-400 transition-transform duration-200 ${
                              showImageModelPicker ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {/* Google Gemini Model Selection Dropdown Menu (Upward) */}
                        {renderGeminiModelMenu('up')}
                      </div>

                      {/* Right: Shared Credits & Exit Button */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-sans">
                          {user
                            ? `${imageQuota?.remaining ?? 10}/10 daily credits`
                            : `${imageQuota?.remaining ?? 2}/2 guest credits`}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsImageMode(false);
                            setShowImageModelPicker(false);
                            if (inputValue.trim().toLowerCase().startsWith('/image')) {
                              onInputChange(inputValue.replace(/^\/image\s*/i, ''));
                            }
                          }}
                          title="Turn off image model"
                          className="text-slate-400 hover:text-white p-1 rounded-full transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Textarea */}
                  <div className="flex items-start gap-2.5 px-1 pt-1">
                    <textarea
                      ref={localTextareaRef}
                      value={inputValue}
                      onChange={(e) => onInputChange(e.target.value)}
                      onKeyDown={handleKeyDownInternal}
                      placeholder={
                        activeImageMode
                          ? `Describe the image you want to generate with ${currentModel.name}...`
                          : 'Ask Nikhil AI...'
                      }
                      rows={1}
                      disabled={isLoading || isStreaming}
                      className={`ai-chat-textarea w-full resize-none border-0 bg-transparent text-base leading-relaxed outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${
                        isDark
                          ? 'text-white placeholder-slate-500'
                          : 'text-slate-900 placeholder-slate-400'
                      }`}
                      style={{
                        scrollbarWidth: 'none',
                        maxHeight: '140px',
                        outline: 'none',
                        border: 'none',
                        boxShadow: 'none',
                      }}
                    />
                  </div>

                  {/* Bottom Row inside capsule */}
                  <div className="flex items-center justify-between pt-1">
                    {/* Left: Quick Actions Popover (+) & Image Model Button */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowPlusMenu((prev) => !prev)}
                          title="Quick topics"
                          className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                            isDark
                              ? 'border-white/10 hover:border-white/25 hover:bg-white/10 text-slate-400 hover:text-white'
                              : 'border-slate-300 hover:bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Plus size={16} />
                        </button>

                        {/* Plus Popover */}
                        <AnimatePresence>
                          {showPlusMenu && (
                            <MotionDiv
                              initial={{ opacity: 0, y: 6, scale: 0.96 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 6, scale: 0.96 }}
                              transition={{ duration: 0.15 }}
                              className={`absolute left-0 bottom-full mb-2 w-64 rounded-2xl border p-2 shadow-2xl z-50 backdrop-blur-xl ${
                                isDark
                                  ? 'border-white/12 bg-[#1b1b1b] text-slate-200'
                                  : 'border-slate-200 bg-white text-slate-900 shadow-2xl'
                              }`}
                            >
                              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Insert Topic
                              </div>
                              <div className="flex flex-col gap-1 mt-1">
                                {KNOWLEDGE_TOPICS.map((topic) => {
                                  const Icon = topic.icon;
                                  return (
                                    <button
                                      key={topic.id}
                                      type="button"
                                      onClick={() => handlePromptClick(`Tell me about Nikhil's ${topic.name}`)}
                                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-left transition-all ${
                                        isDark
                                          ? 'hover:bg-white/8 text-slate-200'
                                          : 'hover:bg-slate-100 text-slate-800'
                                      }`}
                                    >
                                      <Icon size={14} className="text-sky-400 shrink-0" />
                                      <div className="min-w-0 flex-1 truncate">
                                        <div className="font-semibold">{topic.name}</div>
                                        <div className="text-[10px] text-slate-400 truncate">{topic.desc}</div>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </MotionDiv>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Image Model Toggle Button (Right side of '+' icon) */}
                      <button
                        type="button"
                        onClick={handleToggleImageMode}
                        title={
                          activeImageMode
                            ? 'Image Mode active - click to switch back to chat'
                            : 'Activate AI Image Studio'
                        }
                        className={`flex h-8 items-center gap-1.5 px-2.5 rounded-full border text-xs font-medium transition-all ${
                          activeImageMode
                            ? isDark
                              ? 'border-sky-500/60 bg-sky-500/20 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                              : 'border-sky-400 bg-sky-100 text-sky-800'
                            : isDark
                            ? 'border-white/10 hover:border-white/25 hover:bg-white/10 text-slate-400 hover:text-white'
                            : 'border-slate-300 hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <ImageIcon size={15} className={activeImageMode ? 'text-sky-400' : ''} />
                        <span>{activeImageMode ? currentModel.name : 'Image'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Think pill */}
                      <button
                        type="button"
                        onClick={onToggleDeepThink}
                        title={isDeepThink ? 'Deep Think: Active' : 'Enable Deep Think'}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                          isDeepThink
                            ? isDark
                              ? 'border-sky-500/50 bg-sky-500/15 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                              : 'border-sky-500 bg-sky-50 text-sky-800 shadow-xs'
                            : isDark
                            ? 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                            : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Brain size={14} className={isDeepThink ? 'text-sky-400 animate-pulse' : ''} />
                        <span>Think</span>
                      </button>

                      {/* Mic Button */}
                      <button
                        type="button"
                        onClick={toggleSpeechRecognition}
                        title={isMicActive ? 'Listening...' : 'Voice input'}
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                          isMicActive
                            ? 'bg-rose-500 text-white animate-pulse'
                            : isDark
                            ? 'text-slate-400 hover:text-white hover:bg-white/10'
                            : 'text-slate-600 hover:text-black hover:bg-slate-100'
                        }`}
                      >
                        {isMicActive ? <MicOff size={16} /> : <Mic size={16} />}
                      </button>

                      {/* Send / Stop button */}
                      {isStreaming ? (
                        <button
                          type="button"
                          onClick={onStop}
                          title="Stop generating"
                          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-md active:scale-90 transition-all"
                        >
                          <Square size={13} className="fill-current" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => inputValue.trim() && handleSendIntercept()}
                          disabled={!inputValue.trim() || isLoading}
                          title="Send prompt"
                          className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-all ${
                            inputValue.trim()
                              ? 'bg-[#2563eb] hover:bg-blue-600 text-white shadow-md active:scale-90'
                              : isDark
                              ? 'bg-white/10 text-slate-500 cursor-not-allowed'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <ArrowUp size={16} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-center mt-2 text-[11px] text-slate-500 select-none">
                  Nikhil AI can make mistakes. Verify important details.
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              KNOWLEDGE BASE LIBRARY DRAWER (MODAL OVERLAY)
              ======================================================== */}
          <AnimatePresence>
            {showLibraryDrawer && (
              <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex justify-end"
                onClick={() => setShowLibraryDrawer(false)}
              >
                <MotionDiv
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                  className={`w-full max-w-sm h-full p-6 flex flex-col border-l overflow-y-auto ${
                    isDark
                      ? 'border-white/10 bg-[#121212] text-slate-100'
                      : 'border-slate-200 bg-white text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between pb-4 border-b border-white/8">
                    <div className="flex items-center gap-2">
                      <Library size={18} className="text-sky-400" />
                      <h3 className="font-bold text-base">Knowledge Base</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowLibraryDrawer(false)}
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 mt-3 mb-4">
                    Nikhil AI is trained on 11 rich markdown files covering Nikhil Agrahari’s background, skills, and projects.
                  </p>

                  <div className="flex flex-col gap-2.5">
                    {KNOWLEDGE_TOPICS.map((topic) => {
                      const Icon = topic.icon;
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => {
                            setShowLibraryDrawer(false);
                            handlePromptClick(`Give me a detailed overview of Nikhil's ${topic.name}`);
                          }}
                          className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition-all ${
                            isDark
                              ? 'border-white/8 bg-white/4 hover:border-sky-500/40 hover:bg-sky-500/10'
                              : 'border-slate-200 bg-slate-50 hover:border-sky-500/40 hover:bg-sky-50'
                          }`}
                        >
                          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 shrink-0">
                            <Icon size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold flex items-center justify-between">
                              <span>{topic.name}</span>
                              <ChevronRight size={14} className="text-slate-400" />
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">{topic.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </MotionDiv>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </MotionDiv>
    </AnimatePresence>
  );
};

export default AIChatPanel;
