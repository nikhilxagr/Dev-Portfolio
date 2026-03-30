import { useCallback, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { LogOut, MailOpen, RefreshCcw } from 'lucide-react'
import Button from '@/components/ui/Button'
import LoadingState from '@/components/ui/LoadingState'
import ErrorState from '@/components/ui/ErrorState'
import EmptyState from '@/components/ui/EmptyState'
import { PROJECT_CATEGORIES } from '@/constants/siteData'
import { getErrorMessage } from '@/services/api'
import { getProjects } from '@/services/projects.service'
import { getBlogs } from '@/services/blogs.service'
import {
  createAdminBlog,
  createAdminProject,
  deleteAdminBlog,
  deleteAdminProject,
  getAdminContacts,
  markAdminContactAsRead,
  updateAdminBlog,
  updateAdminProject,
} from '@/services/admin.service'
import { getStoredAdminUser, logoutAdmin } from '@/services/auth.service'

const createInitialProjectForm = () => ({
  title: '',
  description: '',
  category: PROJECT_CATEGORIES[1],
  techStack: '',
  githubUrl: '',
  liveDemoUrl: '',
  imageUrl: '',
  problemStatement: '',
  solutionSummary: '',
  featured: false,
})

const createInitialBlogForm = () => ({
  title: '',
  excerpt: '',
  content: '',
  tags: '',
  imageUrl: '',
})

const parseCommaList = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const formatDate = (value) => {
  if (!value) {
    return '-'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return date.toLocaleString()
}

const AdminDashboardPage = () => {
  const navigate = useNavigate()
  const adminUser = useMemo(() => getStoredAdminUser(), [])

  const [activeTab, setActiveTab] = useState('projects')
  const [projects, setProjects] = useState([])
  const [blogs, setBlogs] = useState([])
  const [contacts, setContacts] = useState([])
  const [contactStatus, setContactStatus] = useState('all')

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [projectForm, setProjectForm] = useState(createInitialProjectForm())
  const [blogForm, setBlogForm] = useState(createInitialBlogForm())
  const [editingProjectId, setEditingProjectId] = useState('')
  const [editingBlogId, setEditingBlogId] = useState('')

  const handleAuthFailure = useCallback(() => {
    logoutAdmin()
    navigate('/admin/login', {
      replace: true,
      state: { reason: 'Session expired. Please sign in again.' },
    })
  }, [navigate])

  const loadDashboard = useCallback(async ({ status = 'all', useLoader = true } = {}) => {
    setError('')

    if (useLoader) {
      setLoading(true)
    } else {
      setRefreshing(true)
    }

    try {
      const [projectResponse, blogResponse, contactResponse] = await Promise.all([
        getProjects({ limit: 100 }),
        getBlogs({ limit: 100 }),
        getAdminContacts({ status, limit: 300 }),
      ])

      setProjects(projectResponse.data || [])
      setBlogs(blogResponse.data || [])
      setContacts(contactResponse.data || [])
    } catch (requestError) {
      if (requestError?.response?.status === 401) {
        handleAuthFailure()
        return
      }

      setError(getErrorMessage(requestError, 'Unable to load dashboard data.'))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [handleAuthFailure])

  useEffect(() => {
    loadDashboard({ status: 'all', useLoader: true }).catch(() => undefined)
  }, [loadDashboard])

  const resetProjectForm = () => {
    setProjectForm(createInitialProjectForm())
    setEditingProjectId('')
  }

  const resetBlogForm = () => {
    setBlogForm(createInitialBlogForm())
    setEditingBlogId('')
  }

  const updateProjectField = (field) => (event) => {
    const value = field === 'featured' ? event.target.checked : event.target.value

    setProjectForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateBlogField = (field) => (event) => {
    setBlogForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
  }

  const submitProject = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setNotice('')

    try {
      const techStack = parseCommaList(projectForm.techStack)
      if (techStack.length === 0) {
        setError('Tech stack requires at least one item.')
        return
      }

      const payload = {
        title: projectForm.title.trim(),
        description: projectForm.description.trim(),
        category: projectForm.category,
        techStack,
        githubUrl: projectForm.githubUrl.trim(),
        liveDemoUrl: projectForm.liveDemoUrl.trim(),
        imageUrl: projectForm.imageUrl.trim(),
        problemStatement: projectForm.problemStatement.trim(),
        solutionSummary: projectForm.solutionSummary.trim(),
        featured: Boolean(projectForm.featured),
      }

      if (editingProjectId) {
        await updateAdminProject(editingProjectId, payload)
        setNotice('Project updated successfully.')
      } else {
        await createAdminProject(payload)
        setNotice('Project created successfully.')
      }

      resetProjectForm()
      await loadDashboard({ status: contactStatus, useLoader: false })
    } catch (requestError) {
      if (requestError?.response?.status === 401) {
        handleAuthFailure()
        return
      }

      setError(getErrorMessage(requestError, 'Unable to save project.'))
    } finally {
      setSubmitting(false)
    }
  }

  const submitBlog = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setNotice('')

    try {
      const payload = {
        title: blogForm.title.trim(),
        excerpt: blogForm.excerpt.trim(),
        content: blogForm.content.trim(),
        tags: parseCommaList(blogForm.tags),
        imageUrl: blogForm.imageUrl.trim(),
      }

      if (editingBlogId) {
        await updateAdminBlog(editingBlogId, payload)
        setNotice('Blog updated successfully.')
      } else {
        await createAdminBlog(payload)
        setNotice('Blog created successfully.')
      }

      resetBlogForm()
      await loadDashboard({ status: contactStatus, useLoader: false })
    } catch (requestError) {
      if (requestError?.response?.status === 401) {
        handleAuthFailure()
        return
      }

      setError(getErrorMessage(requestError, 'Unable to save blog.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project? This action cannot be undone.')) {
      return
    }

    setSubmitting(true)
    setError('')
    setNotice('')

    try {
      await deleteAdminProject(id)
      setNotice('Project deleted successfully.')
      await loadDashboard({ status: contactStatus, useLoader: false })
    } catch (requestError) {
      if (requestError?.response?.status === 401) {
        handleAuthFailure()
        return
      }

      setError(getErrorMessage(requestError, 'Unable to delete project.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Delete this blog post? This action cannot be undone.')) {
      return
    }

    setSubmitting(true)
    setError('')
    setNotice('')

    try {
      await deleteAdminBlog(id)
      setNotice('Blog deleted successfully.')
      await loadDashboard({ status: contactStatus, useLoader: false })
    } catch (requestError) {
      if (requestError?.response?.status === 401) {
        handleAuthFailure()
        return
      }

      setError(getErrorMessage(requestError, 'Unable to delete blog.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleMarkRead = async (id) => {
    setSubmitting(true)
    setError('')
    setNotice('')

    try {
      await markAdminContactAsRead(id)
      setNotice('Message marked as read.')
      await loadDashboard({ status: contactStatus, useLoader: false })
    } catch (requestError) {
      if (requestError?.response?.status === 401) {
        handleAuthFailure()
        return
      }

      setError(getErrorMessage(requestError, 'Unable to update message status.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditProject = (project) => {
    setEditingProjectId(project._id)
    setProjectForm({
      title: project.title || '',
      description: project.description || '',
      category: project.category || PROJECT_CATEGORIES[1],
      techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : '',
      githubUrl: project.githubUrl || '',
      liveDemoUrl: project.liveDemoUrl || '',
      imageUrl: project.imageUrl || '',
      problemStatement: project.problemStatement || '',
      solutionSummary: project.solutionSummary || '',
      featured: Boolean(project.featured),
    })
    setActiveTab('projects')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEditBlog = (blog) => {
    setEditingBlogId(blog._id)
    setBlogForm({
      title: blog.title || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
      imageUrl: blog.imageUrl || '',
    })
    setActiveTab('blogs')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleContactStatusChange = (status) => {
    setContactStatus(status)
    loadDashboard({ status, useLoader: false }).catch(() => undefined)
  }

  const signOut = () => {
    logoutAdmin()
    navigate('/admin/login', { replace: true })
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Nikhil Portfolio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="section-wrap pt-8 sm:pt-10">
        <div className="rounded-2xl border border-cyan-300/25 bg-slate-950/85 p-5 shadow-neon sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Admin Dashboard</p>
              <h1 className="font-display text-xl uppercase tracking-wide text-cyan-50 sm:text-2xl">
                Content Control Center
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Signed in as <span className="text-cyan-100">{adminUser?.email || 'admin'}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => loadDashboard({ status: contactStatus, useLoader: false })}
                disabled={refreshing || loading || submitting}
                className="px-3 py-2"
              >
                <RefreshCcw size={15} />
                Refresh
              </Button>
              <Button variant="secondary" onClick={signOut} className="px-3 py-2">
                <LogOut size={15} />
                Logout
              </Button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { key: 'projects', label: `Projects (${projects.length})` },
              { key: 'blogs', label: `Blogs (${blogs.length})` },
              { key: 'contacts', label: `Contacts (${contacts.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  activeTab === tab.key
                    ? 'border-cyan-300 bg-cyan-300/15 text-cyan-100'
                    : 'border-slate-600 text-slate-300 hover:border-cyan-300/50 hover:text-cyan-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {notice ? (
            <p className="mt-4 rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-100">
              {notice}
            </p>
          ) : null}

          {error ? (
            <p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {error}
            </p>
          ) : null}
        </div>

        <div className="mt-6">
          {loading ? <LoadingState message="Loading admin data..." cards={6} /> : null}
          {!loading && error && !projects.length && !blogs.length && !contacts.length ? (
            <ErrorState message={error} onRetry={() => loadDashboard({ status: contactStatus, useLoader: true })} />
          ) : null}

          {!loading && activeTab === 'projects' ? (
            <div className="grid gap-5 xl:grid-cols-[1.1fr_1fr]">
              <form onSubmit={submitProject} className="card-surface p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-cyan-100">
                  {editingProjectId ? 'Edit project' : 'Create project'}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Required: title, description, category, and at least one tech stack item.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-200 sm:col-span-2">
                    <span>Title</span>
                    <input
                      required
                      value={projectForm.title}
                      onChange={updateProjectField('title')}
                      className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-200">
                    <span>Category</span>
                    <select
                      value={projectForm.category}
                      onChange={updateProjectField('category')}
                      className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                    >
                      {PROJECT_CATEGORIES.filter((item) => item !== 'All').map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2 text-sm text-slate-200">
                    <span>Tech stack (comma separated)</span>
                    <input
                      required
                      value={projectForm.techStack}
                      onChange={updateProjectField('techStack')}
                      className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                      placeholder="React, Node.js, MongoDB"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-200 sm:col-span-2">
                    <span>Description</span>
                    <textarea
                      required
                      rows={3}
                      value={projectForm.description}
                      onChange={updateProjectField('description')}
                      className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-200">
                    <span>GitHub URL</span>
                    <input
                      value={projectForm.githubUrl}
                      onChange={updateProjectField('githubUrl')}
                      className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-200">
                    <span>Live demo URL</span>
                    <input
                      value={projectForm.liveDemoUrl}
                      onChange={updateProjectField('liveDemoUrl')}
                      className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-200 sm:col-span-2">
                    <span>Image URL</span>
                    <input
                      value={projectForm.imageUrl}
                      onChange={updateProjectField('imageUrl')}
                      className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-200 sm:col-span-2">
                    <span>Problem statement</span>
                    <textarea
                      rows={3}
                      value={projectForm.problemStatement}
                      onChange={updateProjectField('problemStatement')}
                      className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-200 sm:col-span-2">
                    <span>Solution summary</span>
                    <textarea
                      rows={4}
                      value={projectForm.solutionSummary}
                      onChange={updateProjectField('solutionSummary')}
                      className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                    />
                  </label>

                  <label className="flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={projectForm.featured}
                      onChange={updateProjectField('featured')}
                      className="h-4 w-4 rounded border-cyan-300/50"
                    />
                    Mark as featured project
                  </label>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : editingProjectId ? 'Update project' : 'Create project'}
                  </Button>
                  {editingProjectId ? (
                    <Button type="button" variant="ghost" onClick={resetProjectForm} disabled={submitting}>
                      Cancel edit
                    </Button>
                  ) : null}
                </div>
              </form>

              <div className="card-surface p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-cyan-100">Published projects</h2>
                <p className="mt-1 text-sm text-slate-400">Manage project cards displayed on the public portfolio.</p>

                <div className="mt-4 space-y-3">
                  {projects.length === 0 ? (
                    <EmptyState title="No projects available" message="Create your first project from the form." />
                  ) : null}

                  {projects.map((project) => (
                    <article
                      key={project._id}
                      className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-cyan-100">{project.title}</h3>
                          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">
                            {project.category} | {formatDate(project.createdAt)}
                          </p>
                          <p className="mt-2 text-sm text-slate-300 line-clamp-2">{project.description}</p>
                        </div>
                        {project.featured ? (
                          <span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-2 py-1 text-xs text-emerald-200">
                            Featured
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button type="button" variant="ghost" onClick={() => handleEditProject(project)} disabled={submitting}>
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => handleDeleteProject(project._id)}
                          disabled={submitting}
                        >
                          Delete
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {!loading && activeTab === 'blogs' ? (
            <div className="grid gap-5 xl:grid-cols-[1.1fr_1fr]">
              <form onSubmit={submitBlog} className="card-surface p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-cyan-100">{editingBlogId ? 'Edit blog' : 'Create blog'}</h2>
                <p className="mt-1 text-sm text-slate-400">Required: title and content (minimum 40 characters).</p>

                <div className="mt-4 space-y-3">
                  <label className="space-y-2 text-sm text-slate-200">
                    <span>Title</span>
                    <input
                      required
                      value={blogForm.title}
                      onChange={updateBlogField('title')}
                      className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-200">
                    <span>Excerpt</span>
                    <textarea
                      rows={2}
                      value={blogForm.excerpt}
                      onChange={updateBlogField('excerpt')}
                      className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-200">
                    <span>Content</span>
                    <textarea
                      required
                      rows={10}
                      value={blogForm.content}
                      onChange={updateBlogField('content')}
                      className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-200">
                    <span>Tags (comma separated)</span>
                    <input
                      value={blogForm.tags}
                      onChange={updateBlogField('tags')}
                      className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                      placeholder="security, backend, react"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-200">
                    <span>Image URL</span>
                    <input
                      value={blogForm.imageUrl}
                      onChange={updateBlogField('imageUrl')}
                      className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                    />
                  </label>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : editingBlogId ? 'Update blog' : 'Create blog'}
                  </Button>
                  {editingBlogId ? (
                    <Button type="button" variant="ghost" onClick={resetBlogForm} disabled={submitting}>
                      Cancel edit
                    </Button>
                  ) : null}
                </div>
              </form>

              <div className="card-surface p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-cyan-100">Published blog posts</h2>
                <p className="mt-1 text-sm text-slate-400">Manage articles shown in the public blog feed.</p>

                <div className="mt-4 space-y-3">
                  {blogs.length === 0 ? (
                    <EmptyState title="No blog posts available" message="Create your first post from the form." />
                  ) : null}

                  {blogs.map((blog) => (
                    <article key={blog._id} className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-4">
                      <h3 className="text-base font-semibold text-cyan-100">{blog.title}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">
                        {formatDate(blog.publishedAt || blog.createdAt)}
                      </p>
                      <p className="mt-2 text-sm text-slate-300 line-clamp-3">{blog.excerpt || blog.content}</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button type="button" variant="ghost" onClick={() => handleEditBlog(blog)} disabled={submitting}>
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => handleDeleteBlog(blog._id)}
                          disabled={submitting}
                        >
                          Delete
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {!loading && activeTab === 'contacts' ? (
            <div className="card-surface p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-cyan-100">Contact Inbox</h2>
                  <p className="mt-1 text-sm text-slate-400">Review incoming messages from the contact form.</p>
                </div>

                <div className="flex gap-2">
                  {['all', 'new', 'read'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleContactStatusChange(status)}
                      className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.14em] transition ${
                        contactStatus === status
                          ? 'border-cyan-300 bg-cyan-300/15 text-cyan-100'
                          : 'border-slate-600 text-slate-300 hover:border-cyan-300/50 hover:text-cyan-100'
                      }`}
                      disabled={refreshing || submitting}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {contacts.length === 0 ? (
                  <EmptyState title="No contact messages" message="Incoming messages will appear here." />
                ) : null}

                {contacts.map((message) => (
                  <article key={message._id} className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-cyan-100">{message.name}</h3>
                        <p className="mt-1 text-sm text-slate-300">{message.email}</p>
                        {message.phone ? <p className="mt-1 text-sm text-slate-300">{message.phone}</p> : null}
                        {message.service ? (
                          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-emerald-200">
                            {message.service}
                          </p>
                        ) : null}
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">
                          {formatDate(message.createdAt)}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-2 py-1 text-xs uppercase tracking-[0.12em] ${
                          message.status === 'read'
                            ? 'border-slate-500 bg-slate-500/10 text-slate-300'
                            : 'border-amber-300/40 bg-amber-300/10 text-amber-200'
                        }`}
                      >
                        {message.status}
                      </span>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap text-sm text-slate-200">{message.message}</p>

                    {message.status !== 'read' ? (
                      <div className="mt-4">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleMarkRead(message._id)}
                          disabled={submitting}
                        >
                          <MailOpen size={14} />
                          Mark as read
                        </Button>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}

export default AdminDashboardPage
