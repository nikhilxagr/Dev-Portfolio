import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Code2,
  Cpu,
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
  Network,
  Search,
  ShieldCheck,
  Terminal,
  User,
  Wrench,
  X,
} from "lucide-react";

const MotionDiv = motion.div;
import { NAV_LINKS, QUICK_CONTACT, SKILL_GROUPS, SOCIAL_LINKS } from "@/constants/siteData";
import { SIGNATURE_PROJECTS } from "@/data/projectsData";
import { BLOG_POSTS as BLOG_LINKS } from "@/data/blogsData";
import { journeyData } from "@/data/journeyData";
import { useTheme } from "@/context/ThemeContext";
import clsx from "clsx";

// Helper to normalize and split query strings
const tokenise = (str = "") =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

// Calculate search relevance score (higher is better)
const score = (item, rawQuery) => {
  if (!rawQuery.trim()) return 0;
  const queryTokens = tokenise(rawQuery);
  const label = item.label.toLowerCase();
  const corpus = item._corpus;

  let total = 0;

  for (const qToken of queryTokens) {
    if (label === qToken) { total += 100; continue; }
    if (label.startsWith(qToken)) { total += 80; continue; }
    if (label.includes(qToken)) { total += 60; continue; }

    const kwStartMatch = item.keywords.some((k) => k.startsWith(qToken));
    if (kwStartMatch) { total += 45; continue; }

    if (corpus.includes(qToken)) { total += 30; continue; }

    const partialKw = item.keywords.some((k) => k.includes(qToken));
    if (partialKw) { total += 15; continue; }

    if (qToken.length >= 4) {
      for (const kw of item.keywords) {
        if (Math.abs(kw.length - qToken.length) <= 1 && kw.includes(qToken.slice(0, -1))) {
          total += 8;
          break;
        }
      }
    }
  }

  return total / queryTokens.length;
};

