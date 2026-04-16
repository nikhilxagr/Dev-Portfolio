import { useEffect, useMemo, useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import ProjectCard from "@/components/ui/ProjectCard";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import { StaggerGrid, StaggerItem } from "@/components/animations/StaggerGrid";
import { PROJECT_CATEGORIES, SIGNATURE_PROJECTS } from "@/constants/siteData";
import { getProjects } from "@/services/projects.service";
import { mergeStaticAndApiContent } from "@/services/contentMerge";
import { createBreadcrumbSchema, createItemListSchema } from "@/utils/seo";

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

  const fallbackProjects = useMemo(
    () =>
      SIGNATURE_PROJECTS.filter((project) =>
        matchesProjectFilters(project, category, search),
      ),
    [category, search],
  );
  const displayProjects = projects.length > 0 ? projects : fallbackProjects;
  const showInitialLoader = loading && displayProjects.length === 0;
  const projectListSchema = useMemo(
    () =>
      createItemListSchema({
        name: "Nikhil Project Archive",
        description: "Project portfolio by Nikhil Agrahari.",
        path: "/projects",
        items: displayProjects
          .filter((item) => Boolean(item?.slug))
          .slice(0, 60)
          .map((item) => ({
            name: item.title,
            path: `/projects/${item.slug}`,
          })),
      }),
    [displayProjects],
  );

  return (
    <>
      <SeoHead
        title="Projects"
        description="Project portfolio of Nikhil Agrahari covering web development, secure engineering practical builds, and AI-focused experiments."
        pathname="/projects"
        keywords={[
          "Nikhil portfolio projects",
          "Nikhil Lucknow projects",
          "full stack and engineering projects",
        ]}
        jsonLd={[
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
          ]),
          projectListSchema,
        ]}
      />

      <section className="section-wrap pt-12 sm:pt-20">
        <SectionTitle
          eyebrow="Projects"
          title="Project Portfolio and Engineering Practicals"
          description="Browse projects by category, technology stack, and implementation focus."
        />

        <p className="mt-4 max-w-3xl text-sm text-slate-400">
          Project data is loaded from backend sources with static fallback content.
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
          {showInitialLoader ? (
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

          {displayProjects.length > 0 ? (
            <StaggerGrid className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {displayProjects.map((project, index) => (
                <StaggerItem key={project._id || project.slug}>
                  <ProjectCard
                    project={project}
                    variant="featured"
                    priority={index < 3}
                  />
                </StaggerItem>
              ))}
            </StaggerGrid>
          ) : null}

          {loading && displayProjects.length > 0 ? (
            <p className="mt-4 text-xs uppercase tracking-[0.14em] text-slate-500">
              Syncing latest projects...
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
};

export default ProjectsPage;
