import { useState } from "react";
import clsx from "clsx";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Code2,
  Layers,
  RefreshCw,
  Rocket,
  ShieldCheck,
} from "lucide-react";

const SDLC_PHASES = [
  {
    number: "01",
    title: "Planning & Requirements",
    stage: "Scope & Feasibility",
    icon: ClipboardList,
    summary:
      "Define the core problem, user flows, edge cases, and security boundaries before any code is written.",
    deliverables: [
      "User stories and feature priority list",
      "Technical feasibility and dependency check",
      "Clear acceptance criteria for each flow",
    ],
    output: "Approved scope & feature plan",
    tools: ["User Flows", "System Notes", "Threat Model"],
  },
  {
    number: "02",
    title: "System Design",
    stage: "Architecture & Contracts",
    icon: Layers,
    summary:
      "Design database schemas, folder structure, component boundaries, and predictable REST API payloads.",
    deliverables: [
      "MongoDB schemas with indexes and TTL rules",
      "Modular React component and state layout",
      "API route contracts verified early",
    ],
    output: "Database schema & API specification",
    tools: ["MongoDB Schema", "REST API", "Postman"],
  },
  {
    number: "03",
    title: "Implementation",
    stage: "Full-Stack Build",
    icon: Code2,
    summary:
      "Write clean, modular frontend interfaces and server controllers with explicit validation and error handling.",
    deliverables: [
      "Responsive Light & Dark UI with Tailwind CSS",
      "Express controllers with clear status responses",
      "Real-time WebSocket rooms and file uploads",
    ],
    output: "Working application modules",
    tools: ["React", "Node.js", "Express", "Tailwind CSS"],
  },
  {
    number: "04",
    title: "Testing & Security",
    stage: "QA & OWASP Verification",
    icon: ShieldCheck,
    summary:
      "Audit authentication, rate limiting, input sanitization, and edge cases so defects are caught before release.",
    deliverables: [
      "Payload validation, XSS, and injection defense",
      "JWT / HTTP-only cookie and CORS verification",
      "Cross-device layout and API edge testing",
    ],
    output: "Verified & hardened build",
    tools: ["OWASP Top 10", "ESLint", "Burp Suite"],
  },
  {
    number: "05",
    title: "Deployment",
    stage: "Production Release",
    icon: Rocket,
    summary:
      "Ship production builds with separated environment secrets, TLS encryption, and post-deploy smoke checks.",
    deliverables: [
      "Automated frontend & API hosting builds",
      "Custom domain DNS and SSL configuration",
      "Health-check and checkout flow verification",
    ],
    output: "Live production environment",
    tools: ["Vercel", "Render", "Git CI/CD"],
  },
  {
    number: "06",
    title: "Maintenance",
    stage: "Monitor & Iterate",
    icon: RefreshCw,
    summary:
      "Track live errors, database performance, and user feedback to ship focused fixes and incremental upgrades.",
    deliverables: [
      "Runtime error & webhook log inspection",
      "Query tuning and UX refinements from real usage",
      "Dependency updates and security patching",
    ],
    output: "Reliable long-term operation",
    tools: ["Monitoring", "Analytics", "Iterative Fixes"],
  },
];

