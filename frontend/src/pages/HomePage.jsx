import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, Code2, MapPin, ShieldCheck, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'
import SectionTitle from '@/components/ui/SectionTitle'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import ProjectCard from '@/components/ui/ProjectCard'
import FadeInUp from '@/components/animations/FadeInUp'
import { useTheme } from '@/context/ThemeContext'
import { getProjects } from '@/services/projects.service'
import { getErrorMessage } from '@/services/api'
import {
  HERO_CONTENT,
  MAIN_SKILL_SHOWCASE,
  PRACTICALS,
  QUICK_CONTACT,
  SERVICE_OFFERINGS,
  SIGNATURE_PROJECTS,
  SITE_PROFILE,
  STATS_METRICS,
} from '@/constants/siteData'

const highlights = [
  {
    title: 'Full Stack Engineering',
    description: 'Frontend to backend delivery with production-focused architecture and clean integration flow.',
    icon: Code2,
  },
  {
    title: 'Cybersecurity Mindset',
    description: 'Practical security awareness from lab learning to secure implementation patterns in builds.',
    icon: ShieldCheck,
  },
  {
    title: 'AI Curiosity',
    description: 'I explore AI-assisted workflows that improve developer productivity and practical problem-solving.',
    icon: Sparkles,
  },
]

const homeSkillIconMap = {
  'SOC Analyst with AI': ShieldCheck,
  'Web Development': Code2,
  'Coding Languages and Frameworks': Sparkles,
}

