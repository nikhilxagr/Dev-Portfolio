import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  Code2,
  MapPin,
  Rocket,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Button from "@/components/ui/Button";
import SectionTitle from "@/components/ui/SectionTitle";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import ProjectCard from "@/components/ui/ProjectCard";
import BlogCard from "@/components/ui/BlogCard";
import FadeInUp from "@/components/animations/FadeInUp";
import { StaggerGrid, StaggerItem } from "@/components/animations/StaggerGrid";
import { useTheme } from "@/context/ThemeContext";
import { getProjects } from "@/services/projects.service";
import { getBlogs } from "@/services/blogs.service";
import { getErrorMessage } from "@/services/api";
import { mergeStaticAndApiContent } from "@/services/contentMerge";
import {
  ABOUT_STORY,
  BLOG_LINKS,
  FOCUS_AREAS,
  HERO_CONTENT,
  MAIN_SKILL_SHOWCASE,
  PRACTICALS,
  QUICK_CONTACT,
  SERVICE_OFFERINGS,
  SIGNATURE_PROJECTS,
  SITE_PROFILE,
  STATS_METRICS,
} from "@/constants/siteData";

const highlights = [
  {
    title: "Full Stack Engineering",
    description:
      "Frontend to backend delivery with production-focused architecture and clean integration flow.",
    icon: Code2,
  },
  {
    title: "Cybersecurity Mindset",
    description:
      "Practical security awareness from lab learning to secure implementation patterns in builds.",
    icon: ShieldCheck,
  },
  {
    title: "AI Curiosity",
    description:
      "I explore AI-assisted workflows that improve developer productivity and practical problem-solving.",
    icon: Sparkles,
  },
];

const homeSkillIconMap = {
  "SOC Analyst with AI": ShieldCheck,
  "Web Development": Code2,
  "Coding Languages and Frameworks": Sparkles,
};

const homeSkillVisualMap = {
  "SOC Analyst with AI": {
    cardClass:
      "border-cyan-300/30 bg-gradient-to-br from-slate-900/88 via-slate-900/80 to-cyan-950/55",
    orbClass: "bg-cyan-300/20",
    iconWrapClass: "border-cyan-300/45 bg-cyan-300/15",
    iconColorClass: "text-cyan-100",
    titleClass: "text-cyan-200",
    tagClass:
      "border-cyan-300/35 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/20",
  },
  "Web Development": {
    cardClass:
      "border-violet-300/35 bg-gradient-to-br from-slate-900/88 via-slate-900/80 to-violet-950/55",
    orbClass: "bg-violet-300/22",
    iconWrapClass: "border-violet-300/45 bg-violet-300/15",
    iconColorClass: "text-violet-100",
    titleClass: "text-violet-200",
    tagClass:
      "border-violet-300/40 bg-violet-300/10 text-violet-100 hover:bg-violet-300/20",
  },
  "Coding Languages and Frameworks": {
    cardClass:
      "border-emerald-300/30 bg-gradient-to-br from-slate-900/88 via-slate-900/80 to-emerald-950/55",
    orbClass: "bg-emerald-300/22",
    iconWrapClass: "border-emerald-300/45 bg-emerald-300/15",
    iconColorClass: "text-emerald-100",
    titleClass: "text-emerald-200",
    tagClass:
      "border-emerald-300/40 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/20",
  },
};

const defaultHomeSkillVisual = {
  cardClass:
    "border-cyan-300/25 bg-gradient-to-br from-slate-900/88 via-slate-900/82 to-cyan-950/45",
  orbClass: "bg-cyan-300/20",
  iconWrapClass: "border-cyan-300/40 bg-cyan-300/12",
  iconColorClass: "text-cyan-100",
  titleClass: "text-cyan-200",
  tagClass:
    "border-cyan-300/30 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/20",
};

const homePremiumShellClass =
  "relative overflow-hidden rounded-[2rem] border border-cyan-300/25 bg-gradient-to-br from-slate-950/86 via-[#081726]/90 to-slate-900/86 p-6 sm:p-8";
const homePanelBaseClass =
  "rounded-2xl border border-cyan-300/25 bg-slate-950/45";
const homePanelItemBaseClass =
  "rounded-xl border border-cyan-300/20 bg-slate-900/72";
