import { ArrowRight, Code2, Cpu, Database, ShieldCheck, Terminal, Wrench, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import SeoHead from "@/components/seo/SeoHead";
import SkillLogoBadge from "@/components/ui/SkillLogoBadge";
import FadeInUp from "@/components/animations/FadeInUp";
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
    skills: ["React", "Next.js", "JavaScript", "Tailwind CSS", "Vite", "HTML", "CSS"],
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
    skills: ["MongoDB", "Supabase", "SQL"],
  },
  {
    id: "devtools",
    number: "05",
    title: "Developer Tools & DevOps",
    description: "Streamlining version control, automated cloud deployments, server hosting, and Linux operating environments.",
    Icon: Terminal,
    gradient: "from-purple-500 via-indigo-400 to-transparent",
    accentBorder: "group-hover:border-purple-500/50 dark:group-hover:border-purple-400/50",
    skills: ["Git", "GitHub", "Linux", "Vercel", "Render", "VS Code", "Antigravity"],
  },
  {
    id: "ai-productivity",
    number: "06",
    title: "AI & Productivity",
    description: "Leveraging modern AI tooling to accelerate development cycles, refactor complex code, and audit application logic.",
    Icon: Wrench,
    gradient: "from-indigo-500 via-violet-400 to-transparent",
    accentBorder: "group-hover:border-indigo-500/50 dark:group-hover:border-indigo-400/50",
    skills: ["ChatGPT", "GitHub Copilot", "Claude", "Gemini", "Emergent", "Replit", "Cursor"],
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
        title="Full Stack & MERN Developer Technical Skills | Nikhil Agrahari"
        description="Comprehensive technical capabilities of Nikhil Agrahari: React.js, Node.js, Express, MongoDB, Next.js, Web Security, AI Integration, and cloud tools."
        pathname="/skills"
        image={SITE_PROFILE.profileImage}
        imageAlt="Nikhil Agrahari - Full Stack Developer Skills"
        keywords={[
          "Nikhil Agrahari skills",
          "MERN stack skills",
          "React Node.js MongoDB developer skills",
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Skills", path: "/skills" },
        ])}
      />

      {/* Main Section with Centered Minimal Header */}
      <section className="section-wrap pt-4 sm:pt-6 pb-20">
        
        {/* Centered Minimal Hero Header */}
        <FadeInUp>
          <div className="text-center max-w-4xl mx-auto mb-10">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-wider text-slate-900 dark:text-white drop-shadow-sm">
              TECHNICAL <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">CAPABILITIES</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              A structured overview of how I build software—organized by engineering discipline, architectural approach, and core tools.
            </p>
          </div>
        </FadeInUp>

        {/* Capability-First Approach Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/90 p-6 sm:p-9 shadow-xl dark:border-slate-800/80 dark:bg-[#050d14]/90 backdrop-blur-xl dark:shadow-none mb-10">
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
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
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
        <div className="mb-12">
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
                className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/80 p-4 shadow-sm transition-all duration-300 hover:border-green-500/50 dark:border-slate-800/80 dark:bg-slate-950/60 dark:shadow-none dark:hover:border-green-400/40"
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

        {/* Skill Categories Header */}
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Skill Categories
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Organized by production domain with official technology badges.
          </p>
        </div>

        {/* Skill Categories Grid — Renders Immediately Without Scroll Delay */}
        <div className="grid gap-6 md:grid-cols-2">
          {SKILL_CATEGORIES.map((category) => {
            const Icon = category.Icon;

            return (
              <article key={category.id} className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-7 shadow-md transition-all duration-300 ease-out dark:border-slate-800/90 dark:bg-[#050d14]/90 dark:shadow-none ${category.accentBorder}`}>
                
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
                        <h3 className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
                          {category.title}
                        </h3>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Domain {category.number}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Skill Badges List */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2.5">
                      Core Stack &amp; Tools:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skillName) => (
                        <SkillLogoBadge key={skillName} skill={skillName} />
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

      </section>
    </>
  );
};

export default SkillsPage;
