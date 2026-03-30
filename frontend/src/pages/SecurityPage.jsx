import { Helmet } from 'react-helmet-async'
import SectionTitle from '@/components/ui/SectionTitle'
import FadeInUp from '@/components/animations/FadeInUp'
import { LEGAL_NOTICES, PRACTICALS } from '@/constants/siteData'

const vulnerabilities = [
  'SQL Injection and NoSQL Injection vectors',
  'Cross-Site Scripting (XSS) and output encoding issues',
  'Broken Authentication and weak session patterns',
  'Security Misconfiguration in APIs and HTTP headers',
  'Insecure Direct Object References and access control flaws',
]

const allTools = Array.from(new Set(PRACTICALS.flatMap((item) => item.tools))).sort((a, b) =>
  a.localeCompare(b),
)

const SecurityPage = () => {
  return (
    <>
      <Helmet>
        <title>Cyber Security | Nikhil Portfolio</title>
        <meta
          name="description"
          content="Cybersecurity labs, tools, vulnerabilities learned, and penetration testing practical writeups."
        />
      </Helmet>

      <section className="section-wrap pt-12 sm:pt-20">
        <SectionTitle
          eyebrow="Cyber Security"
          title="Hands-on Learning & Practical Assessments"
          description="A practical archive of labs, tools, and writeups built through ethical and authorized learning workflows."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {PRACTICALS.map((item, index) => (
            <FadeInUp key={item.slug} delay={index * 0.06} className="card-surface rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">{item.focus}</p>
                <span className="rounded-full border border-cyan-300/25 px-2 py-0.5 text-xs text-cyan-100">
                  {item.level}
                </span>
              </div>

              <h3 className="mt-2 text-lg font-semibold text-cyan-100">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-300">{item.summary}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {item.tools.map((tool) => (
                  <span
                    key={`${item.slug}-${tool}`}
                    className="rounded-md border border-cyan-300/20 bg-slate-900/70 px-2 py-1 text-xs text-slate-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>

              <p className="mt-3 text-xs uppercase tracking-[0.14em] text-slate-500">
                Status: {item.status} | Writeup: {item.writeupStatus}
              </p>
            </FadeInUp>
          ))}
        </div>
      </section>

      <section className="section-wrap pt-0">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card-surface rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-cyan-100">Tools Used</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {allTools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-md border border-cyan-300/25 bg-slate-900/80 px-2 py-1 text-xs text-cyan-100"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div className="card-surface rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-cyan-100">Vulnerabilities Learned</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {vulnerabilities.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-wrap pt-0">
        <SectionTitle
          eyebrow="Ethics"
          title="Responsible Security Practice"
          description="Security practice is done only in labs, owned systems, or explicitly authorized environments."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="card-surface rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-cyan-100">Security Testing Notice</h3>
            <p className="mt-3 text-sm text-slate-300">{LEGAL_NOTICES.securityTesting}</p>
          </article>

          <article className="card-surface rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-cyan-100">Portfolio Disclaimer</h3>
            <p className="mt-3 text-sm text-slate-300">{LEGAL_NOTICES.portfolioDisclaimer}</p>
            <p className="mt-3 text-sm text-slate-300">{LEGAL_NOTICES.practicalsEthics}</p>
          </article>
        </div>
      </section>
    </>
  )
}

export default SecurityPage
