import { Link } from 'react-router-dom'
import { Briefcase, ChartNetwork, Globe2, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { NAV_LINKS, QUICK_CONTACT, SITE_PROFILE, SOCIAL_LINKS } from '@/constants/siteData'

const socialIconMap = {
  GitHub: Globe2,
  LinkedIn: ChartNetwork,
  Medium: Sparkles,
  WhatsApp: Briefcase,
}

const Footer = () => {
  const primaryLinks = NAV_LINKS.filter((item) => !item.to.startsWith('/admin'))

  return (
    <footer className="section-divider bg-slate-950/70">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-emerald-300">Connect With Me</p>
            <h2 className="mt-2 text-3xl font-semibold text-cyan-100">{SITE_PROFILE.fullName}</h2>
            <p className="mt-3 max-w-xl text-slate-300">
              Full stack and security-focused professional portfolio. Open for internships, freelance modules, and practical collaboration.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:max-w-2xl">
              {SOCIAL_LINKS.slice(0, 4).map((item) => {
                const Icon = socialIconMap[item.label] || Sparkles

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-cyan-300/20 bg-slate-900/65 p-4 transition hover:-translate-y-1 hover:border-cyan-300/40"
                  >
                    <Icon size={20} className="text-cyan-200" />
                    <p className="mt-2 text-sm font-semibold text-cyan-100">{item.label}</p>
                  </a>
                )
              })}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold text-cyan-100">Quick Navigation</h3>
              <div className="mt-4 grid gap-2 text-sm text-slate-300">
                {primaryLinks.map((item) => (
                  <Link key={item.to} to={item.to} className="transition hover:text-cyan-100">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="inline-flex items-center gap-2 text-xl font-semibold text-cyan-100">
                <ShieldCheck size={20} className="text-cyan-200" />
                Let's Work Together
              </h3>
              <p className="mt-4 text-sm text-slate-300">
                Have a project in mind? Need a full stack or security-aware build path?
              </p>
              <a
                href={`mailto:${QUICK_CONTACT.email}`}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
              >
                <Mail size={16} />
                Let's Talk
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-cyan-300/15 pt-6 text-sm text-slate-400">
          <p>
            Copyright {new Date().getFullYear()} {SITE_PROFILE.fullName}. All rights reserved.
          </p>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
            Full Stack Developer | Cyber Security Analyst
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
