import { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SkillLogoBadge from "@/components/ui/SkillLogoBadge";
import FadeInUp from "@/components/animations/FadeInUp";
import { MAIN_SKILL_SHOWCASE } from "@/constants/siteData";

const SkillsSection = () => {
  return (
    <section className="section-wrap section-divider">
      <FadeInUp>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Core Competencies
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-[-0.02em] text-slate-900 sm:text-4xl dark:text-[#eef0f5]">
              Technical Skills &amp; Focus Areas
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-[#a3a9b8]">
              Technologies and workflows I use across MERN applications, REST APIs, and security testing.
            </p>
          </div>
          <Link
            to="/skills"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-emerald-700 transition-colors duration-150 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            All skills
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </FadeInUp>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MAIN_SKILL_SHOWCASE.map((category) => (
          <FadeInUp key={category.title}>
            <article className="flex h-full flex-col justify-between rounded-xl border border-black/[0.08] bg-white p-6 transition-colors duration-150 hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-white/[0.16]">
              <div>
                <h3 className="font-display text-lg font-medium tracking-[-0.01em] text-slate-900 dark:text-[#eef0f5]">
                  {category.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8]">
                  {category.description || category.summary}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {(category.skills || category.tags || category.items || []).map((skill) => (
                  <SkillLogoBadge key={skill} skill={skill} />
                ))}
              </div>
            </article>
          </FadeInUp>
        ))}
      </div>
    </section>
  );
};

const MemoizedSkillsSection = memo(SkillsSection);
MemoizedSkillsSection.displayName = "SkillsSection";

export default MemoizedSkillsSection;
