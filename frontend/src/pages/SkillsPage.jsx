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
import SectionTitle from "@/components/ui/SectionTitle";
import SkillMatrix from "@/components/ui/SkillMatrix";
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
  return (
    <>
      <Helmet>
        <title>Skills | Nikhil Portfolio</title>
        <meta
          name="description"
          content="Skills and expertise of Nikhil Agrahari across full stack development, backend engineering, ethical hacking, penetration testing, and cyber security analysis."
        />
      </Helmet>

      <section className="section-wrap pt-12 sm:pt-20">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <SectionTitle
            eyebrow="Skills"
            title="Core Skills and Expertise"
            description="Hands-on capability across full stack development, backend systems, cyber security analysis, and ethical hacking toolchains."
          />

          <aside className="card-surface rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">
              Quick Skills Snapshot
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-cyan-300/25 bg-slate-900/70 p-3">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                  Expertise Tracks
                </p>
                <p className="mt-1 font-display text-2xl text-cyan-100">
                  {SKILL_EXPERTISE_TRACKS.length}
                </p>
              </div>
              <div className="rounded-xl border border-cyan-300/25 bg-slate-900/70 p-3">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                  Tool Categories
                </p>
                <p className="mt-1 font-display text-2xl text-cyan-100">
                  {ETHICAL_HACKING_TOOL_CARDS.length}
                </p>
              </div>
              <div className="rounded-xl border border-cyan-300/25 bg-slate-900/70 p-3">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                  Primary Domains
                </p>
                <p className="mt-1 text-base font-semibold text-cyan-100">
                  Full Stack + Security
                </p>
              </div>
              <div className="rounded-xl border border-cyan-300/25 bg-slate-900/70 p-3">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                  Learning Mode
                </p>
                <p className="mt-1 text-base font-semibold text-cyan-100">
                  Continuous and Practical
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-300">
              Each skill card below reflects practical usage in projects, labs,
              and public learning progress.
            </p>
          </aside>
        </div>
      </section>

      <section className="section-wrap section-divider pt-10">
        <SectionTitle
          eyebrow="Main Showcase"
          title="Priority Skill Focus"
          description="The main skill identity highlighted across this portfolio and project work."
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
          description="Focused competency cards covering development, security analysis, and penetration testing paths."
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
          title="Practical Security Tools"
          description="Core tool cards used in reconnaissance, testing, traffic analysis, and basic post-exploitation workflows."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ETHICAL_HACKING_TOOL_CARDS.map((card) => (
            <article key={card.title} className="card-surface rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-cyan-100">
                {card.title}
              </h3>
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
          description="Expanded matrix of frontend, backend, language, database, cyber security, and delivery tools used in active work."
        />

        <div className="mt-8">
          <SkillMatrix />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button to="/projects">
            See Skills in Projects <ArrowRight size={16} />
          </Button>
          <Button
            href={QUICK_CONTACT.tryhackme}
            target="_blank"
            rel="noreferrer"
            variant="ghost"
          >
            TryHackMe Profile
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
          Built by {SITE_PROFILE.fullName} with a full stack + security-first
          approach.
        </p>
      </section>
    </>
  );
};

export default SkillsPage;
