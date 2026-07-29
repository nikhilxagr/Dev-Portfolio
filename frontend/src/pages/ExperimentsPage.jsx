import { useTheme } from "@/context/ThemeContext";
import { Link } from "react-router-dom";
import SeoHead from "@/components/seo/SeoHead";
import SectionTitle from "@/components/ui/SectionTitle";
import { FadeInUp, ScaleIn } from "@/components/animations";
import {
  ShieldCheck,
  Terminal,
  Cpu,
  Wrench,
  FileCheck2,
  ArrowRight,
  Sparkles,
  FlaskConical,
} from "lucide-react";

const EXPERIMENT_MODULES = [
  {
    id: "security-labs",
    title: "Security Labs & Writeups",
    to: "/experiments/security-labs",
    icon: ShieldCheck,
    badge: "Cyber Security",
    description:
      "Documented lab exercises in vulnerability research, network reconnaissance, OWASP testing, Kali Linux hardening, and CTF writeups.",
    highlights: [
      "Kali Linux Environment Hardening",
      "Nmap Network Reconnaissance Lab",
      "Burp Suite OWASP Testing",
      "Metasploit & Exploit Analysis",
    ],
    status: "Active Lab",
  },
  {
    id: "dev-terminal",
    title: "Dev Terminal Sandbox",
    to: "/experiments/terminal",
    icon: Terminal,
    badge: "Interactive CLI",
    description:
      "Interactive in-browser UNIX terminal sandbox. Execute system commands, inspect developer stats, explore secret easter eggs, and run custom scripts.",
    highlights: [
      "UNIX Command Emulation",
      "Custom Shell Scripting & Aliases",
      "Interactive Developer Dossier",
      "Keyboard Shortcuts & Themes",
    ],
    status: "Interactive",
  },
  {
    id: "dsa-lab",
    title: "Data Structure & Algorithm Lab",
    to: "/experiments/dsa",
    icon: Cpu,
    badge: "Computer Science",
    description:
      "Visual algorithms laboratory demonstrating sorting mechanisms, tree traversals, pathfinding algorithms, and dynamic space-time complexity analysis.",
    highlights: [
      "Sorting Visualizer (Quick, Merge, Heap)",
      "Graph Pathfinding (Dijkstra, A*)",
      "Binary Search Tree Operations",
      "Big-O Space & Time Calculator",
    ],
    status: "Live Simulation",
  },
  {
    id: "cyber-tools",
    title: "Cyber Security Utilities & Tools",
    to: "/experiments/tools",
    icon: Wrench,
    badge: "Security Tooling",
    description:
      "Suite of client-side developer security tools including breach checking, payload encoders, cryptographic hash generators, and header analyzers.",
    highlights: [
      "Breach & Exposure Inspector",
      "Crypto Hash Generator (SHA256, MD5)",
      "Base64 / URL Encoder & Decoder",
      "HTTP Security Headers Checker",
    ],
    status: "Utility Suite",
  },
  {
    id: "methodology",
    title: "Security & Testing Methodology",
    to: "/experiments/methodology",
    icon: FileCheck2,
    badge: "Standards & Ethics",
    description:
      "Formal engineering methodology governing security research, local sandboxing ethics, responsible disclosure standards, and application defense.",
    highlights: [
      "Responsible Disclosure Framework",
      "Sandboxed Lab Isolation Standard",
      "OWASP Top 10 Audit Checklist",
      "Zero-Trust Architecture Guidelines",
    ],
    status: "Documentation",
  },
];

const ExperimentsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <SeoHead
        title="Experiments & Security Labs Hub | Nikhil Agrahari"
        description="Explore interactive developer security labs, UNIX terminal sandbox, data structures visualizer, cybersecurity tooling, and testing methodology by Full Stack & Security Engineer Nikhil Agrahari."
        keywords={[
          "nikhil agrahari experiments",
          "cyber security labs",
          "dev terminal sandbox",
          "dsa visualizer",
          "cybersecurity tools lucknow",
          "full stack security engineer",
        ]}
      />

      <div className="section-wrap pt-6 pb-20 sm:pt-10 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <SectionTitle
            eyebrow="Interactive Sandbox & Security Research"
            title="Engineering Experiments & Labs"
            description="A showcase of hands-on security research, interactive browser terminals, computer science algorithm visualizers, and developer utilities built by Nikhil Agrahari."
            mobileCenter={true}
          />

          {/* Quick Stats / Overview Pills */}
          <FadeInUp delay={0.15} className="mt-8 mb-12">
            <div
              className={`flex flex-wrap items-center justify-center gap-3 p-4 rounded-2xl border backdrop-blur-xl ${
                isDark
                  ? "bg-slate-950/60 border-cyan-500/20 text-slate-300"
                  : "bg-white/80 border-slate-200 text-slate-700 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
                <FlaskConical className="h-4 w-4 text-emerald-400" />
                <span>5 Specialized Labs</span>
              </div>
              <span className="text-slate-600 dark:text-slate-400">•</span>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>100% Interactive & Client-Side</span>
              </div>
              <span className="text-slate-600 dark:text-slate-400">•</span>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
                <ShieldCheck className="h-4 w-4 text-purple-400" />
                <span>Ethical & Defensive Scope</span>
              </div>
            </div>
          </FadeInUp>

          {/* Grid of Experiment Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXPERIMENT_MODULES.map((exp, index) => {
              const Icon = exp.icon;
              return (
                <ScaleIn key={exp.id} delay={index * 0.08}>
                  <Link
                    to={exp.to}
                    className={`group relative flex flex-col justify-between h-full rounded-3xl border p-6 sm:p-7 transition-all duration-300 ${
                      isDark
                        ? "bg-slate-950/70 border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900/90 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)]"
                        : "bg-white border-slate-200/90 hover:border-emerald-500/50 hover:bg-emerald-50/30 shadow-sm hover:shadow-xl"
                    }`}
                  >
                    {/* Top Glow Accent */}
                    <div className="pointer-events-none absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div>
                      {/* Icon & Badge */}
                      <div className="flex items-center justify-between gap-3 mb-5">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-110 ${
                            isDark
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black group-hover:border-emerald-400"
                              : "border-emerald-600/30 bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white"
                          }`}
                        >
                          <Icon size={24} />
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider border ${
                            isDark
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                              : "border-emerald-600/30 bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {exp.badge}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-200">
                        {exp.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {exp.description}
                      </p>

                      {/* Highlights */}
                      <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
                        <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-2">
                          // Key Components
                        </p>
                        <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                          {exp.highlights.map((h, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                              <span className="truncate">{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-6 pt-4 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800/60">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {exp.status}
                      </span>
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform duration-200">
                        <span>Launch Lab</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                </ScaleIn>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExperimentsPage;