const homePrimaryGradientButtonClass =
  "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 text-white hover:from-violet-400 hover:via-fuchsia-400 hover:to-cyan-400";
const homeGhostOutlineButtonClass =
  "border-cyan-300/45 text-cyan-100 hover:bg-cyan-300/10";

const sortBlogsByDate = (blogs = []) =>
  [...blogs].sort((a, b) => {
    const timeA = new Date(a.publishedAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.publishedAt || b.createdAt || 0).getTime();
    return timeB - timeA;
  });

const staticLatestBlogs = sortBlogsByDate(BLOG_LINKS).slice(0, 2);
const aboutStoryPreview = ABOUT_STORY.slice(1, 3);
const aboutFocusPreview = FOCUS_AREAS.slice(0, 4);

const HomePage = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectError, setProjectError] = useState("");
  const [latestBlogs, setLatestBlogs] = useState(staticLatestBlogs);
  const [loadingLatestBlog, setLoadingLatestBlog] = useState(
    staticLatestBlogs.length === 0,
  );
  const [latestBlogError, setLatestBlogError] = useState("");
  const { isDark } = useTheme();

  const githubUsername =
    QUICK_CONTACT.github.split("/").filter(Boolean).pop() || "nikhilxagr";
  const leetcodeUsername =
    QUICK_CONTACT.leetcode.split("/").filter(Boolean).pop() || "nikhilxagr";
  const gfgUsername =
    QUICK_CONTACT.gfg.match(/profile\/([^/?]+)/i)?.[1] || "nikhilxagr";
  const tryHackMeUsername =
    QUICK_CONTACT.tryhackme.split("/").filter(Boolean).pop() || "nikhilxagr";
  const tryHackMeMetric = STATS_METRICS.find((item) => item.id === "tryhackme");

  const githubStreakCardUrl = `https://streak-stats.demolab.com/?user=${githubUsername}&theme=${
    isDark ? "algolia" : "default"
  }&hide_border=true`;
  const leetcodeCardUrl = `https://leetcard.jacoblin.cool/${leetcodeUsername}?theme=${
    isDark ? "dark" : "light"
  }&ext=heatmap`;
  const gfgCardUrl = `https://gfgstatscard.vercel.app/${gfgUsername}?theme=${isDark ? "dark" : "light"}`;
  const tryHackMeCardUrl = `https://tryhackme-badges.s3.amazonaws.com/${tryHackMeUsername}.png`;

  useEffect(() => {
    const loadFeatured = async () => {
      setLoadingProjects(true);
      try {
        const response = await getProjects({ featured: true, limit: 3 });
        setFeaturedProjects(response.data || []);
      } catch (error) {
        setProjectError(
          getErrorMessage(error, "Unable to load featured projects now."),
        );
      } finally {
        setLoadingProjects(false);
      }
    };

    const loadLatestBlog = async () => {
      setLoadingLatestBlog(staticLatestBlogs.length === 0);
      setLatestBlogError("");

      try {
        const response = await getBlogs({ limit: 2 });
        const apiBlogs = response.data || [];

        const mergedMap = new Map();

        BLOG_LINKS.forEach((staticBlog) => {
          mergedMap.set(staticBlog.slug, staticBlog);
        });

        apiBlogs.forEach((apiBlog) => {
          const staticBlog = BLOG_LINKS.find(
            (item) => item.slug === apiBlog.slug,
          );
          const merged = mergeStaticAndApiContent(staticBlog, apiBlog);
          mergedMap.set(merged.slug || apiBlog.slug || apiBlog._id, merged);
        });

        const combined = Array.from(mergedMap.values());
        setLatestBlogs(sortBlogsByDate(combined).slice(0, 2));
      } catch (error) {
        const fallbackLatest = staticLatestBlogs;
        setLatestBlogs(fallbackLatest);
        if (fallbackLatest.length === 0) {
          setLatestBlogError(
            getErrorMessage(error, "Unable to load latest blog right now."),
          );
        }
      } finally {
        setLoadingLatestBlog(false);
      }
    };

    loadFeatured().catch(() => undefined);
    loadLatestBlog().catch(() => undefined);
  }, []);

  const mergedFeaturedProjects =
    featuredProjects.length > 0
      ? featuredProjects.map((project) => {
          const staticProject = SIGNATURE_PROJECTS.find(
            (item) => item.slug === project.slug,
          );
          return mergeStaticAndApiContent(staticProject, project);
        })
      : SIGNATURE_PROJECTS.filter((item) => item.featured);

  const liveDemoCount = mergedFeaturedProjects.filter((project) =>
    Boolean(project.liveDemoUrl),
  ).length;

  const fallbackProjectImage = "/images/placeholders/content-placeholder.svg";

  const handleProjectPreviewError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackProjectImage;
  };

  return (
    <>
      <Helmet>
        <title>{SITE_PROFILE.title}</title>
        <meta name="description" content={HERO_CONTENT.description} />
      </Helmet>

      <section className="section-wrap pt-12 sm:pt-20">
        <FadeInUp className="card-surface overflow-hidden rounded-3xl p-6 sm:p-8">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="order-2 text-center sm:text-left lg:order-1">
              <p className="font-display text-xs uppercase tracking-[0.3em] text-emerald-300">
                Welcome to my portfolio
              </p>
              <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-cyan-100 text-glow sm:text-5xl lg:text-7xl">
                {SITE_PROFILE.fullName}
              </h1>
              <p className="mt-4 text-sm uppercase tracking-[0.18em] text-slate-400">
                {SITE_PROFILE.headline}
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2 text-sm sm:justify-start">
                <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-cyan-100">
                  WEB PENETRATION TESTER
                </span>
                <span className="rounded-full border border-violet-300/30 bg-violet-300/10 px-3 py-1 text-violet-200">
                  SOC Analyst with AI
                </span>
                <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-amber-200">
                  Ethical Hacker
                </span>
                <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-emerald-200">
                  Full Stack Developer
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-300 sm:justify-start">
                <span className="inline-flex items-center gap-2">
                  <MapPin size={15} className="text-cyan-200" />
                  {SITE_PROFILE.location}
                </span>
                <span className="rounded-full border border-emerald-300/35 bg-emerald-300/10 px-3 py-1 text-emerald-100">
                  Open for Internships and Freelance
                </span>
              </div>

              <p className="mx-auto mt-6 max-w-3xl text-slate-300 sm:mx-0">
                {HERO_CONTENT.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                <Button to={HERO_CONTENT.primaryCta.to}>
                  {HERO_CONTENT.primaryCta.label} <ArrowRight size={16} />
                </Button>
                <Button to={HERO_CONTENT.secondaryCta.to} variant="ghost">
                  {HERO_CONTENT.secondaryCta.label}
                </Button>
                <Button
                  href={QUICK_CONTACT.resume}
                  target="_blank"
                  rel="noreferrer"
                  variant="secondary"
                >
                  Resume
                </Button>
              </div>
            </div>

            <div className="order-1 mx-auto w-full max-w-sm lg:order-2">
              {SITE_PROFILE.profileImage ? (
                <div className="relative">
                  <div className="absolute inset-2 rounded-full bg-cyan-300/15 blur-3xl" />
                  <div className="relative h-[240px] w-[240px] overflow-hidden rounded-full border-4 border-cyan-300/45 bg-[#e0b93c] shadow-[0_0_0_6px_rgba(34,211,238,0.12)] sm:h-[300px] sm:w-[300px] lg:h-[360px] lg:w-[360px]">
                    <img
                      src={SITE_PROFILE.profileImage}
                      alt={SITE_PROFILE.profileImageAlt}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>

                  <span className="absolute bottom-3 right-3 rounded-full border border-emerald-300/50 bg-emerald-300/20 px-3 py-1 text-xs font-semibold text-emerald-100 sm:bottom-4 sm:right-4">
                    Available
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </FadeInUp>

        <div className="mt-12 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
              Public Learning Progress
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-cyan-100 sm:text-3xl">
              Consistent Improvement, Visible Metrics
            </h2>
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
              <p className="font-display text-3xl font-bold text-cyan-100">
                {item.value}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-200">
                {item.label}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-slate-500">
                {item.detail}
              </p>
            </a>
          ))}
        </div>

        <FadeInUp className="mt-12 card-surface rounded-3xl p-6 sm:p-8">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-cyan-100 sm:text-4xl">
              Coding Consistency Showcase
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Live cards from your public profiles
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <article className="group rounded-2xl border border-cyan-300/20 bg-slate-900/55 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-2xl font-semibold text-cyan-100">
                  GitHub Streak
                </h3>
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
                <h3 className="text-2xl font-semibold text-cyan-100">
                  LeetCode Stats
                </h3>
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
                <h3 className="text-2xl font-semibold text-cyan-100">
                  GFG Stats
                </h3>
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
                <h3 className="text-2xl font-semibold text-cyan-100">
                  TryHackMe Proof
                </h3>
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
                {tryHackMeMetric?.value || "Top 1%"} on TryHackMe
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
            const Icon = item.icon;
            return (
              <FadeInUp
                key={item.title}
                delay={index * 0.08}
                className="card-surface rounded-2xl p-5"
              >
                <Icon className="text-cyan-200" size={22} />
                <h2 className="mt-3 text-lg font-semibold text-cyan-100">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  {item.description}
                </p>
              </FadeInUp>
            );
          })}
        </div>
      </section>

      <section className="section-wrap section-divider pt-10">
        <FadeInUp className={homePremiumShellClass}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(34,211,238,0.14),transparent_36%),radial-gradient(circle_at_86%_82%,rgba(16,185,129,0.1),transparent_40%)]" />

          <SectionTitle
            className="relative"
            eyebrow="About Me"
            title="A Quick Personal Snapshot"
            description="A short look at my mindset, direction, and what drives my work as a developer and cybersecurity learner."
          />

          <div className="relative mt-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <article className={`${homePanelBaseClass} p-6 sm:p-7`}>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                Who I Am
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-cyan-100 sm:text-3xl">
                Building Products, Learning Security, Growing with Discipline
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-300">
                {SITE_PROFILE.shortIntro}
              </p>

              <div className="mt-5 space-y-3">
                {aboutStoryPreview.map((line) => (
                  <p
                    key={line}
                    className={`${homePanelItemBaseClass} p-3 text-sm leading-7 text-slate-300`}
                  >
                    {line}
                  </p>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button to="/about" className={homePrimaryGradientButtonClass}>
                  Learn About Me Deeply <ArrowRight size={16} />
                </Button>
                <Button
                  to="/contact"
                  variant="ghost"
                  className={homeGhostOutlineButtonClass}
                >
                  Connect With Me
                </Button>
              </div>
            </article>

            <article className={`${homePanelBaseClass} p-6`}>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                Personal Focus
              </p>
              <h3 className="mt-2 text-xl font-semibold text-cyan-100">
                What I Am Improving Right Now
              </h3>

              <div className="mt-4 space-y-3">
                {aboutFocusPreview.map((item) => (
                  <article
                    key={item}
                    className={`${homePanelItemBaseClass} p-3`}
                  >
                    <p className="text-sm text-slate-300">{item}</p>
                  </article>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-emerald-100">
                  Current Goal
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-200">
                  Become an engineer who can build clean, modern products and
                  secure them with practical, real-world thinking.
                </p>
              </div>
            </article>
          </div>
        </FadeInUp>
      </section>

      <section className="section-wrap section-divider pt-10">
        <FadeInUp className={homePremiumShellClass}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_24%,rgba(16,185,129,0.12),transparent_38%),radial-gradient(circle_at_82%_78%,rgba(34,211,238,0.1),transparent_42%)]" />

          <div className="relative">
            <div className="text-center">
              <p className="font-display text-xs uppercase tracking-[0.28em] text-emerald-300">
                Practicals and Services
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-cyan-100 sm:text-4xl">
                Real Practice with Student-Friendly Support
              </h2>
              <p className="mx-auto mt-3 max-w-3xl text-slate-300">
                Practical security progress and service offerings presented in a
                clean format for quick recruiter review.
              </p>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              <article className={`${homePanelBaseClass} p-5`}>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                  Practicals
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-cyan-100">
                  Hands-on Cyber Lab Work
                </h3>
                <div className="mt-4 space-y-3">
                  {PRACTICALS.slice(0, 3).map((item) => (
                    <article
                      key={item.slug}
                      className={`${homePanelItemBaseClass} p-4`}
                    >
                      <p className="text-base font-semibold text-cyan-100">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                        {item.level} | {item.status}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-slate-300">
                        {item.summary}
                      </p>
                    </article>
                  ))}
                </div>
              </article>

              <article className={`${homePanelBaseClass} p-5`}>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                  Services
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-cyan-100">
                  Student-Friendly, Build-Focused
                </h3>
                <div className="mt-4 space-y-3">
                  {SERVICE_OFFERINGS.slice(0, 4).map((item) => (
                    <article
                      key={item.slug}
                      className={`${homePanelItemBaseClass} p-4`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-base font-semibold text-cyan-100">
                          {item.name}
                        </p>
                        <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2.5 py-1 text-xs font-semibold text-cyan-100">
                          {item.price}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-slate-300">
                        {item.summary}
                      </p>
                    </article>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </FadeInUp>
      </section>

      <section className="section-wrap section-divider pt-10">
        <FadeInUp className={homePremiumShellClass}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(34,211,238,0.16),transparent_36%),radial-gradient(circle_at_88%_84%,rgba(168,85,247,0.12),transparent_40%)]" />

          <div className="relative text-center">
            <p className="font-display text-xs uppercase tracking-[0.3em] text-emerald-300">
              Skills
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                My Skills
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-slate-300">
              Technologies and tools I use to build practical products, write
              better code, and grow in security-focused engineering.
            </p>
          </div>

          <StaggerGrid className="relative mt-8 grid gap-4 lg:grid-cols-3">
            {MAIN_SKILL_SHOWCASE.map((item) => {
              const Icon = homeSkillIconMap[item.title] || Sparkles;
              const visual =
                homeSkillVisualMap[item.title] || defaultHomeSkillVisual;

              return (
                <StaggerItem key={item.id} className="h-full">
                  <article
                    className={`group relative h-full overflow-hidden rounded-2xl border p-5 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.95)] transition duration-300 hover:-translate-y-1 ${visual.cardClass}`}
                  >
                    <div
                      className={`pointer-events-none absolute -top-12 -right-10 h-32 w-32 rounded-full blur-3xl ${visual.orbClass}`}
                    />

                    <div className="relative">
                      <div
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border ${visual.iconWrapClass}`}
                      >
                        <Icon className={visual.iconColorClass} size={24} />
                      </div>

                      <h3
                        className={`mt-4 min-h-[5.2rem] text-2xl font-semibold leading-tight sm:text-[2rem] ${visual.titleClass}`}
                      >
                        {item.title}
                      </h3>
                      <p className="mt-3 min-h-[6rem] text-sm leading-7 text-slate-300">
                        {item.summary}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${visual.tagClass}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </StaggerGrid>

          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button to="/skills" className={homePrimaryGradientButtonClass}>
              View All Skills and Expertise <ArrowRight size={16} />
            </Button>
            <Button
              to="/services"
              variant="ghost"
              className={homeGhostOutlineButtonClass}
            >
              Explore Services
            </Button>
          </div>
        </FadeInUp>
      </section>

      <section className="section-wrap section-divider pt-10">
        <SectionTitle
          eyebrow="Latest Blog"
          title="Fresh Perspective"
          description="Most recent writing from Medium and LinkedIn with quick access to the full blog archive."
        />

        <div className="mx-auto mt-8 grid w-full max-w-[1180px] gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-stretch">
          <FadeInUp className="h-full">
            {loadingLatestBlog && latestBlogs.length === 0 ? (
              <LoadingState
                message="Loading latest blogs..."
                cards={2}
                variant="blog"
              />
            ) : null}
            {!loadingLatestBlog &&
            latestBlogError &&
            latestBlogs.length === 0 ? (
              <EmptyState
                title="Latest blog unavailable"
                message={latestBlogError}
              />
            ) : null}
            {latestBlogs.length > 0 ? (
              <StaggerGrid className="grid gap-4 sm:grid-cols-2 sm:auto-rows-fr">
                {latestBlogs.map((blog) => (
                  <StaggerItem key={blog._id || blog.slug} className="h-full">
                    <BlogCard
                      blog={blog}
                      variant="compact"
                      className="h-full"
                    />
                  </StaggerItem>
                ))}
              </StaggerGrid>
            ) : null}
            {!loadingLatestBlog &&
            !latestBlogError &&
            latestBlogs.length === 0 ? (
              <EmptyState
                title="No blogs yet"
                message="Latest writing will appear here once published."
              />
            ) : null}
          </FadeInUp>

          <FadeInUp delay={0.08} className="h-full">
            <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-cyan-300/35 bg-gradient-to-br from-emerald-900/30 via-slate-900/85 to-cyan-900/25 p-5 shadow-[0_18px_45px_-30px_rgba(52,211,153,0.55)]">
              <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-emerald-300/10 blur-3xl" />
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">
                  Reading Feed
                </p>
                <h3 className="mt-2 text-xl font-semibold text-cyan-100">
                  Show All Blogs
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  Explore all articles with image previews, source details,
                  publish time, and topic tags.
                </p>
              </div>

              <div className="mt-5">
                <Button to="/blogs" className="w-full justify-center">
                  Show All Blogs <ArrowRight size={16} />
                </Button>
              </div>
            </article>
          </FadeInUp>
        </div>
      </section>

      <section className="section-wrap section-divider pt-10">
        <SectionTitle
          eyebrow="Featured Projects"
          title="Selected Work"
          description="A quick look at applications and security-focused builds from my portfolio."
        />

        <div className="mt-8">
          {loadingProjects ? (
            <LoadingState message="Loading featured projects..." />
          ) : null}
          {!loadingProjects &&
          projectError &&
          mergedFeaturedProjects.length === 0 ? (
            <EmptyState
              title="Could not fetch projects"
              message={projectError}
            />
          ) : null}
          {!loadingProjects && mergedFeaturedProjects.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(280px,0.95fr)]">
              {mergedFeaturedProjects.map((project) => (
                <ProjectCard
                  key={project._id || project.slug}
                  project={project}
                  variant="featured"
                />
              ))}

              <FadeInUp delay={0.24} className="h-full">
                <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-cyan-300/40 bg-gradient-to-br from-blue-600/35 via-slate-900/90 to-violet-600/35 p-6 shadow-[0_26px_60px_-30px_rgba(56,189,248,0.65)]">
                  <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-cyan-200/15 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-violet-300/20 blur-3xl" />

                  <div className="relative">
                    <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/85">
                      Explore More
                    </p>

                    <div className="mt-8 flex justify-center">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-100/35 bg-cyan-100/10 text-cyan-100 shadow-[0_12px_26px_-16px_rgba(103,232,249,0.95)]">
                        <Rocket size={30} strokeWidth={2.1} />
                      </div>
                    </div>

                    <h3 className="mt-6 text-center text-4xl font-semibold text-cyan-50">
                      View All Projects
                    </h3>
                    <p className="mx-auto mt-3 max-w-[240px] text-center text-sm text-slate-200/90">
                      Explore the full archive with filters, deep detail pages,
                      code links, and live demos.
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-cyan-100/20 bg-slate-950/45 p-3 text-center">
                        <p className="font-display text-2xl text-cyan-100">
                          {mergedFeaturedProjects.length}
                        </p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-cyan-100/70">
                          Featured
                        </p>
                      </div>
                      <div className="rounded-xl border border-cyan-100/20 bg-slate-950/45 p-3 text-center">
                        <p className="font-display text-2xl text-cyan-100">
                          {liveDemoCount}
                        </p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-cyan-100/70">
                          Live Demos
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {mergedFeaturedProjects.slice(0, 3).map((project) => (
                        <div
                          key={`${project.slug}-preview`}
                          className="overflow-hidden rounded-lg border border-cyan-100/20 bg-slate-950/55"
                        >
                          <img
                            src={project.imageUrl || fallbackProjectImage}
                            alt={`${project.title} thumbnail`}
                            className="h-14 w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                            loading="lazy"
                            onError={handleProjectPreviewError}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    to="/projects"
                    className="mt-8 w-full justify-center border border-cyan-100/45 bg-cyan-100/95 text-slate-900 hover:bg-cyan-50"
                  >
                    Show All Projects <ArrowRight size={16} />
                  </Button>
                </article>
              </FadeInUp>
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
  );
};

export default HomePage;
