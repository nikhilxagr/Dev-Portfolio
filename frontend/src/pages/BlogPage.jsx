import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import BlogCard from "@/components/ui/BlogCard";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import { getBlogs } from "@/services/blogs.service";
import { mergeStaticAndApiContent } from "@/services/contentMerge";
import { createBreadcrumbSchema, createItemListSchema } from "@/utils/seo";
import { BLOG_LINKS } from "@/constants/siteData";

const matchesBlogSearch = (blog, currentKeyword) => {
  const keyword = currentKeyword.trim().toLowerCase();
  if (!keyword) return true;

  const searchable = `${blog.title} ${blog.subtitle} ${blog.excerpt} ${(
    blog.tags || []
  ).join(" ")}`.toLowerCase();

  return searchable.includes(keyword);
};

const BlogPage = () => {
  const [blogs, setBlogs] = useState(BLOG_LINKS);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getBlogs()
      .then((response) => {
        const apiBlogs = response.data || [];
        if (apiBlogs.length > 0) {
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
        }
      })
      .catch(() => undefined);
  }, []);

  const displayBlogs = useMemo(
    () => blogs.filter((blog) => matchesBlogSearch(blog, search)),
    [blogs, search],
  );

  const blogListSchema = useMemo(
    () =>
      createItemListSchema({
        name: "Nikhil Technical Notes & Blog Archive",
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
        title="Technical Notes & Engineering Articles | Nikhil Agrahari"
        description="Technical blog by Nikhil Agrahari with notes on web development, secure engineering, system design, and practical experiments."
        pathname="/blog"
        keywords={[
          "Nikhil portfolio blog",
          "Nikhil technical blog",
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

      {/* Main Section with Centered Minimal Header */}
      <section className="section-wrap pt-4 sm:pt-6 pb-20">
        
        {/* Centered Minimal Hero Header */}
        <FadeInUp>
          <div className="text-center max-w-4xl mx-auto">
            {/* Professional Heading */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-wider text-slate-900 dark:text-white drop-shadow-sm">
              TECHNICAL <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">ARTICLES</span>
            </h1>

            {/* Clean Subtitle */}
            <p className="mt-3 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Articles from project builds, engineering practice, system architecture, and technical writing. Includes backend posts and external writing from Medium and LinkedIn.
            </p>

            {/* Centered Search Bar */}
            <div className="mt-8 mx-auto max-w-xl relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title, content, or tags..."
                className="w-full rounded-2xl border border-slate-300 bg-white/80 dark:border-white/10 dark:bg-[#030d07]/80 px-11 py-3 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none backdrop-blur-md focus:border-lime-400 dark:focus:border-lime-400 shadow-lg transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Article Counter */}
            <p className="mt-5 font-mono text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              // SHOWING <span className="text-lime-500 dark:text-lime-400 font-extrabold">{displayBlogs.length}</span> ARTICLES
            </p>
          </div>
        </FadeInUp>

        {/* Blog Cards Grid — Immediate Render without Scroll Delay */}
        <div className="mt-8">
          {displayBlogs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayBlogs.map((blog, index) => (
                <BlogCard key={blog._id || blog.slug} blog={blog} priority={index < 3} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No matching posts found"
              message="Try clearing your search terms or checking back later for published articles."
            />
          )}
        </div>

      </section>
    </>
  );
};

export default BlogPage;
