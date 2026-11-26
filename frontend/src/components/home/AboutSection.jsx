import { useRef, memo } from "react";
import { useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Download,
  Calendar,
  Code2,
  ShieldCheck,
  Layers,
  GraduationCap,
  Briefcase,
  Terminal,
  Wrench,
} from "lucide-react";
import FadeInUp from "@/components/animations/FadeInUp";
import { useSiteContent } from "@/context/SiteContentContext";

const StatsBar = memo(() => {
  const ref = useRef(null);
  useInView(ref, { once: true, margin: "-50px" });
  const { statsMetrics } = useSiteContent();

  return (
    <section
      ref={ref}
      className="w-full border-t border-black/[0.08] py-8 sm:py-10 dark:border-white/[0.08]"
    >
      <div className="section-wrap !py-0">
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {statsMetrics.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="stat-card-green flex flex-col justify-between p-5 text-left"
            >
              <p className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                {item.label}
              </p>
              <p className="mt-2 font-display text-2xl font-medium tracking-[-0.02em] text-slate-900 tabular-nums sm:text-3xl dark:text-[#eef0f5]">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-[#a3a9b8]">
                {item.detail}
              </p>
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
    text: "Full Stack Developer seeking software engineering internships and entry-level roles.",
  },
  {
    icon: Terminal,
    label: "DSA & Problem Solving",
    text: "Consistent algorithmic practice with 150+ LeetCode and 400+ GeeksforGeeks solutions.",
  },
  {
    icon: Calendar,
    label: "Availability",
    text: "Available immediately for Remote, Hybrid, or On-site engineering roles.",
  },
];

const WHAT_I_PROVIDE_POINTERS = [
  {
    icon: Layers,
    label: "Full-Stack Architecture",
    text: "MERN stack applications (React, Node.js, Express, MongoDB) with modular structure.",
  },
  {
    icon: Code2,
    label: "Frontend UI & REST APIs",
    text: "Responsive, accessible interfaces paired with validated RESTful APIs and authentication.",
  },
  {
    icon: ShieldCheck,
    label: "Security Practices",
    text: "Defensive engineering informed by OWASP Top 10 checks and TryHackMe Top 1% labs.",
  },
  {
    icon: Wrench,
    label: "Maintainable Delivery",
    text: "Reusable components, indexed database queries, and clear API error handling.",
  },
];

const AboutSection = () => {
  const { profile } = useSiteContent();

  return (
    <>
      <StatsBar />
      <section className="section-wrap section-divider space-y-10">
        <FadeInUp>
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
              About
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-[-0.02em] text-slate-900 sm:text-4xl dark:text-[#eef0f5]">
              Background &amp; Engineering Focus
            </h2>
          </div>
        </FadeInUp>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Card 1: Who I Am */}
          <FadeInUp delay={0.04}>
            <article className="flex h-full flex-col justify-between rounded-xl border border-black/[0.08] bg-white p-6 transition-colors duration-150 hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-white/[0.16]">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-black/[0.06] pb-4 dark:border-white/[0.08]">
                  <div>
                    <span className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                      Profile
                    </span>
                    <h3 className="mt-1 font-display text-xl font-medium tracking-[-0.01em] text-slate-900 dark:text-[#eef0f5]">
                      Who I Am
                    </h3>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.08] bg-slate-50 text-slate-600 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]">
                    <GraduationCap size={18} strokeWidth={1.5} />
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-[#a3a9b8]">
                  Third-year Bachelor of Computer Applications (BCA) student focused on full-stack web engineering, system design, and defensive application security.
                </p>

                <div className="space-y-3 pt-1">
                  {WHO_I_AM_POINTERS.map((pointer) => {
                    const Icon = pointer.icon;
                    return (
                    <div key={pointer.label} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-black/[0.08] bg-slate-50 text-emerald-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-emerald-400">
                        <Icon size={16} strokeWidth={1.5} />
                      </span>
                      <div className="text-sm leading-relaxed">
                        <span className="font-medium text-slate-900 dark:text-[#eef0f5]">
                          {pointer.label}:{" "}
                        </span>
                        <span className="text-slate-600 dark:text-[#a3a9b8]">
                          {pointer.text}
                        </span>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 border-t border-black/[0.06] pt-5 font-mono text-xs dark:border-white/[0.08]">
                {["BBDU Lucknow", "3rd Year BCA", "DSA Problem Solving", "Available Immediately"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-black/[0.08] bg-slate-50 px-2.5 py-1 text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </FadeInUp>

          {/* Card 2: What I Can Provide */}
          <FadeInUp delay={0.08}>
            <article className="flex h-full flex-col justify-between rounded-xl border border-black/[0.08] bg-white p-6 transition-colors duration-150 hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-white/[0.16]">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-black/[0.06] pb-4 dark:border-white/[0.08]">
                  <div>
                    <span className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                      Capabilities
                    </span>
                    <h3 className="mt-1 font-display text-xl font-medium tracking-[-0.01em] text-slate-900 dark:text-[#eef0f5]">
                      What I Build
                    </h3>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.08] bg-slate-50 text-slate-600 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]">
                    <Layers size={18} strokeWidth={1.5} />
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-[#a3a9b8]">
                  End-to-end web applications combining clear frontend interfaces, validated backend APIs, and security-first data workflows.
                </p>

                <div className="space-y-3 pt-1">
                  {WHAT_I_PROVIDE_POINTERS.map((pointer) => {
                    const Icon = pointer.icon;
                    return (
                    <div key={pointer.label} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-black/[0.08] bg-slate-50 text-emerald-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-emerald-400">
                        <Icon size={16} strokeWidth={1.5} />
                      </span>
                      <div className="text-sm leading-relaxed">
                        <span className="font-medium text-slate-900 dark:text-[#eef0f5]">
                          {pointer.label}:{" "}
                        </span>
                        <span className="text-slate-600 dark:text-[#a3a9b8]">
                          {pointer.text}
                        </span>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 border-t border-black/[0.06] pt-5 font-mono text-xs dark:border-white/[0.08]">
                {["React", "Node.js", "Express", "MongoDB", "REST APIs", "OWASP Top 10", "TryHackMe Top 1%"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-black/[0.08] bg-slate-50 px-2.5 py-1 text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </FadeInUp>
        </div>

        {/* Action Row */}
        <FadeInUp delay={0.12}>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/about"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-medium text-white transition-colors duration-150 hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
            >
              View Full About Me
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
            <a
              href={profile?.resumeFullStack || "/images/resume/WebDev_Resume.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-black/[0.10] bg-white px-5 text-sm font-medium text-slate-800 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 dark:border-white/[0.10] dark:bg-[#11141c] dark:text-[#eef0f5] dark:hover:border-white/[0.18] dark:hover:bg-[#1a1e28]"
            >
              View Resume
              <Download size={16} strokeWidth={1.5} className="text-slate-500 dark:text-[#7a8296]" />
            </a>
          </div>
        </FadeInUp>
      </section>
    </>
  );
};

const MemoizedAboutSection = memo(AboutSection);
MemoizedAboutSection.displayName = "AboutSection";

export default MemoizedAboutSection;
