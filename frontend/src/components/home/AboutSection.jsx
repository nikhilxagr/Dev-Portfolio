import { useRef, memo } from "react";
import { useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Download,
  Calendar,
  CheckCircle2,
  Code2,
  ShieldCheck,
  Layers,
  GraduationCap,
  Briefcase,
  Terminal,
  Sparkles,
} from "lucide-react";
import FadeInUp from "@/components/animations/FadeInUp";
import { STATS_METRICS, QUICK_CONTACT } from "@/constants/siteData";

const StatsBar = memo(() => {
  const ref = useRef(null);
  useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="w-full border-t border-slate-200/80 dark:border-white/[0.06] pt-6 pb-6 sm:pt-8 sm:pb-8">
      <div className="section-wrap !py-0">
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
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.label}</p>
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">{item.detail}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
});

StatsBar.displayName = "StatsBar";

const WHO_I_AM_POINTERS = [
  {
    icon: GraduationCap,
    label: "Academic Foundation",
    text: "Third-year BCA student at Babu Banarasi Das University, Lucknow (BBDU).",
  },
  {
    icon: Briefcase,
    label: "Current Pursuit",
    text: "Aspiring Full Stack Developer actively seeking internship and entry-level software engineering roles.",
  },
  {
    icon: Terminal,
    label: "DSA & Problem Solving",
    text: "Consistent algorithmic problem solver with 130+ LeetCode and 400+ GeeksforGeeks solutions.",
  },
  {
    icon: Calendar,
    label: "Immediate Availability",
    text: "Ready to join immediately for Remote, Hybrid, or On-site opportunities.",
  },
];

const WHAT_I_PROVIDE_POINTERS = [
  {
    icon: Layers,
    label: "Full-Stack Architecture",
    text: "Production-ready MERN stack apps (React, Node.js, Express, MongoDB) with clean structure.",
  },
  {
    icon: Code2,
    label: "Modern UI/UX & REST APIs",
    text: "Responsive, accessible user interfaces backed by robust RESTful API integration and authentication.",
  },
  {
    icon: ShieldCheck,
    label: "Cybersecurity Awareness",
    text: "Defensive web security practices guided by OWASP Top 10 mitigation and TryHackMe Top 1% labs.",
  },
  {
    icon: Sparkles,
    label: "Engineering Discipline",
    text: "Focused on clean code, reusable components, database optimization, and scalable design.",
  },
];

