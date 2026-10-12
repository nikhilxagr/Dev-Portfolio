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
    title: "UNDERSTAND",
    phase: "Discovery & Problem Scope",
    icon: Search,
    color: "emerald",
    gradient: "from-emerald-500 to-teal-500",
    summary:
      "Deconstructing problem requirements, technical feasibility, user constraints, and threat boundaries before writing a single line of code.",
    actions: [
      "User journey mapping & feature scope breakdown",
      "Security threat boundaries & edge-case definitions",
      "Tech stack suitability & third-party dependency review",
    ],
    metric: "100% Architecture Clarity",
    tools: ["Problem Scoping", "Wireframing", "Feasibility Audit"],
  },
  {
    number: "02",
    title: "ARCHITECT",
    phase: "System Design & API Contracts",
    icon: Layers,
    color: "lime",
    gradient: "from-lime-500 to-emerald-500",
    summary:
      "Structuring MongoDB schema models, modular component hierarchies, state management patterns, and RESTful API endpoints.",
    actions: [
      "Database schema modeling with indexing & TTL planning",
      "Decoupled React component hierarchy & state flow",
      "RESTful API route contracts & Postman documentation",
    ],
    metric: "Modular & Scalable Contracts",
    tools: ["MongoDB Schema", "Postman", "Component Tree"],
  },
  {
    number: "03",
    title: "BUILD",
    phase: "MERN Stack Implementation",
    icon: Code2,
    color: "emerald",
    gradient: "from-emerald-500 to-teal-500",
    summary:
      "Developing responsive client interfaces with React/Next & Tailwind, backed by robust Express controller logic and real-time Socket.IO streams.",
    actions: [
      "Clean, modular React component architecture with Tailwind CSS",
      "Express REST controllers with asynchronous error handling",
      "Real-time Socket.IO WebSockets & Cloudinary CDN pipelines",
    ],
    metric: "High Performance & Clean Code",
    tools: ["React", "Node.js", "Express", "Tailwind CSS"],
  },
  {
    number: "04",
    title: "SECURE & TEST",
    phase: "Hardening & Verification",
    icon: ShieldCheck,
    color: "cyan",
    gradient: "from-cyan-500 to-blue-500",
    summary:
      "Auditing application defense, verifying input sanitization, checking against OWASP Top 10 vulnerabilities, and hardening JWT tokens.",
    actions: [
      "Input validation, rate limiting & XSS/SQLi defense sanitization",
      "JWT authentication verification & HTTP-Only cookie security",
      "Burp Suite proxy testing & defensive API edge checks",
    ],
    metric: "OWASP Compliant & Hardened",
    tools: ["OWASP Top 10", "Burp Suite", "JWT Security"],
  },
  {
    number: "05",
    title: "SHIP",
    phase: "Production Deployment",
    icon: Rocket,
    color: "teal",
    gradient: "from-teal-500 to-emerald-500",
    summary:
      "Deploying to production on Vercel and Render edge infrastructure with automated SSL certificates, environment security, and live smoke tests.",
    actions: [
      "Automated CI/CD build pipelines deploying to edge CDNs",
      "Custom domain DNS routing & SSL/TLS certificate setup",
      "Post-deployment smoke testing & performance verification",
    ],
    metric: "Production Live & Monitored",
    tools: ["Vercel", "Render", "CI/CD Deployment"],
  },
];

const STEP_DURATION_SEC = 3.5;

const WorkflowSimulator = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Reliable sequential timer: strictly advances 0 -> 1 -> 2 -> 3 -> 4 -> 0 in exact chronological order
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
      className="space-y-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Top Step Timeline Bar (1 -> 2 -> 3 -> 4 -> 5) ─────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
        {WORKFLOW_STEPS.map((step, index) => {
          const isActive = activeStep === index;
          const isPassed = activeStep > index;

          return (
            <button
              key={step.title}
              type="button"
              onClick={() => handleStepSelect(index)}
              className={clsx(
                "relative group flex flex-col justify-between text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 overflow-hidden",
                isActive
                  ? "border-emerald-500 bg-emerald-50 text-emerald-950 shadow-md dark:border-emerald-400 dark:bg-emerald-500/15 dark:text-white"
                  : isPassed
                  ? "border-slate-200 bg-white/95 text-slate-800 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 hover:border-emerald-500/40"
                  : "border-slate-200 bg-white/80 text-slate-600 dark:border-slate-800/80 dark:bg-slate-900/40 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
              )}
            >
              {/* Smooth hardware-accelerated progress fill for active step */}
              {isActive && (
                <MotionDiv
                  key={`progress-${activeStep}-${isPlaying && !isHovered}`}
                  initial={{ width: "0%" }}
                  animate={{ width: isPlaying && !isHovered ? "100%" : "0%" }}
                  transition={{
                    duration: isPlaying && !isHovered ? STEP_DURATION_SEC : 0,
                    ease: "linear",
                  }}
                  className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"
                />
              )}

              <div className="flex items-center justify-between w-full mb-2">
                <span
                  className={clsx(
                    "font-mono text-xs font-black",
                    isActive
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-slate-400 dark:text-slate-500"
                  )}
                >
                  {step.number}
                </span>

                {isActive ? (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                ) : isPassed ? (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    ✓
                  </span>
                ) : null}
              </div>

              <div>
                <p className="font-display text-xs sm:text-sm font-black uppercase tracking-tight leading-tight">
                  {step.title}
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                  {step.phase}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Active Step Interactive Showcase Card ─────────────────────── */}
      <div className="relative rounded-3xl border border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-sm shadow-xl dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] overflow-hidden">
        {/* Top Stripe Gradient */}
        <div className={clsx("h-2 w-full bg-gradient-to-r", currentStep.gradient)} />

        <div className="p-6 sm:p-8 lg:p-10">
          
          {/* Header Controls Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1 font-mono text-[11px] font-black uppercase tracking-wider text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
                Step {currentStep.number} of 05
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {isHovered ? "Paused on Hover" : isPlaying ? "Advancing in Order" : "Simulation Paused"}
              </span>
            </div>

            {/* Interactive Player Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous step"
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-emerald-400 transition"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 font-mono text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-500/25 transition"
              >
                {isPlaying ? (
                  <>
                    <Pause size={13} />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play size={13} />
                    <span>Auto Play</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next step"
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-emerald-400 transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Animated Sliding Content Container */}
          <div className="mt-8 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <MotionDiv
                key={activeStep}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 40 }}
                transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                className="grid gap-8 lg:grid-cols-12 lg:items-center"
              >
                {/* Left Overview Column */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 shrink-0">
                      <StepIcon size={28} />
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                        Step {currentStep.number} // {currentStep.phase}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        {currentStep.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {currentStep.summary}
                  </p>

                  {/* Target Metric Badge */}
                  <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Target Outcome: {currentStep.metric}</span>
                  </div>

                  {/* Tools involved in this step */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {currentStep.tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Concrete Actions Column */}
                <div className="lg:col-span-6">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-800/30 p-6 space-y-4">
                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Core Technical Deliverables:
                    </p>

                    <ul className="space-y-3">
                      {currentStep.actions.map((action, i) => (
                        <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-snug">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                            ✓
                          </span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        Auto-transitions to Step {WORKFLOW_STEPS[(activeStep + 1) % WORKFLOW_STEPS.length].number}
                      </span>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center gap-1"
                      >
                        Advance to Step {WORKFLOW_STEPS[(activeStep + 1) % WORKFLOW_STEPS.length].number} <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </MotionDiv>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WorkflowSimulator;
