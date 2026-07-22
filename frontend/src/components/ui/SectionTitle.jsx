const SectionTitle = ({
  eyebrow,
  title,
  description,
  className = "",
  mobileCenter = true,
}) => {
  const alignmentClass = mobileCenter ? "text-center sm:text-left" : "";
  const descriptionAlignmentClass = mobileCenter ? "mx-auto sm:mx-0" : "";

  return (
    <div className={`relative ${alignmentClass} ${className}`.trim()}>
      {eyebrow ? (
        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-300/35 dark:bg-emerald-300/10 dark:text-emerald-200 px-3 py-1 font-display text-[10px] uppercase tracking-[0.2em] sm:text-xs font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-300" />
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 font-display text-[1.9rem] font-semibold leading-tight text-slate-900 dark:text-cyan-50 sm:text-[2.35rem] lg:text-[2.8rem]">
        {title}
      </h2>
      <span className="section-title-rule mt-4 inline-block h-px w-24 bg-gradient-to-r from-cyan-500/75 via-emerald-500/70 to-transparent dark:from-cyan-300/75 dark:via-emerald-300/70" />
      {description ? (
        <p
          className={`section-title-description mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-8 ${descriptionAlignmentClass}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
};

export default SectionTitle;
