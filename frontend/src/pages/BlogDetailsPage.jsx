import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import { getBlogBySlug } from "@/services/blogs.service";
import { getErrorMessage } from "@/services/api";
import { BLOG_LINKS } from "@/constants/siteData";

const BlogDetailsPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBlog = useCallback(async () => {
    setLoading(true);
    setError("");
    const staticBlog = BLOG_LINKS.find((item) => item.slug === slug);

    try {
      const response = await getBlogBySlug(slug);
      const mergedBlog = response.data
        ? {
            ...staticBlog,
            ...response.data,
          }
        : staticBlog || null;
      setBlog(mergedBlog);
    } catch (requestError) {
      if (staticBlog) {
        setBlog(staticBlog);
      } else {
        setError(getErrorMessage(requestError, "Unable to load this article."));
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadBlog().catch(() => undefined);
  }, [loadBlog]);

  return (
    <section className="section-wrap pt-12 sm:pt-20">
      {loading ? <LoadingState message="Loading article..." cards={1} /> : null}
      {!loading && error ? (
        <ErrorState message={error} onRetry={loadBlog} />
      ) : null}
      {!loading && !error && !blog ? (
        <EmptyState
          title="Article not found"
          message="The requested blog post does not exist."
        />
      ) : null}

      {!loading && !error && blog ? (
        <article className="mx-auto max-w-4xl">
          <Helmet>
            <title>{blog.title} | Blog</title>
            <meta
              name="description"
              content={blog.excerpt || blog.content?.slice(0, 150)}
            />
          </Helmet>

          <Link
            to="/blog"
            className="mb-6 inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-cyan-100"
          >
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          <header className="card-surface rounded-2xl p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">
              {blog.source || 'Portfolio'}
            </p>
            <h1 className="mt-2 font-display text-3xl text-cyan-100 sm:text-4xl">
              {blog.title}
            </h1>
            {blog.subtitle ? (
              <p className="mt-3 text-sm text-slate-300">{blog.subtitle}</p>
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

          <div className="mt-5 card-surface rounded-2xl p-6">
            <p className="whitespace-pre-line leading-8 text-slate-200">
              {blog.content}
            </p>
          </div>
        </article>
      ) : null}
    </section>
  );
};

export default BlogDetailsPage;
