import {
  ArrowRight,
  ArrowUpRight,
  Download,
  GraduationCap,
  Briefcase,
  Code2,
  ShieldCheck,
  Layers,
  CheckCircle2,
  MapPin,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import { createBreadcrumbSchema, createPersonSchema } from "@/utils/seo";
import {
  QUICK_CONTACT,
  SITE_PROFILE,
} from "@/constants/siteData";
import {
  GitHubStreakCard,
  LeetCodeStatsCard,
  TryHackMeBadgeCard,
} from "@/components/ui/StatCardImage";

function SectionHeading({ id, title, subtitle }) {
  return (
    <header className="mb-6 sm:mb-8">
      <h2
        id={id}
        className="font-outfit text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl"
      >
        {title}
      </h2>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 sm:text-xs">
        {subtitle}
      </p>
    </header>
  );
}

const currentChapter = [
  {
    type: "Education",
    logo: "/images/about/bbdu.png",
    logoAlt: "Babu Banarasi Das University logo",
    shortTitle: "BCA (3rd Year)",
    title: "Bachelor of Computer Applications",
    organization: "Babu Banarasi Das University",
    meta: "2024 to Present · Lucknow, Uttar Pradesh",
    description: "Core academic grounding in computer applications, data structures, algorithms, DBMS, and modern software engineering methodologies.",
    status: "In Progress",
    accent: "toxic",
  },
  {
    type: "Specialization",
    logo: "/images/about/react.svg",
    logoAlt: "React and MERN Stack logo",
    logoGlow: "drop-shadow-[0_0_8px_rgba(97,218,251,0.5)]",
    shortTitle: "Full Stack & MERN",
    title: "Web Architecture & API Systems",
    organization: "Hands-on Project Development",
    meta: "React · Node.js · Express · MongoDB · Python",
    description: "Building production-ready web products with responsive client architectures, RESTful API design, token auth, and scalable MongoDB models.",
    status: "Active Practice",
    accent: "cyber",
  },
  {
    type: "Career Status",
    icon: Briefcase,
    shortTitle: "Opportunities",
    title: "Full Stack Developer Roles",
    organization: "Open to Internships & Junior Roles",
    meta: "Available Immediately · Remote / Hybrid / On-site",
    description: "Actively seeking full-stack engineering internships and software roles to build and ship impactful production software with engineering teams.",
    status: "Actively Seeking",
    accent: "toxic",
  },
];

const focusAreas = [
  {
    label: "Full-Stack Web Development",
    accent: "toxic",
    tagline: "End-to-end web products with modern UX & reliable APIs",
    items: [
      "React & modern frontend interfaces with responsive, accessible UX",
      "RESTful APIs with Node.js & Express with structured validation",
      "MongoDB database modeling, schema design & Mongoose ORM",
      "JWT-based authentication, protected routes & state management",
    ],
    linkText: "View Full-Stack Projects",
    linkTo: "/projects",
  },
  {
    label: "Defensive Security & Reliability",
    accent: "cyber",
    tagline: "Defense-in-depth mindset across application layers",
    items: [
      "TryHackMe Global Top 1% (275+ rooms solved in recon & exploitation)",
      "OWASP Top 10 vulnerability awareness & defensive coding habits",
      "Network reconnaissance & hands-on labs with Nmap, Burp Suite & Linux",
      "Backend hardening: Helmet.js headers, rate limiting & bcrypt hashing",
    ],
    linkText: "View Security Labs",
    linkTo: "/experiments/security-labs",
  },
];

const workflowSteps = [
  { title: "Understand", detail: "Problem scope, requirements & security constraints" },
  { title: "Architect", detail: "Data models, component tree & API contracts" },
  { title: "Build", detail: "Clean code, responsive UI & modular architecture" },
  { title: "Secure & Test", detail: "Input validation, auth checks & error handling" },
  { title: "Ship", detail: "Deployment to Vercel/Render & live testing" },
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
        description="Learn about Nikhil Agrahari, a 3rd-year BCA student at BBDU Lucknow and aspiring Full Stack Developer actively seeking opportunities. Discover technical background, full-stack projects, and engineering journey."
        pathname="/about"
        image={SITE_PROFILE.profileImage}
        imageAlt="About Nikhil Agrahari"
        keywords={[
          "about Nikhil Agrahari",
          "Nikhil Agrahari portfolio",
          "BBD University BCA developer",
          "Full Stack Developer Lucknow",
          "MERN stack engineer",
          "Full Stack Developer Internships",
        ]}
        jsonLd={[
          createPersonSchema(),
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />

      <main className="relative min-h-screen w-full overflow-hidden pt-6 pb-20 sm:pt-8 sm:pb-24">
        <div className="section-wrap space-y-16 sm:space-y-20 lg:space-y-24">
          
          {/* Section 1: Hero Bio Card */}
          <FadeInUp>
            <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/90 p-6 sm:p-8 lg:p-10 shadow-lg dark:border-emerald-500/25 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/[0.035] via-transparent to-cyan-500/[0.025]" />

              <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
                {/* Left Narrative (8 cols) */}
                <div className="lg:col-span-8 space-y-4">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
                    // About Me
                  </p>
                  <h1 className="font-outfit text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-[1.02]">
                    Nikhil{" "}
                    <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                      Agrahari
                    </span>
                  </h1>
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-cyan-400 sm:text-sm">
                    Full-Stack Developer · Cybersecurity Practitioner
                  </p>

                  <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                    I&apos;m Nikhil Agrahari, a{" "}
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      third-year BCA student at Babu Banarasi Das University, Lucknow
                    </span>{" "}
                    and an{" "}
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      aspiring Full Stack Developer
                    </span>{" "}
                    actively seeking internship and entry-level software engineering opportunities.
                  </p>
                  <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
                    I build practical web applications using React, Node.js, Express, and MongoDB, with a focus on clean interfaces, reliable REST APIs, and defensive, secure database workflows.
                  </p>

                  {/* Skills Tag Pills */}
                  <div className="pt-2 flex flex-wrap gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {[
                      "Full Stack",
                      "React",
                      "Node.js",
                      "MongoDB",
                      "Express",
                      "Python",
                      "Cybersecurity",
                      "TryHackMe Top 1%",
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-slate-200 bg-slate-100/80 px-2.5 py-1 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 flex flex-wrap gap-3 items-center">
                    <a
                      href={QUICK_CONTACT.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors duration-300 shadow-sm"
                    >
                      View Resume
                      <Download size={14} />
                    </a>
                    <Link
                      to="/journey"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/70 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-800 transition-colors duration-300 hover:border-emerald-500/50 hover:text-emerald-600 dark:border-white/10 dark:bg-black/40 dark:text-slate-300 dark:hover:border-emerald-400/50 dark:hover:text-white"
                    >
                      My Journey
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Right Status Aside (4 cols) */}
                <aside
                  aria-label="Current role"
                  className="lg:col-span-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6 dark:border-emerald-500/20 dark:bg-[#020803]/80 space-y-4"
                >
                  <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-emerald-500/30 bg-slate-900 shadow-md">
                    <img
                      src={SITE_PROFILE.profileImage}
                      alt={SITE_PROFILE.profileImageAlt}
                      className="h-56 sm:h-64 w-full object-cover object-top transition-transform duration-500 hover:scale-[1.03]"
                      width={380}
                      height={256}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="space-y-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      // Current Status
                    </p>
                    <p className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse" />
                      Open to Opportunities
                    </p>
                    <h3 className="font-outfit text-xl font-bold leading-tight text-slate-900 dark:text-white">
                      Full Stack Developer Roles
                    </h3>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                      Babu Banarasi Das University, Lucknow
                    </p>
                    <div className="pt-2 border-t border-slate-200 dark:border-emerald-500/15 flex flex-col gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-emerald-500" />
                        Available Immediately
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-emerald-500" />
                        Remote / Hybrid / On-site
                      </span>
                    </div>
                  </div>
                </aside>
              </div>
            </article>
          </FadeInUp>

          {/* Section 2: Current Chapter */}
          <FadeInUp delay={0.06}>
            <section aria-labelledby="current-chapter-title">
              <SectionHeading
                id="current-chapter-title"
                title="Current Chapter"
                subtitle="Education · Specialization · Career Status"
              />

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentChapter.map((item, index) => {
                  const isCyber = item.accent === "cyber";

                  return (
                    <article
                      key={item.type}
                      className={`group relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-2xl border bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 sm:p-7 shadow-sm dark:bg-[#030d07]/90 ${
                        isCyber
                          ? "border-slate-200 hover:border-cyan-400/50 hover:shadow-[0_12px_36px_rgba(6,182,212,0.15)] dark:border-white/10 dark:hover:border-cyan-400/40"
                          : "border-slate-200 hover:border-emerald-500/50 hover:shadow-[0_12px_36px_rgba(34,197,94,0.15)] dark:border-white/10 dark:hover:border-emerald-400/40"
                      }`}
                    >
                      <div
                        className={`absolute inset-x-0 top-0 h-[2px] ${
                          isCyber
                            ? "bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent"
                            : "bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent"
                        }`}
                      />

                      <div>
                        {/* Type & Index Header */}
                        <div className="flex items-center justify-between gap-4">
                          <span
                            className={`font-mono text-[11px] font-bold uppercase tracking-[0.2em] ${
                              isCyber ? "text-cyan-600 dark:text-cyan-400" : "text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {item.type}
                          </span>
                          <span className="font-mono text-xs text-slate-400 dark:text-slate-600">
                            0{index + 1}
                          </span>
                        </div>

                        {/* Brand Logo / Emblem Container */}
                        <div className="mt-6 flex h-14 w-20 sm:h-16 sm:w-24 items-center justify-center rounded-xl border border-slate-200/80 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-zinc-100">
                          {item.logo ? (
                            <img
                              src={item.logo}
                              alt={item.logoAlt}
                              width={80}
                              height={52}
                              loading="lazy"
                              decoding="async"
                              className={`h-full w-full object-contain ${item.logoGlow || ""}`}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              <Briefcase size={26} />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="mt-5">
                          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                            {item.shortTitle}
                          </span>
                          <h3 className="mt-1 font-outfit text-xl font-bold leading-snug text-slate-900 dark:text-white sm:text-2xl">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {item.organization}
                          </p>
                          <p className="mt-2 font-mono text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                            {item.meta}
                          </p>
                          {item.description && (
                            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Footer Status */}
                      <p
                        className={`mt-6 flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-white/[0.06] font-mono text-[10px] font-bold uppercase tracking-[0.16em] ${
                          isCyber ? "text-cyan-600 dark:text-cyan-400" : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isCyber
                              ? "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)] animate-pulse"
                              : "bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"
                          }`}
                        />
                        {item.status}
                      </p>
                    </article>
                  );
                })}
              </div>
            </section>
          </FadeInUp>

          {/* Section 3: What I Build */}
          <FadeInUp delay={0.1}>
            <section aria-labelledby="what-i-build-title">
              <SectionHeading
                id="what-i-build-title"
                title="What I Build"
                subtitle="Applied Full-Stack Engineering · Defensive Security"
              />

              <div className="grid gap-5 lg:grid-cols-2">
                {focusAreas.map((area, index) => {
                  const isCyber = area.accent === "cyber";

                  return (
                    <article
                      key={area.label}
                      className={`relative overflow-hidden rounded-2xl border bg-white p-6 transition-all duration-300 sm:p-7 shadow-sm dark:bg-[#030d07] ${
                        isCyber
                          ? "border-slate-200 hover:border-cyan-400/40 dark:border-white/10 dark:hover:border-cyan-400/30"
                          : "border-slate-200 hover:border-emerald-500/40 dark:border-white/10 dark:hover:border-emerald-400/30"
                      }`}
                    >
                      <div
                        className={`pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl ${
                          isCyber ? "bg-cyan-500/10" : "bg-emerald-500/10"
                        }`}
                      />

                      <div className="relative">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span
                              className={`font-mono text-[10px] font-bold uppercase tracking-widest ${
                                isCyber ? "text-cyan-600 dark:text-cyan-400" : "text-emerald-600 dark:text-emerald-400"
                              }`}
                            >
                              Domain 0{index + 1}
                            </span>
                            <h3 className="mt-1 font-display text-xl font-bold uppercase text-slate-900 dark:text-white">
                              {area.label}
                            </h3>
                          </div>
                          <span
                            className={`font-mono text-xs font-bold ${
                              isCyber ? "text-cyan-600 dark:text-cyan-400" : "text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            0{index + 1}
                          </span>
                        </div>

                        <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                          {area.tagline}
                        </p>

                        <ul className="mt-6 space-y-3">
                          {area.items.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                            >
                              <span
                                className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                                  isCyber ? "bg-cyan-500" : "bg-emerald-500"
                                }`}
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                          <Link
                            to={area.linkTo}
                            className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors ${
                              isCyber
                                ? "text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                                : "text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                            }`}
                          >
                            {area.linkText} <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </FadeInUp>

          {/* Section 4: How I Work (Workflow Steps) */}
          <FadeInUp delay={0.14}>
            <section aria-labelledby="workflow-title">
              <SectionHeading
                id="workflow-title"
                title="How I Work"
                subtitle="A practical path from problem to product"
              />

              <ol className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-5 dark:border-white/10 dark:bg-[#030d07] shadow-sm">
                {workflowSteps.map((step, index) => (
                  <li
                    key={step.title}
                    className={`relative min-w-0 p-5 sm:p-6 ${
                      index > 0 ? "border-t border-slate-200 dark:border-white/10 sm:border-t-0" : ""
                    } ${index % 2 === 1 ? "sm:border-l sm:border-slate-200 dark:sm:border-white/10" : ""} ${
                      index > 1 ? "sm:border-t sm:border-slate-200 dark:sm:border-white/10" : ""
                    } ${
                      index > 0 ? "lg:border-l lg:border-t-0 lg:border-slate-200 dark:lg:border-white/10" : ""
                    } ${index === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}
                  >
                    <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      0{index + 1}
                    </span>
                    <h3 className="mt-4 font-display text-base font-bold uppercase text-slate-900 dark:text-white sm:text-lg">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400 font-medium">
                      {step.detail}
                    </p>
                    {index < workflowSteps.length - 1 ? (
                      <ArrowRight className="absolute -right-2.5 top-7 z-10 hidden h-5 w-5 rounded-full border border-slate-200 bg-white p-1 text-slate-400 dark:border-white/10 dark:bg-[#030d07] dark:text-slate-500 lg:block" />
                    ) : null}
                  </li>
                ))}
              </ol>
            </section>
          </FadeInUp>

          {/* Section 5: Consistency in Practice */}
          <FadeInUp delay={0.16}>
            <section aria-labelledby="consistency-title">
              <SectionHeading
                id="consistency-title"
                title="Consistency in Practice"
                subtitle="GitHub activity · LeetCode algorithms · TryHackMe labs"
              />

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <GitHubStreakCard
                  username={githubUsername}
                  profileUrl={QUICK_CONTACT.github}
                />
                <LeetCodeStatsCard
                  username={leetcodeUsername}
                  profileUrl={QUICK_CONTACT.leetcode}
                />
                <TryHackMeBadgeCard
                  username={tryHackMeUsername}
                  profileUrl={QUICK_CONTACT.tryhackme}
                />
              </div>
            </section>
          </FadeInUp>

          {/* Section 6: Closing CTA */}
          <FadeInUp delay={0.18}>
            <section
              aria-labelledby="about-cta-title"
              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/90 p-8 sm:p-12 text-center shadow-lg dark:border-emerald-500/25 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/[0.08] via-transparent to-transparent" />
              <div className="relative">
                <h2
                  id="about-cta-title"
                  className="font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white"
                >
                  Let&apos;s Build Something Meaningful
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Open to full-stack engineering internships, collaborative software projects, and security-aware web development.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/contact"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors duration-300 shadow-sm"
                  >
                    Get in Touch
                    <ArrowRight size={14} />
                  </Link>
                  <a
                    href={QUICK_CONTACT.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/70 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-800 transition-colors duration-300 hover:border-emerald-500/50 hover:text-emerald-600 dark:border-white/10 dark:bg-black/40 dark:text-slate-300 dark:hover:border-emerald-400/50 dark:hover:text-white"
                  >
                    View Resume
                    <Download size={14} />
                  </a>
                  <Link
                    to="/projects"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/70 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-800 transition-colors duration-300 hover:border-emerald-500/50 hover:text-emerald-600 dark:border-white/10 dark:bg-black/40 dark:text-slate-300 dark:hover:border-emerald-400/50 dark:hover:text-white"
                  >
                    Explore Projects
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </section>
          </FadeInUp>

        </div>
      </main>
    </>
  );
};

export default AboutPage;