// Build index of pages, projects, skills, blogs, journey milestones, tools & DSA labs
const buildIndex = () => {
  const items = [];

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

  // Pages
  NAV_LINKS.forEach((link) => {
    if (!link.isDropdown) {
      const kw = tokenise(link.label);
      items.push({
        id: `page-${link.to}`,
        type: "page",
        label: link.label,
        description: `Navigate to ${link.label} page`,
        to: link.to,
        icon: pageIconMap[link.label] || FileText,
        keywords: kw,
        _corpus: kw.join(" "),
      });
    } else {
      // Experiments hub
      const hubKw = tokenise(`${link.label} experiments labs hub`);
      items.push({
        id: `page-${link.to}`,
        type: "page",
        label: `${link.label} Hub`,
        description: "View all experiments & labs",
        to: link.to,
        icon: FlaskConical,
        keywords: hubKw,
        _corpus: hubKw.join(" "),
      });
      const expIconMap = {
        "Security Labs": ShieldCheck,
        "Dev Terminal": Terminal,
        "Data Structure Lab": Cpu,
        "Cyber Tools": Wrench,
        "Document Methodology": FileText,
      };
      link.children?.forEach((child) => {
        const kw = tokenise(`${child.label} ${child.description ?? ""} experiment lab`);
        items.push({
          id: `exp-${child.to}`,
          type: "experiment",
          label: child.label,
          description: child.description,
          to: child.to,
          icon: expIconMap[child.label] || FlaskConical,
          keywords: kw,
          _corpus: kw.join(" "),
        });
      });
    }
  });

  // Projects
  SIGNATURE_PROJECTS.forEach((project) => {
    const isCollab =
      project.projectType === "Collaboration" ||
      ["kanoon-mate", "smart-lms", "smart-lms-saas-platform", "smartmess"].includes(project.slug) ||
      (project.title && (project.title.toLowerCase().includes("kanoon-mate") || project.title.toLowerCase().includes("smart lms") || project.title.toLowerCase().includes("smartmess")));
    const typeTag = isCollab ? "Collab Project" : "Solo Project";
    const kw = tokenise(
      `${project.title} ${project.category} ${typeTag} ${(project.techStack ?? []).join(" ")} ${(project.tags ?? []).join(" ")} ${project.tagline ?? ""} ${project.description ?? ""}`
    );
    items.push({
      id: `project-${project.slug}`,
      type: "project",
      label: project.title,
      description: project.tagline,
      to: `/projects/${project.slug}`,
      icon: Code2,
      badge: `${typeTag} • ${project.category}`,
      keywords: kw,
      _corpus: kw.join(" "),
    });
  });

  // Skills (deduplicated across groups to guarantee unique keys & clean results)
  const skillMap = new Map();
  SKILL_GROUPS.forEach((group) => {
    group.items.forEach((skill) => {
      const slug = skill.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const existing = skillMap.get(slug);
      if (existing) {
        if (!existing.groups.includes(group.title)) {
          existing.groups.push(group.title);
        }
      } else {
        skillMap.set(slug, { skill, slug, groups: [group.title] });
      }
    });
  });

  skillMap.forEach(({ skill, slug, groups }) => {
    const groupDesc = groups.join(" · ");
    const kw = tokenise(`${skill} ${groupDesc} skill`);
    items.push({
      id: `skill-${slug}`,
      type: "skill",
      label: skill,
      description: groupDesc,
      to: "/skills",
      icon: Hash,
      keywords: kw,
      _corpus: kw.join(" "),
    });
  });

  // Blogs
  BLOG_LINKS.forEach((blog) => {
    const kw = tokenise(
      `${blog.title} ${blog.subtitle ?? ""} ${(blog.tags ?? []).join(" ")} ${blog.content ?? ""}`
    );
    items.push({
      id: `blog-${blog.slug}`,
      type: "blog",
      label: blog.title,
      description: blog.subtitle,
      to: `/blog/${blog.slug}`,
      icon: BookOpen,
      keywords: kw,
      _corpus: kw.join(" "),
    });
  });

  // Dynamically Index Real Journey Milestones & Hackathons from journeyData
  journeyData.forEach((event) => {
    const techStr = (event.details?.technologies || []).join(" ");
    const skillStr = (event.details?.skills || []).join(" ");
    const featureStr = (event.details?.keyFeatures || []).join(" ");
    const overviewStr = event.details?.overview || "";
    const problemStr = event.details?.problem || "";
    const solutionStr = event.details?.solution || "";

    const kw = tokenise(
      `${event.title} ${event.organization} ${event.category} ${event.tag} ${event.subtitle || ""} ${event.description || ""} ${overviewStr} ${problemStr} ${solutionStr} ${techStr} ${skillStr} ${featureStr} ${event.location || ""}`
    );

    items.push({
      id: `journey-${event.id}`,
      type: "hackathon",
      label: event.title,
      description: `${event.tag} · ${event.organization}`,
      to: `/journey#${event.id}`,
      icon: GitBranch,
      badge: event.tag || "Journey",
      keywords: kw,
      _corpus: kw.join(" "),
    });
  });

  // Cyber Security Tools
  const cyberTools = [
    { id: "tool-breach", label: "Breach Inspector", description: "Audit emails against compromised data leaks", to: "/experiments/cyber-tools", icon: ShieldCheck, badge: "Security" },
    { id: "tool-password", label: "Password Strength Analyzer", description: "Entropy & crack time estimator", to: "/experiments/cyber-tools", icon: KeyRound, badge: "Security" },
    { id: "tool-header", label: "HTTP Header Auditor", description: "CSP, HSTS, X-Frame-Options security audit", to: "/experiments/cyber-tools", icon: Lock, badge: "Security" },
  ];

  cyberTools.forEach((t) => {
    const kw = tokenise(`${t.label} ${t.description} cyber security tool audit`);
    items.push({
      id: t.id,
      type: "experiment",
      label: t.label,
      description: t.description,
      to: t.to,
      icon: t.icon,
      badge: t.badge,
      keywords: kw,
      _corpus: kw.join(" "),
    });
  });

  // DSA Lab Visualizers
  const dsaVisualizers = [
    { id: "dsa-sorting", label: "Sorting Algorithms Visualizer", description: "QuickSort, MergeSort, BubbleSort, InsertionSort step-by-step", to: "/experiments/dsa-lab", icon: Cpu, badge: "DSA" },
    { id: "dsa-search", label: "Binary Search Visualizer", description: "Logarithmic search steps on sorted array", to: "/experiments/dsa-lab", icon: Cpu, badge: "DSA" },
    { id: "dsa-twopointer", label: "Two Pointers & Sliding Window", description: "Subarray sums, container with most water visualizer", to: "/experiments/dsa-lab", icon: Cpu, badge: "DSA" },
    { id: "dsa-nqueens", label: "N-Queens Backtracking", description: "Constraint satisfaction & backtracking visualizer", to: "/experiments/dsa-lab", icon: Cpu, badge: "DSA" },
    { id: "dsa-linkedlist", label: "Linked List Operations", description: "Singly linked list insertion, deletion & traversal", to: "/experiments/dsa-lab", icon: Cpu, badge: "DSA" },
    { id: "dsa-stackqueue", label: "Stack & Queue Visualizer", description: "LIFO stack push/pop & FIFO queue enqueue/dequeue", to: "/experiments/dsa-lab", icon: Cpu, badge: "DSA" },
    { id: "dsa-graph", label: "Graph Traversal BFS & DFS", description: "Dijkstra, BFS & DFS shortest path graph visualizer", to: "/experiments/dsa-lab", icon: Cpu, badge: "DSA" },
    { id: "dsa-tree", label: "Binary Search Tree Traversal", description: "In-order, Pre-order & Post-order BST visualizer", to: "/experiments/dsa-lab", icon: Cpu, badge: "DSA" },
  ];

  dsaVisualizers.forEach((v) => {
    const kw = tokenise(`${v.label} ${v.description} data structures algorithm dsa lab visualizer`);
    items.push({
      id: v.id,
      type: "experiment",
      label: v.label,
      description: v.description,
      to: v.to,
      icon: v.icon,
      badge: v.badge,
      keywords: kw,
      _corpus: kw.join(" "),
    });
  });

  // System Design Topics (Part of Engineering Docs)
  const systemDesignTopics = [
    { id: "sys-shortener", label: "URL Shortener System Design", description: "Base62 encoding, Key Generation Service (KGS), Redis LRU caching & high-scale schema", to: "/blog/url-shortener", icon: Network, badge: "System Design" },
  ];

  systemDesignTopics.forEach((t) => {
    const kw = tokenise(`${t.label} ${t.description} system design architecture backend distributed systems scalability`);
    items.push({
      id: t.id,
      type: "blog",
      label: t.label,
      description: t.description,
      to: t.to,
      icon: t.icon,
      badge: t.badge,
      keywords: kw,
      _corpus: kw.join(" "),
    });
  });

  // Social Profiles
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
    { label: "LeetCode", href: QUICK_CONTACT.leetcode },
    { label: "GeeksforGeeks", href: QUICK_CONTACT.gfg },
    { label: "Email", href: `mailto:${QUICK_CONTACT.email}` },
    { label: "WhatsApp Chat", href: QUICK_CONTACT.whatsapp },
  ];

  allSocials.forEach((s) => {
    const kw = tokenise(`${s.label} social contact profile follow connect reach`);
    items.push({
      id: `social-${s.label.toLowerCase().replace(/\s+/g, "-")}`,
      type: "social",
      label: s.label,
      description: s.href.replace(/^mailto:/, ""),
      href: s.href,
      to: null,
      icon: socialIconMap[s.label] || ExternalLink,
      badge: "Social",
      keywords: kw,
      _corpus: kw.join(" "),
    });
  });

  return items;
};

