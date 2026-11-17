import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const MotionDiv = motion.div;
const MotionHeader = motion.header;
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Download,
  ExternalLink,
  Layers,
  Lightbulb,
  Target,
  User,
  Users,
  Wrench,
} from "lucide-react";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import SeoHead from "@/components/seo/SeoHead";
import SkillLogoBadge from "@/components/ui/SkillLogoBadge";
import { getProjectBySlug } from "@/services/projects.service";
import { getErrorMessage } from "@/services/api";
import { mergeStaticAndApiContent } from "@/services/contentMerge";
import { createBreadcrumbSchema, createProjectSchema } from "@/utils/seo";
import { SIGNATURE_PROJECTS } from "@/data/projectsData";

const GitHubMark = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12 0.5C5.65 0.5 0.5 5.65 0.5 12C0.5 17.08 3.79 21.39 8.35 22.91C8.93 23.01 9.14 22.66 9.14 22.35C9.14 22.08 9.13 21.36 9.12 20.41C5.9 21.1 5.22 18.86 5.22 18.86C4.69 17.49 3.93 17.13 3.93 17.13C2.87 16.42 4.01 16.44 4.01 16.44C5.18 16.52 5.8 17.66 5.8 17.66C6.84 19.4 8.53 18.89 9.2 18.59C9.3 17.84 9.6 17.33 9.94 17.03C7.37 16.75 4.67 15.77 4.67 11.38C4.67 10.13 5.13 9.11 5.9 8.31C5.78 8.02 5.37 6.84 6.01 5.25C6.01 5.25 6.99 4.94 9.13 6.34C10.07 6.08 11.08 5.95 12.09 5.94C13.1 5.95 14.11 6.08 15.05 6.34C17.19 4.94 18.17 5.25 18.17 5.25C18.81 6.84 18.4 8.02 18.28 8.31C19.05 9.11 19.51 10.13 19.51 11.38C19.51 15.78 16.8 16.74 14.22 17.02C14.66 17.39 15.06 18.11 15.06 19.2C15.06 20.76 15.04 22.01 15.04 22.35C15.04 22.66 15.25 23.01 15.84 22.91C20.41 21.39 23.69 17.08 23.69 12C23.69 5.65 18.54 0.5 12.19 0.5H12Z" />
  </svg>
);

const cleanHighlightItem = (item) => {
  const raw = typeof item === "string" ? item : String(item || "");
  const stripped = raw
    .replace(/^✓✓\s*/u, "")
    .replace(/^(\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*)\s*/gu, "")
    .trim();

  const colonIndex = stripped.indexOf(":");
  if (colonIndex !== -1 && colonIndex < 52) {
    return {
      title: stripped.slice(0, colonIndex).trim(),
      body: stripped.slice(colonIndex + 1).trim(),
    };
  }
  return { title: "", body: stripped };
};

const stripLeadingEmoji = (value = "") =>
  String(value)
    .replace(/[\p{Extended_Pictographic}\uFE0F]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

const fadeSlide = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1], delay },
});

const REDUNDANT_TAGS = new Set([
  "solo project",
  "collab project",
  "collaboration project",
  "hackathon project",
]);

