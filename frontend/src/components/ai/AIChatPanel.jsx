import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  Award,
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
  Loader2,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useUserAuth } from '@/context/UserAuthContext';
import { transcribeVoiceAudio } from '@/services/ai.service';
import AIMarkdownRenderer from './AIMarkdownRenderer';
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
  { id: 'certificates', name: 'Certifications', icon: Award, desc: 'TryHackMe, Python, Security' },
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMenuSessionId, setOpenMenuSessionId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [renamingSessionId, setRenamingSessionId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  const [isMicActive, setIsMicActive] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceMode, setVoiceMode] = useState(null);
  const [voiceError, setVoiceError] = useState(null);
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
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaChunksRef = useRef([]);
  const silenceTimerRef = useRef(null);
  const speechEndTimerRef = useRef(null);
  const audioCtxRef = useRef(null);
  const rafVoiceRef = useRef(null);
  const prefixInputRef = useRef('');
  const finalTranscriptRef = useRef('');
  const interimTranscriptRef = useRef('');
  const speechFallbackTriggeredRef = useRef(false);
  const cancelVoiceRef = useRef(false);
  const dispatchVoicePromptRef = useRef(null);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
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

  const cleanupVoiceResources = useCallback(() => {
    clearTimeout(speechEndTimerRef.current);
    clearTimeout(silenceTimerRef.current);
    if (rafVoiceRef.current) {
      cancelAnimationFrame(rafVoiceRef.current);
      rafVoiceRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.abort?.();
      } catch {
        // ignore
      }
      if (mediaRecorderRef.current?.state === 'recording') {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // ignore
        }
      }
      cleanupVoiceResources();
    };
  }, [cleanupVoiceResources]);

  const startMediaRecorderVoice = async () => {
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia ||
      typeof MediaRecorder === 'undefined'
    ) {
      setVoiceError('Microphone recording is not supported in this browser.');
      setIsMicActive(false);
      setVoiceMode(null);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const candidateTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
      ];
      const chosenMime =
        candidateTypes.find((type) => MediaRecorder.isTypeSupported?.(type)) || '';

      const recorder = chosenMime
        ? new MediaRecorder(stream, { mimeType: chosenMime })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      mediaChunksRef.current = [];
      cancelVoiceRef.current = false;

      recorder.ondataavailable = (evt) => {
        if (evt.data && evt.data.size > 0) {
          mediaChunksRef.current.push(evt.data);
        }
      };

      recorder.onstop = async () => {
        const wasCancelled = cancelVoiceRef.current;
        const recordedType = recorder.mimeType || chosenMime || 'audio/webm';
        const chunks = [...mediaChunksRef.current];
        mediaChunksRef.current = [];
        mediaRecorderRef.current = null;
        cleanupVoiceResources();
        setIsMicActive(false);
        setVoiceMode(null);

        if (wasCancelled || chunks.length === 0) {
          return;
        }

        const blob = new Blob(chunks, { type: recordedType });
        if (blob.size < 400) {
          setVoiceError('No speech detected. Speak clearly and try again.');
          return;
        }

        setIsTranscribing(true);
        try {
          const base64Audio = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const res = String(reader.result || '');
              const idx = res.indexOf(',');
              resolve(idx >= 0 ? res.slice(idx + 1) : res);
            };
            reader.onerror = () => reject(new Error('Failed to read recorded audio.'));
            reader.readAsDataURL(blob);
          });

          const transcript = await transcribeVoiceAudio({
            audioBase64: base64Audio,
            mimeType: recordedType,
          });

          if (!transcript) {
            setVoiceError('Could not hear clear speech. Please try again.');
            return;
          }

          const combined = (
            prefixInputRef.current ? `${prefixInputRef.current} ${transcript}` : transcript
          )
            .replace(/\s+/g, ' ')
            .trim();
          onInputChange(combined);

          setTimeout(() => {
            dispatchVoicePromptRef.current?.(transcript);
          }, 120);
        } catch (err) {
          setVoiceError(err?.message || 'Voice transcription failed. Please try again.');
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start(250);
      setIsMicActive(true);
      setVoiceMode('recorder');

      // Monitor mic volume to auto-stop after 1.8s of silence once speech starts (max 30s)
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioCtxRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 512;
          source.connect(analyser);
          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          let heardSpeech = false;
          let silentSince = null;
          const startedAt = Date.now();

          const pollVolume = () => {
            if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') {
              return;
            }
            analyser.getByteTimeDomainData(dataArray);
            let peak = 0;
            for (let i = 0; i < dataArray.length; i += 1) {
              const delta = Math.abs(dataArray[i] - 128);
              if (delta > peak) peak = delta;
            }

            const now = Date.now();
            if (peak > 8) {
              heardSpeech = true;
              silentSince = null;
            } else if (heardSpeech) {
              if (!silentSince) silentSince = now;
              if (now - silentSince > 1800) {
                recorder.stop();
                return;
              }
            }

            if (now - startedAt > 30000) {
              recorder.stop();
              return;
            }

            rafVoiceRef.current = requestAnimationFrame(pollVolume);
          };

          rafVoiceRef.current = requestAnimationFrame(pollVolume);
        } else {
          silenceTimerRef.current = setTimeout(() => {
            if (mediaRecorderRef.current?.state === 'recording') {
              mediaRecorderRef.current.stop();
            }
          }, 25000);
        }
      } catch {
        // Fallback relies on manual stop button
      }
    } catch (err) {
      cleanupVoiceResources();
      setIsMicActive(false);
      setVoiceMode(null);
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setVoiceError(
          'Microphone permission blocked. Allow mic access in browser settings and try again.'
        );
      } else if (err?.name === 'NotFoundError') {
        setVoiceError('No microphone detected on this device.');
      } else {
        setVoiceError('Unable to access microphone. Check device permissions.');
      }
    }
  };

  const cancelVoiceCapture = () => {
    cancelVoiceRef.current = true;
    clearTimeout(speechEndTimerRef.current);
    clearTimeout(silenceTimerRef.current);
    try {
      recognitionRef.current?.abort?.();
    } catch {
      // ignore
    }
    if (mediaRecorderRef.current?.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    } else {
      cleanupVoiceResources();
      setIsMicActive(false);
      setVoiceMode(null);
    }
    if (prefixInputRef.current) {
      onInputChange(prefixInputRef.current);
    } else if (interimTranscriptRef.current) {
      onInputChange('');
    }
  };

  // Voice dictation + auto-transcribe + auto-submit for answer
  const toggleSpeechRecognition = () => {
    if (isTranscribing || isLoading || isStreaming) return;
    setVoiceError(null);

    if (isMicActive) {
      cancelVoiceRef.current = false;
      clearTimeout(speechEndTimerRef.current);
      if (voiceMode === 'recorder' && mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      } else {
        try {
          recognitionRef.current?.stop();
        } catch {
          setIsMicActive(false);
          setVoiceMode(null);
        }
      }
      return;
    }

    prefixInputRef.current = inputValue.trim();
    finalTranscriptRef.current = '';
    interimTranscriptRef.current = '';
    speechFallbackTriggeredRef.current = false;
    cancelVoiceRef.current = false;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      startMediaRecorderVoice();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsMicActive(true);
        setVoiceMode('speech');
      };

      recognition.onresult = (event) => {
        let finalText = '';
        let interimText = '';

        for (let i = 0; i < event.results.length; i += 1) {
          const piece = event.results[i][0]?.transcript || '';
          if (event.results[i].isFinal) {
            finalText += `${piece} `;
          } else {
            interimText += `${piece} `;
          }
        }

        finalTranscriptRef.current = finalText.replace(/\s+/g, ' ').trim();
        const combinedSpoken = `${finalText} ${interimText}`.replace(/\s+/g, ' ').trim();
        interimTranscriptRef.current = combinedSpoken;

        if (combinedSpoken) {
          const liveBoxValue = prefixInputRef.current
            ? `${prefixInputRef.current} ${combinedSpoken}`
            : combinedSpoken;
          onInputChange(liveBoxValue);
        }

        clearTimeout(speechEndTimerRef.current);
        if (combinedSpoken) {
          speechEndTimerRef.current = setTimeout(() => {
            try {
              recognition.stop();
            } catch {
              // ignore
            }
          }, 1600);
        }
      };

      recognition.onerror = (event) => {
        const errCode = event?.error;
        clearTimeout(speechEndTimerRef.current);

        if (cancelVoiceRef.current) {
          setIsMicActive(false);
          setVoiceMode(null);
          return;
        }

        if (
          (errCode === 'network' ||
            errCode === 'service-not-allowed' ||
            errCode === 'language-not-supported') &&
          !finalTranscriptRef.current &&
          !interimTranscriptRef.current
        ) {
          speechFallbackTriggeredRef.current = true;
          try {
            recognition.abort();
          } catch {
            // ignore
          }
          startMediaRecorderVoice();
          return;
        }

        setIsMicActive(false);
        setVoiceMode(null);

        if (errCode === 'not-allowed') {
          setVoiceError(
            'Microphone access blocked. Allow mic permission in browser settings and try again.'
          );
        } else if (errCode === 'audio-capture') {
          setVoiceError('No microphone found. Check your audio input device.');
        } else if (errCode === 'no-speech' && !interimTranscriptRef.current) {
          setVoiceError('Didn’t catch any speech. Click the mic and speak clearly.');
        }
      };

      recognition.onend = () => {
        clearTimeout(speechEndTimerRef.current);
        if (speechFallbackTriggeredRef.current) {
          speechFallbackTriggeredRef.current = false;
          return;
        }

        setIsMicActive(false);
        setVoiceMode(null);

        if (cancelVoiceRef.current) {
          cancelVoiceRef.current = false;
          return;
        }

        const spoken = (finalTranscriptRef.current || interimTranscriptRef.current || '').trim();
        if (spoken) {
          setTimeout(() => {
            dispatchVoicePromptRef.current?.(spoken);
          }, 120);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      startMediaRecorderVoice();
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

  dispatchVoicePromptRef.current = (spokenText) => {
    const trimmed = String(spokenText || '').trim();
    if (!trimmed || isLoading || isStreaming) return;
    const fullPrompt = (
      prefixInputRef.current ? `${prefixInputRef.current} ${trimmed}` : trimmed
    )
      .replace(/\s+/g, ' ')
      .trim();
    prefixInputRef.current = '';
    finalTranscriptRef.current = '';
    interimTranscriptRef.current = '';
    handleSendIntercept(fullPrompt);
  };

  const renderVoiceStatusBanner = () => {
    if (!isMicActive && !isTranscribing && !voiceError) return null;

    if (voiceError) {
      return (
        <div
          className={`mx-1 flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-xs ${
            isDark
              ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
              : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}
        >
          <span className="truncate">{voiceError}</span>
          <button
            type="button"
            onClick={() => setVoiceError(null)}
            aria-label="Dismiss voice error"
            className="shrink-0 rounded p-0.5 opacity-80 hover:opacity-100"
          >
            <X size={13} strokeWidth={1.5} />
          </button>
        </div>
      );
    }

    if (isTranscribing) {
      return (
        <div
          className={`mx-1 flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs ${
            isDark
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-emerald-600/25 bg-emerald-50 text-emerald-700'
          }`}
        >
          <Loader2 size={13} strokeWidth={1.75} className="shrink-0 animate-spin" />
          <span>Transcribing your voice...</span>
        </div>
      );
    }

    return (
      <div
        className={`mx-1 flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-xs ${
          isDark
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
            : 'border-emerald-600/25 bg-emerald-50 text-emerald-800'
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-rose-500" />
          <span className="truncate">
            Listening{voiceMode === 'recorder' ? ' (audio)' : ''} — speak now
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className="rounded-md bg-emerald-600 px-2 py-0.5 text-[11px] font-medium text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
          >
            Ask now
          </button>
          <button
            type="button"
            onClick={cancelVoiceCapture}
            aria-label="Cancel voice input"
            className="rounded p-0.5 opacity-75 hover:opacity-100"
          >
            <X size={13} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    );
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
        className={`group relative flex min-w-0 items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors ${
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
            className={`w-full rounded border px-2 py-0.5 text-xs focus:outline-hidden ${
              isDark
                ? 'border-white/20 bg-black/40 text-white'
                : 'border-slate-300 bg-white text-slate-900'
            }`}
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              onSelectSession?.(session._id);
              setIsSidebarOpen(false);
            }}
            className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
          >
            <MessageSquare size={14} className="shrink-0 text-slate-400" />
            <span className="truncate">{session.title || 'New chat'}</span>
          </button>
        )}

        {/* Right Action: 3-dots Context Menu */}
        <div className="relative ml-1 flex shrink-0 items-center chat-session-menu">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isMenuOpen) {
                setOpenMenuSessionId(null);
                setMenuPosition(null);
                return;
              }
              const rect = e.currentTarget.getBoundingClientRect();
              const menuHeight = 128;
              const menuWidth = 164;
              const openUp = rect.bottom + menuHeight + 12 > window.innerHeight;
              const top = openUp
                ? Math.max(8, rect.top - menuHeight - 4)
                : rect.bottom + 4;
              const left = Math.max(
                8,
                Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8),
              );
              setMenuPosition({ top, left });
              setOpenMenuSessionId(session._id);
            }}
            className={`rounded-md p-1 transition-opacity ${
              isMenuOpen
                ? isDark
                  ? 'opacity-100 bg-white/10 text-white'
                  : 'opacity-100 bg-slate-200 text-slate-900'
                : isDark
                ? 'opacity-80 sm:opacity-0 sm:group-hover:opacity-100 text-slate-400 hover:bg-white/10 hover:text-white'
                : 'opacity-80 sm:opacity-0 sm:group-hover:opacity-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900'
            }`}
            title="More options"
            aria-label="Chat actions"
          >
            <MoreHorizontal size={14} />
          </button>

          {/* Portaled Floating Context Menu (never clipped or triggering horizontal scrollbars) */}
          {isMenuOpen &&
            menuPosition &&
            typeof document !== 'undefined' &&
            createPortal(
              <div
                style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
                className={`chat-session-menu fixed z-[9999] w-[164px] rounded-xl border p-1 shadow-xl ${
                  isDark
                    ? 'border-white/[0.1] bg-[#11141c] text-[#eef0f5]'
                    : 'border-black/[0.1] bg-white text-slate-900'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setRenamingSessionId(session._id);
                    setRenameValue(session.title);
                    setOpenMenuSessionId(null);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                    isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Edit3 size={14} strokeWidth={1.6} />
                    <span>Rename</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleCopy(session._id, window.location.href);
                    setOpenMenuSessionId(null);
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                    isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-slate-100'
                  }`}
                >
                  <Share2 size={14} strokeWidth={1.6} />
                  <span>Share</span>
                </button>

                <div
                  className={`my-1 h-px ${
                    isDark ? 'bg-white/[0.08]' : 'bg-black/[0.08]'
                  }`}
                />

                <button
                  type="button"
                  onClick={() => {
                    onDeleteSession?.(session._id);
                    setOpenMenuSessionId(null);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-rose-600 transition-colors hover:bg-rose-500/10 dark:text-rose-400 dark:hover:text-rose-300"
                >
                  <Trash2 size={14} strokeWidth={1.6} />
                  <span>Delete</span>
                </button>
              </div>,
              document.body,
            )}
        </div>
      </div>
    );
  };

  const renderSidebarContent = () => (
    <div className="flex h-full flex-col justify-between">
      {/* Top Header & Navigation */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-3">
        <div className="mb-3 flex shrink-0 items-center justify-between px-1 py-1">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            <span className="font-display text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
              Nikhil AI
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            title="Close sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors duration-150 hover:bg-slate-200/70 hover:text-slate-900 dark:text-[#7a8296] dark:hover:bg-white/[0.06] dark:hover:text-[#eef0f5]"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Action List */}
        <div className="mb-3 shrink-0 space-y-1">
          <button
            type="button"
            onClick={() => {
              if (onNewChat) onNewChat();
              else onClear();
              setIsSidebarOpen(false);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-200/70 hover:text-slate-900 dark:text-[#eef0f5] dark:hover:bg-white/[0.06]"
          >
            <SquarePen size={16} strokeWidth={1.5} className="shrink-0 text-slate-500 dark:text-[#7a8296]" />
            <span>New chat</span>
          </button>

          <button
            type="button"
            onClick={() => {
              handleToggleImageMode();
              setIsSidebarOpen(false);
            }}
            className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm font-medium transition-colors duration-150 ${
              activeImageMode
                ? 'border-emerald-600/30 bg-emerald-500/10 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300'
                : 'border-transparent text-slate-700 hover:bg-slate-200/70 hover:text-slate-900 dark:text-[#eef0f5] dark:hover:bg-white/[0.06]'
            }`}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <Images size={16} strokeWidth={1.5} className="shrink-0 text-slate-500 dark:text-[#7a8296]" />
              <span>Images</span>
            </div>
            {activeImageMode && (
              <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
                Active
              </span>
            )}
          </button>
        </div>

        {/* Recent Chats */}
        <div className="flex min-h-0 flex-1 flex-col border-t border-black/[0.06] pt-3 dark:border-white/[0.08]">
          <div className="mb-1.5 flex shrink-0 items-center justify-between px-2">
            <span className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
              Recent chats
            </span>
            {user && allSessions.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all chat history?')) {
                    onClearAllSessions?.();
                  }
                }}
                className="cursor-pointer text-xs text-slate-500 transition-colors hover:text-rose-500 dark:text-[#7a8296]"
                title="Clear all chat history"
              >
                Clear
              </button>
            )}
          </div>

          <div
            onScroll={() => {
              if (openMenuSessionId) {
                setOpenMenuSessionId(null);
              }
            }}
            className="flex-1 space-y-0.5 overflow-y-auto overflow-x-hidden pr-1"
          >
            {user ? (
              isSessionsLoading ? (
                <div className="px-2 py-2 text-xs text-slate-500 dark:text-[#7a8296]">
                  Loading chats...
                </div>
              ) : allSessions.length > 0 ? (
                allSessions.map((session) => renderSessionItem(session))
              ) : (
                <div className="px-2 py-2 text-xs text-slate-500 dark:text-[#7a8296]">
                  No previous chats yet
                </div>
              )
            ) : (
              <p className="px-2 py-2 text-xs leading-relaxed text-slate-500 dark:text-[#7a8296]">
                Guest chats reset on refresh. Sign in below to save history.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom User Profile */}
      <div className="shrink-0 border-t border-black/[0.06] p-3 dark:border-white/[0.08]">
        {user ? (
          <button
            type="button"
            onClick={() => openProfileModal?.()}
            className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition-colors duration-150 hover:bg-slate-200/70 dark:hover:bg-white/[0.06]"
          >
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/[0.08] bg-slate-100 text-xs font-medium text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#eef0f5]">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <span>{userInitial}</span>
              )}
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
                {user.name || 'Nikhil Agrahari'}
              </span>
              <span className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                Signed in
              </span>
            </div>
          </button>
        ) : (
          <div className="flex items-center justify-between gap-2 rounded-lg p-1.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/[0.08] bg-slate-100 font-mono text-xs text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]">
                {userInitial}
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
                  Guest
                </span>
                <span className="text-xs text-slate-500 dark:text-[#7a8296]">
                  Ephemeral
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openSignInModal({ title: 'Sign in to save chat history' })}
              className="shrink-0 rounded-lg border border-black/[0.10] bg-white px-3 py-1.5 text-xs font-medium text-slate-900 transition-colors duration-150 hover:bg-slate-100 dark:border-white/[0.10] dark:bg-[#1a1e28] dark:text-[#eef0f5] dark:hover:bg-[#222734]"
            >
              Sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (!isOpen && !isStandalone) {
    return null;
  }

  const userInitial = user?.name ? user.name.slice(0, 2).toUpperCase() : 'NA';

  return (
    <AnimatePresence>
      <MotionDiv
        key="full-page-ai-chat"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
        className={`fixed inset-0 z-[1000] flex h-screen w-screen overflow-hidden font-sans select-text ${
          isDark
            ? 'bg-[#090a0f] text-[#eef0f5]'
            : 'bg-[#f5f7fa] text-slate-900'
        }`}
      >
        {/* Slide-out History Drawer (Closed by default; opens only on toggle click) */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black/50"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r ${
                  isDark
                    ? 'border-white/[0.08] bg-[#0b0d14]'
                    : 'border-black/[0.08] bg-white'
                }`}
              >
                {renderSidebarContent()}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ========================================================
            MAIN CHAT WORKSPACE
            ======================================================== */}
        <div className="flex flex-1 flex-col h-full min-w-0 relative overflow-hidden">
          {/* Top Bar */}
          <header
            className={`flex h-14 shrink-0 items-center justify-between border-b px-4 sm:px-6 z-10 transition-colors duration-150 ${
              isDark
                ? 'border-white/[0.08] bg-[#090a0f]'
                : 'border-black/[0.08] bg-white'
            }`}
          >
            {/* Left: Sidebar Toggle + Title */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleSidebar}
                title="Open chat history"
                aria-label="Open chat history"
                className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-150 ${
                  isDark
                    ? 'border-white/[0.08] bg-[#11141c] text-[#a3a9b8] hover:border-white/[0.16] hover:text-[#eef0f5]'
                    : 'border-black/[0.08] bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <PanelLeft size={16} strokeWidth={1.5} />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowModelMenu((prev) => !prev)}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors duration-150 ${
                    isDark
                      ? 'text-[#eef0f5] hover:bg-white/[0.05]'
                      : 'text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  <span>Nikhil AI</span>
                  <span className="hidden font-mono text-xs text-slate-500 sm:inline dark:text-[#7a8296]">
                    2.5 Flash
                  </span>
                  <ChevronDown size={14} strokeWidth={1.5} className="text-slate-400 dark:text-[#7a8296]" />
                </button>

                <AnimatePresence>
                  {showModelMenu && (
                    <MotionDiv
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.14, ease: 'easeOut' }}
                      className={`absolute left-0 z-50 mt-1.5 w-72 rounded-xl border p-3 shadow-lg ${
                        isDark
                          ? 'border-white/[0.08] bg-[#11141c] text-[#eef0f5] shadow-none'
                          : 'border-black/[0.08] bg-white text-slate-900'
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between border-b border-black/[0.06] pb-2 font-mono text-xs text-slate-500 dark:border-white/[0.08] dark:text-[#7a8296]">
                        <span>Pipeline</span>
                        <span className="text-emerald-700 dark:text-emerald-400">Online</span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-start gap-2.5 rounded-lg bg-slate-50 p-2 dark:bg-[#1a1e28]">
                          <Zap size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-slate-500 dark:text-[#a3a9b8]" />
                          <div>
                            <div className="font-medium">Gemini 2.5 Flash &amp; Grok</div>
                            <div className="text-slate-500 dark:text-[#7a8296]">
                              Portfolio retrieval and fast streaming replies.
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 rounded-lg bg-slate-50 p-2 dark:bg-[#1a1e28]">
                          <Images size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-slate-500 dark:text-[#a3a9b8]" />
                          <div>
                            <div className="font-medium">FLUX.2-dev</div>
                            <div className="text-slate-500 dark:text-[#7a8296]">
                              Inline image generation via /image or Image toggle.
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
            <div className="flex items-center gap-2">
              {hasMessages && (
                <button
                  type="button"
                  onClick={() => (onNewChat ? onNewChat() : onClear())}
                  title="New chat"
                  className={`flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors duration-150 ${
                    isDark
                      ? 'border-white/[0.08] bg-[#11141c] text-[#a3a9b8] hover:border-white/[0.16] hover:text-[#eef0f5]'
                      : 'border-black/[0.08] bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <SquarePen size={14} strokeWidth={1.5} />
                  <span className="hidden sm:inline">New chat</span>
                </button>
              )}

              {user ? (
                <span className="hidden font-mono text-xs text-slate-500 sm:inline dark:text-[#7a8296]">
                  {imageQuota ? `${imageQuota.remaining}/10 credits` : '10/10 credits'}
                </span>
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
                  className={`hidden h-9 items-center rounded-lg border px-3 text-xs font-medium transition-colors duration-150 sm:inline-flex ${
                    isDark
                      ? 'border-white/[0.08] bg-[#11141c] text-[#a3a9b8] hover:border-white/[0.16] hover:text-[#eef0f5]'
                      : 'border-black/[0.08] bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {(imageQuota?.remaining ?? 2) > 0
                    ? `${imageQuota?.remaining ?? 2}/2 credits`
                    : 'Sign in'}
                </button>
              )}

              <button
                type="button"
                onClick={toggleTheme}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-150 ${
                  isDark
                    ? 'border-white/[0.08] bg-[#11141c] text-[#a3a9b8] hover:border-white/[0.16] hover:text-[#eef0f5]'
                    : 'border-black/[0.08] bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {isDark ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
              </button>

              <button
                type="button"
                onClick={onClose}
                title="Back to Portfolio (Esc)"
                className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors duration-150 ${
                  isDark
                    ? 'border-white/[0.08] bg-[#11141c] text-[#eef0f5] hover:border-white/[0.16] hover:bg-[#1a1e28]'
                    : 'border-black/[0.08] bg-white text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>Back</span>
                <X size={14} strokeWidth={1.5} />
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
                   EMPTY STATE (SIMPLE, FOCUSED WORKBENCH LAYOUT)
                   ======================================================== */
                <div className="mx-auto my-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-8 select-none">
                  <MotionH1
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className={`mb-6 text-center font-display text-2xl font-medium tracking-[-0.02em] sm:text-3xl ${
                      isDark ? 'text-[#eef0f5]' : 'text-slate-900'
                    }`}
                  >
                    Ask Me Anything
                  </MotionH1>

                  <MotionDiv
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: 0.04, ease: 'easeOut' }}
                    className="relative w-full"
                  >
                    <div
                      className={`flex w-full flex-col gap-2 rounded-xl border p-3 transition-colors duration-150 ${
                        isDark
                          ? 'border-white/[0.10] bg-[#11141c] focus-within:border-white/[0.20]'
                          : 'border-black/[0.10] bg-white focus-within:border-slate-400'
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
                              : 'Ask Me Anything...'
                          }
                          rows={1}
                          disabled={isLoading || isStreaming || isTranscribing}
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

                      {renderVoiceStatusBanner()}

                      {/* Capsule Bottom Row */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowPlusMenu((prev) => !prev)}
                              title="Quick topics and suggestions"
                              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors duration-150 ${
                                showPlusMenu
                                  ? isDark
                                    ? 'border-white/[0.18] bg-[#1a1e28] text-[#eef0f5]'
                                    : 'border-slate-300 bg-slate-100 text-slate-900'
                                  : isDark
                                  ? 'border-white/[0.08] text-[#7a8296] hover:border-white/[0.16] hover:text-[#eef0f5]'
                                  : 'border-black/[0.08] text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <Plus size={16} strokeWidth={1.5} />
                            </button>

                            <AnimatePresence>
                              {showPlusMenu && (
                                <MotionDiv
                                  initial={{ opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -4 }}
                                  transition={{ duration: 0.14, ease: 'easeOut' }}
                                  className={`absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border p-2 shadow-lg ${
                                    isDark
                                      ? 'border-white/[0.08] bg-[#11141c] text-[#eef0f5] shadow-none'
                                      : 'border-black/[0.08] bg-white text-slate-900'
                                  }`}
                                >
                                  <div className="px-2 py-1 font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                                    Topics
                                  </div>
                                  <div className="mt-1 flex flex-col gap-0.5">
                                    {KNOWLEDGE_TOPICS.map((topic) => {
                                      const Icon = topic.icon;
                                      return (
                                        <button
                                          key={topic.id}
                                          type="button"
                                          onClick={() => handlePromptClick(`Tell me about Nikhil's ${topic.name}`)}
                                          className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors duration-150 ${
                                            isDark
                                              ? 'text-[#eef0f5] hover:bg-white/[0.05]'
                                              : 'text-slate-800 hover:bg-slate-100'
                                          }`}
                                        >
                                          <Icon size={14} strokeWidth={1.5} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                                          <div className="min-w-0 flex-1 truncate">
                                            <div className="font-medium">{topic.name}</div>
                                            <div className="truncate text-slate-500 dark:text-[#7a8296]">{topic.desc}</div>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </MotionDiv>
                              )}
                            </AnimatePresence>
                          </div>

                          <button
                            type="button"
                            onClick={handleToggleImageMode}
                            title={
                              activeImageMode
                                ? 'Image Mode active - click to switch back to chat'
                                : 'Activate AI Image Studio'
                            }
                            className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors duration-150 ${
                              activeImageMode
                                ? 'border-emerald-600/40 bg-emerald-500/10 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300'
                                : isDark
                                ? 'border-white/[0.08] text-[#a3a9b8] hover:border-white/[0.16] hover:text-[#eef0f5]'
                                : 'border-black/[0.08] text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <ImageIcon size={15} strokeWidth={1.5} />
                            <span>{activeImageMode ? currentModel.name : 'Image'}</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={onToggleDeepThink}
                            title={isDeepThink ? 'Deep Think: Active' : 'Enable Deep Think'}
                            className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors duration-150 ${
                              isDeepThink
                                ? 'border-emerald-600/40 bg-emerald-500/10 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300'
                                : isDark
                                ? 'border-white/[0.08] text-[#a3a9b8] hover:border-white/[0.16] hover:text-[#eef0f5]'
                                : 'border-black/[0.08] text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <Brain size={14} strokeWidth={1.5} />
                            <span>Think</span>
                          </button>

                          <button
                            type="button"
                            onClick={toggleSpeechRecognition}
                            disabled={isTranscribing || isLoading || isStreaming}
                            title={
                              isTranscribing
                                ? 'Transcribing audio...'
                                : isMicActive
                                ? 'Listening... click to ask now'
                                : 'Voice input — speak & ask'
                            }
                            aria-label="Voice input"
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-150 ${
                              isMicActive
                                ? 'bg-rose-600 text-white'
                                : isTranscribing
                                ? 'cursor-wait text-emerald-500'
                                : isDark
                                ? 'text-[#7a8296] hover:bg-white/[0.06] hover:text-[#eef0f5]'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            {isTranscribing ? (
                              <Loader2 size={15} strokeWidth={1.5} className="animate-spin" />
                            ) : isMicActive ? (
                              <MicOff size={16} strokeWidth={1.5} />
                            ) : (
                              <Mic size={16} strokeWidth={1.5} />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => inputValue.trim() && handleSendIntercept()}
                            disabled={!inputValue.trim() || isLoading || isStreaming}
                            title="Send prompt"
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-150 ${
                              inputValue.trim()
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400'
                                : isDark
                                ? 'cursor-not-allowed bg-white/[0.06] text-[#7a8296]'
                                : 'cursor-not-allowed bg-slate-200 text-slate-400'
                            }`}
                          >
                            <ArrowUp size={16} strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </MotionDiv>

                  {/* Quick Prompts */}
                  <MotionDiv
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: 0.08, ease: 'easeOut' }}
                    className="mt-4 flex w-full flex-col gap-1"
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
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors duration-150 ${
                            isDark
                              ? 'text-[#a3a9b8] hover:bg-white/[0.04] hover:text-[#eef0f5]'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <CardIcon
                            size={16}
                            strokeWidth={1.5}
                            className="shrink-0 text-slate-500 dark:text-[#7a8296]"
                          />
                          <span>{card.title}</span>
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
                        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-black/[0.08] bg-slate-100 font-mono text-xs text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#eef0f5]">
                          AI
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-[#7a8296]">
                            <span>Nikhil AI</span>
                            <span className="rounded border border-black/[0.08] bg-slate-50 px-1.5 py-0.5 font-mono text-xs text-slate-600 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]">
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
                      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-black/[0.08] bg-slate-100 font-mono text-xs text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#eef0f5]">
                        AI
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="mb-1.5 text-xs font-medium text-slate-500 dark:text-[#7a8296]">
                          Nikhil AI
                        </div>

                        <div
                          className={`text-base leading-relaxed break-words ${
                            isError
                              ? 'rounded-xl border border-rose-500/25 bg-rose-500/10 p-3 text-rose-500 dark:text-rose-400'
                              : isDark
                              ? 'text-[#eef0f5]'
                              : 'text-slate-900'
                          }`}
                        >
                          {message.content ? (
                            <AIMarkdownRenderer content={message.content} />
                          ) : (
                            <p className="py-1 font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                              Thinking...
                            </p>
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
              className={`pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-4 pt-6 sm:px-6 ${
                isDark
                  ? 'bg-gradient-to-t from-[#090a0f] via-[#090a0f]/95 to-transparent'
                  : 'bg-gradient-to-t from-[#f5f7fa] via-[#f5f7fa]/95 to-transparent'
              }`}
            >
              <div className="pointer-events-auto mx-auto w-full max-w-3xl">
                <AnimatePresence>
                  {showScrollBottom && (
                    <div className="mb-2 flex justify-center">
                      <MotionButton
                        type="button"
                        onClick={scrollToBottom}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-medium transition-colors duration-150 ${
                          isDark
                            ? 'border-white/[0.10] bg-[#1a1e28] text-[#eef0f5] hover:border-white/[0.18]'
                            : 'border-black/[0.10] bg-white text-slate-800 shadow-sm'
                        }`}
                      >
                        <span>Scroll down</span>
                        <ChevronDown size={14} strokeWidth={1.5} />
                      </MotionButton>
                    </div>
                  )}
                </AnimatePresence>

                <div
                  className={`flex w-full flex-col gap-2 rounded-xl border p-3 transition-colors duration-150 ${
                    isDark
                      ? 'border-white/[0.10] bg-[#11141c] focus-within:border-white/[0.20]'
                      : 'border-black/[0.10] bg-white focus-within:border-slate-400'
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
                          : 'Ask Me Anything...'
                      }
                      rows={1}
                      disabled={isLoading || isStreaming || isTranscribing}
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

                  {renderVoiceStatusBanner()}

                  {/* Bottom Row inside capsule */}
                  <div className="flex items-center justify-between pt-1">
                    {/* Left: Quick Actions Popover (+) & Image Model Button */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowPlusMenu((prev) => !prev)}
                          title="Quick topics"
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors duration-150 ${
                            isDark
                              ? 'border-white/[0.08] text-[#7a8296] hover:border-white/[0.16] hover:text-[#eef0f5]'
                              : 'border-black/[0.08] text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Plus size={16} strokeWidth={1.5} />
                        </button>

                        {/* Plus Popover */}
                        <AnimatePresence>
                          {showPlusMenu && (
                            <MotionDiv
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 4 }}
                              transition={{ duration: 0.14 }}
                              className={`absolute left-0 bottom-full mb-2 w-72 rounded-xl border p-2 shadow-lg z-50 ${
                                isDark
                                  ? 'border-white/[0.08] bg-[#11141c] text-[#eef0f5] shadow-none'
                                  : 'border-black/[0.08] bg-white text-slate-900'
                              }`}
                            >
                              <div className="px-2 py-1 font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                                Topics
                              </div>
                              <div className="flex flex-col gap-0.5 mt-1">
                                {KNOWLEDGE_TOPICS.map((topic) => {
                                  const Icon = topic.icon;
                                  return (
                                    <button
                                      key={topic.id}
                                      type="button"
                                      onClick={() => handlePromptClick(`Tell me about Nikhil's ${topic.name}`)}
                                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-left transition-colors duration-150 ${
                                        isDark
                                          ? 'hover:bg-white/[0.05] text-[#eef0f5]'
                                          : 'hover:bg-slate-100 text-slate-800'
                                      }`}
                                    >
                                      <Icon size={14} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                                      <div className="min-w-0 flex-1 truncate">
                                        <div className="font-medium">{topic.name}</div>
                                        <div className="text-slate-500 dark:text-[#7a8296] truncate">{topic.desc}</div>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </MotionDiv>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Image Model Toggle Button */}
                      <button
                        type="button"
                        onClick={handleToggleImageMode}
                        title={
                          activeImageMode
                            ? 'Image Mode active - click to switch back to chat'
                            : 'Activate AI Image Studio'
                        }
                        className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors duration-150 ${
                          activeImageMode
                            ? 'border-emerald-600/40 bg-emerald-500/10 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300'
                            : isDark
                            ? 'border-white/[0.08] text-[#a3a9b8] hover:border-white/[0.16] hover:text-[#eef0f5]'
                            : 'border-black/[0.08] text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <ImageIcon size={15} strokeWidth={1.5} />
                        <span>{activeImageMode ? currentModel.name : 'Image'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Think toggle */}
                      <button
                        type="button"
                        onClick={onToggleDeepThink}
                        title={isDeepThink ? 'Deep Think: Active' : 'Enable Deep Think'}
                        className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors duration-150 ${
                          isDeepThink
                            ? 'border-emerald-600/40 bg-emerald-500/10 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300'
                            : isDark
                            ? 'border-white/[0.08] text-[#a3a9b8] hover:border-white/[0.16] hover:text-[#eef0f5]'
                            : 'border-black/[0.08] text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Brain size={14} strokeWidth={1.5} />
                        <span>Think</span>
                      </button>

                      {/* Mic Button */}
                      <button
                        type="button"
                        onClick={toggleSpeechRecognition}
                        disabled={isTranscribing || isLoading || isStreaming}
                        title={
                          isTranscribing
                            ? 'Transcribing audio...'
                            : isMicActive
                            ? 'Listening... click to ask now'
                            : 'Voice input — speak & ask'
                        }
                        aria-label="Voice input"
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-150 ${
                          isMicActive
                            ? 'bg-rose-600 text-white'
                            : isTranscribing
                            ? 'cursor-wait text-emerald-500'
                            : isDark
                            ? 'text-[#7a8296] hover:bg-white/[0.06] hover:text-[#eef0f5]'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        {isTranscribing ? (
                          <Loader2 size={15} strokeWidth={1.5} className="animate-spin" />
                        ) : isMicActive ? (
                          <MicOff size={16} strokeWidth={1.5} />
                        ) : (
                          <Mic size={16} strokeWidth={1.5} />
                        )}
                      </button>

                      {/* Send / Stop button */}
                      {isStreaming ? (
                        <button
                          type="button"
                          onClick={onStop}
                          title="Stop generating"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white transition-colors duration-150 hover:bg-rose-700"
                        >
                          <Square size={13} className="fill-current" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => inputValue.trim() && handleSendIntercept()}
                          disabled={!inputValue.trim() || isLoading}
                          title="Send prompt"
                          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-150 ${
                            inputValue.trim()
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400'
                              : isDark
                              ? 'cursor-not-allowed bg-white/[0.06] text-[#7a8296]'
                              : 'cursor-not-allowed bg-slate-200 text-slate-400'
                          }`}
                        >
                          <ArrowUp size={16} strokeWidth={1.5} />
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
