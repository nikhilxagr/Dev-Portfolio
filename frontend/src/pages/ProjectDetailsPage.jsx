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
import { SIGNATURE_PROJECTS } from "@/constants/siteData";

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
            title={project.title}
            description={project.description || project.solutionSummary}
            pathname={canonicalPath}
            image={previewImage}
            imageAlt={`${project.title} cover`}
            keywords={[
              project.category,
              ...(Array.isArray(project.techStack) ? project.techStack : []),
              "Nikhil project",
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
            className="mb-6 inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-cyan-100"
          >
            <ArrowLeft size={16} /> Back to Projects
          </Link>

          <article className="space-y-5">
            <FadeInUp>
              <header className="card-surface rounded-2xl p-6">
                <SectionTitle
                  mobileCenter={false}
                  eyebrow={project.category}
                  title={project.title}
                  description={project.description}
                />

                {project.tagline ? (
                  <p className="mt-3 text-xs uppercase tracking-[0.14em] text-slate-500">
                    {project.tagline}
                  </p>
                ) : null}

                <div className="mt-5 flex flex-wrap items-center gap-4 text-slate-200">
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm hover:text-cyan-100"
                    >
                      <ExternalLink size={16} /> GitHub
                    </a>
                  ) : null}
                  {project.liveDemoUrl ? (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm hover:text-cyan-100"
                    >
                      <ExternalLink size={16} /> Live Demo
                    </a>
                  ) : null}
                </div>
              </header>
            </FadeInUp>

            <FadeInUp delay={0.06}>
              <div className="overflow-hidden rounded-2xl border border-cyan-300/20 bg-slate-900/70">
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

            <FadeInUp delay={0.1}>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="card-surface rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-cyan-100">
                    Problem
                  </h2>
                  <p className="mt-3 text-slate-300">
                    {project.problemStatement ||
                      "Problem statement will be updated soon."}
                  </p>
                </div>
                <div className="card-surface rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-cyan-100">
                    Solution
                  </h2>
                  <p className="mt-3 text-slate-300">
                    {project.solutionSummary ||
                      "Solution details will be updated soon."}
                  </p>
                </div>
              </div>
            </FadeInUp>

            {project.outcome ? (
              <div className="card-surface rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-cyan-100">Outcome</h2>
                <p className="mt-3 text-slate-300">{project.outcome}</p>
              </div>
            ) : null}

            {project.highlights?.length ? (
              <div className="card-surface rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-cyan-100">
                  Key Highlights
                </h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {project.highlights.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="card-surface rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-cyan-100">
                Tech Stack
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.techStack?.length ? (
                  project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-cyan-300/25 bg-slate-900/80 px-2 py-1 text-xs text-cyan-100"
                    >
                      {tech}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">
                    No tech stack tags available.
                  </p>
                )}
              </div>
            </div>
          </article>
        </>
      ) : null}
    </section>
  );
};

export default ProjectDetailsPage;