const HomePage = () => {
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [projectError, setProjectError] = useState('')
  const { isDark } = useTheme()

  const githubUsername = QUICK_CONTACT.github.split('/').filter(Boolean).pop() || 'nikhilxagr'
  const leetcodeUsername = QUICK_CONTACT.leetcode.split('/').filter(Boolean).pop() || 'nikhilxagr'
  const gfgUsername = QUICK_CONTACT.gfg.match(/profile\/([^/?]+)/i)?.[1] || 'nikhilxagr'
  const tryHackMeUsername = QUICK_CONTACT.tryhackme.split('/').filter(Boolean).pop() || 'nikhilxagr'
  const tryHackMeMetric = STATS_METRICS.find((item) => item.id === 'tryhackme')

  const githubStreakCardUrl = `https://streak-stats.demolab.com/?user=${githubUsername}&theme=${
    isDark ? 'algolia' : 'default'
  }&hide_border=true`
  const leetcodeCardUrl = `https://leetcard.jacoblin.cool/${leetcodeUsername}?theme=${
    isDark ? 'dark' : 'light'
  }&ext=heatmap`
  const gfgCardUrl = `https://gfgstatscard.vercel.app/${gfgUsername}?theme=${isDark ? 'dark' : 'light'}`
  const tryHackMeCardUrl = `https://tryhackme-badges.s3.amazonaws.com/${tryHackMeUsername}.png`

  useEffect(() => {
    const loadFeatured = async () => {
      setLoadingProjects(true)
      try {
        const response = await getProjects({ featured: true, limit: 3 })
        setFeaturedProjects(response.data || [])
      } catch (error) {
        setProjectError(getErrorMessage(error, 'Unable to load featured projects now.'))
      } finally {
        setLoadingProjects(false)
      }
    }

    loadFeatured().catch(() => undefined)
  }, [])

  const mergedFeaturedProjects =
    featuredProjects.length > 0
      ? featuredProjects.map((project) => {
          const staticProject = SIGNATURE_PROJECTS.find((item) => item.slug === project.slug)
          return {
            ...staticProject,
            ...project,
          }
        })
      : SIGNATURE_PROJECTS.filter((item) => item.featured)

  return (
    <>
      <Helmet>
        <title>{SITE_PROFILE.title}</title>
        <meta name="description" content={HERO_CONTENT.description} />
      </Helmet>

      <section className="section-wrap pt-12 sm:pt-20">
        <FadeInUp className="card-surface overflow-hidden rounded-3xl p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="font-display text-xs uppercase tracking-[0.3em] text-emerald-300">Welcome to my portfolio</p>
              <h1 className="mt-3 font-display text-5xl font-bold leading-tight text-cyan-100 text-glow sm:text-6xl lg:text-7xl">
                {SITE_PROFILE.fullName}
              </h1>
              <p className="mt-4 text-sm uppercase tracking-[0.18em] text-slate-400">{SITE_PROFILE.headline}</p>

              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-cyan-100">WEB PENETRATION TESTER</span>
                <span className="rounded-full border border-violet-300/30 bg-violet-300/10 px-3 py-1 text-violet-200">SOC Analyst with AI</span>
                <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-amber-200">Ethical Hacker</span>
                <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-emerald-200">Full Stack Developer</span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <MapPin size={15} className="text-cyan-200" />
                  {SITE_PROFILE.location}
                </span>
                <span className="rounded-full border border-emerald-300/35 bg-emerald-300/10 px-3 py-1 text-emerald-100">
                  Open for Internships and Freelance
                </span>
              </div>

              <p className="mt-6 max-w-3xl text-slate-300">{HERO_CONTENT.description}</p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button to={HERO_CONTENT.primaryCta.to}>
                  {HERO_CONTENT.primaryCta.label} <ArrowRight size={16} />
                </Button>
                <Button to={HERO_CONTENT.secondaryCta.to} variant="ghost">
                  {HERO_CONTENT.secondaryCta.label}
                </Button>
                <Button href={QUICK_CONTACT.resume} target="_blank" rel="noreferrer" variant="secondary">
                  Resume
                </Button>
              </div>
            </div>

            <div className="mx-auto w-full max-w-sm">
              {SITE_PROFILE.profileImage ? (
                <div className="relative">
                  <div className="absolute inset-2 rounded-full bg-cyan-300/15 blur-3xl" />
                  <div className="relative h-[320px] w-[320px] overflow-hidden rounded-full border-4 border-cyan-300/45 bg-[#e0b93c] shadow-[0_0_0_6px_rgba(34,211,238,0.12)] sm:h-[360px] sm:w-[360px]">
                    <img
                      src={SITE_PROFILE.profileImage}
                      alt={SITE_PROFILE.profileImageAlt}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>

                  <span className="absolute bottom-4 right-4 rounded-full border border-emerald-300/50 bg-emerald-300/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                    Available
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </FadeInUp>

        <div className="mt-12 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Public Learning Progress</p>
            <h2 className="mt-2 text-2xl font-semibold text-cyan-100 sm:text-3xl">Consistent Improvement, Visible Metrics</h2>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS_METRICS.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="card-surface rounded-2xl p-5 transition hover:-translate-y-1"
            >
              <p className="font-display text-3xl font-bold text-cyan-100">{item.value}</p>
              <p className="mt-2 text-sm font-medium text-slate-200">{item.label}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-slate-500">{item.detail}</p>
            </a>
          ))}
        </div>

        <FadeInUp className="mt-12 card-surface rounded-3xl p-6 sm:p-8">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-cyan-100 sm:text-4xl">Coding Consistency Showcase</h2>
            <p className="mt-2 text-sm text-slate-300">Live cards from your public profiles</p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <article className="group rounded-2xl border border-cyan-300/20 bg-slate-900/55 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-2xl font-semibold text-cyan-100">GitHub Streak</h3>
                <a
                  href={QUICK_CONTACT.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
                >
                  Open ↗
                </a>
              </div>

              <div className="overflow-hidden rounded-xl border border-cyan-300/20 bg-slate-950/80 p-2">
                <img
                  src={githubStreakCardUrl}
                  alt={`GitHub streak stats for ${githubUsername}`}
                  className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </article>

            <article className="group rounded-2xl border border-cyan-300/20 bg-slate-900/55 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-2xl font-semibold text-cyan-100">LeetCode Stats</h3>
                <a
                  href={QUICK_CONTACT.leetcode}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
                >
                  Open ↗
                </a>
              </div>

              <div className="overflow-hidden rounded-xl border border-cyan-300/20 bg-slate-950/80 p-2">
                <img
                  src={leetcodeCardUrl}
                  alt={`LeetCode stats for ${leetcodeUsername}`}
                  className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </article>

            <article className="group rounded-2xl border border-cyan-300/20 bg-slate-900/55 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-2xl font-semibold text-cyan-100">GFG Stats</h3>
                <a
                  href={QUICK_CONTACT.gfg}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
                >
                  Open ↗
                </a>
              </div>

              <div className="overflow-hidden rounded-xl border border-cyan-300/20 bg-slate-950/80 p-2">
                <img
                  src={gfgCardUrl}
                  alt={`GeeksforGeeks stats for ${gfgUsername}`}
                  className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </article>

            <article className="group rounded-2xl border border-cyan-300/20 bg-slate-900/55 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-2xl font-semibold text-cyan-100">TryHackMe Proof</h3>
                <a
                  href={QUICK_CONTACT.tryhackme}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
                >
                  Open ↗
                </a>
              </div>

              <div className="mb-3 inline-flex rounded-full border border-emerald-300/40 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                {tryHackMeMetric?.value || 'Top 1%'} on TryHackMe
              </div>

              <div className="overflow-hidden rounded-xl border border-cyan-300/20 bg-slate-950/80 p-2">
                <img
                  src={tryHackMeCardUrl}
                  alt={`TryHackMe badge for ${tryHackMeUsername}`}
                  className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </article>
          </div>
        </FadeInUp>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {highlights.map((item, index) => {
            const Icon = item.icon
            return (
              <FadeInUp key={item.title} delay={index * 0.08} className="card-surface rounded-2xl p-5">
                <Icon className="text-cyan-200" size={22} />
                <h2 className="mt-3 text-lg font-semibold text-cyan-100">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-300">{item.description}</p>
              </FadeInUp>
            )
          })}
        </div>
      </section>

      <section className="section-wrap section-divider pt-10">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card-surface rounded-2xl p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Practicals</p>
            <h2 className="mt-2 text-2xl font-semibold text-cyan-100">Hands-on Cyber Lab Work</h2>
            <div className="mt-4 space-y-3">
              {PRACTICALS.slice(0, 3).map((item) => (
                <article key={item.slug} className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-3">
                  <p className="text-sm font-semibold text-cyan-100">{item.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                    {item.level} | {item.status}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{item.summary}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="card-surface rounded-2xl p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Services</p>
            <h2 className="mt-2 text-2xl font-semibold text-cyan-100">Student-Friendly, Build-Focused</h2>
            <div className="mt-4 space-y-3">
              {SERVICE_OFFERINGS.slice(0, 4).map((item) => (
                <article key={item.slug} className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-cyan-100">{item.name}</p>
                    <span className="rounded-full border border-cyan-300/25 px-2 py-0.5 text-xs text-cyan-200">
                      {item.price}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{item.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap section-divider pt-10">
        <SectionTitle
          eyebrow="Skills"
          title="Core Competencies"
          description="Showcasing core identity skills across SOC analysis with AI, web development, and coding frameworks."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {MAIN_SKILL_SHOWCASE.map((item, index) => {
            const Icon = homeSkillIconMap[item.title] || Sparkles

            return (
              <FadeInUp key={item.id} delay={index * 0.07} className="card-surface rounded-2xl p-5">
                <Icon className="text-cyan-200" size={22} />
                <h3 className="mt-3 text-xl font-semibold text-cyan-100">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-md border border-cyan-300/25 bg-slate-900/70 px-2 py-1 text-xs text-cyan-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </FadeInUp>
            )
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button to="/skills">
            View All Skills and Expertise <ArrowRight size={16} />
          </Button>
          <Button to="/services" variant="ghost">
            Explore Services
          </Button>
        </div>
      </section>

      <section className="section-wrap section-divider pt-10">
        <SectionTitle
          eyebrow="Featured Projects"
          title="Selected Work"
          description="A quick look at applications and security-focused builds from my portfolio."
        />

        <div className="mt-8">
          {loadingProjects ? <LoadingState message="Loading featured projects..." /> : null}
          {!loadingProjects && projectError && mergedFeaturedProjects.length === 0 ? (
            <EmptyState title="Could not fetch projects" message={projectError} />
          ) : null}
          {!loadingProjects && mergedFeaturedProjects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mergedFeaturedProjects.map((project) => (
                <ProjectCard key={project._id || project.slug} project={project} />
              ))}
            </div>
          ) : null}
          {!loadingProjects && mergedFeaturedProjects.length === 0 ? (
            <EmptyState
              title="No featured projects yet"
              message="Featured work will appear here as soon as projects are marked as featured."
            />
          ) : null}
        </div>
      </section>
    </>
  )
}

export default HomePage
