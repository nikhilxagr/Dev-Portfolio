import { Link } from "react-router-dom";

const ProjectCard = ({ project, variant = "default" }) => {
  const summary = project.description || project.summary || "";
  const fallbackImage = "/images/placeholders/content-placeholder.svg";
  const previewImage = project.imageUrl || fallbackImage;
  const isFeaturedVariant = variant === "featured";
  const imageHeightClass = isFeaturedVariant ? "h-full" : "h-44";
  const imageContainerClass = isFeaturedVariant
    ? "aspect-[16/9] overflow-hidden rounded-xl border border-cyan-300/25 bg-slate-950/80 p-1.5"
    : "relative overflow-hidden rounded-xl border border-cyan-300/20 bg-slate-900/70";
  const imageClass = isFeaturedVariant
    ? `${imageHeightClass} w-full rounded-lg object-contain object-center bg-slate-900/80 transition-transform duration-500 group-hover:scale-[1.03]`
    : `${imageHeightClass} w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]`;
  const summaryClass = isFeaturedVariant ? "line-clamp-2" : "line-clamp-3";
  const cardPaddingClass = isFeaturedVariant ? "p-4" : "p-5";
  const cardStyleClass = isFeaturedVariant
    ? "border-cyan-300/35 bg-slate-900/75 shadow-[0_18px_45px_-28px_rgba(34,211,238,0.55)]"
    : "";

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackImage;
  };

  return (
    <article
      className={`card-surface group flex h-full flex-col rounded-2xl transition hover:-translate-y-1 ${cardPaddingClass} ${cardStyleClass}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">
          {project.category}
        </span>
        {project.featured ? (
          <span className="rounded-full border border-cyan-300/30 px-2 py-1 text-[11px] text-cyan-200">
            Featured
          </span>
        ) : null}
      </div>

      <div className={`mb-4 ${imageContainerClass}`}>
        <img
          src={previewImage}
          alt={`${project.title} preview`}
          className={imageClass}
          loading="lazy"
          onError={handleImageError}
        />
        {!isFeaturedVariant ? (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
        ) : null}
      </div>

      {project.tagline ? (
        <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
          {project.tagline}
        </p>
      ) : null}
      <h3 className="text-xl font-semibold text-cyan-100">{project.title}</h3>
      <p className={`mt-2 text-sm text-slate-300 ${summaryClass}`}>{summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.techStack?.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-cyan-300/25 bg-slate-900/80 px-2 py-1 text-xs text-cyan-100"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-auto space-y-3 pt-5">
        <Link
          to={`/projects/${project.slug}`}
          className="inline-block text-sm font-semibold text-cyan-200 hover:text-cyan-100"
        >
          View Details
        </Link>

        <div className="flex flex-wrap gap-2">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-cyan-300/35 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
              aria-label="Project code"
            >
              Code
            </a>
          ) : (
            <span className="rounded-lg border border-slate-600/40 bg-slate-800/40 px-3 py-1.5 text-xs font-semibold text-slate-500">
              Code
            </span>
          )}

          {project.liveDemoUrl ? (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-emerald-300/40 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-300/20"
              aria-label="Live demo"
            >
              Live Demo
            </a>
          ) : (
            <span className="rounded-lg border border-slate-600/40 bg-slate-800/40 px-3 py-1.5 text-xs font-semibold text-slate-500">
              Live Demo
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
