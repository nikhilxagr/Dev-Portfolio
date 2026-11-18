import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  CheckCircle2,
  Code2,
  Database,
  GitBranch,
  Globe,
  Lightbulb,
  Lock,
  MonitorCheck,
  Rocket,
  Server,
  ShieldCheck,
  Terminal,
  Workflow,
} from "lucide-react";
import { FaFigma } from "react-icons/fa";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";

const MotionDiv = motion.div;

const HowIBuildPage = () => {
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState(0);

  const workflowSteps = [
    {
      stage: "01",
      title: "Idea & Requirements",
      icon: Lightbulb,
      tool: "Problem Discovery",
      description: "Defining user pain points, system scope, business logic, and initial layout wireframes.",
      details: ["User story mapping & feature backlog", "Tech stack selection & feasibility test", "Database entity-relationship modeling"],
    },
    {
      stage: "02",
      title: "Figma UI/UX Design",
      icon: FaFigma,
      tool: "Design System",
      description: "Designing dark and light theme UI components, consistent tokens, and responsive grids.",
      details: ["Consistent light & dark palette tokens", "Reusable component & spacing scale", "Mobile-first responsive layout grids"],
    },
    {
      stage: "03",
      title: "Git Repository",
      icon: Code2,
      tool: "Version Control",
      description: "Initializing Git version control with structured commits, environment safety rules, and documentation.",
      details: ["Modular Git commit structuring", "Environment variable secret masking", "Issue & milestone tracking"],
    },
    {
      stage: "04",
      title: "Branch Strategy",
      icon: GitBranch,
      tool: "Gitflow Architecture",
      description: "Using feature-branch Gitflow (main -> dev -> feature/*) for isolated development and clean merges.",
      details: ["Feature branch isolation & reviews", "Automated formatting & linting checks", "Protected production main branch"],
    },
    {
      stage: "05",
      title: "Development Stage",
      icon: Terminal,
      tool: "MERN Engineering",
      description: "Building React components with Tailwind and Framer Motion alongside Express RESTful APIs.",
      details: ["Modular React component architecture", "RESTful API routes & async middleware", "State management & custom hooks"],
    },
    {
      stage: "06",
      title: "Testing & Security",
      icon: ShieldCheck,
      tool: "AppSec Audit",
      description: "Conducting functional verification, input sanitization, OWASP checks, and CORS configuration.",
      details: ["Input validation & XSS sanitization", "Bcrypt password hashing & JWT security", "Performance & accessibility review"],
    },
    {
      stage: "07",
      title: "Deployment",
      icon: Rocket,
      tool: "Vercel / Netlify CDN",
      description: "CI/CD build pipelines deploying production artifacts to Vercel and Netlify edge networks.",
      details: ["Vercel Edge & Netlify CDN distribution", "Custom domain DNS & SSL/TLS encryption", "Production bundle optimization"],
    },
    {
      stage: "08",
      title: "Monitoring & Analytics",
      icon: MonitorCheck,
      tool: "Vercel Analytics & Logs",
      description: "Tracking traffic, route latency, API health logs, and runtime error reporting.",
      details: ["Real-time Vercel Web Analytics", "Server error monitoring & patches", "Sitemap indexing & schema validation"],
    },
  ];

  const techStackLayers = [
    {
      layer: "Frontend Layer",
      icon: Globe,
      badge: "User Experience",
      techs: [
        { name: "React 18", role: "Declarative SPA Framework" },
        { name: "Vite", role: "Fast Build & Dev Bundler" },
        { name: "Tailwind CSS", role: "Utility-First Responsive Styling" },
        { name: "Framer Motion", role: "Declarative Motion & Transitions" },
        { name: "Lucide React", role: "Vector Icon System" },
        { name: "React Router DOM", role: "Client-Side SPA Routing" },
      ],
    },
    {
      layer: "Backend Layer",
      icon: Server,
      badge: "Business Logic",
      techs: [
        { name: "Node.js", role: "Asynchronous JavaScript Runtime" },
        { name: "Express.js", role: "RESTful Web API Framework" },
        { name: "Custom Middleware", role: "Request Validation & Error Handling" },
        { name: "Cashfree SDK", role: "Payment Gateway Checkout Integration" },
      ],
    },
    {
      layer: "Database Layer",
      icon: Database,
      badge: "Persistence & Storage",
      techs: [
        { name: "MongoDB Atlas", role: "Cloud NoSQL Document Database" },
        { name: "Mongoose ODM", role: "Schema Validation & Modeling" },
        { name: "Supabase Postgres", role: "Relational Database Backend" },
      ],
    },
    {
      layer: "Authentication & Security",
      icon: Lock,
      badge: "Protection & Integrity",
      techs: [
        { name: "JSON Web Tokens (JWT)", role: "Stateless Session Management" },
        { name: "Bcrypt.js", role: "Salted Password Hashing" },
        { name: "AppSec Headers", role: "CORS, Helmet, Rate Limiting" },
        { name: "OWASP Hardening", role: "Sanitized Input & XSS Defense" },
      ],
    },
    {
      layer: "Deployment & CI/CD",
      icon: Rocket,
      badge: "Global Delivery",
      techs: [
        { name: "Vercel Edge Network", role: "Frontend & API Hosting" },
        { name: "Netlify CDN", role: "Static Edge Distribution" },
        { name: "GitHub Actions", role: "Automated Build & Lint Pipeline" },
      ],
    },
  ];

  const systemNodes = [
    {
      code: "01",
      title: "Client Browser (React SPA)",
      icon: Globe,
      summary: "React 18 · Tailwind CSS · Framer Motion · Client-Side Router · SEO Meta Head Tags",
    },
    {
      code: "02",
      title: "Vercel Edge & Netlify CDN",
      icon: Rocket,
      summary: "Global Anycast Edge Network · SSL/TLS Encryption · Brotli Compression · Static Cache",
    },
    {
      code: "03",
      title: "Hybrid Content Merge Engine (contentMerge.js)",
      icon: Workflow,
      summary: "Static Baseline Fallback (siteData.js) paired with Dynamic REST API Overrides",
    },
    {
      code: "04",
      title: "Node.js & Express.js API Server",
      icon: Server,
      summary: "REST Controllers · Auth Middleware · Cashfree Gateway SDK · Webhook Handlers",
    },
    {
      code: "05",
      title: "MongoDB Atlas & Security Layer",
      icon: Database,
      summary: "NoSQL Document Store · JWT Authentication · Bcrypt Salting · Rate Limiting",
    },
  ];

  return (
    <section className="section-wrap relative pt-6 pb-20 sm:pt-8 sm:pb-24">
      <SeoHead
        title="How I Build | Software Engineering Workflow & System Design - Nikhil Agrahari"
        description="Architectural overview showing the end-to-end SDLC workflow, tech stack hierarchy, and portfolio system design diagram."
        pathname="/dashboard/how-i-build"
      />

      <FadeInUp>
        <div className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
            <Workflow size={14} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
            Engineering Workflow &amp; System Design
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink-950 dark:text-ink-50 sm:text-4xl lg:text-5xl">
            How I <span className="text-emerald-600 dark:text-emerald-400">Build</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-base">
            Breakdown of my product development lifecycle, architectural choices, and full-stack portfolio system design.
          </p>
        </div>
      </FadeInUp>

      <div className="mt-14">
        <FadeInUp>
          <div className="mb-8 text-center">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">SDLC Stage Pipeline</span>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink-950 dark:text-ink-50 sm:text-3xl">
              End-to-End Engineering Workflow
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-xs text-ink-500 dark:text-ink-400">
              From problem discovery to monitoring across an 8-stage software development lifecycle.
            </p>
          </div>
        </FadeInUp>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = selectedWorkflowStep === idx;

            return (
              <button
                key={step.stage}
                type="button"
                onClick={() => setSelectedWorkflowStep(idx)}
                className={`relative overflow-hidden rounded-2xl border p-4 text-left transition-colors duration-150 ${
                  isSelected
                    ? "border-emerald-600/40 bg-emerald-500/10 dark:border-emerald-500/40 dark:bg-emerald-500/10"
                    : "border-black/[0.08] bg-white hover:border-emerald-600/30 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-emerald-500/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                    Stage {step.stage}
                  </span>
                  <span className="rounded-lg bg-emerald-500/10 p-1.5 text-emerald-600 dark:text-emerald-400">
                    <Icon size={15} strokeWidth={1.5} />
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-ink-950 dark:text-ink-50">{step.title}</h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">{step.tool}</p>
              </button>
            );
          })}
        </div>

        <MotionDiv
          key={selectedWorkflowStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-6 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c]"
        >
          <div className="flex flex-col justify-between gap-2 border-b border-black/[0.08] pb-4 dark:border-white/[0.08] sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 font-mono text-sm font-semibold tabular-nums text-white dark:bg-emerald-500 dark:text-ink-950">
                {workflowSteps[selectedWorkflowStep].stage}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-ink-950 dark:text-ink-50">
                  {workflowSteps[selectedWorkflowStep].title}
                </h3>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Focus: {workflowSteps[selectedWorkflowStep].tool}
                </p>
              </div>
            </div>
            <span className="font-mono text-xs tabular-nums text-ink-500 dark:text-ink-400">
              Stage {selectedWorkflowStep + 1} of 8
            </span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink-700 dark:text-ink-300">
            {workflowSteps[selectedWorkflowStep].description}
          </p>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
            {workflowSteps[selectedWorkflowStep].details.map((detail, dIdx) => (
              <div
                key={dIdx}
                className="flex items-center gap-2 rounded-xl border border-black/[0.08] bg-[#f8fafc] p-3 text-xs text-ink-800 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-ink-200"
              >
                <CheckCircle2 size={14} strokeWidth={1.5} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </MotionDiv>
      </div>

      <div className="mt-16">
        <FadeInUp>
          <div className="mb-8 text-center">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Architecture Layers</span>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink-950 dark:text-ink-50 sm:text-3xl">
              Tech Stack Layer Breakdown
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-xs text-ink-500 dark:text-ink-400">
              Technologies and frameworks powering this portfolio and my full-stack web products.
            </p>
          </div>
        </FadeInUp>

        <div className="space-y-5">
          {techStackLayers.map((layer, lIdx) => {
            const LayerIcon = layer.icon;
            return (
              <FadeInUp key={layer.layer} delay={lIdx * 0.06}>
                <div className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c]">
                  <div className="flex items-center gap-3 border-b border-black/[0.08] pb-4 dark:border-white/[0.08]">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/25 dark:text-emerald-400">
                      <LayerIcon size={18} strokeWidth={1.5} />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-ink-950 dark:text-ink-50">{layer.layer}</h3>
                      <p className="text-xs text-ink-500 dark:text-ink-400">{layer.badge}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {layer.techs.map((t, tIdx) => (
                      <div key={tIdx} className="rounded-xl border border-black/[0.08] bg-[#f8fafc] p-3.5 dark:border-white/[0.08] dark:bg-[#0c0e14]">
                        <p className="text-sm font-medium text-ink-950 dark:text-ink-50">{t.name}</p>
                        <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400">{t.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInUp>
            );
          })}
        </div>
      </div>

      <div className="mt-16">
        <FadeInUp>
          <div className="mb-8 text-center">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">System Architecture</span>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink-950 dark:text-ink-50 sm:text-3xl">
              Portfolio System Design Diagram
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-ink-600 dark:text-ink-300">
              Request routing from edge CDN and static fallbacks down to the Express API and MongoDB persistence layer.
            </p>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.12}>
          <div className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-10">
            <div className="flex flex-col items-center gap-4">
              {systemNodes.map((node, index) => {
                const NodeIcon = node.icon;
                return (
                  <div key={node.code} className="flex w-full max-w-lg flex-col items-center gap-4">
                    <div className="w-full rounded-xl border border-black/[0.08] bg-[#f8fafc] p-4 text-center dark:border-white/[0.08] dark:bg-[#0c0e14]">
                      <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                        <NodeIcon size={15} strokeWidth={1.5} />
                        <span>[{node.code}] {node.title}</span>
                      </div>
                      <p className="mt-1.5 text-xs text-ink-600 dark:text-ink-300">{node.summary}</p>
                    </div>
                    {index < systemNodes.length - 1 && (
                      <ArrowDown size={18} strokeWidth={1.5} className="text-ink-400 dark:text-ink-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
};

export default HowIBuildPage;
