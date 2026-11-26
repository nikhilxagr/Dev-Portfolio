import { memo } from "react";
import {
  Edit3,
  ExternalLink,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import { PROJECT_CATEGORIES } from "@/constants/siteData";

const ADMIN_FILTER_CATEGORIES = [
  "All",
  "Full Stack",
  "Web Dev",
  "Python",
  "Cyber Security",
  "AI",
];

const INPUT_CLS =
  "w-full rounded-lg border border-black/[0.1] bg-[#f8fafc] px-3 py-2 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-600 dark:border-white/[0.1] dark:bg-[#0c0e14] dark:text-[#eef0f5] dark:placeholder:text-[#7a8296] dark:focus:border-emerald-500";

const AdminProjectsTab = ({
  projects,
  contentLoading,
  projectSearch,
  setProjectSearch,
  projectCategoryFilter,
  setProjectCategoryFilter,
  showProjectFormModal,
  setShowProjectFormModal,
  editingProjectKey,
  projectForm,
  updateProjectField,
  resetProjectForm,
  submitProject,
  handleEditProject,
  handleDeleteProject,
  submitting,
}) => {
  const categoryOptions = PROJECT_CATEGORIES.filter(
    (c) => !["All", "Solo", "Collab"].includes(c),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-[#eef0f5]">
            Projects
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-[#a3a9b8]">
            Create or edit any case study, cover image, live demo, or featured flag ({projects.length} total).
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetProjectForm();
            setShowProjectFormModal(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
        >
          <Plus size={15} strokeWidth={1.75} /> Add Project
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/[0.08] bg-white p-4 dark:border-white/[0.08] dark:bg-[#11141c]">
        <div className="relative min-w-[200px] flex-1">
          <Search
            size={15}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#7a8296]"
          />
          <input
            type="text"
            value={projectSearch}
            onChange={(e) => setProjectSearch(e.target.value)}
            placeholder="Search projects by title or tech stack..."
            className="w-full rounded-lg border border-black/[0.08] bg-[#f8fafc] py-2 pl-9 pr-3 text-xs text-slate-900 outline-none focus:border-emerald-600 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-[#eef0f5] dark:focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {ADMIN_FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setProjectCategoryFilter(cat)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                projectCategoryFilter === cat
                  ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-slate-950"
                  : "border-black/[0.08] bg-[#f8fafc] text-slate-600 hover:text-slate-900 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-[#a3a9b8] dark:hover:text-[#eef0f5]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Project Form Panel */}
      {showProjectFormModal && (
        <div className="space-y-4 rounded-xl border border-emerald-600/35 bg-white p-5 sm:p-6 dark:border-emerald-500/35 dark:bg-[#11141c]">
          <div className="flex items-center justify-between border-b border-black/[0.08] pb-3 dark:border-white/[0.08]">
            <h2 className="flex items-center gap-2 font-display text-base font-semibold text-slate-900 dark:text-[#eef0f5]">
              {editingProjectKey ? (
                <Edit3 size={16} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Plus size={16} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
              )}
              {editingProjectKey ? "Edit Project Details" : "New Project"}
            </h2>
            <button
              type="button"
              onClick={resetProjectForm}
              className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-[#7a8296] dark:hover:bg-white/[0.06] dark:hover:text-[#eef0f5]"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          <form onSubmit={submitProject} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={updateProjectField("title")}
                  placeholder="e.g. VISTAGRAM"
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Category *
                </label>
                <select
                  value={projectForm.category}
                  onChange={updateProjectField("category")}
                  className={INPUT_CLS}
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Scope &amp; Visibility
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={projectForm.projectType}
                    onChange={updateProjectField("projectType")}
                    className={INPUT_CLS}
                  >
                    <option value="Solo">Solo</option>
                    <option value="Collab">Collab</option>
                  </select>
                  <select
                    value={projectForm.status}
                    onChange={updateProjectField("status")}
                    className={INPUT_CLS}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Hidden (Draft)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={projectForm.tagline}
                  onChange={updateProjectField("tagline")}
                  placeholder="Short one-line summary for details hero..."
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Tech Stack (comma separated) *
                </label>
                <input
                  type="text"
                  required
                  value={projectForm.techStack}
                  onChange={updateProjectField("techStack")}
                  placeholder="React, Node.js, Express, MongoDB"
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                Card Description *
              </label>
              <textarea
                required
                rows={2}
                value={projectForm.description}
                onChange={updateProjectField("description")}
                placeholder="Brief summary displayed on project cards (15+ characters)..."
                className={INPUT_CLS}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                Case Study Overview
              </label>
              <textarea
                rows={3}
                value={projectForm.overview}
                onChange={updateProjectField("overview")}
                placeholder="Detailed project overview shown on the project details page..."
                className={INPUT_CLS}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Problem Statement
                </label>
                <textarea
                  rows={2}
                  value={projectForm.problemStatement}
                  onChange={updateProjectField("problemStatement")}
                  placeholder="Key problem solved..."
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Solution Summary
                </label>
                <textarea
                  rows={2}
                  value={projectForm.solutionSummary}
                  onChange={updateProjectField("solutionSummary")}
                  placeholder="How you built the solution..."
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Outcome / Result
                </label>
                <input
                  type="text"
                  value={projectForm.outcome}
                  onChange={updateProjectField("outcome")}
                  placeholder="Shipped result or measured outcome..."
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Role / Build Context
                </label>
                <input
                  type="text"
                  value={projectForm.role}
                  onChange={updateProjectField("role")}
                  placeholder="e.g. Full-Stack Architecture & Socket.IO Backend"
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  GitHub URL
                </label>
                <input
                  type="text"
                  value={projectForm.githubUrl}
                  onChange={updateProjectField("githubUrl")}
                  placeholder="https://github.com/..."
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Live Demo URL
                </label>
                <input
                  type="text"
                  value={projectForm.liveDemoUrl}
                  onChange={updateProjectField("liveDemoUrl")}
                  placeholder="https://..."
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  APK Download URL
                </label>
                <input
                  type="text"
                  value={projectForm.apkUrl}
                  onChange={updateProjectField("apkUrl")}
                  placeholder="Optional Android APK link"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={projectForm.imageUrl}
                  onChange={updateProjectField("imageUrl")}
                  placeholder="/images/projects/..."
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <label className="inline-flex cursor-pointer items-center gap-2 pt-1 text-xs font-medium text-slate-700 dark:text-[#d1d5df]">
              <input
                type="checkbox"
                checked={projectForm.featured}
                onChange={updateProjectField("featured")}
                className="h-4 w-4 rounded accent-emerald-600"
              />
              Feature this project on the Home page
            </label>

            <div className="flex items-center justify-end gap-2.5 border-t border-black/[0.08] pt-3 dark:border-white/[0.08]">
              <button
                type="button"
                onClick={resetProjectForm}
                className="rounded-lg border border-black/[0.1] px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-white/[0.1] dark:text-[#d1d5df] dark:hover:bg-white/[0.05]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-60 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
              >
                {submitting
                  ? "Saving..."
                  : editingProjectKey
                  ? "Save Project Changes"
                  : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Grid */}
      {contentLoading ? (
        <LoadingState message="Loading portfolio projects..." cards={6} />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No matching projects"
          message="Try another search query or category filter."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const techList = project.techStack?.length
              ? project.techStack
              : project.tags || [];
            const isDraft = project.status === "draft";

            return (
              <article
                key={project._id || project.slug}
                className={`flex flex-col justify-between overflow-hidden rounded-xl border bg-white p-4 transition-colors dark:bg-[#11141c] ${
                  isDraft
                    ? "border-amber-500/35 opacity-80"
                    : "border-black/[0.08] hover:border-slate-300 dark:border-white/[0.08] dark:hover:border-white/[0.16]"
                }`}
              >
                <div>
                  <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg border border-black/[0.06] bg-slate-100 dark:border-white/[0.06] dark:bg-[#0c0e14]">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : null}
                    <span className="absolute left-2 top-2 rounded-md border border-white/15 bg-black/75 px-2 py-0.5 font-mono text-[10px] font-medium text-white">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-950/85 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-300">
                        <Star size={10} strokeWidth={1.75} /> Featured
                      </span>
                    )}
                    {isDraft && (
                      <span className="absolute bottom-2 left-2 rounded-md bg-amber-500/90 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-950">
                        Draft
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-base font-semibold text-slate-900 dark:text-[#eef0f5]">
                    {project.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-[#a3a9b8]">
                    {project.description || project.tagline}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {techList.slice(0, 6).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-black/[0.06] bg-slate-50 px-2 py-0.5 font-mono text-[10px] text-slate-600 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-3 text-xs dark:border-white/[0.08]">
                  <a
                    href={`/projects/${project.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                  >
                    Live page <ExternalLink size={11} strokeWidth={1.5} />
                  </a>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleEditProject(project)}
                      className="inline-flex items-center gap-1 rounded-lg border border-black/[0.08] bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:border-emerald-600/40 hover:text-emerald-700 dark:border-white/[0.1] dark:bg-[#1a1e28] dark:text-[#d1d5df] dark:hover:border-emerald-500/40 dark:hover:text-emerald-400"
                    >
                      <Edit3 size={12} strokeWidth={1.5} /> Edit
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleDeleteProject(project._id || project.slug)}
                      aria-label={`Delete or hide ${project.title}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-500/15 dark:text-rose-300"
                    >
                      <Trash2 size={12} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

const MemoizedAdminProjectsTab = memo(AdminProjectsTab);
MemoizedAdminProjectsTab.displayName = "AdminProjectsTab";

export default MemoizedAdminProjectsTab;
