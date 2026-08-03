import { memo } from "react";
import { ShieldCheck, Code2, Braces } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import SkillLogoBadge from "@/components/ui/SkillLogoBadge";
import FadeInUp from "@/components/animations/FadeInUp";
import { MAIN_SKILL_SHOWCASE } from "@/constants/siteData";

const skillVisualMap = {
  "Application Security": {
    cardClass:
      "border-slate-200/80 bg-white dark:bg-[#050d14] shadow-md dark:border-cyan-400/28 dark:bg-gradient-to-br dark:from-[#050d14] dark:via-[#081e2e] dark:to-[#050d14] dark:shadow-none",
    orbClass: "bg-cyan-500/10 dark:bg-cyan-400/18",
    iconWrapClass:
      "border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:border-cyan-400/40 dark:bg-cyan-400/12 dark:text-cyan-300",
    iconColorClass: "text-cyan-600 dark:text-cyan-300",
    titleClass: "text-cyan-700 dark:text-cyan-300",
    tagClass:
      "border-cyan-500/20 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:border-cyan-400/35 dark:bg-cyan-950/70 dark:text-cyan-300 dark:hover:bg-cyan-900/70",
  },
  "Full Stack Development": {
    cardClass:
      "border-slate-200/80 bg-white dark:bg-[#050d14] shadow-md dark:border-green-400/28 dark:bg-gradient-to-br dark:from-[#050d14] dark:via-[#082218] dark:to-[#050d14] dark:shadow-none",
    orbClass: "bg-green-500/10 dark:bg-green-400/18",
    iconWrapClass:
      "border-green-500/30 bg-green-500/10 text-green-600 dark:border-green-400/40 dark:bg-green-400/12 dark:text-green-300",
    iconColorClass: "text-green-600 dark:text-green-300",
    titleClass: "text-green-700 dark:text-green-300",
    tagClass:
      "border-green-500/20 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-400/35 dark:bg-green-950/70 dark:text-green-300 dark:hover:bg-green-900/70",
  },
  "Languages & Frameworks": {
    cardClass:
      "border-slate-200/80 bg-white dark:bg-[#050d14] shadow-md dark:border-lime-400/28 dark:bg-gradient-to-br dark:from-[#050d14] dark:via-[#122608] dark:to-[#050d14] dark:shadow-none",
    orbClass: "bg-lime-500/10 dark:bg-lime-400/18",
    iconWrapClass:
      "border-lime-500/30 bg-lime-500/10 text-lime-700 dark:border-lime-400/40 dark:bg-lime-400/12 dark:text-lime-300",
    iconColorClass: "text-lime-700 dark:text-lime-300",
    titleClass: "text-lime-800 dark:text-lime-300",
    tagClass:
      "border-lime-500/20 bg-lime-50 text-lime-800 hover:bg-lime-100 dark:border-lime-400/35 dark:bg-lime-950/70 dark:text-lime-300 dark:hover:bg-lime-900/70",
  },
};

const skillIconMap = {
  "Application Security": ShieldCheck,
  "Full Stack Development": Code2,
  "Languages & Frameworks": Braces,
};

const SkillsSection = () => {
  return (
    <section className="section-wrap section-divider pt-12 pb-16">
      <SectionTitle
        eyebrow="Core Competencies"
        title="Technical Skills & Expertise"
        description="Comprehensive technical capabilities across full-stack software development and application security auditing."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MAIN_SKILL_SHOWCASE.map((category) => {
          const visual = skillVisualMap[category.title] || skillVisualMap["Full Stack Development"];
          const Icon = skillIconMap[category.title] || Code2;

          return (
            <FadeInUp key={category.title}>
              <article className={`relative h-full overflow-hidden rounded-3xl border p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7 ${visual.cardClass}`}>
                <div className={`pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full blur-3xl ${visual.orbClass}`} />

                <div className="relative flex items-center gap-3">
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${visual.iconWrapClass}`}>
                    <Icon size={24} className={visual.iconColorClass} />
                  </span>
                  <div>
                    <h3 className={`text-lg font-bold sm:text-xl ${visual.titleClass}`}>
                      {category.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {category.description || category.summary}
                    </p>
                  </div>
                </div>

                <div className="relative mt-6 flex flex-wrap gap-2">
                  {(category.skills || category.tags || category.items || []).map((skill) => (
                    <SkillLogoBadge
                      key={skill}
                      skill={skill}
                      className={visual.tagClass}
                    />
                  ))}
                </div>
              </article>
            </FadeInUp>
          );
        })}
      </div>
    </section>
  );
};

const MemoizedSkillsSection = memo(SkillsSection);
MemoizedSkillsSection.displayName = "SkillsSection";

export default MemoizedSkillsSection;
