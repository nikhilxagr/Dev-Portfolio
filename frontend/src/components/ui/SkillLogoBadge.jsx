import { useState } from "react";
import clsx from "clsx";
import { useTheme } from "@/context/ThemeContext";
import { getSkillLogoUrl } from "@/constants/skillLogos";

const SkillLogoBadge = ({ skill, skillName, className }) => {
  const name = skill || skillName || "";
  const { isDark } = useTheme();
  const logoUrl = getSkillLogoUrl(name, isDark);
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-slate-100/90 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-green-500/60 hover:bg-white hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-200 dark:shadow-none dark:hover:border-green-400/50 dark:hover:bg-slate-900 dark:hover:text-white dark:hover:shadow-[0_4px_20px_rgba(34,197,94,0.15)]",
        className,
      )}
    >
      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-transparent">
        {logoUrl && !logoFailed ? (
          <img
            src={logoUrl}
            alt={`${name} logo`}
            loading="lazy"
            decoding="async"
            className="h-3.5 w-3.5 object-contain"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <span className="font-mono text-[9px] font-bold uppercase text-green-600 dark:text-green-400">
            {name.slice(0, 2)}
          </span>
        )}
      </span>
      <span className="tracking-tight">{name}</span>
    </span>
  );
};

export default SkillLogoBadge;
