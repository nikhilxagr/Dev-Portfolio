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
  Globe,
  HeartHandshake,
  FolderGit2,
} from "lucide-react";
import { Link } from "react-router-dom";
import clsx from "clsx";
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
import WorkflowSimulator from "@/components/ui/WorkflowSimulator";
import Button from "@/components/ui/Button";

const currentChapter = [
  {
    type: "Education",
    icon: GraduationCap,
    logo: "/images/about/bbdu.png",
    logoAlt: "Babu Banarasi Das University logo",
    shortTitle: "BCA (3rd Year)",
    title: "Bachelor of Computer Applications",
    organization: "Babu Banarasi Das University",
    meta: "2024 to Present · Lucknow, Uttar Pradesh",
    description: "Core academic grounding in computer applications, data structures, algorithms, DBMS, and modern software engineering methodologies.",
    status: "In Progress",
    accent: "emerald",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    type: "Specialization",
    icon: Layers,
    logo: "/images/about/react.svg",
    logoAlt: "React and MERN Stack logo",
    logoGlow: "drop-shadow-[0_0_8px_rgba(97,218,251,0.5)]",
    shortTitle: "Full Stack & MERN",
    title: "Web Architecture & API Systems",
    organization: "Hands-on Project Development",
    meta: "React · Node.js · Express · MongoDB · Socket.IO",
    description: "Building production-ready web products with responsive client architectures, RESTful API design, token auth, and scalable MongoDB models.",
    status: "Active Practice",
    accent: "cyan",
    gradient: "from-cyan-500 to-blue-500",
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
    accent: "lime",
    gradient: "from-lime-500 to-emerald-500",
  },
];

