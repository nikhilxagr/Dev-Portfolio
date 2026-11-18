import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import clsx from "clsx";

const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;
import {
  Code2,
  Cpu,
  ShieldCheck,
  Terminal,
  Layers,
  ArrowRight,
  HeartHandshake,
  Server,
  ExternalLink,
  FolderGit2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import SeoHead from "@/components/seo/SeoHead";
import SkillLogoBadge from "@/components/ui/SkillLogoBadge";
import { createBreadcrumbSchema } from "@/utils/seo";
import { SITE_PROFILE } from "@/constants/siteData";

const DOMAIN_SECTIONS = [
  {
    id: "full-stack",
    number: "01",
    title: "Full-Stack Web & Real-Time Engineering",
    category: "Full Stack",
    icon: Layers,
    summary:
      "Building complete web applications that pair responsive React frontends with bidirectional Socket.IO WebSockets and structured MongoDB models.",
    skillsUsed: [
      "React",
      "Next.js",
      "Node.js",
      "Express.js",
      "Socket.io",
      "MongoDB",
      "Tailwind CSS",
      "Redux Toolkit",
      "JWT",
      "Cloudinary",
    ],
    projectExamples: [
      {
        slug: "whatsapp-fullstack-clone",
        name: "WhatsApp Clone",
        tagline: "Real-time messaging, 24h status stories, and dual OTP verification",
        appliedSkills: ["React 19", "Socket.IO", "MongoDB TTL", "Cloudinary", "Nodemailer", "Twilio"],
        highlight:
          "Built 1-on-1 real-time chat with Socket.IO rooms, 24-hour status stories using MongoDB TTL expiry (86400s), and Email/SMS OTP verification.",
        liveUrl: "https://whatsapp-webclone.vercel.app/",
        githubUrl: "https://github.com/nikhilxagr/whatsapp-fullstack-clone",
      },
      {
        slug: "vistagram",
        name: "VISTAGRAM",
        tagline: "Real-time social platform with feeds, Reels, and direct messaging",
        appliedSkills: ["React (Vite)", "Redux Toolkit", "Socket.IO", "MongoDB", "Cloudinary"],
        highlight:
          "Implemented post feeds, snap-scrolling video Reels, dual HTTP-only cookie + Bearer auth, and live notification broadcasts over WebSockets.",
        liveUrl: "https://myvistagram.vercel.app/",
        githubUrl: "https://github.com/nikhilxagr/Vistagram",
      },
    ],
  },
  {
    id: "backend-saas",
    number: "02",
    title: "Backend Architecture, APIs & SaaS Systems",
    category: "Backend",
    icon: Server,
    summary:
      "Designing resilient REST APIs, multi-role access boundaries, verified payment webhooks, and server-side aggregation queries.",
    skillsUsed: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "Razorpay",
      "Google OAuth 2.0",
      "Postman",
      "yt-dlp",
      "FFmpeg",
      "Python",
    ],
    projectExamples: [
      {
        slug: "smart-lms",
        name: "Smart LMS",
        tagline: "Multi-role course platform with verified Razorpay webhooks",
        appliedSkills: ["Node.js", "Express", "MongoDB Atlas", "Razorpay Webhooks", "Google OAuth 2.0"],
        highlight:
          "Implemented cryptographic Razorpay webhook signature verification for instant course unlocks, Google OAuth 2.0 sign-in, and student/instructor role isolation.",
        liveUrl: "",
        githubUrl: "https://github.com/nikhilxagr/smart-lms-mern",
      },
      {
        slug: "smartmess",
        name: "SmartMess",
        tagline: "Hostel dining operations with RBAC and MongoDB aggregations",
        appliedSkills: ["Express.js", "MongoDB Aggregations", "JWT RBAC", "Vercel"],
        highlight:
          "Created REST micro-routes for digital attendance, state-tracked complaint tickets, and aggregation pipelines for meal rating trends.",
        liveUrl: "https://smartmesslms.vercel.app/",
        githubUrl: "https://github.com/nikhilxagr/SmartMess",
      },
      {
        slug: "intube",
        name: "InTube",
        tagline: "Stateless media extractor with live FFmpeg stream merging",
        appliedSkills: ["Node.js (ESM)", "Express.js", "yt-dlp", "FFmpeg", "Innertube API"],
        highlight:
          "Built a dual-engine fallback pipeline combining yt-dlp and Innertube with FFmpeg on-the-fly stream muxing and automatic temporary buffer cleanup.",
        liveUrl: "https://intubedl.vercel.app/",
        githubUrl: "https://github.com/nikhilxagr/InTube",
      },
    ],
  },
  {
    id: "ai-systems",
    number: "03",
    title: "AI Integration & Developer Workflows",
    category: "AI",
    icon: Cpu,
    summary:
      "Integrating Large Language Models into web applications for semantic search, structured legal document summarization, and automated code review.",
    skillsUsed: [
      "Gemini API",
      "Prompt Engineering",
      "Semantic Search",
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
    ],
    projectExamples: [
      {
        slug: "kanoon-mate",
        name: "Kanoon-Mate",
        tagline: "AI legal document assistant & case tracking prototype",
        appliedSkills: ["Gemini API", "OCR", "Structured Prompts", "Node.js", "React"],
        highlight:
          "Built during Nerds Hack Days Lucknow to translate dense legal paperwork into plain summaries, flag sections, and organize hearing dates.",
        liveUrl: "",
        githubUrl: "https://github.com/nikhilxagr/Kanoon-Mate--HackethonProjects-",
      },
      {
        slug: "ai-powered-code-reviewer",
        name: "AI Powered Code Reviewer",
        tagline: "Code inspection workspace with persistent review history",
        appliedSkills: ["Gemini API", "React", "Node.js", "Express.js", "MongoDB"],
        highlight:
          "Proxied Gemini evaluation calls through Express endpoints to inspect submitted snippets, surface security/syntax feedback, and save audit history.",
        liveUrl: "",
        githubUrl: "https://github.com/nikhilxagr/AI-Powered-Code-Reviewer-MERN-Project",
      },
    ],
  },
  {
    id: "cybersecurity",
    number: "04",
    title: "Cybersecurity, Auditing & Defense",
    category: "Cybersecurity",
    icon: ShieldCheck,
    summary:
      "Applying OWASP Top 10 defensive controls, proxy traffic inspection, and network surface diagnostics across web applications and server environments.",
    skillsUsed: [
      "Kali Linux",
      "Burp Suite",
      "Nmap",
      "Wireshark",
      "Metasploit",
      "OWASP",
      "TryHackMe",
      "Linux",
    ],
    projectExamples: [
      {
        slug: "security-audits",
        name: "Web Application Defense & OWASP Auditing",
        tagline: "Vulnerability testing and backend defense hardening",
        appliedSkills: ["Burp Suite", "OWASP Top 10", "Input Sanitization", "JWT Hardening"],
        highlight:
          "Applied intercept proxy testing in authorized labs to verify protection against SQL Injection, XSS, CSRF, and broken access controls in MERN APIs.",
        liveUrl: "",
        githubUrl: "https://tryhackme.com/p/nikhilxagr",
        externalTarget: true,
      },
      {
        slug: "network-recon",
        name: "Network Diagnostics & Traffic Analysis",
        tagline: "Port discovery, service enumeration, and packet inspection",
        appliedSkills: ["Nmap", "Wireshark", "Kali Linux", "Metasploit", "TryHackMe"],
        highlight:
          "Executed host discovery and service enumeration with Nmap, inspected unencrypted packet flows in Wireshark, and completed 275+ TryHackMe rooms.",
        liveUrl: "",
        githubUrl: "https://tryhackme.com/p/nikhilxagr",
        externalTarget: true,
      },
    ],
  },
  {
    id: "core-web-devops",
    number: "05",
    title: "Core Web Standards & Cloud Delivery",
    category: "DevOps",
    icon: Terminal,
    summary:
      "Strong foundation in browser APIs, version control workflows, Linux CLI environments, and split cloud deployment across Vercel, Netlify, and Render.",
    skillsUsed: [
      "JavaScript",
      "HTML",
      "CSS",
      "Git",
      "GitHub",
      "Vercel",
      "Render",
      "Linux",
      "VS Code",
      "Postman",
    ],
    projectExamples: [
      {
        slug: "fast-feast",
        name: "Fast Feast & Core Web Utilities",
        tagline: "Zero-dependency applications built with pure web standards",
        appliedSkills: ["HTML5", "CSS3", "JavaScript", "LocalStorage", "Web APIs"],
        highlight:
          "Built fast client utilities including Fast Feast, Notes App, Weather App, and Text-to-Speech using native DOM events and browser APIs.",
        liveUrl: "https://fastfeast-agr.netlify.app/",
        githubUrl: "https://github.com/nikhilxagr/Web-Dev-Projects",
      },
      {
        slug: "snapurl",
        name: "Cloud CI/CD & Production Hosting",
        tagline: "Split SPA/API hosting with domain routing and TLS",
        appliedSkills: ["Vercel", "Render", "Git", "GitHub", "Linux"],
        highlight:
          "Managed live deployments across Vercel, Netlify, and Render with automated preview builds, environment secret hygiene, and CORS alignment.",
        liveUrl: "https://snapurl-url-shortner.vercel.app/",
        githubUrl: "https://github.com/nikhilxagr",
      },
    ],
  },
];