const ALL_ITEMS = buildIndex();

const FEATURED = [
  {
    id: "feat-whatsapp",
    label: "WhatsApp Clone",
    description: "Real-time messaging platform with Socket.IO, stories & dual OTP",
    to: "/projects/whatsapp-fullstack-clone",
    icon: Code2,
    type: "project",
    badge: "Full Stack",
  },
  {
    id: "feat-vistagram",
    label: "VISTAGRAM",
    description: "Full-Stack Real-Time Social Media & Media Sharing Platform",
    to: "/projects/vistagram",
    icon: Code2,
    type: "project",
    badge: "Full Stack",
  },
  {
    id: "feat-kanoon",
    label: "Kanoon-Mate Project",
    description: "AI Legal Operating System built at Nerds Hack Days",
    to: "/projects/kanoon-mate",
    icon: Code2,
    type: "project",
    badge: "AI",
  },
  {
    id: "feat-fastfeast",
    label: "Fast Feast",
    description: "Full-stack food delivery app with online payments",
    to: "/projects/fast-feast",
    icon: Code2,
    type: "project",
    badge: "Web Dev",
  },
  {
    id: "feat-snapurl",
    label: "SnapURL",
    description: "High-performance URL shortener with analytics",
    to: "/projects/snapurl",
    icon: Code2,
    type: "project",
    badge: "Full Stack",
  },
  {
    id: "feat-nerds",
    label: "Nerds Hack Days: Kanoon-Mate",
    description: "Latest hackathon · July 2026 · AI Legal OS",
    to: "/journey#nerds-hack-days-lucknow-2026",
    icon: GitBranch,
    type: "hackathon",
    badge: "Latest",
  },
  {
    id: "feat-security",
    label: "Security Labs",
    description: "Ethical hacking, CTF & OWASP lab experiments",
    to: "/experiments/security-labs",
    icon: ShieldCheck,
    type: "experiment",
    badge: "Lab",
  },
  {
    id: "feat-blog",
    label: "Latest Blog: India vs Innovation",
    description: "A student perspective on education & innovation",
    to: "/blog/india-produces-toppers-the-world-produces-innovators",
    icon: BookOpen,
    type: "blog",
    badge: "Blog",
  },
];

