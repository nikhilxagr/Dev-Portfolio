import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Check,
  Clock,
  Code2,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  FileText,
  FlaskConical,
  Folder,
  GitBranch,
  Hash,
  KeyRound,
  Lock,
  Mail,
  MessageCircle,
  Milestone,
  Moon,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Terminal,
  User,
  Wrench,
  X,
} from "lucide-react";
import {
  NAV_LINKS,
  QUICK_CONTACT,
  SKILL_GROUPS,
  SOCIAL_LINKS,
} from "@/constants/siteData";
import { SIGNATURE_PROJECTS } from "@/data/projectsData";
import { BLOG_POSTS } from "@/data/blogsData";
import { journeyData as STATIC_JOURNEY_DATA } from "@/data/journeyData";
import { useTheme } from "@/context/ThemeContext";
import { useSiteContent } from "@/context/SiteContentContext";

const MotionDiv = motion.div;
const RECENT_SEARCHES_KEY = "portfolio_recent_searches";

const SCOPE_TABS = [
  { id: "all", label: "All" },
  { id: "project", label: "Projects" },
  { id: "hackathon", label: "Journey" },
  { id: "blog", label: "Blogs" },
  { id: "skill", label: "Skills" },
  { id: "experiment", label: "Labs" },
];

const TYPE_LABELS = {
  project: "Projects",
  hackathon: "Journey",
  blog: "Blogs",
  skill: "Skills",
  experiment: "Labs",
  page: "Pages",
  action: "Quick actions",
  social: "Social",
};

const TYPE_ORDER = [
  "project",
  "hackathon",
  "blog",
  "skill",
  "experiment",
  "page",
  "action",
  "social",
];

const SHORT_PROJECT_SUMMARIES = {
  "whatsapp-fullstack-clone": "Real-time chat, stories, and OTP auth",
  vistagram: "Social media feed, reels, and direct chat",
  "kanoon-mate": "AI legal assistant and document analyzer",
  "fast-feast": "Food ordering platform with online payments",
  snapurl: "Short link generator with click analytics",
};

const shortenText = (value = "", maxLen = 58) => {
  const clean = String(value).replace(/\s+/g, " ").trim();
  if (!clean) return "";
  if (clean.length <= maxLen) return clean;
  return `${clean.slice(0, maxLen).replace(/\s+\S*$/, "")}…`;
};

const tokenise = (str = "") =>
  String(str)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const scoreItem = (item, rawQuery) => {
  if (!rawQuery.trim()) return 0;
  const queryTokens = tokenise(rawQuery);
  if (queryTokens.length === 0) return 0;

  const label = item.label.toLowerCase();
  const corpus = item._corpus;
  let total = 0;

  for (const qToken of queryTokens) {
    if (label === qToken) {
      total += 100;
      continue;
    }
    if (label.startsWith(qToken)) {
      total += 80;
      continue;
    }
    if (label.includes(qToken)) {
      total += 60;
      continue;
    }
    if (item.keywords.some((k) => k.startsWith(qToken))) {
      total += 45;
      continue;
    }
    if (corpus.includes(qToken)) {
      total += 30;
      continue;
    }
    if (item.keywords.some((k) => k.includes(qToken))) {
      total += 15;
      continue;
    }
    if (qToken.length >= 4) {
      const prefix = qToken.slice(0, -1);
      if (
        item.keywords.some(
          (kw) => Math.abs(kw.length - qToken.length) <= 1 && kw.includes(prefix),
        )
      ) {
        total += 8;
      }
    }
  }

  return total / queryTokens.length;
};

const readRecentSearches = () => {
  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
  } catch {
    return [];
  }
};

const saveRecentSearch = (term) => {
  const clean = term.trim();
  if (clean.length < 2) return;
  try {
    const prev = readRecentSearches().filter(
      (entry) => entry.toLowerCase() !== clean.toLowerCase(),
    );
    window.localStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify([clean, ...prev].slice(0, 3)),
    );
  } catch {
    // ignore storage errors
  }
};

