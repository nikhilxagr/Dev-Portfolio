import { memo, useState } from "react";
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
        "inline-flex items-center gap-2 rounded-lg border border-black/[0.08] bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 transition-colors duration-150 hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#eef0f5] dark:hover:border-white/[0.16]",
        className,
      )}
    >
      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center">
        {logoUrl && !logoFailed ? (
          <img
            src={logoUrl}
            alt={`${name} logo`}
            loading="lazy"
            decoding="async"
            width={14}
            height={14}
            className="h-3.5 w-3.5 object-contain"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <span className="font-mono text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
            {name.slice(0, 2)}
          </span>
        )}
      </span>
      <span>{name}</span>
    </span>
  );
};

const MemoizedSkillLogoBadge = memo(SkillLogoBadge);
MemoizedSkillLogoBadge.displayName = "SkillLogoBadge";

export default MemoizedSkillLogoBadge;