const SEARCH_CHIPS = [
  { label: "WhatsApp Clone", to: "/projects/whatsapp-fullstack-clone" },
  { label: "Vistagram", to: "/projects/vistagram" },
  { label: "Kanoon-Mate", to: "/projects/kanoon-mate" },
  { label: "Nerds Hackathon", to: "/journey#nerds-hack-days-lucknow-2026" },
  { label: "Android Nova", to: "/journey#android-nova-2026" },
  { label: "ASSOCHAM", to: "/journey#assocham-samarth-2026" },
  { label: "Fast Feast", to: "/projects/fast-feast" },
  { label: "SnapURL", to: "/projects/snapurl" },
  { label: "Security Labs", to: "/experiments/security-labs" },
  { label: "Instagram", query: "Instagram" },
  { label: "WhatsApp", query: "WhatsApp" },
  { label: "React", query: "React" },
  { label: "Node.js", query: "Node.js" },
];

const TYPE_LABELS = {
  page: "Pages",
  experiment: "Experiments",
  project: "Projects",
  skill: "Skills",
  blog: "Blog",
  hackathon: "Hackathons & Journey",
  social: "Social & Contact",
};

const TYPE_ORDER = ["page", "hackathon", "project", "blog", "experiment", "skill", "social"];

const TYPE_COLORS = {
  page:       { dark: "text-ink-200 bg-white/[0.04] border-white/[0.1]",            light: "text-ink-700 bg-black/[0.04] border-black/[0.1]" },
  experiment: { dark: "text-emerald-300 bg-emerald-500/10 border-emerald-500/25",  light: "text-emerald-700 bg-emerald-500/10 border-emerald-600/25" },
  project:    { dark: "text-emerald-300 bg-emerald-500/10 border-emerald-500/25",  light: "text-emerald-700 bg-emerald-500/10 border-emerald-600/25" },
  skill:      { dark: "text-ink-200 bg-white/[0.04] border-white/[0.1]",            light: "text-ink-700 bg-black/[0.04] border-black/[0.1]" },
  blog:       { dark: "text-emerald-300 bg-emerald-500/10 border-emerald-500/25",  light: "text-emerald-700 bg-emerald-500/10 border-emerald-600/25" },
  hackathon:  { dark: "text-emerald-300 bg-emerald-500/10 border-emerald-500/25",  light: "text-emerald-700 bg-emerald-500/10 border-emerald-600/25" },
  social:     { dark: "text-ink-200 bg-white/[0.04] border-white/[0.1]",            light: "text-ink-700 bg-black/[0.04] border-black/[0.1]" },
};

