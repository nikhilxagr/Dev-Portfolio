import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import SectionTitle from "@/components/ui/SectionTitle";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import ProjectCard from "@/components/ui/ProjectCard";
import { PROJECT_CATEGORIES, SIGNATURE_PROJECTS } from "@/constants/siteData";
import { getProjects } from "@/services/projects.service";
import { getErrorMessage } from "@/services/api";

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
        return {
          ...staticProject,
          ...project,
        };
      });
      setProjects(merged);
    } catch (requestError) {
      setError(
        getErrorMessage(requestError, "Unable to load projects right now."),
      );
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

  const fallbackProjects = SIGNATURE_PROJECTS.filter((project) => {
    const matchesCategory = category === "All" || project.category === category;
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return matchesCategory;
    }

    const searchable =
      `${project.title} ${project.tagline} ${project.description} ${(project.techStack || []).join(" ")}`.toLowerCase();
    return matchesCategory && searchable.includes(keyword);
  });

  const displayProjects = projects.length > 0 ? projects : fallbackProjects;

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
          This section combines live backend data with curated signature project
          narratives from my verified portfolio profile.
        </p>

        <div className="mt-8 rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-4">
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
        </div>

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
          {!loading && error && displayProjects.length > 0 ? (
            <div className="mb-4 rounded-xl border border-amber-300/35 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
              Live API is temporarily unavailable. Showing local portfolio
              project data.
            </div>
          ) : null}
          {!loading && !error && displayProjects.length === 0 ? (
            <EmptyState
              title="No projects found"
              message="Try changing filters or search terms to discover matching projects."
            />
          ) : null}

          {!loading && displayProjects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {displayProjects.map((project) => (
                <ProjectCard
                  key={project._id || project.slug}
                  project={project}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
};

export default ProjectsPage;
