import { SKILL_GROUPS } from "@/constants/siteData";
import SkillLogoBadge from "@/components/ui/SkillLogoBadge";

const matrixToneMap = {
  Frontend: "from-cyan-300/20 via-cyan-300/10 to-transparent",
  Backend: "from-emerald-300/18 via-cyan-300/10 to-transparent",
  Languages: "from-violet-300/18 via-cyan-300/10 to-transparent",
  Database: "from-amber-300/16 via-emerald-300/10 to-transparent",
  "Security and Testing Tools":
    "from-rose-300/16 via-emerald-300/10 to-transparent",
  "Other Tools": "from-cyan-300/18 via-slate-300/10 to-transparent",
};

const SkillMatrix = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {SKILL_GROUPS.map((group) => (
        <article
          key={group.title}
          className="group relative overflow-hidden rounded-2xl border border-cyan-300/25 bg-slate-950/70 p-5 shadow-[0_18px_42px_rgba(2,8,20,0.28)] transition duration-300 hover:-translate-y-1 hover:border-cyan-300/45"
        >
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${matrixToneMap[group.title] || "from-cyan-300/20 via-cyan-300/10 to-transparent"}`}
          />

          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-semibold text-cyan-100">
              {group.title}
            </h3>
            <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-100">
              {group.items.length} skills
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-400">
            Classified capabilities actively used in projects and practical
            workflows.
          </p>

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
