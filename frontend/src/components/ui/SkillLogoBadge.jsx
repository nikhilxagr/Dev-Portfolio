import { useState } from "react";
import clsx from "clsx";
import { useTheme } from "@/context/ThemeContext";
import { getSkillLogoUrl } from "@/constants/skillLogos";

const SkillLogoBadge = ({ skill, className }) => {
  const { isDark } = useTheme();
  const logoUrl = getSkillLogoUrl(skill, isDark);
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/25 bg-slate-900/70 px-2 py-1 text-[11px] text-cyan-100 sm:gap-2 sm:px-2.5 sm:py-1.5 sm:text-xs",
        className,
      )}
    >
      <span className="inline-flex h-4 w-4 items-center justify-center rounded-md border border-cyan-300/25 bg-slate-950/85 sm:h-5 sm:w-5">
        {logoUrl && !logoFailed ? (
          <img
            src={logoUrl}
            alt={`${skill} logo`}
            loading="lazy"
            decoding="async"
            className="h-3 w-3 object-contain sm:h-3.5 sm:w-3.5"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <span className="font-display text-[8px] uppercase tracking-[0.04em] text-cyan-200 sm:text-[9px]">
            {skill.slice(0, 2)}
          </span>
        )}
      </span>
      <span>{skill}</span>
    </span>
  );
};

export default SkillLogoBadge;
