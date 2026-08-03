import { memo, useCallback } from "react";
import { ArrowRight, Filter, GitBranch, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import ProjectCard from "@/components/ui/ProjectCard";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import FadeInUp from "@/components/animations/FadeInUp";
import { PRACTICALS } from "@/constants/siteData";

const PROJECT_FILTER_TABS = ["All", "Web Dev", "Cyber Security", "AI"];

const ProjectsSection = ({
  projectFilter,
  setProjectFilter,
  loadingProjects,
  projectError,
  filteredProjects,
  mergedFeaturedProjects,
  liveDemoCount,
}) => {
  const fallbackProjectImage = "/images/placeholders/content-placeholder.svg";
  const handleProjectPreviewError = useCallback((event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackProjectImage;
  }, []);

  // Memoized per-tab click factory to avoid function recreation on every render
  const makeTabClickHandler = useCallback(
    (tab) => () => setProjectFilter(tab),
    [setProjectFilter],
  );

  return (
    <>
      <section className="section-wrap section-divider pt-10">
        <FadeInUp>
          <div className="relative text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-green-400/35 bg-green-400/10 px-3 py-1 font-display text-[10px] uppercase tracking-[0.2em] text-green-300 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              Featured Projects
            </p>
            <h2 className="mt-3 font-display text-4xl font-black sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-green-300 via-emerald-300 to-lime-300 bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300">
              Selected projects with implementation details, source code, and live demos.
            </p>
          </div>
        </FadeInUp>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {PROJECT_FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={makeTabClickHandler(tab)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                projectFilter === tab
                  ? "border-green-400 bg-green-400/15 text-green-300"
                  : "border-white/12 bg-white/5 text-slate-400 hover:border-green-400/40 hover:text-green-400"
              }`}
            >
              <Filter size={10} />
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-7">
          {loadingProjects ? <LoadingState message="Loading featured projects..." /> : null}
          {!loadingProjects && projectError && mergedFeaturedProjects.length === 0 ? (
            <EmptyState title="Could not fetch projects" message={projectError} />
          ) : null}
          {!loadingProjects && filteredProjects.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(260px,0.9fr)]">
              {filteredProjects.slice(0, 3).map((project, index) => (
                <ProjectCard key={project._id || project.slug} project={project} priority={index < 2} />
              ))}

              <FadeInUp delay={0.24} className="h-full">
                <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md dark:border-green-400/35 dark:bg-[#050d14] dark:bg-gradient-to-br dark:from-[#050d14] dark:via-[#082218] dark:to-[#050d14] dark:shadow-none p-6 transition-all duration-300 hover:border-green-500/40 dark:hover:border-green-400/45">
                  <div className="pointer-events-none absolute -top-20 -right-16 h-52 w-52 rounded-full bg-green-500/10 dark:bg-green-400/12 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-emerald-500/10 dark:bg-emerald-400/15 blur-3xl" />
                  <div className="relative">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-green-600 dark:text-green-300/80 font-bold">Explore More</p>
                    <div className="mt-6 flex justify-center">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-green-500/30 bg-green-500/10 text-green-600 dark:border-green-400/30 dark:bg-green-400/10 dark:text-green-400">
                        <GitBranch size={26} />
                      </div>
                    </div>
                    <h3 className="mt-4 text-center text-3xl font-bold text-slate-900 dark:text-white">View All Projects</h3>
                    <p className="mx-auto mt-2 max-w-[220px] text-center text-xs text-slate-600 dark:text-slate-300/80">
                      Full archive with filters, detail pages, and live demos.
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-green-400/18 dark:bg-[#020802]/60 p-3 text-center">
                        <p className="font-outfit text-2xl font-black text-green-600 dark:text-green-400">{mergedFeaturedProjects.length}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Featured</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-green-400/18 dark:bg-[#020802]/60 p-3 text-center">
                        <p className="font-outfit text-2xl font-black text-green-600 dark:text-green-400">{liveDemoCount}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Live Demos</p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {mergedFeaturedProjects.slice(0, 3).map((project) => (
                        <div key={`${project.slug}-preview`} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-green-400/15 dark:bg-[#020802]/80">
                          <img src={project.imageUrl || fallbackProjectImage} alt={`${project.title} thumbnail`} className="h-12 w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" loading="lazy" width={120} height={48} decoding="async" onError={handleProjectPreviewError} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button to="/projects" className="mt-6 w-full justify-center border border-green-500/40 bg-green-500 text-black hover:bg-green-400">
                    Show All Projects <ArrowRight size={15} />
                  </Button>
                </article>
              </FadeInUp>
            </div>
          ) : null}
          {!loadingProjects && filteredProjects.length === 0 && !projectError ? (
            <EmptyState title="No projects in this category" message="Try selecting a different filter." />
          ) : null}
        </div>
      </section>
    </>
  );
};

const MemoizedProjectsSection = memo(ProjectsSection);
MemoizedProjectsSection.displayName = "ProjectsSection";

export default MemoizedProjectsSection;
