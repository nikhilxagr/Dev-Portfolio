import { Helmet } from 'react-helmet-async'
import { ArrowRight, ShieldCheck, Layers, TimerReset } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'
import Button from '@/components/ui/Button'
import { QUICK_CONTACT, SERVICE_OFFERINGS } from '@/constants/siteData'

const categoryStyle = {
  Guidance: 'border-emerald-300/45 bg-emerald-300/10 text-emerald-200',
  'Career Support': 'border-cyan-300/45 bg-cyan-300/10 text-cyan-200',
  'Build and Delivery': 'border-violet-300/45 bg-violet-300/10 text-violet-200',
  'Cyber Security': 'border-amber-300/45 bg-amber-300/10 text-amber-200',
}

const serviceHighlights = [
  {
    title: 'Execution-First Delivery',
    summary: 'Clean scope definition, milestone updates, and practical implementation quality.',
    icon: Layers,
  },
  {
    title: 'Security-Aware Thinking',
    summary: 'Build decisions are made with reliability, validation, and defensive patterns in mind.',
    icon: ShieldCheck,
  },
  {
    title: 'Fast Communication Loop',
    summary: 'Quick responses and transparent progress updates to keep your timeline moving.',
    icon: TimerReset,
  },
]

const ServicesPage = () => {
  return (
    <>
      <Helmet>
        <title>Services | Nikhil Portfolio</title>
        <meta
          name="description"
          content="All services by Nikhil Agrahari including mentorship, resume review, full stack development, and authorized security review."
        />
      </Helmet>

      <section className="section-wrap pt-12 sm:pt-20">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <SectionTitle
            eyebrow="Verified Services"
            title="Build and Security Services in One Place"
            description="Transparent pricing ranges, focused outcomes, and practical execution support for students, creators, and small teams."
          />

          <aside className="card-surface rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">Quick Service Snapshot</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-cyan-300/25 bg-slate-900/70 p-3">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Services Available</p>
                <p className="mt-1 font-display text-2xl text-cyan-100">{SERVICE_OFFERINGS.length}</p>
              </div>
              <div className="rounded-xl border border-cyan-300/25 bg-slate-900/70 p-3">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Response Time</p>
                <p className="mt-1 font-display text-2xl text-cyan-100">&lt; 24h</p>
              </div>
              <div className="rounded-xl border border-cyan-300/25 bg-slate-900/70 p-3">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Primary Focus</p>
                <p className="mt-1 text-lg font-semibold text-cyan-100">Full Stack</p>
              </div>
              <div className="rounded-xl border border-cyan-300/25 bg-slate-900/70 p-3">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Security Scope</p>
                <p className="mt-1 text-lg font-semibold text-cyan-100">Authorized Only</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-300">
              Book through contact form or direct message. For security review, explicit ownership or written authorization is required.
            </p>
          </aside>
        </div>
      </section>

      <section className="section-wrap section-divider pt-10">
        <div className="grid gap-4 md:grid-cols-3">
          {serviceHighlights.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.title} className="card-surface rounded-2xl p-5">
                <Icon size={20} className="text-cyan-200" />
                <h2 className="mt-3 text-lg font-semibold text-cyan-100">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-300">{item.summary}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="section-wrap section-divider pt-10">
        <SectionTitle
          eyebrow="Service Catalog"
          title="All Services"
          description="Everything listed in one place for easy comparison by category, pricing, and turnaround expectation."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {SERVICE_OFFERINGS.map((service) => (
            <article key={service.slug} className="card-surface rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-2xl font-semibold text-cyan-100">{service.name}</h3>
                <span className={`rounded-full border px-3 py-1 text-xs ${categoryStyle[service.category] || 'border-cyan-300/45 bg-cyan-300/10 text-cyan-200'}`}>
                  {service.category}
                </span>
              </div>

              <p className="mt-3 font-display text-3xl text-cyan-100">{service.price}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-slate-500">Timeline: {service.turnaround}</p>

              <div className="mt-4 rounded-xl border border-emerald-300/30 bg-emerald-300/10 p-3 text-sm text-emerald-100">
                {service.summary}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-md border border-cyan-300/25 bg-slate-900/70 px-2 py-1 text-xs text-slate-300">Detailed scope via discussion</span>
                <span className="rounded-md border border-cyan-300/25 bg-slate-900/70 px-2 py-1 text-xs text-slate-300">Transparent delivery updates</span>
                <span className="rounded-md border border-cyan-300/25 bg-slate-900/70 px-2 py-1 text-xs text-slate-300">Student-friendly collaboration</span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button to="/contact" className="flex-1 min-w-[160px]">
                  Book This Service <ArrowRight size={16} />
                </Button>
                <Button href={QUICK_CONTACT.whatsapp} target="_blank" rel="noreferrer" variant="ghost" className="flex-1 min-w-[160px]">
                  WhatsApp Discussion
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default ServicesPage
