import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SeoHead from "@/components/seo/SeoHead";
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
  },
  {
    id: "dev-terminal",
    title: "Dev Terminal Sandbox",
    to: "/experiments/terminal",
    icon: Terminal,
    badge: "Interactive CLI",
    description:
      "Interactive in-browser UNIX terminal sandbox. Execute system commands, inspect developer stats, explore secret easter eggs, and run custom scripts.",
  },
  {
    id: "dsa-lab",
    title: "Data Structure & Algorithm Lab",
    to: "/experiments/dsa",
    icon: Cpu,
    badge: "Computer Science",
    description:
      "Visual algorithms laboratory demonstrating sorting mechanisms, tree traversals, pathfinding algorithms, and dynamic space-time complexity analysis.",
  },
  {
    id: "cyber-tools",
    title: "Cyber Security Utilities & Tools",
    to: "/experiments/tools",
    icon: Wrench,
    badge: "Security Tooling",
    description:
      "Suite of client-side developer security tools including breach checking, payload encoders, cryptographic hash generators, and header analyzers.",
  },
  {
    id: "methodology",
    title: "Security & Testing Methodology",
    to: "/experiments/methodology",
    icon: FileCheck2,
    badge: "Standards & Ethics",
    description:
      "Formal engineering methodology governing security research, local sandboxing ethics, responsible disclosure standards, and application defense.",
  },
];

const ExperimentsPage = () => {
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
          
          {/* Centered Hero Header Section (Matching Journey Page style) */}
          <div className="relative mx-auto max-w-4xl text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-lime-400/40 bg-lime-400/10 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.22em] text-lime-600 dark:text-lime-300 shadow-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-400" />
                INTERACTIVE SANDBOX &amp; SECURITY RESEARCH
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="mt-3 font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-[1.05]"
            >
              ENGINEERING{" "}
              <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                EXPERIMENTS
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="mx-auto mt-4 max-w-2xl text-sm sm:text-base font-medium leading-relaxed text-slate-600 dark:text-slate-300"
            >
              A showcase of hands-on security research, interactive browser terminals, computer science algorithm visualizers, and developer utilities built by Nikhil Agrahari.
            </motion.p>

            {/* Centered Quick Stats Capsule */}
            <FadeInUp delay={0.25} className="mt-8">
              <div className="mx-auto flex flex-wrap items-center justify-center gap-3.5 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-md backdrop-blur-xl dark:border-emerald-500/20 dark:bg-[#030d07]/90 max-w-2xl">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                  <FlaskConical className="h-4 w-4 text-emerald-500" />
                  <span>5 Specialized Labs</span>
                </div>
                <span className="text-slate-400 dark:text-slate-500">•</span>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span>100% Client-Side Sandbox</span>
                </div>
                <span className="text-slate-400 dark:text-slate-500">•</span>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                  <ShieldCheck className="h-4 w-4 text-lime-400" />
                  <span>Defensive &amp; Ethical</span>
                </div>
              </div>
            </FadeInUp>
          </div>

          {/* Grid of Clean Experiment Modules (Only Page Name + Description) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {EXPERIMENT_MODULES.map((exp, index) => {
              const Icon = exp.icon;
              return (
                <ScaleIn key={exp.id} delay={index * 0.08}>
                  <Link
                    to={exp.to}
                    className="group relative flex flex-col justify-between h-full rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-7 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-2xl dark:border-emerald-500/20 dark:bg-[#030d07]/95 dark:hover:border-emerald-400/50"
                  >
                    {/* Top Glow Accent */}
                    <div className="pointer-events-none absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div>
                      {/* Icon & Category Badge */}
                      <div className="flex items-center justify-between gap-3 mb-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300">
                          <Icon size={22} />
                        </div>
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                          {exp.badge}
                        </span>
                      </div>

                      {/* Module / Page Title */}
                      <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 tracking-tight">
                        {exp.title}
                      </h3>

                      {/* Module Description */}
                      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                        {exp.description}
                      </p>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-8 pt-4 flex items-center justify-between border-t border-slate-100 dark:border-emerald-500/10">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        LAB #{String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform duration-200">
                        <span>Open Module</span>
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

