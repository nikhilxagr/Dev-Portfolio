import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, LockKeyhole } from 'lucide-react'
import Button from '@/components/ui/Button'
import { getErrorMessage } from '@/services/api'
import { clearAdminSession, getStoredAdminToken, loginAdmin, verifyAdminSession } from '@/services/auth.service'

const AdminLoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const redirectTo = useMemo(() => {
    if (location.state?.from && location.state.from !== '/admin/login') {
      return location.state.from
    }

    return '/admin'
  }, [location.state])

  useEffect(() => {
    const token = getStoredAdminToken()
    if (!token) {
      return
    }

    verifyAdminSession()
      .then(() => {
        navigate('/admin', { replace: true })
      })
      .catch(() => {
        clearAdminSession()
      })
  }, [navigate])

  const updateField = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await loginAdmin({
        email: formData.email.trim(),
        password: formData.password,
      })
      navigate(redirectTo, { replace: true })
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to sign in right now.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Admin Login | Nikhil Portfolio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="section-wrap pt-14 sm:pt-20">
        <div className="mx-auto max-w-md rounded-3xl border border-cyan-300/25 bg-slate-950/85 p-7 shadow-neon sm:p-8">
          <Link
            to="/"
            className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.17em] text-slate-400 transition hover:text-cyan-200"
          >
            <ArrowLeft size={14} />
            Back to portfolio
          </Link>

          <div className="flex items-center gap-3">
            <span className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 p-2 text-cyan-100">
              <LockKeyhole size={18} />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Admin Access</p>
              <h1 className="font-display text-xl uppercase tracking-wide text-cyan-50">Secure Sign In</h1>
            </div>
          </div>

          {location.state?.reason ? (
            <p className="mt-4 rounded-xl border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-sm text-amber-100">
              {location.state.reason}
            </p>
          ) : null}

          {error ? (
            <p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {error}
            </p>
          ) : null}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2 text-sm text-slate-200">
              <span>Email</span>
              <input
                value={formData.email}
                onChange={updateField('email')}
                type="email"
                autoComplete="username"
                required
                className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-300"
                placeholder="admin@example.com"
              />
            </label>

            <label className="block space-y-2 text-sm text-slate-200">
              <span>Password</span>
              <input
                value={formData.password}
                onChange={updateField('password')}
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-300"
                placeholder="********"
              />
            </label>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in to dashboard'}
            </Button>
          </form>
        </div>
      </section>
    </>
  )
}

export default AdminLoginPage
