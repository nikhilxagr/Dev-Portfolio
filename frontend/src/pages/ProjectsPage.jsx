import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, X, ChevronDown, FolderGit2 } from "lucide-react";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import ProjectCard from "@/components/ui/ProjectCard";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import { SIGNATURE_PROJECTS } from "@/data/projectsData";
import { getProjects } from "@/services/projects.service";
import { mergeStaticAndApiContent } from "@/services/contentMerge";
import { createBreadcrumbSchema, createItemListSchema } from "@/utils/seo";

const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;

const CATEGORIES = ["All", "Full Stack", "Web Dev", "Solo", "Collab", "AI", "Python", "Cyber Security"];

const isCollabProject = (project) => {
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

const matchesProjectFilters = (project, selectedCategory, currentSearch) => {
  let matchesCategory = true;
  const isCollab = isCollabProject(project);
  const cat = selectedCategory.toUpperCase();

  if (cat === "COLLAB") {
    matchesCategory = isCollab;
  } else if (cat === "SOLO") {
    matchesCategory = !isCollab;
  } else if (cat === "FULL STACK") {
    matchesCategory = project.category?.toLowerCase() === "full stack";
  } else if (cat === "WEB DEV") {
    matchesCategory = project.category?.toLowerCase() === "web dev";
  } else if (cat === "PYTHON") {
    matchesCategory = project.category?.toLowerCase() === "python";
  } else if (cat === "CYBER SECURITY") {
    matchesCategory =
      project.category?.toLowerCase() === "cyber security" ||
      project.category?.toLowerCase() === "security" ||
      (project.tags || []).some((t) => t.toLowerCase().includes("security"));
  } else if (cat === "AI") {
    matchesCategory =
      project.category?.toLowerCase() === "ai" ||
      project.category?.toLowerCase() === "ai/ml" ||
      project.category?.toLowerCase() === "ai / security" ||
      (project.techStack || []).some((t) => t.toLowerCase().includes("gemini") || t.toLowerCase() === "ai");
  } else if (cat !== "ALL") {
    matchesCategory = project.category?.toLowerCase() === selectedCategory.toLowerCase();
  }

  const keyword = currentSearch.trim().toLowerCase();
  if (!keyword) return matchesCategory;

  const searchable = `${project.title} ${project.tagline} ${project.description} ${isCollab ? "collab collaboration team" : "solo individual"} ${(
    project.techStack || []
  ).join(" ")} ${(project.tags || []).join(" ")}`.toLowerCase();

  return matchesCategory && searchable.includes(keyword);
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState(SIGNATURE_PROJECTS);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("FEATURED");

  const handleCategorySelect = useCallback((item) => {
    setCategory(item);
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearch("");
  }, []);

  const handleSortChange = useCallback((event) => {
    setSortBy(event.target.value);
  }, []);

  useEffect(() => {
    getProjects()
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const mergedMap = new Map();
          SIGNATURE_PROJECTS.forEach((item) => mergedMap.set(item.slug, item));
          response.data.forEach((apiProj) => {
            const staticProj = SIGNATURE_PROJECTS.find(
              (item) => item.slug === apiProj.slug,
            );
            const merged = mergeStaticAndApiContent(staticProj, apiProj);
            mergedMap.set(merged.slug || apiProj.slug || apiProj._id, merged);
          });
          setProjects(Array.from(mergedMap.values()));
        }
      })
      .catch(() => undefined);
  }, []);

  const rawDisplayProjects = useMemo(() => {
    return projects
      .filter((p) => p.slug !== "security-threat-intelligence-lab" && p.title !== "Security Threat Intelligence Lab")
      .filter((p) => matchesProjectFilters(p, category, search));
  }, [projects, category, search]);

  const sortedProjects = useMemo(() => {
    const list = [...rawDisplayProjects];
    if (sortBy === "NEWEST") {
      return list.reverse();
    }
    if (sortBy === "NAME") {
      return list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [rawDisplayProjects, sortBy]);

  const projectListSchema = useMemo(
    () =>
      createItemListSchema({
        name: "Nikhil Engineering Case Studies",
        description: "Production Case Studies by Nikhil Agrahari.",
        path: "/projects",
        items: sortedProjects
          .filter((item) => Boolean(item?.slug))
          .slice(0, 60)
          .map((item) => ({
            name: item.title,
            path: `/projects/${item.slug}`,
          })),
      }),
    [sortedProjects],
  );

  return (
    <>
      <SeoHead
        title="Nikhil Agrahari Projects | Production Case Studies & Full Stack Apps"
        description="Explore production-ready MERN stack applications, Vistagram, Kanoon-Mate, Fast Feast, snapURL, Python utilities, and AI tools built by Nikhil Agrahari."
        pathname="/projects"
        keywords={[
          "Nikhil Agrahari projects",
          "Nikhil Agrahari project",
          "Nikhil projects",
          "Nikhil project",
          "Nikhil Agrahari case studies",
          "Nikhil Agrahari Vistagram",
          "Nikhil Agrahari Kanoon Mate",
          "MERN stack web projects",
          "Python Tkinter GUI projects",
          "Full stack web development portfolio",
        ]}
        jsonLd={[
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
          ]),
          projectListSchema,
        ]}
      />

      <section className="section-wrap pt-6 sm:pt-8 pb-20">
        {/* Centered Hero Headline */}
        <div className="text-center max-w-3xl mx-auto pb-10 sm:pb-12">
          <MotionDiv
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-500/[0.08] px-4 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400 mb-5">
              <FolderGit2 size={14} strokeWidth={1.5} /> Projects Archive
            </span>
          </MotionDiv>

          <MotionH1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 dark:text-[#eef0f5] leading-[1.08]"
          >
            Production{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              Case Studies
            </span>
          </MotionH1>

          <MotionP
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-[#a3a9b8]"
          >
            Full-stack MERN applications, Python utilities, and security tools with architecture notes and source code.
          </MotionP>
        </div>

        <div className="max-w-4xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search size={16} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#7a8296]" />
              <input
                id="projects-search"
                name="search"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search projects"
                className="h-10 w-full rounded-lg border border-black/[0.08] bg-white pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-emerald-600 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#eef0f5] dark:placeholder:text-[#7a8296] dark:focus:border-emerald-500"
              />
              {search && (
                <button
                  type="button"
                  onClick={handleSearchClear}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:text-[#7a8296] dark:hover:text-[#eef0f5]"
                >
                  <X size={14} strokeWidth={1.5} />
                </button>
              )}
            </div>

            <div className="relative shrink-0">
              <select
                id="projects-sort"
                name="sort"
                value={sortBy}
                onChange={handleSortChange}
                aria-label="Sort projects by"
                className="h-10 appearance-none rounded-lg border border-black/[0.08] bg-white px-3.5 pr-8 font-mono text-xs font-medium text-slate-800 outline-none transition-colors duration-150 hover:border-slate-300 focus:border-emerald-600 cursor-pointer dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#eef0f5] dark:hover:border-white/[0.16]"
              >
                <option value="FEATURED">Sort: Featured</option>
                <option value="NEWEST">Sort: Newest</option>
                <option value="NAME">Sort: Name A–Z</option>
              </select>
              <ChevronDown size={14} strokeWidth={1.5} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#7a8296]" />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleCategorySelect(item)}
                className={`inline-flex h-9 items-center rounded-lg border px-3.5 text-xs font-medium transition-colors duration-150 sm:text-sm ${
                  category === item
                    ? "border-emerald-600/40 bg-emerald-500/10 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300"
                    : "border-black/[0.08] bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8] dark:hover:border-white/[0.16] dark:hover:text-[#eef0f5]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <p className="mt-4 font-mono text-xs text-slate-500 tabular-nums dark:text-[#7a8296]">
            Showing <span className="font-medium text-slate-900 dark:text-[#eef0f5]">{sortedProjects.length}</span> projects
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="mt-8 cv-auto">
          {sortedProjects.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedProjects.map((project, index) => (
                <ProjectCard
                  key={project._id || project.slug}
                  project={project}
                  priority={index < 6}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No matching projects found"
              message="Try selecting different category filters or clearing search terms."
            />
          )}
        </div>
      </section>
    </>
  );
};

export default ProjectsPage;
