import { useState, useRef, useEffect } from "react";
import { Terminal, RotateCcw, ShieldCheck, Sparkles, Code2, Globe, Command, ArrowRight, Copy, Check } from "lucide-react";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import { createBreadcrumbSchema } from "@/utils/seo";

const TERMINAL_COMMANDS = {
  help: `Available commands:
  • help       - List all available commands & shortcuts
  • bio        - Developer profile, identity & mindset
  • skills     - Technical capabilities, stack & architecture
  • projects   - Featured full-stack & security projects
  • tools      - Real interactive cyber security diagnostics
  • contact    - Direct contact channels & email
  • whoami     - Display user identity & privileges
  • clear      - Clear terminal screen console
  • date       - Show current UTC system timestamp
  • socials    - View active social & professional profiles
  • sudo       - Request root privilege elevation`,
  
  bio: `Nikhil Agrahari // Full Stack Developer + Cybersecurity Engineer
Location: Lucknow, India
Mindset: Building scalable, high-performance web products with security integrated into every architecture layer.
Status: Open for Software Engineering, Full Stack & Application Security Roles.`,

  skills: `Technical Stack & Capabilities:
  [Frontend]   React 18, Next.js, JavaScript (ES6+), Tailwind CSS, Vite
  [Backend]    Node.js, Express.js, Python, RESTful APIs, Microservices
  [Security]   OWASP Top 10, Kali Linux, Burp Suite, Nmap, Wireshark, Metasploit
  [Databases]  MongoDB, Supabase, SQL
  [DevOps]     Git, GitHub, Linux Administration, Vercel, Render, Antigravity`,

  projects: `Featured Projects:
  1. Secure Auth System (JWT + Rate Limiting + Helmet)
  2. DevPortfolio v2 (React + Vite + Framer Motion)
  3. Security Engineering Practicals & Lab Writeups
  Visit /projects for live interactive demos.`,

  tools: `Interactive Security Tools available at /experiments/tools:
  • Have I Been Pwned Email Breach Inspector
  • Password Shannon Entropy & Strength Meter
  • Domain Security Header Inspector`,

  contact: `Contact Channels:
  Email: nikhilagrahari530@gmail.com
  LinkedIn: linkedin.com/in/nikhilxagr
  GitHub: github.com/nikhilxagr
  TryHackMe: tryhackme.com/p/nikhilxagr`,

  whoami: `guest@nikhil-terminal ~ privileged_visitor (Level 1 ACCESS)`,

  sudo: `[SECURITY NOTICE] Access denied: Root privileges required (Level 0 - Administrator). Incident logged to security audit trail.`,

  socials: `GitHub: github.com/nikhilxagr | LinkedIn: linkedin.com/in/nikhilxagr | Instagram: @nikhilxagr`,
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
    if (e.key === "Enter") {
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
            className="overflow-hidden rounded-3xl border-2 border-emerald-500/40 dark:border-emerald-500/35 bg-[#03080c] shadow-[0_24px_80px_rgba(0,20,10,0.3)] dark:shadow-[0_24px_80px_rgba(0,10,5,0.85)] flex flex-col h-[520px] sm:h-[620px]"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Terminal header */}
            <div className="flex items-center justify-between border-b border-emerald-500/20 bg-[#061218]/90 px-4 sm:px-6 py-3.5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80 inline-block shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80 inline-block shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                </div>
                <div className="h-3.5 w-px bg-emerald-500/20 mx-1 hidden sm:block" />
                <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
                  <Terminal size={14} className="text-emerald-400" />
                  nikhil@dev-terminal:~
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={handleCopyLogs}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition"
                >
                  {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                  {copied ? "Copied" : "Copy Logs"}
                </button>
                <button
                  type="button"
                  onClick={() => executeCmd("clear")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition"
                >
                  <RotateCcw size={13} /> Clear
                </button>
              </div>
            </div>

            {/* Quick command buttons */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-emerald-500/10 bg-[#040e14] px-4 py-2 text-xs">
              <span className="font-mono text-[10px] font-bold uppercase text-slate-500 tracking-wider mr-1">Quick Run:</span>
              {["help", "bio", "skills", "projects", "tools", "contact", "whoami"].map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => executeCmd(cmd)}
                  className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-300 hover:border-emerald-400 hover:bg-emerald-500/20 transition"
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
                  return <p key={idx} className="text-rose-400">{line.text}</p>;
                }
                if (line.type === "info") {
                  return <p key={idx} className="text-emerald-400/80">{line.text}</p>;
                }
                return <p key={idx} className="text-emerald-300/90 whitespace-pre-wrap">{line.text}</p>;
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
                  className="flex-1 bg-transparent font-mono text-xs sm:text-sm font-bold text-white outline-none placeholder:text-emerald-700"
                  placeholder="Type a command (e.g. 'help', 'bio', 'skills')..."
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