const ProjectDetailsPage = () => {
  const { slug } = useParams();
  const staticProject = useMemo(
    () => SIGNATURE_PROJECTS.find((item) => item.slug === slug) || null,
    [slug],
  );
  const [project, setProject] = useState(staticProject);
  const [loading, setLoading] = useState(!staticProject);
  const [error, setError] = useState("");
  const fallbackImage = "/images/placeholders/content-placeholder.svg";

  const { prevProject, nextProject } = useMemo(() => {
    const idx = SIGNATURE_PROJECTS.findIndex((item) => item.slug === (project?.slug || slug));
    if (idx === -1) return { prevProject: null, nextProject: null };
    return {
      prevProject: idx > 0 ? SIGNATURE_PROJECTS[idx - 1] : null,
      nextProject: idx < SIGNATURE_PROJECTS.length - 1 ? SIGNATURE_PROJECTS[idx + 1] : null,
    };
  }, [project?.slug, slug]);

  const isCollab = useMemo(() => {
    if (!project) return false;
    if (project.projectType === "Collaboration" || project.projectType === "Collab") return true;
    if (project.projectType === "Solo") return false;
    const s = (project.slug || slug || "").toLowerCase().trim();
    if (["kanoon-mate", "smart-lms", "smart-lms-saas-platform", "smartmess"].includes(s)) return true;
    const title = (project.title || "").toLowerCase().trim();
    return (
      title.includes("kanoon-mate") ||
      title.includes("kanoon mate") ||
      title.includes("smart lms") ||
      title.includes("smartmess") ||
      title.includes("smart mess")
    );
  }, [project, slug]);

  const displayTags = useMemo(() => {
    const sourceTags = project?.tags?.length ? project.tags : project?.techStack || [];
    const seen = new Set();
    return sourceTags.filter((tag) => {
      const normalized = String(tag || "").trim().toLowerCase();
      if (!normalized || REDUNDANT_TAGS.has(normalized) || seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
  }, [project]);

  const previewImage = project?.imageUrl || fallbackImage;
  const localWebpImage =
    previewImage.startsWith("/images/") && previewImage.endsWith(".png")
      ? previewImage.replace(/\.png$/i, ".webp")
      : "";

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackImage;
  };

  const loadProject = useCallback(
    async (withSkeleton = false) => {
      if (withSkeleton) {
        setLoading(true);
      }

      setError("");

      try {
        const response = await getProjectBySlug(slug);
        const mergedProject = response.data
          ? mergeStaticAndApiContent(staticProject, response.data)
          : staticProject || null;
        setProject(mergedProject);
      } catch (requestError) {
        if (staticProject) {
          setProject(staticProject);
        } else {
          setError(
            getErrorMessage(
              requestError,
              "Unable to load this project right now.",
            ),
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [slug, staticProject],
  );

  useEffect(() => {
    setProject(staticProject);
    setError("");
    setLoading(!staticProject);
    loadProject(false).catch(() => undefined);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [loadProject, staticProject]);

  const canonicalPath = `/projects/${project?.slug || slug || ""}`;
  const projectSchema = project
    ? createProjectSchema(project, canonicalPath)
    : null;

  const cleanStatus = project?.status ? stripLeadingEmoji(project.status) : "";

  return (
    <section className="section-wrap pt-6 sm:pt-8 pb-24">
      <div className="mx-auto max-w-5xl">
        {loading ? (
          <LoadingState
            message="Loading project case study..."
            cards={1}
            variant="details"
          />
        ) : null}

        {!loading && error ? (
          <ErrorState message={error} onRetry={() => loadProject(true)} />
        ) : null}

        {!loading && !error && !project ? (
          <EmptyState
            title="Project not found"
            message="This project may have been removed or is unavailable."
          />
        ) : null}

        {!loading && !error && project ? (
          <>
            <SeoHead
              title={`${project.title} — Case Study | Nikhil Agrahari`}
              description={
                project.description ||
                project.solutionSummary ||
                `Architecture notes and implementation details for ${project.title}, built by Nikhil Agrahari.`
              }
              pathname={canonicalPath}
              image={previewImage}
              imageAlt={`${project.title} — Case Study`}
              keywords={[
                project.title,
                `${project.title} Nikhil Agrahari`,
                `${project.title} Full Stack Project`,
                "engineering case study",
                project.category,
                ...(Array.isArray(project.techStack) ? project.techStack : []),
              ]}
              jsonLd={[
                createBreadcrumbSchema([
                  { name: "Home", path: "/" },
                  { name: "Projects", path: "/projects" },
                  { name: project.title, path: canonicalPath },
                ]),
                projectSchema,
              ]}
            />

            {/* Top Navigation Bar */}
            <MotionDiv
              {...fadeSlide(0)}
              className="mb-6 flex flex-wrap items-center justify-between gap-3"
            >
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-lg border border-black/[0.08] bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors duration-150 hover:border-slate-300 hover:text-slate-950 sm:text-sm dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8] dark:hover:border-white/[0.16] dark:hover:text-[#eef0f5]"
              >
                <ArrowLeft size={16} strokeWidth={1.5} />
                Back to Projects
              </Link>

              <span className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                Projects · {project.category || "Case Study"}
              </span>
            </MotionDiv>

            <article className="space-y-6">
              {/* 1. Case Study Header */}
              <MotionHeader
                {...fadeSlide(0.05)}
                className="rounded-2xl border border-black/[0.08] bg-white p-6 sm:p-8 dark:border-white/[0.08] dark:bg-[#11141c]"
              >
                {/* Metadata Strip */}
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    {project.category || "Engineering"}
                  </span>

                  <span className="text-slate-300 dark:text-white/15">·</span>

                  <span className="inline-flex items-center gap-1.5 rounded-md border border-black/[0.08] bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]">
                    {isCollab ? (
                      <Users size={13} strokeWidth={1.5} />
                    ) : (
                      <User size={13} strokeWidth={1.5} />
                    )}
                    {isCollab ? "Collaboration Project" : "Solo Project"}
                  </span>

                  {cleanStatus ? (
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-600/25 bg-emerald-500/[0.08] px-2.5 py-1 font-mono text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                      {cleanStatus}
                    </span>
                  ) : null}
                </div>

                {/* Title & Subtitle */}
                <h1 className="font-display text-3xl font-semibold tracking-[-0.025em] leading-[1.12] text-slate-900 sm:text-4xl lg:text-[2.75rem] dark:text-[#eef0f5]">
                  {project.title}
                </h1>

                {project.subtitle ? (
                  <p className="mt-2.5 text-base font-medium text-slate-700 sm:text-lg dark:text-[#d1d5df]">
                    {project.subtitle}
                  </p>
                ) : null}

                {project.description ? (
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-[#a3a9b8]">
                    {project.description}
                  </p>
                ) : null}

                {/* Primary & Secondary Action Buttons */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {project.liveDemoUrl ? (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-medium text-white transition-colors duration-150 hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                    >
                      Live Demo
                      <ExternalLink size={15} strokeWidth={1.5} />
                    </a>
                  ) : null}

                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={
                        project.liveDemoUrl
                          ? "inline-flex h-10 items-center gap-2 rounded-lg border border-black/[0.10] bg-slate-50 px-4 text-sm font-medium text-slate-800 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-100 dark:border-white/[0.10] dark:bg-[#1a1e28] dark:text-[#eef0f5] dark:hover:border-white/[0.18] dark:hover:bg-[#222734]"
                          : "inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-medium text-white transition-colors duration-150 hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                      }
                    >
                      <GitHubMark className="h-4 w-4" />
                      GitHub Repository
                    </a>
                  ) : null}

                  {project.apkUrl ? (
                    <a
                      href={project.apkUrl}
                      download="Vistagram.apk"
                      className="inline-flex h-10 items-center gap-2 rounded-lg border border-black/[0.10] bg-white px-4 text-sm font-medium text-slate-800 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 dark:border-white/[0.10] dark:bg-[#11141c] dark:text-[#eef0f5] dark:hover:border-white/[0.18] dark:hover:bg-[#1a1e28]"
                    >
                      <Download size={15} strokeWidth={1.5} />
                      Download Android APK
                    </a>
                  ) : null}
                </div>

                {/* Technology Tag List */}
                {displayTags.length > 0 ? (
                  <div className="mt-6 flex flex-wrap gap-1.5 border-t border-black/[0.06] pt-5 dark:border-white/[0.08]">
                    {displayTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-md border border-black/[0.08] bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </MotionHeader>

              {/* 2. Preview Showcase */}
              <MotionDiv
                {...fadeSlide(0.1)}
                className="overflow-hidden rounded-2xl border border-black/[0.08] bg-slate-100 dark:border-white/[0.08] dark:bg-[#0b0d14]"
              >
                <picture>
                  {localWebpImage ? (
                    <source srcSet={localWebpImage} type="image/webp" />
                  ) : null}
                  <img
                    src={previewImage}
                    alt={`${project.title} preview screenshot`}
                    className="max-h-[480px] w-full object-cover object-top"
                    width={1280}
                    height={720}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    onError={handleImageError}
                  />
                </picture>
              </MotionDiv>

              {/* 3. Overview & Quick Specifications */}
              <MotionDiv
                {...fadeSlide(0.14)}
                className="grid w-full gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"
              >
                <div className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c]">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.08] bg-slate-50 text-emerald-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-emerald-400">
                      <BookOpen size={16} strokeWidth={1.5} />
                    </span>
                    <h2 className="font-display text-lg font-semibold tracking-[-0.01em] text-slate-900 dark:text-[#eef0f5]">
                      Overview
                    </h2>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-[#a3a9b8]">
                    {project.overview || project.description}
                  </p>
                  {project.outcome ? (
                    <p className="mt-4 border-t border-black/[0.06] pt-4 text-sm leading-relaxed text-slate-700 dark:border-white/[0.06] dark:text-[#d1d5df]">
                      <span className="font-medium text-emerald-700 dark:text-emerald-400">
                        Result:{" "}
                      </span>
                      {project.outcome}
                    </p>
                  ) : null}
                </div>

                {/* Spec Summary */}
                <aside className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c]">
                  <h2 className="font-display text-lg font-semibold tracking-[-0.01em] text-slate-900 dark:text-[#eef0f5]">
                    Project Summary
                  </h2>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between border-b border-black/[0.06] pb-2.5 dark:border-white/[0.06]">
                      <dt className="text-slate-500 dark:text-[#7a8296]">Category</dt>
                      <dd className="font-mono text-xs font-medium text-slate-900 dark:text-[#eef0f5]">
                        {project.category || "Full Stack"}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between border-b border-black/[0.06] pb-2.5 dark:border-white/[0.06]">
                      <dt className="text-slate-500 dark:text-[#7a8296]">Scope</dt>
                      <dd className="font-mono text-xs font-medium text-slate-900 dark:text-[#eef0f5]">
                        {isCollab ? "Team Collaboration" : "Solo Build"}
                      </dd>
                    </div>
                    {cleanStatus ? (
                      <div className="flex items-center justify-between border-b border-black/[0.06] pb-2.5 dark:border-white/[0.06]">
                        <dt className="text-slate-500 dark:text-[#7a8296]">Status</dt>
                        <dd className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                          {cleanStatus}
                        </dd>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between border-b border-black/[0.06] pb-2.5 dark:border-white/[0.06]">
                      <dt className="text-slate-500 dark:text-[#7a8296]">Stack Count</dt>
                      <dd className="font-mono text-xs font-medium tabular-nums text-slate-900 dark:text-[#eef0f5]">
                        {(project.techStack?.length || displayTags.length)} technologies
                      </dd>
                    </div>
                    <div className="flex items-center justify-between pt-0.5">
                      <dt className="text-slate-500 dark:text-[#7a8296]">Source</dt>
                      <dd>
                        {project.githubUrl ? (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                          >
                            GitHub <ExternalLink size={12} strokeWidth={1.5} />
                          </a>
                        ) : (
                          <span className="font-mono text-xs text-slate-400 dark:text-[#7a8296]">
                            Private
                          </span>
                        )}
                      </dd>
                    </div>
                  </dl>
                </aside>
              </MotionDiv>

              {/* 4. Problem & Solution */}
              <MotionDiv
                {...fadeSlide(0.18)}
                className="grid w-full gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
              >
                <div className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c]">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.08] bg-slate-50 text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]">
                        <Target size={16} strokeWidth={1.5} />
                      </span>
                      <h2 className="font-display text-lg font-semibold tracking-[-0.01em] text-slate-900 dark:text-[#eef0f5]">
                        Problem
                      </h2>
                    </div>
                    <span className="font-mono text-xs tabular-nums text-slate-400 dark:text-[#7a8296]">
                      01
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-[#a3a9b8]">
                    {project.problemStatement ||
                      "Problem scope details are being documented."}
                  </p>
                </div>

                <div className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c]">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-600/20 bg-emerald-500/[0.08] text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <Lightbulb size={16} strokeWidth={1.5} />
                      </span>
                      <h2 className="font-display text-lg font-semibold tracking-[-0.01em] text-slate-900 dark:text-[#eef0f5]">
                        Solution
                      </h2>
                    </div>
                    <span className="font-mono text-xs tabular-nums text-emerald-700 dark:text-emerald-400">
                      02
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-[#a3a9b8]">
                    {project.solutionSummary ||
                      "Architecture solution notes are being documented."}
                  </p>
                </div>
              </MotionDiv>

              {/* 5. Key Features */}
              {project.highlights?.length ? (
                <div className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.08] bg-slate-50 text-emerald-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-emerald-400">
                        <Layers size={16} strokeWidth={1.5} />
                      </span>
                      <h2 className="font-display text-lg font-semibold tracking-[-0.01em] text-slate-900 dark:text-[#eef0f5]">
                        Key Features
                      </h2>
                    </div>
                    <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-[#7a8296]">
                      {project.highlights.length} capabilities
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
                    {project.highlights.map((item, idx) => {
                      const { title, body } = cleanHighlightItem(item);
                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-3 rounded-xl border border-black/[0.06] bg-slate-50 p-4 dark:border-white/[0.06] dark:bg-[#1a1e28]"
                        >
                          <CheckCircle2
                            size={16}
                            strokeWidth={1.5}
                            className="mt-0.5 shrink-0 text-emerald-700 dark:text-emerald-400"
                          />
                          <div className="min-w-0 flex-1">
                            {title ? (
                              <h3 className="font-display text-sm font-medium leading-snug text-slate-900 dark:text-[#eef0f5]">
                                {title}
                              </h3>
                            ) : null}
                            <p
                              className={`text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8] ${
                                title ? "mt-1 text-xs sm:text-sm" : ""
                              }`}
                            >
                              {body}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* 6. Challenges & Outcomes */}
              {project.challenges?.length || project.outcomes?.length ? (
                <div className="grid w-full gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  {project.challenges?.length ? (
                    <div className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c]">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.08] bg-slate-50 text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]">
                          <Wrench size={16} strokeWidth={1.5} />
                        </span>
                        <h2 className="font-display text-lg font-semibold tracking-[-0.01em] text-slate-900 dark:text-[#eef0f5]">
                          Engineering Challenges
                        </h2>
                      </div>
                      <ul className="mt-4 space-y-3">
                        {project.challenges.map((c, idx) => (
                          <li
                            key={c}
                            className="flex items-start gap-3 text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8]"
                          >
                            <span className="mt-0.5 shrink-0 font-mono text-xs tabular-nums text-slate-400 dark:text-[#7a8296]">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <span className="min-w-0 flex-1">{stripLeadingEmoji(c)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {project.outcomes?.length ? (
                    <div className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c]">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-600/20 bg-emerald-500/[0.08] text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400">
                          <CheckCircle2 size={16} strokeWidth={1.5} />
                        </span>
                        <h2 className="font-display text-lg font-semibold tracking-[-0.01em] text-slate-900 dark:text-[#eef0f5]">
                          Outcomes &amp; Delivery
                        </h2>
                      </div>
                      <ul className="mt-4 space-y-3">
                        {project.outcomes.map((o) => (
                          <li
                            key={o}
                            className="flex items-start gap-3 text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8]"
                          >
                            <CheckCircle2
                              size={16}
                              strokeWidth={1.5}
                              className="mt-0.5 shrink-0 text-emerald-700 dark:text-emerald-400"
                            />
                            <span className="min-w-0 flex-1">{stripLeadingEmoji(o)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* 7. Technologies & Architecture Stack */}
              <div className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c]">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.08] bg-slate-50 text-emerald-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-emerald-400">
                    <Cpu size={16} strokeWidth={1.5} />
                  </span>
                  <h2 className="font-display text-lg font-semibold tracking-[-0.01em] text-slate-900 dark:text-[#eef0f5]">
                    Technologies &amp; Stack
                  </h2>
                </div>

                {project.techStackGrouped ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(project.techStackGrouped).map(([category, stack]) => (
                      <div
                        key={category}
                        className="rounded-xl border border-black/[0.06] bg-slate-50 p-4 dark:border-white/[0.06] dark:bg-[#1a1e28]"
                      >
                        <h3 className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                          {category}
                        </h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {stack.map((item) => (
                            <SkillLogoBadge key={item} skill={item} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.techStack?.map((tech) => (
                      <SkillLogoBadge key={tech} skill={tech} />
                    ))}
                  </div>
                )}
              </div>

              {/* 8. Collaboration & Contributors */}
              {project.collaboration ? (
                <div className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.08] bg-slate-50 text-emerald-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-emerald-400">
                        {isCollab ? (
                          <Users size={16} strokeWidth={1.5} />
                        ) : (
                          <User size={16} strokeWidth={1.5} />
                        )}
                      </span>
                      <h2 className="font-display text-lg font-semibold tracking-[-0.01em] text-slate-900 dark:text-[#eef0f5]">
                        {isCollab ? "Project Team & Collaboration" : "Author & Ownership"}
                      </h2>
                    </div>
                    {project.collaboration.team ? (
                      <span className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                        {project.collaboration.team}
                      </span>
                    ) : null}
                  </div>

                  {project.collaboration.context ? (
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8]">
                      {project.collaboration.context}
                    </p>
                  ) : null}

                  {project.collaboration.teamList?.length ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {project.collaboration.teamList.map((member) => (
                        <div
                          key={member.name}
                          className="flex flex-col justify-between rounded-xl border border-black/[0.06] bg-slate-50 p-4 dark:border-white/[0.06] dark:bg-[#1a1e28]"
                        >
                          <div>
                            <h3 className="font-display text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
                              {member.name}
                            </h3>
                            <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
                              {member.role}
                            </p>
                          </div>
                          {member.portfolio ? (
                            <a
                              href={member.portfolio}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-slate-600 transition-colors duration-150 hover:text-slate-950 dark:text-[#a3a9b8] dark:hover:text-[#eef0f5]"
                            >
                              Portfolio <ExternalLink size={12} strokeWidth={1.5} />
                            </a>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : project.collaboration.members?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.collaboration.members.map((m) => (
                        <span
                          key={m}
                          className="rounded-lg border border-black/[0.08] bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#d1d5df]"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* 9. Key Learnings */}
              {project.learnings?.length ? (
                <div className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c]">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-display text-lg font-semibold tracking-[-0.01em] text-slate-900 dark:text-[#eef0f5]">
                      Key Engineering Takeaways
                    </h2>
                    <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-[#7a8296]">
                      {project.learnings.length} notes
                    </span>
                  </div>
                  <div className="mt-4 grid w-full gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    {project.learnings.map((learning, idx) => (
                      <div
                        key={learning}
                        className="flex items-start gap-3 rounded-xl border border-black/[0.06] bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-700 dark:border-white/[0.06] dark:bg-[#1a1e28] dark:text-[#d1d5df]"
                      >
                        <span className="mt-0.5 shrink-0 font-mono text-xs font-medium tabular-nums text-emerald-700 dark:text-emerald-400">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1">{stripLeadingEmoji(learning)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* 10. Next / Previous Project Case Studies */}
              {(prevProject || nextProject) ? (
                <nav
                  aria-label="Adjacent case studies"
                  className="grid w-full gap-4 border-t border-black/[0.08] pt-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] dark:border-white/[0.08]"
                >
                  {prevProject ? (
                    <Link
                      to={`/projects/${prevProject.slug}`}
                      className="group flex items-center justify-between gap-4 rounded-xl border border-black/[0.08] bg-white p-4 transition-colors duration-150 hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-white/[0.16]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <ChevronLeft
                          size={18}
                          strokeWidth={1.5}
                          className="shrink-0 text-slate-400 transition-colors duration-150 group-hover:text-emerald-700 dark:text-[#7a8296] dark:group-hover:text-emerald-400"
                        />
                        <div className="min-w-0">
                          <span className="block font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                            Previous project
                          </span>
                          <span className="mt-0.5 block truncate font-display text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
                            {prevProject.title}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="hidden sm:block" />
                  )}

                  {nextProject ? (
                    <Link
                      to={`/projects/${nextProject.slug}`}
                      className="group flex items-center justify-end gap-4 rounded-xl border border-black/[0.08] bg-white p-4 text-right transition-colors duration-150 hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-white/[0.16]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="min-w-0">
                          <span className="block font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                            Next project
                          </span>
                          <span className="mt-0.5 block truncate font-display text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
                            {nextProject.title}
                          </span>
                        </div>
                        <ChevronRight
                          size={18}
                          strokeWidth={1.5}
                          className="shrink-0 text-slate-400 transition-colors duration-150 group-hover:text-emerald-700 dark:text-[#7a8296] dark:group-hover:text-emerald-400"
                        />
                      </div>
                    </Link>
                  ) : null}
                </nav>
              ) : null}
            </article>
          </>
        ) : null}
      </div>
    </section>
  );
};

export default ProjectDetailsPage;
