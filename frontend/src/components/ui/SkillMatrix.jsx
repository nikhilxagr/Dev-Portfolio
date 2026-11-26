import { SKILL_GROUPS } from "@/constants/siteData";
import { useSiteContent } from "@/context/SiteContentContext";
import SkillLogoBadge from "@/components/ui/SkillLogoBadge";

const SkillMatrix = () => {
  const { skills } = useSiteContent();
  const skillGroups = Array.isArray(skills?.skillGroups) && skills.skillGroups.length > 0
    ? skills.skillGroups
    : SKILL_GROUPS;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {skillGroups.map((group) => (
        <article
          key={group.title}
          className="flex flex-col justify-between rounded-xl border border-black/[0.08] bg-white p-5 transition-colors duration-150 hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-white/[0.16]"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-lg font-medium tracking-[-0.01em] text-slate-900 dark:text-[#eef0f5]">
                {group.title}
              </h3>
              <span className="rounded-md border border-black/[0.08] bg-slate-50 px-2.5 py-1 font-mono text-xs tabular-nums text-slate-600 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]">
                {group.items.length} skills
              </span>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8]">
              Capabilities applied across production builds and engineering workflows.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {group.items.map((item) => (
              <SkillLogoBadge key={item} skill={item} />
            ))}
          </div>
        </article>
      ))}
    </div>
  );
};

export default SkillMatrix;