const AboutSection = () => {
  return (
    <>
      <StatsBar />
      <section className="w-full border-t border-slate-200/80 dark:border-white/[0.06] pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="section-wrap !py-0 space-y-10">
          
          {/* Centered Large Section Title */}
          <FadeInUp>
            <div className="text-center">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-green-600 dark:text-green-400 mb-2">
                // About Me
              </p>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                About <span className="text-green-600 dark:text-green-400">Me</span>
              </h2>
            </div>
          </FadeInUp>

          {/* Two Distinct Cards: Matching page color and higher opacity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Card 1: Who I Am */}
            <FadeInUp delay={0.05}>
              <article className="relative h-full flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-green-400/28 dark:bg-[#050d14] dark:bg-gradient-to-br dark:from-[#050d14] dark:via-[#082218] dark:to-[#050d14] dark:shadow-none group">
                <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full blur-3xl bg-green-500/10 dark:bg-green-400/18" />

                <div className="relative space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/10">
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-green-600 dark:text-green-400">
                        // Profile
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-green-700 dark:text-green-300">
                        Who I Am
                      </h3>
                    </div>
                    <span className="rounded-xl border border-green-500/30 bg-green-500/10 p-2.5 text-green-600 dark:border-green-400/40 dark:bg-green-400/12 dark:text-green-300">
                      <GraduationCap size={20} />
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    I am a third-year Bachelor of Computer Applications (BCA) student with a passion for software engineering, system design, and cybersecurity defense.
                  </p>

                  {/* Pointers */}
                  <div className="space-y-3 pt-1">
                    {WHO_I_AM_POINTERS.map(({ icon: Icon, label, text }) => (
                      <div key={label} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-green-500/30 bg-green-500/10 text-green-600 dark:border-green-400/40 dark:bg-green-400/12 dark:text-green-300">
                          <CheckCircle2 size={13} />
                        </span>
                        <div className="text-xs sm:text-sm">
                          <span className="font-semibold text-slate-900 dark:text-white">{label}: </span>
                          <span className="text-slate-600 dark:text-slate-400">{text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Tag Chips */}
                <div className="relative pt-6 mt-6 border-t border-slate-100 dark:border-white/10 flex flex-wrap gap-2 font-mono text-[11px] font-bold uppercase tracking-wider">
                  {["BBDU Lucknow", "3rd Year BCA", "DSA Problem Solving", "Available Immediately"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-green-500/20 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-400/35 dark:bg-green-950/70 dark:text-green-300 dark:hover:bg-green-900/70 px-2.5 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </FadeInUp>

            {/* Card 2: What I Can Provide */}
            <FadeInUp delay={0.1}>
              <article className="relative h-full flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-cyan-400/28 dark:bg-[#050d14] dark:bg-gradient-to-br dark:from-[#050d14] dark:via-[#081e2e] dark:to-[#050d14] dark:shadow-none group">
                <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full blur-3xl bg-cyan-500/10 dark:bg-cyan-400/18" />

                <div className="relative space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/10">
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
                        // Capabilities
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-cyan-700 dark:text-cyan-300">
                        What I Can Provide
                      </h3>
                    </div>
                    <span className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:border-cyan-400/40 dark:bg-cyan-400/12 dark:text-cyan-300 p-2.5">
                      <Layers size={20} />
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    I engineer end-to-end web applications with modern frontend experiences, secure REST APIs, and production-minded architecture.
                  </p>

                  {/* Pointers */}
                  <div className="space-y-3 pt-1">
                    {WHAT_I_PROVIDE_POINTERS.map(({ icon: Icon, label, text }) => (
                      <div key={label} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:border-cyan-400/40 dark:bg-cyan-400/12 dark:text-cyan-300">
                          <CheckCircle2 size={13} />
                        </span>
                        <div className="text-xs sm:text-sm">
                          <span className="font-semibold text-slate-900 dark:text-white">{label}: </span>
                          <span className="text-slate-600 dark:text-slate-400">{text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Tag Chips */}
                <div className="relative pt-6 mt-6 border-t border-slate-100 dark:border-white/10 flex flex-wrap gap-2 font-mono text-[11px] font-bold uppercase tracking-wider">
                  {["React", "Node.js", "Express", "MongoDB", "REST APIs", "OWASP Top 10", "TryHackMe Top 1%"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-cyan-500/20 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:border-cyan-400/35 dark:bg-cyan-950/70 dark:text-cyan-300 dark:hover:bg-cyan-900/70 px-2.5 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </FadeInUp>
          </div>

          {/* Action Row: Centered Buttons */}
          <FadeInUp delay={0.15}>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-black transition-all duration-300 hover:-translate-y-1 hover:bg-green-400 hover:shadow-[0_8px_24px_rgba(34,197,94,0.45)]"
              >
                View Full About Me
                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
              <a
                href={QUICK_CONTACT.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/90 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-slate-800 transition-all duration-300 hover:-translate-y-1 hover:border-green-500/50 hover:text-green-600 dark:border-white/10 dark:bg-[#050d14] dark:text-slate-200 dark:hover:border-green-400/50 dark:hover:text-white"
              >
                View Resume
                <Download size={15} />
              </a>
            </div>
          </FadeInUp>

        </div>
      </section>
    </>
  );
};

const MemoizedAboutSection = memo(AboutSection);
MemoizedAboutSection.displayName = "AboutSection";

export default MemoizedAboutSection;
