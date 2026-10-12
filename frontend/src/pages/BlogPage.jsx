import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, ArrowRight, ArrowUpRight, Clock, Sparkles } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import BlogCard from "@/components/ui/BlogCard";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import { getBlogs } from "@/services/blogs.service";
import { mergeStaticAndApiContent } from "@/services/contentMerge";
import { createBreadcrumbSchema, createItemListSchema } from "@/utils/seo";
import { BLOG_POSTS as BLOG_LINKS, BLOG_CATEGORIES } from "@/data/blogsData";
import { SITE_PROFILE } from "@/constants/siteData";

const matchesBlogSearch = (blog, currentKeyword) => {
  const keyword = currentKeyword.trim().toLowerCase();
  if (!keyword) return true;

  const searchable = `${blog.title} ${blog.subtitle || ""} ${blog.excerpt || ""} ${(
    blog.tags || []
  ).join(" ")}`.toLowerCase();

  return searchable.includes(keyword);
};

const formatBlogDate = (rawDate) => {
  if (!rawDate) return "Published";
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return "Published";
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const BlogPage = () => {
  const [blogs, setBlogs] = useState(BLOG_LINKS);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearch("");
  }, []);

  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

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

  // Primary featured blog (the highlighted roadmap/main article)
  const featuredBlog = useMemo(() => {
    return blogs.find((b) => b.featured) || blogs[0] || null;
  }, [blogs]);

  // Filtered blogs matching search & selected category
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch = matchesBlogSearch(blog, search);
      const matchesCategory =
        selectedCategory === "All" ||
        (blog.tags &&
          blog.tags.some((tag) =>
            tag.toLowerCase().includes(selectedCategory.toLowerCase()),
          )) ||
        (blog.category &&
          blog.category.toLowerCase().includes(selectedCategory.toLowerCase()));
      return matchesSearch && matchesCategory;
    });
  }, [blogs, search, selectedCategory]);

  const isFiltering = search.trim().length > 0 || selectedCategory !== "All";

  // When default, otherBlogs displays the rest of the articles (excluding featured)
  const otherBlogs = useMemo(() => {
    if (isFiltering) {
      return filteredBlogs;
    }
    return blogs.filter((b) => b.slug !== featuredBlog?.slug);
  }, [blogs, filteredBlogs, featuredBlog, isFiltering]);

  const featuredMatches = useMemo(() => {
    if (!featuredBlog) return false;
    return matchesBlogSearch(featuredBlog, search);
  }, [featuredBlog, search]);

  const blogListSchema = useMemo(
    () =>
      createItemListSchema({
        name: "Nikhil Technical Notes & Blog Archive",
        description: "Blog posts and technical notes by Nikhil Agrahari.",
        path: "/blog",
        items: blogs
          .filter((item) => Boolean(item?.slug))
          .slice(0, 50)
          .map((item) => ({
            name: item.title,
            path: `/blog/${item.slug}`,
          })),
      }),
    [blogs],
  );

  const fallbackImage = "/images/placeholders/content-placeholder.svg";

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
          "learning cybersecurity web development ai",
        ]}
        jsonLd={[
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          blogListSchema,
        ]}
      />

      <section className="section-wrap pt-4 sm:pt-6 pb-20">
        {/* Minimal Hero Header */}
        <div className="text-center max-w-4xl mx-auto">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400 mb-2">
            // ARTICLES &amp; ENGINEERING NOTES
          </p>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-wider text-slate-900 dark:text-white drop-shadow-sm">
            TECHNICAL{" "}
            <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              NOTES
            </span>
          </h1>
          <p className="mt-3 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Notes, tutorials, and practical insights on full-stack web engineering, cybersecurity, and modern systems.
          </p>
        </div>

        {/* FEATURED MAIN ARTICLE (Shows very first with light opacity glassmorphic styling and rich details) */}
        {featuredBlog && (!isFiltering || featuredMatches) && (
          <FadeInUp delay={0.06} className="mt-8 sm:mt-12">
            <div className="mb-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                  Featured Article
                </span>
              </div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                // SPOTLIGHT ROADMAP
              </span>
            </div>

            <article className="group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/70 p-6 sm:p-8 lg:p-9 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 dark:border-emerald-500/30 dark:bg-[#030d07]/60 dark:shadow-[0_20px_60px_rgba(0,10,2,0.6)]">
              {/* Subtle ambient glow mesh in background */}
              <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/12 dark:bg-emerald-400/12 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-500/12 dark:bg-teal-400/12 blur-3xl" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

              <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
                {/* Visual Cover Column (5 cols) */}
                <div className="lg:col-span-5">
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 dark:border-white/10 dark:bg-[#07111e] shadow-md group-hover:border-emerald-500/30 transition-all duration-300">
                    <img
                      src={featuredBlog.imageUrl || fallbackImage}
                      alt={featuredBlog.title}
                      className="h-64 sm:h-72 lg:h-[360px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      width={640}
                      height={360}
                      loading="eager"
                      decoding="async"
                    />
                    {/* Floating Source Pill */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full border border-emerald-400/50 bg-[#030d07]/90 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-emerald-300 backdrop-blur-md shadow-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {featuredBlog.source || "Featured"}
                    </div>
                    {/* Bottom Metadata Pill */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white">
                      <span className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15">
                        <Clock size={12} className="text-emerald-400" />
                        {featuredBlog.readTime}
                      </span>
                      <span className="bg-emerald-500 text-slate-950 font-black px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider shadow-sm">
                        Roadmap
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Column (7 cols) */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-4 sm:space-y-5">
                  {/* Meta Tag Row */}
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">
                      <Sparkles size={12} />
                      Spotlight Read
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">•</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                      {formatBlogDate(featuredBlog.publishedAt || featuredBlog.createdAt)}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">•</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                      {featuredBlog.readTime}
                    </span>
                  </div>

                  {/* Headline */}
                  <div>
                    <Link to={`/blog/${featuredBlog.slug}`}>
                      <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-[1.18] transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {featuredBlog.title}
                      </h2>
                    </Link>
                    {featuredBlog.subtitle && (
                      <p className="mt-2 font-medium text-sm sm:text-base text-emerald-700 dark:text-emerald-300/90 leading-snug">
                        {featuredBlog.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Excerpt / Story Preview */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {featuredBlog.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px] font-bold">
                    {(featuredBlog.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-slate-200 bg-slate-100/90 px-2.5 py-1 text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Author & Action Row */}
                  <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
                    {/* Author Pill */}
                    <div className="flex items-center gap-3">
                      <img
                        src={SITE_PROFILE.profileImage}
                        alt="Nikhil Agrahari"
                        className="h-10 w-10 rounded-full object-cover border-2 border-emerald-400/60 shadow-sm"
                        width={40}
                        height={40}
                        loading="lazy"
                      />
                      <div>
                        <p className="font-outfit text-xs font-bold text-slate-900 dark:text-white">
                          {SITE_PROFILE.fullName}
                        </p>
                        <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Author • {featuredBlog.source || "Medium"}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      {featuredBlog.url && (
                        <a
                          href={featuredBlog.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 sm:px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-[0_4px_20px_rgba(16,185,129,0.4)]"
                        >
                          Read on {featuredBlog.source || "Medium"}
                          <ArrowUpRight size={14} />
                        </a>
                      )}
                      <Link
                        to={`/blog/${featuredBlog.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white/80 px-4 sm:px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-800 transition-colors hover:border-emerald-500 hover:text-emerald-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-emerald-400 dark:hover:text-white"
                      >
                        Read Notes
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </FadeInUp>
        )}

        {/* OTHER ARTICLES SECTION (Displayed after the featured article) */}
        <div className="mt-16 sm:mt-20 border-t border-slate-200/80 dark:border-white/10 pt-10 sm:pt-12">
          <FadeInUp delay={0.1}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                  // Archive &amp; Publications
                </p>
                <h2 className="mt-1 font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  {isFiltering ? "Search Results" : "Other Articles"}
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                  Browse through tutorials, opinion editorials, and technical deep-dives across web architecture and systems.
                </p>
              </div>

              {/* Counter */}
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 self-start md:self-end">
                // SHOWING <span className="text-emerald-500 dark:text-emerald-400 font-extrabold">{otherBlogs.length}</span> ARTICLES
              </p>
            </div>
          </FadeInUp>

          {/* Filter & Search Bar */}
          <div className="space-y-4 mb-8">
            {/* Search Input */}
            <div className="relative max-w-xl">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                value={search}
                onChange={handleSearchChange}
                placeholder="Search articles by title, topic, or keyword..."
                className="w-full rounded-2xl border border-slate-300 bg-white/80 dark:border-white/10 dark:bg-[#030d07]/80 px-11 py-3 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none backdrop-blur-md focus:border-emerald-400 dark:focus:border-emerald-400 shadow-md transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={handleSearchClear}
                  aria-label="Clear search"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {BLOG_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className={`rounded-full px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-200 border ${
                    selectedCategory === category
                      ? "border-emerald-500 bg-emerald-500 text-slate-950 shadow-sm"
                      : "border-slate-200 bg-white/60 text-slate-600 hover:border-emerald-400/40 hover:text-emerald-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-emerald-400/40 dark:hover:text-emerald-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Cards Grid — cv-auto skips layout/paint until scrolled */}
          <div className="cv-auto">
            {otherBlogs.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 transform-gpu">
                {otherBlogs.map((blog, index) => (
                  <BlogCard key={blog._id || blog.slug} blog={blog} priority={index < 3} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No matching articles found"
                message="Try selecting another category or clearing your search query."
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPage;

