import { memo, useMemo, useState } from "react";
import { Edit3, ExternalLink, Plus, Search, Trash2, X } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { JOURNEY_CATEGORIES } from "@/data/journeyData";

const INPUT_CLS =
  "w-full rounded-lg border border-black/[0.1] bg-[#f8fafc] px-3 py-2 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-600 dark:border-white/[0.1] dark:bg-[#0c0e14] dark:text-[#eef0f5] dark:placeholder:text-[#7a8296] dark:focus:border-emerald-500";

const createInitialJourneyForm = () => ({
  entryId: "",
  year: new Date().getFullYear(),
  category: "Hackathons",
  mode: "Offline",
  title: "",
  subtitle: "Milestone",
  organization: "",
  duration: "",
  location: "",
  description: "",
  imageUrl: "",
  imageFit: "cover",
  tag: "Hackathon",
  certificateUrl: "",
  status: "published",
  journeyTitle: "",
  overview: "",
  objectives: "",
  outcomes: "",
  skills: "",
  technologies: "",
});

const AdminJourneyTab = ({
  milestones,
  onSaveMilestone,
  onDeleteMilestone,
  submitting,
}) => {
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [form, setForm] = useState(createInitialJourneyForm());

  const years = useMemo(
    () =>
      Array.from(new Set(milestones.map((m) => m.year)))
        .filter(Boolean)
        .sort((a, b) => b - a),
    [milestones],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return milestones.filter((item) => {
      if (yearFilter !== "ALL" && String(item.year) !== String(yearFilter)) {
        return false;
      }
      if (!q) return true;
      return `${item.title} ${item.organization} ${item.category} ${item.location} ${item.year}`
        .toLowerCase()
        .includes(q);
    });
  }, [milestones, search, yearFilter]);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleOpenNew = () => {
    setEditingKey("");
    setForm(createInitialJourneyForm());
    setShowForm(true);
  };

  const handleOpenEdit = (item) => {
    const d = item.details || {};
    setEditingKey(item._id || item.entryId || item.id);
    setForm({
      entryId: item.entryId || item.id || "",
      year: item.year || new Date().getFullYear(),
      category: item.category || "Certifications",
      mode: item.mode || "Online",
      title: item.title || "",
      subtitle: item.subtitle || "",
      organization: item.organization || "",
      duration: item.duration || "",
      location: item.location || "",
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      imageFit: item.imageFit || "cover",
      tag: item.tag || item.category || "Milestone",
      certificateUrl: item.certificateUrl || "",
      status: item.status || "published",
      journeyTitle: d.journeyTitle || "",
      overview: d.overview || "",
      objectives: d.objectives || "",
      outcomes: d.outcomes || "",
      skills: Array.isArray(d.skills || d.skillsGained)
        ? (d.skills || d.skillsGained).join(", ")
        : "",
      technologies: Array.isArray(d.technologies || d.technologiesCovered)
        ? (d.technologies || d.technologiesCovered).join(", ")
        : "",
    });
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingKey("");
    setForm(createInitialJourneyForm());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const parseList = (str) =>
      String(str || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    const payload = {
      entryId:
        form.entryId.trim() ||
        `${form.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")}-${form.year}`,
      year: Number(form.year),
      category: form.category.trim(),
      mode: form.mode.trim(),
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      organization: form.organization.trim(),
      duration: form.duration.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      imageFit: form.imageFit,
      hasCertificate: Boolean(form.certificateUrl.trim()),
      certificateUrl: form.certificateUrl.trim(),
      tag: form.tag.trim() || form.category.trim(),
      status: form.status,
      details: {
        university: form.organization.trim(),
        course: form.title.trim(),
        journeyTitle: form.journeyTitle.trim() || form.title.trim(),
        overview: form.overview.trim(),
        objectives: form.objectives.trim(),
        outcomes: form.outcomes.trim(),
        skills: parseList(form.skills),
        technologies: parseList(form.technologies),
      },
    };

    const ok = await onSaveMilestone(editingKey, payload);
    if (ok) handleClose();
  };

  const categoryChoices = JOURNEY_CATEGORIES.filter((c) => c !== "All");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-[#eef0f5]">
            Journey Milestones
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-[#a3a9b8]">
            Manage education, internships, hackathons, certifications, and timeline events ({milestones.length} total).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
        >
          <Plus size={15} strokeWidth={1.75} /> Add Milestone
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/[0.08] bg-white p-4 dark:border-white/[0.08] dark:bg-[#11141c]">
        <div className="relative min-w-[200px] flex-1">
          <Search
            size={15}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#7a8296]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search milestones by title, organization, or location..."
            className="w-full rounded-lg border border-black/[0.08] bg-[#f8fafc] py-2 pl-9 pr-3 text-xs text-slate-900 outline-none focus:border-emerald-600 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-[#eef0f5] dark:focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {["ALL", ...years].map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => setYearFilter(yr)}
              className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-medium tabular-nums transition-colors ${
                String(yearFilter) === String(yr)
                  ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-slate-950"
                  : "border-black/[0.08] bg-[#f8fafc] text-slate-600 hover:text-slate-900 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-[#a3a9b8] dark:hover:text-[#eef0f5]"
              }`}
            >
              {yr === "ALL" ? "All Years" : yr}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Modal / Panel */}
      {showForm && (
        <div className="space-y-4 rounded-xl border border-emerald-600/35 bg-white p-5 sm:p-6 dark:border-emerald-500/35 dark:bg-[#11141c]">
          <div className="flex items-center justify-between border-b border-black/[0.08] pb-3 dark:border-white/[0.08]">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-[#eef0f5]">
              {editingKey ? "Edit Journey Milestone" : "New Journey Milestone"}
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:text-[#7a8296] dark:hover:bg-white/[0.06]"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={updateField("title")}
                  placeholder="e.g. Lenovo LEAP Hackathon"
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Year *
                </label>
                <input
                  type="number"
                  required
                  min={2015}
                  max={2100}
                  value={form.year}
                  onChange={updateField("year")}
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Visibility
                </label>
                <select
                  value={form.status}
                  onChange={updateField("status")}
                  className={INPUT_CLS}
                >
                  <option value="published">Published</option>
                  <option value="draft">Hidden (Draft)</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={updateField("category")}
                  className={INPUT_CLS}
                >
                  {categoryChoices.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Organization
                </label>
                <input
                  type="text"
                  value={form.organization}
                  onChange={updateField("organization")}
                  placeholder="e.g. BBD University"
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Date / Duration (YYYY-MM)
                </label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={updateField("duration")}
                  placeholder="2026-07"
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Location &amp; Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={form.location}
                    onChange={updateField("location")}
                    placeholder="Lucknow"
                    className={INPUT_CLS}
                  />
                  <select
                    value={form.mode}
                    onChange={updateField("mode")}
                    className={INPUT_CLS}
                  >
                    <option value="Offline">Offline</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                Card Summary Description *
              </label>
              <textarea
                required
                rows={2}
                value={form.description}
                onChange={updateField("description")}
                placeholder="Summary shown on the timeline card..."
                className={INPUT_CLS}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Image URL
                </label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={updateField("imageUrl")}
                  placeholder="/images/journey/..."
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Certificate URL (optional)
                </label>
                <input
                  type="text"
                  value={form.certificateUrl}
                  onChange={updateField("certificateUrl")}
                  placeholder="https://..."
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Badge Tag &amp; Image Fit
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={form.tag}
                    onChange={updateField("tag")}
                    placeholder="Hackathon"
                    className={INPUT_CLS}
                  />
                  <select
                    value={form.imageFit}
                    onChange={updateField("imageFit")}
                    className={INPUT_CLS}
                  >
                    <option value="cover">Cover</option>
                    <option value="contain">Contain (Light)</option>
                    <option value="contain-dark">Contain (Dark)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid gap-4 border-t border-black/[0.06] pt-4 sm:grid-cols-2 dark:border-white/[0.06]">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Expanded Overview
                </label>
                <textarea
                  rows={2}
                  value={form.overview}
                  onChange={updateField("overview")}
                  placeholder="Shown inside View Details drawer..."
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Outcomes / Takeaways
                </label>
                <textarea
                  rows={2}
                  value={form.outcomes}
                  onChange={updateField("outcomes")}
                  placeholder="What you achieved or built..."
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Skills Gained (comma separated)
                </label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={updateField("skills")}
                  placeholder="Problem Solving, API Design"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Technologies Covered (comma separated)
                </label>
                <input
                  type="text"
                  value={form.technologies}
                  onChange={updateField("technologies")}
                  placeholder="React, Node.js, Gemini API"
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-black/[0.08] pt-3 dark:border-white/[0.08]">
              <button
                type="button"
                onClick={handleClose}
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
                  : editingKey
                  ? "Save Milestone Changes"
                  : "Add Milestone"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Milestones List */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No milestones found"
          message="Try clearing your search or year filter."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((item) => {
            const isDraft = item.status === "draft";
            return (
              <article
                key={item._id || item.entryId || item.id}
                className={`flex flex-col justify-between rounded-xl border bg-white p-4 transition-colors dark:bg-[#11141c] ${
                  isDraft
                    ? "border-amber-500/35 opacity-80"
                    : "border-black/[0.08] hover:border-slate-300 dark:border-white/[0.08] dark:hover:border-white/[0.16]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg border border-emerald-600/25 bg-emerald-500/10 font-mono text-xs font-semibold tabular-nums text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-400">
                    {item.year}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-mono text-[11px] text-slate-500 dark:text-[#7a8296]">
                        {item.category} · {item.mode || "Offline"}
                      </span>
                      {isDraft && (
                        <span className="rounded bg-amber-500/15 px-1.5 py-0.5 font-mono text-[10px] font-medium text-amber-700 dark:text-amber-300">
                          Hidden
                        </span>
                      )}
                    </div>
                    <h3 className="mt-0.5 font-display text-sm font-semibold text-slate-900 dark:text-[#eef0f5]">
                      {item.title}
                    </h3>
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      {item.organization}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-[#a3a9b8]">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-3 text-xs dark:border-white/[0.08]">
                  <a
                    href={`/journey#${item.entryId || item.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                  >
                    View timeline <ExternalLink size={11} strokeWidth={1.5} />
                  </a>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="inline-flex items-center gap-1 rounded-lg border border-black/[0.08] bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:border-emerald-600/40 hover:text-emerald-700 dark:border-white/[0.1] dark:bg-[#1a1e28] dark:text-[#d1d5df] dark:hover:border-emerald-500/40 dark:hover:text-emerald-400"
                    >
                      <Edit3 size={12} strokeWidth={1.5} /> Edit
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => onDeleteMilestone(item)}
                      aria-label={`Delete or hide ${item.title}`}
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

const MemoizedAdminJourneyTab = memo(AdminJourneyTab);
MemoizedAdminJourneyTab.displayName = "AdminJourneyTab";

export default MemoizedAdminJourneyTab;
