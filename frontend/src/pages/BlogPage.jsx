import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import BlogCard from "@/components/ui/BlogCard";
import NewsletterSubscriptionCard from "@/components/ui/NewsletterSubscriptionCard";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import { getBlogs } from "@/services/blogs.service";
import { mergeStaticAndApiContent } from "@/services/contentMerge";
import { createBreadcrumbSchema, createItemListSchema } from "@/utils/seo";
import { BLOG_POSTS as BLOG_LINKS, BLOG_CATEGORIES } from "@/data/blogsData";

const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;

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
    const syncBlogs = () => {
      getBlogs({ includeDrafts: "true" })
        .then((response) => {
          const apiBlogs = response.data || [];
          if (apiBlogs.length > 0) {
            const draftedSlugs = new Set(
              apiBlogs
                .filter((b) => b.status === "draft")
                .map((b) => b.slug),
            );
            const mergedMap = new Map();
            BLOG_LINKS.forEach((staticBlog) => {
              if (!draftedSlugs.has(staticBlog.slug)) {
                mergedMap.set(staticBlog.slug, staticBlog);
              }
            });
            apiBlogs
              .filter((b) => b.status !== "draft")
              .forEach((apiBlog) => {
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
    };

    syncBlogs();
    window.addEventListener("portfolio:cms-updated", syncBlogs);
    return () => window.removeEventListener("portfolio:cms-updated", syncBlogs);
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

      <section className="section-wrap pt-6 sm:pt-8 pb-24">
        {/* Centered Hero Header */}
        <div className="relative text-center max-w-5xl mx-auto pb-12 sm:pb-16">
          <div className="relative">
            {/* Eyebrow Badge */}
            <MotionDiv
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-500/[0.08] px-4 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400">
                Technical Archive &amp; Notes
              </span>
            </MotionDiv>

            {/* Proportional Heading */}
            <MotionH1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.08] tracking-tight text-slate-900 dark:text-[#eef0f5]"
            >
              Engineering{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                Docs
              </span>
            </MotionH1>

            {/* Subtitle Details */}
            <MotionP
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8] sm:text-base"
            >
              A curated knowledge base of system design architectures, distributed engineering notes, and technical writeups.
            </MotionP>

            {/* Core Stats Capsule */}
            <MotionDiv
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-9 max-w-4xl rounded-2xl border border-black/[0.08] bg-white p-4 sm:p-6 dark:border-white/[0.08] dark:bg-[#11141c]"
            >
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 md:divide-x md:divide-black/[0.08] dark:md:divide-white/[0.08]">
                {[
                  { label: "Total Notes", value: String(blogs.length).padStart(2, "0"), color: "text-slate-900 dark:text-[#eef0f5]" },
                  { label: "System Design", value: "01 Blueprint", color: "text-emerald-600 dark:text-emerald-400" },
                  { label: "Core Domains", value: "Distributed & Web", color: "text-slate-900 dark:text-[#eef0f5]" },
                  { label: "Archive Status", value: "Active", color: "text-emerald-600 dark:text-emerald-400" },
                ].map(({ label, value, color }, i) => (
                  <div key={label} className={`flex flex-col items-center justify-center text-center ${i > 0 ? "md:pl-4" : ""}`}>
                    <span className="mb-1 text-xs font-medium text-slate-500 dark:text-[#7a8296]">
                      {label}
                    </span>
                    <span className={`text-base sm:text-lg font-semibold tracking-tight tabular-nums ${color}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </MotionDiv>
          </div>
        </div>

        {/* Category Pills & Search Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-black/[0.08] dark:border-white/[0.08]">
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
                className={`shrink-0 rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 ${
                  selectedCategory === category
                    ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-slate-950"
                    : "border-black/[0.08] bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8] dark:hover:border-white/[0.16] dark:hover:text-[#eef0f5]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search
              size={16}
              strokeWidth={1.5}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#7a8296]"
            />
            <input
              id="blog-search"
              name="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search notes..."
              className="h-10 w-full rounded-lg border border-black/[0.08] bg-white pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-emerald-600 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#eef0f5] dark:placeholder:text-[#7a8296] dark:focus:border-emerald-500"
            />
            {search && (
              <button
                type="button"
                onClick={handleSearchClear}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:text-[#7a8296] dark:hover:text-[#eef0f5]"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>

        {/* Subtle Counter Bar */}
        <div className="flex items-center justify-between pt-6 pb-2">
          <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Latest notes
          </p>
          <p className="font-mono text-xs text-slate-500 tabular-nums dark:text-[#7a8296]">
            {String(filteredBlogs.length).padStart(2, "0")} notes
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

        {/* Newsletter Subscription Section */}
        <div className="mt-16 sm:mt-24">
          <NewsletterSubscriptionCard />
        </div>
      </section>
    </>
  );
};

export default BlogPage;
