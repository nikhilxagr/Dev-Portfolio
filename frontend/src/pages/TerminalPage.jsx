import { useState, useRef, useEffect } from "react";
import { Terminal, RotateCcw, ShieldCheck, Sparkles, Code2, Globe, Command, ArrowRight, Copy, Check } from "lucide-react";
import SeoHead from "@/components/seo/SeoHead";
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
  [Frontend]   React 18, Next.js, TypeScript, JavaScript (ES6+), Tailwind CSS, Vite
  [Backend]    Node.js, Express.js, Python, RESTful APIs, Microservices
  [Security]   OWASP Top 10, Kali Linux, Burp Suite, Nmap, Wireshark, Metasploit
  [Databases]  MongoDB, PostgreSQL, Supabase, Redis
  [DevOps]     Git, GitHub, Docker, Linux Administration, Vercel`,

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

  // Always scroll window to top on mount and prevent input focus window jump
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const timer = setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll internal terminal body cleanly without scrolling window
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
      setLines([{ type: "info", text: "Terminal cleared. Type 'help' for commands." }]);
      setInputVal("");
      return;
    }

    let responseText = TERMINAL_COMMANDS[cmd];
    if (!responseText) {
      if (cmd === "date") {
        responseText = new Date().toUTCString();
      } else {
        responseText = `Command not found: "${rawCmd}". Type "help" for available commands.`;
      }
    }

    const responseLine = { type: "output", text: responseText };
    setLines((prev) => [...prev, userLine, responseLine]);
    setInputVal("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      executeCmd(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInputVal(history[nextIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= history.length) {
        setHistoryIdx(-1);
        setInputVal("");
      } else {
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx] || "");
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
        title="Dev Terminal | Interactive Cyber CLI"
        description="Standalone interactive developer terminal & security CLI environment for exploring Nikhil Agrahari's portfolio, skills, and tools."
        pathname="/experiments/terminal"
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Experiments", path: "/experiments" },
          { name: "Dev Terminal", path: "/experiments/terminal" },
        ])}
      />

      {/* Main Terminal Standalone Section */}
      <section className="section-wrap pt-6 pb-12 sm:pt-10 sm:pb-16 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          
          {/* Big Terminal Box */}
          <div
            className="overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-emerald-500/50 dark:border-emerald-500/35 bg-[#03080c] shadow-[0_24px_80px_rgba(0,20,10,0.3)] dark:shadow-[0_24px_80px_rgba(0,10,5,0.85)] flex flex-col h-[calc(100vh-9.5rem)] min-h-[480px] sm:min-h-[580px]"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-emerald-500/20 bg-[#061218]/90 px-3.5 sm:px-6 py-3 shrink-0">
              {/* Window Dots & Hostname */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80 inline-block shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80 inline-block shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                </div>
                <div className="h-3.5 w-px bg-emerald-500/20 mx-1 hidden sm:block" />
                <span className="font-mono text-[11px] sm:text-xs font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
                  <Terminal size={14} className="text-emerald-400" />
                  nikhil@dev-terminal:~
                </span>
              </div>

              {/* Status & Quick Actions */}
              <div className="flex items-center gap-2 sm:gap-4 text-xs">
                <button
                  type="button"
                  onClick={handleCopyLogs}
                  className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-400/80 hover:text-emerald-300 transition-colors bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20"
                  title="Copy terminal logs to clipboard"
                >
                  {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy Logs"}
                </button>
                <button
                  type="button"
                  onClick={() => executeCmd("clear")}
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-400/80 hover:text-emerald-300 transition-colors bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20"
                >
                  <RotateCcw size={12} /> Clear
                </button>
                <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/30">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  ONLINE
                </span>
              </div>
            </div>

            {/* Terminal Body Screen */}
            <div
              ref={terminalBodyRef}
              className="p-3.5 sm:p-6 font-mono text-[11px] sm:text-xs md:text-sm leading-relaxed text-slate-200 flex-1 overflow-y-auto space-y-2.5 selection:bg-emerald-500 selection:text-black"
            >
              {lines.map((line, idx) => (
                <div key={idx}>
                  {line.type === "user" ? (
                    <p className="font-bold text-emerald-400 flex items-center gap-1">
                      <span>{line.text}</span>
                    </p>
                  ) : line.type === "info" ? (
                    <p className="text-emerald-400/80">{line.text}</p>
                  ) : (
                    <pre className="whitespace-pre-wrap text-slate-300 font-mono text-[11px] sm:text-xs md:text-sm leading-relaxed pt-0.5">
                      {line.text}
                    </pre>
                  )}
                </div>
              ))}

              {/* Input Command Prompt Line */}
              <div className="flex items-center gap-2 pt-2">
                <span className="text-emerald-400 font-bold select-none">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  inputMode="text"
                  className="flex-1 bg-transparent text-emerald-300 outline-none border-none focus:ring-0 font-mono text-[11px] sm:text-xs md:text-sm"
                  placeholder="type 'help'..."
                  spellCheck="false"
                />
              </div>
            </div>

            {/* Mobile Touch Shortcut Pills Bar */}
            <div className="border-t border-emerald-500/20 bg-[#061218]/90 p-3 flex flex-wrap gap-2 items-center justify-between shrink-0">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest hidden sm:inline">
                Shortcuts:
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto justify-start sm:justify-end">
                {["help", "bio", "skills", "projects", "tools", "contact", "whoami", "clear"].map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      executeCmd(cmd);
                    }}
                    className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] text-emerald-300 hover:bg-emerald-500/25 active:scale-95 transition"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default TerminalPage;