const highlightMatches = (text, query) => {
  if (!text || !query.trim()) return text;
  const tokens = Array.from(
    new Set(
      query
        .trim()
        .split(/\s+/)
        .filter((t) => t.length >= 2)
        .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    ),
  );
  if (tokens.length === 0) return text;

  const regex = new RegExp(`(${tokens.join("|")})`, "gi");
  const parts = String(text).split(regex);
  if (parts.length <= 1) return text;

  return parts.map((part, idx) =>
    idx % 2 === 1 ? (
      <mark
        key={`${part}-${idx}`}
        className="rounded bg-emerald-500/15 px-0.5 font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
      >
        {part}
      </mark>
    ) : (
      part
    ),
  );
};

const SearchModalInner = ({ onClose }) => {
  const { isDark, toggleTheme } = useTheme();
  const { journeyItems, skills, profile, contact } = useSiteContent();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all");
  const [activeIdx, setActiveIdx] = useState(0);
  const [copiedKey, setCopiedKey] = useState("");
  const [recentQueries, setRecentQueries] = useState(() => readRecentSearches());

  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Isolate scrolling strictly to the search modal while open
  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    if (window.__activeLenis && typeof window.__activeLenis.stop === "function") {
      window.__activeLenis.stop();
    }

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 40);

    return () => {
      window.clearTimeout(focusTimer);
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      if (window.__activeLenis && typeof window.__activeLenis.start === "function") {
        window.__activeLenis.start();
      }
    };
  }, []);

  const allItems = useMemo(() => {
    const items = [];
    const emailAddress =
      contact?.email || QUICK_CONTACT.email || "nikhilagrahari530@gmail.com";
    const resumeHref =
      profile?.resumeFullStack ||
      QUICK_CONTACT.resumeFullStack ||
      "/images/resume/WebDev_Resume.pdf";

    // Projects
    SIGNATURE_PROJECTS.forEach((project) => {
      const stack = project.techStack || project.tags || [];
      const kw = tokenise(
        `${project.title} ${project.category} ${stack.join(" ")} ${project.tagline ?? ""} ${project.description ?? ""}`,
      );
      items.push({
        id: `project-${project.slug}`,
        type: "project",
        label: project.title,
        description:
          SHORT_PROJECT_SUMMARIES[project.slug] ||
          shortenText(project.subtitle || project.tagline || project.description, 56),
        to: `/projects/${project.slug}`,
        icon: Code2,
        badge: project.category,
        featured: Boolean(project.featured),
        keywords: kw,
        _corpus: kw.join(" "),
      });
    });

    // Journey Milestones
    const activeJourney =
      Array.isArray(journeyItems) && journeyItems.length > 0
        ? journeyItems
        : STATIC_JOURNEY_DATA;

    activeJourney
      .filter((event) => event.status !== "draft")
      .forEach((event) => {
        const key = event.entryId || event.id;
        const techStr = (event.details?.technologies || []).join(" ");
        const skillStr = (event.details?.skills || []).join(" ");
        const kw = tokenise(
          `${event.title} ${event.organization} ${event.category} ${event.tag || ""} ${event.description || ""} ${techStr} ${skillStr} ${event.year || ""}`,
        );
        items.push({
          id: `journey-${key}`,
          type: "hackathon",
          label: event.title,
          description: `${event.organization || ""}${event.year ? ` · ${event.year}` : ""}`,
          to: `/journey?selected=${key}`,
          icon: GitBranch,
          badge: event.tag || event.category,
          keywords: kw,
          _corpus: kw.join(" "),
        });
      });

    // Blogs
    BLOG_POSTS.forEach((blog) => {
      const kw = tokenise(
        `${blog.title} ${blog.subtitle ?? ""} ${blog.category ?? ""} ${(blog.tags ?? []).join(" ")} ${blog.content ?? ""}`,
      );
      items.push({
        id: `blog-${blog.slug}`,
        type: "blog",
        label: blog.title,
        description: shortenText(blog.subtitle || blog.excerpt, 56),
        to: `/blog/${blog.slug}`,
        icon: BookOpen,
        badge: blog.category || "Article",
        keywords: kw,
        _corpus: kw.join(" "),
      });
    });

    // Skills
    const activeSkillGroups = skills?.groups?.length ? skills.groups : SKILL_GROUPS;
    const skillMap = new Map();
    activeSkillGroups.forEach((group) => {
      (group.items || []).forEach((skill) => {
        const slug = skill
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        if (!skillMap.has(slug)) {
          skillMap.set(slug, { skill, slug, group: group.title });
        }
      });
    });

    skillMap.forEach(({ skill, slug, group }) => {
      const kw = tokenise(`${skill} ${group} skill`);
      items.push({
        id: `skill-${slug}`,
        type: "skill",
        label: skill,
        description: group,
        to: "/skills",
        icon: Hash,
        badge: "Skill",
        keywords: kw,
        _corpus: kw.join(" "),
      });
    });

    // Pages
    const pageIconMap = {
      Home: FileText,
      About: User,
      Skills: Cpu,
      Projects: Folder,
      Experiments: FlaskConical,
      Journey: Milestone,
      Blog: BookOpen,
      Services: Briefcase,
      Contact: Mail,
    };

    const expIconMap = {
      "Security Labs": ShieldCheck,
      "Dev Terminal": Terminal,
      "Data Structure Lab": Cpu,
      "Cyber Tools": Wrench,
      "Document Methodology": FileText,
    };

    NAV_LINKS.forEach((link) => {
      if (!link.isDropdown) {
        const kw = tokenise(`${link.label} page`);
        items.push({
          id: `page-${link.to}`,
          type: "page",
          label: link.label,
          description: `Open ${link.label} page`,
          to: link.to,
          icon: pageIconMap[link.label] || FileText,
          badge: "Page",
          keywords: kw,
          _corpus: kw.join(" "),
        });
      } else {
        link.children?.forEach((child) => {
          const kw = tokenise(`${child.label} ${child.description ?? ""} lab`);
          items.push({
            id: `exp-${child.to}`,
            type: "experiment",
            label: child.label,
            description: shortenText(child.description, 52),
            to: child.to,
            icon: expIconMap[child.label] || FlaskConical,
            badge: "Lab",
            keywords: kw,
            _corpus: kw.join(" "),
          });
        });
      }
    });

    // Security & DSA Tools
    [
      {
        id: "tool-breach",
        label: "Breach Inspector",
        description: "Check emails against public data leaks",
        to: "/experiments/cyber-tools",
        icon: ShieldCheck,
        badge: "Security",
      },
      {
        id: "tool-password",
        label: "Password Strength Analyzer",
        description: "Entropy and crack-time check",
        to: "/experiments/cyber-tools",
        icon: KeyRound,
        badge: "Security",
      },
      {
        id: "tool-header",
        label: "HTTP Header Auditor",
        description: "Inspect CSP and HSTS headers",
        to: "/experiments/cyber-tools",
        icon: Lock,
        badge: "Security",
      },
      {
        id: "dsa-sorting",
        label: "Sorting Visualizer",
        description: "QuickSort, MergeSort, BubbleSort",
        to: "/experiments/dsa-lab",
        icon: Cpu,
        badge: "DSA",
      },
      {
        id: "dsa-graph",
        label: "Graph BFS & DFS",
        description: "Shortest path algorithm visualizer",
        to: "/experiments/dsa-lab",
        icon: Network,
        badge: "DSA",
      },
    ].forEach((lab) => {
      const kw = tokenise(`${lab.label} ${lab.description} ${lab.badge} lab`);
      items.push({
        ...lab,
        type: "experiment",
        keywords: kw,
        _corpus: kw.join(" "),
      });
    });

    // Quick Actions
    [
      {
        id: "action-ai",
        label: "Ask Me Anything",
        description: "Open Nikhil AI assistant",
        to: "/ai",
        icon: Sparkles,
        badge: "AI",
        keywords: tokenise("ask me anything ai chat voice assistant"),
      },
      {
        id: "action-copy-email",
        label: "Copy Email Address",
        description: emailAddress,
        actionType: "copy-email",
        copyValue: emailAddress,
        icon: Copy,
        badge: "Copy",
        keywords: tokenise(`copy email mail contact ${emailAddress}`),
      },
      {
        id: "action-theme",
        label: isDark ? "Switch to Light Mode" : "Switch to Dark Mode",
        description: "Change color theme",
        actionType: "toggle-theme",
        icon: isDark ? Sun : Moon,
        badge: "Theme",
        keywords: tokenise("theme dark light mode color toggle"),
      },
      {
        id: "action-resume",
        label: "Download Resume",
        description: "Full-Stack Developer PDF",
        href: resumeHref,
        icon: Download,
        badge: "PDF",
        keywords: tokenise("resume cv pdf download"),
      },
    ].forEach((act) => {
      items.push({
        ...act,
        type: "action",
        _corpus: act.keywords.join(" "),
      });
    });

    // Socials
    const socialIconMap = {
      GitHub: GitBranch,
      LinkedIn: Briefcase,
      Instagram: User,
      Medium: BookOpen,
      TryHackMe: ShieldCheck,
      WhatsApp: MessageCircle,
      LeetCode: Hash,
      GeeksforGeeks: Code2,
    };

    const allSocials = [
      ...SOCIAL_LINKS,
      { label: "GitHub", href: contact?.github || QUICK_CONTACT.github },
      { label: "LinkedIn", href: contact?.linkedin || QUICK_CONTACT.linkedin },
      { label: "Email", href: `mailto:${emailAddress}` },
      { label: "WhatsApp", href: contact?.whatsapp || QUICK_CONTACT.whatsapp },
    ];

    const seenSocial = new Set();
    allSocials.forEach((s) => {
      if (!s.href || seenSocial.has(s.label)) return;
      seenSocial.add(s.label);
      const kw = tokenise(`${s.label} social profile`);
      items.push({
        id: `social-${s.label.toLowerCase()}`,
        type: "social",
        label: s.label,
        description: "Open external link",
        href: s.href,
        icon: socialIconMap[s.label] || ExternalLink,
        badge: "Link",
        keywords: kw,
        _corpus: kw.join(" "),
      });
    });

    return items;
  }, [contact, isDark, journeyItems, profile, skills]);

  const { visibleItems, groupedSections } = useMemo(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      if (scope === "all") {
        const featuredProjects = allItems
          .filter((i) => i.type === "project" && i.featured)
          .slice(0, 5);
        const recentJourney = allItems
          .filter((i) => i.type === "hackathon")
          .slice(-3)
          .reverse();
        const latestBlogs = allItems
          .filter((i) => i.type === "blog")
          .slice(0, 3);
        const topLabs = allItems
          .filter((i) => i.type === "experiment")
          .slice(0, 3);
        const quickActions = [
          ...allItems.filter((i) => i.type === "action"),
          ...allItems.filter((i) => i.type === "social").slice(0, 2),
        ];

        const presets = [
          { type: "project", label: "Projects", entriesRaw: featuredProjects },
          { type: "hackathon", label: "Journey", entriesRaw: recentJourney },
          { type: "blog", label: "Blogs", entriesRaw: latestBlogs },
          { type: "experiment", label: "Labs", entriesRaw: topLabs },
          { type: "action", label: "Quick actions & links", entriesRaw: quickActions },
        ];

        const flat = [];
        const sections = [];
        let flatIdx = 0;

        presets.forEach((group) => {
          if (!group.entriesRaw.length) return;
          const entries = group.entriesRaw.map((item) => {
            const idx = flatIdx++;
            flat.push(item);
            return { item, flatIdx: idx };
          });
          sections.push({
            type: group.type,
            label: group.label,
            entries,
          });
        });

        return {
          visibleItems: flat,
          groupedSections: sections,
        };
      }

      return {
        visibleItems: allItems.filter((i) => i.type === scope).slice(0, 20),
        groupedSections: null,
      };
    }

    const matched = allItems
      .map((item) => ({ item, s: scoreItem(item, trimmed) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.item);

    const scoped =
      scope === "all" ? matched : matched.filter((item) => item.type === scope);

    if (scope !== "all") {
      return {
        visibleItems: scoped.slice(0, 14),
        groupedSections: null,
      };
    }

    const buckets = {};
    scoped.forEach((item) => {
      if (!buckets[item.type]) buckets[item.type] = [];
      if (buckets[item.type].length < 3) buckets[item.type].push(item);
    });

    const flat = [];
    const sections = [];
    let flatIdx = 0;

    TYPE_ORDER.forEach((type) => {
      const bucket = buckets[type];
      if (!bucket?.length) return;
      const entries = bucket.map((item) => {
        const idx = flatIdx++;
        flat.push(item);
        return { item, flatIdx: idx };
      });
      sections.push({
        type,
        label: TYPE_LABELS[type] || type,
        entries,
      });
    });

    return {
      visibleItems: flat,
      groupedSections: sections,
    };
  }, [allItems, query, scope]);

  const safeActiveIdx = Math.min(activeIdx, Math.max(visibleItems.length - 1, 0));

  const handleSelect = useCallback(
    (item) => {
      if (!item) return;

      if (query.trim()) {
        saveRecentSearch(query);
        setRecentQueries(readRecentSearches());
      }

      if (item.actionType === "toggle-theme") {
        toggleTheme();
        return;
      }

      if (item.actionType === "copy-email" && item.copyValue) {
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(item.copyValue).catch(() => undefined);
        }
        setCopiedKey(item.id);
        window.setTimeout(() => setCopiedKey(""), 1500);
        return;
      }

      onClose();

      if (item.href) {
        window.open(item.href, "_blank", "noopener,noreferrer");
        return;
      }

      if (item.to) {
        navigate(item.to);
      }
    },
    [navigate, onClose, query, toggleTheme],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, Math.max(visibleItems.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Tab") {
      e.preventDefault();
      const idx = SCOPE_TABS.findIndex((t) => t.id === scope);
      const step = e.shiftKey ? -1 : 1;
      const nextIdx = (idx + step + SCOPE_TABS.length) % SCOPE_TABS.length;
      setScope(SCOPE_TABS[nextIdx].id);
      setActiveIdx(0);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (visibleItems[safeActiveIdx]) {
        handleSelect(visibleItems[safeActiveIdx]);
      }
    }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${safeActiveIdx}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [safeActiveIdx]);

  const handleWheelStop = (e) => {
    e.stopPropagation();
  };

  const renderRow = (item, idx) => {
    const Icon = item.icon;
    const isActive = safeActiveIdx === idx;
    const isCopied = copiedKey === item.id;

    return (
      <button
        key={item.id}
        type="button"
        data-idx={idx}
        onClick={() => handleSelect(item)}
        onMouseEnter={() => setActiveIdx(idx)}
        className={clsx(
          "group relative flex w-full items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-left transition-colors duration-150",
          isActive
            ? isDark
              ? "bg-[#1a1e28] text-[#eef0f5]"
              : "bg-slate-100 text-slate-900"
            : isDark
              ? "hover:bg-white/[0.03]"
              : "hover:bg-slate-50",
        )}
      >
        {isActive && (
          <span
            aria-hidden="true"
            className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-emerald-600 dark:bg-emerald-400"
          />
        )}

        <span
          className={clsx(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
            isActive
              ? "border-emerald-600/25 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400"
              : isDark
                ? "border-white/[0.08] bg-[#0c0e14] text-[#a3a9b8]"
                : "border-black/[0.08] bg-[#f8fafc] text-slate-600",
          )}
        >
          {isCopied ? (
            <Check size={16} strokeWidth={1.6} />
          ) : (
            <Icon size={16} strokeWidth={1.6} />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
            {isCopied ? "Email copied" : highlightMatches(item.label, query)}
          </p>
          {item.description && (
            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-[#8b93a7]">
              {highlightMatches(item.description, query)}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {item.badge && (
            <span className="font-mono text-[11px] text-slate-500 dark:text-[#7a8296]">
              {item.badge}
            </span>
          )}
          {item.href ? (
            <ExternalLink
              size={14}
              strokeWidth={1.5}
              className={clsx(
                "hidden sm:block transition-opacity",
                isActive ? "opacity-90 text-emerald-700 dark:text-emerald-400" : "opacity-35",
              )}
            />
          ) : (
            <ArrowRight
              size={14}
              strokeWidth={1.5}
              className={clsx(
                "hidden sm:block transition-opacity",
                isActive
                  ? "opacity-100 text-emerald-700 dark:text-emerald-400"
                  : "opacity-0 group-hover:opacity-60",
              )}
            />
          )}
        </div>
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[9998]"
      data-lenis-prevent
      onWheel={handleWheelStop}
    >
      {/* Backdrop */}
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        className={clsx(
          "fixed inset-0 backdrop-blur-xs transition-colors",
          isDark ? "bg-black/75" : "bg-slate-950/35",
        )}
      />

      {/* Centered Dialog */}
      <div className="pointer-events-none fixed inset-0 z-10 flex items-start justify-center p-0 sm:px-4 sm:pt-[9vh]">
        <MotionDiv
          initial={{ opacity: 0, scale: 0.98, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -8 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          data-lenis-prevent
          onWheel={handleWheelStop}
          role="dialog"
          aria-modal="true"
          aria-label="Search portfolio"
          className={clsx(
            "pointer-events-auto flex h-full w-full flex-col overflow-hidden border sm:h-auto sm:max-h-[76vh] sm:max-w-2xl sm:rounded-2xl",
            isDark
              ? "border-white/[0.1] bg-[#11141c] text-[#eef0f5]"
              : "border-black/[0.1] bg-white text-slate-900 shadow-2xl",
          )}
        >
          {/* Search Bar */}
          <div className="flex shrink-0 items-center gap-3 border-b border-black/[0.08] bg-[#f8fafc] px-4 py-3.5 sm:px-5 dark:border-white/[0.08] dark:bg-[#0c0e14]">
            <Search
              size={18}
              strokeWidth={1.6}
              className="shrink-0 text-emerald-700 dark:text-emerald-400"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIdx(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search projects, skills, or pages..."
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500 sm:text-base dark:text-[#eef0f5] dark:placeholder:text-[#7a8296]"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveIdx(0);
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-black/[0.05] hover:text-slate-900 dark:text-[#7a8296] dark:hover:bg-white/[0.06] dark:hover:text-[#eef0f5]"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              title="Close (Esc)"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/[0.1] bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-white/[0.1] dark:bg-[#11141c] dark:text-[#a3a9b8] dark:hover:border-white/[0.2] dark:hover:bg-[#1a1e28] dark:hover:text-[#eef0f5]"
            >
              <X size={16} strokeWidth={1.6} />
            </button>
          </div>

          {/* Filter Tabs + Ask Me Button */}
          <div className="flex shrink-0 items-center gap-1.5 overflow-x-auto border-b border-black/[0.08] bg-[#f8fafc] px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-5 dark:border-white/[0.08] dark:bg-[#0c0e14]">
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate("/ai");
              }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-600/25 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100/70 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
            >
              <MessageCircle size={13} strokeWidth={1.6} />
              <span>Ask Me</span>
            </button>

            <span
              aria-hidden="true"
              className="mx-0.5 h-4 w-px shrink-0 bg-black/[0.08] dark:bg-white/[0.08]"
            />

            {SCOPE_TABS.map((tab) => {
              const isSelected = scope === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setScope(tab.id);
                    setActiveIdx(0);
                  }}
                  className={clsx(
                    "shrink-0 rounded-lg border px-3 py-1 text-xs font-medium transition-colors",
                    isSelected
                      ? "border-emerald-600/30 bg-emerald-50 text-emerald-700 dark:border-emerald-500/35 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "border-transparent text-slate-600 hover:bg-black/[0.04] hover:text-slate-900 dark:text-[#a3a9b8] dark:hover:bg-white/[0.04] dark:hover:text-[#eef0f5]",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Results List */}
          <div
            ref={listRef}
            data-lenis-prevent
            onWheel={handleWheelStop}
            className="flex-1 space-y-2 overflow-y-auto overscroll-contain p-3.5 touch-pan-y sm:p-4"
          >
            {/* Empty State: Recent + Multi-Section Highlights */}
            {!query.trim() && scope === "all" && groupedSections && (
              <>
                {recentQueries.length > 0 && (
                  <div className="mb-2 flex flex-wrap items-center gap-2 px-1">
                    <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-[#7a8296]">
                      <Clock size={12} strokeWidth={1.6} />
                      Recent:
                    </span>
                    {recentQueries.map((recent) => (
                      <button
                        key={recent}
                        type="button"
                        onClick={() => {
                          setQuery(recent);
                          setActiveIdx(0);
                        }}
                        className="rounded-md border border-black/[0.08] bg-[#f8fafc] px-2.5 py-0.5 text-xs text-slate-700 transition-colors hover:border-emerald-600/30 hover:text-emerald-700 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-[#a3a9b8] dark:hover:border-emerald-500/30 dark:hover:text-emerald-300"
                      >
                        {recent}
                      </button>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  {groupedSections.map((section) => (
                    <div key={section.type} className="space-y-1">
                      <p className="px-2 text-xs font-medium text-slate-500 dark:text-[#7a8296]">
                        {section.label}
                      </p>
                      {section.entries.map(({ item, flatIdx }) =>
                        renderRow(item, flatIdx),
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Empty Query with Tab Selected */}
            {!query.trim() && scope !== "all" && (
              <div className="space-y-1">
                {visibleItems.map((item, i) => renderRow(item, i))}
              </div>
            )}

            {/* Query Results Grouped */}
            {query.trim() && visibleItems.length > 0 && groupedSections && (
              <div className="space-y-3">
                {groupedSections.map((section) => (
                  <div key={section.type} className="space-y-1">
                    <p className="px-2 text-xs font-medium text-slate-500 dark:text-[#7a8296]">
                      {section.label}
                    </p>
                    {section.entries.map(({ item, flatIdx }) =>
                      renderRow(item, flatIdx),
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Query Results Flat */}
            {query.trim() && visibleItems.length > 0 && !groupedSections && (
              <div className="space-y-1">
                {visibleItems.map((item, idx) => renderRow(item, idx))}
              </div>
            )}

            {/* No Match */}
            {query.trim() && visibleItems.length === 0 && (
              <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                <Search
                  size={22}
                  strokeWidth={1.5}
                  className="mb-2 text-slate-400 dark:text-[#7a8296]"
                />
                <p className="text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
                  No results for &ldquo;{query}&rdquo;
                </p>
                {scope !== "all" && (
                  <button
                    type="button"
                    onClick={() => {
                      setScope("all");
                      setActiveIdx(0);
                    }}
                    className="mt-3 rounded-lg border border-black/[0.08] bg-[#f8fafc] px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-[#eef0f5] dark:hover:bg-[#1a1e28]"
                  >
                    Search all categories
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quiet Footer */}
          <div className="flex shrink-0 items-center justify-between gap-4 border-t border-black/[0.08] bg-[#f8fafc] px-4 py-2.5 text-xs sm:px-5 dark:border-white/[0.08] dark:bg-[#0c0e14]">
            <div className="hidden sm:flex items-center gap-3 text-slate-500 dark:text-[#7a8296]">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-black/[0.1] bg-white px-1.5 py-0.5 font-mono text-[11px] dark:border-white/[0.1] dark:bg-[#11141c]">
                  ↑
                </kbd>
                <kbd className="rounded border border-black/[0.1] bg-white px-1.5 py-0.5 font-mono text-[11px] dark:border-white/[0.1] dark:bg-[#11141c]">
                  ↓
                </kbd>
                <span>move</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-black/[0.1] bg-white px-1.5 py-0.5 font-mono text-[11px] dark:border-white/[0.1] dark:bg-[#11141c]">
                  ↵
                </kbd>
                <span>open</span>
              </span>
            </div>

            <p className="sm:hidden text-xs text-slate-500 dark:text-[#7a8296]">
              Tap a result to open
            </p>

            <span className="hidden sm:inline-flex items-center gap-1 text-slate-500 dark:text-[#7a8296]">
              <kbd className="rounded border border-black/[0.1] bg-white px-1.5 py-0.5 font-mono text-[11px] dark:border-white/[0.1] dark:bg-[#11141c]">
                Ctrl
              </kbd>
              <kbd className="rounded border border-black/[0.1] bg-white px-1.5 py-0.5 font-mono text-[11px] dark:border-white/[0.1] dark:bg-[#11141c]">
                K
              </kbd>
            </span>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
};

const SearchModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen ? <SearchModalInner key="search-modal" onClose={onClose} /> : null}
    </AnimatePresence>
  );
};

export default SearchModal;
