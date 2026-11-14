import { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import FadeInUp from "@/components/animations/FadeInUp";

const formatReadTime = (value) => {
  if (!value) return null;
  const text = String(value).trim();
  if (/min/i.test(text)) {
    return text.toLowerCase();
  }
  return `${text} min read`;
};

const BlogsSection = ({ loadingLatestBlog, latestBlogError, latestBlogs }) => {
  return (
    <section className="section-wrap section-divider">
      <FadeInUp>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Writing
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-[-0.02em] text-slate-900 sm:text-4xl dark:text-[#eef0f5]">
              Recent Blog Posts
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-[#a3a9b8]">
              Architecture notes, system breakdowns, and engineering essays.
            </p>
          </div>
          <Link
            to="/blog"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-emerald-700 transition-colors duration-150 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            All articles
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </FadeInUp>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loadingLatestBlog && latestBlogs.length === 0 ? (
          <LoadingState message="Loading latest blogs..." cards={3} variant="blog" />
        ) : null}
        {!loadingLatestBlog && latestBlogError && latestBlogs.length === 0 ? (
          <EmptyState title="Latest blog unavailable" message={latestBlogError} />
        ) : null}
        {latestBlogs.length > 0
          ? latestBlogs.slice(0, 3).map((blog, index) => {
              const formattedDate =
                blog.publishedAt || blog.createdAt
                  ? new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })
                  : null;
              const readTimeLabel = formatReadTime(blog.readTime || blog.readingTime);

              return (
                <FadeInUp key={blog._id || blog.slug} delay={index * 0.06}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-black/[0.08] bg-white transition-colors duration-150 hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-white/[0.16]">
                    <div className="overflow-hidden border-b border-black/[0.06] bg-slate-50 dark:border-white/[0.08] dark:bg-[#0b0d14]">
                      <img
                        src={
                          blog.imageUrl ||
                          blog.coverImage ||
                          "/images/placeholders/content-placeholder.svg"
                        }
                        alt={blog.title || "Blog cover"}
                        className="aspect-[16/9] w-full object-contain"
                        width={640}
                        height={360}
                        loading={index < 2 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap items-center gap-2 whitespace-nowrap font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                        {formattedDate ? <span>{formattedDate}</span> : null}
                        {formattedDate && readTimeLabel ? <span>·</span> : null}
                        {readTimeLabel ? <span>{readTimeLabel}</span> : null}
                      </div>
                      <h3 className="mt-2.5 font-display text-lg font-medium tracking-[-0.01em] text-slate-900 line-clamp-2 dark:text-[#eef0f5]">
                        {blog.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-2 dark:text-[#a3a9b8]">
                        {blog.description || blog.excerpt}
                      </p>
                      {(blog.category || (blog.tags && blog.tags[0])) && (
                        <div className="mt-4">
                          <span className="inline-flex items-center rounded-md border border-black/[0.08] bg-slate-50 px-2.5 py-0.5 font-mono text-xs text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]">
                            {blog.category || blog.tags[0]}
                          </span>
                        </div>
                      )}
                      <a
                        href={blog.url || `/blog/${blog.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Read article: ${blog.title}`}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 transition-colors duration-150 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                      >
                        Read Article
                        <ArrowRight size={14} strokeWidth={1.5} />
                      </a>
                    </div>
                  </article>
                </FadeInUp>
              );
            })
          : null}
        {!loadingLatestBlog && !latestBlogError && latestBlogs.length === 0 ? (
          <EmptyState
            title="No blogs yet"
            message="Latest writing will appear here once published."
          />
        ) : null}
      </div>
    </section>
  );
};

const MemoizedBlogsSection = memo(BlogsSection);
MemoizedBlogsSection.displayName = "BlogsSection";

export default MemoizedBlogsSection;
