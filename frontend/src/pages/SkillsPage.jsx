import { ArrowRight, Code2, Cpu, Database, ShieldCheck, Terminal, Wrench, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import SeoHead from "@/components/seo/SeoHead";
import SectionTitle from "@/components/ui/SectionTitle";
import SkillLogoBadge from "@/components/ui/SkillLogoBadge";
import { StaggerGrid, StaggerItem } from "@/components/animations/StaggerGrid";
import { createBreadcrumbSchema } from "@/utils/seo";
import { SITE_PROFILE } from "@/constants/siteData";

const SKILL_CATEGORIES = [
  {
    id: "frontend",
    number: "01",
    title: "Frontend Engineering",
    description: "Architecting reactive, high-performance interfaces with modular design systems, component state management, and responsive accessibility.",
    Icon: Code2,
    gradient: "from-cyan-500 via-emerald-400 to-transparent",
    accentBorder: "group-hover:border-cyan-500/50 dark:group-hover:border-cyan-400/50",
    skills: ["React", "Next.js", "JavaScript", "TypeScript", "Tailwind CSS", "Vite", "HTML", "CSS"],
  },
  {
    id: "backend",
    number: "02",
    title: "Backend Engineering",
    description: "Designing RESTful API architectures, authentication pipelines, and server controller logic built for scale and security.",
    Icon: Cpu,
    gradient: "from-emerald-500 via-green-400 to-transparent",
    accentBorder: "group-hover:border-emerald-500/50 dark:group-hover:border-green-400/50",
    skills: ["Node.js", "Express.js", "Python", "Postman", "C"],
  },
  {
    id: "cybersecurity",
    number: "03",
    title: "Cybersecurity & Defense",
    description: "Auditing web applications for security flaws, evaluating network resilience, and applying OWASP defense-in-depth protocols.",
    Icon: ShieldCheck,
    gradient: "from-green-500 via-teal-400 to-transparent",
    accentBorder: "group-hover:border-green-500/50 dark:group-hover:border-green-400/50",
    skills: ["Kali Linux", "Burp Suite", "Nmap", "Wireshark", "Metasploit", "OWASP", "TryHackMe"],
  },
  {
    id: "databases",
    number: "04",
    title: "Databases & Storage",
    description: "Structuring document-oriented and relational database schemas optimized for data integrity, indexing, and low-latency queries.",
    Icon: Database,
    gradient: "from-teal-500 via-cyan-400 to-transparent",
    accentBorder: "group-hover:border-teal-500/50 dark:group-hover:border-teal-400/50",
    skills: ["MongoDB", "PostgreSQL", "Supabase", "SQL"],
  },
  {
    id: "devtools",
    number: "05",
    title: "Developer Tools & DevOps",
    description: "Streamlining version control, automated cloud deployments, server hosting, and Linux operating environments.",
    Icon: Terminal,
    gradient: "from-purple-500 via-indigo-400 to-transparent",
    accentBorder: "group-hover:border-purple-500/50 dark:group-hover:border-purple-400/50",
    skills: ["Git", "GitHub", "Linux", "Vercel", "Render", "VS Code"],
  },
  {
    id: "ai-productivity",
    number: "06",
    title: "AI & Productivity",
    description: "Leveraging modern AI tooling to accelerate development cycles, refactor complex code, and audit application logic.",
    Icon: Wrench,
    gradient: "from-indigo-500 via-violet-400 to-transparent",
    accentBorder: "group-hover:border-indigo-500/50 dark:group-hover:border-indigo-400/50",
    skills: ["ChatGPT", "GitHub Copilot"],
  },
];

const CURRENTLY_EXPLORING = [
  { label: "System Design & Distributed Architectures", category: "Architecture" },
  { label: "Advanced Backend & API Security Auditing", category: "Security" },
  { label: "LLM Orchestration & AI Workflows", category: "AI Engineering" },
  { label: "DevSecOps & Automated CI/CD Pipelines", category: "DevOps" },
];

const SkillsPage = () => {
  return (
    <>
      <SeoHead
        title="Technical Skills & Capabilities"
        description="Technical capabilities of Nikhil Agrahari across full stack frontend architecture, backend REST APIs, application security, databases, and DevOps."
        pathname="/skills"
        image={SITE_PROFILE.profileImage}
        imageAlt={SITE_PROFILE.profileImageAlt}
        keywords={[
          "Nikhil Agrahari skills",
          "Full stack developer technical skills",
          "Application security practitioner skills",
          "React Node.js MongoDB Cybersecurity",
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Skills", path: "/skills" },
        ])}
      />

      {/* Page Title & Intro */}
      <section className="section-wrap pt-12 sm:pt-20">
        <SectionTitle
          eyebrow="Technical Capabilities"
          title="Engineering Stack & Skills"
          description="A structured overview of how I build software—organized by engineering discipline, architectural approach, and core tools."
        />
      </section>

      {/* Main Skills Content */}
      <section className="section-wrap section-divider pt-8 pb-20">
        
        {/* Capability-First Approach Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/90 p-6 sm:p-9 shadow-xl dark:border-slate-800/80 dark:bg-[#050d14]/90 backdrop-blur-xl dark:shadow-none mb-12">
          <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-green-500/10 dark:bg-green-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-cyan-500/8 dark:bg-cyan-400/8 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-green-600 dark:text-green-400">
                // Engineering Approach
              </span>
              <h3 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Capabilities Over Logos
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                I view technical skills as tools to solve real engineering problems. My approach prioritizes clean modular architecture, application resilience, defense-in-depth security, and shipping software that users can rely on.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 shrink-0">
              {["Modular Architecture", "Security-First", "Clean Code"].map((pill) => (
                <div
                  key={pill}
                  className="rounded-xl border border-green-500/25 bg-green-500/10 text-green-700 dark:border-green-400/25 dark:bg-green-400/10 dark:text-green-300 px-4 py-2 text-xs font-bold uppercase tracking-wider"
                >
                  ✓ {pill}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Currently Exploring / Advancing */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-green-600 dark:text-green-400" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-green-600 dark:text-green-400">
              // Currently Exploring &amp; Advancing
            </h3>
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {CURRENTLY_EXPLORING.map((item) => (
              <div
                key={item.label}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/80 p-4.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-500/50 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-950/60 dark:shadow-none dark:hover:border-green-400/40"
              >
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {item.category}
                </span>
                <p className="mt-1.5 font-display font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Engineering Skill Categories Header */}
        <div className="mb-8">
          <h3 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Skill Categories
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Organized by production domain with official technology badges.
          </p>
        </div>

        {/* Categories Grid */}
        <StaggerGrid className="grid gap-6 md:grid-cols-2">
          {SKILL_CATEGORIES.map((category) => {
            const Icon = category.Icon;

            return (
              <StaggerItem key={category.id} className="h-full">
                <article className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-7 shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl dark:border-slate-800/90 dark:bg-[#050d14]/90 dark:shadow-none ${category.accentBorder}`}>
                  
                  {/* Top Ambient Highlight Beam */}
                  <div className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${category.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                  
                  {/* Background Soft Glow */}
                  <div className="pointer-events-none absolute -top-14 -right-14 h-36 w-36 rounded-full bg-green-500/5 blur-3xl transition-transform duration-300 group-hover:scale-150" />

                  <div className="relative">
                    {/* Category Header */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-green-500/25 bg-green-500/10 text-green-600 dark:border-green-400/30 dark:bg-green-400/10 dark:text-green-400">
                          <Icon size={22} />
                        </span>
                        <div>
                          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            {category.number} // DOMAIN
                          </span>
                          <h4 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            {category.title}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-3.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {category.description}
                    </p>

                    {/* Technology Badges */}
                    <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                      {category.skills.map((skill) => (
                        <SkillLogoBadge key={skill} skill={skill} />
                      ))}
                    </div>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerGrid>

        {/* Bottom Call to Action */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-5 border-t border-slate-200/80 dark:border-slate-800/80 pt-9">
          <div>
            <p className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Want to see these skills in real production applications?
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Explore full-stack projects, architecture breakdowns, and security labs.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to="/projects" variant="primary">
              View Projects <ArrowRight size={15} />
            </Button>
            <Button to="/security" variant="ghost">
              Security Labs
            </Button>
          </div>
        </div>

      </section>
    </>
  );
};

export default SkillsPage;
