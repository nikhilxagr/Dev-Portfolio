import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import ProjectCard from "@/components/ui/ProjectCard";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import { SIGNATURE_PROJECTS } from "@/constants/siteData";
import { getProjects } from "@/services/projects.service";
import { mergeStaticAndApiContent } from "@/services/contentMerge";
import { createBreadcrumbSchema, createItemListSchema } from "@/utils/seo";

const CATEGORIES = ["ALL", "FULL STACK", "WEB DEV", "PYTHON", "CYBER SECURITY", "AI"];

const matchesProjectFilters = (project, selectedCategory, currentSearch) => {
  let matchesCategory = true;
  if (selectedCategory === "FULL STACK") {
    matchesCategory = project.category === "Web Dev" || project.category === "Full Stack";
  } else if (selectedCategory !== "ALL") {
    matchesCategory =
      project.category?.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === "WEB DEV" && project.category === "Web Dev") ||
      (selectedCategory === "PYTHON" && project.category === "Python") ||
      (selectedCategory === "CYBER SECURITY" && (project.category === "Cyber Security" || project.category === "Security")) ||
      (selectedCategory === "AI" && (project.category === "AI" || project.category === "AI / Security"));
  }

  const keyword = currentSearch.trim().toLowerCase();
  if (!keyword) return matchesCategory;

  const searchable = `${project.title} ${project.tagline} ${project.description} ${(
    project.techStack || []
  ).join(" ")}`.toLowerCase();

  return matchesCategory && searchable.includes(keyword);
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState(SIGNATURE_PROJECTS);
  const [category, setCategory] = useState("ALL");
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
        title="Production Case Studies & Full Stack Projects | Nikhil Agrahari"
        description="Explore production-ready MERN stack applications, Python desktop utilities, AI tools, and web engineering case studies built by Nikhil Agrahari."
        pathname="/projects"
        keywords={[
          "Nikhil Agrahari case studies",
          "MERN stack web projects",
          "Python Tkinter GUI projects",
          "Full stack web development portfolio",
        ]}
        jsonLd={[
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Case Studies", path: "/projects" },
          ]),
          projectListSchema,
        ]}
      />

      {/* Main Section with Instant Loading & Clean Minimal Design */}
      <section className="section-wrap pt-4 sm:pt-6 pb-20">
        
        {/* Minimal Hero Header */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Professional Heading */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-wider text-slate-900 dark:text-white drop-shadow-sm">
            PRODUCTION <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">CASE STUDIES</span>
          </h1>

          {/* Clean Subtitle */}
          <p className="mt-3 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AI/ML, Python, and web development projects built with React, Node.js, and MERN stack workflows.
          </p>

          {/* Centered Search Bar */}
          <div className="mt-8 mx-auto max-w-xl relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              value={search}
              onChange={handleSearchChange}
              placeholder="Search projects by name, tech stack, or description..."
              className="w-full rounded-2xl border border-slate-300 bg-white/80 dark:border-white/10 dark:bg-[#030d07]/80 px-11 py-3 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none backdrop-blur-md focus:border-lime-400 dark:focus:border-lime-400 shadow-lg transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={handleSearchClear}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Centered Category Buttons + Inline "Sort By" Dropdown Button to the Right of AI */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleCategorySelect(item)}
                className={`rounded-xl px-4 py-2 text-xs font-black tracking-wider uppercase transition-all duration-200 ${
                  category === item
                    ? "bg-lime-400 text-slate-950 shadow-[0_0_20px_rgba(163,230,53,0.55)] scale-[1.03]"
                    : "border border-slate-200 bg-slate-100/80 text-slate-700 hover:border-slate-400 dark:border-emerald-500/20 dark:bg-[#08140c]/80 dark:text-slate-300 dark:hover:border-lime-400/50 dark:hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}

            {/* Inline "Sort By" Button (Right Side of AI) */}
            <div className="relative inline-block">
              <select
                value={sortBy}
                onChange={handleSortChange}
                aria-label="Sort projects by"
                className="appearance-none rounded-xl border border-slate-300 bg-slate-100/80 dark:border-emerald-500/30 dark:bg-[#08140c]/90 px-3.5 py-2 pr-8 font-mono text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 outline-none focus:border-lime-400 cursor-pointer shadow-sm transition hover:border-slate-400 dark:hover:border-lime-400/50"
              >
                <option value="FEATURED">Sort By: Featured</option>
                <option value="NEWEST">Sort By: Newest</option>
                <option value="NAME">Sort By: Name A-Z</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400" />
            </div>
          </div>

          {/* Project Counter */}
          <p className="mt-5 font-mono text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            // SHOWING <span className="text-lime-500 dark:text-lime-400 font-extrabold">{sortedProjects.length}</span> PROJECTS
          </p>
        </div>

        {/* Project Cards Grid — cv-auto skips layout/paint until scrolled */}
        <div className="mt-8 cv-auto">
          {sortedProjects.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 transform-gpu">
              {sortedProjects.map((project, index) => (
                <ProjectCard
                  key={project._id || project.slug}
                  project={project}
                  variant="featured"
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
