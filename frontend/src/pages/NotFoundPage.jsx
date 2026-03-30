import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Button from '@/components/ui/Button'

const NotFoundPage = () => {
  return (
    <section className="section-wrap flex min-h-[60vh] items-center justify-center pt-12 sm:pt-20">
      <Helmet>
        <title>404 | Nikhil Portfolio</title>
      </Helmet>

      <div className="card-surface max-w-xl rounded-2xl p-8 text-center">
        <p className="font-display text-xs uppercase tracking-[0.26em] text-emerald-300">404</p>
        <h1 className="mt-3 font-display text-4xl text-cyan-100">Page Not Found</h1>
        <p className="mt-3 text-slate-300">The page you requested does not exist or has been moved.</p>
        <div className="mt-6">
          <Button to="/">Back to Home</Button>
        </div>
      </div>
    </section>
  )
}

export default NotFoundPage
