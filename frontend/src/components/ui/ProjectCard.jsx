import { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Download, User, Users } from "lucide-react";

const GitHubMark = ({ className = "h-3.5 w-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12 0.5C5.65 0.5 0.5 5.65 0.5 12C0.5 17.08 3.79 21.39 8.35 22.91C8.93 23.01 9.14 22.66 9.14 22.35C9.14 22.08 9.13 21.36 9.12 20.41C5.9 21.1 5.22 18.86 5.22 18.86C4.69 17.49 3.93 17.13 3.93 17.13C2.87 16.42 4.01 16.44 4.01 16.44C5.18 16.52 5.8 17.66 5.8 17.66C6.84 19.4 8.53 18.89 9.2 18.59C9.3 17.84 9.6 17.33 9.94 17.03C7.37 16.75 4.67 15.77 4.67 11.38C4.67 10.13 5.13 9.11 5.9 8.31C5.78 8.02 5.37 6.84 6.01 5.25C6.01 5.25 6.99 4.94 9.13 6.34C10.07 6.08 11.08 5.95 12.09 5.94C13.1 5.95 14.11 6.08 15.05 6.34C17.19 4.94 18.17 5.25 18.17 5.25C18.81 6.84 18.4 8.02 18.28 8.31C19.05 9.11 19.51 10.13 19.51 11.38C19.51 15.78 16.8 16.74 14.22 17.02C14.66 17.39 15.06 18.11 15.06 19.2C15.06 20.76 15.04 22.01 15.04 22.35C15.04 22.66 15.25 23.01 15.84 22.91C20.41 21.39 23.69 17.08 23.69 12C23.69 5.65 18.54 0.5 12.19 0.5H12Z" />
  </svg>
);

const isCollaborationProject = (project) => {
  if (!project) return false;
  if (project.projectType === "Collaboration" || project.projectType === "Collab") return true;
  if (project.projectType === "Solo") return false;
  const slug = (project.slug || "").toLowerCase().trim();
  if (["kanoon-mate", "smart-lms", "smart-lms-saas-platform", "smartmess"].includes(slug)) return true;
  const title = (project.title || "").toLowerCase().trim();
  return (
    title.includes("kanoon-mate") ||
    title.includes("kanoon mate") ||
    title.includes("smart lms") ||
    title.includes("smartmess") ||
    title.includes("smart mess")
  );
};

const ProjectCard = ({ project, variant = "default", priority = false }) => {
  const summary = project.description || project.summary || "";
  const fallbackImage = "/images/placeholders/content-placeholder.svg";
  const previewImage = project.imageUrl || fallbackImage;
  const localWebpImage =
    previewImage.startsWith("/images/") && previewImage.endsWith(".png")
      ? previewImage.replace(/\.png$/i, ".webp")
      : "";

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackImage;
  };

  const isCollab = isCollaborationProject(project);
  const projectTypeLabel = isCollab ? "Collab" : "Solo";

  const showDetailsButton = Boolean(project?.hasDetails || project?.slug);

  const isFeatured = variant === "featured";

  return (
    <article
      className={`group flex h-full overflow-hidden rounded-xl border border-black/[0.08] bg-white transition-colors duration-150 hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-white/[0.16] ${
        isFeatured ? "flex-col lg:grid lg:grid-cols-[1.15fr_1fr]" : "flex-col"
      }`}
    >
      {/* Preview Frame */}
      <div
        className={`relative overflow-hidden border-b border-black/[0.06] bg-slate-100 dark:border-white/[0.08] dark:bg-[#0b0d14] ${
          isFeatured ? "lg:h-full lg:border-b-0 lg:border-r" : ""
        }`}
      >
        <picture>
          {localWebpImage ? <source srcSet={localWebpImage} type="image/webp" /> : null}
          <img
            src={previewImage}
            alt={`${project.title} preview`}
            className={`w-full object-cover object-[50%_28%] ${
              isFeatured ? "h-56 sm:h-64 lg:h-full lg:min-h-[340px]" : "aspect-[16/10]"
            }`}
            width={640}
            height={isFeatured ? 340 : 400}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            onError={handleImageError}
          />
        </picture>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-12 bg-gradient-to-t from-[#11141c]/50 to-transparent dark:block" />
      </div>

      {/* Content */}
      <div className={`flex flex-1 flex-col justify-between ${isFeatured ? "p-6 sm:p-8" : "p-6"}`}>
        <div>
          {/* Category & Project Type Header */}
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="font-mono text-xs text-slate-500 dark:text-[#7a8296] truncate">
              {isFeatured ? `Flagship · ${project.category || "Full Stack"}` : project.category || "Full Stack"}
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-black/[0.08] bg-slate-50 px-2 py-0.5 font-mono text-xs text-slate-600 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]">
              {isCollab ? <Users size={12} strokeWidth={1.5} /> : <User size={12} strokeWidth={1.5} />}
              {projectTypeLabel}
            </span>
          </div>

          {/* Project Title */}
          <h3
            className={`font-display font-medium tracking-[-0.01em] text-slate-900 transition-colors duration-150 group-hover:text-emerald-700 dark:text-[#eef0f5] dark:group-hover:text-emerald-400 ${
              isFeatured ? "text-xl sm:text-2xl" : "text-lg"
            }`}
          >
            {project.title}
          </h3>

          {/* Description */}
          <p
            className={`mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8] ${
              isFeatured ? "line-clamp-4" : "line-clamp-3"
            }`}
          >
            {summary}
          </p>

          {/* Tech Stack Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.techStack?.slice(0, isFeatured ? 8 : 6).map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center rounded-md border border-black/[0.08] bg-slate-50 px-2 py-0.5 font-mono text-xs text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`mt-6 flex flex-col gap-2.5 ${isFeatured ? "sm:flex-row sm:items-center" : ""}`}>
          {showDetailsButton ? (
            <Link
              to={`/projects/${project.slug}`}
              className={`inline-flex items-center justify-center gap-2 rounded-lg border border-black/[0.10] bg-slate-50 px-4 py-2 text-xs font-medium text-slate-900 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-100 sm:text-sm dark:border-white/[0.10] dark:bg-[#1a1e28] dark:text-[#eef0f5] dark:hover:border-white/[0.18] dark:hover:bg-[#222734] ${
                isFeatured ? "sm:flex-1" : ""
              }`}
            >
              View Details
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          ) : null}

          <div className={`flex flex-wrap gap-2 ${isFeatured ? "sm:flex-1" : ""}`}>
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Project code"
                className="inline-flex min-w-[84px] flex-1 items-center justify-center gap-1.5 rounded-lg border border-black/[0.10] bg-white px-3 py-2 text-xs font-medium text-slate-800 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 sm:text-sm dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#eef0f5] dark:hover:border-white/[0.16] dark:hover:bg-[#1a1e28]"
              >
                <GitHubMark className="h-3.5 w-3.5" />
                Code
              </a>
            ) : null}

            {project.liveDemoUrl ? (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Live demo"
                className="inline-flex min-w-[84px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition-colors duration-150 hover:bg-emerald-700 sm:text-sm dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
              >
                Demo
                <ExternalLink size={13} strokeWidth={1.5} />
              </a>
            ) : null}

            {project.apkUrl ? (
              <a
                href={project.apkUrl}
                download="Vistagram.apk"
                aria-label="Download Android APK"
                title="Download Android APK"
                className="inline-flex min-w-[84px] flex-1 items-center justify-center gap-1.5 rounded-lg border border-black/[0.10] bg-white px-3 py-2 text-xs font-medium text-slate-800 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 sm:text-sm dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#eef0f5] dark:hover:border-white/[0.16] dark:hover:bg-[#1a1e28]"
              >
                APK
                <Download size={13} strokeWidth={1.5} />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
};

const MemoizedProjectCard = memo(ProjectCard);
MemoizedProjectCard.displayName = "ProjectCard";
export default MemoizedProjectCard;
