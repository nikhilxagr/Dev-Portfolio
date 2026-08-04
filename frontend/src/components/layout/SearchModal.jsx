import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Code2,
  Cpu,
  FileText,
  FlaskConical,
  Folder,
  GitBranch,
  Hash,
  KeyRound,
  Lock,
  Mail,
  Milestone,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  User,
  Wrench,
  X,
} from "lucide-react";
import { NAV_LINKS, SKILL_GROUPS } from "@/constants/siteData";
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
    const kw = tokenise(
      `${project.title} ${project.category} ${(project.techStack ?? []).join(" ")} ${project.tagline ?? ""} ${project.description ?? ""}`
    );
    items.push({
      id: `project-${project.slug}`,
      type: "project",
      label: project.title,
      description: project.tagline,
      to: `/projects/${project.slug}`,
      icon: Code2,
      badge: project.category,
      keywords: kw,
      _corpus: kw.join(" "),
    });
  });

  // Skills
  SKILL_GROUPS.forEach((group) => {
    group.items.forEach((skill) => {
      const kw = tokenise(`${skill} ${group.title} skill`);
      items.push({
        id: `skill-${skill.toLowerCase().replace(/\s+/g, "-")}`,
        type: "skill",
        label: skill,
        description: `${group.title}`,
        to: "/skills",
        icon: Hash,
        keywords: kw,
        _corpus: kw.join(" "),
      });
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

  return items;
};

const ALL_ITEMS = buildIndex();

const FEATURED = [
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
    label: "Nerds Hack Days — Kanoon-Mate",
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
  { icon: "⚖️", label: "Kanoon-Mate", to: "/projects/kanoon-mate" },
  { icon: "🏆", label: "Nerds Hackathon", to: "/journey#nerds-hack-days-lucknow-2026" },
  { icon: "🚀", label: "Android Nova", to: "/journey#android-nova-2026" },
  { icon: "💼", label: "ASSOCHAM", to: "/journey#assocham-samarth-2026" },
  { icon: "🍔", label: "Fast Feast", to: "/projects/fast-feast" },
  { icon: "⚡", label: "SnapURL", to: "/projects/snapurl" },
  { icon: "🛡️", label: "Security Labs", to: "/experiments/security-labs" },
  { icon: "💻", label: "React", query: "React" },
  { icon: "🟢", label: "Node.js", query: "Node.js" },
];

const TYPE_LABELS = {
  page: "Pages",
  experiment: "Experiments",
  project: "Projects",
  skill: "Skills",
  blog: "Blog",
  hackathon: "Hackathons & Journey",
};

const TYPE_ORDER = ["page", "hackathon", "project", "blog", "experiment", "skill"];

const TYPE_COLORS = {
  page:       { dark: "text-sky-400 bg-sky-400/10 border-sky-400/30",         light: "text-sky-800 bg-sky-100 border-sky-300 font-bold" },
  experiment: { dark: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30", light: "text-emerald-800 bg-emerald-100 border-emerald-300 font-bold" },
  project:    { dark: "text-purple-400 bg-purple-400/10 border-purple-400/30",   light: "text-purple-800 bg-purple-100 border-purple-300 font-bold" },
  skill:      { dark: "text-amber-400 bg-amber-400/10 border-amber-400/30",     light: "text-amber-900 bg-amber-100 border-amber-300 font-bold" },
  blog:       { dark: "text-rose-400 bg-rose-400/10 border-rose-400/30",     light: "text-rose-800 bg-rose-100 border-rose-300 font-bold" },
  hackathon:  { dark: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",     light: "text-teal-800 bg-teal-100 border-teal-300 font-bold" },
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
          "group w-full flex items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition-all duration-150 active:scale-[0.99] border",
          isActive
            ? isDark
              ? "bg-cyan-500/15 border-cyan-400/40 text-white shadow-[0_0_20px_rgba(6,182,212,0.15)]"
              : "bg-emerald-500/10 border-emerald-500/40 text-emerald-950 shadow-sm"
            : isDark
              ? "border-transparent hover:bg-white/[0.06] hover:border-white/10"
              : "border-transparent hover:bg-slate-100/90 hover:border-slate-300/80",
        )}
        onMouseEnter={() => setActiveIdx(idx)}
      >
        <span
          className={clsx(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-transform group-hover:scale-105",
            colorStr,
          )}
        >
          <Icon size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={clsx(
              "text-xs sm:text-sm font-bold truncate transition-colors",
              isActive
                ? isDark ? "text-white" : "text-emerald-950"
                : isDark
                  ? "text-slate-200 group-hover:text-white"
                  : "text-slate-800 group-hover:text-slate-950",
            )}
          >
            {item.label}
          </p>
          {item.description && (
            <p
              className={clsx(
                "text-[11px] sm:text-xs truncate mt-0.5 font-medium transition-colors",
                isActive
                  ? isDark ? "text-cyan-200/90" : "text-emerald-800/90"
                  : isDark
                    ? "text-slate-400 group-hover:text-slate-300"
                    : "text-slate-600 group-hover:text-slate-700",
              )}
            >
              {item.description}
            </p>
          )}
        </div>
        {item.badge && (
          <span
            className={clsx(
              "shrink-0 rounded-full px-2.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider border",
              colorStr,
            )}
          >
            {item.badge}
          </span>
        )}
        <ArrowRight
          size={15}
          className={clsx(
            "shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 hidden sm:block",
            isDark ? "text-cyan-400" : "text-emerald-600",
          )}
        />
      </button>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className={clsx(
              "fixed inset-0 z-[9998] backdrop-blur-md transition-colors",
              isDark ? "bg-black/75" : "bg-slate-900/40",
            )}
            onClick={onClose}
          />

          {/* Panel — Full screen on mobile, floating card on sm+ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.5 }}
            className={clsx(
              "fixed z-[9999] flex flex-col overflow-hidden border shadow-2xl transition-colors duration-200",
              // Mobile: full screen
              "inset-0",
              // sm+: floating centered panel
              "sm:inset-auto sm:left-1/2 sm:top-[8vh] sm:-translate-x-1/2 sm:w-[95vw] sm:max-w-2xl sm:rounded-3xl sm:max-h-[80vh]",
              isDark
                ? "bg-[#07131e] border-cyan-500/30 text-slate-100 shadow-[0_25px_70px_rgba(0,0,0,0.9)]"
                : "bg-white border-slate-300 text-slate-900 shadow-[0_25px_70px_rgba(0,0,0,0.18)]",
            )}
          >
            {/* Search Input Row */}
            <div
              className={clsx(
                "flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-5 py-3.5 sm:py-4 border-b shrink-0 transition-colors",
                isDark ? "border-cyan-500/20 bg-slate-950/40" : "border-slate-200 bg-slate-50/90",
              )}
            >
              <Search
                size={19}
                className={isDark ? "text-cyan-400 shrink-0" : "text-emerald-600 shrink-0"}
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search projects, skills, hackathons, blogs..."
                className={clsx(
                  "flex-1 bg-transparent text-sm sm:text-base font-semibold outline-none placeholder:font-normal placeholder:text-xs sm:placeholder:text-sm min-w-0 transition-colors",
                  isDark
                    ? "text-white placeholder:text-slate-400"
                    : "text-slate-900 placeholder:text-slate-500",
                )}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className={clsx(
                    "rounded-lg p-1 transition shrink-0",
                    isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900",
                  )}
                >
                  <X size={16} />
                </button>
              )}
              {/* Close button for Mobile Touch */}
              <button
                type="button"
                onClick={onClose}
                className={clsx(
                  "flex sm:hidden h-8 w-8 items-center justify-center rounded-full border transition shrink-0",
                  isDark
                    ? "border-slate-700 bg-slate-800/80 text-slate-300 active:bg-slate-700"
                    : "border-slate-300 bg-slate-200/80 text-slate-700 active:bg-slate-300",
                )}
                aria-label="Close search"
              >
                <X size={15} />
              </button>
              <kbd
                className={clsx(
                  "hidden sm:inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-mono font-bold shrink-0",
                  isDark ? "border-slate-700 text-slate-400 bg-slate-900" : "border-slate-300 text-slate-600 bg-slate-100",
                )}
              >
                ESC
              </kbd>
            </div>

            {/* Quick Suggestion Chips */}
            <div
              className={clsx(
                "flex items-center gap-1.5 overflow-x-auto px-3.5 sm:px-5 py-2.5 border-b shrink-0 no-scrollbar scroll-smooth transition-colors",
                isDark ? "border-cyan-500/15 bg-slate-950/60" : "border-slate-200 bg-slate-100/70",
              )}
            >
              <span
                className={clsx(
                  "text-[10px] uppercase font-mono font-bold tracking-wider shrink-0 mr-1",
                  isDark ? "text-cyan-400" : "text-emerald-800",
                )}
              >
                Top Matches:
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
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold border shrink-0 transition-all duration-150 active:scale-95 shadow-sm",
                    isDark
                      ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400"
                      : "border-emerald-300 bg-white text-emerald-900 hover:bg-emerald-50 hover:border-emerald-400",
                  )}
                >
                  <span>{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>

            {/* Results List */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto overscroll-contain px-3.5 py-3 space-y-1.5 touch-pan-y"
            >
              {/* Featured / Quick Access */}
              {!query.trim() && (
                <>
                  <p
                    className={clsx(
                      "mb-2 px-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest font-mono",
                      isDark ? "text-cyan-400/70" : "text-emerald-700",
                    )}
                  >
                    // Latest Projects & Featured
                  </p>
                  {FEATURED.map((item, i) => renderItem(item, i, activeIdx === i))}
                </>
              )}

              {/* Search Results */}
              {query.trim() && results.length > 0 && grouped && (
                <>
                  <p
                    className={clsx(
                      "mb-2 px-2 text-[11px] font-mono font-medium",
                      isDark ? "text-slate-400" : "text-slate-600",
                    )}
                  >
                    {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
                    <span className={clsx("font-bold", isDark ? "text-cyan-400" : "text-emerald-700")}>"{query}"</span>
                  </p>
                  {TYPE_ORDER.map((type) => {
                    const section = grouped[type];
                    if (!section?.length) return null;
                    return (
                      <div key={type} className="mb-3">
                        <p
                          className={clsx(
                            "mb-1 px-2 text-[10px] font-bold uppercase tracking-widest font-mono",
                            isDark ? "text-cyan-400/70" : "text-emerald-700",
                          )}
                        >
                          // {TYPE_LABELS[type]}
                        </p>
                        {section.map(({ item, flatIdx }) =>
                          renderItem(item, flatIdx, activeIdx === flatIdx)
                        )}
                      </div>
                    );
                  })}
                </>
              )}

              {/* No results */}
              {query.trim() && results.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Sparkles
                    size={30}
                    className={isDark ? "text-cyan-400/50 mb-2" : "text-emerald-600/50 mb-2"}
                  />
                  <p className={clsx("text-sm font-bold", isDark ? "text-slate-200" : "text-slate-800")}>
                    No results for <span className="font-extrabold">"{query}"</span>
                  </p>
                  <p className={clsx("text-xs mt-1 max-w-xs font-medium", isDark ? "text-slate-400" : "text-slate-600")}>
                    Try searching for Kanoon-Mate, Fast Feast, React, Node.js, or Nerds Hack Days.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Hint */}
            <div
              className={clsx(
                "flex items-center justify-between gap-4 border-t px-4 sm:px-5 py-2.5 sm:py-3 shrink-0 transition-colors",
                isDark ? "border-cyan-500/20 bg-slate-950/60" : "border-slate-200 bg-slate-50",
              )}
            >
              {/* Desktop Shortcut Hints */}
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
                          "rounded px-1.5 py-0.5 text-[10px] font-mono font-bold border",
                          isDark
                            ? "border-slate-700 text-slate-300 bg-slate-900"
                            : "border-slate-300 text-slate-700 bg-white shadow-xs",
                        )}
                      >
                        {k}
                      </kbd>
                    ))}
                    <span className={clsx("text-[11px] font-semibold", isDark ? "text-slate-400" : "text-slate-600")}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Mobile Touch Hint */}
              <p className={clsx("sm:hidden text-[11px] font-mono font-semibold", isDark ? "text-slate-400" : "text-slate-600")}>
                Tap any result to view details
              </p>

              <span className={clsx("text-[11px] font-mono font-bold hidden sm:inline-block", isDark ? "text-slate-400" : "text-slate-600")}>
                Ctrl K
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
