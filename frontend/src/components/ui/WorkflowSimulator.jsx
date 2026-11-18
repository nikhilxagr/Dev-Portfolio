import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import {
  Search,
  Layers,
  Code2,
  ShieldCheck,
  Rocket,
  ArrowRight,
  Check,
  CheckCircle2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const MotionDiv = motion.div;

const WORKFLOW_STEPS = [
  {
    number: "01",
    title: "Understand",
    phase: "Discovery & Problem Scope",
    icon: Search,
    summary:
      "Deconstructing requirements, technical constraints, user flows, and threat boundaries before writing implementation code.",
    actions: [
      "User journey mapping & core feature scoping",
      "Security threat boundaries & edge-case checks",
      "Stack selection & third-party dependency review",
    ],
    metric: "Clear Scope & Feasibility",
    tools: ["Problem Scoping", "Wireframing", "Feasibility Audit"],
  },
  {
    number: "02",
    title: "Architect",
    phase: "System Design & API Contracts",
    icon: Layers,
    summary:
      "Structuring database schemas, modular component hierarchies, state boundaries, and REST API request/response contracts.",
    actions: [
      "MongoDB schema design with indexing & TTL policies",
      "Decoupled React component hierarchy & state flow",
      "RESTful API route contracts tested in Postman",
    ],
    metric: "Modular Data & API Contracts",
    tools: ["MongoDB Schema", "Postman", "Component Tree"],
  },
  {
    number: "03",
    title: "Build",
    phase: "MERN Stack Implementation",
    icon: Code2,
    summary:
      "Implementing responsive React/Next interfaces paired with validated Express controllers and real-time Socket.IO event streams.",
    actions: [
      "Modular React components styled cleanly with Tailwind CSS",
      "Express REST controllers with explicit error handling",
      "Real-time Socket.IO rooms & Cloudinary media uploads",
    ],
    metric: "Maintainable Production Code",
    tools: ["React", "Node.js", "Express", "Tailwind CSS"],
  },
  {
    number: "04",
    title: "Secure & Test",
    phase: "Hardening & Verification",
    icon: ShieldCheck,
    summary:
      "Auditing input sanitization, rate limiting, and authorization checks against OWASP Top 10 vulnerabilities and JWT token edge cases.",
    actions: [
      "Input validation, rate limiting & XSS/SQLi defense",
      "JWT verification & HTTP-only cookie hardening",
      "Burp Suite proxy validation & API edge checks",
    ],
    metric: "OWASP Defense Checklist Verified",
    tools: ["OWASP Top 10", "Burp Suite", "JWT Security"],
  },
  {
    number: "05",
    title: "Ship",
    phase: "Production Deployment",
    icon: Rocket,
    summary:
      "Shipping builds to Vercel and Render infrastructure with TLS certificates, separated environment secrets, and live verification.",
    actions: [
      "Automated CI/CD builds to edge and server hosts",
      "Custom domain DNS routing & SSL verification",
      "Post-deployment smoke checks across endpoints",
    ],
    metric: "Live & Verified Deployment",
    tools: ["Vercel", "Render", "CI/CD Pipelines"],
  },
];

const STEP_DURATION_SEC = 3.5;

const WorkflowSimulator = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const timer = setInterval(() => {
      setDirection(1);
      setActiveStep((prev) => (prev + 1) % WORKFLOW_STEPS.length);
    }, STEP_DURATION_SEC * 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered]);

  const handleStepSelect = (index) => {
    setDirection(index >= activeStep ? 1 : -1);
    setActiveStep(index);
  };

  const handleNext = () => {
    setDirection(1);
    setActiveStep((prev) => (prev + 1) % WORKFLOW_STEPS.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveStep((prev) => (prev - 1 + WORKFLOW_STEPS.length) % WORKFLOW_STEPS.length);
  };

  const currentStep = WORKFLOW_STEPS[activeStep];
  const StepIcon = currentStep.icon;

  return (
    <div
      className="space-y-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top 5-Step Selector Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {WORKFLOW_STEPS.map((step, index) => {
          const isActive = activeStep === index;
          const isPassed = activeStep > index;

          return (
            <button
              key={step.title}
              type="button"
              onClick={() => handleStepSelect(index)}
              className={clsx(
                "relative flex flex-col justify-between overflow-hidden rounded-xl border p-4 text-left transition-colors duration-150",
                isActive
                  ? "border-emerald-600/50 bg-emerald-500/[0.08] text-slate-950 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-[#eef0f5]"
                  : isPassed
                  ? "border-black/[0.08] bg-white text-slate-800 hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#d1d5df] dark:hover:border-white/[0.16]"
                  : "border-black/[0.08] bg-white text-slate-600 hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#7a8296] dark:hover:border-white/[0.16]",
              )}
            >
              {isActive && (
                <MotionDiv
                  key={`progress-${activeStep}-${isPlaying && !isHovered}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isPlaying && !isHovered ? 1 : 0 }}
                  transition={{
                    duration: isPlaying && !isHovered ? STEP_DURATION_SEC : 0,
                    ease: "linear",
                  }}
                  style={{ transformOrigin: "left" }}
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-600 dark:bg-emerald-400"
                />
              )}

              <div className="mb-2 flex w-full items-center justify-between">
                <span
                  className={clsx(
                    "font-mono text-xs tabular-nums font-medium",
                    isActive
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-slate-400 dark:text-[#7a8296]",
                  )}
                >
                  {step.number}
                </span>

                {isActive ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                ) : isPassed ? (
                  <Check size={13} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
                ) : null}
              </div>

              <div>
                <p className="font-display text-sm font-medium leading-tight text-slate-900 dark:text-[#eef0f5]">
                  {step.title}
                </p>
                <p className="mt-1 truncate text-xs text-slate-500 dark:text-[#7a8296]">
                  {step.phase}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Showcase Card */}
      <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white p-6 sm:p-8 dark:border-white/[0.08] dark:bg-[#11141c]">
        {/* Header Controls */}
        <div className="flex flex-col gap-4 border-b border-black/[0.06] pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-md border border-emerald-600/25 bg-emerald-500/[0.08] px-2.5 py-1 font-mono text-xs font-medium tabular-nums text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400">
              Step {currentStep.number} of 05
            </span>
            <span className="text-xs text-slate-500 dark:text-[#7a8296]">
              {isHovered ? "Paused on hover" : isPlaying ? "Advancing sequentially" : "Paused"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous step"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.08] bg-slate-50 text-slate-700 transition-colors duration-150 hover:border-slate-300 hover:text-slate-950 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8] dark:hover:border-white/[0.16] dark:hover:text-[#eef0f5]"
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-emerald-600/25 bg-emerald-500/[0.08] px-3 font-mono text-xs font-medium text-emerald-700 transition-colors duration-150 hover:bg-emerald-500/15 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
            >
              {isPlaying ? (
                <>
                  <Pause size={13} strokeWidth={1.5} />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play size={13} strokeWidth={1.5} />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next step"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.08] bg-slate-50 text-slate-700 transition-colors duration-150 hover:border-slate-300 hover:text-slate-950 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8] dark:hover:border-white/[0.16] dark:hover:text-[#eef0f5]"
            >
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div className="mt-6 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <MotionDiv
              key={activeStep}
              custom={direction}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 24 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-8 lg:grid-cols-12 lg:items-center"
            >
              {/* Left Summary Column */}
              <div className="space-y-4 lg:col-span-6">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-black/[0.08] bg-slate-50 text-emerald-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-emerald-400">
                    <StepIcon size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
                      Step {currentStep.number} · {currentStep.phase}
                    </span>
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.015em] text-slate-900 sm:text-3xl dark:text-[#eef0f5]">
                      {currentStep.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-[#a3a9b8]">
                  {currentStep.summary}
                </p>

                <div className="inline-flex items-center gap-2 rounded-lg border border-black/[0.08] bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#d1d5df]">
                  <CheckCircle2 size={15} strokeWidth={1.5} className="text-emerald-700 dark:text-emerald-400" />
                  <span>Target: {currentStep.metric}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentStep.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-md border border-black/[0.08] bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Deliverables Column */}
              <div className="lg:col-span-6">
                <div className="space-y-4 rounded-xl border border-black/[0.06] bg-slate-50 p-6 dark:border-white/[0.06] dark:bg-[#1a1e28]">
                  <p className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                    Core technical deliverables
                  </p>

                  <ul className="space-y-3">
                    {currentStep.actions.map((action, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm leading-snug text-slate-700 dark:text-[#d1d5df]"
                      >
                        <CheckCircle2
                          size={16}
                          strokeWidth={1.5}
                          className="mt-0.5 shrink-0 text-emerald-700 dark:text-emerald-400"
                        />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between border-t border-black/[0.06] pt-3.5 text-xs dark:border-white/[0.06]">
                    <span className="font-mono text-slate-500 tabular-nums dark:text-[#7a8296]">
                      Next: Step {WORKFLOW_STEPS[(activeStep + 1) % WORKFLOW_STEPS.length].number}
                    </span>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-1 font-medium text-emerald-700 transition-colors duration-150 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                      Advance to Step {WORKFLOW_STEPS[(activeStep + 1) % WORKFLOW_STEPS.length].number}
                      <ArrowRight size={13} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default WorkflowSimulator;
