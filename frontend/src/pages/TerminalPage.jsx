import { useState, useRef, useEffect } from "react";
import { Terminal, RotateCcw, ShieldCheck, Sparkles, Code2, Globe, Command, ArrowRight, Copy, Check } from "lucide-react";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import { createBreadcrumbSchema } from "@/utils/seo";

const TERMINAL_COMMANDS = {
  help: `Available CLI Commands:
  • help       - List all available commands & shortcuts
  • about      - Complete developer bio, education & story
  • bio        - Developer profile, education & background
  • skills     - Full stack engineering & security tech stack
  • projects   - Real signature projects & live apps
  • tools      - Interactive cyber security utilities & labs
  • journey    - Hackathons, education & milestones
  • stats      - Problem solving & certification metrics
  • contact    - Direct contact channels & email
  • whoami     - Display user identity & privileges
  • date       - Show current UTC system timestamp
  • socials    - View active social & professional profiles
  • sudo       - Request root privilege elevation
  • clear      - Clear terminal screen console`,

  about: `About Nikhil Agrahari:
  Full-Stack Web Developer & Security-First Engineer pursuing BCA at BBD University, Lucknow.
  Specialized in React.js, Node.js, Express, MongoDB, RESTful APIs, Tailwind CSS, Python, and AppSec practicals.
  Demonstrated track record of building 10+ production-grade web products with clean code architecture.

  Core Focus Areas:
  • Responsive Frontend Development (React / Next.js / Tailwind)
  • Secure Backend API Design (Node.js / Express / MongoDB)
  • Application Security & Vulnerability Auditing (OWASP Top 10 / Burp Suite)
  • Cloud Deployments & Continuous Delivery (Vercel / Render / Git)
  Visit /about for full story & background.`,

  bio: `Nikhil Agrahari // Full Stack Developer & Security-First Engineer
Education: Bachelor of Computer Applications (BCA) @ BBD University, Lucknow
Location: Lucknow, India 🇮🇳
Headline: BCA Student | Full Stack Developer | Web Solutions Builder
Summary: Passionate about creating modern, user-friendly web applications with clean architecture, reliable delivery, and defense-first security.
Status: Open for Software Engineering, Full Stack & Application Security Roles.`,

  skills: `Technical Stack & Capabilities:
  [Frontend]   React 18, Next.js, JavaScript (ES6+), TypeScript, Tailwind CSS, Vite, Framer Motion
  [Backend]    Node.js, Express.js, Python, REST APIs, Microservices, Supabase
  [Security]   OWASP Top 10, Kali Linux, Burp Suite, Nmap, Wireshark, Metasploit, TryHackMe
  [Databases]  MongoDB, PostgreSQL, Supabase, SQL
  [DevOps]     Git, GitHub, Postman, Linux Administration, Vercel, Render, VS Code
  Visit /skills for complete skills taxonomy.`,

  projects: `Featured Real Projects:
  1. InTube (Stateless 4K Media Downloader & Streaming Utility)
     Tech: React, Node.js, yt-dlp, FFmpeg, Innertube | Live: intubedl.vercel.app
  2. Vistagram (Full-Stack Real-Time Social Media Platform)
     Tech: React, Node.js, Express, MongoDB, Socket.io | Live: myvistagram.vercel.app | APK: /Vistagram.apk
  2. Kanoon-Mate (Legal AI Assistant · Built during Nerds Hack Days Lucknow 2026)
     Tech: React, Node.js, Express, MongoDB | Repo: github.com/nikhilxagr/Kanoon-Mate--HackethonProjects-
  3. Fast Feast (Modern Food Delivery Web Application)
     Tech: HTML, CSS, JavaScript | Live: fastfeast-agr.netlify.app
  4. snapURL (MERN-Based Full-Stack URL Shortener Platform)
     Tech: React, Express, Node.js, MongoDB | Live: snapurl-url-shortner.vercel.app
  5. AI Powered Code Reviewer (MERN-Based AI Code Audit Platform)
     Tech: React, Express, Node.js, MongoDB | Repo: github.com/nikhilxagr/AI-Powered-Code-Reviewer-MERN-Project
  6. Notes App (LocalStorage Task & Notes Management Utility)
     Tech: JavaScript, LocalStorage, HTML/CSS | Live: notes-app-agr.netlify.app
  7. QRCode Generator (Dynamic Custom Vector QR Code Utility)
     Tech: JavaScript, Canvas API | Live: qrcode-generator-agr.netlify.app
  8. Weather App (OpenWeather REST API Forecast Dashboard)
     Tech: JavaScript, OpenWeather API | Live: weatherappagr.netlify.app
  Visit /projects for full interactive demos & source code.`,

  tools: `Interactive Security Tools (available at /experiments/tools):
  • Have I Been Pwned Email Breach Inspector
  • Password Shannon Entropy & Strength Meter
  • Domain Security Header Inspector
  • Security Engineering Labs & Writeups (/experiments/security-labs)
  • Data Structure & Algorithm Visualizer (/experiments/dsa)`,

  journey: `Key Milestones & Education:
  • 2024 - 2027 : BCA Degree @ BBD University, Lucknow
  • 2026        : Nerds Hack Days Hackathon (Built Kanoon-Mate)
  • 2026        : Android Nova 2.0 Workshop @ Cyber Intelligence Community
  • Certs       : Cisco Certified Ethical Hacker (2025)
  • Certs       : MongoDB Associate Developer (2025)
  • Certs       : Postman API Student Expert (2025)
  Visit /journey for full interactive timeline.`,

  stats: `Key Performance & Problem-Solving Metrics:
  • LeetCode Solved : 130+ Solved (Algorithms & Data Structures)
  • Web Products    : 10+ Production-Grade Web Applications
  • Certifications  : 3 Industry Certs (Cisco, MongoDB, Postman)
  • Degree          : BCA (BBD University, Lucknow)`,

  contact: `Direct Contact Channels:
  Email: nikhilagrahari530@gmail.com
  Phone: +91 7897872883 (WhatsApp: wa.me/7897872883)
  LinkedIn: linkedin.com/in/nikhilxagr/
  GitHub: github.com/nikhilxagr
  LeetCode: leetcode.com/u/nikhilxagr/
  TryHackMe: tryhackme.com/p/nikhilxagr`,

  whoami: `Nikhil Agrahari (@nikhilxagr)
  Full-Stack Web Developer & Security-First Engineer
  Education : BCA (Bachelor of Computer Applications) @ BBD University, Lucknow
  Location  : Lucknow, Uttar Pradesh, India 🇮🇳
  Status    : Open for Software Engineering, Full Stack & Application Security Roles
  Access    : Authenticated Developer Session [UID: 1001]`,

  sudo: `[SECURITY NOTICE] Access denied: Root privileges required for kernel modification. Incident logged to security audit trail.`,

  socials: `Social & Professional Links:
  • GitHub: https://github.com/nikhilxagr
  • LinkedIn: https://www.linkedin.com/in/nikhilxagr/
  • LeetCode: https://leetcode.com/u/nikhilxagr/
  • TryHackMe: https://tryhackme.com/p/nikhilxagr
  • Medium: https://medium.com/@nikhilxagr
  • Instagram: https://www.instagram.com/nikhilxagr/`,
};

