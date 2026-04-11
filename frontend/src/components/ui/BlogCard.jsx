import { memo } from "react";
import { Link } from "react-router-dom";

const BlogCard = ({
  blog,
  variant = "default",
  className = "",
  priority = false,
}) => {
  const isCompact = variant === "compact";
  const rawDate = blog.createdAt || blog.publishedAt || "";
  const parsedDate = rawDate ? new Date(rawDate) : null;
  const formattedDate =
    parsedDate && !Number.isNaN(parsedDate.getTime())
      ? parsedDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Published";
  const readTime = blog.readTime || "";
  const fallbackImage = "/images/placeholders/content-placeholder.svg";
  const previewImage = blog.imageUrl || fallbackImage;
  const localWebpImage =
    previewImage.startsWith("/images/") && previewImage.endsWith(".png")
      ? previewImage.replace(/\.png$/i, ".webp")
      : "";
  const imageWidth = isCompact ? 320 : 352;
  const imageHeight = isCompact ? 144 : 176;
  const imageLoading = priority ? "eager" : "lazy";
  const imageFetchPriority = priority ? "high" : "auto";
  const tags = Array.isArray(blog.tags)
    ? blog.tags
    : typeof blog.tags === "string"
      ? blog.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackImage;
  };

  return (
    <article
      className={`card-surface group flex h-full flex-col rounded-2xl transition hover:-translate-y-1 ${isCompact ? "p-4" : "p-5"} ${className}`}
    >
      <div className="mb-4 overflow-hidden rounded-xl border border-cyan-300/20 bg-slate-900/70">
        <picture>
          {localWebpImage ? (
            <source srcSet={localWebpImage} type="image/webp" />
          ) : null}
          <img
            src={previewImage}
            alt={`${blog.title} preview`}
            className={`${isCompact ? "h-36" : "h-44"} w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]`}
            width={imageWidth}
            height={imageHeight}
            loading={imageLoading}
            decoding="async"
            fetchPriority={imageFetchPriority}
            onError={handleImageError}
          />
        </picture>
      </div>

      <p className="text-xs uppercase tracking-[0.14em] text-emerald-200">
        {blog.source || "Portfolio"} | {formattedDate}
        {readTime ? ` | ${readTime}` : ""}
      </p>
      <h3
        className={`mt-2 font-semibold text-cyan-100 ${isCompact ? "line-clamp-2 min-h-[3.4rem] text-lg" : "text-xl"}`}
      >
        {blog.title}
      </h3>
      <p
        className={`mt-2 text-sm text-slate-300 ${isCompact ? "line-clamp-2 min-h-[3rem]" : "line-clamp-3"}`}
      >
        {blog.excerpt || blog.content}
      </p>

      <div
        className={`mt-4 flex flex-wrap gap-2 ${isCompact ? "min-h-[2rem]" : ""}`}
      >
        {tags.slice(0, isCompact ? 3 : 4).map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-cyan-300/25 bg-slate-900/80 px-2 py-1 text-xs text-cyan-100"
          >
            #{tag}
          </span>
        ))}
      </div>

      <Link
        to={`/blog/${blog.slug}`}
        className={`inline-block text-sm font-semibold text-cyan-200 hover:text-cyan-100 ${isCompact ? "mt-auto pt-4" : "mt-5"}`}
      >
        Read Article
      </Link>
    </article>
  );
};

const MemoizedBlogCard = memo(BlogCard);

MemoizedBlogCard.displayName = "BlogCard";

export default MemoizedBlogCard;
