import { memo, useState } from "react";
import { Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { DEFAULT_SITE_SECTIONS } from "@/context/SiteContentContext";

const INPUT_CLS =
  "w-full rounded-lg border border-black/[0.1] bg-[#f8fafc] px-3 py-2 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-600 dark:border-white/[0.1] dark:bg-[#0c0e14] dark:text-[#eef0f5] dark:placeholder:text-[#7a8296] dark:focus:border-emerald-500";

const SUB_TABS = [
  { id: "profile", label: "Hero & Brand" },
  { id: "about", label: "About Page" },
  { id: "skills", label: "Skills Stack" },
  { id: "contact", label: "Contact & Socials" },
  { id: "services", label: "Services & Pricing" },
];

const AdminSiteContentTab = ({ sections, onSaveSection, submitting }) => {
  const [activeSubTab, setActiveSubTab] = useState("profile");
  const [drafts, setDrafts] = useState(() => ({
    profile: { ...DEFAULT_SITE_SECTIONS.profile, ...(sections?.profile || {}) },
    about: { ...DEFAULT_SITE_SECTIONS.about, ...(sections?.about || {}) },
    skills: { ...DEFAULT_SITE_SECTIONS.skills, ...(sections?.skills || {}) },
    contact: { ...DEFAULT_SITE_SECTIONS.contact, ...(sections?.contact || {}) },
    services: { ...DEFAULT_SITE_SECTIONS.services, ...(sections?.services || {}) },
  }));

  const current = drafts[activeSubTab] || {};

  const setField = (sectionKey, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: value,
      },
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    await onSaveSection({ [activeSubTab]: drafts[activeSubTab] });
  };

  const handleResetDefaults = () => {
    setDrafts((prev) => ({
      ...prev,
      [activeSubTab]: structuredClone(DEFAULT_SITE_SECTIONS[activeSubTab]),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-[#eef0f5]">
            Site Content &amp; Profile
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-[#a3a9b8]">
            Customize Hero copy, Navbar/Footer text, About narrative, Skills stack, Contact channels, and Service packages live.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/[0.1] dark:bg-[#11141c] dark:text-[#d1d5df] dark:hover:bg-[#1a1e28]"
        >
          <RotateCcw size={14} strokeWidth={1.5} /> Reset Section Defaults
        </button>
      </div>

      {/* Section Selector Pills */}
      <div className="flex flex-wrap gap-2">
        {SUB_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id)}
            className={`rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              activeSubTab === tab.id
                ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-slate-950"
                : "border-black/[0.08] bg-white text-slate-600 hover:text-slate-900 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8] dark:hover:text-[#eef0f5]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-5 rounded-xl border border-black/[0.08] bg-white p-5 sm:p-6 dark:border-white/[0.08] dark:bg-[#11141c]"
      >
        {activeSubTab === "profile" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Navbar Brand Name
                </label>
                <input
                  type="text"
                  value={current.brandName || ""}
                  onChange={(e) => setField("profile", "brandName", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={current.fullName || ""}
                  onChange={(e) => setField("profile", "fullName", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Hero First Line
                </label>
                <input
                  type="text"
                  value={current.headlineFirst || ""}
                  onChange={(e) => setField("profile", "headlineFirst", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Hero Highlight Line
                </label>
                <input
                  type="text"
                  value={current.headlineAccent || ""}
                  onChange={(e) => setField("profile", "headlineAccent", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Role Subtitle
                </label>
                <input
                  type="text"
                  value={current.roleTitle || ""}
                  onChange={(e) => setField("profile", "roleTitle", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Education Line
                </label>
                <input
                  type="text"
                  value={current.educationLine || ""}
                  onChange={(e) => setField("profile", "educationLine", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Welcome Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={current.welcomeBadge || ""}
                  onChange={(e) => setField("profile", "welcomeBadge", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Availability Status Pill
                </label>
                <input
                  type="text"
                  value={current.availabilityPill || ""}
                  onChange={(e) => setField("profile", "availabilityPill", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Avatar Status Badge
                </label>
                <input
                  type="text"
                  value={current.availableBadge || ""}
                  onChange={(e) => setField("profile", "availableBadge", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  value={current.profileImage || ""}
                  onChange={(e) => setField("profile", "profileImage", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Full-Stack Resume PDF URL
                </label>
                <input
                  type="text"
                  value={current.resumeFullStack || ""}
                  onChange={(e) => setField("profile", "resumeFullStack", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Security Resume PDF URL
                </label>
                <input
                  type="text"
                  value={current.resumeSecurity || ""}
                  onChange={(e) => setField("profile", "resumeSecurity", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-black/[0.06] bg-[#f8fafc] p-4 dark:border-white/[0.06] dark:bg-[#0c0e14]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-900 dark:text-[#eef0f5]">
                  Top Announcement Banner
                </span>
                <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-slate-700 dark:text-[#d1d5df]">
                  <input
                    type="checkbox"
                    checked={current.bannerEnabled !== false}
                    onChange={(e) => setField("profile", "bannerEnabled", e.target.checked)}
                    className="h-4 w-4 rounded accent-emerald-600"
                  />
                  Show top banner
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  type="text"
                  value={current.bannerTitle || ""}
                  onChange={(e) => setField("profile", "bannerTitle", e.target.value)}
                  placeholder="Banner title"
                  className={INPUT_CLS}
                />
                <input
                  type="text"
                  value={current.bannerSubtitle || ""}
                  onChange={(e) => setField("profile", "bannerSubtitle", e.target.value)}
                  placeholder="Banner subtitle"
                  className={INPUT_CLS}
                />
                <input
                  type="text"
                  value={current.bannerCta || ""}
                  onChange={(e) => setField("profile", "bannerCta", e.target.value)}
                  placeholder="CTA text"
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Footer Bio Description
                </label>
                <textarea
                  rows={2}
                  value={current.footerBio || ""}
                  onChange={(e) => setField("profile", "footerBio", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Footer Bottom Role Line
                </label>
                <input
                  type="text"
                  value={current.footerRoleLine || ""}
                  onChange={(e) => setField("profile", "footerRoleLine", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === "about" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={current.heroBadge || ""}
                  onChange={(e) => setField("about", "heroBadge", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Heading Prefix
                </label>
                <input
                  type="text"
                  value={current.heroHeadline || ""}
                  onChange={(e) => setField("about", "heroHeadline", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Heading Accent
                </label>
                <input
                  type="text"
                  value={current.heroAccent || ""}
                  onChange={(e) => setField("about", "heroAccent", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                About Hero Summary
              </label>
              <textarea
                rows={3}
                value={current.heroBio || ""}
                onChange={(e) => setField("about", "heroBio", e.target.value)}
                className={INPUT_CLS}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                Story Paragraphs (one paragraph per line)
              </label>
              <textarea
                rows={6}
                value={Array.isArray(current.storyParagraphs) ? current.storyParagraphs.join("\n") : ""}
                onChange={(e) =>
                  setField(
                    "about",
                    "storyParagraphs",
                    e.target.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  )
                }
                className={INPUT_CLS}
              />
            </div>
          </div>
        )}

        {activeSubTab === "skills" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Skills Heading Prefix
                </label>
                <input
                  type="text"
                  value={current.heroHeadline || ""}
                  onChange={(e) => setField("skills", "heroHeadline", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Skills Heading Accent
                </label>
                <input
                  type="text"
                  value={current.heroAccent || ""}
                  onChange={(e) => setField("skills", "heroAccent", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                Skills Hero Intro Copy
              </label>
              <textarea
                rows={2}
                value={current.heroBio || ""}
                onChange={(e) => setField("skills", "heroBio", e.target.value)}
                className={INPUT_CLS}
              />
            </div>

            <div className="space-y-3 border-t border-black/[0.08] pt-4 dark:border-white/[0.08]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 dark:text-[#eef0f5]">
                  Skill Groups ({Array.isArray(current.skillGroups) ? current.skillGroups.length : 0})
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setField("skills", "skillGroups", [
                      ...(current.skillGroups || []),
                      { title: "New Category", items: ["Skill"] },
                    ])
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-black/[0.08] px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-white/[0.1] dark:text-[#d1d5df]"
                >
                  <Plus size={12} strokeWidth={1.5} /> Add Group
                </button>
              </div>

              {(current.skillGroups || []).map((group, idx) => (
                <div
                  key={`${group.title}-${idx}`}
                  className="grid gap-3 rounded-xl border border-black/[0.06] bg-[#f8fafc] p-3.5 sm:grid-cols-[1fr_2fr_auto] sm:items-end dark:border-white/[0.06] dark:bg-[#0c0e14]"
                >
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-[#7a8296]">
                      Category Title
                    </label>
                    <input
                      type="text"
                      value={group.title}
                      onChange={(e) => {
                        const updated = [...(current.skillGroups || [])];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setField("skills", "skillGroups", updated);
                      }}
                      className={INPUT_CLS}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-[#7a8296]">
                      Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      value={(group.items || []).join(", ")}
                      onChange={(e) => {
                        const updated = [...(current.skillGroups || [])];
                        updated[idx] = {
                          ...updated[idx],
                          items: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        };
                        setField("skills", "skillGroups", updated);
                      }}
                      className={INPUT_CLS}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (current.skillGroups || []).filter((_, i) => i !== idx);
                      setField("skills", "skillGroups", updated);
                    }}
                    className="inline-flex h-8 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 text-rose-600 hover:bg-rose-500/15 dark:text-rose-300"
                    aria-label="Remove group"
                  >
                    <Trash2 size={13} strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === "contact" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { field: "email", label: "Primary Email" },
              { field: "phone", label: "Phone Number" },
              { field: "location", label: "Location" },
              { field: "responseSla", label: "Response SLA" },
              { field: "whatsapp", label: "WhatsApp URL" },
              { field: "github", label: "GitHub URL" },
              { field: "linkedin", label: "LinkedIn URL" },
              { field: "instagram", label: "Instagram URL" },
              { field: "medium", label: "Medium URL" },
              { field: "tryhackme", label: "TryHackMe URL" },
              { field: "leetcode", label: "LeetCode URL" },
              { field: "gfg", label: "GeeksforGeeks URL" },
            ].map((item) => (
              <div key={item.field}>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  {item.label}
                </label>
                <input
                  type="text"
                  value={current[item.field] || ""}
                  onChange={(e) => setField("contact", item.field, e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
            ))}
          </div>
        )}

        {activeSubTab === "services" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Services Heading Prefix
                </label>
                <input
                  type="text"
                  value={current.heroHeadline || ""}
                  onChange={(e) => setField("services", "heroHeadline", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Services Heading Accent
                </label>
                <input
                  type="text"
                  value={current.heroAccent || ""}
                  onChange={(e) => setField("services", "heroAccent", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                Services Hero Subtitle
              </label>
              <textarea
                rows={2}
                value={current.heroBio || ""}
                onChange={(e) => setField("services", "heroBio", e.target.value)}
                className={INPUT_CLS}
              />
            </div>

            <div className="space-y-4 border-t border-black/[0.08] pt-4 dark:border-white/[0.08]">
              {(current.offerings || []).map((svc, idx) => (
                <div
                  key={`${svc.slug}-${idx}`}
                  className="space-y-3 rounded-xl border border-black/[0.06] bg-[#f8fafc] p-4 dark:border-white/[0.06] dark:bg-[#0c0e14]"
                >
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-[#7a8296]">
                        Service Name
                      </label>
                      <input
                        type="text"
                        value={svc.name || ""}
                        onChange={(e) => {
                          const list = [...(current.offerings || [])];
                          list[idx] = { ...list[idx], name: e.target.value };
                          setField("services", "offerings", list);
                        }}
                        className={INPUT_CLS}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-[#7a8296]">
                        Price Display Label
                      </label>
                      <input
                        type="text"
                        value={svc.price || ""}
                        onChange={(e) => {
                          const list = [...(current.offerings || [])];
                          list[idx] = { ...list[idx], price: e.target.value };
                          setField("services", "offerings", list);
                        }}
                        className={INPUT_CLS}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-[#7a8296]">
                        Turnaround Time
                      </label>
                      <input
                        type="text"
                        value={svc.turnaround || ""}
                        onChange={(e) => {
                          const list = [...(current.offerings || [])];
                          list[idx] = { ...list[idx], turnaround: e.target.value };
                          setField("services", "offerings", list);
                        }}
                        className={INPUT_CLS}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-[#7a8296]">
                        Badge Label
                      </label>
                      <input
                        type="text"
                        value={svc.badge || ""}
                        onChange={(e) => {
                          const list = [...(current.offerings || [])];
                          list[idx] = { ...list[idx], badge: e.target.value };
                          setField("services", "offerings", list);
                        }}
                        className={INPUT_CLS}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-[#7a8296]">
                      Summary Copy
                    </label>
                    <input
                      type="text"
                      value={svc.summary || ""}
                      onChange={(e) => {
                        const list = [...(current.offerings || [])];
                        list[idx] = { ...list[idx], summary: e.target.value };
                        setField("services", "offerings", list);
                      }}
                      className={INPUT_CLS}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-[#7a8296]">
                      Deliverables (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={(svc.bullets || []).join("\n")}
                      onChange={(e) => {
                        const list = [...(current.offerings || [])];
                        list[idx] = {
                          ...list[idx],
                          bullets: e.target.value
                            .split("\n")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        };
                        setField("services", "offerings", list);
                      }}
                      className={INPUT_CLS}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end border-t border-black/[0.08] pt-4 dark:border-white/[0.08]">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-60 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
          >
            <Save size={14} strokeWidth={1.75} />
            {submitting ? "Saving changes..." : "Save & Publish to Live Portfolio"}
          </button>
        </div>
      </form>
    </div>
  );
};

const MemoizedAdminSiteContentTab = memo(AdminSiteContentTab);
MemoizedAdminSiteContentTab.displayName = "AdminSiteContentTab";

export default MemoizedAdminSiteContentTab;
