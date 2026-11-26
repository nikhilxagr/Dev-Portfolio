import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Copy, ExternalLink, RotateCcw, Terminal } from "lucide-react";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import { createBreadcrumbSchema } from "@/utils/seo";
import { SIGNATURE_PROJECTS } from "@/data/projectsData";
import { BLOG_POSTS } from "@/data/blogsData";
import { QUICK_CONTACT, SKILL_GROUPS, STATS_METRICS } from "@/constants/siteData";
import { useSiteContent } from "@/context/SiteContentContext";
import { useTheme } from "@/context/ThemeContext";

const VIRTUAL_FILES = [
  "about.md",
  "skills.json",
  "contact.txt",
  "journey.log",
  "resume.pdf",
];

const OPEN_ROUTES = {
  home: "/",
  about: "/about",
  skills: "/skills",
  projects: "/projects",
  journey: "/journey",
  blog: "/blog",
  blogs: "/blog",
  services: "/services",
  contact: "/contact",
  ai: "/ai",
  security: "/experiments/security-labs",
  cyber: "/experiments/cyber-tools",
  dsa: "/experiments/dsa-lab",
  experiments: "/experiments",
};

const QUICK_COMMANDS = [
  "help",
  "neofetch",
  "projects",
  "skills",
  "journey",
  "stats",
  "search react",
  "contact",
  "open projects",
  "whoami",
];

const INITIAL_LINES = [
  {
    type: "banner",
    title: "Nikhil Agrahari · Developer & Security CLI",
    subtitle: "Type `help` for commands, `Tab` to autocomplete, or `open <page>` to navigate.",
  },
];

const ALL_COMMANDS = [
  "help",
  "about",
  "bio",
  "skills",
  "projects",
  "project",
  "blogs",
  "journey",
  "tools",
  "stats",
  "contact",
  "socials",
  "whoami",
  "neofetch",
  "ls",
  "cat",
  "search",
  "open",
  "theme",
  "history",
  "date",
  "echo",
  "sudo",
  "clear",
];

