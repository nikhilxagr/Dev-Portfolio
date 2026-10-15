import { useState, useMemo, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import clsx from "clsx";
import {
  Network,
  Server,
  Database,
  Zap,
  ArrowRight,
  ArrowLeft,
  Search,
  CheckCircle2,
  Cpu,
  Clock,
  Layers,
  Globe,
  Radio,
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

/* ─────────────────────────────────────────────────────────────────────────────
 * 1. DETAIL VIEW: RENDERED WHEN A SPECIFIC SYSTEM ROUTE IS OPENED (:id)
 * ───────────────────────────────────────────────────────────────────────────── */
const SystemDesignDetailView = ({ system }) => {
  const Icon = system.icon;
  const currentIndex = SYSTEM_DESIGNS.findIndex((s) => s.id === system.id);
  const prevSystem = currentIndex > 0 ? SYSTEM_DESIGNS[currentIndex - 1] : null;
  const nextSystem =
    currentIndex < SYSTEM_DESIGNS.length - 1
      ? SYSTEM_DESIGNS[currentIndex + 1]
      : null;

  return (
    <>
      <SeoHead
        title={`${system.title} | System Design Notes`}
        description={system.summary}
        pathname={`/experiments/system-design/${system.id}`}
        keywords={[
          system.title,
          system.tag,
          "system design notes",
          "distributed systems architecture",
          "Nikhil Agrahari system design",
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Experiments", url: "/experiments" },
          { name: "System Design", url: "/experiments/system-design" },
          { name: system.title, url: `/experiments/system-design/${system.id}` },
        ])}
      />

      <section className="relative overflow-hidden pt-10 pb-20 sm:pt-14 sm:pb-28">
        {/* Subtle Ambient Background Glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/5 blur-[120px]" />
          <div className="absolute right-1/4 top-1/2 h-80 w-80 translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6">
          {/* Top Bar: Back to All Systems + Domain Badge */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <Link
              to="/experiments/system-design"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white/80 dark:bg-zinc-900/60 px-4 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-lime-400 hover:text-zinc-950 dark:hover:text-white transition shadow-xs"
            >
              <ArrowLeft size={14} />
              <span>Back to All System Designs</span>
            </Link>

            <span
              className={clsx(
                "rounded-full border px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider",
                system.badgeColor
              )}
            >
              {system.tag}
            </span>
          </div>

          {/* Hero Title Block matching Journey Page Typography */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-800/50 shadow-sm">
                <Icon size={24} className="text-lime-500 dark:text-lime-400" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400 block">
                  {system.subtitle}
                </span>
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  {system.domain}
                </span>
              </div>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
              {system.title}
            </h1>

            <p className="mt-4 text-sm sm:text-base leading-7 text-zinc-600 dark:text-zinc-300 max-w-3xl font-normal">
              {system.summary}
            </p>
          </div>

          {/* Key Architecture Stats Bar */}
          {system.stats && (
            <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Object.entries(system.stats).map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-white/80 dark:bg-zinc-900/60 p-4 shadow-sm dark:shadow-none"
                >
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                    {k.toUpperCase()}
                  </p>
                  <p className="font-mono text-base sm:text-lg font-black text-zinc-900 dark:text-white mt-1">
                    {v}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ── Architecture Data Flow Block ── */}
          <div className="mb-12 overflow-hidden rounded-[1.6rem] border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/70 p-6 sm:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
            <div
              className={clsx(
                "h-[2.5px] w-full absolute inset-x-0 top-0 bg-gradient-to-r",
                system.accent
              )}
            />

            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                // SYSTEM EXECUTION FLOW
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mt-1">
                Step-by-Step Architecture Data Flow
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {system.architectureSteps.map((s) => (
                <div
                  key={s.step}
                  className="flex items-start gap-3 rounded-2xl border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50/70 dark:bg-zinc-950/40 p-4"
                >
                  <span className="font-mono text-xs font-black text-lime-600 dark:text-lime-400 bg-lime-500/10 px-2 py-1 rounded-md shrink-0 mt-0.5">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white leading-snug">
                      {s.name}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
                      {s.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Backend Engineering Deep-Dive Notes (GFG / W3Schools style) ── */}
          <div className="mb-12 space-y-4">
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                // DEEP-DIVE ENGINEERING CONCEPTS
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mt-1">
                How It Works in the Backend
              </h2>
            </div>

            <div className="space-y-4">
              {system.deepDiveNotes.map((note, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/60 p-5 sm:p-6 shadow-sm dark:shadow-none"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                      <span className="text-lime-500 font-black">→</span>
                      <span>{note.title}</span>
                    </h3>
                    {note.highlight && (
                      <span className="rounded-lg border border-lime-500/30 bg-lime-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-lime-700 dark:text-lime-300 w-fit">
                        {note.highlight}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal pl-4">
                    {note.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Key Technologies Block ── */}
          <div className="mb-12 rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/60 p-6 shadow-sm dark:shadow-none">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 mb-3">
              // Key Technologies &amp; Primitives
            </p>
            <div className="flex flex-wrap gap-2">
              {system.technologies.map((t) => (
                <span
                  key={t}
                  className="rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-100 dark:bg-zinc-800/70 px-3 py-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ── Bottom Pagination: Jump to Other Systems ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-200 dark:border-white/[0.08]">
            {prevSystem ? (
              <Link
                to={`/experiments/system-design/${prevSystem.id}`}
                className="group flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-wider block text-zinc-400">Previous System</span>
                  <span>{prevSystem.title}</span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            <Link
              to="/experiments/system-design"
              className="inline-flex items-center gap-2 rounded-xl bg-lime-300 text-slate-950 px-5 py-2.5 text-xs font-black uppercase tracking-wider hover:bg-lime-200 shadow-sm transition"
            >
              All System Designs
            </Link>

            {nextSystem ? (
              <Link
                to={`/experiments/system-design/${nextSystem.id}`}
                className="group flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition"
              >
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-wider block text-zinc-400">Next System</span>
                  <span>{nextSystem.title}</span>
                </div>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
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

/* ─────────────────────────────────────────────────────────────────────────────
 * 2. LIST VIEW: RENDERED WHEN ON MAIN /experiments/system-design ROUTE
 * ───────────────────────────────────────────────────────────────────────────── */
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
        description="Clean, card-wise architectural breakdowns of real-world distributed backends: URL Shortener, Uber, Zomato, Blinkit, Instagram, and WhatsApp. Understand system design from first principles."
        pathname="/experiments/system-design"
        keywords={[
          "system design analysis",
          "URL shortener system design",
          "Uber backend architecture",
          "Zomato delivery architecture",
          "Blinkit dark stores",
          "Nikhil Agrahari system design",
          "backend engineering notes",
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Experiments", url: "/experiments" },
          { name: "System Design Analysis", url: "/experiments/system-design" },
        ])}
      />

      {/* ── HERO BANNER (MATCHING JOURNEY PAGE STYLE & TYPOGRAPHY) ───── */}
      <section
        id="system-design-hero"
        className="relative overflow-hidden pt-12 pb-14 sm:pt-16 sm:pb-20 bg-white/0"
      >
        {/* Ambient Subtle Glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/5 blur-[120px]" />
          <div className="absolute right-1/3 top-2/3 h-72 w-72 translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          {/* Top Pill Badge matching Journey Page */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-lime-500/30 dark:border-lime-300/20 bg-lime-500/[0.06] dark:bg-lime-300/[0.04] px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-lime-600 dark:text-lime-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-500 dark:bg-lime-300" />
              Distributed Systems &amp; Backend Engineering
            </span>
          </div>

          {/* Heading with exact Journey Page Font & Sizing */}
          <h1 className="mt-2 font-display text-[7.5vw] sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight text-zinc-900 dark:text-white">
            SYSTEM DESIGN
            <br />
            <span className="bg-gradient-to-r from-lime-300 to-lime-500 bg-clip-text text-transparent">
              ANALYSIS
            </span>
          </h1>

          {/* Subtitle with exact Journey Page typography */}
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-500 dark:text-zinc-400 sm:text-base">
            Clean, practical architectural breakdowns of real-world distributed
            backends (URL Shortener, Uber, Zomato, Blinkit, Instagram, WhatsApp).
            Click any card to open its dedicated architecture route and deep-dive notes.
          </p>

          {/* Search & Filter Controls */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
            <div className="relative w-full sm:w-80">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search systems (e.g. Redis, Uber, Cache)..."
                className="w-full rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 pl-9 pr-4 py-2.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-lime-400 shadow-sm dark:shadow-none"
              />
            </div>

            <div
              className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1"
              style={{ scrollbarWidth: "none" }}
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={clsx(
                    "shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300",
                    activeCategory === cat
                      ? "border-lime-400 bg-lime-400 text-black font-black shadow-[0_0_12px_rgba(163,230,53,0.35)]"
                      : "border-slate-300 dark:border-white/[0.07] bg-white/90 dark:bg-zinc-900/60 text-slate-700 dark:text-zinc-400 hover:border-slate-400 dark:hover:border-white/[0.15] hover:text-slate-950 dark:hover:text-zinc-200 shadow-xs"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CARD-WISE SYSTEM DESIGN GRID (ENTIRE CARD IS CLICKABLE) ──── */}
      <section className="section-wrap pb-24">
        <div className="mx-auto max-w-6xl">
          {filteredDesigns.length === 0 ? (
            <div className="py-24 text-center text-sm font-semibold text-zinc-500">
              No system design architectures match your search filter.
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2 items-stretch">
              {filteredDesigns.map((system) => {
                const Icon = system.icon;

                return (
                  <Link
                    key={system.id}
                    to={`/experiments/system-design/${system.id}`}
                    aria-label={`Open architecture study for ${system.title}`}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-[1.6rem] border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/70 shadow-[0_8px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-all duration-300 hover:border-lime-400/60 dark:hover:border-lime-400/50 hover:-translate-y-1 hover:shadow-xl p-6 sm:p-7 cursor-pointer"
                  >
                    {/* Top Accent Stripe matching Journey page */}
                    <div
                      className={clsx(
                        "absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r",
                        system.accent
                      )}
                    />

                    <div>
                      {/* Header Row: Domain Tag & Icon */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white shadow-xs group-hover:scale-105 transition-transform">
                            <Icon
                              size={18}
                              className="text-lime-500 dark:text-lime-400"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400 block">
                              {system.subtitle}
                            </span>
                            <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                              {system.domain}
                            </span>
                          </div>
                        </div>

                        <span
                          className={clsx(
                            "rounded-full border px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider",
                            system.badgeColor
                          )}
                        >
                          {system.tag}
                        </span>
                      </div>

                      {/* Main Title */}
                      <h2 className="font-display text-xl sm:text-2xl font-black text-zinc-900 dark:text-white leading-snug group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                        {system.title}
                      </h2>

                      {/* Human-Friendly Summary */}
                      <p className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
                        {system.summary}
                      </p>

                      {/* ── Architecture Flow Box ──────────────────────── */}
                      <div className="mt-5 rounded-2xl border border-zinc-200 dark:border-white/[0.06] bg-zinc-50/80 dark:bg-zinc-950/50 p-4 space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                          // Architecture Data Flow
                        </p>

                        <div className="space-y-2">
                          {system.architectureSteps.map((step) => (
                            <div
                              key={step.step}
                              className="flex items-start gap-2.5 text-xs"
                            >
                              <span className="mt-0.5 font-mono text-[10px] font-black text-lime-600 dark:text-lime-400 bg-lime-500/10 px-1.5 py-0.5 rounded">
                                {step.step}
                              </span>
                              <div className="leading-snug">
                                <strong className="text-zinc-900 dark:text-white font-bold">
                                  {step.name}:{" "}
                                </strong>
                                <span className="text-zinc-600 dark:text-zinc-300">
                                  {step.detail}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ── Technologies Pill Bar ─────────────────────── */}
                      <div className="mt-5">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-500">
                          // Key Technologies &amp; Primitives
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {system.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-lg border border-zinc-200 dark:border-white/[0.07] bg-zinc-100 dark:bg-zinc-800/60 px-2.5 py-1 text-[10px] font-semibold text-zinc-700 dark:text-zinc-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Status & Direct Action Link */}
                    <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-white/[0.06] flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-lime-500 animate-pulse" />
                        {system.readiness}
                      </span>

                      <div className="inline-flex items-center gap-1.5 font-bold text-xs text-lime-600 group-hover:text-lime-700 dark:text-lime-400 dark:group-hover:text-lime-300 transition">
                        <span>Open Architecture Route</span>
                        <ArrowRight
                          size={14}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CLOSING BANNER ───────────────────────────────────────────── */}
      <section className="section-wrap pb-20">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-zinc-200 dark:border-white/[0.08] bg-white/80 dark:bg-zinc-950/40 p-8 sm:p-12 text-center backdrop-blur-xl shadow-sm dark:shadow-none">
          <span className="inline-flex items-center gap-2 rounded-full border border-lime-500/30 dark:border-lime-300/20 bg-lime-500/[0.06] dark:bg-lime-300/[0.04] px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-lime-600 dark:text-lime-300 mb-4">
            <Network size={12} /> Systems Engineering
          </span>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
            Want to Discuss System Architectures?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            Open to discussing scalable backend systems, database partitioning,
            caching layers, and high-concurrency microservices.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-300 text-slate-950 px-5 py-2.5 text-xs font-black uppercase tracking-wider hover:bg-lime-200 shadow-md transition"
            >
              Discuss Architecture
            </Link>
            <Link
              to="/experiments"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 dark:border-white/[0.1] bg-white/50 dark:bg-zinc-900/60 text-zinc-800 dark:text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:border-lime-400 transition"
            >
              Explore All Labs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
 * 3. MAIN COMPONENT ROUTER (SWITCHES BASED ON :id URL PARAMETER)
 * ───────────────────────────────────────────────────────────────────────────── */
const SystemDesignPage = () => {
  const { id } = useParams();

  // Scroll to top upon navigating to/from details
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
