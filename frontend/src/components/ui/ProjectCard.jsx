import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const GitHubMark = ({ className = "h-[13px] w-[13px]" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M12 0.5C5.65 0.5 0.5 5.65 0.5 12C0.5 17.08 3.79 21.39 8.35 22.91C8.93 23.01 9.14 22.66 9.14 22.35C9.14 22.08 9.13 21.36 9.12 20.41C5.9 21.1 5.22 18.86 5.22 18.86C4.69 17.49 3.93 17.13 3.93 17.13C2.87 16.42 4.01 16.44 4.01 16.44C5.18 16.52 5.8 17.66 5.8 17.66C6.84 19.4 8.53 18.89 9.2 18.59C9.3 17.84 9.6 17.33 9.94 17.03C7.37 16.75 4.67 15.77 4.67 11.38C4.67 10.13 5.13 9.11 5.9 8.31C5.78 8.02 5.37 6.84 6.01 5.25C6.01 5.25 6.99 4.94 9.13 6.34C10.07 6.08 11.08 5.95 12.09 5.94C13.1 5.95 14.11 6.08 15.05 6.34C17.19 4.94 18.17 5.25 18.17 5.25C18.81 6.84 18.4 8.02 18.28 8.31C19.05 9.11 19.51 10.13 19.51 11.38C19.51 15.78 16.8 16.74 14.22 17.02C14.66 17.39 15.06 18.11 15.06 19.2C15.06 20.76 15.04 22.01 15.04 22.35C15.04 22.66 15.25 23.01 15.84 22.91C20.41 21.39 23.69 17.08 23.69 12C23.69 5.65 18.54 0.5 12.19 0.5H12Z" />
  </svg>
);

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

      <div className="mt-4 space-y-2.5">
        <Link
          to={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-200 transition hover:text-cyan-100"
        >
          View Details
          <ArrowUpRight size={14} className="opacity-75" />
        </Link>

        <div className="flex flex-wrap gap-2">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/35 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
              aria-label="Project code"
            >
              <GitHubMark />
              Code
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600/40 bg-slate-800/40 px-3 py-1.5 text-xs font-semibold text-slate-500">
              <GitHubMark />
              Code
            </span>
          )}

          {project.liveDemoUrl ? (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noreferrer"
              className="group/live inline-flex items-center gap-1.5 rounded-lg border border-emerald-300/40 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-100 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-300/20 hover:shadow-[0_12px_24px_-16px_rgba(16,185,129,0.9)]"
              aria-label="Live demo"
            >
              Live Demo
              <ArrowUpRight
                size={13}
                className="transition-transform duration-300 group-hover/live:-translate-y-0.5 group-hover/live:translate-x-0.5"
              />
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