const TerminalPage = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { profile, about, skills, contact, journeyItems, statsMetrics } =
    useSiteContent();

  const [lines, setLines] = useState(INITIAL_LINES);
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [copied, setCopied] = useState(false);

  const terminalBodyRef = useRef(null);
  const inputRef = useRef(null);

  const liveData = useMemo(() => {
    const activeSkills = skills?.groups?.length ? skills.groups : SKILL_GROUPS;
    const activeMetrics = statsMetrics?.length ? statsMetrics : STATS_METRICS;
    const activeJourney = Array.isArray(journeyItems) ? journeyItems : [];
    const email =
      contact?.email || QUICK_CONTACT.email || "nikhilagrahari530@gmail.com";
    const phone = contact?.phone || QUICK_CONTACT.phone || "+91 7897872883";
    const github = contact?.github || QUICK_CONTACT.github || "https://github.com/nikhilxagr";
    const linkedin =
      contact?.linkedin || QUICK_CONTACT.linkedin || "https://www.linkedin.com/in/nikhilxagr/";
    const whatsapp = contact?.whatsapp || QUICK_CONTACT.whatsapp || "https://wa.me/7897872883";
    const resumeUrl =
      profile?.resumeFullStack || QUICK_CONTACT.resumeFullStack || "/images/resume/WebDev_Resume.pdf";

    return {
      fullName: profile?.fullName || "Nikhil Agrahari",
      roleTitle: profile?.roleTitle || "Full-Stack Developer & Security Researcher",
      education: profile?.educationLine || "BCA at BBDU Lucknow, India",
      location: profile?.location || "Lucknow, Uttar Pradesh, India",
      bioSummary:
        about?.heroBio ||
        "Third-year BCA student and Full-Stack Developer focused on MERN architecture, real-time messaging, and OWASP application security.",
      skillGroups: activeSkills,
      metrics: activeMetrics,
      journey: activeJourney.filter((item) => item.status !== "draft"),
      email,
      phone,
      github,
      linkedin,
      whatsapp,
      resumeUrl,
    };
  }, [about, contact, journeyItems, profile, skills, statsMetrics]);

  // Autocomplete inline ghost suggestion
  const ghostSuggestion = useMemo(() => {
    const trimmed = inputVal.trimStart().toLowerCase();
    if (!trimmed || trimmed.includes(" ")) return "";
    const match = ALL_COMMANDS.find((c) => c.startsWith(trimmed) && c !== trimmed);
    return match ? match.slice(trimmed.length) : "";
  }, [inputVal]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const timer = window.setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 80);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [lines]);

  const appendBlock = useCallback((cmdText, entries) => {
    setLines((prev) => [
      ...prev,
      { type: "user", text: cmdText },
      ...entries,
    ]);
  }, []);

  const executeCmd = useCallback(
    (cmdString) => {
      const rawCmd = cmdString.trim();
      if (!rawCmd) return;

      const parts = rawCmd.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);
      const argStr = args.join(" ");

      setHistory((prev) => [...prev, rawCmd]);
      setHistoryIdx(-1);
      setInputVal("");

      if (cmd === "clear" || cmd === "cls") {
        setLines([]);
        return;
      }

      if (cmd === "help") {
        appendBlock(rawCmd, [
          { type: "heading", text: "Available CLI commands" },
          {
            type: "output",
            text: [
              "Navigation & Files   ls, cat <file>, open <page|github|resume>, theme <light|dark>",
              "Portfolio Info       about, bio, skills, projects, project <name>, journey, blogs, stats",
              "Search & Contact     search <keyword>, contact, socials, whoami, neofetch",
              "Utilities            history, date, echo <text>, clear  (Tab = autocomplete, Up/Down = history)",
            ].join("\n"),
          },
        ]);
        return;
      }

      if (cmd === "ls" || cmd === "ll") {
        appendBlock(rawCmd, [
          {
            type: "output",
            text: VIRTUAL_FILES.map((f) => `  -rw-r--r--  ${f}`).join("\n") +
              "\n  drwxr-xr-x  projects/  blogs/  labs/",
          },
        ]);
        return;
      }

      if (cmd === "cat") {
        const file = argStr.toLowerCase();
        if (!file) {
          appendBlock(rawCmd, [
            { type: "error", text: `Usage: cat <file> (${VIRTUAL_FILES.join(", ")})` },
          ]);
          return;
        }
        if (file === "about.md") {
          appendBlock(rawCmd, [
            { type: "heading", text: `# ${liveData.fullName}` },
            { type: "output", text: `${liveData.roleTitle}\n${liveData.education}\n\n${liveData.bioSummary}` },
          ]);
          return;
        }
        if (file === "skills.json") {
          const obj = Object.fromEntries(
            liveData.skillGroups.map((g) => [g.title, g.items]),
          );
          appendBlock(rawCmd, [{ type: "output", text: JSON.stringify(obj, null, 2) }]);
          return;
        }
        if (file === "contact.txt") {
          appendBlock(rawCmd, [
            {
              type: "output",
              text: `Email: ${liveData.email}\nPhone: ${liveData.phone}\nGitHub: ${liveData.github}\nLinkedIn: ${liveData.linkedin}`,
            },
          ]);
          return;
        }
        if (file === "journey.log") {
          const recent = liveData.journey
            .slice(-6)
            .reverse()
            .map((j) => `[${j.year}] ${j.title} — ${j.organization}`);
          appendBlock(rawCmd, [{ type: "output", text: recent.join("\n") }]);
          return;
        }
        if (file === "resume.pdf") {
          window.open(liveData.resumeUrl, "_blank", "noopener,noreferrer");
          appendBlock(rawCmd, [
            { type: "accent", text: `Opened resume PDF (${liveData.resumeUrl}) in a new tab.` },
          ]);
          return;
        }
        appendBlock(rawCmd, [{ type: "error", text: `cat: ${argStr}: No such file` }]);
        return;
      }

      if (cmd === "about" || cmd === "bio") {
        appendBlock(rawCmd, [
          { type: "heading", text: `${liveData.fullName} — ${liveData.roleTitle}` },
          {
            type: "output",
            text: `Education : ${liveData.education}\nLocation  : ${liveData.location}\nSummary   : ${liveData.bioSummary}`,
          },
        ]);
        return;
      }

      if (cmd === "skills") {
        appendBlock(rawCmd, [
          { type: "heading", text: "Technical skills & domains" },
          {
            type: "output",
            text: liveData.skillGroups
              .map((g) => `[${g.title.padEnd(18, " ")}] ${g.items.join(", ")}`)
              .join("\n"),
          },
        ]);
        return;
      }

      if (cmd === "projects") {
        const formatted = SIGNATURE_PROJECTS.slice(0, 10)
          .map(
            (p, idx) =>
              `${String(idx + 1).padStart(2, "0")}. ${p.title} (${p.category})\n    ${p.tagline || p.subtitle}\n    Stack: ${(p.tags || p.techStack || []).slice(0, 5).join(", ")}`,
          )
          .join("\n\n");
        appendBlock(rawCmd, [
          { type: "heading", text: `Signature projects (${SIGNATURE_PROJECTS.length} total · showing top 10)` },
          { type: "output", text: formatted },
          {
            type: "link",
            label: "Browse all projects page",
            to: "/projects",
          },
        ]);
        return;
      }

      if (cmd === "project" || cmd === "inspect") {
        if (!argStr) {
          appendBlock(rawCmd, [{ type: "error", text: "Usage: project <name> (e.g. project whatsapp)" }]);
          return;
        }
        const q = argStr.toLowerCase();
        const found = SIGNATURE_PROJECTS.find(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.slug.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q),
        );
        if (!found) {
          appendBlock(rawCmd, [{ type: "error", text: `No project matched "${argStr}". Try 'projects'.` }]);
          return;
        }
        appendBlock(rawCmd, [
          { type: "heading", text: `${found.title} — ${found.category}` },
          {
            type: "output",
            text: `${found.description}\n\nProblem : ${found.problemStatement || "-"}\nSolution: ${found.solutionSummary || "-"}\nStack   : ${(found.tags || []).join(", ")}\nRepo    : ${found.githubUrl || "-"}\nDemo    : ${found.liveDemoUrl || "-"}`,
          },
          {
            type: "link",
            label: `Open ${found.title} details page`,
            to: `/projects/${found.slug}`,
          },
        ]);
        return;
      }

      if (cmd === "blogs") {
        appendBlock(rawCmd, [
          { type: "heading", text: `Published writing (${BLOG_POSTS.length} articles)` },
          {
            type: "output",
            text: BLOG_POSTS.map(
              (b, i) => `${String(i + 1).padStart(2, "0")}. ${b.title} (${b.category || "Article"} · ${b.readTime})`,
            ).join("\n"),
          },
          { type: "link", label: "Open Blogs page", to: "/blog" },
        ]);
        return;
      }

      if (cmd === "journey") {
        const list = liveData.journey
          .slice()
          .reverse()
          .slice(0, 8)
          .map((j) => `${j.year} · ${j.title} — ${j.organization}`);
        appendBlock(rawCmd, [
          { type: "heading", text: `Recent milestones (${liveData.journey.length} recorded)` },
          { type: "output", text: list.join("\n") },
          { type: "link", label: "Open Journey timeline", to: "/journey" },
        ]);
        return;
      }

      if (cmd === "tools") {
        appendBlock(rawCmd, [
          { type: "heading", text: "Interactive tools & labs" },
          {
            type: "output",
            text: [
              "• Security Labs        /experiments/security-labs",
              "• Cyber Utilities      /experiments/cyber-tools",
              "• DSA Visualizer Lab   /experiments/dsa-lab",
              "• System Design Docs   /experiments/system-design",
            ].join("\n"),
          },
        ]);
        return;
      }

      if (cmd === "stats") {
        appendBlock(rawCmd, [
          { type: "heading", text: "Key metrics" },
          {
            type: "output",
            text: liveData.metrics
              .map((m) => `• ${m.label.padEnd(20, " ")}: ${m.value} (${m.detail})`)
              .join("\n"),
          },
        ]);
        return;
      }

      if (cmd === "contact" || cmd === "socials") {
        appendBlock(rawCmd, [
          { type: "heading", text: "Contact & profiles" },
          {
            type: "output",
            text: [
              `Email    : ${liveData.email}`,
              `Phone    : ${liveData.phone}`,
              `GitHub   : ${liveData.github}`,
              `LinkedIn : ${liveData.linkedin}`,
              `WhatsApp : ${liveData.whatsapp}`,
            ].join("\n"),
          },
          { type: "link", label: "Open Contact page", to: "/contact" },
        ]);
        return;
      }

      if (cmd === "whoami") {
        appendBlock(rawCmd, [
          {
            type: "output",
            text: `nikhil@dev-terminal\nRole     : ${liveData.roleTitle}\nLocation : ${liveData.location}\nShell    : portfolio-sh 2.7.0`,
          },
        ]);
        return;
      }

      if (cmd === "neofetch") {
        appendBlock(rawCmd, [
          { type: "heading", text: `${liveData.fullName} · System Summary` },
          {
            type: "output",
            text: [
              `OS       : Portfolio OS v2.7 (${isDark ? "Ink Dark" : "Light"})`,
              `Role     : ${liveData.roleTitle}`,
              `Stack    : React · Node.js · Express · MongoDB · Tailwind CSS`,
              `Security : OWASP Top 10 · JWT · Rate Limiting · Input Sanitization`,
              `Projects : ${SIGNATURE_PROJECTS.length} shipped`,
              `Milestones: ${liveData.journey.length} recorded`,
            ].join("\n"),
          },
        ]);
        return;
      }

      if (cmd === "search") {
        if (!argStr) {
          appendBlock(rawCmd, [{ type: "error", text: "Usage: search <keyword> (e.g. search react)" }]);
          return;
        }
        const q = argStr.toLowerCase();
        const projMatches = SIGNATURE_PROJECTS.filter((p) =>
          `${p.title} ${p.category} ${(p.tags || []).join(" ")} ${p.description}`.toLowerCase().includes(q),
        ).map((p) => `[Project] ${p.title} — ${p.category}`);
        const blogMatches = BLOG_POSTS.filter((b) =>
          `${b.title} ${(b.tags || []).join(" ")}`.toLowerCase().includes(q),
        ).map((b) => `[Article] ${b.title}`);
        const journeyMatches = liveData.journey
          .filter((j) => `${j.title} ${j.organization}`.toLowerCase().includes(q))
          .map((j) => `[Journey] ${j.title} (${j.year})`);

        const combined = [...projMatches, ...blogMatches, ...journeyMatches];
        appendBlock(rawCmd, [
          combined.length > 0
            ? {
                type: "output",
                text: `Found ${combined.length} matches for "${argStr}":\n${combined.slice(0, 12).join("\n")}`,
              }
            : { type: "error", text: `No matches found for "${argStr}".` },
        ]);
        return;
      }

      if (cmd === "open") {
        const target = argStr.toLowerCase();
        if (!target) {
          appendBlock(rawCmd, [
            { type: "error", text: `Usage: open <${Object.keys(OPEN_ROUTES).join(" | ")} | github | linkedin | resume>` },
          ]);
          return;
        }
        if (target === "github") {
          window.open(liveData.github, "_blank", "noopener,noreferrer");
          appendBlock(rawCmd, [{ type: "accent", text: `Opened ${liveData.github}` }]);
          return;
        }
        if (target === "linkedin") {
          window.open(liveData.linkedin, "_blank", "noopener,noreferrer");
          appendBlock(rawCmd, [{ type: "accent", text: `Opened ${liveData.linkedin}` }]);
          return;
        }
        if (target === "resume") {
          window.open(liveData.resumeUrl, "_blank", "noopener,noreferrer");
          appendBlock(rawCmd, [{ type: "accent", text: `Opened resume PDF` }]);
          return;
        }
        const route = OPEN_ROUTES[target];
        if (route) {
          appendBlock(rawCmd, [{ type: "accent", text: `Navigating to ${route}...` }]);
          window.setTimeout(() => navigate(route), 250);
          return;
        }
        appendBlock(rawCmd, [{ type: "error", text: `Unknown destination "${target}".` }]);
        return;
      }

      if (cmd === "theme") {
        if (!argStr) {
          toggleTheme();
          appendBlock(rawCmd, [
            { type: "accent", text: `Theme switched to ${isDark ? "Light" : "Ink Dark"} mode.` },
          ]);
          return;
        }
        const desired = argStr.toLowerCase();
        if ((desired === "dark" && !isDark) || (desired === "light" && isDark)) {
          toggleTheme();
        }
        appendBlock(rawCmd, [{ type: "accent", text: `Active theme: ${desired} mode.` }]);
        return;
      }

      if (cmd === "history") {
        appendBlock(rawCmd, [
          {
            type: "output",
            text:
              history.length > 0
                ? history.map((h, i) => `${String(i + 1).padStart(2, "0")}  ${h}`).join("\n")
                : "No commands in session history yet.",
          },
        ]);
        return;
      }

      if (cmd === "date") {
        appendBlock(rawCmd, [{ type: "output", text: new Date().toString() }]);
        return;
      }

      if (cmd === "echo") {
        appendBlock(rawCmd, [{ type: "output", text: argStr }]);
        return;
      }

      if (cmd === "sudo") {
        appendBlock(rawCmd, [
          {
            type: "error",
            text: "Permission denied: Administrative elevation is restricted to authenticated admin routes.",
          },
        ]);
        return;
      }

      appendBlock(rawCmd, [
        {
          type: "error",
          text: `Command not found: ${cmd}. Type 'help' to see available commands.`,
        },
      ]);
    },
    [appendBlock, history, isDark, liveData, navigate, toggleTheme],
  );

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setLines([]);
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const raw = inputVal.trimStart().toLowerCase();
      if (!raw) {
        appendBlock("[tab]", [
          { type: "output", text: `Commands:\n  ${ALL_COMMANDS.join("  ")}` },
        ]);
        return;
      }

      if (raw.includes(" ")) {
        const [base, partial = ""] = raw.split(/\s+/);
        if (base === "open") {
          const targets = [...Object.keys(OPEN_ROUTES), "github", "linkedin", "resume"];
          const matches = targets.filter((t) => t.startsWith(partial));
          if (matches.length === 1) setInputVal(`open ${matches[0]}`);
        } else if (base === "cat") {
          const matches = VIRTUAL_FILES.filter((f) => f.startsWith(partial));
          if (matches.length === 1) setInputVal(`cat ${matches[0]}`);
        }
        return;
      }

      const matches = ALL_COMMANDS.filter((c) => c.startsWith(raw));
      if (matches.length === 1) {
        setInputVal(matches[0]);
      } else if (matches.length > 1) {
        appendBlock(inputVal, [
          { type: "output", text: `Matches:\n  ${matches.join("  ")}` },
        ]);
      }
    } else if (e.key === "Enter") {
      executeCmd(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx < history.length - 1 ? historyIdx + 1 : historyIdx;
      setHistoryIdx(nextIdx);
      setInputVal(history[history.length - 1 - nextIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || "");
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal("");
      }
    }
  };

  const handleCopyLogs = (e) => {
    e.stopPropagation();
    const logText = lines
      .map((l) => (l.type === "banner" ? `${l.title}\n${l.subtitle}` : l.text || l.label || ""))
      .join("\n");
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(logText).catch(() => undefined);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <SeoHead
        title="Dev Terminal | Interactive CLI | Nikhil Agrahari"
        description="Interactive developer terminal and security CLI for exploring Nikhil Agrahari's projects, stack, writing, and milestones."
        pathname="/experiments/terminal"
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Experiments", path: "/experiments" },
          { name: "Dev Terminal", path: "/experiments/terminal" },
        ])}
      />

      <section className="section-wrap flex flex-col items-center pt-6 pb-20 sm:pt-8">
        <FadeInUp>
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-[#eef0f5]">
              Dev <span className="text-emerald-600 dark:text-emerald-400">Terminal</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-[#a3a9b8]">
              Interactive CLI shell to inspect projects, stack, milestones, and jump directly to pages or external links.
            </p>
          </div>
        </FadeInUp>

        <div className="w-full max-w-5xl">
          <div
            data-lenis-prevent
            className="flex h-[520px] flex-col overflow-hidden rounded-2xl border border-black/[0.12] bg-[#0c0e14] text-[#eef0f5] shadow-xl sm:h-[600px] dark:border-white/[0.1]"
            onClick={() => {
              const selectedText = window.getSelection?.()?.toString();
              if (!selectedText) {
                inputRef.current?.focus();
              }
            }}
          >
            {/* Top Window Bar */}
            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/[0.08] bg-[#11141c] px-4 py-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-2.5">
                <Terminal size={15} strokeWidth={1.6} className="shrink-0 text-emerald-400" />
                <span className="truncate font-mono text-xs font-medium text-[#d1d5df]">
                  nikhil@portfolio:~
                </span>
                <span className="hidden sm:inline rounded border border-white/[0.08] bg-[#0c0e14] px-1.5 py-0.5 font-mono text-[10px] text-[#7a8296]">
                  zsh · live-synced
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLogs}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.1] bg-[#0c0e14] px-2.5 font-mono text-xs text-[#d1d5df] transition-colors hover:border-white/[0.2] hover:text-white"
                >
                  {copied ? (
                    <Check size={13} className="text-emerald-400" />
                  ) : (
                    <Copy size={13} strokeWidth={1.6} />
                  )}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLines(INITIAL_LINES);
                    setInputVal("");
                  }}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.1] bg-[#0c0e14] px-2.5 font-mono text-xs text-[#d1d5df] transition-colors hover:border-white/[0.2] hover:text-white"
                >
                  <RotateCcw size={13} strokeWidth={1.6} />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Quick Commands Strip */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex shrink-0 items-center gap-1.5 overflow-x-auto border-b border-white/[0.06] bg-[#090a0f] px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-5"
            >
              <span className="mr-1 shrink-0 font-mono text-[11px] text-[#7a8296]">
                Run:
              </span>
              {QUICK_COMMANDS.map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => executeCmd(cmd)}
                  className="shrink-0 rounded-md border border-white/[0.08] bg-[#11141c] px-2.5 py-1 font-mono text-[11px] text-[#d1d5df] transition-colors hover:border-emerald-500/35 hover:text-emerald-300"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Scrollable Output Console */}
            <div
              ref={terminalBodyRef}
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              className="flex-1 space-y-2.5 overflow-y-auto overscroll-contain p-4 font-mono text-xs leading-relaxed text-[#d1d5df] selection:bg-emerald-500 selection:text-slate-950 sm:p-6 sm:text-sm"
            >
              {lines.map((line, idx) => {
                if (line.type === "banner") {
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-white/[0.08] bg-[#11141c] px-4 py-3"
                    >
                      <p className="font-semibold text-emerald-400">{line.title}</p>
                      <p className="mt-0.5 text-xs text-[#a3a9b8]">{line.subtitle}</p>
                    </div>
                  );
                }
                if (line.type === "user") {
                  return (
                    <p key={idx} className="pt-1 font-medium text-[#eef0f5]">
                      <span className="text-emerald-400">~ $</span> {line.text}
                    </p>
                  );
                }
                if (line.type === "heading") {
                  return (
                    <p key={idx} className="font-semibold text-emerald-400">
                      {line.text}
                    </p>
                  );
                }
                if (line.type === "accent") {
                  return (
                    <p key={idx} className="text-emerald-300">
                      {line.text}
                    </p>
                  );
                }
                if (line.type === "error") {
                  return (
                    <p key={idx} className="text-rose-400">
                      {line.text}
                    </p>
                  );
                }
                if (line.type === "link" && line.to) {
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(line.to);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
                    >
                      <span>{line.label}</span>
                      <ExternalLink size={12} />
                    </button>
                  );
                }
                return (
                  <p key={idx} className="whitespace-pre-wrap text-[#cbd5e1]">
                    {line.text}
                  </p>
                );
              })}

              {/* Prompt Input with Ghost Autocomplete */}
              <div className="flex items-center gap-2 pt-2">
                <span className="shrink-0 font-semibold text-emerald-400">~ $</span>
                <div className="relative min-w-0 flex-1">
                  {ghostSuggestion && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 flex items-center whitespace-pre font-mono text-xs sm:text-sm text-[#586074]"
                    >
                      <span className="invisible">{inputVal}</span>
                      <span>{ghostSuggestion}</span>
                    </div>
                  )}
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    aria-label="Terminal command input"
                    placeholder="Type a command (help, project whatsapp, search react, open projects)..."
                    className="relative z-10 w-full bg-transparent font-mono text-xs font-medium text-[#eef0f5] outline-none placeholder:text-[#586074] sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TerminalPage;
