import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  Code2,
  Layers,
  ShieldCheck,
  Sparkles,
  TimerReset,
} from "lucide-react";
import Button from "@/components/ui/Button";
import FadeInUp from "@/components/animations/FadeInUp";
import SectionTitle from "@/components/ui/SectionTitle";
import SkillMatrix from "@/components/ui/SkillMatrix";
import { useTheme } from "@/context/ThemeContext";
import {
  ETHICAL_HACKING_TOOL_CARDS,
  MAIN_SKILL_SHOWCASE,
  QUICK_CONTACT,
  SITE_PROFILE,
  SKILL_EXPERTISE_TRACKS,
} from "@/constants/siteData";

const trackIconMap = {
  "Full Stack Developer": Code2,
  "Backend Engineer": Layers,
  "Cyber Security Analyst": ShieldCheck,
  "Ethical Hacker": Sparkles,
  "Penetration Tester": TimerReset,
};

const showcaseAccentMap = {
  "SOC Analyst with AI":
    "border-emerald-300/40 bg-emerald-300/10 text-emerald-100",
  "Web Development": "border-violet-300/40 bg-violet-300/10 text-violet-100",
  "Coding Languages and Frameworks":
    "border-cyan-300/40 bg-cyan-300/10 text-cyan-100",
};

const SkillsPage = () => {
  const { isDark } = useTheme();

  const topSkillHighlights = [
    {
      id: "tracks",
      label: "Expertise Tracks",
      value: SKILL_EXPERTISE_TRACKS.length,
      Icon: Layers,
    },
    {
      id: "tool-categories",
      label: "Tool Categories",
      value: ETHICAL_HACKING_TOOL_CARDS.length,
      Icon: ShieldCheck,
    },
    {
      id: "main-pillars",
      label: "Main Pillars",
      value: MAIN_SKILL_SHOWCASE.length,
      Icon: Sparkles,
    },
  ];

  const topSkillTags = [
    "Full Stack Delivery",
    "Backend APIs",
    "Security Labs",
    "Clean UI Engineering",
  ];

  return (
    <>
      <Helmet>
        <title>Skills | Nikhil Portfolio</title>
        <meta
          name="description"
          content="Explore Nikhil Agrahari's skills across full stack engineering, backend systems, cybersecurity analysis, ethical hacking, and practical security workflows."
        />
      </Helmet>

      <section className="section-wrap pt-12 sm:pt-20">
        <FadeInUp className="skills-hero-surface relative overflow-hidden rounded-[2rem] border border-cyan-300/25 p-6 sm:p-8">
          <div
            className={`pointer-events-none absolute inset-0 ${
              isDark
                ? "bg-[radial-gradient(circle_at_14%_18%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_88%_84%,rgba(168,85,247,0.14),transparent_40%)]"
                : "bg-[radial-gradient(circle_at_14%_18%,rgba(14,165,233,0.16),transparent_34%),radial-gradient(circle_at_88%_84%,rgba(16,185,129,0.12),transparent_40%)]"
            }`}
          />

          <div className="relative">
            <div className="text-center">
              <p className="font-display text-xs uppercase tracking-[0.3em] text-emerald-300">
                Skills
              </p>
              <h1 className="mt-2 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                  Core Skills and Expertise
                </span>
              </h1>
              <p className="mx-auto mt-4 max-w-3xl text-slate-300">
                Practical capabilities across product engineering and security,
                from clean user interfaces and reliable APIs to structured
                testing and defensive analysis.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {topSkillTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <article className="skills-panel-surface rounded-2xl border border-cyan-300/25 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">
                  Skills at a Glance
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {topSkillHighlights.map((highlight) => (
                    <div
                      key={highlight.id}
                      className="rounded-xl border border-cyan-300/25 bg-slate-900/70 p-3"
                    >
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-300/35 bg-cyan-300/10 text-cyan-100">
                        <highlight.Icon size={16} />
                      </div>
                      <p className="mt-3 font-display text-2xl text-cyan-100">
                        {highlight.value}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.13em] text-slate-500">
                        {highlight.label}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-sm text-slate-300">
                  Each section below reflects practical application through real
                  projects, labs, and consistent public learning.
                </p>
              </article>

              <article className="skills-panel-surface rounded-2xl border border-cyan-300/25 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">
                  Focus Domains
                </p>

                <div className="mt-4 space-y-3">
                  {MAIN_SKILL_SHOWCASE.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-3"
                    >
                      <h3 className="text-base font-semibold text-cyan-100">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-300">
                        {item.summary}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    to="/projects"
                    className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 text-white hover:from-violet-400 hover:via-fuchsia-400 hover:to-cyan-400"
                  >
                    View Skill Proof in Projects <ArrowRight size={16} />
                  </Button>
                  <Button
                    to="/contact"
                    variant="ghost"
                    className="border-cyan-300/45 text-cyan-100 hover:bg-cyan-300/10"
                  >
                    Open Contact Hub
                  </Button>
                </div>
              </article>
            </div>
          </div>
        </FadeInUp>
      </section>

      <section className="section-wrap section-divider pt-10">
        <SectionTitle
          eyebrow="Main Capability Areas"
          title="Primary Skill Focus"
          description="The top capability pillars that define how I design, build, and secure software products."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {MAIN_SKILL_SHOWCASE.map((item) => (
            <article key={item.id} className="card-surface rounded-2xl p-5">
              <h3 className="text-2xl font-semibold text-cyan-100">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-300">{item.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full border px-3 py-1 text-xs ${showcaseAccentMap[item.title] || "border-cyan-300/30 bg-cyan-300/10 text-cyan-100"}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-wrap section-divider pt-10">
        <SectionTitle
          eyebrow="Expertise Tracks"
          title="Full Stack, Backend, and Security Roles"
          description="Role-focused competency cards showing strengths across development, security analysis, and penetration testing paths."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {SKILL_EXPERTISE_TRACKS.map((track) => {
            const Icon = trackIconMap[track.title] || Sparkles;
            return (
              <article
                key={track.title}
                className="card-surface rounded-2xl p-5"
              >
                <Icon size={20} className="text-cyan-200" />
                <h3 className="mt-3 text-xl font-semibold text-cyan-100">
                  {track.title}
                </h3>
                <p className="mt-2 text-sm text-slate-300">{track.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {track.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md border border-cyan-300/25 bg-slate-900/70 px-2 py-1 text-xs text-cyan-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-wrap section-divider pt-10">
        <SectionTitle
          eyebrow="Ethical Hacking Toolkit"
          title="Practical Security Toolkit"
          description="Core tools used in reconnaissance, web testing, traffic inspection, and controlled post-exploitation learning workflows."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ETHICAL_HACKING_TOOL_CARDS.map((card) => (
            <article key={card.title} className="card-surface rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-cyan-100">
                {card.title}
              </h3>
              {card.summary ? (
                <p className="mt-2 text-sm text-slate-300">{card.summary}</p>
              ) : null}
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {card.tools.map((tool) => (
                  <li key={tool} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    {tool}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section-wrap section-divider pt-10">
        <SectionTitle
          eyebrow="Complete Matrix"
          title="All Skills and Technologies"
          description="A complete matrix of frontend, backend, languages, databases, cybersecurity tools, and delivery platforms used in active work."
        />

        <div className="mt-8">
          <SkillMatrix />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button to="/projects">
            View Skills in Projects <ArrowRight size={16} />
          </Button>
          <Button
            href={QUICK_CONTACT.tryhackme}
            target="_blank"
            rel="noreferrer"
            variant="ghost"
          >
            Visit TryHackMe Profile
          </Button>
          <Button
            href={QUICK_CONTACT.linkedin}
            target="_blank"
            rel="noreferrer"
            variant="secondary"
          >
            Connect on LinkedIn
          </Button>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          Built by {SITE_PROFILE.fullName} with a product-first, security-aware
          engineering mindset.
        </p>
      </section>
    </>
  );
};

export default SkillsPage;
