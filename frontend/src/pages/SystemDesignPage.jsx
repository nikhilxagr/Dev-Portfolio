import { useState, useMemo, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import clsx from "clsx";
import {
  Network,
  ArrowRight,
  ArrowLeft,
  Search,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import { createBreadcrumbSchema } from "@/utils/seo";
import {
  SYSTEM_DESIGNS,
  CATEGORIES,
  getSystemDesignById,
  getSystemDesignArticleById,
} from "@/data/systemDesignData";
import SystemDesignArticleView from "@/components/system-design/SystemDesignArticleView";

const formatStatLabel = (key) => {
  if (!key) return "";
  return key.charAt(0).toUpperCase() + key.slice(1);
};

export const SystemDesignDetailView = ({
  system,
  prevSystem: externalPrev,
  nextSystem: externalNext,
  backUrl = "/blog",
  backLabel = "Back to Engineering Docs",
  baseRoute = "/blog",
}) => {
  const Icon = system.icon;
  const currentIndex = SYSTEM_DESIGNS.findIndex((s) => s.id === system.id);
  const prevSystem =
    externalPrev !== undefined
      ? externalPrev
      : currentIndex > 0
        ? SYSTEM_DESIGNS[currentIndex - 1]
        : null;
  const nextSystem =
    externalNext !== undefined
      ? externalNext
      : currentIndex < SYSTEM_DESIGNS.length - 1
        ? SYSTEM_DESIGNS[currentIndex + 1]
        : null;

  return (
    <>
      <SeoHead
        title={`${system.title} | System Design Notes`}
        description={system.summary}
        pathname={`${baseRoute}/${system.id}`}
        keywords={[
          system.title,
          system.tag,
          "system design notes",
          "distributed systems architecture",
          "Nikhil Agrahari system design",
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: system.title, url: `${baseRoute}/${system.id}` },
        ])}
      />

      <section className="relative pt-6 pb-20 sm:pt-8 sm:pb-24">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Link
              to={backUrl}
              className="inline-flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-4 py-2 text-xs font-medium text-ink-700 transition-colors hover:border-emerald-600/35 hover:text-ink-950 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-ink-300 dark:hover:border-emerald-500/35 dark:hover:text-ink-50"
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
              <span>{backLabel}</span>
            </Link>

            <span
              className={clsx(
                "rounded-full border px-3 py-0.5 text-xs font-medium",
                system.badgeColor
              )}
            >
              {system.tag}
            </span>
          </div>

          <div className="mb-10">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/25 dark:text-emerald-400">
                <Icon size={20} strokeWidth={1.5} />
              </div>
              <div>
                <span className="block font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {system.subtitle}
                </span>
                <span className="text-xs font-medium text-ink-600 dark:text-ink-300">
                  {system.domain}
                </span>
              </div>
            </div>

            <h1 className="font-display text-3xl font-semibold tracking-tight leading-tight text-ink-950 dark:text-ink-50 sm:text-4xl lg:text-5xl">
              {system.title}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-ink-600 dark:text-ink-300 sm:text-base">
              {system.summary}
            </p>
          </div>

          {system.stats && (
            <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Object.entries(system.stats).map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-2xl border border-black/[0.08] bg-white p-4 dark:border-white/[0.08] dark:bg-[#11141c]"
                >
                  <p className="font-mono text-xs text-ink-500 dark:text-ink-400">
                    {formatStatLabel(k)}
                  </p>
                  <p className="mt-1 font-mono text-base font-semibold tabular-nums text-ink-950 dark:text-ink-50 sm:text-lg">
                    {v}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mb-12 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-8">
            <div className="mb-6">
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                System Execution Flow
              </span>
              <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-ink-950 dark:text-ink-50 sm:text-2xl">
                Step-by-Step Architecture Data Flow
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {system.architectureSteps.map((s) => (
                <div
                  key={s.step}
                  className="flex items-start gap-3 rounded-xl border border-black/[0.08] bg-[#f8fafc] p-4 dark:border-white/[0.06] dark:bg-[#0c0e14]"
                >
                  <span className="mt-0.5 shrink-0 rounded-md border border-emerald-600/25 bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-medium tabular-nums text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-400">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold leading-snug text-ink-950 dark:text-ink-50">
                      {s.name}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-ink-600 dark:text-ink-300">
                      {s.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12 space-y-4">
            <div className="mb-6">
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Deep-Dive Engineering Concepts
              </span>
              <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-ink-950 dark:text-ink-50 sm:text-2xl">
                How It Works in the Backend
              </h2>
            </div>

            <div className="space-y-4">
              {system.deepDiveNotes.map((note, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-black/[0.08] bg-white p-5 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-6"
                >
                  <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                      <span className="text-emerald-600 dark:text-emerald-400">→</span>
                      <span>{note.title}</span>
                    </h3>
                    {note.highlight && (
                      <span className="w-fit rounded-lg border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
                        {note.highlight}
                      </span>
                    )}
                  </div>
                  <p className="pl-4 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                    {note.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c]">
            <p className="mb-3 text-xs font-medium text-ink-500 dark:text-ink-400">
              Key Technologies &amp; Primitives
            </p>
            <div className="flex flex-wrap gap-2">
              {system.technologies.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-black/[0.08] bg-black/[0.03] px-3 py-1.5 text-xs font-medium text-ink-800 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-ink-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-black/[0.08] pt-6 dark:border-white/[0.08] sm:flex-row">
            {prevSystem ? (
              <Link
                to={`${baseRoute}/${prevSystem.id}`}
                className="flex items-center gap-2 text-xs font-medium text-ink-600 transition-colors hover:text-ink-950 dark:text-ink-400 dark:hover:text-ink-50"
              >
                <ChevronLeft size={16} strokeWidth={1.5} />
                <div className="text-left">
                  <span className="block text-[11px] text-ink-400">Previous system</span>
                  <span>{prevSystem.title}</span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            <Link
              to={backUrl}
              className="inline-flex items-center gap-2 rounded-lg border border-black/[0.08] bg-ink-950 px-5 py-2.5 text-xs font-medium text-white transition-colors hover:bg-ink-900 dark:border-white/[0.1] dark:bg-emerald-500 dark:text-ink-950 dark:hover:bg-emerald-400"
            >
              {backLabel}
            </Link>

            {nextSystem ? (
              <Link
                to={`${baseRoute}/${nextSystem.id}`}
                className="flex items-center gap-2 text-xs font-medium text-ink-600 transition-colors hover:text-ink-950 dark:text-ink-400 dark:hover:text-ink-50"
              >
                <div className="text-right">
                  <span className="block text-[11px] text-ink-400">Next system</span>
                  <span>{nextSystem.title}</span>
                </div>
                <ChevronRight size={16} strokeWidth={1.5} />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

const SystemDesignListView = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDesigns = useMemo(() => {
    return SYSTEM_DESIGNS.filter((item) => {
      const matchesCategory =
        activeCategory === "All" ||
        item.category.toLowerCase() === activeCategory.toLowerCase();
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.technologies.some((t) => t.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <>
      <SeoHead
        title="System Design Analysis & Architecture Notes | Nikhil Agrahari"
        description="Clean architectural breakdowns of distributed backends: URL Shortener and foundational systems engineering notes by Nikhil Agrahari."
        pathname="/experiments/system-design"
        keywords={[
          "system design analysis",
          "URL shortener system design",
          "distributed systems notes",
          "Nikhil Agrahari system design",
          "backend engineering notes",
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Experiments", url: "/experiments" },
          { name: "System Design Analysis", url: "/experiments/system-design" },
        ])}
      />

      <section className="section-wrap pt-6 sm:pt-8 pb-20">
        <div className="flex flex-col gap-4 border-b border-black/[0.08] pb-8 dark:border-white/[0.08] md:flex-row md:items-center md:justify-between">
          <div
            className="flex max-w-full items-center gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={clsx(
                  "shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors duration-150",
                  activeCategory === cat
                    ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-ink-950"
                    : "border-black/[0.08] bg-white text-ink-600 hover:border-emerald-600/35 hover:text-ink-950 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-ink-300 dark:hover:border-emerald-500/35 dark:hover:text-ink-50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full shrink-0 md:w-80">
            <Search
              size={15}
              strokeWidth={1.5}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search systems (e.g. Redis, Cache)..."
              className="w-full rounded-xl border border-black/[0.1] bg-white py-2 pl-9 pr-4 text-sm text-ink-950 placeholder:text-ink-400 outline-none transition-colors focus:border-emerald-600 dark:border-white/[0.1] dark:bg-[#11141c] dark:text-ink-50 dark:placeholder:text-ink-500 dark:focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="pt-8 pb-6 sm:pt-10">
          <FadeInUp delay={0.05}>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Latest Blueprints
                </p>
                <h1 className="font-display text-3xl font-semibold tracking-tight leading-tight text-ink-950 dark:text-ink-50 sm:text-4xl lg:text-5xl">
                  System Design Analysis
                </h1>
                <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-base">
                  Practical architectural breakdowns of distributed backends with capacity sizing, data models, and system trade-offs.
                </p>
              </div>

              <p className="shrink-0 self-start font-mono text-xs font-medium tabular-nums text-ink-500 dark:text-ink-400 sm:self-end">
                {String(filteredDesigns.length).padStart(2, "0")} Blueprints
              </p>
            </div>
          </FadeInUp>
        </div>

        <div className="mt-2">
          {filteredDesigns.length === 0 ? (
            <div className="py-20 text-center text-sm font-medium text-ink-500 dark:text-ink-400">
              No system design architectures match your search filter.
            </div>
          ) : (
            <div>
              {filteredDesigns.map((system, index) => {
                const indexStr = String(index + 1).padStart(2, "0");
                const primaryStat = system.stats
                  ? `${system.stats.latency} · ${system.stats.traffic}`
                  : system.readiness;

                return (
                  <Link
                    key={system.id}
                    to={`/experiments/system-design/${system.id}`}
                    aria-label={`Open architecture study for ${system.title}`}
                    className="group -mx-3 block w-full rounded-2xl border-b border-black/[0.08] px-3 py-8 transition-colors duration-200 hover:bg-black/[0.02] dark:border-white/[0.08] dark:hover:bg-white/[0.02] sm:-mx-5 sm:px-5 sm:py-10"
                  >
                    <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
                      <div className="flex items-start gap-4 sm:gap-6 lg:col-span-7">
                        <div className="flex shrink-0 flex-col items-center pt-1">
                          <span className="font-mono text-xs font-medium tabular-nums text-ink-400 sm:text-sm">
                            {indexStr}
                          </span>
                          <span className="mt-1 h-[1.5px] w-3.5 bg-black/[0.12] dark:bg-white/[0.15]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
                              {system.domain || system.category}
                            </span>
                            <span className="text-xs text-ink-400">·</span>
                            <span className="font-mono text-xs text-ink-500 dark:text-ink-400">
                              {system.tag}
                            </span>
                          </div>

                          <h2 className="mt-1.5 font-display text-xl font-semibold leading-snug tracking-tight text-ink-950 transition-colors group-hover:text-emerald-600 dark:text-ink-50 dark:group-hover:text-emerald-400 sm:text-2xl">
                            {system.title}
                          </h2>

                          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:line-clamp-3 sm:text-base">
                            {system.summary}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {system.technologies.slice(0, 4).map((tech) => (
                              <span
                                key={tech}
                                className="rounded-lg border border-black/[0.08] bg-black/[0.03] px-2.5 py-0.5 font-mono text-xs text-ink-700 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-ink-300"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-3 dark:border-white/[0.06]">
                            <div className="flex items-center gap-2 font-mono text-xs tabular-nums text-ink-500 dark:text-ink-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                              <span>{primaryStat}</span>
                            </div>

                            <div className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-ink-800 transition-colors group-hover:text-emerald-600 dark:text-ink-200 dark:group-hover:text-emerald-400">
                              <span>Read breakdown</span>
                              <ArrowRight size={14} strokeWidth={1.5} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full lg:col-span-5">
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-black/[0.08] bg-[#11141c] transition-colors duration-200 group-hover:border-emerald-600/35 dark:border-white/[0.08] dark:group-hover:border-emerald-500/35">
                          <img
                            src={system.imageUrl || "/images/system-design/url-shortener-hld.webp"}
                            alt={`${system.title} architecture blueprint`}
                            className="h-full w-full object-cover object-center"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="section-wrap pb-20">
        <div className="mx-auto max-w-4xl rounded-2xl border border-black/[0.08] bg-white p-8 text-center dark:border-white/[0.08] dark:bg-[#11141c] sm:p-12">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
            <Network size={13} strokeWidth={1.5} /> Systems Engineering
          </span>

          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950 dark:text-ink-50 sm:text-3xl lg:text-4xl">
            Want to Discuss System Architectures?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-base">
            Open to discussing backend scalability, database partitioning, caching layers, and high-concurrency services.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-black/[0.08] bg-ink-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-900 dark:border-white/[0.1] dark:bg-emerald-500 dark:text-ink-950 dark:hover:bg-emerald-400"
            >
              Discuss Architecture
            </Link>
            <Link
              to="/experiments"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-black/[0.1] bg-white px-5 py-2.5 text-sm font-medium text-ink-800 transition-colors hover:border-emerald-600/35 dark:border-white/[0.1] dark:bg-[#0c0e14] dark:text-ink-200 dark:hover:border-emerald-500/35"
            >
              Explore All Labs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

const SystemDesignPage = () => {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (id) {
    const system = getSystemDesignById(id);
    if (system) {
      const article = getSystemDesignArticleById(id);
      const currentIndex = SYSTEM_DESIGNS.findIndex((s) => s.id === system.id);
      const prevSystem = currentIndex > 0 ? SYSTEM_DESIGNS[currentIndex - 1] : null;
      const nextSystem =
        currentIndex < SYSTEM_DESIGNS.length - 1
          ? SYSTEM_DESIGNS[currentIndex + 1]
          : null;

      if (article) {
        return (
          <SystemDesignArticleView
            system={system}
            article={article}
            prevSystem={prevSystem}
            nextSystem={nextSystem}
          />
        );
      }
      return <SystemDesignDetailView system={system} />;
    }
  }

  return <SystemDesignListView />;
};

export default SystemDesignPage;
