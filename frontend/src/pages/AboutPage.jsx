import { motion } from "framer-motion";

const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;
import {
  ArrowRight,
  Download,
  GraduationCap,
  Briefcase,
  Code2,
  Layers,
  CheckCircle2,
  MapPin,
  Calendar,
  HeartHandshake,
  FolderGit2,
} from "lucide-react";
import { Link } from "react-router-dom";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import { createBreadcrumbSchema, createPersonSchema } from "@/utils/seo";
import { QUICK_CONTACT, SITE_PROFILE } from "@/constants/siteData";
import { useSiteContent } from "@/context/SiteContentContext";
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
    description:
      "Core academic coursework in data structures, algorithms, relational and document databases, networking, and software engineering.",
    status: "In Progress",
  },
  {
    type: "Specialization",
    icon: Layers,
    logo: "/images/about/react.svg",
    logoAlt: "React and MERN Stack logo",
    shortTitle: "Full Stack & MERN",
    title: "Web Architecture & API Systems",
    organization: "Independent & Team Builds",
    meta: "React · Node.js · Express · MongoDB · Socket.IO",
    description:
      "Building complete web applications with responsive client interfaces, REST API design, token authentication, and MongoDB schemas.",
    status: "Active Practice",
  },
  {
    type: "Career Status",
    icon: Briefcase,
    shortTitle: "Opportunities",
    title: "Full Stack Developer Roles",
    organization: "Open to Internships & Junior Roles",
    meta: "Available Immediately · Remote / Hybrid / On-site",
    description:
      "Seeking full-stack engineering internships and entry-level developer roles to build and maintain production software with product teams.",
    status: "Actively Seeking",
  },
];

const focusAreas = [
  {
    label: "Full-Stack Web Development",
    number: "01",
    tagline: "End-to-end web products with accessible UI and reliable APIs",
    description:
      "Engineering web systems from responsive React and Next.js interfaces through Express REST controllers and Socket.IO WebSockets.",
    items: [
      "React & Next.js client interfaces with responsive layouts",
      "RESTful APIs in Node.js & Express with explicit input validation",
      "MongoDB schema design, indexing, and aggregation queries",
      "JWT and OAuth authentication with protected role boundaries",
    ],
    linkText: "View Full-Stack Projects",
    linkTo: "/projects",
  },
  {
    label: "Defensive Security & Reliability",
    number: "02",
    tagline: "Defense-in-depth practices across client, API, and deployment layers",
    description:
      "Applying proactive vulnerability assessment, sanitization, and OWASP Top 10 checks across web apps and lab environments.",
    items: [
      "TryHackMe Global Top 1% (275+ rooms completed in recon and web labs)",
      "OWASP Top 10 vulnerability awareness and remediation practices",
      "Network reconnaissance and traffic review with Nmap and Burp Suite",
      "Express hardening: Helmet security headers, rate limiting, and bcrypt",
    ],
    linkText: "View Security Labs",
    linkTo: "/experiments/security-labs",
  },
];

