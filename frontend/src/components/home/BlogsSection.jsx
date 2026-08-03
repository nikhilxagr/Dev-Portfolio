import { memo } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import FadeInUp from "@/components/animations/FadeInUp";

const BlogsSection = ({ loadingLatestBlog, latestBlogError, latestBlogs }) => {
  return (
    <section className="section-wrap section-divider pt-10">
      <FadeInUp>
        <div className="text-center">
          <h2 className="font-display text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
            Recent Blog
            <span className="block text-green-600 dark:text-green-400">Posts</span>
          </h2>
        </div>
      </FadeInUp>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {loadingLatestBlog && latestBlogs.length === 0 ? (
          <LoadingState message="Loading latest blogs..." cards={3} variant="blog" />
        ) : null}
        {!loadingLatestBlog && latestBlogError && latestBlogs.length === 0 ? (
          <EmptyState title="Latest blog unavailable" message={latestBlogError} />
        ) : null}
        {latestBlogs.length > 0
          ? latestBlogs.slice(0, 3).map((blog, index) => (
              <FadeInUp key={blog._id || blog.slug} delay={index * 0.08}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:bg-[#050d14] shadow-md dark:border-white/[0.08] dark:shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-green-500/40 dark:hover:border-green-400/30 hover:shadow-xl">
                  <div className="overflow-hidden">
                    <img
                      src={blog.imageUrl || blog.coverImage || "/images/placeholders/content-placeholder.svg"}
                      alt={blog.title || "Blog cover"}
                      className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      width={640}
                      height={176}
                      loading={index < 2 ? "eager" : "lazy"}
                      decoding="async"
                      style={{ aspectRatio: "16/9" }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-wider">
                      {blog.publishedAt || blog.createdAt
                        ? new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })
                        : null}
                      {(blog.readTime || blog.readingTime) && (
                        <>
                          <span>•</span>
                          <span>{blog.readTime || blog.readingTime} Min Read</span>
                        </>
                      )}
                    </div>
                    <h3 className="mt-2 font-display text-sm font-bold uppercase tracking-tight text-slate-900 dark:text-white line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                      {blog.description || blog.excerpt}
                    </p>
                    {(blog.category || (blog.tags && blog.tags[0])) && (
                      <div className="mt-3">
                        <span className="inline-flex items-center rounded border border-green-500/30 bg-green-500/10 text-green-700 dark:border-green-400/30 dark:bg-green-400/10 dark:text-green-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                          {blog.category || blog.tags[0]}
                        </span>
                      </div>
                    )}
                    <a
                      href={blog.url || `/blog/${blog.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Read article: ${blog.title}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-800 hover:text-green-600 dark:text-slate-300 dark:hover:text-green-400 transition-colors"
                    >
                      Read Article <ArrowRight size={11} />
                    </a>
                  </div>
                </article>
              </FadeInUp>
            ))
          : null}
        {!loadingLatestBlog && !latestBlogError && latestBlogs.length === 0 ? (
          <EmptyState title="No blogs yet" message="Latest writing will appear here once published." />
        ) : null}

        <FadeInUp delay={0.24} className="h-full">
          <article className="group relative flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:bg-[#050d14] shadow-md dark:border-green-400/25 dark:bg-gradient-to-br dark:from-[#050d14] dark:via-[#082218] dark:to-[#050d14] dark:shadow-none p-6 text-center transition-all duration-300 hover:border-green-500/40 dark:hover:border-green-400/45">
            <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-green-500/10 dark:bg-green-400/8 blur-3xl" />
            <div className="relative">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-green-500/30 bg-green-500/10 text-green-600 dark:border-green-400/30 dark:bg-green-400/10 dark:text-green-400">
                <BookOpen size={24} />
              </div>
              <h3 className="font-display text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">
                View All Blogs
              </h3>
              <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-slate-500">// Read More Articles</p>
              <Button to="/blog" className="mt-6 w-full justify-center border border-green-500/40 bg-green-50 text-green-700 hover:bg-green-500 hover:text-black dark:border-green-400/40 dark:bg-green-500/10 dark:text-green-300 dark:hover:bg-green-500 dark:hover:text-black">
                All Articles <ArrowRight size={13} />
              </Button>
            </div>
          </article>
        </FadeInUp>
      </div>
    </section>
  );
};

const MemoizedBlogsSection = memo(BlogsSection);
MemoizedBlogsSection.displayName = "BlogsSection";

export default MemoizedBlogsSection;
