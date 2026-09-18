import {
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  GraduationCap,
  Layers,
  MapPin,
  Server,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Button from "@/components/ui/Button";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import { createBreadcrumbSchema, createPersonSchema } from "@/utils/seo";
import {
  ABOUT_STORY,
  FOCUS_AREAS,
  QUICK_CONTACT,
  SITE_PROFILE,
  STATS_METRICS,
} from "@/constants/siteData";
import { GitHubStreakCard, LeetCodeStatsCard, TryHackMeBadgeCard } from "@/components/ui/StatCardImage";

const aboutIdentityBadges = [
  {
    icon: GraduationCap,
    label: "Education",
    value: "BCA (Third Year) • Babu Banarasi Das University, Lucknow",
  },
  {
    icon: Briefcase,
    label: "Current Role",
    value: "Full Stack Developer Intern • EVOC Labs",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Lucknow, Uttar Pradesh, India",
  },
  {
    icon: ShieldCheck,
    label: "Engineering Mindset",
    value: "Clean execution, reliable data flows, and secure coding habits",
  },
];

const whatIBuildItems = [
  {
    title: "Frontend Product Architecture",
    description:
      "Crafting responsive, intuitive user interfaces with React, modular component structures, and seamless state management for smooth user experiences.",
    icon: Code2,
    tags: ["React", "JavaScript", "Tailwind CSS", "UI/UX Flow"],
  },
  {
    title: "Backend APIs & Server Logic",
    description:
      "Developing maintainable Node.js and Express REST services with structured validation, centralized error handling, and robust routing architecture.",
    icon: Server,
    tags: ["Node.js", "Express.js", "REST APIs", "Middleware"],
  },
  {
    title: "Database Integration & Auth",
    description:
      "Designing data models with MongoDB, managing document lifecycles, and implementing secure token-based authentication and role authorization.",
    icon: Database,
    tags: ["MongoDB", "Mongoose", "JWT Auth", "Data Integrity"],
  },
  {
    title: "Deployment & Production Readiness",
    description:
      "Configuring environment variables, cloud deployments across Vercel and Render, and ensuring cross-environment reliability and fast asset delivery.",
    icon: Layers,
    tags: ["Vercel", "Render", "Git Workflows", "Build Optimization"],
  },
];

const explorationPillars = [
  {
    title: "Cybersecurity & Defensive Habits",
    summary:
      "Hands-on practice through TryHackMe labs, learning common web vulnerability vectors (OWASP Top 10), secure session handling, and defensive implementation practices.",
    icon: ShieldCheck,
  },
  {
    title: "AI Workflows & Integration",
    summary:
      "Exploring practical integration of modern LLM APIs (like Google Gemini) into web tools to automate repetitive developer workflows and enrich user applications.",
    icon: Sparkles,
  },
  {
    title: "System Design & Problem Solving",
    summary:
      "Strengthening algorithmic thinking on LeetCode while studying how distributed components, caching layers, and decoupled services scale under production traffic.",
    icon: Cpu,
  },
];

const AboutPage = () => {
  const githubUsername =
    QUICK_CONTACT.github.split("/").filter(Boolean).pop() || "nikhilxagr";
  const leetcodeUsername =
    QUICK_CONTACT.leetcode.split("/").filter(Boolean).pop() || "nikhilxagr";
  const tryHackMeUsername =
    QUICK_CONTACT.tryhackme.split("/").filter(Boolean).pop() || "nikhilxagr";

  return (
    <>
      <SeoHead
        title="About Nikhil Agrahari | Full Stack Developer & BCA Student"
        description="Learn about Nikhil Agrahari, a 3rd-year BCA student at BBDU Lucknow and Full Stack Developer Intern at EVOC Labs. Discover technical background, full-stack projects, and engineering journey."
        pathname="/about"
        image={SITE_PROFILE.profileImage}
        imageAlt="About Nikhil Agrahari"
        keywords={[
          "about Nikhil Agrahari",
          "Nikhil Agrahari EVOC Labs",
          "BBD University BCA developer",
          "Full Stack Developer Lucknow",
          "MERN stack engineer",
          "EVOC Labs intern",
        ]}
        jsonLd={[
          createPersonSchema(),
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />

      <section className="section-wrap pt-4 sm:pt-6 pb-20">
        
        {/* Page Header */}
        <FadeInUp>
          <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-10">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-wider text-slate-900 dark:text-white drop-shadow-sm">
              PROFILE <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">OVERVIEW</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Who I am, what I am currently building, my engineering internship experience, and the technical direction I am moving toward.
            </p>
          </div>
        </FadeInUp>

        {/* Narrative & Profile Overview Surface */}
        <FadeInUp className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-5 sm:p-8 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(52,211,153,0.12),transparent_34%),radial-gradient(circle_at_86%_84%,rgba(16,185,129,0.12),transparent_40%)]" />

          <div className="relative grid gap-6 lg:grid-cols-12">
            
            {/* Story / Narrative (7 cols) */}
            <article className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/90 p-5 sm:p-7 dark:border-emerald-500/20 dark:bg-[#020803]/80">
              <div>
                <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                  // Who I Am
                </p>
                <h2 className="mt-2 text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Student Builder with a Practical Engineering Mindset
                </h2>

                <div className="mt-4 space-y-3 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    I&apos;m a third-year BCA student and Full Stack Developer focused on building practical, scalable web applications and solving real-world problems through technology.
                  </p>
                  <p>
                    Currently, I&apos;m working as a <strong className="text-slate-900 dark:text-emerald-300 font-bold">Full Stack Developer Intern at EVOC Labs</strong>, gaining hands-on experience building and improving production-oriented applications across frontend and backend systems.
                  </p>
                  <p>
                    My journey has taken me from learning programming fundamentals to engineering full-stack applications, designing RESTful APIs, connecting databases, implementing authentication, and understanding how real-world software is developed and delivered.
                  </p>
                  <p>
                    I enjoy turning ideas into working products — from designing clean interfaces and building APIs to connecting databases and deploying reliable web apps.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Alongside core web engineering, I continuously explore cybersecurity fundamentals, AI-assisted workflows, system design, and algorithmic problem-solving as I grow as a developer.
                  </p>
                </div>
              </div>

              {/* Key Identity Badges */}
              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-emerald-500/15">
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {aboutIdentityBadges.map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <div
                        key={badge.label}
                        className="rounded-xl border border-slate-200 bg-white p-3 text-xs dark:border-emerald-500/15 dark:bg-[#040e07] shadow-sm"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">
                            <Icon size={14} />
                          </span>
                          <div>
                            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              {badge.label}
                            </p>
                            <p className="mt-0.5 text-xs font-bold text-slate-900 dark:text-slate-200 leading-snug">
                              {badge.value}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>

            {/* Profile Snapshot & Quick Action Card (5 cols) */}
            <article className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/90 p-5 sm:p-7 dark:border-emerald-500/20 dark:bg-[#020803]/80">
              <div>
                {SITE_PROFILE.profileImage ? (
                  <div className="mb-4 flex justify-center lg:justify-start">
                    <div className="relative">
                      <div className="h-32 w-32 sm:h-36 sm:w-36 overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-slate-100 shadow-md dark:bg-slate-900">
                        <img
                          src={SITE_PROFILE.profileImage}
                          alt={SITE_PROFILE.profileImageAlt}
                          className="h-full w-full object-cover object-top"
                          width={144}
                          height={144}
                          loading="lazy"
                          decoding="async"
                          fetchPriority="auto"
                        />
                      </div>
                      <span className="absolute -bottom-2 -right-2 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-white px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-400/30 dark:bg-[#030d07] dark:text-emerald-300 shadow-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Intern @ EVOC Labs
                      </span>
                    </div>
                  </div>
                ) : null}

                <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                  Profile Snapshot
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                  {SITE_PROFILE.fullName}
                </h2>
                <p className="mt-1 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                  Third-Year BCA Student • Full Stack Developer Intern at EVOC Labs
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <p>
                    <strong className="text-slate-900 dark:text-white">Email:</strong>{" "}
                    <a href={`mailto:${QUICK_CONTACT.email}`} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      {QUICK_CONTACT.email}
                    </a>
                  </p>
                  <p>
                    <strong className="text-slate-900 dark:text-white">University:</strong> Babu Banarasi Das University, Lucknow
                  </p>
                  <p>
                    <strong className="text-slate-900 dark:text-white">Status:</strong> Open to engineering discussions, collaborative building, and mentorship.
                  </p>
                </div>

                {/* Quick Metric Badges */}
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {STATS_METRICS.slice(0, 4).map((metric) => (
                    <a
                      key={metric.id}
                      href={metric.link}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-slate-200 bg-white p-2.5 text-center dark:border-emerald-500/15 dark:bg-[#040e07] hover:border-emerald-400 transition shadow-sm"
                    >
                      <p className="font-outfit text-base font-black text-emerald-600 dark:text-emerald-400">
                        {metric.value}
                      </p>
                      <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                        {metric.label}
                      </p>
                      <p className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400">
                        {metric.detail}
                      </p>
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-emerald-500/15 flex flex-wrap gap-2">
                <Button to="/projects">
                  View Projects <ArrowRight size={15} />
                </Button>
                <Button to="/contact" variant="ghost">
                  Contact Me
                </Button>
                <Button
                  href={QUICK_CONTACT.resume}
                  target="_blank"
                  rel="noreferrer"
                  variant="secondary"
                >
                  Resume
                </Button>
              </div>
            </article>

          </div>
        </FadeInUp>

        {/* Experience & Education Section */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          
          {/* Experience Card */}
          <FadeInUp delay={0.08} className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-7 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90">
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                  // Experience
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Internship
                </span>
              </div>

              <div className="mt-4 flex items-start gap-3.5">
                <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                    Full Stack Developer Intern
                  </h3>
                  <p className="mt-0.5 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    EVOC Labs
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={13} />
                      15 September 2026 – 15 January 2027
                    </span>
                    <span>•</span>
                    <span>4 Months</span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                Gaining hands-on experience building and improving production-oriented applications across frontend and backend systems. Working in a real engineering environment to develop practical full-stack capabilities, understand application lifecycles, and contribute toward reliable software delivery.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-emerald-500/15">
              <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Key Focus & Hands-on Practice
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[
                  "Full Stack Development",
                  "Frontend & Backend Workflows",
                  "API Design & Integration",
                  "Database Connectivity",
                  "Production Engineering Habits",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:border-emerald-500/20 dark:bg-[#020803]/80 dark:text-emerald-200"
                  >
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </FadeInUp>

          {/* Education Card */}
          <FadeInUp delay={0.12} className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-7 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90">
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                  // Education
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 dark:border-emerald-500/20 dark:bg-[#020803]/80 dark:text-slate-300">
                  Undergraduate
                </span>
              </div>

              <div className="mt-4 flex items-start gap-3.5">
                <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                    Bachelor of Computer Applications (BCA)
                  </h3>
                  <p className="mt-0.5 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    Babu Banarasi Das University, Lucknow
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={13} />
                      Current Status: Third Year
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} />
                      Lucknow, UP
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                Pursuing formal academic grounding in computer applications, data structures, algorithms, database management systems, and software engineering methodologies, supplemented by independent full-stack project building and practical engineering internships.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-emerald-500/15">
              <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Core Academic Foundations
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[
                  "Computer Science Fundamentals",
                  "Object-Oriented Programming",
                  "Data Structures & Algorithms",
                  "Database Management (DBMS)",
                  "Software Engineering Principles",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:border-emerald-500/20 dark:bg-[#020803]/80 dark:text-emerald-200"
                  >
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </FadeInUp>

        </div>

        {/* What I Build Section */}
        <div className="mt-8">
          <FadeInUp delay={0.14} className="rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90">
            <div className="max-w-2xl">
              <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                // What I Build
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Engineering Practical, Production-Oriented Products
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                From responsive client interfaces to secure backend APIs and cloud deployment pipelines, I build end-to-end applications designed to be usable, maintainable, and reliable.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {whatIBuildItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/90 p-4 sm:p-5 dark:border-emerald-500/20 dark:bg-[#020803]/80 shadow-sm"
                  >
                    <div>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300 mb-3">
                        <Icon size={20} />
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-emerald-500/15 flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-white dark:bg-[#040e07] border border-slate-200 dark:border-emerald-500/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </FadeInUp>
        </div>

        {/* What I'm Exploring & Direction */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          
          {/* Exploring Pillars */}
          <FadeInUp delay={0.16} className="rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90">
            <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              // What I&apos;m Exploring
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
              Current Learning & Exploration
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Software engineering is constantly evolving. Alongside daily development, I allocate focused time to explore complementary engineering domains:
            </p>

            <div className="mt-5 space-y-3">
              {explorationPillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4 dark:border-emerald-500/20 dark:bg-[#020803]/80 shadow-sm"
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">
                        <Icon size={18} />
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {pillar.title}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                          {pillar.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </FadeInUp>

          {/* Direction & Focus Areas */}
          <FadeInUp delay={0.2} className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90">
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                // Where I&apos;m Heading
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                Technical Direction
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                My immediate goal is to deepen full-stack engineering practices, learn from real engineering teams, and deliver robust software.
              </p>

              <div className="mt-5 space-y-2.5">
                {[
                  "Gain deep production experience during my EVOC Labs internship.",
                  "Refine API scalability, caching, and database indexing strategies.",
                  "Adopt defensive coding habits across every full-stack layer.",
                  "Build practical portfolio solutions demonstrating real engineering depth.",
                ].map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm font-medium text-slate-800 dark:border-emerald-500/15 dark:bg-[#020803]/80 dark:text-slate-200 shadow-sm"
                  >
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-emerald-500/15">
              <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Core Competency Areas
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {FOCUS_AREAS.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 dark:border-emerald-500/15 dark:bg-[#040e07] dark:text-slate-200 shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </FadeInUp>

        </div>

        {/* Coding Consistency Showcase (Preserved) */}
        <div className="mt-8">
          <FadeInUp className="rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90">
            <div className="text-center mb-6">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Coding Consistency Showcase
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                Live GitHub, LeetCode, and TryHackMe platform statistics demonstrating daily discipline and continuous learning.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <GitHubStreakCard username={githubUsername} profileUrl={QUICK_CONTACT.github} />
              <LeetCodeStatsCard username={leetcodeUsername} profileUrl={QUICK_CONTACT.leetcode} />
              <TryHackMeBadgeCard username={tryHackMeUsername} profileUrl={QUICK_CONTACT.tryhackme} />
            </div>
          </FadeInUp>
        </div>

        {/* Closing CTA */}
        <div className="mt-8">
          <FadeInUp className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 p-6 sm:p-10 text-center shadow-xl dark:border-emerald-500/30 dark:from-[#030d07]/90 dark:via-[#020a04]/90 dark:to-[#04140a]/90">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
              Interested in My Work or Building Together?
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
              Whether you want to explore my open-source projects, discuss engineering opportunities, or connect regarding tech and collaboration, feel free to reach out.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button to="/projects">
                Explore Projects <ArrowRight size={16} />
              </Button>
              <Button to="/contact" variant="ghost">
                Get In Touch
              </Button>
              <Button
                href={QUICK_CONTACT.resume}
                target="_blank"
                rel="noreferrer"
                variant="secondary"
              >
                Download Resume
              </Button>
            </div>
          </FadeInUp>
        </div>

      </section>
    </>
  );
};

export default AboutPage;