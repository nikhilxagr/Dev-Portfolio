import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Database,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Zap,
  ListChecks,
} from "lucide-react";
import SeoHead from "@/components/seo/SeoHead";
import { createBreadcrumbSchema } from "@/utils/seo";

// # 1. CLEAN ARCHITECTURE FIGURE DISPLAY (SIMPLE, INLINE, NO EXPAND OVERLAYS)
const FigureCard = ({ figure }) => {
  if (!figure) return null;
  return (
    <figure className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/80 shadow-sm">
      <div className="bg-zinc-950 p-4 sm:p-6 flex items-center justify-center min-h-[260px]">
        <img
          src={figure.src}
          alt={figure.alt || figure.title || "Architecture diagram"}
          className="max-h-[480px] w-auto max-w-full rounded-lg object-contain"
          loading="lazy"
        />
      </div>
      {figure.caption && (
        <figcaption className="p-3.5 sm:p-4 border-t border-zinc-100 dark:border-white/[0.06] text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
          {figure.caption}
        </figcaption>
      )}
    </figure>
  );
};

// # 2. CODE BLOCK WITH COPY BUTTON
const CodeSnippet = ({ code, language = "json", statusBadge = null }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-950 text-zinc-100 font-mono text-xs shadow-md">
      <div className="flex items-center justify-between border-b border-white/[0.08] bg-zinc-900/90 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80 inline-block" />
          </div>
          <span className="text-[10px] uppercase font-bold text-zinc-400 ml-2 tracking-wider">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {statusBadge && (
            <span className="rounded-md bg-lime-500/20 px-2 py-0.5 text-[10px] font-bold text-lime-300 font-mono">
              {statusBadge}
            </span>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-md bg-white/5 hover:bg-white/10 px-2.5 py-1 text-[11px] text-zinc-300 transition"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check size={12} className="text-lime-400" />
                <span className="text-lime-400">Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <pre className="p-4 overflow-x-auto text-xs leading-relaxed text-zinc-200 selection:bg-lime-500/30">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// # 3. MAIN SYSTEM DESIGN ARTICLE VIEW
export default function SystemDesignArticleView({
  system,
  article,
  prevSystem,
  nextSystem,
  backUrl = "/blog",
  backLabel = "Back to Engineering Docs",
  baseRoute = "/blog",
}) {
  const [activePipeline, setActivePipeline] = useState("write");
  const [activeTocId, setActiveTocId] = useState("overview");

  // Track active section for table of contents
  useEffect(() => {
    const handleScroll = () => {
      const sections = article.tableOfContents.map((t) => document.getElementById(t.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.offsetTop <= scrollPosition) {
          setActiveTocId(article.tableOfContents[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [article.tableOfContents]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  return (
    <>
      <SeoHead
        title={`${article.title} | System Design Notes & Architecture Guide`}
        description={`Comprehensive architectural breakdown of ${article.title}: high-level design, capacity calculations, database schema, request flow, and low-level Base62 algorithms.`}
        pathname={`${baseRoute}/${system.id}`}
        keywords={[
          article.title,
          "system design notes",
          "URL shortener system design",
          "TinyURL architecture",
          "Base62 encoding",
          "distributed key generation service",
          "Nikhil Agrahari system design",
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: article.title, url: `${baseRoute}/${system.id}` },
        ])}
      />

      <article className="relative overflow-hidden pt-8 pb-20 sm:pt-12 sm:pb-28">
        {/* Subtle Ambient Background Gradients */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/5 blur-[120px]" />
          <div className="absolute right-1/4 top-1/2 h-80 w-80 translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Bar: Back to All Systems + Meta Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <Link
              to={backUrl}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white/80 dark:bg-zinc-900/70 px-4 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-lime-400 hover:text-zinc-950 dark:hover:text-white transition shadow-xs"
            >
              <ArrowLeft size={14} />
              <span>{backLabel}</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-500/30 bg-lime-500/10 px-3 py-1 font-mono text-[10px] font-bold text-lime-600 dark:text-lime-300">
                <Clock size={11} />
                {article.readingTime}
              </span>
              <span className="rounded-full border border-zinc-200 dark:border-white/[0.08] bg-zinc-100 dark:bg-zinc-800/80 px-3 py-1 font-mono text-[10px] font-bold text-zinc-600 dark:text-zinc-300">
                {article.level}
              </span>
            </div>
          </div>

          {/* # ARTICLE HERO SECTION (JOURNEY PAGE TYPOGRAPHY) */}
          <div className="mb-10 max-w-4xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs font-black uppercase tracking-[0.2em] text-lime-500">
                // SYSTEM ARCHITECTURE STUDY NOTES
              </span>
              <span className="text-zinc-400">•</span>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Updated {article.lastUpdated}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
              {article.title}
            </h1>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 font-normal">
              {article.overview.lead}
            </p>

            {/* Author & Context Strip */}
            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-white/70 dark:bg-zinc-900/50 p-4 text-xs text-zinc-600 dark:text-zinc-300 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-lime-500 animate-pulse" />
                <span className="font-bold text-zinc-900 dark:text-white">Curated by:</span>
                <span>{article.author}</span>
              </div>
              <span className="text-zinc-400 hidden sm:inline">•</span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {article.authorRole}
              </span>
              <span className="text-zinc-400 hidden sm:inline">•</span>
              <span className="text-zinc-500 dark:text-zinc-400">
                A clean, practical engineering guide for production systems &amp; interviews
              </span>
            </div>
          </div>

          {/* # TWO-COLUMN LAYOUT: STICKY TOC ON LEFT + FULL ARTICLE ON RIGHT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* # STICKY TABLE OF CONTENTS (COL 1-3) */}
            <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-4">
              <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-white/80 dark:bg-zinc-900/60 p-4 shadow-sm backdrop-blur-md">
                <p className="font-display text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                  <ListChecks size={14} className="text-lime-500" />
                  <span>Table of Contents</span>
                </p>

                <nav className="space-y-1">
                  {article.tableOfContents.map((toc) => {
                    const isActive = activeTocId === toc.id;
                    return (
                      <button
                        key={toc.id}
                        type="button"
                        onClick={() => scrollToSection(toc.id)}
                        className={clsx(
                          "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 block truncate",
                          isActive
                            ? "bg-lime-500/15 text-lime-700 dark:text-lime-300 font-bold border-l-2 border-lime-500 pl-2"
                            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                        )}
                      >
                        {toc.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Quick Jump Stats */}
              {system.stats && (
                <div className="hidden lg:block rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-white/80 dark:bg-zinc-900/60 p-4 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Key SLA Metrics
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-zinc-100 dark:border-white/[0.05] pb-1.5">
                      <span className="text-zinc-500">Read QPS:</span>
                      <span className="font-mono font-bold text-zinc-900 dark:text-white">
                        {system.stats.traffic}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-100 dark:border-white/[0.05] pb-1.5">
                      <span className="text-zinc-500">Cache Latency:</span>
                      <span className="font-mono font-bold text-lime-600 dark:text-lime-400">
                        {system.stats.latency}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-100 dark:border-white/[0.05] pb-1.5">
                      <span className="text-zinc-500">Storage (5Y):</span>
                      <span className="font-mono font-bold text-zinc-900 dark:text-white">
                        {system.stats.storage}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Redis Cache:</span>
                      <span className="font-mono font-bold text-zinc-900 dark:text-white">
                        {system.stats.cache}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </aside>

            {/* # ARTICLE MAIN CONTENT (COL 4-12) */}
            <main className="lg:col-span-9 space-y-16">
              {/* # SECTION 1: THE CORE PROBLEM */}
              <section id="overview" className="scroll-mt-24 space-y-4">
                <div className="border-b border-zinc-200 dark:border-white/[0.08] pb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-lime-500">
                    // SECTION 01
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1">
                    The Core Problem: Why is this challenging?
                  </h2>
                </div>

                <p className="text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                  On the surface, URL shortening sounds like a trivial 10-line coding problem. You take a long URL string, generate an alias, save it in a dictionary, and look it up on request. But in real-world systems, millions of users click links simultaneously, links are shared on global networks, and downtime immediately breaks marketing campaigns, SMS notifications, and social posts.
                </p>

                <div className="grid gap-4 sm:grid-cols-3 mt-4">
                  {article.overview.keyPoints.map((pt, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/60 p-4 shadow-sm"
                    >
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1.5">
                        {pt.title}
                      </h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {pt.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* # SECTION 2: WHAT THE SYSTEM NEEDS TO DO (REQUIREMENTS) */}
              <section id="requirements" className="scroll-mt-24 space-y-6">
                <div className="border-b border-zinc-200 dark:border-white/[0.08] pb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-lime-500">
                    // SECTION 02
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1">
                    What the System Needs to Do (Requirements)
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {article.requirements.intro}
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Functional Requirements */}
                  <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/60 p-5 shadow-sm">
                    <h3 className="font-display text-base font-black text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-lime-500" />
                      <span>Functional Requirements</span>
                    </h3>
                    <div className="space-y-3">
                      {article.requirements.functional.map((fr, idx) => (
                        <div key={idx} className="border-b border-zinc-100 dark:border-white/[0.04] pb-2.5 last:border-0 last:pb-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-zinc-900 dark:text-white">
                              {fr.title}
                            </span>
                            <span
                              className={clsx(
                                "rounded-md px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider",
                                fr.mustHave
                                  ? "bg-lime-500/15 text-lime-700 dark:text-lime-300"
                                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                              )}
                            >
                              {fr.mustHave ? "Core" : "Optional"}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-normal">
                            {fr.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Non-Functional Requirements */}
                  <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/60 p-5 shadow-sm">
                    <h3 className="font-display text-base font-black text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                      <Zap size={16} className="text-cyan-400" />
                      <span>Non-Functional Requirements</span>
                    </h3>
                    <div className="space-y-3">
                      {article.requirements.nonFunctional.map((nfr, idx) => (
                        <div key={idx} className="border-b border-zinc-100 dark:border-white/[0.04] pb-2.5 last:border-0 last:pb-0">
                          <span className="text-xs font-bold text-zinc-900 dark:text-white block">
                            {nfr.title}
                          </span>
                          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-normal">
                            {nfr.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* # SECTION 3: SIZING UP THE SYSTEM (CAPACITY ESTIMATION) */}
              <section id="capacity" className="scroll-mt-24 space-y-6">
                <div className="border-b border-zinc-200 dark:border-white/[0.08] pb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-lime-500">
                    // SECTION 03
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1">
                    Sizing Up the System: Traffic, Storage &amp; Cache
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {article.capacity.intro}
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                  {article.capacity.traffic.map((t, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/60 p-4 shadow-sm"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        {t.metric}
                      </p>
                      <p className="font-mono text-lg font-black text-lime-600 dark:text-lime-400 mt-1">
                        {t.value}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1 font-medium">{t.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {article.capacity.calculations.map((calc, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-zinc-50/70 dark:bg-zinc-900/50 p-4 sm:p-5"
                    >
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                        {calc.title}
                      </h3>
                      <div className="mt-2 rounded-xl bg-zinc-950 px-3.5 py-2 font-mono text-xs text-lime-300">
                        {calc.formula}
                      </div>
                      {calc.breakdown && (
                        <pre className="mt-2 text-xs font-mono text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                          {calc.breakdown}
                        </pre>
                      )}
                      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                        💡 <strong>Key Takeaway:</strong> {calc.note}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* # SECTION 4: THE BIG PICTURE: HIGH-LEVEL ARCHITECTURE (HLD) */}
              <section id="hld" className="scroll-mt-24 space-y-6">
                <div className="border-b border-zinc-200 dark:border-white/[0.08] pb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-lime-500">
                    // SECTION 04
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1">
                    The Big Picture: High-Level Architecture (HLD)
                  </h2>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Here is the full architectural blueprint. A visitor clicking a link touches the fastest in-memory caching layer, while creators generating new links interact with an isolated token allocation service.
                </p>

                {/* Figure 1 Card */}
                <FigureCard figure={article.figures[0]} />

                {/* HLD Core Components Breakdown */}
                <div className="space-y-3">
                  <h3 className="font-display text-base font-black text-zinc-900 dark:text-white">
                    Breaking Down the Components
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {article.hldComponents.map((comp, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50/70 dark:bg-zinc-900/50 p-3.5"
                      >
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-lime-500" />
                          <span>{comp.name}</span>
                        </h4>
                        <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {comp.role}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* # SECTION 5: TWO LIFECYCLES: CREATION VS REDIRECTION */}
              <section id="request-flow" className="scroll-mt-24 space-y-6">
                <div className="border-b border-zinc-200 dark:border-white/[0.08] pb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-lime-500">
                    // SECTION 05
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1">
                    Two Lifecycles: Creating a Link vs. Redirecting
                  </h2>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  The golden rule in high-scale systems is <strong>separation of concerns</strong>. We never run URL creation and redirection on the same servers, because a sudden viral spike in clicks must never slow down link creation.
                </p>

                {/* Figure 2 Card */}
                <FigureCard figure={article.figures[1]} />

                {/* Pipeline Tabs (Write vs Read) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-white/[0.08] pb-2">
                    <button
                      type="button"
                      onClick={() => setActivePipeline("write")}
                      className={clsx(
                        "rounded-xl px-4 py-2 text-xs font-bold transition",
                        activePipeline === "write"
                          ? "bg-lime-400 text-slate-950 font-black shadow-xs"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                      )}
                    >
                      Write Pipeline (Short URL Creation)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePipeline("read")}
                      className={clsx(
                        "rounded-xl px-4 py-2 text-xs font-bold transition",
                        activePipeline === "read"
                          ? "bg-lime-400 text-slate-950 font-black shadow-xs"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                      )}
                    >
                      Read Pipeline (Sub-2ms Redirection)
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {(activePipeline === "write"
                      ? article.requestFlowSteps.writeFlow
                      : article.requestFlowSteps.readFlow
                    ).map((st) => (
                      <div
                        key={st.step}
                        className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50/70 dark:bg-zinc-900/50 p-4"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-mono text-xs font-black text-lime-600 dark:text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded">
                            {st.step}
                          </span>
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                            {st.title}
                          </h4>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {st.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* # SECTION 6: HOW WE STORE THE DATA (DATABASE SCHEMA) */}
              <section id="data-model" className="scroll-mt-24 space-y-6">
                <div className="border-b border-zinc-200 dark:border-white/[0.08] pb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-lime-500">
                    // SECTION 06
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1">
                    How We Store the Data: Database Schema Design
                  </h2>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {article.dataModel.rationale}
                </p>

                {/* Figure 3 Card */}
                <FigureCard figure={article.figures[2]} />

                {/* SQL Schema Tables */}
                <div className="space-y-6">
                  {article.dataModel.tables.map((tbl) => (
                    <div
                      key={tbl.name}
                      className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 shadow-sm"
                    >
                      <div className="border-b border-zinc-200 dark:border-white/[0.08] bg-zinc-50/80 dark:bg-zinc-950/40 px-5 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Database size={14} className="text-lime-500" />
                          <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">
                            Table: {tbl.name}
                          </span>
                        </div>
                        <span className="text-xs text-zinc-500">{tbl.description}</span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="border-b border-zinc-200 dark:border-white/[0.06] bg-zinc-100/50 dark:bg-zinc-800/40 text-[10px] uppercase font-bold text-zinc-500">
                            <tr>
                              <th className="py-2.5 px-4 font-mono">Column</th>
                              <th className="py-2.5 px-4 font-mono">Type</th>
                              <th className="py-2.5 px-4 font-mono">Constraint &amp; Index</th>
                              <th className="py-2.5 px-4">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100 dark:divide-white/[0.04]">
                            {tbl.columns.map((col) => (
                              <tr key={col.name} className="hover:bg-zinc-50/50 dark:hover:bg-white/[0.02]">
                                <td className="py-2.5 px-4 font-mono font-bold text-lime-600 dark:text-lime-400">
                                  {col.name}
                                </td>
                                <td className="py-2.5 px-4 font-mono text-zinc-600 dark:text-zinc-300">
                                  {col.type}
                                </td>
                                <td className="py-2.5 px-4 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                                  {col.constraint}
                                </td>
                                <td className="py-2.5 px-4 text-zinc-600 dark:text-zinc-400">
                                  {col.desc}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* # SECTION 7: REST API DESIGN & CONTRACTS */}
              <section id="api-design" className="scroll-mt-24 space-y-6">
                <div className="border-b border-zinc-200 dark:border-white/[0.08] pb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-lime-500">
                    // SECTION 07
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1">
                    REST API Design &amp; Contracts
                  </h2>
                </div>

                <div className="space-y-6">
                  {article.apis.map((api, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-5 shadow-sm space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={clsx(
                              "rounded-lg px-2.5 py-1 font-mono text-xs font-black",
                              api.method === "POST"
                                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                            )}
                          >
                            {api.method}
                          </span>
                          <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">
                            {api.endpoint}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-zinc-500">{api.title}</span>
                      </div>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400">{api.desc}</p>

                      {api.requestBody && (
                        <div>
                          <p className="text-[10px] font-mono font-bold uppercase text-zinc-400 mb-1.5">
                            Request Body (JSON):
                          </p>
                          <CodeSnippet code={api.requestBody} language="json" />
                        </div>
                      )}

                      {api.responseBody && (
                        <div>
                          <p className="text-[10px] font-mono font-bold uppercase text-zinc-400 mb-1.5">
                            Response Payload:
                          </p>
                          <CodeSnippet
                            code={api.responseBody}
                            language="json"
                            statusBadge={api.responseStatus}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* # SECTION 8: THE KEY SECRET: HOW 7 CHARACTERS GIVE 3.5 TRILLION URLS */}
              <section id="algorithms" className="scroll-mt-24 space-y-6">
                <div className="border-b border-zinc-200 dark:border-white/[0.08] pb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-lime-500">
                    // SECTION 08
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1">
                    The Key Secret: How 7 Characters Give 3.5 Trillion URLs
                  </h2>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  How do services like Bitly or TinyURL generate a short 7-character code that never repeats and never locks the database? Here is the math, followed by the comparison of three approaches.
                </p>

                {/* Figure 4 Card */}
                <FigureCard figure={article.figures[3]} />

                {/* Base62 Math Card */}
                <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/60 p-5 shadow-sm space-y-3">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <span className="text-lime-500 font-mono">01.</span>
                    <span>{article.algorithms.base62Math.title}</span>
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {article.algorithms.base62Math.explanation}
                  </p>
                  <pre className="rounded-xl bg-zinc-950 p-3.5 font-mono text-xs text-lime-300 leading-relaxed whitespace-pre-wrap">
                    {article.algorithms.base62Math.mathProof}
                  </pre>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    ✅ <strong>Verdict:</strong> {article.algorithms.base62Math.conclusion}
                  </p>
                </div>

                {/* Algorithm Approaches Comparison */}
                <div className="space-y-3">
                  <h3 className="font-display text-base font-black text-zinc-900 dark:text-white">
                    Three Ways to Generate Short Codes (And Why Only One Works at Scale)
                  </h3>
                  <div className="space-y-3">
                    {article.algorithms.approachesComparison.map((app, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-zinc-50/70 dark:bg-zinc-900/50 p-4 sm:p-5 space-y-2 text-xs"
                      >
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                          {app.approach}
                        </h4>
                        <p className="text-zinc-600 dark:text-zinc-300">{app.howItWorks}</p>
                        <div className="grid gap-2 sm:grid-cols-2 pt-1">
                          <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-800 dark:text-emerald-300">
                            <strong>Pros:</strong> {app.pros}
                          </div>
                          <div className="rounded-lg bg-red-500/10 p-2.5 text-red-800 dark:text-red-300">
                            <strong>Cons:</strong> {app.cons}
                          </div>
                        </div>
                        <p className="font-semibold text-zinc-700 dark:text-zinc-300 pt-1">
                          {app.verdict}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SOLID Principles */}
                <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/60 p-5 shadow-sm space-y-3">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    Writing Clean Code: SOLID Principles in URL Shortener Design
                  </h3>
                  <div className="space-y-2">
                    {article.algorithms.solidPrinciples.map((sp, idx) => (
                      <div key={idx} className="border-l-2 border-lime-500 pl-3 text-xs">
                        <strong className="text-zinc-900 dark:text-white block font-bold">
                          {sp.principle}
                        </strong>
                        <span className="text-zinc-600 dark:text-zinc-400">{sp.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* # SECTION 9: SCALING UP: REDIS, SHARDING & HTTP 302 */}
              <section id="scalability" className="scroll-mt-24 space-y-6">
                <div className="border-b border-zinc-200 dark:border-white/[0.08] pb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-lime-500">
                    // SECTION 09
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1">
                    Scaling Up: Redis Caching, Sharding &amp; HTTP 302
                  </h2>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  How does the system serve 60,000 requests per second without breaking a sweat? Here are the four crucial scaling decisions.
                </p>

                {/* Figure 5 Card */}
                <FigureCard figure={article.figures[4]} />

                {/* Scalability Engineering Notes */}
                <div className="space-y-3">
                  {article.scalabilityNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/60 p-4 sm:p-5 shadow-sm space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                          <span className="text-lime-500 font-bold">→</span>
                          <span>{note.title}</span>
                        </h4>
                        <span className="rounded-md border border-lime-500/30 bg-lime-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-lime-600 dark:text-lime-300">
                          {note.badge}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line pl-4">
                        {note.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* # SECTION 10: REAL-WORLD DISASTERS & EDGE CASES */}
              <section id="bottlenecks" className="scroll-mt-24 space-y-6">
                <div className="border-b border-zinc-200 dark:border-white/[0.08] pb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-lime-500">
                    // SECTION 10
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1">
                    Real-World Disasters &amp; Edge Cases (Cache Stampede, Phishing)
                  </h2>
                </div>

                <div className="space-y-4">
                  {article.bottlenecks.map((bn, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-zinc-50/70 dark:bg-zinc-900/50 p-4 sm:p-5 space-y-2 text-xs"
                    >
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                        <AlertTriangle size={15} className="text-amber-500" />
                        <span>{bn.problem}</span>
                      </h4>
                      <p className="text-red-700 dark:text-red-400 font-medium">
                        ⚠️ <strong>The Danger:</strong> {bn.impact}
                      </p>
                      <p className="text-emerald-800 dark:text-emerald-300 font-medium">
                        🛡️ <strong>How to Solve It:</strong> {bn.solution}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* # SECTION 11: INTERVIEW SUMMARY & KEY TAKEAWAYS */}
              <section id="checklist" className="scroll-mt-24 space-y-6">
                <div className="border-b border-zinc-200 dark:border-white/[0.08] pb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-lime-500">
                    // SECTION 11
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1">
                    System Design Interview Summary &amp; Key Takeaways
                  </h2>
                </div>

                <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/60 p-5 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Quick Mental Checklist (If Asked in an Interview)
                  </h3>
                  <div className="space-y-2">
                    {article.interviewSummary.keyTakeaways.map((takeaway, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 size={14} className="text-lime-500 shrink-0 mt-0.5" />
                        <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                          {takeaway}
                        </span>
                      </div>
                    ))}
                  </div>

                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white pt-3 border-t border-zinc-100 dark:border-white/[0.06]">
                    Core Architectural Trade-Offs (Why We Made Each Choice)
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {article.interviewSummary.tradeoffs.map((to, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-zinc-200 dark:border-white/[0.06] bg-zinc-50 dark:bg-zinc-950/40 p-3 text-xs"
                      >
                        <span className="font-bold text-zinc-900 dark:text-white block">
                          {to.topic}
                        </span>
                        <span className="mt-1 font-mono text-[11px] font-bold text-lime-600 dark:text-lime-400 block">
                          Choice: {to.winner}
                        </span>
                        <p className="mt-1 text-zinc-500 text-[11px]">{to.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* # BOTTOM NAVIGATION: PREVIOUS & NEXT SYSTEM */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-zinc-200 dark:border-white/[0.08]">
                {prevSystem ? (
                  <Link
                    to={`${baseRoute}/${prevSystem.id}`}
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
                  to={backUrl}
                  className="inline-flex items-center gap-2 rounded-xl bg-lime-300 text-slate-950 px-5 py-2.5 text-xs font-black uppercase tracking-wider hover:bg-lime-200 shadow-sm transition"
                >
                  {backLabel}
                </Link>

                {nextSystem ? (
                  <Link
                    to={`${baseRoute}/${nextSystem.id}`}
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
            </main>
          </div>
        </div>
      </article>
    </>
  );
}
