import { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const BlogCard = ({
  blog,
  index = 0,
  className = "",
  priority = false,
}) => {
  const rawDate = blog.createdAt || blog.publishedAt || "";
  const parsedDate = rawDate ? new Date(rawDate) : null;
  const formattedDate =
    parsedDate && !Number.isNaN(parsedDate.getTime())
      ? parsedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      : "Recent Note";
  const readTime = blog.readTime || "4 min read";
  const fallbackImage = "/images/placeholders/content-placeholder.svg";
  const previewImage = blog.imageUrl || fallbackImage;
  const localWebpImage =
    previewImage.startsWith("/images/") && previewImage.endsWith(".png")
      ? previewImage.replace(/\.png$/i, ".webp")
      : "";

  const imageLoading = priority ? "eager" : "lazy";
  const imageFetchPriority = priority ? "high" : "auto";
  const indexStr = String(index + 1).padStart(2, "0");

  const categoryName =
    (Array.isArray(blog.tags) && blog.tags[0]) ||
    blog.category ||
    blog.source ||
    "Article";

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackImage;
  };

  return (
    <Link
      to={`/blog/${blog.slug}`}
      className={`group relative block w-full py-8 sm:py-10 border-b border-slate-200/80 dark:border-white/[0.08] transition-all duration-300 hover:bg-slate-100/60 dark:hover:bg-white/[0.03] rounded-3xl px-4 sm:px-6 -mx-4 sm:-mx-6 hover:shadow-lg dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] ${className}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left Column: Number Index + Article Info (7 cols on lg) */}
        <div className="lg:col-span-7 flex items-start gap-4 sm:gap-6">
          {/* Index 01 — */}
          <div className="shrink-0 flex flex-col items-center pt-1">
            <span className="font-mono text-xs sm:text-sm font-bold text-slate-400 dark:text-zinc-500 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors duration-300">
              {indexStr}
            </span>
            <span className="w-3.5 h-[2px] bg-slate-300 dark:bg-zinc-700 mt-1 transition-all duration-300 group-hover:w-7 group-hover:bg-lime-500" />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            {/* Category Eyebrow */}
            <p className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-lime-600 dark:text-lime-400 transition-all duration-300 group-hover:tracking-[0.25em]">
              {categoryName}
            </p>

            {/* Title in Clean Font Outfit Title Case */}
            <h3 className="mt-1.5 font-outfit text-xl sm:text-2xl lg:text-[27px] font-bold text-slate-900 dark:text-white leading-snug tracking-tight transition-colors duration-300 group-hover:text-lime-600 dark:group-hover:text-lime-400">
              {blog.title}
            </h3>

            {/* Excerpt in Clean Font Jakarta */}
            <p className="mt-2.5 font-jakarta text-xs sm:text-sm text-slate-600 dark:text-zinc-400 font-normal leading-relaxed line-clamp-2 sm:line-clamp-3">
              {blog.excerpt || blog.content}
            </p>

            {/* Bottom Meta & Action */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-white/[0.04]">
              <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400">
                <span>{formattedDate}</span>
                <span>•</span>
                <span>{readTime}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-800 dark:text-zinc-200 transition-colors duration-300 group-hover:text-lime-600 dark:group-hover:text-lime-400">
                <span>Read note</span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Preview Image Frame (5 cols on lg) */}
        <div className="lg:col-span-5 w-full">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-slate-900/95 shadow-sm transition-all duration-500 group-hover:border-lime-500/50 dark:group-hover:border-lime-400/50 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
            <picture>
              {localWebpImage ? (
                <source srcSet={localWebpImage} type="image/webp" />
              ) : null}
              <img
                src={previewImage}
                alt={blog.title}
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                width={480}
                height={300}
                loading={imageLoading}
                decoding="async"
                fetchPriority={imageFetchPriority}
                onError={handleImageError}
              />
            </picture>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
};

const MemoizedBlogCard = memo(BlogCard);

MemoizedBlogCard.displayName = "BlogCard";

export default MemoizedBlogCard;
