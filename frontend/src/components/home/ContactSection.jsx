import { memo } from "react";
import { ArrowRight, Download, Globe, ShieldCheck, Zap } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa";
import FadeInUp from "@/components/animations/FadeInUp";
import { QUICK_CONTACT } from "@/constants/siteData";

const ContactSection = () => {
  return (
    <section className="section-wrap section-divider pt-6 pb-10">
      <FadeInUp>
        <div className="mx-auto max-w-3xl relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-50/40 p-5 text-center sm:p-6 backdrop-blur-xl dark:border-emerald-500/25 dark:bg-[#030e08]/90 dark:shadow-[0_10px_35px_rgba(0,10,5,0.5)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_60%)]" />

          <div className="relative mx-auto mb-1.5 flex justify-center">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 cyber-pulse-dot" />
          </div>

          <p className="relative text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
            Open to Opportunities
          </p>
          <h2 className="relative mt-1.5 text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl lg:text-3xl tracking-tight">
            Ready to Build Something{" "}
            <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Great Together?
            </span>
          </h2>
          <p className="relative mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            Looking for internship roles in Full Stack Engineering, Application
            Security, or DevSecOps. Available for freelance projects and
            collaborations.
          </p>

          <div className="relative mt-4 flex flex-wrap items-center justify-center gap-2">
            <a
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:bg-emerald-400 hover:shadow-md"
            >
              Send Message <ArrowRight size={13} />
            </a>
            <a
              href={QUICK_CONTACT?.resumeFullStack || "/images/resume/WebDev_Resume.pdf"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:bg-emerald-400/20 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300"
            >
              <Download size={12} /> Resume
            </a>
            <a
              href={QUICK_CONTACT?.linkedin || "https://www.linkedin.com/in/nikhilxagr/"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-emerald-400/30 dark:hover:text-emerald-300 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300"
            >
              <FaLinkedinIn size={12} /> LinkedIn
            </a>
          </div>

          <div className="relative mt-4 flex flex-wrap items-center justify-center gap-2 text-[10px]">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-semibold text-emerald-700 dark:text-emerald-300">
              <Zap size={9} /> Quick Response
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-semibold text-emerald-700 dark:text-emerald-300">
              <Globe size={9} /> Remote Ready
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-semibold text-emerald-700 dark:text-emerald-300">
              <ShieldCheck size={9} /> Security-First
            </span>
          </div>
        </div>
      </FadeInUp>
    </section>
  );
};

const MemoizedContactSection = memo(ContactSection);
MemoizedContactSection.displayName = "ContactSection";

export default MemoizedContactSection;