const focusAreas = [
  {
    label: "Full-Stack Web Development",
    number: "01",
    accent: "emerald",
    gradient: "from-emerald-500 to-teal-500",
    tagline: "End-to-end web products with modern UX & reliable APIs",
    description: "Engineering complete web systems from responsive React/Next interfaces to event-driven WebSockets and secure Express REST controllers.",
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
    number: "02",
    accent: "cyan",
    gradient: "from-cyan-500 to-blue-500",
    tagline: "Defense-in-depth mindset across application layers",
    description: "Applying proactive security testing, input sanitization, and OWASP Top 10 guidelines across production web applications and server environments.",
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

      <main className="relative min-h-screen w-full overflow-hidden pt-6 pb-28 sm:pt-8">
        <div className="section-wrap space-y-20 sm:space-y-24">
          
          {/* ── Top Header Hero Banner (Matching Services & Skills Pages) ── */}
          <FadeInUp>
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 mb-5">
                <Code2 size={13} /> Engineering Identity &amp; Background
              </span>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-[1.05]">
                About &amp;{" "}
                <span className="bg-gradient-to-r from-lime-500 via-emerald-500 to-teal-500 dark:from-lime-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  Background
                </span>
              </h1>

              <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
                Third-year BCA student at Babu Banarasi Das University, Lucknow &amp; Full-Stack Developer specializing in MERN architectures, real-time communications, and application security.
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Button href={QUICK_CONTACT.resume} target="_blank" rel="noopener noreferrer" className="min-w-[180px]">
                  <Download size={15} /> View Resume
                </Button>
                <Button to="/projects" variant="secondary" className="min-w-[170px]">
                  <FolderGit2 size={15} /> Explore Projects
                </Button>
                <Button to="/contact" variant="ghost" className="min-w-[150px]">
                  <HeartHandshake size={15} /> Get in Touch
                </Button>
              </div>
            </div>
          </FadeInUp>

          {/* ── Section 1: Hero Bio Card ───────────────────────────────── */}
          <FadeInUp>
            <article className="relative rounded-3xl border border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-sm shadow-xl dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] overflow-hidden">
              {/* Top Stripe Gradient */}
              <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

              <div className="p-6 sm:p-8 lg:p-10">
                <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                  
                  {/* Left Narrative (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                      // ENGINEERING PROFILE
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-[1.05]">
                      Nikhil Agrahari
                    </h2>
                    <p className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-cyan-400">
                      Full-Stack Developer · Cybersecurity Practitioner
                    </p>

                    <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                      I&apos;m a{" "}
                      <span className="font-bold text-slate-900 dark:text-white">
                        third-year BCA student at Babu Banarasi Das University, Lucknow
                      </span>{" "}
                      and a Full-Stack Developer actively seeking internship and junior engineering opportunities to build and ship production software.
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
                      My development focuses on end-to-end web products: from responsive React and Next.js client architectures to robust Express REST APIs, real-time Socket.IO WebSockets, and secure MongoDB data modeling.
                    </p>

                    {/* Skill Tags Grid */}
                    <div className="pt-2 flex flex-wrap gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {[
                        "Full Stack",
                        "React 19",
                        "Node.js",
                        "Express",
                        "MongoDB",
                        "Socket.IO",
                        "Python",
                        "OWASP",
                        "TryHackMe Top 1%",
                      ].map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="pt-4 flex flex-wrap gap-3 items-center">
                      <Link
                        to="/journey"
                        className="inline-flex items-center gap-1.5 font-bold text-xs text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition"
                      >
                        Read Engineering Journey <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>

                  {/* Right Status Card (5 cols) */}
                  <aside
                    aria-label="Current role"
                    className="lg:col-span-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-800/40 space-y-4"
                  >
                    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-900 shadow-md">
                      <img
                        src={SITE_PROFILE.profileImage}
                        alt={SITE_PROFILE.profileImageAlt}
                        className="h-60 sm:h-72 w-full object-cover object-top transition-transform duration-500 hover:scale-[1.03]"
                        width={380}
                        height={288}
                        loading="eager"
                        decoding="async"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                          // STATUS
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          Open to Opportunities
                        </span>
                      </div>

                      <h3 className="font-display text-base font-black text-slate-900 dark:text-white leading-tight">
                        Full Stack Developer Roles
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        Babu Banarasi Das University, Lucknow
                      </p>

                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex flex-col gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-2">
                          <Calendar size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                          Available Immediately
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                          Remote / Hybrid / On-site
                        </span>
                      </div>
                    </div>
                  </aside>

                </div>
              </div>
            </article>
          </FadeInUp>

          {/* ── Section 2: Current Chapter ─────────────────────────────── */}
          <FadeInUp delay={0.06}>
            <section aria-labelledby="current-chapter-title">
              <div className="mb-8">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                  // ACADEMIC &amp; CAREER STATUS
                </span>
                <h2
                  id="current-chapter-title"
                  className="font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white mt-1"
                >
                  Current Chapter
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Education · Technical Specialization · Career Availability
                </p>
                <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {currentChapter.map((item, index) => {
                  const ItemIcon = item.icon;

                  return (
                    <article
                      key={item.type}
                      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900/60 p-6 sm:p-7 shadow-lg dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] transition-all duration-300 hover:border-emerald-500/50 dark:hover:border-emerald-400/40"
                    >
                      {/* Top Stripe Gradient */}
                      <div className={clsx("h-1.5 w-full rounded-t-2xl absolute inset-x-0 top-0 bg-gradient-to-r", item.gradient)} />

                      <div>
                        {/* Type & Index Header */}
                        <div className="flex items-center justify-between gap-4 mt-2">
                          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                            {item.type}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                            0{index + 1}
                          </span>
                        </div>

                        {/* Emblem Container */}
                        <div className="mt-5 flex h-14 w-20 sm:h-16 sm:w-24 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2 shadow-sm dark:border-slate-800 dark:bg-slate-800/40">
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
                              <ItemIcon size={26} />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="mt-5">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {item.shortTitle}
                          </span>
                          <h3 className="font-display text-lg font-black text-slate-900 dark:text-white leading-tight mt-0.5">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {item.organization}
                          </p>
                          <p className="mt-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                            {item.meta}
                          </p>
                          <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Footer Status */}
                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider">
                        <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {item.status}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </FadeInUp>

          {/* ── Section 3: What I Build ────────────────────────────────── */}
          <FadeInUp delay={0.1}>
            <section aria-labelledby="what-i-build-title">
              <div className="mb-8">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                  // CORE SPECIALIZATIONS
                </span>
                <h2
                  id="what-i-build-title"
                  className="font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white mt-1"
                >
                  What I Build
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Applied Full-Stack Web Engineering &amp; Defensive Security Systems
                </p>
                <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {focusAreas.map((area) => (
                  <article
                    key={area.label}
                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900/60 p-6 sm:p-8 shadow-lg dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] transition-all duration-300 hover:border-emerald-500/50 dark:hover:border-emerald-400/40"
                  >
                    {/* Top Stripe Gradient */}
                    <div className={clsx("h-1.5 w-full rounded-t-2xl absolute inset-x-0 top-0 bg-gradient-to-r", area.gradient)} />

                    <div>
                      <div className="flex items-start justify-between gap-4 mt-2">
                        <div>
                          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                            Domain {area.number}
                          </span>
                          <h3 className="font-display text-xl font-black text-slate-900 dark:text-white leading-tight mt-1">
                            {area.label}
                          </h3>
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                          {area.number}
                        </span>
                      </div>

                      <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                        {area.tagline}
                      </p>

                      <ul className="mt-6 space-y-3">
                        {area.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                          >
                            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-7 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Link
                        to={area.linkTo}
                        className="inline-flex items-center gap-1.5 font-bold text-xs text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition"
                      >
                        {area.linkText} <ArrowRight size={13} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </FadeInUp>

          {/* ── Section 4: How I Work (Interactive Simulated Workflow) ─── */}
          <FadeInUp delay={0.14}>
            <section aria-labelledby="workflow-title">
              <div className="mb-8">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                  // METHODOLOGY &amp; WORKFLOW
                </span>
                <h2
                  id="workflow-title"
                  className="font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white mt-1"
                >
                  HOW I{" "}
                  <span className="bg-gradient-to-r from-lime-500 via-emerald-500 to-teal-500 dark:from-lime-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                    WORK
                  </span>
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  A practical path from problem to product — simulated step by step with smooth auto-progression.
                </p>
                <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
              </div>

              <WorkflowSimulator />
            </section>
          </FadeInUp>

          {/* ── Section 5: Consistency in Practice ─────────────────────── */}
          <FadeInUp delay={0.16}>
            <section aria-labelledby="consistency-title">
              <div className="mb-8">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                  // PROVABLE COMMITMENT
                </span>
                <h2
                  id="consistency-title"
                  className="font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white mt-1"
                >
                  Consistency in Practice
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Live GitHub activity · LeetCode algorithms · TryHackMe labs
                </p>
                <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
              </div>

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

          {/* ── Section 6: Closing CTA Banner (Matching Services CTA) ──── */}
          <FadeInUp delay={0.18}>
            <section
              aria-labelledby="about-cta-title"
              className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/70 dark:border-emerald-500/25 dark:bg-gradient-to-br dark:from-slate-900 dark:to-emerald-950/30 p-8 sm:p-12 text-center shadow-lg dark:shadow-none"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-100 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-5">
                <Globe size={13} /> Ready for Collaboration
              </span>

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
                <Button to="/contact" className="min-w-[190px]">
                  <HeartHandshake size={15} /> Get in Touch
                </Button>
                <Button href={QUICK_CONTACT.resume} target="_blank" rel="noopener noreferrer" variant="secondary" className="min-w-[170px]">
                  <Download size={15} /> View Resume
                </Button>
                <Button to="/projects" variant="ghost" className="min-w-[170px]">
                  <FolderGit2 size={15} /> Explore Projects
                </Button>
              </div>
            </section>
          </FadeInUp>

        </div>
      </main>
    </>
  );
};

export default AboutPage;