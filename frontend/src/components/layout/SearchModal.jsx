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
import {
  BLOG_LINKS,
  NAV_LINKS,
  SIGNATURE_PROJECTS,
  SKILL_GROUPS,
} from "@/constants/siteData";
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

// Build index of pages, projects, skills, blogs, and timeline items
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

  // Journey / Hackathons — each item gets a deep-link hash
  const hackathons = [
    {
      id: "journey-nerds",
      domId: "nerds-hack-days-lucknow-2026",
      label: "Nerds Hack Days Lucknow",
      description: "Nerds Room × MLH · July 2026 · Built Kanoon-Mate AI Legal OS",
      badge: "Latest",
      extra: "kanoon mate legal ai hackathon nerds room mlh pw institute innovation",
    },
    {
      id: "journey-techx26",
      domId: "techx26-hackathon-2026",
      label: "TechX26 Hackathon",
      description: "12-Hour Build Sprint · AI & Innovation",
      badge: "Hackathon",
      extra: "techx26 hackathon ai build sprint innovation",
    },
    {
      id: "journey-android-nova",
      domId: "android-nova-2026",
      label: "Android Nova 2.0",
      description: "Android development workshop · Jetpack Compose",
      badge: "Workshop",
      extra: "android nova workshop jetpack compose mobile development",
    },
    {
      id: "journey-hackwithsmile",
      domId: "hackwithsmile-ctf-2026",
      label: "HackWithSmile CTF 2026",
      description: "Cybersecurity CTF competition · 2026",
      badge: "CTF",
      extra: "ctf hackwithsmile cybersecurity competition",
    },
    {
      id: "journey-product-builders",
      domId: "product-builders-day-2026",
      label: "Product Builders Day",
      description: "Startup & product building event · 2026",
      badge: "Event",
      extra: "product builders day startup event 2026",
    },
    {
      id: "journey-launch-pad",
      domId: "launch-pad-startup-screening-2026",
      label: "Launch Pad Startup Screening",
      description: "Startup screening & pitching event",
      badge: "Startup",
      extra: "launchpad startup screening pitch event",
    },
    {
      id: "journey-bca",
      domId: "bca-bbd-2024",
      label: "BCA at BBD University",
      description: "Bachelor of Computer Applications · 2024–2027",
      badge: "Education",
      extra: "bca babu banarasi das university degree education college",
    },
    {
      id: "journey-cisco",
      domId: "cisco-ethical-hacker-2025",
      label: "Cisco Ethical Hacker Certification",
      description: "Cisco Networking Academy · Ethical Hacking",
      badge: "Cert",
      extra: "cisco ethical hacker certification networking academy",
    },
    {
      id: "journey-tryhackme-advent",
      domId: "tryhackme-advent-cyber-2025",
      label: "TryHackMe Advent of Cyber",
      description: "Cybersecurity advent challenge 2025",
      badge: "Security",
      extra: "tryhackme advent cyber 2025 security challenge",
    },
    {
      id: "journey-top1",
      domId: "top-1-percent-tryhackme-2026",
      label: "TryHackMe Top 1% Ranking",
      description: "Achieved top 1% global rank on TryHackMe",
      badge: "Achievement",
      extra: "tryhackme top 1 percent rank global security achievement",
    },
    {
      id: "journey-hackerone",
      domId: "hackerone-security-researcher-2026",
      label: "HackerOne Security Researcher",
      description: "Registered security researcher on HackerOne",
      badge: "Security",
      extra: "hackerone bug bounty researcher security",
    },
    {
      id: "journey-openai",
      domId: "openai-ai-foundations-2026",
      label: "OpenAI AI Foundations",
      description: "OpenAI — AI Foundations certification",
      badge: "AI",
      extra: "openai ai foundations certification artificial intelligence",
    },
    {
      id: "journey-assocham",
      domId: "assocham-samarth-2026",
      label: "ASSOCHAM Samarth Program",
      description: "Industry event & networking program",
      badge: "Event",
      extra: "assocham samarth program industry networking",
    },
    {
      id: "journey-wscubetech",
      domId: "wscubetech-masterclass-2026",
      label: "WsCubeTech Masterclass",
      description: "Technical masterclass on web development",
      badge: "Workshop",
      extra: "wscubetech masterclass web development workshop",
    },
    {
      id: "journey-started-cyber",
      domId: "started-cybersecurity-journey-2025",
      label: "Started Cybersecurity Journey",
      description: "TryHackMe & self-learning — 2025",
      badge: "Security",
      extra: "cybersecurity journey started tryhackme self learning 2025",
    },
  ];

  hackathons.forEach((h) => {
    const kw = tokenise(`${h.label} ${h.description} hackathon journey ${h.extra}`);
    items.push({
      id: h.id,
      type: "hackathon",
      label: h.label,
      description: h.description,
      to: `/journey#${h.domId}`,
      icon: GitBranch,
      badge: h.badge,
      keywords: kw,
      _corpus: kw.join(" "),
    });
  });

  return items;
};