const CATEGORY_TABS = ["All", "Full Stack", "Backend", "AI", "Cybersecurity", "DevOps"];

const SkillsPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredDomains = DOMAIN_SECTIONS.filter((domain) => {
    if (activeCategory === "All") return true;
    return domain.category === activeCategory;
  });

  return (
    <>
      <SeoHead
        title="Technical Domains & Applied Skills | Nikhil Agrahari"
        description="Applied technical capabilities of Nikhil Agrahari: Full-Stack MERN architecture, backend APIs, cybersecurity audits, and AI workflows backed by real production projects."
        pathname="/skills"
        image={SITE_PROFILE.profileImage}
        imageAlt="Nikhil Agrahari — Technical Skills & Applied Projects"
        keywords={[
          "Nikhil Agrahari skills",
          "MERN stack projects",
          "React Node.js MongoDB developer",
          "Cybersecurity tools Burp Suite Kali Linux",
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Skills", path: "/skills" },
        ])}
      />

      <section className="section-wrap pt-6 sm:pt-8 pb-24">
        {/* Page Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <MotionDiv
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-500/[0.08] px-4 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Code2 size={14} strokeWidth={1.5} /> Applied Engineering Domains
            </span>
          </MotionDiv>

          <MotionH1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-3xl font-semibold tracking-[-0.02em] leading-[1.08] text-slate-900 sm:text-4xl lg:text-5xl dark:text-[#eef0f5]"
          >
            Technical Skills &amp;{" "}
            <span className="text-emerald-600 dark:text-emerald-400">Focus Areas</span>
          </MotionH1>

          <MotionP
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-[#a3a9b8]"
          >
            Skills grounded directly in shipped code. Select any engineering domain to inspect the stack used and the projects built with it.
          </MotionP>

          <MotionDiv
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 flex flex-wrap items-center justify-center gap-3"
          >
            <Button to="/projects" className="min-w-[180px]">
              <FolderGit2 size={16} strokeWidth={1.5} /> Explore Projects
            </Button>
            <Button to="/services" variant="secondary" className="min-w-[160px]">
              <Layers size={16} strokeWidth={1.5} /> Services &amp; Packages
            </Button>
          </MotionDiv>
        </div>

        {/* Overview Summary Bar */}
        <div className="mb-16 rounded-2xl border border-black/[0.08] bg-white p-6 sm:p-8 dark:border-white/[0.08] dark:bg-[#11141c]">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="space-y-3 lg:col-span-7">
              <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                Engineering Standards
              </p>
              <h2 className="font-display text-xl font-semibold tracking-[-0.015em] text-slate-900 sm:text-2xl dark:text-[#eef0f5]">
                Capabilities Backed by Production Builds
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-[#a3a9b8]">
                Every technology listed below has been shipped in a live or complete project, covering WebSocket state management, webhook verification, and defensive security checks.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-5">
              <div className="rounded-xl border border-black/[0.06] bg-slate-50 p-4 dark:border-white/[0.06] dark:bg-[#1a1e28]">
                <p className="font-display text-2xl font-medium tabular-nums text-emerald-700 dark:text-emerald-400">
                  5 Domains
                </p>
                <p className="mt-1 text-xs font-medium text-slate-800 dark:text-[#eef0f5]">
                  Core Tracks
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-[#7a8296]">
                  Full-stack, APIs, security, AI
                </p>
              </div>

              <div className="rounded-xl border border-black/[0.06] bg-slate-50 p-4 dark:border-white/[0.06] dark:bg-[#1a1e28]">
                <p className="font-display text-2xl font-medium tabular-nums text-slate-900 dark:text-[#eef0f5]">
                  19 Projects
                </p>
                <p className="mt-1 text-xs font-medium text-slate-800 dark:text-[#eef0f5]">
                  Portfolio Archive
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-[#7a8296]">
                  Live demos &amp; public code
                </p>
              </div>

              <div className="rounded-xl border border-black/[0.06] bg-slate-50 p-4 dark:border-white/[0.06] dark:bg-[#1a1e28]">
                <p className="font-display text-2xl font-medium text-slate-900 dark:text-[#eef0f5]">
                  OWASP
                </p>
                <p className="mt-1 text-xs font-medium text-slate-800 dark:text-[#eef0f5]">
                  Defensive Focus
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-[#7a8296]">
                  Input &amp; token hardening
                </p>
              </div>

              <div className="rounded-xl border border-black/[0.06] bg-slate-50 p-4 dark:border-white/[0.06] dark:bg-[#1a1e28]">
                <p className="font-display text-2xl font-medium text-slate-900 dark:text-[#eef0f5]">
                  CI/CD
                </p>
                <p className="mt-1 text-xs font-medium text-slate-800 dark:text-[#eef0f5]">
                  Vercel &amp; Render
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-[#7a8296]">
                  Automated deployments
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation & Filter Tabs */}
        <div className="mb-10 border-b border-black/[0.08] pb-6 dark:border-white/[0.08]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-3xl dark:text-[#eef0f5]">
                Engineering Domains &amp; Case Studies
              </h2>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-[#a3a9b8]">
                Filter by domain to inspect technologies alongside the projects where they were built.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORY_TABS.map((cat) => {
                const isSelected = activeCategory === cat;
                const count =
                  cat === "All"
                    ? DOMAIN_SECTIONS.length
                    : DOMAIN_SECTIONS.filter((d) => d.category === cat).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={clsx(
                      "inline-flex h-9 items-center gap-2 rounded-lg border px-3.5 text-xs font-medium transition-colors duration-150 sm:text-sm",
                      isSelected
                        ? "border-emerald-600/40 bg-emerald-500/10 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300"
                        : "border-black/[0.08] bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8] dark:hover:border-white/[0.16] dark:hover:text-[#eef0f5]",
                    )}
                  >
                    <span>{cat}</span>
                    <span
                      className={clsx(
                        "font-mono text-xs tabular-nums",
                        isSelected
                          ? "text-emerald-700 dark:text-emerald-300"
                          : "text-slate-400 dark:text-[#7a8296]",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Complete Domain Cards */}
        <div className="space-y-8">
          {filteredDomains.map((domain) => {
            const DomainIcon = domain.icon;

            return (
              <article
                key={domain.id}
                className="rounded-2xl border border-black/[0.08] bg-white p-6 sm:p-8 lg:p-10 dark:border-white/[0.08] dark:bg-[#11141c]"
              >
                {/* Domain Header Row */}
                <div className="flex flex-col gap-4 border-b border-black/[0.06] pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08]">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-black/[0.08] bg-slate-50 text-emerald-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-emerald-400">
                      <DomainIcon size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
                        Domain {domain.number} · {domain.category}
                      </span>
                      <h3 className="mt-0.5 font-display text-xl font-semibold tracking-[-0.015em] text-slate-900 sm:text-2xl dark:text-[#eef0f5]">
                        {domain.title}
                      </h3>
                    </div>
                  </div>

                  <span className="self-start rounded-md border border-black/[0.08] bg-slate-50 px-3 py-1 font-mono text-xs tabular-nums text-slate-700 sm:self-auto dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]">
                    {domain.skillsUsed.length} Core Technologies
                  </span>
                </div>

                {/* Domain Summary */}
                <p className="mt-5 max-w-4xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-[#a3a9b8]">
                  {domain.summary}
                </p>

                {/* Core Stack Box */}
                <div className="mt-6 rounded-xl border border-black/[0.06] bg-slate-50 p-4 sm:p-5 dark:border-white/[0.06] dark:bg-[#1a1e28]">
                  <p className="mb-3 font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                    Core technologies &amp; frameworks
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {domain.skillsUsed.map((skill) => (
                      <SkillLogoBadge key={skill} skill={skill} />
                    ))}
                  </div>
                </div>

                {/* Applied Project Examples */}
                <div className="mt-8">
                  <div className="mb-4 flex items-center gap-2">
                    <FolderGit2 size={16} strokeWidth={1.5} className="text-emerald-700 dark:text-emerald-400" />
                    <h4 className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      Applied in production projects
                    </h4>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {domain.projectExamples.map((project) => (
                      <div
                        key={project.name}
                        className="flex flex-col justify-between rounded-xl border border-black/[0.08] bg-slate-50/70 p-5 transition-colors duration-150 hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#0b0d14] dark:hover:border-white/[0.16]"
                      >
                        <div>
                          <div className="mb-2 flex items-start justify-between gap-3">
                            <div>
                              <h5 className="font-display text-base font-medium text-slate-900 dark:text-[#eef0f5]">
                                {project.name}
                              </h5>
                              <p className="mt-0.5 text-xs text-slate-500 dark:text-[#7a8296]">
                                {project.tagline}
                              </p>
                            </div>

                            {project.externalTarget ? (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="shrink-0 rounded-lg border border-black/[0.08] bg-white p-1.5 text-slate-500 transition-colors duration-150 hover:border-slate-300 hover:text-emerald-700 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#7a8296] dark:hover:border-white/[0.16] dark:hover:text-emerald-400"
                                title="Open TryHackMe profile"
                              >
                                <ExternalLink size={14} strokeWidth={1.5} />
                              </a>
                            ) : (
                              <Link
                                to={`/projects/${project.slug}`}
                                className="shrink-0 rounded-lg border border-black/[0.08] bg-white p-1.5 text-slate-500 transition-colors duration-150 hover:border-slate-300 hover:text-emerald-700 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#7a8296] dark:hover:border-white/[0.16] dark:hover:text-emerald-400"
                                title="View project case study"
                              >
                                <ExternalLink size={14} strokeWidth={1.5} />
                              </Link>
                            )}
                          </div>

                          <div className="my-3.5 flex flex-wrap gap-1.5">
                            {project.appliedSkills.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-md border border-black/[0.08] bg-white px-2 py-0.5 font-mono text-xs text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          <p className="text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-[#a3a9b8]">
                            <span className="font-medium text-emerald-700 dark:text-emerald-400">
                              Implementation:{" "}
                            </span>
                            {project.highlight}
                          </p>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-black/[0.06] pt-3.5 text-xs dark:border-white/[0.06]">
                          {project.externalTarget ? (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 font-medium text-emerald-700 transition-colors duration-150 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                            >
                              View Security Profile <ArrowRight size={13} strokeWidth={1.5} />
                            </a>
                          ) : (
                            <Link
                              to={`/projects/${project.slug}`}
                              className="inline-flex items-center gap-1 font-medium text-emerald-700 transition-colors duration-150 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                            >
                              Inspect Case Study <ArrowRight size={13} strokeWidth={1.5} />
                            </Link>
                          )}

                          {project.liveUrl ? (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 font-medium text-slate-500 transition-colors duration-150 hover:text-slate-900 dark:text-[#7a8296] dark:hover:text-[#eef0f5]"
                            >
                              Live Demo
                              <ExternalLink size={12} strokeWidth={1.5} />
                            </a>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-16 rounded-2xl border border-black/[0.08] bg-white p-8 text-center sm:p-10 dark:border-white/[0.08] dark:bg-[#11141c]">
          <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Available for Production Work
          </p>

          <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-3xl dark:text-[#eef0f5]">
            Need Any of These Capabilities Built?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8]">
            Whether you need responsive frontend interfaces, REST backend APIs, or application security checks, review my service packages or reach out directly.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button to="/services" className="min-w-[190px]">
              <Layers size={16} strokeWidth={1.5} /> Explore Services
            </Button>
            <Button to="/contact" variant="secondary" className="min-w-[170px]">
              <HeartHandshake size={16} strokeWidth={1.5} /> Contact Nikhil
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default SkillsPage;