const INITIAL_LINES = [
  { type: "info", text: "┌─────────────────────────────────────────────────────────────┐" },
  { type: "info", text: "│ NIKHIL AGRAHARI // DEV TERMINAL & SECURITY CLI (v2.6.0)     │" },
  { type: "info", text: "│ Type 'help' to display available commands & shortcuts.       │" },
  { type: "info", text: "└─────────────────────────────────────────────────────────────┘" },
];

const TerminalPage = () => {
  const [lines, setLines] = useState(INITIAL_LINES);
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [copied, setCopied] = useState(false);

  const terminalBodyRef = useRef(null);
  const inputRef = useRef(null);

  const handleWheel = (e) => {
    const el = terminalBodyRef.current;
    if (!el) return;

    const isScrollable = el.scrollHeight > el.clientHeight;
    if (!isScrollable) return;

    const isAtTop = el.scrollTop <= 0 && e.deltaY < 0;
    const isAtBottom =
      Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) <= 4 && e.deltaY > 0;

    if (!isAtTop && !isAtBottom) {
      e.stopPropagation();
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const timer = setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [lines]);

  const executeCmd = (cmdString) => {
    const rawCmd = cmdString.trim();
    const cmd = rawCmd.toLowerCase();

    if (!rawCmd) return;

    setHistory((prev) => [...prev, rawCmd]);
    setHistoryIdx(-1);

    const userLine = { type: "user", text: `$ ${rawCmd}` };

    if (cmd === "clear") {
      setLines([]);
      setInputVal("");
      return;
    }

    if (cmd === "date") {
      const timeLine = { type: "output", text: `UTC System Timestamp: ${new Date().toUTCString()}` };
      setLines((prev) => [...prev, userLine, timeLine]);
      setInputVal("");
      return;
    }

    const outputText = TERMINAL_COMMANDS[cmd];

    if (outputText) {
      const outputLines = outputText.split("\n").map((txt) => ({ type: "output", text: txt }));
      setLines((prev) => [...prev, userLine, ...outputLines]);
    } else {
      const errLine = {
        type: "error",
        text: `zsh: command not found: ${rawCmd}. Type 'help' to see valid CLI commands.`,
      };
      setLines((prev) => [...prev, userLine, errLine]);
    }

    setInputVal("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const current = inputVal.trim().toLowerCase();
      const availableCmds = Array.from(
        new Set([...Object.keys(TERMINAL_COMMANDS), "clear", "date"])
      );

      if (!current) {
        const userLine = { type: "user", text: "$ [Tab]" };
        const infoLine = {
          type: "output",
          text: `Available commands:\n  ${availableCmds.join("   ")}`,
        };
        setLines((prev) => [...prev, userLine, infoLine]);
        return;
      }

      const matches = availableCmds.filter((cmd) => cmd.startsWith(current));

      if (matches.length === 1) {
        setInputVal(matches[0]);
      } else if (matches.length > 1) {
        const userLine = { type: "user", text: `$ ${inputVal}` };
        const matchLine = {
          type: "output",
          text: `Matching commands:\n  ${matches.join("   ")}`,
        };
        setLines((prev) => [...prev, userLine, matchLine]);

        // Find longest common prefix among matches
        let commonPrefix = current;
        let charIdx = current.length;
        while (true) {
          const char = matches[0][charIdx];
          if (!char || !matches.every((m) => m[charIdx] === char)) break;
          commonPrefix += char;
          charIdx++;
        }
        if (commonPrefix.length > current.length) {
          setInputVal(commonPrefix);
        }
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

  const handleCopyLogs = () => {
    const logText = lines.map((l) => l.text).join("\n");
    navigator.clipboard.writeText(logText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SeoHead
        title="Dev Terminal | Interactive Cyber CLI | Nikhil Agrahari"
        description="Standalone interactive developer terminal & security CLI environment for exploring Nikhil Agrahari's portfolio, skills, and tools."
        pathname="/experiments/terminal"
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Experiments", path: "/experiments" },
          { name: "Dev Terminal", path: "/experiments/terminal" },
        ])}
      />

      {/* Terminal Page Layout */}
      <section className="section-wrap pt-4 sm:pt-6 pb-16 flex flex-col items-center">
        
        {/* Hero header */}
        <FadeInUp>
          <div className="text-center max-w-4xl mx-auto mb-8">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-wider text-slate-900 dark:text-white drop-shadow-sm">
              DEV <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">TERMINAL</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Interactive developer CLI and security sandbox environment. Type 'help' to explore available commands and system specs.
            </p>
          </div>
        </FadeInUp>

        <div className="w-full max-w-5xl">
          {/* Terminal container */}
          <div
            className="overflow-hidden rounded-3xl border-2 border-slate-300/80 dark:border-emerald-500/35 bg-[#03080c] shadow-[0_20px_60px_rgba(0,0,0,0.18)] dark:shadow-[0_24px_80px_rgba(0,10,5,0.85)] flex flex-col h-[520px] sm:h-[620px]"
            onClick={() => inputRef.current?.focus()}
            onWheel={handleWheel}
          >
            {/* Terminal header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 dark:border-emerald-500/20 bg-[#07131b] dark:bg-[#061218]/90 px-4 sm:px-6 py-3.5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/90 inline-block shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/90 inline-block shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                  <span className="h-3 w-3 rounded-full bg-green-500/90 inline-block shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                </div>
                <div className="h-3.5 w-px bg-emerald-500/30 mx-1 hidden sm:block" />
                <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
                  <Terminal size={14} className="text-emerald-400" />
                  nikhil@dev-terminal:~
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={handleCopyLogs}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 font-mono text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 transition"
                >
                  {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                  {copied ? "Copied" : "Copy Logs"}
                </button>
                <button
                  type="button"
                  onClick={() => executeCmd("clear")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 font-mono text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 transition"
                >
                  <RotateCcw size={13} /> Clear
                </button>
              </div>
            </div>

            {/* Quick command buttons */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800/80 dark:border-emerald-500/10 bg-[#050e15] px-4 py-2 text-xs">
              <span className="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-wider mr-1">Quick Run:</span>
              {["help", "about", "bio", "skills", "projects", "tools", "journey", "stats", "contact", "whoami"].map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => executeCmd(cmd)}
                  className="rounded-md border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-300 hover:border-emerald-400 hover:bg-emerald-500/25 transition"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Terminal Console Output Body */}
            <div
              ref={terminalBodyRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed text-emerald-400 space-y-1.5 selection:bg-emerald-500 selection:text-black"
            >
              {lines.map((line, idx) => {
                if (line.type === "user") {
                  return (
                    <p key={idx} className="font-bold text-white flex items-center gap-1">
                      <span className="text-emerald-400 font-extrabold">$</span> {line.text.slice(2)}
                    </p>
                  );
                }
                if (line.type === "error") {
                  return <p key={idx} className="text-rose-400 font-medium">{line.text}</p>;
                }
                if (line.type === "info") {
                  return <p key={idx} className="text-emerald-400/90 font-medium">{line.text}</p>;
                }
                return <p key={idx} className="text-emerald-300/95 font-medium whitespace-pre-wrap">{line.text}</p>;
              })}

              {/* Input Prompt Row */}
              <div className="flex items-center gap-2 pt-2">
                <span className="font-extrabold text-emerald-400">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent font-mono text-xs sm:text-sm font-bold text-white outline-none placeholder:text-emerald-600/80"
                  placeholder="Type a command (e.g. 'help', 'bio', 'projects') — [Tab for auto-complete]..."
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TerminalPage;
