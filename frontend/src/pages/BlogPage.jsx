import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import BlogCard from "@/components/ui/BlogCard";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import { getBlogs } from "@/services/blogs.service";
import { mergeStaticAndApiContent } from "@/services/contentMerge";
import { createBreadcrumbSchema, createItemListSchema } from "@/utils/seo";
import { BLOG_POSTS as BLOG_LINKS, BLOG_CATEGORIES } from "@/data/blogsData";

const matchesBlogSearch = (blog, currentKeyword) => {
  const keyword = currentKeyword.trim().toLowerCase();
  if (!keyword) return true;

  const searchable = `${blog.title} ${blog.subtitle || ""} ${blog.excerpt || ""} ${(
    blog.tags || []
  ).join(" ")}`.toLowerCase();

  return searchable.includes(keyword);
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

  const blogListSchema = useMemo(
    () =>
      createItemListSchema({
        name: "Nikhil Engineering Docs & Technical Notes",
        description: "Engineering documentation and technical notes by Nikhil Agrahari.",
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

  return (
    <>
      <SeoHead
        title="Engineering Docs | Technical Notes & System Design | Nikhil Agrahari"
        description="Engineering documentation and technical notes by Nikhil Agrahari featuring deep-dive articles on system design, distributed systems, cybersecurity, and practical software design."
        pathname="/blog"
        keywords={[
          "Nikhil engineering docs",
          "Nikhil technical notes",
          "system design url shortener",
          "engineering archive",
          "cybersecurity and full stack engineering",
        ]}
        jsonLd={[
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          blogListSchema,
        ]}
      />

      <section className="section-wrap pt-4 sm:pt-8 pb-24">
        {/* Centered Hero Header (Sized & Styled like Journey Page) */}
        <div className="relative text-center max-w-5xl mx-auto pt-6 sm:pt-10 pb-12 sm:pb-16">
          {/* Ambient Radial Lighting */}
          <div className="pointer-events-none absolute inset-0 -top-12 flex items-center justify-center">
            <div className="h-72 w-[34rem] rounded-full bg-lime-400/[0.07] dark:bg-lime-400/[0.12] blur-[130px]" />
          </div>

          <div className="relative">
            {/* Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-lime-500/30 dark:border-lime-300/20 bg-lime-500/[0.06] dark:bg-lime-300/[0.04] px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-lime-600 dark:text-lime-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-500 dark:bg-lime-300" />
                Technical Archive &amp; Notes
              </span>
            </motion.div>

            {/* Proportional Heading (Matching Journey Page Scale) */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="mt-4 font-display text-[8.2vw] sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.05] tracking-tight text-zinc-900 dark:text-white"
            >
              ENGINEERING
              <br />
              <span className="bg-gradient-to-r from-lime-300 to-lime-500 bg-clip-text text-transparent">
                DOCS
              </span>
            </motion.h1>

            {/* Subtitle Details */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-zinc-500 dark:text-zinc-400 sm:text-base font-normal"
            >
              A curated knowledge base of system design architectures, distributed engineering notes, and technical writeups.
            </motion.p>

            {/* Core Stats Capsule (Matching Journey Page Structure) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3 }}
              className="mx-auto mt-10 max-w-4xl rounded-[2rem] border border-zinc-200 dark:border-white/[0.08] bg-white/80 dark:bg-zinc-950/40 p-6 backdrop-blur-xl shadow-sm dark:shadow-none"
            >
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:divide-x md:divide-zinc-200 dark:md:divide-white/[0.08]">
                {[
                  { label: "Total Notes", value: String(blogs.length).padStart(2, "0"), color: "text-zinc-900 dark:text-white" },
                  { label: "System Design", value: "01 Blueprint", color: "text-lime-500 dark:text-lime-300" },
                  { label: "Core Domains", value: "Distributed & Web", color: "text-zinc-900 dark:text-white" },
                  { label: "Archive Status", value: "LEARN & BUILD", color: "text-amber-600 dark:text-amber-500" },
                ].map(({ label, value, color }, i) => (
                  <div key={label} className={`flex flex-col items-center justify-center ${i > 0 ? "md:pl-4" : ""}`}>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-600 mb-1">
                      {label}
                    </span>
                    <span className={`text-xl font-black tracking-tight ${color}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Category Pills & Search Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-slate-200/80 dark:border-white/[0.08]">
          {/* Category Filter Pills */}
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full"
            style={{ scrollbarWidth: "none" }}
          >
            {BLOG_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategorySelect(category)}
                className={`shrink-0 rounded-full px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                  selectedCategory === category
                    ? "border-lime-500 bg-lime-400 text-slate-950 font-black shadow-[0_0_15px_rgba(163,230,53,0.3)]"
                    : "border-slate-200 bg-white/60 text-slate-600 hover:border-lime-400/40 hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-400 dark:hover:border-lime-400/40 dark:hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500"
            />
            <input
              value={search}
              onChange={handleSearchChange}
              placeholder="Search notes..."
              className="w-full rounded-2xl border border-slate-300/80 bg-white/80 dark:border-white/10 dark:bg-zinc-900/60 pl-9 pr-9 py-2 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none backdrop-blur-md focus:border-lime-400 dark:focus:border-lime-400 shadow-sm transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={handleSearchClear}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Subtle Counter Bar */}
        <div className="flex items-center justify-between pt-6 pb-2">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-lime-600 dark:text-lime-400">
            LATEST NOTES
          </p>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
            {String(filteredBlogs.length).padStart(2, "0")} NOTES
          </p>
        </div>

        {/* Full-width Horizontal Cards List */}
        <div className="mt-2 divide-y divide-transparent">
          {filteredBlogs.length > 0 ? (
            <div>
              {filteredBlogs.map((blog, index) => (
                <BlogCard
                  key={blog._id || blog.slug}
                  blog={blog}
                  index={index}
                  priority={index < 2}
                />
              ))}
            </div>
          ) : (
            <div className="pt-12">
              <EmptyState
                title="No matching notes found"
                message="Try selecting another category or clearing your search keywords."
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogPage;
