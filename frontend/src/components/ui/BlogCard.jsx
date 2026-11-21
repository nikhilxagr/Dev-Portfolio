import { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const formatReadTime = (value) => {
  const text = String(value || "4 min read").trim();
  return /min/i.test(text) ? text.toLowerCase() : `${text} min read`;
};

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
  const readTime = formatReadTime(blog.readTime || blog.readingTime);
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
      className={`group relative block w-full rounded-xl border-b border-black/[0.08] px-4 py-8 transition-colors duration-150 hover:bg-slate-50 sm:px-6 sm:py-10 dark:border-white/[0.08] dark:hover:bg-[#11141c] ${className}`}
    >
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Left Column: Number Index + Article Info */}
        <div className="flex items-start gap-4 sm:gap-6 lg:col-span-7">
          <div className="flex shrink-0 flex-col items-center pt-1">
            <span className="font-mono text-xs font-medium text-slate-400 tabular-nums transition-colors duration-150 group-hover:text-emerald-700 sm:text-sm dark:text-[#7a8296] dark:group-hover:text-emerald-400">
              {indexStr}
            </span>
            <span className="mt-1 h-[2px] w-4 bg-slate-300 transition-colors duration-150 group-hover:bg-emerald-600 dark:bg-white/[0.14] dark:group-hover:bg-emerald-400" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
              {categoryName}
            </p>

            <h3 className="mt-1.5 font-display text-xl font-medium leading-snug tracking-[-0.01em] text-slate-900 transition-colors duration-150 group-hover:text-emerald-700 sm:text-2xl dark:text-[#eef0f5] dark:group-hover:text-emerald-400">
              {blog.title}
            </h3>

            <p className="mt-2.5 text-sm leading-relaxed text-slate-600 line-clamp-2 sm:text-base sm:line-clamp-3 dark:text-[#a3a9b8]">
              {blog.excerpt || blog.content}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-3 dark:border-white/[0.06]">
              <div className="flex items-center gap-2 whitespace-nowrap font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                <span>{formattedDate}</span>
                <span>·</span>
                <span>{readTime}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-800 transition-colors duration-150 group-hover:text-emerald-700 dark:text-[#eef0f5] dark:group-hover:text-emerald-400">
                <span>Read note</span>
                <ArrowRight size={14} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Preview Image Frame */}
        <div className="w-full lg:col-span-5">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-black/[0.08] bg-slate-50 transition-colors duration-150 group-hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#0b0d14] dark:group-hover:border-white/[0.16]">
            <picture>
              {localWebpImage ? (
                <source srcSet={localWebpImage} type="image/webp" />
              ) : null}
              <img
                src={previewImage}
                alt={blog.title}
                className="h-full w-full object-contain"
                width={480}
                height={300}
                loading={imageLoading}
                decoding="async"
                fetchPriority={imageFetchPriority}
                onError={handleImageError}
              />
            </picture>
          </div>
        </div>
      </div>
    </Link>
  );
};

const MemoizedBlogCard = memo(BlogCard);

MemoizedBlogCard.displayName = "BlogCard";

export default MemoizedBlogCard;