const SearchModal = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const scored = ALL_ITEMS.map((item) => ({ item, s: score(item, query) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.item);

    // Group by type, cap each at 4
    const grouped = {};
    scored.forEach((item) => {
      if (!grouped[item.type]) grouped[item.type] = [];
      if (grouped[item.type].length < 4) grouped[item.type].push(item);
    });

    const flat = [];
    TYPE_ORDER.forEach((type) => {
      if (grouped[type]?.length) flat.push(...grouped[type]);
    });
    return flat.slice(0, 20);
  }, [query]);

  const displayList = query.trim() ? results : FEATURED;

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const handleSelect = useCallback(
    (item) => {
      onClose();
      if (item.href && item.type === "social") {
        window.open(item.href, "_blank", "noopener,noreferrer");
        return;
      }
      const to = item.to;
      navigate(to);
    },
    [navigate, onClose],
  );

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, displayList.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (displayList[activeIdx]) handleSelect(displayList[activeIdx]);
    }
  };

  // Scroll active into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  // Group results for sectioned display
  const grouped = useMemo(() => {
    if (!query.trim()) return null;
    const map = {};
    let flat_i = 0;
    TYPE_ORDER.forEach((type) => {
      const items = results.filter((r) => r.type === type);
      if (items.length) {
        map[type] = items.map((item) => ({ item, flatIdx: flat_i++ }));
      }
    });
    return map;
  }, [results, query]);

  const renderItem = (item, idx, isActive) => {
    const Icon = item.icon;
    const colors = TYPE_COLORS[item.type] ?? TYPE_COLORS.page;
    const colorStr = isDark ? colors.dark : colors.light;
    return (
      <button
        key={item.id}
        type="button"
        data-idx={idx}
        onClick={() => handleSelect(item)}
        className={clsx(
          "group w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors duration-150 border",
          isActive
            ? isDark
              ? "bg-emerald-500/10 border-emerald-500/35 text-ink-50"
              : "bg-emerald-500/10 border-emerald-600/35 text-ink-950"
            : isDark
              ? "border-transparent hover:bg-white/[0.04] hover:border-white/[0.08]"
              : "border-transparent hover:bg-black/[0.03] hover:border-black/[0.08]",
        )}
        onMouseEnter={() => setActiveIdx(idx)}
      >
        <span
          className={clsx(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors",
            colorStr,
          )}
        >
          <Icon size={16} strokeWidth={1.5} />
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={clsx(
              "text-xs sm:text-sm font-semibold truncate transition-colors",
              isActive
                ? isDark ? "text-ink-50" : "text-ink-950"
                : isDark
                  ? "text-ink-200 group-hover:text-ink-50"
                  : "text-ink-800 group-hover:text-ink-950",
            )}
          >
            {item.label}
          </p>
          {item.description && (
            <p
              className={clsx(
                "text-xs truncate mt-0.5 transition-colors",
                isActive
                  ? isDark ? "text-emerald-300/90" : "text-emerald-700"
                  : isDark
                    ? "text-ink-400 group-hover:text-ink-300"
                    : "text-ink-500 group-hover:text-ink-700",
              )}
            >
              {item.description}
            </p>
          )}
        </div>
        {item.badge && (
          <span
            className={clsx(
              "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium border",
              colorStr,
            )}
          >
            {item.badge}
          </span>
        )}
        {item.type === "social" ? (
          <ExternalLink
            size={14}
            strokeWidth={1.5}
            className={clsx(
              "shrink-0 opacity-60 group-hover:opacity-100 transition-opacity hidden sm:block",
              isDark ? "text-emerald-400" : "text-emerald-600",
            )}
          />
        ) : (
          <ArrowRight
            size={15}
            strokeWidth={1.5}
            className={clsx(
              "shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 hidden sm:block",
              isDark ? "text-emerald-400" : "text-emerald-600",
            )}
          />
        )}
      </button>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className={clsx(
              "fixed inset-0 z-[9998] backdrop-blur-sm transition-colors",
              isDark ? "bg-black/75" : "bg-ink-950/35",
            )}
            onClick={onClose}
          />

          <MotionDiv
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.18 }}
            className={clsx(
              "fixed z-[9999] flex flex-col overflow-hidden border transition-colors duration-150",
              "inset-0",
              "sm:inset-auto sm:left-1/2 sm:top-[8vh] sm:-translate-x-1/2 sm:w-[95vw] sm:max-w-2xl sm:rounded-2xl sm:max-h-[80vh]",
              isDark
                ? "bg-[#11141c] border-white/[0.1] text-ink-50"
                : "bg-white border-black/[0.1] text-ink-950",
            )}
          >
            <div
              className={clsx(
                "flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-3.5 sm:py-4 border-b shrink-0 transition-colors",
                isDark ? "border-white/[0.08] bg-[#0c0e14]" : "border-black/[0.08] bg-[#f8fafc]",
              )}
            >
              <Search
                size={18}
                strokeWidth={1.5}
                className={isDark ? "text-emerald-400 shrink-0" : "text-emerald-600 shrink-0"}
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search projects, skills, social, hackathons, blogs..."
                className={clsx(
                  "flex-1 bg-transparent text-sm sm:text-base font-medium outline-none placeholder:font-normal placeholder:text-xs sm:placeholder:text-sm min-w-0 transition-colors",
                  isDark
                    ? "text-ink-50 placeholder:text-ink-400"
                    : "text-ink-950 placeholder:text-ink-500",
                )}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className={clsx(
                    "rounded-lg p-1 transition-colors shrink-0",
                    isDark ? "text-ink-400 hover:text-ink-50" : "text-ink-500 hover:text-ink-950",
                  )}
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className={clsx(
                  "flex sm:hidden h-8 w-8 items-center justify-center rounded-full border transition-colors shrink-0",
                  isDark
                    ? "border-white/[0.1] bg-white/[0.05] text-ink-300"
                    : "border-black/[0.1] bg-black/[0.04] text-ink-700",
                )}
                aria-label="Close search"
              >
                <X size={15} strokeWidth={1.5} />
              </button>
              <kbd
                className={clsx(
                  "hidden sm:inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-mono font-medium shrink-0",
                  isDark ? "border-white/[0.1] text-ink-400 bg-[#11141c]" : "border-black/[0.1] text-ink-600 bg-white",
                )}
              >
                ESC
              </kbd>
            </div>

            <div
              className={clsx(
                "flex items-center gap-1.5 overflow-x-auto px-4 sm:px-5 py-2.5 border-b shrink-0 no-scrollbar scroll-smooth transition-colors",
                isDark ? "border-white/[0.08] bg-[#0c0e14]" : "border-black/[0.08] bg-[#f8fafc]",
              )}
            >
              <span
                className={clsx(
                  "text-xs font-mono font-medium shrink-0 mr-1",
                  isDark ? "text-emerald-400" : "text-emerald-700",
                )}
              >
                Quick filter:
              </span>
              {SEARCH_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => {
                    if (chip.to) {
                      handleSelect(chip);
                    } else if (chip.query) {
                      setQuery(chip.query);
                    }
                  }}
                  className={clsx(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border shrink-0 transition-colors duration-150",
                    isDark
                      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400/50"
                      : "border-emerald-600/25 bg-white text-emerald-800 hover:bg-emerald-500/10 hover:border-emerald-600/40",
                  )}
                >
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>

            <div
              ref={listRef}
              className="flex-1 overflow-y-auto overscroll-contain px-3.5 py-3 space-y-1.5 touch-pan-y"
            >
              {!query.trim() && (
                <>
                  <p
                    className={clsx(
                      "mb-2 px-2 text-xs font-medium font-mono",
                      isDark ? "text-emerald-400" : "text-emerald-700",
                    )}
                  >
                    Latest Projects &amp; Featured
                  </p>
                  {FEATURED.map((item, i) => renderItem(item, i, activeIdx === i))}
                </>
              )}

              {query.trim() && results.length > 0 && grouped && (
                <>
                  <p
                    className={clsx(
                      "mb-2 px-2 text-xs font-mono font-medium tabular-nums",
                      isDark ? "text-ink-400" : "text-ink-600",
                    )}
                  >
                    {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
                    <span className={clsx("font-semibold", isDark ? "text-emerald-400" : "text-emerald-700")}>"{query}"</span>
                  </p>
                  {TYPE_ORDER.map((type) => {
                    const section = grouped[type];
                    if (!section?.length) return null;
                    return (
                      <div key={type} className="mb-3">
                        <p
                          className={clsx(
                            "mb-1 px-2 text-xs font-medium font-mono",
                            isDark ? "text-emerald-400" : "text-emerald-700",
                          )}
                        >
                          {TYPE_LABELS[type]}
                        </p>
                        {section.map(({ item, flatIdx }) =>
                          renderItem(item, flatIdx, activeIdx === flatIdx)
                        )}
                      </div>
                    );
                  })}
                </>
              )}

              {query.trim() && results.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Search
                    size={26}
                    strokeWidth={1.5}
                    className={isDark ? "text-emerald-400/60 mb-2" : "text-emerald-600/60 mb-2"}
                  />
                  <p className={clsx("text-sm font-semibold", isDark ? "text-ink-200" : "text-ink-800")}>
                    No results for "{query}"
                  </p>
                  <p className={clsx("text-xs mt-1 max-w-xs", isDark ? "text-ink-400" : "text-ink-600")}>
                    Try searching for Kanoon-Mate, Fast Feast, React, Node.js, or Nerds Hack Days.
                  </p>
                </div>
              )}
            </div>

            <div
              className={clsx(
                "flex items-center justify-between gap-4 border-t px-4 sm:px-5 py-2.5 sm:py-3 shrink-0 transition-colors",
                isDark ? "border-white/[0.08] bg-[#0c0e14]" : "border-black/[0.08] bg-[#f8fafc]",
              )}
            >
              <div className="hidden sm:flex items-center gap-3">
                {[
                  { keys: ["↑", "↓"], label: "navigate" },
                  { keys: ["↵"], label: "select" },
                  { keys: ["Esc"], label: "close" },
                ].map(({ keys, label }) => (
                  <div key={label} className="flex items-center gap-1">
                    {keys.map((k) => (
                      <kbd
                        key={k}
                        className={clsx(
                          "rounded px-1.5 py-0.5 text-[11px] font-mono font-medium border",
                          isDark
                            ? "border-white/[0.1] text-ink-300 bg-[#11141c]"
                            : "border-black/[0.1] text-ink-700 bg-white",
                        )}
                      >
                        {k}
                      </kbd>
                    ))}
                    <span className={clsx("text-xs", isDark ? "text-ink-400" : "text-ink-600")}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <p className={clsx("sm:hidden text-xs font-mono", isDark ? "text-ink-400" : "text-ink-600")}>
                Tap any result to view details
              </p>

              <span className={clsx("text-xs font-mono font-medium hidden sm:inline-block", isDark ? "text-ink-400" : "text-ink-600")}>
                Ctrl K
              </span>
            </div>
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
