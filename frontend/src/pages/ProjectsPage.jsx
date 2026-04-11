import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Rocket } from "lucide-react";
import Button from "@/components/ui/Button";
import SectionTitle from "@/components/ui/SectionTitle";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import ProjectCard from "@/components/ui/ProjectCard";
import FadeInUp from "@/components/animations/FadeInUp";
import { StaggerGrid, StaggerItem } from "@/components/animations/StaggerGrid";
import { PROJECT_CATEGORIES, SIGNATURE_PROJECTS } from "@/constants/siteData";
import { getProjects } from "@/services/projects.service";
import { mergeStaticAndApiContent } from "@/services/contentMerge";

const matchesProjectFilters = (project, selectedCategory, currentSearch) => {
  const matchesCategory =
    selectedCategory === "All" || project.category === selectedCategory;
  const keyword = currentSearch.trim().toLowerCase();

  if (!keyword) {
    return matchesCategory;
  }

  const searchable =
    `${project.title} ${project.tagline} ${project.description} ${(
      project.techStack || []
    ).join(" ")}`.toLowerCase();

  return matchesCategory && searchable.includes(keyword);
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = async (currentCategory, currentSearch) => {
    setLoading(true);
    setError("");

    try {
      const params = {};
      if (currentCategory !== "All") {
        params.category = currentCategory;
      }
      if (currentSearch.trim()) {
        params.search = currentSearch.trim();
      }

      const response = await getProjects(params);
      const merged = (response.data || []).map((project) => {
        const staticProject = SIGNATURE_PROJECTS.find(
          (item) => item.slug === project.slug,
        );
        return mergeStaticAndApiContent(staticProject, project);
      });
      setProjects(merged);
    } catch {
      setError("");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadProjects(category, search).catch(() => undefined);
    }, 280);

    return () => clearTimeout(timeoutId);
  }, [category, search]);

  const fallbackProjects = SIGNATURE_PROJECTS.filter((project) =>
    matchesProjectFilters(project, category, search),
  );

  const displayProjects = projects.length > 0 ? projects : fallbackProjects;
  const fallbackProjectImage = "/images/placeholders/content-placeholder.svg";
  const liveDemoCount = displayProjects.filter((project) =>
    Boolean(project.liveDemoUrl),
  ).length;
  const githubCount = displayProjects.filter((project) =>
    Boolean(project.githubUrl),
  ).length;

  const handleProjectPreviewError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackProjectImage;
  };

  return (
    <>
      <Helmet>
        <title>Projects | Nikhil Portfolio</title>
        <meta
          name="description"
          content="Project portfolio covering web development, cybersecurity, and AI-based systems."
        />
      </Helmet>

      <section className="section-wrap pt-12 sm:pt-20">
        <SectionTitle
          eyebrow="Projects"
          title="Builds, Security Labs & AI Experiments"
          description="Filter and search through my project archive by domain and technology focus."
        />

        <p className="mt-4 max-w-3xl text-sm text-slate-400">
          Projects are loaded from backend data with static fallback content.
        </p>

        <FadeInUp className="mt-8 rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-4">
          <div className="grid gap-3 md:grid-cols-2 md:items-center">
            <div className="flex flex-wrap gap-2">
              {PROJECT_CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    category === item
                      ? "border-cyan-300 bg-cyan-300/15 text-cyan-100"
                      : "border-slate-600 text-slate-300 hover:border-cyan-300/50 hover:text-cyan-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, description, or tech stack"
              className="w-full rounded-xl border border-cyan-300/25 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-300"
            />
          </div>

          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-slate-500">
            Showing {displayProjects.length} project
            {displayProjects.length === 1 ? "" : "s"}
          </p>
        </FadeInUp>

        <div className="mt-8">
          {loading ? (
            <LoadingState message="Loading projects..." cards={6} />
          ) : null}
          {!loading && error && displayProjects.length === 0 ? (
            <ErrorState
              message={error}
              onRetry={() => loadProjects(category, search)}
            />
          ) : null}
          {!loading && !error && displayProjects.length === 0 ? (
            <EmptyState
              title="No projects found"
              message="Try changing filters or search terms to discover matching projects."
            />
          ) : null}

          {!loading && displayProjects.length > 0 ? (
            <>
              <StaggerGrid className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {displayProjects.map((project) => (
                  <StaggerItem key={project._id || project.slug}>
                    <ProjectCard project={project} variant="featured" />
                  </StaggerItem>
                ))}
              </StaggerGrid>

              <FadeInUp delay={0.16} className="mt-7">
                <article className="group relative overflow-hidden rounded-[1.8rem] border border-cyan-300/40 bg-gradient-to-br from-blue-600/30 via-slate-900/90 to-violet-600/35 p-6 shadow-[0_26px_65px_-34px_rgba(56,189,248,0.75)] sm:p-7">
                  <div className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-cyan-200/15 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-20 -left-12 h-52 w-52 rounded-full bg-violet-300/20 blur-3xl" />

                  <div className="relative grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/85">
                        Project Archive
                      </p>

                      <div className="mt-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-100/35 bg-cyan-100/10 text-cyan-100 shadow-[0_12px_26px_-16px_rgba(103,232,249,0.95)]">
                        <Rocket size={26} strokeWidth={2.1} />
                      </div>

                      <h3 className="mt-5 text-3xl font-semibold text-cyan-50 sm:text-4xl">
                        View All Projects
                      </h3>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-200/90">
                        This is the full project archive with practical builds,
                        detailed pages, code repositories, and live demos. Use
                        filters above to explore by stack and domain.
                      </p>

                      <div className="mt-6 grid max-w-md grid-cols-3 gap-2">
                        <div className="rounded-xl border border-cyan-100/20 bg-slate-950/45 p-3 text-center">
                          <p className="font-display text-xl text-cyan-100 sm:text-2xl">
                            {displayProjects.length}
                          </p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-cyan-100/70">
                            Projects
                          </p>
                        </div>

                        <div className="rounded-xl border border-cyan-100/20 bg-slate-950/45 p-3 text-center">
                          <p className="font-display text-xl text-cyan-100 sm:text-2xl">
                            {liveDemoCount}
                          </p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-cyan-100/70">
                            Live Demos
                          </p>
                        </div>

                        <div className="rounded-xl border border-cyan-100/20 bg-slate-950/45 p-3 text-center">
                          <p className="font-display text-xl text-cyan-100 sm:text-2xl">
                            {githubCount}
                          </p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-cyan-100/70">
                            Code Links
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button
                          to="/projects"
                          className="border border-cyan-100/45 bg-cyan-100/95 text-slate-900 hover:bg-cyan-50"
                        >
                          Refresh Project View <ArrowRight size={16} />
                        </Button>
                        <Button
                          to="/contact"
                          className="border border-cyan-100/40 bg-transparent text-cyan-50 hover:bg-cyan-100/10"
                        >
                          Start a Project
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {displayProjects.slice(0, 6).map((project) => (
                        <div
                          key={`${project.slug}-archive-preview`}
                          className="overflow-hidden rounded-lg border border-cyan-100/20 bg-slate-950/55"
                        >
                          <img
                            src={project.imageUrl || fallbackProjectImage}
                            alt={`${project.title} preview`}
                            className="h-20 w-full object-cover transition-transform duration-500 group-hover:scale-[1.06] sm:h-24"
                            loading="lazy"
                            onError={handleProjectPreviewError}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </FadeInUp>
            </>
          ) : null}
        </div>
      </section>
    </>
  );
};

export default ProjectsPage;
