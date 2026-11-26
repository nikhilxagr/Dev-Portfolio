import { memo } from "react";
import { Edit3, ExternalLink, Plus, Trash2, X } from "lucide-react";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";

const INPUT_CLS =
  "w-full rounded-lg border border-black/[0.1] bg-[#f8fafc] px-3 py-2 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-600 dark:border-white/[0.1] dark:bg-[#0c0e14] dark:text-[#eef0f5] dark:placeholder:text-[#7a8296] dark:focus:border-emerald-500";

const AdminBlogsTab = ({
  blogs,
  contentLoading,
  showBlogFormModal,
  setShowBlogFormModal,
  editingBlogKey,
  blogForm,
  updateBlogField,
  resetBlogForm,
  submitBlog,
  handleEditBlog,
  handleDeleteBlog,
  formatDate,
  submitting,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-[#eef0f5]">
            Blogs &amp; Articles
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-[#a3a9b8]">
            Publish new articles or update existing notes, tags, cover images, and content ({blogs.length} total).
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetBlogForm();
            setShowBlogFormModal(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
        >
          <Plus size={15} strokeWidth={1.75} /> New Article
        </button>
      </div>

      {showBlogFormModal && (
        <div className="space-y-4 rounded-xl border border-emerald-600/35 bg-white p-5 sm:p-6 dark:border-emerald-500/35 dark:bg-[#11141c]">
          <div className="flex items-center justify-between border-b border-black/[0.08] pb-3 dark:border-white/[0.08]">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-[#eef0f5]">
              {editingBlogKey ? "Edit Article" : "Publish New Article"}
            </h2>
            <button
              type="button"
              onClick={resetBlogForm}
              className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-[#7a8296] dark:hover:bg-white/[0.06] dark:hover:text-[#eef0f5]"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          <form onSubmit={submitBlog} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={blogForm.title}
                  onChange={updateBlogField("title")}
                  placeholder="Article headline..."
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={blogForm.subtitle}
                  onChange={updateBlogField("subtitle")}
                  placeholder="Optional concise subtitle..."
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Category
                </label>
                <input
                  type="text"
                  value={blogForm.category}
                  onChange={updateBlogField("category")}
                  placeholder="System Design, AI, Web..."
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Read Time
                </label>
                <input
                  type="text"
                  value={blogForm.readTime}
                  onChange={updateBlogField("readTime")}
                  placeholder="5 min read"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  External URL (Medium/LinkedIn)
                </label>
                <input
                  type="text"
                  value={blogForm.url}
                  onChange={updateBlogField("url")}
                  placeholder="https://medium.com/..."
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Visibility
                </label>
                <select
                  value={blogForm.status}
                  onChange={updateBlogField("status")}
                  className={INPUT_CLS}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                Excerpt *
              </label>
              <textarea
                required
                rows={2}
                value={blogForm.excerpt}
                onChange={updateBlogField("excerpt")}
                placeholder="Summary shown on blog cards..."
                className={INPUT_CLS}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                Content (Markdown or plain text, min 20 chars) *
              </label>
              <textarea
                required
                rows={6}
                value={blogForm.content}
                onChange={updateBlogField("content")}
                placeholder="Write article body content..."
                className={INPUT_CLS}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={blogForm.tags}
                  onChange={updateBlogField("tags")}
                  placeholder="System Design, Web, Security"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={blogForm.imageUrl}
                  onChange={updateBlogField("imageUrl")}
                  placeholder="/images/blogs/..."
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-black/[0.08] pt-3 dark:border-white/[0.08]">
              <button
                type="button"
                onClick={resetBlogForm}
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
                  : editingBlogKey
                  ? "Update Article"
                  : "Publish Article"}
              </button>
            </div>
          </form>
        </div>
      )}

      {contentLoading ? (
        <LoadingState message="Loading articles..." cards={4} />
      ) : blogs.length === 0 ? (
        <EmptyState
          title="No articles found"
          message="Create a new article to publish on your blog."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => {
            const isDraft = blog.status === "draft";
            return (
              <article
                key={blog._id || blog.slug}
                className={`flex flex-col justify-between rounded-xl border bg-white p-4 transition-colors dark:bg-[#11141c] ${
                  isDraft
                    ? "border-amber-500/35 opacity-80"
                    : "border-black/[0.08] hover:border-slate-300 dark:border-white/[0.08] dark:hover:border-white/[0.16]"
                }`}
              >
                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                      {blog.category || "Article"}
                    </span>
                    {isDraft && (
                      <span className="rounded bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] font-medium text-amber-700 dark:text-amber-300">
                        Draft
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-base font-semibold leading-snug text-slate-900 dark:text-[#eef0f5]">
                    {blog.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-[#a3a9b8]">
                    {blog.excerpt || blog.subtitle}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {(blog.tags || []).slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-black/[0.06] bg-slate-50 px-2 py-0.5 font-mono text-[10px] text-slate-600 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-3 text-xs dark:border-white/[0.08]">
                  <span className="font-mono text-[11px] text-slate-500 dark:text-[#7a8296]">
                    {formatDate(blog.publishedAt || blog.createdAt)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`/blog/${blog.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View ${blog.title}`}
                      className="rounded-lg border border-black/[0.08] bg-white p-1.5 text-slate-600 hover:text-emerald-700 dark:border-white/[0.1] dark:bg-[#1a1e28] dark:text-[#a3a9b8] dark:hover:text-emerald-400"
                    >
                      <ExternalLink size={12} strokeWidth={1.5} />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleEditBlog(blog)}
                      className="inline-flex items-center gap-1 rounded-lg border border-black/[0.08] bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:border-emerald-600/40 hover:text-emerald-700 dark:border-white/[0.1] dark:bg-[#1a1e28] dark:text-[#d1d5df] dark:hover:border-emerald-500/40 dark:hover:text-emerald-400"
                    >
                      <Edit3 size={12} strokeWidth={1.5} /> Edit
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleDeleteBlog(blog)}
                      aria-label={`Delete or hide ${blog.title}`}
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

const MemoizedAdminBlogsTab = memo(AdminBlogsTab);
MemoizedAdminBlogsTab.displayName = "AdminBlogsTab";

export default MemoizedAdminBlogsTab;
