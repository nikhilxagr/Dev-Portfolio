import { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProjectCard from "@/components/ui/ProjectCard";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import FadeInUp from "@/components/animations/FadeInUp";

const PROJECT_FILTER_TABS = [
  "All",
  "Full Stack",
  "Web Dev",
  "Solo",
  "Collab",
  "AI",
  "Cyber Security",
];

const ProjectsSection = ({
  projectFilter,
  setProjectFilter,
  loadingProjects,
  projectError,
  filteredProjects,
  mergedFeaturedProjects,
}) => {
  const makeTabClickHandler = useCallback(
    (tab) => () => setProjectFilter(tab),
    [setProjectFilter],
  );

  return (
    <section className="section-wrap section-divider">
      <FadeInUp>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Selected Work
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-[-0.02em] text-slate-900 sm:text-4xl dark:text-[#eef0f5]">
              Featured Projects
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-[#a3a9b8]">
              Production web apps, APIs, and security tools with architecture notes and source code.
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-emerald-700 transition-colors duration-150 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            All projects
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </FadeInUp>

      <div className="mt-8 flex flex-wrap gap-2">
        {PROJECT_FILTER_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={makeTabClickHandler(tab)}
            className={`inline-flex h-9 items-center rounded-lg border px-3.5 text-xs font-medium transition-colors duration-150 sm:text-sm ${
              projectFilter === tab
                ? "border-emerald-600/40 bg-emerald-500/10 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300"
                : "border-black/[0.08] bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8] dark:hover:border-white/[0.16] dark:hover:text-[#eef0f5]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {loadingProjects ? <LoadingState message="Loading featured projects..." /> : null}
        {!loadingProjects && projectError && mergedFeaturedProjects.length === 0 ? (
          <EmptyState title="Could not fetch projects" message={projectError} />
        ) : null}
        {!loadingProjects && filteredProjects.length > 0 ? (
          <div className="space-y-6">
            {filteredProjects.length >= 2 ? (
              <ProjectCard
                key={filteredProjects[0]._id || filteredProjects[0].slug}
                project={filteredProjects[0]}
                variant="featured"
                priority
              />
            ) : null}

            <div className="grid gap-6 md:grid-cols-2">
              {(filteredProjects.length >= 2
                ? filteredProjects.slice(1, 3)
                : filteredProjects.slice(0, 1)
              ).map((project, index) => (
                <ProjectCard
                  key={project._id || project.slug}
                  project={project}
                  priority={index === 0}
                />
              ))}
            </div>
          </div>
        ) : null}
        {!loadingProjects && filteredProjects.length === 0 && !projectError ? (
          <EmptyState title="No projects in this category" message="Try selecting a different filter." />
        ) : null}
      </div>
    </section>
  );
};

const MemoizedProjectsSection = memo(ProjectsSection);
MemoizedProjectsSection.displayName = "ProjectsSection";

export default MemoizedProjectsSection;
