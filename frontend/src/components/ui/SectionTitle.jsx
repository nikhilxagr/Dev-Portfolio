const SectionTitle = ({ eyebrow, title, description, className = '' }) => {
  return (
    <div className={className}>
      {eyebrow ? (
        <p className="mb-2 font-display text-xs uppercase tracking-[0.28em] text-emerald-300/90">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-semibold text-cyan-100 sm:text-4xl">{title}</h2>
      {description ? <p className="mt-3 max-w-3xl text-slate-300">{description}</p> : null}
    </div>
  )
}

export default SectionTitle
