import { memo } from "react";
import { ArrowRight, Download } from "lucide-react";
import FadeInUp from "@/components/animations/FadeInUp";
import { QUICK_CONTACT } from "@/constants/siteData";
import { useSiteContent } from "@/context/SiteContentContext";

const ContactSection = () => {
  const { profile } = useSiteContent();
  return (
    <section className="section-wrap section-divider">
      <FadeInUp>
        <div className="mx-auto max-w-3xl rounded-xl border border-black/[0.08] bg-white p-8 sm:p-10 dark:border-white/[0.08] dark:bg-[#11141c]">
          <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Contact
          </p>
          <h2 className="mt-2 font-display text-2xl font-medium tracking-[-0.02em] text-slate-900 sm:text-3xl dark:text-[#eef0f5]">
            Get in Touch
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-[#a3a9b8]">
            Available for full-stack MERN and application security internships, freelance builds, or technical collaborations.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="/contact"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-medium text-white transition-colors duration-150 hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
            >
              Send Message
              <ArrowRight size={16} strokeWidth={1.5} />
            </a>
            <a
              href={profile?.resumeFullStack || QUICK_CONTACT?.resumeFullStack || "/images/resume/WebDev_Resume.pdf"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-black/[0.10] bg-white px-5 text-sm font-medium text-slate-800 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 dark:border-white/[0.10] dark:bg-[#1a1e28] dark:text-[#eef0f5] dark:hover:border-white/[0.18] dark:hover:bg-[#222734]"
            >
              <Download size={16} strokeWidth={1.5} className="text-slate-500 dark:text-[#7a8296]" />
              Resume
            </a>
          </div>
        </div>
      </FadeInUp>
    </section>
  );
};

const MemoizedContactSection = memo(ContactSection);
MemoizedContactSection.displayName = "ContactSection";

export default MemoizedContactSection;
