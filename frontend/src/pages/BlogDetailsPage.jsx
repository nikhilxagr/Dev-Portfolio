import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import FadeInUp from "@/components/animations/FadeInUp";
import SectionTitle from "@/components/ui/SectionTitle";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import SeoHead from "@/components/seo/SeoHead";
import { getBlogBySlug } from "@/services/blogs.service";
import { getErrorMessage } from "@/services/api";
import { mergeStaticAndApiContent } from "@/services/contentMerge";
import { createBlogPostingSchema, createBreadcrumbSchema } from "@/utils/seo";
import { BLOG_LINKS } from "@/constants/siteData";

const BlogDetailsPage = () => {
  const { slug } = useParams();
  const staticBlog = useMemo(
    () => BLOG_LINKS.find((item) => item.slug === slug) || null,
    [slug],
  );
  const [blog, setBlog] = useState(staticBlog);
  const [loading, setLoading] = useState(!staticBlog);
  const [error, setError] = useState("");
  const fallbackImage = "/images/placeholders/content-placeholder.svg";
  const previewImage = blog?.imageUrl || fallbackImage;
  const localWebpImage =
    previewImage.startsWith("/images/") && previewImage.endsWith(".png")
      ? previewImage.replace(/\.png$/i, ".webp")
      : "";

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackImage;
  };

  const loadBlog = useCallback(
    async (withSkeleton = false) => {
      if (withSkeleton) {
        setLoading(true);
      }

      setError("");

      try {
        const response = await getBlogBySlug(slug);
        const mergedBlog = response.data
          ? mergeStaticAndApiContent(staticBlog, response.data)
          : staticBlog || null;
        setBlog(mergedBlog);
      } catch (requestError) {
        if (staticBlog) {
          setBlog(staticBlog);
        } else {
          setError(
            getErrorMessage(requestError, "Unable to load this article."),
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [slug, staticBlog],
  );

  useEffect(() => {
    setBlog(staticBlog);
    setError("");
    setLoading(!staticBlog);
    loadBlog(false).catch(() => undefined);
  }, [loadBlog, staticBlog]);

  const rawDate = blog?.publishedAt || blog?.createdAt || "";
  const modifiedDate = blog?.updatedAt || rawDate;
  const parsedDate = rawDate ? new Date(rawDate) : null;
  const formattedDate =
    parsedDate && !Number.isNaN(parsedDate.getTime())
      ? parsedDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Published";
  const readTime = blog?.readTime || "";
  const canonicalPath = `/blog/${blog?.slug || slug || ""}`;
  const publishedTime =
    rawDate && !Number.isNaN(new Date(rawDate).getTime())
      ? new Date(rawDate).toISOString()
      : undefined;
  const modifiedTime =
    modifiedDate && !Number.isNaN(new Date(modifiedDate).getTime())
      ? new Date(modifiedDate).toISOString()
      : undefined;
  const blogSchema = blog ? createBlogPostingSchema(blog, canonicalPath) : null;

  return (
    <section className="section-wrap pt-12 sm:pt-20">
      {loading ? (
        <LoadingState
          message="Loading article..."
          cards={1}
          variant="details"
        />
      ) : null}
      {!loading && error ? (
        <ErrorState message={error} onRetry={() => loadBlog(true)} />
      ) : null}
      {!loading && !error && !blog ? (
        <EmptyState
          title="Article not found"
          message="The requested blog post does not exist."
        />
      ) : null}

      {!loading && !error && blog ? (
        <article className="mx-auto max-w-4xl">
          <SeoHead
            title={blog.title}
            description={blog.excerpt || blog.subtitle || blog.content}
            pathname={canonicalPath}
            image={previewImage}
            imageAlt={`${blog.title} cover`}
            type="article"
            publishedTime={publishedTime}
            modifiedTime={modifiedTime}
            keywords={[
              ...(Array.isArray(blog.tags) ? blog.tags : []),
              "Nikhil blog",
              "Nikhil portfolio",
            ]}
            jsonLd={[
              createBreadcrumbSchema([
                { name: "Home", path: "/" },
                { name: "Blog", path: "/blog" },
                { name: blog.title, path: canonicalPath },
              ]),
              blogSchema,
            ]}
          />

          <Link
            to="/blog"
            className="mb-6 inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-cyan-100"
          >
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          <FadeInUp>
            <header className="card-surface rounded-2xl p-6">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                {formattedDate}
                {readTime ? ` | ${readTime}` : ""}
              </p>

              <SectionTitle
                mobileCenter={false}
                className="mt-3"
                eyebrow={blog.source || "Portfolio"}
                title={blog.title}
                description={
                  blog.subtitle ||
                  blog.excerpt ||
                  "Technical notes and implementation learnings from recent builds."
                }
              />

              {blog.subtitle && blog.excerpt ? (
                <p className="mt-3 text-sm text-slate-400">{blog.excerpt}</p>
              ) : null}
              {blog.tags?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-cyan-300/25 bg-slate-900/80 px-2 py-1 text-xs text-cyan-100"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}

              {blog.url ? (
                <a
                  href={blog.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex text-sm font-semibold text-cyan-200 hover:text-cyan-100"
                >
                  Read Original Article
                </a>
              ) : null}
            </header>
          </FadeInUp>

          <FadeInUp delay={0.06}>
            <div className="mt-5 overflow-hidden rounded-2xl border border-cyan-300/20 bg-slate-900/70">
              <picture>
                {localWebpImage ? (
                  <source srcSet={localWebpImage} type="image/webp" />
                ) : null}
                <img
                  src={previewImage}
                  alt={`${blog.title} cover`}
                  className="h-auto max-h-[460px] w-full object-cover"
                  width={1280}
                  height={720}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  onError={handleImageError}
                />
              </picture>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.12}>
            <div className="mt-5 card-surface rounded-2xl p-6">
              <p className="whitespace-pre-line leading-8 text-slate-200">
                {blog.content ||
                  "Detailed notes will be added soon for this article."}
              </p>
            </div>
          </FadeInUp>
        </article>
      ) : null}
    </section>
  );
};

export default BlogDetailsPage;
