import { useEffect, useMemo, useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import BlogCard from "@/components/ui/BlogCard";
import Button from "@/components/ui/Button";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import { StaggerGrid, StaggerItem } from "@/components/animations/StaggerGrid";
import { getBlogs } from "@/services/blogs.service";
import { mergeStaticAndApiContent } from "@/services/contentMerge";
import { createBreadcrumbSchema, createItemListSchema } from "@/utils/seo";
import { BLOG_LINKS } from "@/constants/siteData";

const matchesBlogSearch = (blog, currentKeyword) => {
  const keyword = currentKeyword.trim().toLowerCase();

  if (!keyword) {
    return true;
  }

  const searchable = `${blog.title} ${blog.subtitle} ${blog.excerpt} ${(
    blog.tags || []
  ).join(" ")}`.toLowerCase();

  return searchable.includes(keyword);
};

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBlogs = async (keyword = "") => {
    setLoading(true);
    setError("");

    try {
      const response = await getBlogs(
        keyword.trim() ? { search: keyword.trim() } : {},
      );
      const apiBlogs = response.data || [];

      const mergedMap = new Map();

      BLOG_LINKS.forEach((staticBlog) => {
        mergedMap.set(staticBlog.slug, staticBlog);
      });

      apiBlogs.forEach((apiBlog) => {
        const staticBlog = BLOG_LINKS.find(
          (item) => item.slug === apiBlog.slug,
        );
        const merged = mergeStaticAndApiContent(staticBlog, apiBlog);
        mergedMap.set(merged.slug || apiBlog.slug || apiBlog._id, merged);
      });

      const combined = Array.from(mergedMap.values());
      combined.sort((a, b) => {
        const timeA = new Date(a.publishedAt || a.createdAt || 0).getTime();
        const timeB = new Date(b.publishedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      setBlogs(combined);
    } catch {
      setError("");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadBlogs(search).catch(() => undefined);
    }, 280);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const fallbackBlogs = useMemo(
    () => BLOG_LINKS.filter((blog) => matchesBlogSearch(blog, search)),
    [search],
  );
  const displayBlogs = blogs.length > 0 ? blogs : fallbackBlogs;
  const showInitialLoader = loading && displayBlogs.length === 0;
  const showBlogGrid = displayBlogs.length > 0;
  const featuredExternal = useMemo(
    () => BLOG_LINKS.filter((item) => item.featured),
    [],
  );
  const blogListSchema = useMemo(
    () =>
      createItemListSchema({
        name: "Nikhil Blog Archive",
        description: "Blog posts and technical notes by Nikhil Agrahari.",
        path: "/blog",
        items: displayBlogs
          .filter((item) => Boolean(item?.slug))
          .slice(0, 50)
          .map((item) => ({
            name: item.title,
            path: `/blog/${item.slug}`,
          })),
      }),
    [displayBlogs],
  );

  return (
    <>
      <SeoHead
        title="Blog"
        description="Technical blog by Nikhil Agrahari with notes on development, secure engineering, and practical experiments."
        pathname="/blog"
        keywords={[
          "Nikhil portfolio blog",
          "Nikhil Lucknow technical blog",
          "development and engineering notes",
        ]}
        jsonLd={[
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          blogListSchema,
        ]}
      />

      <section className="section-wrap pt-12 sm:pt-20">
        <SectionTitle
          eyebrow="Blog"
          title="Engineering Notes and Technical Articles"
          description="Articles from project builds, engineering practice, and experiments."
        />

        <p className="mt-4 max-w-3xl text-sm text-slate-400">
          Includes backend posts and external writing from Medium and LinkedIn.
        </p>

        <FadeInUp className="mt-8 rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-4">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, content, or tags"
            className="w-full rounded-xl border border-cyan-300/25 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-300"
          />
          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-slate-500">
            Showing {displayBlogs.length} article
            {displayBlogs.length === 1 ? "" : "s"}
          </p>
        </FadeInUp>

        <div className="mt-8">
          {showInitialLoader ? (
            <LoadingState
              message="Loading blog posts..."
              cards={6}
              variant="blog"
            />
          ) : null}
          {!loading && error && !showBlogGrid ? (
            <ErrorState message={error} onRetry={() => loadBlogs(search)} />
          ) : null}
          {!loading && !error && !showBlogGrid ? (
            <EmptyState
              title="No posts found"
              message="Blog entries will appear here once published."
            />
          ) : null}
          {!error && showBlogGrid ? (
            <StaggerGrid className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {displayBlogs.map((blog, index) => (
                <StaggerItem key={blog._id || blog.slug}>
                  <BlogCard blog={blog} priority={index < 3} />
                </StaggerItem>
              ))}
            </StaggerGrid>
          ) : null}

          {loading && showBlogGrid ? (
            <p className="mt-4 text-xs uppercase tracking-[0.14em] text-slate-500">
              Syncing latest articles...
            </p>
          ) : null}

          {!loading && featuredExternal.length > 0 ? (
            <div className="mt-10 rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">
                Editorial Pick
              </p>
              <h3 className="mt-1 text-lg font-semibold text-cyan-100">
                Featured External Article
              </h3>
              {featuredExternal.map((article) => (
                <article
                  key={article.slug}
                  className="mt-4 rounded-xl border border-cyan-300/20 bg-slate-900/70 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-emerald-200">
                    {article.source}
                  </p>
                  <h4 className="mt-2 text-base font-semibold text-cyan-100">
                    {article.title}
                  </h4>
                  <p className="mt-2 text-sm text-slate-300">
                    {article.subtitle}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    {article.excerpt}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(article.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-cyan-300/25 px-2 py-1 text-xs text-cyan-100"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                      variant="ghost"
                    >
                      Read on {article.source}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
};

export default BlogPage;