const AboutPage = () => {
  const { profile, about, contact } = useSiteContent();
  const activeProfileImage = profile?.profileImage || SITE_PROFILE.profileImage;
  const activeResumeUrl = profile?.resumeFullStack || QUICK_CONTACT.resume;
  const githubUsername =
    (contact?.github || QUICK_CONTACT.github).split("/").filter(Boolean).pop() || "nikhilxagr";
  const leetcodeUsername =
    (contact?.leetcode || QUICK_CONTACT.leetcode).split("/").filter(Boolean).pop() || "nikhilxagr";
  const tryHackMeUsername =
    (contact?.tryhackme || QUICK_CONTACT.tryhackme).split("/").filter(Boolean).pop() || "nikhilxagr";

  return (
    <>
      <SeoHead
        title="About Nikhil Agrahari | Full Stack Developer & BCA Student"
        description="Learn about Nikhil Agrahari, a 3rd-year BCA student at BBDU Lucknow and Full Stack Developer seeking opportunities. Technical background, projects, and engineering workflow."
        pathname="/about"
        image={SITE_PROFILE.profileImage}
        imageAlt="About Nikhil Agrahari"
        keywords={[
          "about Nikhil Agrahari",
          "Nikhil Agrahari portfolio",
          "BBD University BCA developer",
          "Full Stack Developer Lucknow",
          "MERN stack engineer",
        ]}
        jsonLd={[
          createPersonSchema(),
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />

      <main className="relative min-h-screen w-full overflow-hidden">
        <div className="section-wrap pt-6 sm:pt-8 pb-24 space-y-20 sm:space-y-24">
          {/* Hero Header */}
          <div className="mx-auto max-w-3xl text-center">
            <MotionDiv
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-500/[0.08] px-4 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400">
                <Code2 size={14} strokeWidth={1.5} /> {about?.heroBadge || "Engineering Identity & Background"}
              </span>
            </MotionDiv>

            <MotionH1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-3xl font-semibold tracking-[-0.02em] leading-[1.08] text-slate-900 sm:text-4xl lg:text-5xl dark:text-[#eef0f5]"
            >
              {about?.heroHeadline || "About &"}{" "}
              <span className="text-emerald-600 dark:text-emerald-400">{about?.heroAccent || "Background"}</span>
            </MotionH1>

            <MotionP
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-[#a3a9b8]"
            >
              {about?.heroBio || "Third-year BCA student at Babu Banarasi Das University, Lucknow and Full-Stack Developer focused on MERN architectures, real-time messaging, and application security."}
            </MotionP>

            <MotionDiv
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 flex flex-wrap items-center justify-center gap-3"
            >
              <Button href={activeResumeUrl} target="_blank" rel="noopener noreferrer" className="min-w-[170px]">
                <Download size={16} strokeWidth={1.5} /> View Resume
              </Button>
              <Button to="/projects" variant="secondary" className="min-w-[170px]">
                <FolderGit2 size={16} strokeWidth={1.5} /> Explore Projects
              </Button>
              <Button to="/contact" variant="ghost" className="min-w-[150px]">
                <HeartHandshake size={16} strokeWidth={1.5} /> Get in Touch
              </Button>
            </MotionDiv>
          </div>

          {/* Section 1: Hero Bio Card */}
          <FadeInUp>
            <article className="rounded-2xl border border-black/[0.08] bg-white p-6 sm:p-8 lg:p-10 dark:border-white/[0.08] dark:bg-[#11141c]">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                {/* Left Narrative */}
                <div className="space-y-4 lg:col-span-7">
                  <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    Engineering Profile
                  </p>
                  <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] leading-[1.1] text-slate-900 sm:text-4xl dark:text-[#eef0f5]">
                    {profile?.fullName || "Nikhil Agrahari"}
                  </h2>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    {profile?.roleTitle || "Full-Stack Developer & Security Researcher"}
                  </p>

                  <p className="text-sm leading-relaxed text-slate-700 sm:text-base dark:text-[#d1d5df]">
                    I am a{" "}
                    <span className="font-medium text-slate-900 dark:text-[#eef0f5]">
                      third-year BCA student at Babu Banarasi Das University, Lucknow
                    </span>{" "}
                    and a Full-Stack Developer seeking software engineering internships and junior roles where I can contribute to production software.
                  </p>
                  <p className="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-[#a3a9b8]">
                    My work spans end-to-end web products: responsive React and Next.js client applications paired with Express REST APIs, real-time Socket.IO WebSockets, and MongoDB data modeling.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
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
                        className="rounded-md border border-black/[0.08] bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3">
                    <Link
                      to="/journey"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 transition-colors duration-150 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                      Read Engineering Journey
                      <ArrowRight size={15} strokeWidth={1.5} />
                    </Link>
                  </div>
                </div>

                {/* Right Profile Status Card */}
                <aside
                  aria-label="Current role"
                  className="space-y-4 rounded-xl border border-black/[0.06] bg-slate-50 p-5 sm:p-6 lg:col-span-5 dark:border-white/[0.06] dark:bg-[#1a1e28]"
                >
                  <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-slate-900 dark:border-white/[0.08]">
                    <img
                      src={activeProfileImage}
                      alt={SITE_PROFILE.profileImageAlt}
                      className="h-60 w-full object-cover object-top sm:h-72"
                      width={380}
                      height={288}
                      loading="eager"
                      decoding="async"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                        Status
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                        Open to Opportunities
                      </span>
                    </div>

                    <h3 className="font-display text-base font-semibold leading-tight text-slate-900 dark:text-[#eef0f5]">
                      Full Stack Developer Roles
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-[#a3a9b8]">
                      Babu Banarasi Das University, Lucknow
                    </p>

                    <div className="flex flex-col gap-1.5 border-t border-black/[0.06] pt-3 font-mono text-xs text-slate-600 dark:border-white/[0.08] dark:text-[#a3a9b8]">
                      <span className="flex items-center gap-2">
                        <Calendar size={14} strokeWidth={1.5} className="shrink-0 text-emerald-700 dark:text-emerald-400" />
                        Available Immediately
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin size={14} strokeWidth={1.5} className="shrink-0 text-emerald-700 dark:text-emerald-400" />
                        Remote / Hybrid / On-site
                      </span>
                    </div>
                  </div>
                </aside>
              </div>
            </article>
          </FadeInUp>

          {/* Section 2: Current Chapter */}
          <FadeInUp delay={0.04}>
            <section aria-labelledby="current-chapter-title">
              <div className="mb-8 border-b border-black/[0.08] pb-5 dark:border-white/[0.08]">
                <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  Academic &amp; Career Status
                </p>
                <h2
                  id="current-chapter-title"
                  className="mt-1.5 font-display text-2xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-3xl lg:text-4xl dark:text-[#eef0f5]"
                >
                  Current Chapter
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8]">
                  Education · Technical Specialization · Career Availability
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {currentChapter.map((item, index) => {
                  const ItemIcon = item.icon;

                  return (
                    <article
                      key={item.type}
                      className="flex flex-col justify-between rounded-2xl border border-black/[0.08] bg-white p-6 transition-colors duration-150 hover:border-slate-300 sm:p-7 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-white/[0.16]"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                            {item.type}
                          </span>
                          <span className="font-mono text-xs tabular-nums text-slate-400 dark:text-[#7a8296]">
                            0{index + 1}
                          </span>
                        </div>

                        <div className="mt-5 flex h-14 w-20 items-center justify-center rounded-xl border border-black/[0.08] bg-slate-50 p-2 sm:h-16 sm:w-24 dark:border-white/[0.08] dark:bg-[#1a1e28]">
                          {item.logo ? (
                            <img
                              src={item.logo}
                              alt={item.logoAlt}
                              width={80}
                              height={52}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-lg text-emerald-700 dark:text-emerald-400">
                              <ItemIcon size={24} strokeWidth={1.5} />
                            </div>
                          )}
                        </div>

                        <div className="mt-5">
                          <span className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                            {item.shortTitle}
                          </span>
                          <h3 className="mt-1 font-display text-lg font-semibold leading-tight text-slate-900 dark:text-[#eef0f5]">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-xs font-medium text-slate-700 dark:text-[#d1d5df]">
                            {item.organization}
                          </p>
                          <p className="mt-1 font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                            {item.meta}
                          </p>
                          <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-[#a3a9b8]">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-black/[0.06] pt-4 font-mono text-xs dark:border-white/[0.08]">
                        <span className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                          {item.status}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </FadeInUp>

          {/* Section 3: What I Build */}
          <FadeInUp delay={0.06}>
            <section aria-labelledby="what-i-build-title">
              <div className="mb-8 border-b border-black/[0.08] pb-5 dark:border-white/[0.08]">
                <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  Core Specializations
                </p>
                <h2
                  id="what-i-build-title"
                  className="mt-1.5 font-display text-2xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-3xl lg:text-4xl dark:text-[#eef0f5]"
                >
                  What I Build
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8]">
                  Applied Full-Stack Web Engineering &amp; Defensive Security Systems
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {focusAreas.map((area) => (
                  <article
                    key={area.label}
                    className="flex flex-col justify-between rounded-2xl border border-black/[0.08] bg-white p-6 transition-colors duration-150 hover:border-slate-300 sm:p-8 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-white/[0.16]"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
                            Domain {area.number}
                          </span>
                          <h3 className="mt-1 font-display text-xl font-semibold leading-tight text-slate-900 dark:text-[#eef0f5]">
                            {area.label}
                          </h3>
                        </div>
                        <span className="font-mono text-xs tabular-nums text-slate-400 dark:text-[#7a8296]">
                          {area.number}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8]">
                        {area.tagline}
                      </p>

                      <ul className="mt-6 space-y-3">
                        {area.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-sm leading-relaxed text-slate-700 dark:text-[#d1d5df]"
                          >
                            <CheckCircle2
                              size={16}
                              strokeWidth={1.5}
                              className="mt-0.5 shrink-0 text-emerald-700 dark:text-emerald-400"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-7 border-t border-black/[0.06] pt-4 dark:border-white/[0.08]">
                      <Link
                        to={area.linkTo}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 transition-colors duration-150 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                      >
                        {area.linkText}
                        <ArrowRight size={14} strokeWidth={1.5} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </FadeInUp>

          {/* Section 4: How I Work */}
          <FadeInUp delay={0.08}>
            <section aria-labelledby="workflow-title">
              <div className="mb-8 border-b border-black/[0.08] pb-5 dark:border-white/[0.08]">
                <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  SDLC Engineering Lifecycle
                </p>
                <h2
                  id="workflow-title"
                  className="mt-1.5 font-display text-2xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-3xl lg:text-4xl dark:text-[#eef0f5]"
                >
                  How I <span className="text-emerald-600 dark:text-emerald-400">Work</span>
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8]">
                  A 6-stage Software Development Life Cycle from planning and system design to secure deployment and ongoing maintenance.
                </p>
              </div>

              <WorkflowSimulator />
            </section>
          </FadeInUp>

          {/* Section 5: Consistency in Practice */}
          <FadeInUp delay={0.1}>
            <section aria-labelledby="consistency-title">
              <div className="mb-8 border-b border-black/[0.08] pb-5 dark:border-white/[0.08]">
                <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  Daily Engineering Activity
                </p>
                <h2
                  id="consistency-title"
                  className="mt-1.5 font-display text-2xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-3xl lg:text-4xl dark:text-[#eef0f5]"
                >
                  Consistency in Practice
                </h2>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-[#a3a9b8]">
                  GitHub commits · LeetCode problem solving · TryHackMe security labs
                </p>
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

          {/* Section 6: Closing CTA Card */}
          <FadeInUp delay={0.12}>
            <section
              aria-labelledby="about-cta-title"
              className="rounded-2xl border border-black/[0.08] bg-white p-8 text-center sm:p-12 dark:border-white/[0.08] dark:bg-[#11141c]"
            >
              <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                Open for Collaboration
              </p>

              <h2
                id="about-cta-title"
                className="mt-2 font-display text-2xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-3xl lg:text-4xl dark:text-[#eef0f5]"
              >
                Let&apos;s Build Something Meaningful
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8]">
                Available for full-stack software engineering internships, freelance product delivery, and collaborative security-aware web engineering.
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Button to="/contact" className="min-w-[180px]">
                  <HeartHandshake size={16} strokeWidth={1.5} /> Get in Touch
                </Button>
                <Button href={QUICK_CONTACT.resume} target="_blank" rel="noopener noreferrer" variant="secondary" className="min-w-[160px]">
                  <Download size={16} strokeWidth={1.5} /> View Resume
                </Button>
                <Button to="/projects" variant="ghost" className="min-w-[160px]">
                  <FolderGit2 size={16} strokeWidth={1.5} /> Explore Projects
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
