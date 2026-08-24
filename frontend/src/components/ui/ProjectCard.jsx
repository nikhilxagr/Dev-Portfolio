import { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Download } from "lucide-react";

// GitHub SVG icon
const GitHubMark = ({ className = "h-[13px] w-[13px]" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12 0.5C5.65 0.5 0.5 5.65 0.5 12C0.5 17.08 3.79 21.39 8.35 22.91C8.93 23.01 9.14 22.66 9.14 22.35C9.14 22.08 9.13 21.36 9.12 20.41C5.9 21.1 5.22 18.86 5.22 18.86C4.69 17.49 3.93 17.13 3.93 17.13C2.87 16.42 4.01 16.44 4.01 16.44C5.18 16.52 5.8 17.66 5.8 17.66C6.84 19.4 8.53 18.89 9.2 18.59C9.3 17.84 9.6 17.33 9.94 17.03C7.37 16.75 4.67 15.77 4.67 11.38C4.67 10.13 5.13 9.11 5.9 8.31C5.78 8.02 5.37 6.84 6.01 5.25C6.01 5.25 6.99 4.94 9.13 6.34C10.07 6.08 11.08 5.95 12.09 5.94C13.1 5.95 14.11 6.08 15.05 6.34C17.19 4.94 18.17 5.25 18.17 5.25C18.81 6.84 18.4 8.02 18.28 8.31C19.05 9.11 19.51 10.13 19.51 11.38C19.51 15.78 16.8 16.74 14.22 17.02C14.66 17.39 15.06 18.11 15.06 19.2C15.06 20.76 15.04 22.01 15.04 22.35C15.04 22.66 15.25 23.01 15.84 22.91C20.41 21.39 23.69 17.08 23.69 12C23.69 5.65 18.54 0.5 12.19 0.5H12Z" />
  </svg>
);

// Tech icon map with color themes
const TECH_ICONS = {
  React:          { bg: "bg-[#61DAFB]/10", border: "border-[#61DAFB]/35", text: "text-[#61DAFB]" },
  "Node.js":      { bg: "bg-[#68A063]/10", border: "border-[#68A063]/35", text: "text-[#68A063]" },
  Express:        { bg: "bg-white/5",      border: "border-white/20",     text: "text-slate-200" },
  MongoDB:        { bg: "bg-[#47A248]/10", border: "border-[#47A248]/35", text: "text-emerald-400" },
  "Socket.IO":    { bg: "bg-white/8",      border: "border-white/20",     text: "text-slate-200" },
  "Socket.io":    { bg: "bg-emerald-500/10", border: "border-emerald-500/35", text: "text-emerald-300" },
  "Redux Toolkit": { bg: "bg-[#764ABC]/10", border: "border-[#764ABC]/35", text: "text-purple-300" },
  Cloudinary:     { bg: "bg-[#3448C5]/10", border: "border-[#3448C5]/35", text: "text-blue-300" },
  JWT:            { bg: "bg-[#FB015B]/10", border: "border-[#FB015B]/35", text: "text-pink-300" },
  Vercel:         { bg: "bg-white/5",      border: "border-white/20",     text: "text-slate-200" },
  "Tailwind CSS": { bg: "bg-[#06B6D4]/10", border: "border-[#06B6D4]/35", text: "text-cyan-300" },
  TailwindCSS:    { bg: "bg-[#06B6D4]/10", border: "border-[#06B6D4]/35", text: "text-cyan-300" },
  Python:         { bg: "bg-[#3776AB]/10", border: "border-[#3776AB]/35", text: "text-blue-300" },
  Django:         { bg: "bg-[#092E20]/30", border: "border-green-800/40", text: "text-green-400" },
  PostgreSQL:     { bg: "bg-[#336791]/10", border: "border-[#336791]/35", text: "text-blue-300" },
  MySQL:          { bg: "bg-[#4479A1]/10", border: "border-[#4479A1]/35", text: "text-blue-300" },
  HTML:           { bg: "bg-[#E34F26]/10", border: "border-[#E34F26]/35", text: "text-orange-400" },
  CSS:            { bg: "bg-[#1572B6]/10", border: "border-[#1572B6]/35", text: "text-blue-400" },
  JavaScript:     { bg: "bg-[#F7DF1E]/10", border: "border-[#F7DF1E]/35", text: "text-yellow-300" },
  TypeScript:     { bg: "bg-[#3178C6]/10", border: "border-[#3178C6]/35", text: "text-blue-300" },
  "Next.js":      { bg: "bg-white/5",      border: "border-white/20",     text: "text-slate-200" },
  Redux:          { bg: "bg-[#764ABC]/10", border: "border-[#764ABC]/35", text: "text-purple-300" },
  Firebase:       { bg: "bg-[#FFCA28]/10", border: "border-[#FFCA28]/35", text: "text-yellow-300" },
  AWS:            { bg: "bg-[#FF9900]/10", border: "border-[#FF9900]/35", text: "text-orange-300" },
  Docker:         { bg: "bg-[#2496ED]/10", border: "border-[#2496ED]/35", text: "text-blue-300" },
  "React Router DOM": { bg: "bg-[#CA4245]/10", border: "border-[#CA4245]/35", text: "text-red-300" },
  Axios:          { bg: "bg-purple-400/10", border: "border-purple-400/30", text: "text-purple-300" },
  Zod:            { bg: "bg-blue-400/10",  border: "border-blue-400/30",  text: "text-blue-300" },
  "TanStack Query": { bg: "bg-red-400/10", border: "border-red-400/30",   text: "text-red-300" },
  "Express.js":   { bg: "bg-white/5",      border: "border-white/20",     text: "text-slate-200" },
  "Node.JS":      { bg: "bg-[#68A063]/10", border: "border-[#68A063]/35", text: "text-[#68A063]" },
  "Gemini API":   { bg: "bg-cyan-500/10",  border: "border-cyan-500/35",  text: "text-cyan-300" },
  "OCR":          { bg: "bg-emerald-500/10", border: "border-emerald-500/35", text: "text-emerald-300" },
  "yt-dlp":       { bg: "bg-red-500/10", border: "border-red-500/35", text: "text-red-400" },
  "FFmpeg":       { bg: "bg-teal-500/10", border: "border-teal-500/35", text: "text-teal-300" },
  "Innertube":    { bg: "bg-purple-500/10", border: "border-purple-500/35", text: "text-purple-300" },
  "Git":          { bg: "bg-orange-500/10", border: "border-orange-500/35", text: "text-orange-400" },
};

const getTechStyle = (tech) =>
  TECH_ICONS[tech] || { bg: "bg-white/5", border: "border-white/15", text: "text-slate-300" };

// Project Card component
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

  const showDetailsButton =
    project.hasDetails ||
    ["intube", "intube-media-downloader", "vistagram", "kanoon-mate", "fast-feast", "snapurl", "ai-powered-code-reviewer"].includes(project.slug);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:bg-[#050d14] dark:border-white/[0.08] shadow-md dark:shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-green-500/40 dark:hover:border-green-400/30 hover:shadow-xl transform-gpu will-change-transform">
      {/* screenshot */}
      <div className="relative overflow-hidden">
        <picture>
          {localWebpImage ? <source srcSet={localWebpImage} type="image/webp" /> : null}
          <img
            src={previewImage}
            alt={`${project.title} preview`}
            className="h-[190px] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] transform-gpu will-change-transform"
            width={640}
            height={190}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            onError={handleImageError}
          />
        </picture>
        {/* bottom fade */}
        <div className="pointer-events-none absolute inset-0 hidden dark:block bg-gradient-to-t from-[#030a03]/60 via-transparent to-transparent" />
      </div>

      {/* content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Project Title */}
        <h3 className="font-display text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
          {project.title}
        </h3>

        {/* Description */}
        <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
          {summary}
        </p>


        {/* Tech Stack badges */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack?.slice(0, 6).map((tech) => {
            const style = getTechStyle(tech);
            return (
              <span
                key={tech}
                className={`inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-semibold ${style.bg} ${style.border} ${style.text}`}
              >
                {tech}
              </span>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-col gap-2">
          {/* View Details button for top projects */}
          {showDetailsButton ? (
            <Link
              to={`/projects/${project.slug}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-green-500/15 text-emerald-600 dark:text-emerald-300 hover:border-emerald-400 hover:bg-emerald-500 hover:text-black dark:hover:text-black px-4 py-2 text-xs font-black uppercase tracking-widest transition-all duration-200 shadow-sm"
            >
              View Details
              <ArrowRight size={13} />
            </Link>
          ) : null}

          <div className="flex gap-2.5">
            {/* CODE button */}
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Project code"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/30 dark:hover:bg-white/10 dark:hover:text-white px-3 py-2 text-xs font-black uppercase tracking-widest transition-all duration-200"
              >
                <GitHubMark className="h-3.5 w-3.5" />
                Code
              </a>
            ) : (
              <span className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700/40 dark:bg-slate-800/30 dark:text-slate-600 px-3 py-2 text-xs font-black uppercase tracking-widest">
                <GitHubMark className="h-3.5 w-3.5" />
                Code
              </span>
            )}

            {/* DEMO button */}
            {project.liveDemoUrl ? (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Live demo"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-500 text-black px-3 py-2 text-xs font-black uppercase tracking-widest transition-all duration-200 hover:bg-green-400 hover:shadow-[0_6px_20px_rgba(34,197,94,0.4)]"
              >
                Demo
                <ExternalLink size={11} />
              </a>
            ) : (
              <span className="flex flex-1 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:bg-green-500/20 dark:border-green-500/30 dark:text-green-600 px-3 py-2 text-xs font-black uppercase tracking-widest">
                Demo
              </span>
            )}

            {/* APK button */}
            {project.apkUrl ? (
              <a
                href={project.apkUrl}
                download="Vistagram.apk"
                aria-label="Download Android APK"
                title="Download Android APK"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500 hover:text-black dark:hover:text-black px-3 py-2 text-xs font-black uppercase tracking-widest transition-all duration-200"
              >
                APK
                <Download size={11} />
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
