import { ArrowRight, Code2, Cpu, ShieldCheck, Terminal } from "lucide-react";
import Button from "@/components/ui/Button";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import SectionTitle from "@/components/ui/SectionTitle";
import SkillLogoBadge from "@/components/ui/SkillLogoBadge";
import { StaggerGrid, StaggerItem } from "@/components/animations/StaggerGrid";
import { useTheme } from "@/context/ThemeContext";
import { createBreadcrumbSchema } from "@/utils/seo";
import { QUICK_CONTACT, SITE_PROFILE } from "@/constants/siteData";

const intelligentSkillDomains = [
  {
    id: "software-developer",
    title: "Full Stack Development",
    summary:
      "Design and ship web products across React interfaces and Node.js APIs with maintainable, production-ready code.",
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
    title: "Application Security",
    summary:
      "Application security workflows for identifying risks, prioritizing remediation, and improving resilience.",
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
    title: "Python and Automation",
    summary:
      "Python-based scripting and automation for development utilities, data tasks, and security support workflows.",
    Icon: Cpu,
    accentClass: "via-violet-300/45",
    skills: ["Python", "SQL", "C", "Postman"],
  },
  {
    id: "linux-systems",
    title: "Linux Operations and Delivery",
    summary:
      "Linux-first workflows for deployment, source control, and day-to-day engineering operations.",
    Icon: Terminal,
    accentClass: "via-fuchsia-300/45",
    skills: ["Linux", "Git", "GitHub", "Vercel", "Render"],
  },
];

const SkillsPage = () => {
  const { isDark } = useTheme();

  const topSkillTags = [
    "Frontend and Backend Development",
    "Application Security",
    "Python Automation",
    "Linux Operations",
  ];

  return (
    <>
      <SeoHead
        title="Skills"
        description="Technical skills of Nikhil Agrahari across software development, application security, Python engineering, Linux workflows, and project delivery."
        pathname="/skills"
        image={SITE_PROFILE.profileImage}
        imageAlt={SITE_PROFILE.profileImageAlt}
        keywords={[
          "Nikhil portfolio skills",
          "Nikhil Lucknow developer skills",
          "Application security and full stack skills",
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Skills", path: "/skills" },
        ])}
      />

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
            <SectionTitle
              mobileCenter={false}
              className="text-center [&_.section-title-description]:mx-auto [&_.section-title-rule]:mx-auto"
              eyebrow="Technical Skills"
              title="Skills and Capability Areas"
              description="A structured overview of software development, application security, Python engineering, and Linux operations."
            />

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:mt-7">
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
          eyebrow="Skill Domains"
          title="Organized by Practical Domain"
          description="Each domain groups core tools and capabilities used in project delivery."
        />

        <StaggerGrid className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 md:grid-cols-2">
          {intelligentSkillDomains.map((domain) => (
            <StaggerItem key={domain.id} className="h-full">
              <article className="skills-mobile-card group relative h-full overflow-hidden rounded-2xl border border-cyan-300/25 bg-slate-950/70 p-4 shadow-[0_18px_38px_-28px_rgba(2,8,20,0.9)] transition duration-300 hover:-translate-y-1 hover:border-cyan-300/45 hover:shadow-[0_26px_52px_-32px_rgba(34,211,238,0.32)] sm:p-6">
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
            See Skills in Projects <ArrowRight size={16} />
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
          Each capability is listed once per domain to keep the taxonomy clear and maintainable.
        </p>
      </section>
    </>
  );
};

export default SkillsPage;
