import { Helmet } from "react-helmet-async";
import { ArrowRight, Code2, Cpu, ShieldCheck, Terminal } from "lucide-react";
import Button from "@/components/ui/Button";
import FadeInUp from "@/components/animations/FadeInUp";
import SectionTitle from "@/components/ui/SectionTitle";
import SkillLogoBadge from "@/components/ui/SkillLogoBadge";
import { StaggerGrid, StaggerItem } from "@/components/animations/StaggerGrid";
import { useTheme } from "@/context/ThemeContext";
import { QUICK_CONTACT, SITE_PROFILE } from "@/constants/siteData";

const intelligentSkillDomains = [
  {
    id: "software-developer",
    title: "Software Developer",
    summary:
      "Product-focused engineering from frontend architecture to backend delivery with maintainable code and production readiness.",
    Icon: Code2,
    accentClass: "via-cyan-300/50",
    skills: [
      "React",
      "Next.js",
      "JavaScript",
      "Node.js",
      "Express.js",
      "Supabase",
      "MongoDB",
    ],
  },
  {
    id: "cyber-security",
    title: "Cyber Security",
    summary:
      "Security testing and defensive analysis workflows for identifying vulnerabilities, prioritizing risks, and improving resilience.",
    Icon: ShieldCheck,
    accentClass: "via-emerald-300/50",
    skills: [
      "Kali Linux",
      "Burp Suite",
      "Nmap",
      "Wireshark",
      "Metasploit",
      "TryHackMe",
    ],
  },
  {
    id: "python-engineering",
    title: "Python Engineering",
    summary:
      "Python-driven problem solving for scripting, data-oriented logic, and practical automation that supports development and security tasks.",
    Icon: Cpu,
    accentClass: "via-violet-300/45",
    skills: ["Python", "SQL", "C", "Postman"],
  },
  {
    id: "linux-systems",
    title: "Linux and Delivery",
    summary:
      "Linux-based operational workflows for deployment, collaboration, and day-to-day system-level engineering support.",
    Icon: Terminal,
    accentClass: "via-fuchsia-300/45",
    skills: ["Linux", "Git", "GitHub", "Vercel", "Render"],
  },
];

const SkillsPage = () => {
  const { isDark } = useTheme();

  const topSkillTags = [
    "Software Development",
    "Cyber Security",
    "Python Engineering",
    "Linux Delivery",
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
        <FadeInUp className="skills-hero-surface relative overflow-hidden rounded-[1.5rem] border border-cyan-300/25 p-5 sm:rounded-[2rem] sm:p-8">
          <div
            className={`pointer-events-none absolute inset-0 ${
              isDark
                ? "bg-[radial-gradient(circle_at_14%_18%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_88%_84%,rgba(168,85,247,0.14),transparent_40%)]"
                : "bg-[radial-gradient(circle_at_14%_18%,rgba(14,165,233,0.16),transparent_34%),radial-gradient(circle_at_88%_84%,rgba(16,185,129,0.12),transparent_40%)]"
            }`}
          />

          <div className="relative">
            <div className="text-center">
              <p className="font-display text-[10px] uppercase tracking-[0.28em] text-emerald-300 sm:text-xs sm:tracking-[0.3em]">
                Skill Architecture
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                  Focused Engineering and Security Stack
                </span>
              </h1>
              <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:mt-4 sm:text-base">
                A single, clearly structured skills route covering Software
                Development, Cyber Security, Python Engineering, and Linux
                Delivery workflows.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:mt-6">
              {topSkillTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-cyan-300/35 bg-cyan-300/10 px-2.5 py-1 text-[11px] font-medium text-cyan-100 sm:px-3 sm:text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </FadeInUp>
      </section>

      <section className="section-wrap section-divider pt-10">
        <SectionTitle
          eyebrow="Intelligent Classification"
          title="One-Time, Clearly Classified Skills"
          description="A focused, professional structure where each capability appears once in the domain where it belongs."
        />

        <StaggerGrid className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 md:grid-cols-2">
          {intelligentSkillDomains.map((domain) => (
            <StaggerItem key={domain.id} className="h-full">
              <article className="skills-mobile-card group relative h-full overflow-hidden rounded-2xl border border-cyan-300/25 bg-slate-950/70 p-4 shadow-[0_16px_36px_rgba(2,8,20,0.26)] transition duration-300 hover:-translate-y-1 hover:border-cyan-300/45 sm:p-5">
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-px animate-pulseLine bg-gradient-to-r from-transparent ${domain.accentClass} to-transparent`}
                />
                <div className="pointer-events-none absolute -right-14 -top-14 h-28 w-28 rounded-full bg-cyan-300/10 blur-3xl transition duration-300 group-hover:scale-125" />

                <div className="relative">
                  <div className="skills-mobile-icon inline-flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-300/35 bg-cyan-300/10 text-cyan-100 sm:h-10 sm:w-10">
                    <domain.Icon size={17} />
                  </div>

                  <h3 className="skills-mobile-title mt-3 text-xl font-semibold text-cyan-100 sm:text-2xl">
                    {domain.title}
                  </h3>
                  <p className="skills-mobile-summary mt-2 text-sm leading-6 text-slate-300 sm:leading-7">
                    {domain.summary}
                  </p>

                  <div className="skills-mobile-chip-row mt-4 flex flex-wrap gap-2">
                    {domain.skills.map((skill) => (
                      <SkillLogoBadge key={skill} skill={skill} />
                    ))}
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <div className="mt-8 flex flex-wrap gap-2.5 sm:gap-3">
          <Button to="/projects">
            View Skills in Projects <ArrowRight size={16} />
          </Button>
          <Button
            href={QUICK_CONTACT.tryhackme}
            target="_blank"
            rel="noreferrer"
            variant="ghost"
          >
            TryHackMe
          </Button>
          <Button
            href={QUICK_CONTACT.linkedin}
            target="_blank"
            rel="noreferrer"
            variant="secondary"
          >
            LinkedIn
          </Button>
          <Button to="/contact" variant="ghost">
            Contact Hub
          </Button>
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-400">
          Built by {SITE_PROFILE.fullName} with a product-first, security-aware
          engineering mindset and practical execution workflow.
        </p>
      </section>
    </>
  );
};

export default SkillsPage;