const ALL_ITEMS = buildIndex();

const FEATURED = [
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
    id: "feat-kanoon",
    label: "Kanoon-Mate Project",
    description: "AI Legal Operating System built at Nerds Hack Days",
    to: "/projects/kanoon-mate",
    icon: Code2,
    type: "project",
    badge: "AI",
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
  {
    id: "feat-contact",
    label: "Contact Me",
    description: "Get in touch — internships, freelance, collaborations",
    to: "/contact",
    icon: Mail,
    type: "page",
    badge: "Page",
  },
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
  page:       { dark: "text-sky-400   bg-sky-400/10   border-sky-400/20",         light: "text-sky-700   bg-sky-100   border-sky-200" },
  experiment: { dark: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", light: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  project:    { dark: "text-violet-400 bg-violet-400/10 border-violet-400/20",   light: "text-violet-700 bg-violet-50 border-violet-200" },
  skill:      { dark: "text-amber-400  bg-amber-400/10  border-amber-400/20",     light: "text-amber-700  bg-amber-100  border-amber-200" },
  blog:       { dark: "text-rose-400   bg-rose-400/10   border-rose-400/20",     light: "text-rose-700   bg-rose-100   border-rose-200" },
  hackathon:  { dark: "text-cyan-400   bg-cyan-400/10   border-cyan-400/20",     light: "text-cyan-700   bg-cyan-100   border-cyan-200" },
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
      // Navigate — hash routes work with react-router navigate
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
          "group w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-150",
          isActive
            ? isDark
              ? "bg-cyan-500/10 border border-cyan-500/25"
              : "bg-emerald-50 border border-emerald-200"
            : "border border-transparent hover:border-slate-200/60 dark:hover:border-white/[0.06]",
        )}
        onMouseEnter={() => setActiveIdx(idx)}
      >
        <span
          className={clsx(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border",
            colorStr,
          )}
        >
          <Icon size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={clsx(
              "text-sm font-semibold truncate",
              isDark ? "text-slate-200" : "text-slate-900",
            )}
          >
            {item.label}
          </p>
          {item.description && (
            <p
              className={clsx(
                "text-xs truncate mt-0.5",
                isDark ? "text-slate-500" : "text-slate-500",
              )}
            >
              {item.description}
            </p>
          )}
        </div>
        {item.badge && (
          <span
            className={clsx(
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase border",
              colorStr,
            )}
          >
            {item.badge}
          </span>
        )}
        <ArrowRight
          size={14}
          className={clsx(
            "shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150",
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
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 340, damping: 28, mass: 0.6 }}
            className={clsx(
              "fixed left-1/2 top-[10vh] z-[9999] w-[95vw] max-w-2xl -translate-x-1/2 rounded-3xl border shadow-2xl overflow-hidden",
              isDark
                ? "bg-[#05111e]/98 border-cyan-500/25 shadow-[0_30px_80px_rgba(0,0,0,0.8)]"
                : "bg-white/98 border-slate-200 shadow-[0_30px_80px_rgba(0,0,0,0.15)]",
            )}
          >
            {/* Search Input Row */}
            <div
              className={clsx(
                "flex items-center gap-3 px-5 py-4 border-b",
                isDark ? "border-cyan-500/15" : "border-slate-200",
              )}
            >
              <Search
                size={18}
                className={isDark ? "text-cyan-400 shrink-0" : "text-slate-500 shrink-0"}
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search pages, projects, skills, blogs, hackathons..."
                className={clsx(
                  "flex-1 bg-transparent text-base font-medium outline-none placeholder:text-sm",
                  isDark
                    ? "text-white placeholder:text-slate-500"
                    : "text-slate-900 placeholder:text-slate-400",
                )}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className={clsx(
                    "rounded-lg p-1 transition",
                    isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900",
                  )}
                >
                  <X size={15} />
                </button>
              )}
              <kbd
                className={clsx(
                  "hidden sm:inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-mono",
                  isDark ? "border-slate-700 text-slate-500" : "border-slate-200 text-slate-400",
                )}
              >
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div
              ref={listRef}
              className="max-h-[62vh] overflow-y-auto overscroll-contain px-3 py-3"
            >
              {/* Featured / Quick Access */}
              {!query.trim() && (
                <>
                  <p
                    className={clsx(
                      "mb-2 px-2 text-[11px] font-bold uppercase tracking-widest font-mono",
                      isDark ? "text-slate-500" : "text-slate-400",
                    )}
                  >
                    // Featured & Quick Access
                  </p>
                  {FEATURED.map((item, i) => renderItem(item, i, activeIdx === i))}
                </>
              )}

              {/* Search Results */}
              {query.trim() && results.length > 0 && grouped && (
                <>
                  <p
                    className={clsx(
                      "mb-2 px-2 text-[11px] font-mono",
                      isDark ? "text-slate-600" : "text-slate-400",
                    )}
                  >
                    {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
                    <span className={isDark ? "text-cyan-400" : "text-emerald-600"}>"{query}"</span>
                  </p>
                  {TYPE_ORDER.map((type) => {
                    const section = grouped[type];
                    if (!section?.length) return null;
                    return (
                      <div key={type} className="mb-3">
                        <p
                          className={clsx(
                            "mb-1 px-2 text-[10px] font-bold uppercase tracking-widest font-mono",
                            isDark ? "text-slate-500" : "text-slate-400",
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
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Sparkles
                    size={32}
                    className={isDark ? "text-slate-600 mb-3" : "text-slate-300 mb-3"}
                  />
                  <p className={clsx("text-sm font-semibold", isDark ? "text-slate-400" : "text-slate-600")}>
                    No results for <span className="font-bold">"{query}"</span>
                  </p>
                  <p className={clsx("text-xs mt-1", isDark ? "text-slate-600" : "text-slate-400")}>
                    Try: a project name, skill, hackathon, or blog topic.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Hint */}
            <div
              className={clsx(
                "flex items-center justify-between gap-4 border-t px-5 py-3",
                isDark ? "border-cyan-500/10" : "border-slate-100",
              )}
            >
              <div className="flex items-center gap-3">
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
                          "rounded px-1.5 py-0.5 text-[10px] font-mono border",
                          isDark ? "border-slate-700 text-slate-500 bg-slate-800/60" : "border-slate-200 text-slate-400",
                        )}
                      >
                        {k}
                      </kbd>
                    ))}
                    <span className={clsx("text-[11px]", isDark ? "text-slate-600" : "text-slate-400")}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <span className={clsx("text-[11px] font-mono", isDark ? "text-slate-600" : "text-slate-400")}>
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
