import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import FadeInUp from "@/components/animations/FadeInUp";
import SectionTitle from "@/components/ui/SectionTitle";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import SeoHead from "@/components/seo/SeoHead";
import { getProjectBySlug } from "@/services/projects.service";
import { getErrorMessage } from "@/services/api";
import { mergeStaticAndApiContent } from "@/services/contentMerge";
import { createBreadcrumbSchema, createProjectSchema } from "@/utils/seo";
import { SIGNATURE_PROJECTS } from "@/data/projectsData";

const ProjectDetailsPage = () => {
  const { slug } = useParams();
  const staticProject = useMemo(
    () => SIGNATURE_PROJECTS.find((item) => item.slug === slug) || null,
    [slug],
  );
  const [project, setProject] = useState(staticProject);
  const [loading, setLoading] = useState(!staticProject);
  const [error, setError] = useState("");
  const fallbackImage = "/images/placeholders/content-placeholder.svg";
  const previewImage = project?.imageUrl || fallbackImage;
  const localWebpImage =
    previewImage.startsWith("/images/") && previewImage.endsWith(".png")
      ? previewImage.replace(/\.png$/i, ".webp")
      : "";

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackImage;
  };

  const loadProject = useCallback(
    async (withSkeleton = false) => {
      if (withSkeleton) {
        setLoading(true);
      }

      setError("");

      try {
        const response = await getProjectBySlug(slug);
        const mergedProject = response.data
          ? mergeStaticAndApiContent(staticProject, response.data)
          : staticProject || null;
        setProject(mergedProject);
      } catch (requestError) {
        if (staticProject) {
          setProject(staticProject);
        } else {
          setError(
            getErrorMessage(
              requestError,
              "Unable to load this project right now.",
            ),
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [slug, staticProject],
  );

  useEffect(() => {
    setProject(staticProject);
    setError("");
    setLoading(!staticProject);
    loadProject(false).catch(() => undefined);
  }, [loadProject, staticProject]);

  const canonicalPath = `/projects/${project?.slug || slug || ""}`;
  const projectSchema = project
    ? createProjectSchema(project, canonicalPath)
    : null;

  return (
    <section className="section-wrap pt-12 sm:pt-20">
      {loading ? (
        <LoadingState
          message="Loading project details..."
          cards={1}
          variant="details"
        />
      ) : null}
      {!loading && error ? (
        <ErrorState message={error} onRetry={() => loadProject(true)} />
      ) : null}
      {!loading && !error && !project ? (
        <EmptyState
          title="Project not found"
          message="This project may have been removed or is unavailable."
        />
      ) : null}

      {!loading && !error && project ? (
        <>
          <SeoHead
            title={`${project.title} - Web Project by Nikhil Agrahari (Full Stack Developer Lucknow & Prayagraj)`}
            description={project.description || project.solutionSummary || `Explore ${project.title}, a full stack web application built by Nikhil Agrahari, premier developer in Lucknow & Prayagraj.`}
            pathname={canonicalPath}
            image={previewImage}
            imageAlt={`${project.title} - Project by Nikhil Agrahari`}
            keywords={[
              project.title,
              `${project.title} Nikhil Agrahari`,
              `${project.title} Full Stack Project`,
              "best full stack developer in lucknow projects",
              "best full stack developer in prayagraj projects",
              project.category,
              ...(Array.isArray(project.techStack) ? project.techStack : []),
              "Nikhil Agrahari Lucknow Prayagraj",
            ]}
            jsonLd={[
              createBreadcrumbSchema([
                { name: "Home", path: "/" },
                { name: "Projects", path: "/projects" },
                { name: project.title, path: canonicalPath },
              ]),
              projectSchema,
            ]}
          />

          <Link
            to="/projects"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-cyan-200 hover:text-emerald-800 dark:hover:text-cyan-100 transition"
          >
            <ArrowLeft size={16} /> Back to Projects
          </Link>

          <article className="space-y-5">
            <FadeInUp>
              <header className="card-surface rounded-2xl p-6">
                {/* Tags */}
                {project.tags?.length ? (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider"
                      >
                        🏷️ {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <SectionTitle
                  mobileCenter={false}
                  eyebrow={project.category}
                  title={project.title}
                  description={project.description}
                />

                {project.tagline ? (
                  <p className="mt-3 text-xs uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400 font-mono font-semibold">
                    {project.tagline}
                  </p>
                ) : null}

                {project.status ? (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                    📌 Status: {project.status}
                  </div>
                ) : null}

                <div className="mt-5 flex flex-wrap items-center gap-4 text-slate-800 dark:text-slate-200">
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 transition shadow-xs"
                    >
                      <ExternalLink size={15} /> GitHub Repository
                    </a>
                  ) : null}
                  {project.liveDemoUrl ? (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 text-black px-4 py-2 text-xs font-black uppercase tracking-wider hover:bg-emerald-400 transition shadow-md"
                    >
                      <ExternalLink size={15} /> Live Demo
                    </a>
                  ) : null}
                </div>
              </header>
            </FadeInUp>

            <FadeInUp delay={0.06}>
              <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-cyan-300/20 bg-slate-100 dark:bg-slate-900/70">
                <picture>
                  {localWebpImage ? (
                    <source srcSet={localWebpImage} type="image/webp" />
                  ) : null}
                  <img
                    src={previewImage}
                    alt={`${project.title} cover`}
                    className="h-auto max-h-[460px] w-full object-cover"
                    width={1280}
                    height={720}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    onError={handleImageError}
                  />
                </picture>
              </div>
            </FadeInUp>

            {/* Overview */}
            {project.overview ? (
              <FadeInUp delay={0.08}>
                <div className="card-surface rounded-2xl p-6">
                  <h2 className="text-xl font-black text-slate-900 dark:text-cyan-100 flex items-center gap-2">
                    📌 Overview
                  </h2>
                  <p className="mt-3 text-slate-700 dark:text-slate-300 leading-relaxed text-sm font-medium">
                    {project.overview}
                  </p>
                </div>
              </FadeInUp>
            ) : null}

            {/* Problem & Solution */}
            <FadeInUp delay={0.1}>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="card-surface rounded-2xl p-6">
                  <h2 className="text-xl font-black text-slate-900 dark:text-cyan-100 flex items-center gap-2">
                    🎯 Problem
                  </h2>
                  <p className="mt-3 text-slate-700 dark:text-slate-300 leading-relaxed text-sm font-medium">
                    {project.problemStatement ||
                      "Problem statement will be updated soon."}
                  </p>
                </div>
                <div className="card-surface rounded-2xl p-6">
                  <h2 className="text-xl font-black text-slate-900 dark:text-cyan-100 flex items-center gap-2">
                    💡 Solution
                  </h2>
                  <p className="mt-3 text-slate-700 dark:text-slate-300 leading-relaxed text-sm font-medium">
                    {project.solutionSummary ||
                      "Solution details will be updated soon."}
                  </p>
                </div>
              </div>
            </FadeInUp>

            {/* Key Features */}
            {project.highlights?.length ? (
              <FadeInUp delay={0.12}>
                <div className="card-surface rounded-2xl p-6">
                  <h2 className="text-xl font-black text-slate-900 dark:text-cyan-100 flex items-center gap-2">
                    🚀 Key Features
                  </h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {project.highlights.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-2.5 rounded-xl border border-slate-200/90 dark:border-white/[0.06] bg-slate-100/90 dark:bg-slate-900/60 p-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-xs"
                      >
                        <span className="shrink-0">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInUp>
            ) : null}

            {/* Challenges & Outcomes */}
            {project.challenges?.length || project.outcomes?.length ? (
              <FadeInUp delay={0.14}>
                <div className="grid gap-4 lg:grid-cols-2">
                  {project.challenges?.length ? (
                    <div className="card-surface rounded-2xl p-6">
                      <h2 className="text-xl font-black text-slate-900 dark:text-cyan-100 flex items-center gap-2">
                        🛠️ Challenges
                      </h2>
                      <ul className="mt-3 space-y-2.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                        {project.challenges.map((c) => (
                          <li key={c} className="flex gap-2.5 items-start">
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500 dark:bg-amber-400" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {project.outcomes?.length ? (
                    <div className="card-surface rounded-2xl p-6">
                      <h2 className="text-xl font-black text-slate-900 dark:text-cyan-100 flex items-center gap-2">
                        🏆 Outcomes
                      </h2>
                      <ul className="mt-3 space-y-2.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                        {project.outcomes.map((o) => (
                          <li key={o} className="flex gap-2.5 items-start">
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                            <span>{o}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </FadeInUp>
            ) : null}

            {/* Technologies Used (Grouped or Flat) */}
            <FadeInUp delay={0.16}>
              <div className="card-surface rounded-2xl p-6">
                <h2 className="text-xl font-black text-slate-900 dark:text-cyan-100 flex items-center gap-2">
                  🧰 Technologies Used
                </h2>
                {project.techStackGrouped ? (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(project.techStackGrouped).map(([category, stack]) => (
                      <div
                        key={category}
                        className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-slate-900/60 p-4 shadow-xs"
                      >
                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                          {category}
                        </h3>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {stack.map((item) => (
                            <span
                              key={item}
                              className="rounded-md border border-emerald-300/40 dark:border-cyan-300/20 bg-emerald-500/10 dark:bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-emerald-900 dark:text-cyan-200"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.techStack?.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-slate-300 dark:border-cyan-300/25 bg-slate-100 dark:bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-cyan-100 shadow-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </FadeInUp>

            {/* Collaboration & Team */}
            {project.collaboration ? (
              <FadeInUp delay={0.18}>
                <div className="card-surface rounded-2xl p-6">
                  <h2 className="text-xl font-black text-slate-900 dark:text-cyan-100 flex items-center gap-2">
                    👥 Collaboration
                  </h2>
                  <div className="mt-3 space-y-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
                    <p>
                      <strong className="text-slate-900 dark:text-white font-extrabold">Team:</strong> {project.collaboration.team}
                    </p>
                    <div>
                      <strong className="text-slate-900 dark:text-white font-extrabold">Members:</strong>
                      <div className="mt-1.5 flex flex-wrap gap-2">
                        {project.collaboration.members.map((m) => (
                          <span
                            key={m}
                            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                    {project.collaboration.context && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                        {project.collaboration.context}
                      </p>
                    )}
                  </div>
                </div>
              </FadeInUp>
            ) : null}

            {/* Key Learnings */}
            {project.learnings?.length ? (
              <FadeInUp delay={0.2}>
                <div className="card-surface rounded-2xl p-6">
                  <h2 className="text-xl font-black text-slate-900 dark:text-cyan-100 flex items-center gap-2">
                    🎓 Key Learnings
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.learnings.map((learning) => (
                      <span
                        key={learning}
                        className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-bold text-purple-900 dark:text-purple-300"
                      >
                        🧠 {learning}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeInUp>
            ) : null}
          </article>
        </>
      ) : null}
    </section>
  );
};

export default ProjectDetailsPage;
