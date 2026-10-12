import { useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import {
  Code2,
  Cpu,
  ShieldCheck,
  Terminal,
  Layers,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  Server,
  Globe,
  ExternalLink,
  FolderGit2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import SkillLogoBadge from "@/components/ui/SkillLogoBadge";
import { createBreadcrumbSchema } from "@/utils/seo";
import { SITE_PROFILE } from "@/constants/siteData";

// ─── Comprehensive Domain Architecture with Project Examples ─────────────
const DOMAIN_SECTIONS = [
  {
    id: "full-stack",
    number: "01",
    title: "Full-Stack Web & Real-Time Engineering",
    category: "Full Stack",
    icon: Layers,
    headerGradient: "from-emerald-500 to-teal-500",
    badge: "border-emerald-500/30 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400",
    summary:
      "Engineering complete web applications combining reactive, high-speed frontends with bidirectional Socket.IO WebSockets and scalable MongoDB database backends.",
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
        tagline: "Real-time messaging, 24h stories, and dual OTP authentication",
        appliedSkills: ["React 19", "Socket.IO", "MongoDB TTL", "Cloudinary", "Nodemailer", "Twilio"],
        highlight:
          "Engineered sub-100ms real-time chat with Socket.IO rooms, 24-hour ephemeral status stories using MongoDB TTL auto-expiry (86400s), and dual-channel OTP verification (Twilio SMS + Nodemailer email).",
        liveUrl: "https://whatsapp-webclone.vercel.app/",
        githubUrl: "https://github.com/nikhilxagr/whatsapp-fullstack-clone",
      },
      {
        slug: "vistagram",
        name: "VISTAGRAM",
        tagline: "Full-stack real-time social networking platform with reels and stories",
        appliedSkills: ["React (Vite)", "Redux Toolkit", "Socket.IO", "MongoDB", "Cloudinary"],
        highlight:
          "Constructed interactive post feeds, snap-scrolling Reels, dual authentication architecture (HTTP-Only cookies + Bearer tokens), and live notification broadcasts over WebSockets.",
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
    headerGradient: "from-lime-500 to-emerald-500",
    badge: "border-lime-600/30 bg-lime-50 text-lime-800 dark:bg-lime-500/10 dark:text-lime-400",
    summary:
      "Developing resilient RESTful APIs, multi-role RBAC authorization systems, payment gateway webhook reconciliations, and low-latency database aggregation pipelines.",
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
        name: "Smart LMS (SaaS Platform)",
        tagline: "Multi-tenant e-learning platform with automated Razorpay webhook enrollments",
        appliedSkills: ["Node.js", "Express", "MongoDB Atlas", "Razorpay Webhooks", "Google OAuth 2.0"],
        highlight:
          "Constructed cryptographic Razorpay webhook signature verification for instant course unlocks, Google OAuth 2.0 SSO, and separate student/instructor role boundaries.",
        liveUrl: "",
        githubUrl: "https://github.com/nikhilxagr/smart-lms-mern",
      },
      {
        slug: "smartmess",
        name: "SmartMess",
        tagline: "Hostel dining operations platform with RBAC and MongoDB aggregation analytics",
        appliedSkills: ["Express.js", "MongoDB Aggregations", "JWT RBAC", "Vercel"],
        highlight:
          "Developed server micro-routes for meal attendance, state-tracked complaint lifecycles, and high-performance MongoDB aggregation pipelines for weekly meal rating trends.",
        liveUrl: "https://smartmesslms.vercel.app/",
        githubUrl: "https://github.com/nikhilxagr/SmartMess",
      },
      {
        slug: "intube",
        name: "InTube Media Engine",
        tagline: "Stateless streaming utility with FFmpeg live transcoding pipelines",
        appliedSkills: ["Node.js (ESM)", "Express.js", "yt-dlp", "FFmpeg", "Innertube API"],
        highlight:
          "Engineered a dual-engine fallback architecture to bypass cloud datacenter anti-bot limits, with on-the-fly FFmpeg stream merging and zero-storage memory wiping.",
        liveUrl: "https://intubedl.vercel.app/",
        githubUrl: "https://github.com/nikhilxagr/InTube",
      },
    ],
  },
  {
    id: "ai-systems",
    number: "03",
    title: "AI Integration & Intelligent Workflows",
    category: "AI",
    icon: Cpu,
    headerGradient: "from-amber-500 to-orange-500",
    badge: "border-amber-600/30 bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400",
    summary:
      "Integrating state-of-the-art Large Language Models into web products for semantic search, multi-agent legal guidance, and developer productivity tools.",
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
        tagline: "AI-powered legal operating system with automated document analysis",
        appliedSkills: ["Gemini API", "OCR", "Multi-Agent AI", "Node.js", "React"],
        highlight:
          "Built during Nerds Hack Days Lucknow: integrated Gemini AI to simplify legal jargon, detect applicable penal code sections, and automate hearing timeline case tracking.",
        liveUrl: "",
        githubUrl: "https://github.com/nikhilxagr/Kanoon-Mate--HackethonProjects-",
      },
      {
        slug: "ai-powered-code-reviewer",
        name: "AI Code Reviewer",
        tagline: "Automated code quality audit and security vulnerability suggestions",
        appliedSkills: ["Gemini API", "React", "Node.js", "Express.js", "MongoDB"],
        highlight:
          "Leveraged generative AI models to analyze submitted code snippets, identify anti-patterns, propose security hardenings, and persist review history.",
        liveUrl: "",
        githubUrl: "https://github.com/nikhilxagr/AI-Powered-Code-Reviewer-MERN-Project",
      },
    ],
  },
  {
    id: "cybersecurity",
    number: "04",
    title: "Cybersecurity, Auditing & Defense Standards",
    category: "Cybersecurity",
    icon: ShieldCheck,
    headerGradient: "from-cyan-500 to-blue-500",
    badge: "border-cyan-600/30 bg-cyan-50 text-cyan-800 dark:bg-cyan-500/10 dark:text-cyan-400",
    summary:
      "Applying OWASP Top 10 guidelines, network packet inspection, vulnerability proxies, and defense-in-depth principles across web applications and server environments.",
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
        tagline: "Proactive vulnerability assessment and defensive hardening",
        appliedSkills: ["Burp Suite", "OWASP Top 10", "Input Sanitization", "JWT Hardening"],
        highlight:
          "Applied manual and proxy-based intercept testing using Burp Suite to audit for SQL Injection, Cross-Site Scripting (XSS), CSRF, and broken access controls across custom MERN endpoints.",
        liveUrl: "",
        githubUrl: "https://tryhackme.com/p/nikhilxagr",
      },
      {
        slug: "network-recon",
        name: "Network Diagnostics & Threat Modeling Labs",
        tagline: "Port scanning, service enumeration, and protocol packet inspection",
        appliedSkills: ["Nmap", "Wireshark", "Kali Linux", "Metasploit", "TryHackMe"],
        highlight:
          "Executed network surface mapping with Nmap NSE scripts, inspected unencrypted TCP/UDP traffic flows via Wireshark, and completed guided penetration labs on TryHackMe.",
        liveUrl: "",
        githubUrl: "https://tryhackme.com/p/nikhilxagr",
      },
    ],
  },
  {
    id: "core-web-devops",
    number: "05",
    title: "Core Web Standards, DevOps & Cloud Delivery",
    category: "DevOps",
    icon: Terminal,
    headerGradient: "from-teal-500 to-emerald-500",
    badge: "border-emerald-500/30 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400",
    summary:
      "Deep foundational web standards, browser APIs, continuous integration, Linux server environments, and reliable cloud deployments on Vercel and Render.",
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
        name: "Fast Feast & Native Web Utilities",
        tagline: "Production-grade interactive client applications using pure web standards",
        appliedSkills: ["HTML5", "CSS3", "JavaScript", "LocalStorage", "Web APIs"],
        highlight:
          "Built fast, zero-dependency client web utilities including Fast Feast, Notes App, Weather App, and Text-to-Speech using native DOM manipulation and browser APIs.",
        liveUrl: "https://fastfeast-agr.netlify.app/",
        githubUrl: "https://github.com/nikhilxagr/Web-Dev-Projects",
      },
      {
        slug: "cloud-devops",
        name: "Cloud CI/CD & Production Hosting Architecture",
        tagline: "Automated builds, custom domains, SSL certification, and environment secrets",
        appliedSkills: ["Vercel", "Render", "Git", "GitHub", "Linux"],
        highlight:
          "Configured production deployment pipelines across Vercel (frontend SPAs) and Render (backend services) with automated branch previews, zero-downtime updates, and SSL encryption.",
        liveUrl: "",
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
        description="Applied technical capabilities of Nikhil Agrahari: Full-Stack MERN architecture, backend APIs, cybersecurity audits, and AI workflows backed by real-world production projects."
        pathname="/skills"
        image={SITE_PROFILE.profileImage}
        imageAlt="Nikhil Agrahari - Technical Skills & Applied Projects"
        keywords={[
          "Nikhil Agrahari skills",
          "MERN stack projects",
          "WhatsApp clone real time",
          "React Node.js MongoDB developer",
          "Cybersecurity tools Burp Suite Kali Linux",
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Skills", path: "/skills" },
        ])}
      />

      <section className="section-wrap pt-6 pb-28">

        {/* ── Page Header (Matching ServicesPage Layout & Typography) ───── */}
        <FadeInUp>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 mb-5">
              <Code2 size={13} /> Applied Engineering Domains
            </span>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-[1.05]">
              Technical{" "}
              <span className="bg-gradient-to-r from-lime-500 via-emerald-500 to-teal-500 dark:from-lime-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                Capabilities
              </span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
              Every technical skill grounded in production code. Explore each domain to see the technologies used and the exact projects where they were built.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button to="/projects" className="min-w-[190px]">
                <FolderGit2 size={16} /> Explore All Projects
              </Button>
              <Button to="/services" variant="secondary" className="min-w-[160px]">
                <Layers size={16} /> Services &amp; Packages
              </Button>
            </div>
          </div>
        </FadeInUp>

        {/* ── Engineering Architecture Overview Bar ───────────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900/60 p-6 sm:p-8 shadow-xl dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] backdrop-blur-sm mb-16">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            
            <div className="lg:col-span-7 space-y-3">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                // ENGINEERING STANDARDS
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Skills Backed by Real-World Production Code
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                I do not list technologies as isolated badges. Every skill here has been applied in live client or personal systems—from real-time WebSockets and webhook verification to security vulnerability audits.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 p-4">
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">5 Domains</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">Specialization Areas</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Full-stack, APIs, security, AI</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 p-4">
                <p className="text-2xl font-black text-lime-600 dark:text-lime-400">10+ Projects</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">Production Portfolio</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Live demos &amp; public code</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 p-4">
                <p className="text-2xl font-black text-cyan-600 dark:text-cyan-400">OWASP</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">Security Compliant</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Input &amp; token hardening</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 p-4">
                <p className="text-2xl font-black text-teal-600 dark:text-teal-400">Live CI/CD</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">Vercel &amp; Render</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Automated deployments</p>
              </div>
            </div>

          </div>
        </div>

        {/* ── Domain Navigation / Category Filter Tabs ─────────────────── */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Engineering Domains &amp; Project Applications
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                Select a domain to inspect the technologies utilized and their practical implementation across projects.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORY_TABS.map((cat) => {
                const isSelected = activeCategory === cat;
                const count = cat === "All"
                  ? DOMAIN_SECTIONS.length
                  : DOMAIN_SECTIONS.filter((d) => d.category === cat).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={clsx(
                      "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200",
                      isSelected
                        ? "bg-emerald-600 text-white shadow-md dark:bg-emerald-500 dark:shadow-[0_0_16px_rgba(16,185,129,0.4)]"
                        : "border border-slate-300 bg-white text-slate-700 hover:border-emerald-500 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:border-emerald-500/40 dark:hover:text-emerald-400"
                    )}
                  >
                    {cat}
                    <span className={clsx(
                      "rounded-full px-1.5 py-0.5 text-[9px] font-bold",
                      isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        </div>

        {/* ── Complete Domain Cards with Real Project Examples ─────────── */}
        <div className="space-y-12">
          {filteredDomains.map((domain) => {
            const DomainIcon = domain.icon;

            return (
              <article
                key={domain.id}
                className="group relative rounded-3xl border border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-sm shadow-xl dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] transition-all duration-300 overflow-hidden"
              >
                {/* Top Stripe Gradient */}
                <div className={clsx("h-2 w-full bg-gradient-to-r", domain.headerGradient)} />

                <div className="p-6 sm:p-8 lg:p-10">
                  
                  {/* Domain Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800/80">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 shrink-0">
                        <DomainIcon size={24} />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                          Domain {domain.number} // {domain.category}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                          {domain.title}
                        </h3>
                      </div>
                    </div>

                    <span className={clsx(
                      "self-start sm:self-auto rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest",
                      domain.badge
                    )}>
                      {domain.skillsUsed.length} Core Technologies
                    </span>
                  </div>

                  {/* Domain Overview Description */}
                  <p className="mt-5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                    {domain.summary}
                  </p>

                  {/* Skills Applied in This Domain */}
                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-800/30 p-4 sm:p-5">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">
                      Core Technologies &amp; Frameworks in this Domain:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {domain.skillsUsed.map((skill) => (
                        <SkillLogoBadge key={skill} skill={skill} className="!py-1.5 !px-3" />
                      ))}
                    </div>
                  </div>

                  {/* Applied Project Examples Section */}
                  <div className="mt-8">
                    <div className="flex items-center gap-2 mb-4">
                      <FolderGit2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                      <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                        Real-World Implementation in Projects
                      </h4>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      {domain.projectExamples.map((project) => (
                        <div
                          key={project.name}
                          className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition-all duration-200 hover:border-emerald-500/50 hover:shadow-md dark:border-slate-800/90 dark:bg-slate-950/60 dark:hover:border-emerald-500/30 flex flex-col justify-between"
                        >
                          <div>
                            {/* Project Header */}
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <h5 className="text-base font-black text-slate-900 dark:text-white">
                                  {project.name}
                                </h5>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                  {project.tagline}
                                </p>
                              </div>

                              <Link
                                to={`/projects/${project.slug}`}
                                className="shrink-0 p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-500 dark:border-slate-800 dark:text-slate-500 dark:hover:text-emerald-400 transition"
                                title="View Project Details"
                              >
                                <ExternalLink size={14} />
                              </Link>
                            </div>

                            {/* Applied Tech Chips */}
                            <div className="flex flex-wrap gap-1.5 my-3.5">
                              {project.appliedSkills.map((tech) => (
                                <span
                                  key={tech}
                                  className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>

                            {/* Practical Engineering Highlight */}
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                              <span className="font-bold text-emerald-700 dark:text-emerald-400">Application: </span>
                              {project.highlight}
                            </p>
                          </div>

                          {/* Footer Links */}
                          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                            <Link
                              to={`/projects/${project.slug}`}
                              className="font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center gap-1"
                            >
                              Inspect Full Case Study <ArrowRight size={12} />
                            </Link>

                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                              >
                                Live Demo ↗
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </article>
            );
          })}
        </div>

        {/* ── Bottom CTA Banner (Matching Services CTA) ─────────────────── */}
        <div className="mt-24 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/70 dark:border-emerald-500/25 dark:bg-gradient-to-br dark:from-slate-900 dark:to-emerald-950/30 p-8 sm:p-10 text-center shadow-lg dark:shadow-none">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-100 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-5">
            <Globe size={13} /> Ready for Production Work
          </span>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Need Any of These Technical Capabilities Built?
          </h2>

          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Whether you need modern frontend interfaces, reliable REST backend APIs, or security audits, explore my transparent service packages or contact me directly.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button to="/services" className="min-w-[200px]">
              <Layers size={16} /> Explore Services &amp; Rates
            </Button>
            <Button to="/contact" variant="secondary" className="min-w-[180px]">
              <HeartHandshake size={16} /> Contact Nikhil Directly
            </Button>
          </div>
        </div>

      </section>
    </>
  );
};

export default SkillsPage;
