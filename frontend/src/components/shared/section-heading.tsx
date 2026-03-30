type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl space-y-3">
      {eyebrow ? (
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--accent-strong)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-[color:var(--text-primary-on-light)] sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="text-base leading-8 text-[color:var(--text-secondary-on-light)] sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
