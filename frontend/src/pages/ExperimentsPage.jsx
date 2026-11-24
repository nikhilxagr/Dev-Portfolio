import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SeoHead from "@/components/seo/SeoHead";
import { FadeInUp } from "@/components/animations";
import {
  ShieldCheck,
  Terminal,
  Cpu,
  Wrench,
  FileCheck2,
  ArrowRight,
  FlaskConical,
  Layers,
} from "lucide-react";

const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;

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
      "Interactive in-browser UNIX terminal sandbox. Execute system commands, inspect developer stats, and explore portfolio data cleanly.",
  },
  {
    id: "dsa-lab",
    title: "Data Structure & Algorithm Lab",
    to: "/experiments/dsa",
    icon: Cpu,
    badge: "Computer Science",
    description:
      "Visual algorithms laboratory demonstrating sorting mechanisms, tree traversals, pathfinding algorithms, and time-space complexity analysis.",
  },
  {
    id: "cyber-tools",
    title: "Cyber Security Utilities & Tools",
    to: "/experiments/tools",
    icon: Wrench,
    badge: "Security Tooling",
    description:
      "Client-side developer security utilities including breach inspection, password entropy calculation, and HTTP response header auditing.",
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

      <div className="section-wrap pt-6 pb-20 sm:pt-8 sm:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="relative mx-auto mb-12 max-w-4xl text-center">
            <MotionDiv
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                Interactive Sandbox &amp; Security Research
              </span>
            </MotionDiv>

            <MotionH1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-2 font-display text-3xl font-semibold tracking-tight leading-[1.08] text-ink-950 dark:text-ink-50 sm:text-4xl lg:text-5xl"
            >
              Engineering{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                Experiments
              </span>
            </MotionH1>

            <MotionP
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-base"
            >
              Hands-on security research labs, an interactive browser CLI, computer science algorithm visualizers, and developer diagnostic utilities built by Nikhil Agrahari.
            </MotionP>

            <FadeInUp delay={0.22} className="mt-8">
              <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-4 rounded-2xl border border-black/[0.08] bg-white px-5 py-3.5 dark:border-white/[0.08] dark:bg-[#11141c]">
                <div className="flex items-center gap-2 text-xs font-medium tabular-nums text-ink-900 dark:text-ink-100 sm:text-sm">
                  <FlaskConical size={16} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
                  <span>{EXPERIMENT_MODULES.length} Specialized Labs</span>
                </div>
                <span className="text-ink-400 dark:text-ink-600">·</span>
                <div className="flex items-center gap-2 text-xs font-medium text-ink-900 dark:text-ink-100 sm:text-sm">
                  <Layers size={16} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Interactive Sandboxes</span>
                </div>
                <span className="text-ink-400 dark:text-ink-600">·</span>
                <div className="flex items-center gap-2 text-xs font-medium text-ink-900 dark:text-ink-100 sm:text-sm">
                  <ShieldCheck size={16} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Defensive &amp; Ethical</span>
                </div>
              </div>
            </FadeInUp>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {EXPERIMENT_MODULES.map((exp, index) => {
              const Icon = exp.icon;
              return (
                <FadeInUp key={exp.id} delay={index * 0.06}>
                  <Link
                    to={exp.to}
                    className="group flex h-full flex-col justify-between rounded-2xl border border-black/[0.08] bg-white p-6 transition-colors duration-200 hover:border-emerald-600/35 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-emerald-500/35"
                  >
                    <div>
                      <div className="mb-5 flex items-center justify-between gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/[0.08] bg-black/[0.03] text-emerald-600 transition-colors duration-200 group-hover:border-emerald-600/30 group-hover:bg-emerald-500/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-emerald-400">
                          <Icon size={20} strokeWidth={1.5} />
                        </div>
                        <span className="rounded-full border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
                          {exp.badge}
                        </span>
                      </div>

                      <h3 className="font-display text-lg font-semibold tracking-tight text-ink-950 transition-colors duration-150 group-hover:text-emerald-600 dark:text-ink-50 dark:group-hover:text-emerald-400 sm:text-xl">
                        {exp.title}
                      </h3>

                      <p className="mt-2.5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                        {exp.description}
                      </p>
                    </div>

                    <div className="mt-7 flex items-center justify-between border-t border-black/[0.06] pt-4 dark:border-white/[0.06]">
                      <span className="font-mono text-xs font-medium tabular-nums text-ink-500 dark:text-ink-400">
                        Lab {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <span>Open Module</span>
                        <ArrowRight size={14} strokeWidth={1.5} />
                      </span>
                    </div>
                  </Link>
                </FadeInUp>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExperimentsPage;
