import { ArrowRight, Code2, Server, ShieldCheck } from "lucide-react";
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
import { useTheme } from "@/context/ThemeContext";
import { GitHubStreakCard, LeetCodeStatsCard, TryHackMeBadgeCard } from "@/components/ui/StatCardImage";

const aboutIdentityPoints = [
  `Education: ${SITE_PROFILE.education}`,
  `Location: ${SITE_PROFILE.location}`,
  "Approach: clean execution, practical learning, and secure implementation habits.",
];

const aboutCapabilities = [
  {
    title: "Frontend Product Experience",
    summary:
      "Build responsive interfaces with React, structured components, and clear user flow.",
    icon: Code2,
  },
  {
    title: "Backend API Development",
    summary:
      "Develop maintainable Node.js and Express APIs with validation and reliable data flow.",
    icon: Server,
  },
  {
    title: "Security-Aware Delivery",
    summary:
      "Apply authorized lab learning and security-first thinking to improve implementation quality.",
    icon: ShieldCheck,
  },
];

const aboutCurrentDirection = [
  "Improve full stack architecture decisions and production readiness.",
  "Strengthen secure coding methodology and implementation quality.",
  "Build portfolio projects that show clear impact and technical depth.",
];

const AboutPage = () => {
  const { isDark } = useTheme();
  const conciseStory = ABOUT_STORY.slice(0, 3);

  const githubUsername =
    QUICK_CONTACT.github.split("/").filter(Boolean).pop() || "nikhilxagr";
  const leetcodeUsername =
    QUICK_CONTACT.leetcode.split("/").filter(Boolean).pop() || "nikhilxagr";
  const tryHackMeUsername =
    QUICK_CONTACT.tryhackme.split("/").filter(Boolean).pop() || "nikhilxagr";
  const tryHackMeMetric = STATS_METRICS.find((item) => item.id === "tryhackme");

  const githubStreakCardUrl = `https://streak-stats.demolab.com/?user=${githubUsername}&theme=${isDark ? "algolia" : "default"}&hide_border=true`;
  const leetcodeCardUrl = `https://leetcard.jacoblin.cool/${leetcodeUsername}?theme=${isDark ? "dark" : "light"}&ext=heatmap`;
  const tryHackMeCardUrl = `https://tryhackme-badges.s3.amazonaws.com/${tryHackMeUsername}.png`;

  return (
    <>
      <SeoHead
        title="About Nikhil Agrahari | Full Stack Developer & BCA Engineer"
        description="Learn about Nikhil Agrahari, Full Stack Developer & BCA Engineer. Discover technical background, MERN stack expertise, and security skills."
        pathname="/about"
        image={SITE_PROFILE.profileImage}
        imageAlt="About Nikhil Agrahari"
        keywords={[
          "about Nikhil Agrahari",
          "BBD University developer",
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

      {/* Main Section */}
      <section className="section-wrap pt-4 sm:pt-6 pb-20">
        
        {/* Centered Minimal Hero Header */}
        <FadeInUp>
          <div className="text-center max-w-4xl mx-auto mb-8">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-wider text-slate-900 dark:text-white drop-shadow-sm">
              PROFILE <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">OVERVIEW</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Overview of my background, technical capabilities, and current learning priorities.
            </p>
          </div>
        </FadeInUp>

        {/* Outer Surface Container */}
        <FadeInUp className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-5 sm:p-8 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(52,211,153,0.12),transparent_34%),radial-gradient(circle_at_86%_84%,rgba(16,185,129,0.12),transparent_40%)]" />

          <div className="relative grid gap-5 lg:grid-cols-2">
            
            {/* Who I Am Article */}
            <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/90 p-5 sm:p-7 dark:border-emerald-500/20 dark:bg-[#020803]/80">
              <div className="pointer-events-none absolute -top-14 -right-10 h-32 w-32 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 blur-3xl" />

              <div className="relative">
                <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                  // Who I Am
                </p>
                <h2 className="mt-2 text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Student Builder with a Product Engineering Mindset
                </h2>

                <div className="mt-4 space-y-3 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                  {conciseStory.map((paragraph, index) => (
                    <p
                      key={paragraph}
                      className={
                        index === 0 ? "text-sm sm:text-base font-bold text-slate-900 dark:text-white" : ""
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <ul className="mt-5 space-y-2">
                  {aboutIdentityPoints.map((point) => (
                    <li
                      key={point}
                      className="rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm font-medium text-slate-800 dark:border-emerald-500/20 dark:bg-[#040e07] dark:text-emerald-200 shadow-sm"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            {/* What I Can Do Article */}
            <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/90 p-5 sm:p-7 dark:border-emerald-500/20 dark:bg-[#020803]/80">
              <div className="pointer-events-none absolute -bottom-16 -left-14 h-36 w-36 rounded-full bg-teal-500/10 dark:bg-teal-400/10 blur-3xl" />

              <div className="relative">
                <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                  // What I Can Do
                </p>
                <h2 className="mt-2 text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Build, Improve, and Support with Practical Focus
                </h2>

                <div className="mt-4 space-y-3">
                  {aboutCapabilities.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-emerald-500/20 dark:bg-[#040e07]"
                      >
                        <div className="flex items-start gap-3">
                          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">
                            <Icon size={17} />
                          </span>

                          <div>
                            <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                              {item.summary}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <p className="text-xs font-mono font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
                    Best Fit
                  </p>
                  <p className="mt-1 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                    Students, founders, and small teams who need practical web product delivery and clear technical guidance.
                  </p>
                </div>
              </div>
            </article>
          </div>

          <div className="relative mt-6 flex flex-wrap justify-center gap-3 sm:mt-7 sm:justify-start">
            <Button to="/projects">
              View Projects <ArrowRight size={16} />
            </Button>
            <Button to="/contact" variant="ghost">
              Work With Me
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
        </FadeInUp>

        {/* Current Direction & Profile Snapshot Grid */}
        <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          
          {/* Current Direction Card */}
          <FadeInUp delay={0.1} className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Current Direction
            </h2>

            <div className="mt-4 space-y-2.5">
              {aboutCurrentDirection.map((point) => (
                <p
                  key={point}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm font-medium text-slate-800 dark:border-emerald-500/20 dark:bg-[#020803]/80 dark:text-slate-200"
                >
                  {point}
                </p>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-emerald-500/20 dark:bg-[#020803]/80">
              <p className="text-xs font-mono font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
                Focus Areas
              </p>

              <ul className="mt-3 grid gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 sm:grid-cols-2">
                {FOCUS_AREAS.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 dark:border-emerald-500/15 dark:bg-[#040e07] dark:text-slate-200 shadow-sm"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeInUp>

          {/* Profile Snapshot Card */}
          <FadeInUp delay={0.14} className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90">
            {SITE_PROFILE.profileImage ? (
              <div className="mb-5 flex justify-center">
                <div className="h-44 w-44 sm:h-48 sm:w-48 overflow-hidden rounded-full border-4 border-emerald-500/40 bg-slate-100 shadow-lg dark:bg-slate-900">
                  <img
                    src={SITE_PROFILE.profileImage}
                    alt={SITE_PROFILE.profileImageAlt}
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : null}

            <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              Profile Snapshot
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
              {SITE_PROFILE.fullName}
            </h2>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
              {SITE_PROFILE.headline}
            </p>

            <div className="mt-4 space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <p>
                <strong className="text-slate-900 dark:text-white">Email:</strong>{" "}
                {QUICK_CONTACT.email}
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white">Availability:</strong>{" "}
                {SITE_PROFILE.availability}
              </p>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {STATS_METRICS.map((metric) => (
                <a
                  key={metric.id}
                  href={metric.link}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-emerald-500/20 dark:bg-[#020803]/80 hover:border-emerald-400 transition shadow-sm"
                >
                  <p className="font-outfit text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {metric.value}
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-slate-900 dark:text-white">
                    {metric.label}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    {metric.detail}
                  </p>
                </a>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                href={QUICK_CONTACT.resume}
                target="_blank"
                rel="noreferrer"
              >
                Resume
              </Button>
              <Button
                href={QUICK_CONTACT.linkedin}
                target="_blank"
                rel="noreferrer"
                variant="ghost"
              >
                LinkedIn
              </Button>
              <Button to="/contact" variant="secondary">
                Contact
              </Button>
            </div>
          </FadeInUp>
        </div>

        {/* Coding Consistency Showcase */}
        <div className="mt-10">
          <FadeInUp className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90">
            <div className="text-center mb-6">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Coding Consistency Showcase
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                Live GitHub, LeetCode, and TryHackMe platform statistics.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <GitHubStreakCard username={githubUsername} profileUrl={QUICK_CONTACT.github} />
              <LeetCodeStatsCard username={leetcodeUsername} profileUrl={QUICK_CONTACT.leetcode} />
              <TryHackMeBadgeCard username={tryHackMeUsername} profileUrl={QUICK_CONTACT.tryhackme} />
            </div>
          </FadeInUp>
        </div>

      </section>
    </>
  );
};

export default AboutPage;
