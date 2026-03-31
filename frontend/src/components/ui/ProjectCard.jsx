import { Link } from 'react-router-dom'

const ProjectCard = ({ project }) => {
  const summary = project.description || project.summary || ''

  return (
    <article className="card-surface h-full rounded-2xl p-5 transition hover:-translate-y-1">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">
          {project.category}
        </span>
        {project.featured ? (
          <span className="rounded-full border border-cyan-300/30 px-2 py-1 text-[11px] text-cyan-200">Featured</span>
        ) : null}
      </div>

      {project.tagline ? <p className="text-xs uppercase tracking-[0.15em] text-slate-500">{project.tagline}</p> : null}
      <h3 className="text-xl font-semibold text-cyan-100">{project.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-slate-300">{summary}</p>

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

      <div className="mt-5 space-y-3">
        <Link to={`/projects/${project.slug}`} className="inline-block text-sm font-semibold text-cyan-200 hover:text-cyan-100">
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
  )
}

export default ProjectCard
