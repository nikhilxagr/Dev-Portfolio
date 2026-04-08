import { Link } from 'react-router-dom'

const BlogCard = ({ blog }) => {
  const rawDate = blog.createdAt || blog.publishedAt || ''
  const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString() : 'Published'
  const fallbackImage = '/images/placeholders/content-placeholder.svg'
  const previewImage = blog.imageUrl || fallbackImage

  const handleImageError = (event) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = fallbackImage
  }

  return (
    <article className="card-surface group rounded-2xl p-5 transition hover:-translate-y-1">
      <div className="mb-4 overflow-hidden rounded-xl border border-cyan-300/20 bg-slate-900/70">
        <img
          src={previewImage}
          alt={`${blog.title} preview`}
          className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          onError={handleImageError}
        />
      </div>

      <p className="text-xs uppercase tracking-[0.14em] text-emerald-200">
        {blog.source ? `${blog.source} | ${formattedDate}` : formattedDate}
      </p>
      <h3 className="mt-2 text-xl font-semibold text-cyan-100">{blog.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-slate-300">{blog.excerpt || blog.content}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {blog.tags?.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-cyan-300/25 bg-slate-900/80 px-2 py-1 text-xs text-cyan-100"
          >
            #{tag}
          </span>
        ))}
      </div>

      <Link to={`/blog/${blog.slug}`} className="mt-5 inline-block text-sm font-semibold text-cyan-200 hover:text-cyan-100">
        Read Article
      </Link>
    </article>
  )
}

export default BlogCard
