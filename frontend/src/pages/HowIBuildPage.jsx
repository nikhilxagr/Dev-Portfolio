import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  GitBranch,
  Globe,
  HardDrive,
  Key,
  Layers,
  Lightbulb,
  Lock,
  MonitorCheck,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Terminal,
  Workflow,
  Zap,
} from "lucide-react";
import { FaFigma } from "react-icons/fa";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";

const HowIBuildPage = () => {
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState(0);

  const workflowSteps = [
    {
      stage: "01",
      title: "Idea & Requirements",
      icon: Lightbulb,
      tool: "Problem Discovery",
      color: "from-amber-500 to-yellow-400",
      description: "Defining user pain points, system scope, business logic, and UI wireframe blueprints.",
      details: ["User story mapping & feature backlog", "Tech stack selection & feasibility test", "Database entity-relationship modeling"],
    },
    {
      stage: "02",
      title: "Figma UI/UX Design",
      icon: FaFigma,
      tool: "Design System",
      color: "from-pink-500 to-rose-400",
      description: "Designing high-fidelity dark/light mode UI components, glassmorphism tokens, and responsive layouts.",
      details: ["Modern dark mode palette & typography", "Component design tokens & micro-animations", "Mobile-first responsive layout grids"],
    },
    {
      stage: "03",
      title: "Git Repository",
      icon: Code2,
      tool: "Version Control",
      color: "from-purple-500 to-indigo-400",
      description: "Initializing Git version control with clean commit conventions, .gitignore, and README documentation.",
      details: ["Modular Git commit structuring", "Environment variable secret masking", "GitHub project board integration"],
    },
    {
      stage: "04",
      title: "Branch Strategy",
      icon: GitBranch,
      tool: "Gitflow Architecture",
      color: "from-cyan-500 to-blue-400",
      description: "Implementing feature-branch Gitflow (`main` ➔ `dev` ➔ `feature/*`) for isolated development.",
      details: ["Feature branch isolation & merge requests", "Automated code formatting & linting checks", "Zero-downtime main branch protection"],
    },
    {
      stage: "05",
      title: "Development Stage",
      icon: Terminal,
      tool: "MERN Engineering",
      color: "from-emerald-500 to-teal-400",
      description: "Building frontend React components with Tailwind & Framer Motion and backend Express RESTful APIs.",
      details: ["Modular React component architecture", "RESTful API routes & async middleware", "State management & custom React hooks"],
    },
    {
      stage: "06",
      title: "Testing & Security",
      icon: ShieldCheck,
      tool: "AppSec Audit",
      color: "from-lime-500 to-emerald-400",
      description: "Conducting unit testing, input sanitization, OWASP vulnerability check, and CORS configuration.",
      details: ["Input validation & XSS sanitization", "Bcrypt password hashing & JWT security", "Performance audit & Lighthouse 95+ score"],
    },
    {
      stage: "07",
      title: "Deployment",
      icon: Rocket,
      tool: "Vercel / Netlify CDN",
      color: "from-emerald-400 to-cyan-400",
      description: "Automated CI/CD build pipelines deploying production artifacts to global Vercel & Netlify edge networks.",
      details: ["Vercel Edge & Netlify CDN distribution", "Custom domain DNS & SSL/TLS encryption", "Production build bundle minification"],
    },
    {
      stage: "08",
      title: "Monitoring & Analytics",
      icon: MonitorCheck,
      tool: "Vercel Analytics & Logs",
      color: "from-cyan-400 to-teal-500",
      description: "Tracking real-time user traffic, page latency performance, API health logs, and crash reporting.",
      details: ["Real-time Vercel Web Analytics", "Server error log monitoring & quick fixes", "SEO Google sitemap indexing & schema audit"],
    },
  ];

  const techStackLayers = [
    {
      layer: "Frontend Layer",
      icon: Globe,
      color: "emerald",
      badge: "User Experience",
      techs: [
        { name: "React 18", role: "Declarative SPA Framework" },
        { name: "Vite", role: "Ultra-fast Next-Gen Bundler" },
        { name: "Tailwind CSS", role: "Utility-First Responsive Styling" },
        { name: "Framer Motion", role: "60fps Micro-Animations" },
        { name: "Lucide React", role: "Vector Icon System" },
        { name: "React Router DOM", role: "Client-Side SPA Routing" },
      ],
    },
    {
      layer: "Backend Layer",
      icon: Server,
      color: "teal",
      badge: "Business Logic",
      techs: [
        { name: "Node.js", role: "Asynchronous JavaScript Runtime" },
        { name: "Express.js", role: "RESTful Web API Framework" },
        { name: "Custom Middleware", role: "Request Validation & Error Catching" },
        { name: "Razorpay / Cashfree", role: "Payment Gateway Checkout SDKs" },
      ],
    },
    {
      layer: "Database Layer",
      icon: Database,
      color: "cyan",
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
      color: "purple",
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
      color: "lime",
      badge: "Global Delivery",
      techs: [
        { name: "Vercel Edge Network", role: "Frontend & API Cloud Hosting" },
        { name: "Netlify CDN", role: "Static Site Edge Distribution" },
        { name: "GitHub Actions", role: "Automated Build & Lint Pipeline" },
      ],
    },
  ];

  return (
    <section className="section-wrap relative pt-8 pb-20 sm:pt-12 sm:pb-28">
      <SeoHead
        title="How I Build | Software Engineering Workflow & System Design — Nikhil Agrahari"
        description="Comprehensive architectural overview showing the end-to-end SDLC workflow, tech stack hierarchy, and complete portfolio system design diagram."
        pathname="/dashboard/how-i-build"
      />

      {/* Header */}
      <FadeInUp>
        <div className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:border-emerald-400/30 dark:text-emerald-300">
            <Workflow size={14} className="text-emerald-500" />
            Engineering Workflow &amp; System Design
          </p>
          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            How I <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-400 bg-clip-text text-transparent">Build</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium text-slate-600 dark:text-slate-300 sm:text-base">
            Detailed breakdown of my end-to-end product development lifecycle, architectural choices, and full-stack portfolio system design.
          </p>
        </div>
      </FadeInUp>

      {/* Section 1: End-to-End SDLC Workflow (Flow Diagram) */}
      <div className="mt-14">
        <FadeInUp>
          <div className="text-center mb-8">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">// SDLC STAGE PIPELINE</span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl mt-1">
              End-to-End Engineering Workflow
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl mx-auto mt-2">
              From concept discovery to real-time monitoring — an 8-stage disciplined software development lifecycle.
            </p>
          </div>
        </FadeInUp>

        {/* Workflow Horizontal Stepper / Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = selectedWorkflowStep === idx;

            return (
              <motion.div
                key={step.stage}
                onClick={() => setSelectedWorkflowStep(idx)}
                whileHover={{ scale: 1.02 }}
                className={`cursor-pointer rounded-2xl border p-4 transition-all duration-300 relative overflow-hidden ${
                  isSelected
                    ? "border-emerald-400 bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-lime-500/15 shadow-[0_0_20px_rgba(52,211,153,0.3)] dark:bg-[#041208]"
                    : "border-slate-200 bg-white/80 dark:border-emerald-500/20 dark:bg-[#030d07]/80 hover:border-emerald-400/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
                    STAGE {step.stage}
                  </span>
                  <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Icon size={16} />
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm mt-3">{step.title}</h3>
                <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">{step.tool}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Step Expanded Details */}
        <motion.div
          key={selectedWorkflowStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-3xl border border-emerald-500/30 bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-emerald-500/20 pb-4 gap-2">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black">
                {workflowSteps[selectedWorkflowStep].stage}
              </span>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {workflowSteps[selectedWorkflowStep].title}
                </h3>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Focus: {workflowSteps[selectedWorkflowStep].tool}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
              Stage {selectedWorkflowStep + 1} of 8
            </span>
          </div>

          <p className="mt-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {workflowSteps[selectedWorkflowStep].description}
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {workflowSteps[selectedWorkflowStep].details.map((detail, dIdx) => (
              <div key={dIdx} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 dark:border-emerald-500/20 dark:bg-[#020803] dark:text-emerald-200 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Section 2: Tech Stack Layer Hierarchy */}
      <div className="mt-16">
        <FadeInUp>
          <div className="text-center mb-8">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">// ARCHITECTURE LAYERS</span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl mt-1">
              Tech Stack Layer Breakdown
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl mx-auto mt-2">
              Every technology and framework powering this portfolio and my full-stack web products.
            </p>
          </div>
        </FadeInUp>

        <div className="space-y-6">
          {techStackLayers.map((layer, lIdx) => {
            const LayerIcon = layer.icon;
            return (
              <FadeInUp key={layer.layer} delay={lIdx * 0.08}>
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_12px_40px_rgba(0,10,2,0.7)]">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-emerald-500/20 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        <LayerIcon size={20} />
                      </span>
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{layer.layer}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{layer.badge}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {layer.techs.map((t, tIdx) => (
                      <div key={tIdx} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-emerald-500/15 dark:bg-[#020803]/60">
                        <p className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">{t.name}</p>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">{t.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInUp>
            );
          })}
        </div>
      </div>

      {/* Section 3: Full Portfolio System Design Flowchart Diagram */}
      <div className="mt-16">
        <FadeInUp>
          <div className="text-center mb-8">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">// SYSTEM ARCHITECTURE</span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl mt-1">
              Portfolio System Design Diagram
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl mx-auto mt-2">
              Visual flowchart illustrating client request routing, edge caching, API services, database queries, and AppSec security.
            </p>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.15}>
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_20px_60px_rgba(0,10,2,0.85)] sm:p-10">
            
            {/* Interactive System Flow Nodes */}
            <div className="flex flex-col items-center gap-6">
              
              {/* Node 1: Client Layer */}
              <div className="w-full max-w-lg rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 p-4 text-center shadow-md">
                <div className="inline-flex items-center gap-2 font-mono text-xs font-black uppercase text-emerald-600 dark:text-emerald-300">
                  <Globe size={16} />
                  [01] CLIENT BROWSER (REACT SPA)
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  React 18 · Tailwind CSS · Framer Motion · Client-Side Router · SEO Meta Head Tags
                </p>
              </div>

              <ArrowDown size={22} className="text-emerald-500 animate-bounce" />

              {/* Node 2: CDN Edge Layer */}
              <div className="w-full max-w-lg rounded-2xl border border-teal-500/40 bg-gradient-to-r from-teal-500/15 to-cyan-500/15 p-4 text-center shadow-md">
                <div className="inline-flex items-center gap-2 font-mono text-xs font-black uppercase text-teal-600 dark:text-teal-300">
                  <Rocket size={16} />
                  [02] VERCEL EDGE &amp; NETLIFY CDN
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Global Anycast Edge Network · SSL/TLS Encryption · Gzip/Brotli Compression · Static Cache
                </p>
              </div>

              <ArrowDown size={22} className="text-emerald-500 animate-bounce" />

              {/* Node 3: Content Merging Strategy */}
              <div className="w-full max-w-lg rounded-2xl border border-lime-500/40 bg-gradient-to-r from-lime-500/15 to-emerald-500/15 p-4 text-center shadow-md">
                <div className="inline-flex items-center gap-2 font-mono text-xs font-black uppercase text-lime-600 dark:text-lime-300">
                  <Workflow size={16} />
                  [03] HYBRID CONTENT MERGE ENGINE (contentMerge.js)
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Static Baseline Fallback (`siteData.js`) ⚡ Dynamic REST API Overrides (`projects.service.js`)
                </p>
              </div>

              <ArrowDown size={22} className="text-emerald-500 animate-bounce" />

              {/* Node 4: Backend API Service */}
              <div className="w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 p-4 text-center shadow-md">
                <div className="inline-flex items-center gap-2 font-mono text-xs font-black uppercase text-cyan-600 dark:text-cyan-300">
                  <Server size={16} />
                  [04] NODE.JS &amp; EXPRESS.JS API SERVER
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  REST Controllers · Auth Middleware · Razorpay/Cashfree Gateway SDK · Webhook Handlers
                </p>
              </div>

              <ArrowDown size={22} className="text-emerald-500 animate-bounce" />

              {/* Node 5: Database & Security Layer */}
              <div className="w-full max-w-lg rounded-2xl border border-purple-500/40 bg-gradient-to-r from-purple-500/15 to-indigo-500/15 p-4 text-center shadow-md">
                <div className="inline-flex items-center gap-2 font-mono text-xs font-black uppercase text-purple-600 dark:text-purple-300">
                  <Database size={16} />
                  [05] MONGODB ATLAS &amp; SECURITY LAYER
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  NoSQL Document Store · JWT Authentication · Bcrypt Salting · Rate Limiting · AppSec Hardening
                </p>
              </div>

            </div>
          </div>
        </FadeInUp>
      </div>

    </section>
  );
};

export default HowIBuildPage;