const WorkflowSimulator = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileExpandedIndex, setMobileExpandedIndex] = useState(0);

  const current = SDLC_PHASES[activeIndex];
  const CurrentIcon = current.icon;

  const prevStep = () =>
    setActiveIndex((prev) => (prev - 1 + SDLC_PHASES.length) % SDLC_PHASES.length);
  const nextStep = () =>
    setActiveIndex((prev) => (prev + 1) % SDLC_PHASES.length);

  return (
    <div className="space-y-6">
      {/* MOBILE / TABLET VIEW (< lg): Journey-inspired vertical SDLC timeline */}
      <div className="relative space-y-4 pl-6 lg:hidden">
        {/* Continuous Vertical Spine */}
        <div
          aria-hidden="true"
          className="absolute left-2.5 top-3 bottom-3 w-px bg-black/[0.1] dark:bg-white/[0.1]"
        />

        {SDLC_PHASES.map((phase, idx) => {
          const Icon = phase.icon;
          const isExpanded = mobileExpandedIndex === idx;

          return (
            <div key={phase.number} className="relative">
              {/* Timeline Node Marker */}
              <span
                aria-hidden="true"
                className={clsx(
                  "absolute -left-6 top-5 flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-mono font-medium tabular-nums transition-colors",
                  isExpanded
                    ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-400 dark:bg-emerald-500 dark:text-slate-950"
                    : "border-black/[0.12] bg-white text-slate-600 dark:border-white/[0.15] dark:bg-[#11141c] dark:text-[#a3a9b8]",
                )}
              >
                {idx + 1}
              </span>

              <article
                className={clsx(
                  "overflow-hidden rounded-xl border transition-colors",
                  isExpanded
                    ? "border-emerald-600/35 bg-white dark:border-emerald-500/35 dark:bg-[#11141c]"
                    : "border-black/[0.08] bg-white dark:border-white/[0.08] dark:bg-[#11141c]",
                )}
              >
                <button
                  type="button"
                  onClick={() =>
                    setMobileExpandedIndex((prev) => (prev === idx ? -1 : idx))
                  }
                  aria-expanded={isExpanded}
                  className="flex w-full items-start justify-between gap-3 p-4 text-left"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      className={clsx(
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                        isExpanded
                          ? "border-emerald-600/25 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "border-black/[0.08] bg-[#f8fafc] text-slate-600 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-[#a3a9b8]",
                      )}
                    >
                      <Icon size={16} strokeWidth={1.6} />
                    </span>

                    <div className="min-w-0">
                      <p className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400">
                        Phase {phase.number} · {phase.stage}
                      </p>
                      <h3 className="mt-0.5 font-display text-base font-medium text-slate-900 dark:text-[#eef0f5]">
                        {phase.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-[#a3a9b8]">
                        {phase.summary}
                      </p>
                    </div>
                  </div>

                  <ChevronDown
                    size={16}
                    strokeWidth={1.6}
                    className={clsx(
                      "mt-1 shrink-0 text-slate-500 transition-transform duration-150 dark:text-[#7a8296]",
                      isExpanded && "rotate-180 text-emerald-700 dark:text-emerald-400",
                    )}
                  />
                </button>

                {isExpanded && (
                  <div className="space-y-3 border-t border-black/[0.06] bg-[#f8fafc] px-4 py-3.5 dark:border-white/[0.08] dark:bg-[#0c0e14]">
                    <div>
                      <p className="font-mono text-[11px] text-slate-500 dark:text-[#7a8296]">
                        Key deliverables
                      </p>
                      <ul className="mt-2 space-y-2">
                        {phase.deliverables.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-[#d1d5df]"
                          >
                            <CheckCircle2
                              size={14}
                              strokeWidth={1.6}
                              className="mt-0.5 shrink-0 text-emerald-700 dark:text-emerald-400"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-black/[0.06] pt-2.5 dark:border-white/[0.06]">
                      <span className="text-xs font-medium text-slate-700 dark:text-[#d1d5df]">
                        Output: {phase.output}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {phase.tools.map((tool) => (
                          <span
                            key={tool}
                            className="rounded-md border border-black/[0.08] bg-white px-2 py-0.5 font-mono text-[11px] text-slate-600 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8]"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </article>
            </div>
          );
        })}
      </div>

      {/* DESKTOP VIEW (>= lg): Left Vertical SDLC Spine + Right Detailed Stage View */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
        {/* Left Vertical Timeline Rail */}
        <div className="relative space-y-2 pl-7 lg:col-span-5">
          <div
            aria-hidden="true"
            className="absolute left-3 top-4 bottom-4 w-px bg-black/[0.08] dark:bg-white/[0.08]"
          />

          {SDLC_PHASES.map((phase, idx) => {
            const Icon = phase.icon;
            const isSelected = activeIndex === idx;
            const isCompleted = idx < activeIndex;

            return (
              <div key={phase.number} className="relative">
                <span
                  aria-hidden="true"
                  className={clsx(
                    "absolute -left-7 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[11px] tabular-nums transition-colors",
                    isSelected
                      ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-400 dark:bg-emerald-500 dark:text-slate-950"
                      : isCompleted
                      ? "border-emerald-600/35 bg-emerald-50 text-emerald-700 dark:border-emerald-500/35 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "border-black/[0.1] bg-white text-slate-500 dark:border-white/[0.12] dark:bg-[#11141c] dark:text-[#7a8296]",
                  )}
                >
                  {idx + 1}
                </span>

                <button
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={clsx(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                    isSelected
                      ? "border-emerald-600/35 bg-white text-slate-900 shadow-xs dark:border-emerald-500/35 dark:bg-[#11141c] dark:text-[#eef0f5] dark:shadow-none"
                      : "border-black/[0.06] bg-white/60 text-slate-600 hover:border-black/[0.12] hover:bg-white hover:text-slate-900 dark:border-white/[0.06] dark:bg-[#0c0e14]/70 dark:text-[#a3a9b8] dark:hover:border-white/[0.14] dark:hover:bg-[#11141c] dark:hover:text-[#eef0f5]",
                  )}
                >
                  <span
                    className={clsx(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                      isSelected
                        ? "border-emerald-600/25 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "border-black/[0.08] bg-[#f8fafc] text-slate-500 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#7a8296]",
                    )}
                  >
                    <Icon size={16} strokeWidth={1.6} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p
                      className={clsx(
                        "font-mono text-[11px]",
                        isSelected
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-slate-500 dark:text-[#7a8296]",
                      )}
                    >
                      Phase {phase.number} · {phase.stage}
                    </p>
                    <p className="truncate font-display text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
                      {phase.title}
                    </p>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Right Detail Brief */}
        <article className="rounded-2xl border border-black/[0.08] bg-white p-7 lg:col-span-7 dark:border-white/[0.08] dark:bg-[#11141c]">
          <div className="flex items-center justify-between border-b border-black/[0.06] pb-4 dark:border-white/[0.08]">
            <span className="font-mono text-xs text-emerald-700 tabular-nums dark:text-emerald-400">
              Phase {current.number} of 06 · {current.stage}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={prevStep}
                aria-label="Previous SDLC phase"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.08] bg-[#f8fafc] text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-[#a3a9b8] dark:hover:border-white/[0.16] dark:hover:text-[#eef0f5]"
              >
                <ArrowLeft size={15} strokeWidth={1.6} />
              </button>
              <button
                type="button"
                onClick={nextStep}
                aria-label="Next SDLC phase"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.08] bg-[#f8fafc] text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-[#a3a9b8] dark:hover:border-white/[0.16] dark:hover:text-[#eef0f5]"
              >
                <ArrowRight size={15} strokeWidth={1.6} />
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
              <CurrentIcon size={20} strokeWidth={1.6} />
            </span>
            <div>
              <h3 className="font-display text-2xl font-medium tracking-[-0.015em] text-slate-900 dark:text-[#eef0f5]">
                {current.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8]">
                {current.summary}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-black/[0.06] bg-[#f8fafc] p-5 dark:border-white/[0.06] dark:bg-[#0c0e14]">
            <p className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
              What happens in this stage
            </p>
            <ul className="mt-3 space-y-2.5">
              {current.deliverables.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700 dark:text-[#d1d5df]"
                >
                  <CheckCircle2
                    size={16}
                    strokeWidth={1.6}
                    className="mt-0.5 shrink-0 text-emerald-700 dark:text-emerald-400"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-4 dark:border-white/[0.08]">
            <div className="text-xs text-slate-600 dark:text-[#a3a9b8]">
              <span className="text-slate-500 dark:text-[#7a8296]">Stage outcome: </span>
              <span className="font-medium text-slate-900 dark:text-[#eef0f5]">
                {current.output}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {current.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-md border border-black/[0.08] bg-[#f8fafc] px-2.5 py-1 font-mono text-xs text-slate-700 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-[#a3a9b8]"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default WorkflowSimulator;
