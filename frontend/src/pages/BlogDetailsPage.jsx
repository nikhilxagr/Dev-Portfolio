import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import FadeInUp from "@/components/animations/FadeInUp";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import SeoHead from "@/components/seo/SeoHead";
import { getBlogBySlug } from "@/services/blogs.service";
import { getErrorMessage } from "@/services/api";
import { mergeStaticAndApiContent } from "@/services/contentMerge";
import { createBlogPostingSchema, createBreadcrumbSchema } from "@/utils/seo";
import { BLOG_POSTS as BLOG_LINKS } from "@/data/blogsData";
import SystemDesignArticleView from "@/components/system-design/SystemDesignArticleView";
import { SystemDesignDetailView } from "@/pages/SystemDesignPage";
import {
  SYSTEM_DESIGNS,
  getSystemDesignById,
  getSystemDesignArticleById,
} from "@/data/systemDesignData";

const BlogDetailsPage = () => {
  const { slug } = useParams();

  const system = useMemo(() => {
    return getSystemDesignById(slug) || null;
  }, [slug]);

  if (system) {
    const article = getSystemDesignArticleById(system.id);
    const currentIndex = SYSTEM_DESIGNS.findIndex((s) => s.id === system.id);
    const prevSystem = currentIndex > 0 ? SYSTEM_DESIGNS[currentIndex - 1] : null;
    const nextSystem =
      currentIndex < SYSTEM_DESIGNS.length - 1
        ? SYSTEM_DESIGNS[currentIndex + 1]
        : null;

    if (article) {
      return (
        <SystemDesignArticleView
          system={system}
          article={article}
          prevSystem={prevSystem}
          nextSystem={nextSystem}
          backUrl="/blog"
          backLabel="Back to Engineering Docs"
          baseRoute="/blog"
        />
      );
    }

    return (
      <SystemDesignDetailView
        system={system}
        prevSystem={prevSystem}
        nextSystem={nextSystem}
        backUrl="/blog"
        backLabel="Back to Engineering Docs"
        baseRoute="/blog"
      />
    );
  }

  return <StandardBlogDetails slug={slug} />;
};

const StandardBlogDetails = ({ slug }) => {
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
    window.scrollTo({ top: 0, behavior: "smooth" });

    const refresh = () => loadBlog(false).catch(() => undefined);
    window.addEventListener("portfolio:cms-updated", refresh);
    let channel = null;
    if ("BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel("portfolio_cms_sync");
        channel.onmessage = refresh;
      } catch {
        channel = null;
      }
    }
    return () => {
      window.removeEventListener("portfolio:cms-updated", refresh);
      if (channel) channel.close();
    };
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
    <section className="section-wrap pt-6 sm:pt-8 pb-24">
      <div className="mx-auto max-w-4xl">
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
            message="The requested article does not exist."
          />
        ) : null}

        {!loading && !error && blog ? (
          <>
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

            <div className="mb-6 flex items-center justify-between gap-3">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 rounded-lg border border-black/[0.08] bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors duration-150 hover:border-slate-300 hover:text-slate-950 sm:text-sm dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8] dark:hover:border-white/[0.16] dark:hover:text-[#eef0f5]"
              >
                <ArrowLeft size={16} strokeWidth={1.5} />
                Back to Blog
              </Link>

              <span className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                {blog.source || "Notes"}
              </span>
            </div>

            <article className="space-y-6">
              <FadeInUp>
                <header className="rounded-2xl border border-black/[0.08] bg-white p-6 sm:p-8 dark:border-white/[0.08] dark:bg-[#11141c]">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">
                      {blog.source || "Portfolio"}
                    </span>
                    <span>·</span>
                    <span>{formattedDate}</span>
                    {readTime ? (
                      <>
                        <span>·</span>
                        <span>{readTime}</span>
                      </>
                    ) : null}
                  </div>

                  <h1 className="mt-3 font-display text-2xl font-semibold tracking-[-0.02em] leading-[1.15] text-slate-900 sm:text-3xl lg:text-4xl dark:text-[#eef0f5]">
                    {blog.title}
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-[#a3a9b8]">
                    {blog.subtitle ||
                      blog.excerpt ||
                      "Technical notes and implementation lessons from recent builds."}
                  </p>

                  {blog.subtitle && blog.excerpt && blog.excerpt !== blog.subtitle ? (
                    <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-[#7a8296]">
                      {blog.excerpt}
                    </p>
                  ) : null}

                  {blog.tags?.length ? (
                    <div className="mt-5 flex flex-wrap gap-1.5 border-t border-black/[0.06] pt-4 dark:border-white/[0.08]">
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-black/[0.08] bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {blog.url ? (
                    <a
                      href={blog.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition-colors duration-150 hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                    >
                      Read Original Article
                      <ExternalLink size={15} strokeWidth={1.5} />
                    </a>
                  ) : null}
                </header>
              </FadeInUp>

              <FadeInUp delay={0.04}>
                <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-slate-100 dark:border-white/[0.08] dark:bg-[#0b0d14]">
                  <picture>
                    {localWebpImage ? (
                      <source srcSet={localWebpImage} type="image/webp" />
                    ) : null}
                    <img
                      src={previewImage}
                      alt={`${blog.title} cover`}
                      className="max-h-[460px] w-full object-contain"
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

              <FadeInUp delay={0.08}>
                <div className="rounded-2xl border border-black/[0.08] bg-white p-6 sm:p-8 dark:border-white/[0.08] dark:bg-[#11141c]">
                  <p className="whitespace-pre-line text-sm leading-7 text-slate-700 sm:text-base sm:leading-8 dark:text-[#d1d5df]">
                    {blog.content ||
                      "Detailed notes will be added soon for this article."}
                  </p>
                </div>
              </FadeInUp>
            </article>
          </>
        ) : null}
      </div>
    </section>
  );
};

export default BlogDetailsPage;
