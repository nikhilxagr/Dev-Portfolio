import { useRef, memo } from "react";
import { useInView } from "framer-motion";
import { ArrowRight, Code2, ShieldCheck, Layers, GitBranch, CheckCircle2, Target, BookOpen, CalendarCheck } from "lucide-react";
import FadeInUp from "@/components/animations/FadeInUp";
import { STATS_METRICS } from "@/constants/siteData";

const StatsBar = memo(() => {
  const ref = useRef(null);
  useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="section-wrap section-divider pt-6 pb-6 sm:pt-8 sm:pb-8">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {STATS_METRICS.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="stat-card-green flex flex-col items-center gap-1 p-4 text-center sm:p-5 group"
          >
            <p className={`font-outfit text-2xl font-black sm:text-3xl ${item.accentColor || "text-green-400"}`}>
              {item.value}
            </p>
            <p className="text-xs font-semibold text-slate-200 dark:text-slate-200">{item.label}</p>
            <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">{item.detail}</p>
          </a>
        ))}
      </div>
    </section>
  );
});

StatsBar.displayName = "StatsBar";

const FULLSTACK_OBJECTIVES = [
  { icon: Layers, text: "Build full-stack MERN apps with clean, production-ready architecture" },
  { icon: Code2, text: "Deliver responsive UIs (React/Next.js) with smooth UX & component reuse" },
  { icon: GitBranch, text: "Design and consume RESTful APIs with Express.js, validation & error handling" },
  { icon: CheckCircle2, text: "Ship with Git workflows, Vercel/Render deployments & documentation habits" },
];

const SECURITY_OBJECTIVES = [
  { icon: ShieldCheck, text: "Apply OWASP Top 10 methodology to identify real web app vulnerabilities" },
  { icon: Target, text: "TryHackMe Global Top 1% — 275+ rooms in recon, privesc & web exploitation" },
  { icon: BookOpen, text: "Practise Burp Suite intercept, SQLMap, Nmap scanning in controlled lab environments" },
  { icon: CalendarCheck, text: "Write security-aware backend code: JWT hardening, Helmet.js, rate limiting" },
];

const AboutSection = () => {
  return (
    <>
      <StatsBar />
      <section className="section-wrap section-divider pt-8 sm:pt-12">
        <FadeInUp>
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white dark:bg-[#050d14] shadow-xl dark:border-green-400/22 dark:bg-gradient-to-br dark:from-[#050d14] dark:via-[#082218] dark:to-[#050d14] dark:shadow-none p-6 sm:p-8 mb-6">
            <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-green-500/10 dark:bg-green-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-emerald-500/8 dark:bg-emerald-400/8 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-green-600 dark:text-green-400">About Me</p>
              <h2 className="mt-2 text-4xl font-black text-slate-900 dark:text-white sm:text-5xl lg:text-6xl leading-[0.95]">
                Who I Am
              </h2>
              <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto]">
                <div className="space-y-4 max-w-2xl">
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    I'm a <span className="font-bold text-green-600 dark:text-green-400">BCA student at BBD University, Lucknow</span>, combining full-stack engineering with practical cybersecurity. I don't just learn tools — I build real products and solve real problems.
                  </p>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    My approach: write clean code, think about security from day one, and document everything. Whether it's a MERN application or a security lab writeup, I care about the quality of my output.
                  </p>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Currently seeking <span className="font-semibold text-slate-900 dark:text-white">internship opportunities</span> in Full Stack Engineering, Application Security, or DevSecOps — where both my skills create real value.
                  </p>
                </div>
                <div className="flex flex-col gap-2 lg:items-end">
                  <div className="flex flex-wrap gap-2 lg:flex-col">
                    {["BCA · BBD University", "Lucknow, India 🇮🇳", "Open to Internships", "Security-First Mindset"].map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1.5 rounded-lg border border-green-500/30 bg-green-500/10 text-green-700 dark:border-green-400/35 dark:bg-green-500/20 dark:text-green-300 px-3 py-1.5 text-xs font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 dark:bg-green-400" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.22em] text-green-600 dark:text-green-400">Dual-Role Profile</p>
            <h3 className="mt-1.5 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">What I Can Deliver</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Clear objectives across both roles — no filler, no guesses.</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <article className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white dark:bg-[#050d14] shadow-lg dark:border-green-400/25 dark:bg-gradient-to-br dark:from-[#050d14] dark:via-[#082218] dark:to-[#050d14] dark:shadow-none p-6 sm:p-7 backdrop-blur-md">
              <div className="pointer-events-none absolute -top-12 -right-10 h-36 w-36 rounded-full bg-green-500/10 dark:bg-green-400/12 blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-green-500/30 bg-green-500/10 text-green-600 dark:border-green-400/35 dark:bg-green-400/12 dark:text-green-400">
                    <Code2 size={22} />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-green-600/70 dark:text-green-400/70">Role 01</p>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Full Stack Developer</h4>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["React", "Node.js", "MongoDB", "Express", "Next.js"].map(t => (
                    <span key={t} className="rounded-lg border border-green-500/30 bg-green-500/10 text-green-700 dark:border-green-400/35 dark:bg-green-500/20 dark:text-green-300 px-2.5 py-1 text-[11px] font-bold shadow-sm">{t}</span>
                  ))}
                </div>
                <ul className="mt-5 space-y-3">
                  {FULLSTACK_OBJECTIVES.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-green-500/25 bg-green-500/10 text-green-600 dark:border-green-400/25 dark:bg-green-400/10 dark:text-green-400">
                        <Icon size={12} />
                      </span>
                      <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{text}</span>
                    </li>
                  ))}
                </ul>
                <a href="/projects" className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors">
                  View Full-Stack Projects <ArrowRight size={13} />
                </a>
              </div>
            </article>

            <article className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white dark:bg-[#050d14] shadow-lg dark:border-cyan-500/25 dark:bg-gradient-to-br dark:from-[#050d14] dark:via-[#081e2e] dark:to-[#050d14] dark:shadow-none p-6 sm:p-7 backdrop-blur-md">
              <div className="pointer-events-none absolute -bottom-14 -left-10 h-36 w-36 rounded-full bg-emerald-500/10 dark:bg-cyan-400/12 blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:border-cyan-400/35 dark:bg-cyan-400/12 dark:text-cyan-400">
                    <ShieldCheck size={22} />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-600/70 dark:text-cyan-400/70">Role 02</p>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">CyberSec Practitioner</h4>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["Burp Suite", "Nmap", "Kali Linux", "OWASP", "TryHackMe"].map(t => (
                    <span key={t} className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-800 dark:border-cyan-400/35 dark:bg-cyan-500/20 dark:text-cyan-300 px-2.5 py-1 text-[11px] font-bold shadow-sm">{t}</span>
                  ))}
                </div>
                <ul className="mt-5 space-y-3">
                  {SECURITY_OBJECTIVES.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-400">
                        <Icon size={12} />
                      </span>
                      <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{text}</span>
                    </li>
                  ))}
                </ul>
                <a href="/security" className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors">
                  View Security Labs <ArrowRight size={13} />
                </a>
              </div>
            </article>
          </div>
        </FadeInUp>
      </section>
    </>
  );
};

const MemoizedAboutSection = memo(AboutSection);
MemoizedAboutSection.displayName = "AboutSection";

export default MemoizedAboutSection;
