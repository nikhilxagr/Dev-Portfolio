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
  Zap,
  ListChecks,
  Server,
  Layers,
  Cpu,
  Compass,
} from "lucide-react";
import SeoHead from "@/components/seo/SeoHead";
import { createBreadcrumbSchema } from "@/utils/seo";

// Clean inline architecture diagram display
const DiagramCard = ({ src, alt, caption }) => {
  if (!src) return null;
  return (
    <figure className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/80 shadow-md">
      <div className="bg-zinc-950 p-4 sm:p-8 flex items-center justify-center min-h-[260px]">
        <img
          src={src}
          alt={alt || "Architecture diagram"}
          className="max-h-[500px] w-auto max-w-full rounded-xl object-contain shadow-lg"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="p-3.5 sm:p-4 border-t border-slate-100 dark:border-white/[0.06] text-xs text-slate-600 dark:text-zinc-400 font-medium leading-relaxed bg-slate-50/50 dark:bg-zinc-950/40">
          <span className="font-bold text-slate-900 dark:text-white mr-1.5">Figure:</span>
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

// 8 Clean, Focused Documentation Sections
const SECTIONS = [
  { id: "overview", number: "01", shortLabel: "Overview", label: "01. What is a URL Shortener?" },
  { id: "capacity", number: "02", shortLabel: "Capacity", label: "02. Traffic & Storage Sizing" },
  { id: "hld", number: "03", shortLabel: "Architecture", label: "03. High-Level Architecture (HLD)" },
  { id: "request-flow", number: "04", shortLabel: "Lifecycles", label: "04. Request Lifecycles" },
  { id: "algorithms", number: "05", shortLabel: "Base62 Math", label: "05. Base62 Math (3.5T URLs)" },
  { id: "data-model", number: "06", shortLabel: "Storage", label: "06. Database & Storage Strategy" },
  { id: "scalability", number: "07", shortLabel: "Redis Scaling", label: "07. Redis Caching & Scaling" },
  { id: "edge-cases", number: "08", shortLabel: "Edge Cases", label: "08. Edge Cases & Takeaways" },
];

export default function SystemDesignArticleView({
  system,
  article,
  prevSystem,
  nextSystem,
  backUrl = "/blog",
  backLabel = "Back to Engineering Docs",
  baseRoute = "/blog",
}) {
  const [activeTocId, setActiveTocId] = useState("overview");
  const [activePipeline, setActivePipeline] = useState("write");

  // Track active section for table of contents
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = SECTIONS.map((s) => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 220;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveTocId(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.pageYOffset - 110;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  const getNextSectionId = (currentId) => {
    const currentIndex = SECTIONS.findIndex((s) => s.id === currentId);
    if (currentIndex >= 0 && currentIndex < SECTIONS.length - 1) {
      return SECTIONS[currentIndex + 1];
    }
    return null;
  };

  return (
    <>
      <SeoHead
        title={`${article.title} | System Design Notes & Architecture Guide`}
        description="A clean, clear engineering guide to URL Shortener system design (TinyURL / Bitly): High-Level Design, Base62 math, request flows, Redis caching, and real-world trade-offs."
        pathname={`${baseRoute}/${system.id}`}
        keywords={[
          "URL Shortener System Design",
          "TinyURL Architecture",
          "Base62 Math",
          "Distributed Key Generation Service",
          "Redis Caching Strategy",
          "Nikhil Agrahari System Design",
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: article.title, url: `${baseRoute}/${system.id}` },
        ])}
      />

      <article className="relative overflow-hidden pt-6 pb-24 sm:pt-10 sm:pb-32 font-sans">
        {/* Subtle Ambient Glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/5 blur-[120px]" />
          <div className="absolute right-1/4 top-1/2 h-80 w-80 translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Bar Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <Link
              to={backUrl}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-zinc-900/70 px-4 py-2 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:border-lime-500 hover:text-slate-950 dark:hover:text-white transition shadow-xs"
            >
              <ArrowLeft size={14} />
              <span>{backLabel}</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-500/30 bg-lime-500/10 px-3 py-1 font-mono text-[10px] font-bold text-lime-600 dark:text-lime-300">
                <Clock size={11} />
                <span>10 min read</span>
              </span>
              <span className="rounded-full border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-zinc-800/80 px-3 py-1 font-mono text-[10px] font-bold text-slate-600 dark:text-zinc-300">
                System Design • HLD &amp; Architecture
              </span>
            </div>
          </div>

          {/* Article Header (Clean, High-Readability Typography) */}
          <header className="mb-10 max-w-4xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-lime-600 dark:text-lime-400">
                // SYSTEM ARCHITECTURE STUDY GUIDE
              </span>
              <span className="text-slate-300 dark:text-zinc-600">•</span>
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                Production-Ready Blueprint
              </span>
            </div>

            <h1 className="font-jakarta text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
              URL Shortener System Design (TinyURL / Bitly)
            </h1>

            {/* Simple 1 to 2 line definition */}
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-700 dark:text-zinc-300 font-normal">
              A URL shortener converts long, cumbersome web addresses into compact 7-character links and redirects visitors in under 2 milliseconds. At scale, it acts as a high-throughput, distributed key-value redirection engine serving billions of requests with zero collisions.
            </p>

            {/* Quick Author & Context Strip */}
            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-zinc-900/50 p-4 text-xs text-slate-600 dark:text-zinc-300 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-lime-500 animate-pulse" />
                <span className="font-bold text-slate-900 dark:text-white">Author:</span>
                <span>Nikhil Agrahari</span>
              </div>
              <span className="text-slate-300 dark:text-zinc-600 hidden sm:inline">•</span>
              <span className="text-slate-500 dark:text-zinc-400">Full-Stack &amp; Distributed Systems</span>
              <span className="text-slate-300 dark:text-zinc-600 hidden sm:inline">•</span>
              <span className="text-slate-500 dark:text-zinc-400">Core Concepts &amp; Architecture Notes</span>
            </div>
          </header>

          {/* STICKY HORIZONTAL SECTION BAR (Visible on all screens at all times) */}
          <div className="sticky top-16 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 mb-8 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-y border-slate-200 dark:border-white/[0.08] shadow-xs">
            <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
              <div className="flex items-center gap-2 shrink-0 text-slate-400 dark:text-zinc-500 font-mono text-[11px] font-bold uppercase tracking-wider hidden sm:flex">
                <Compass size={14} className="text-lime-500" />
                <span>Jump To:</span>
              </div>

              <div
                className="flex items-center gap-2 overflow-x-auto w-full py-0.5"
                style={{ scrollbarWidth: "none" }}
              >
                {SECTIONS.map((sec) => {
                  const isActive = activeTocId === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => scrollToSection(sec.id)}
                      className={clsx(
                        "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200 border",
                        isActive
                          ? "border-lime-500 bg-lime-400 text-slate-950 shadow-xs font-black"
                          : "border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.04] text-slate-600 dark:text-zinc-300 hover:border-lime-400/40 hover:text-slate-950 dark:hover:text-white"
                      )}
                    >
                      <span className="font-mono text-[10px] opacity-70 mr-1.5">{sec.number}</span>
                      <span>{sec.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TWO-COLUMN LAYOUT: STICKY TOC ON LEFT (ALWAYS VISIBLE ON DESKTOP) + CLEAN DOCS ON RIGHT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* STICKY SIDEBAR (Appears all the time as you scroll on desktop) */}
            <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-28 space-y-4">
              <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-zinc-900/60 p-4 shadow-sm backdrop-blur-md">
                <p className="font-jakarta text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <ListChecks size={14} className="text-lime-500" />
                  <span>Document Sections</span>
                </p>

                <nav className="space-y-1">
                  {SECTIONS.map((toc) => {
                    const isActive = activeTocId === toc.id;
                    return (
                      <button
                        key={toc.id}
                        type="button"
                        onClick={() => scrollToSection(toc.id)}
                        className={clsx(
                          "w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 block truncate",
                          isActive
                            ? "bg-lime-500/15 text-lime-700 dark:text-lime-300 font-bold border-l-2 border-lime-500 pl-2.5"
                            : "text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-zinc-100 hover:bg-slate-100/70 dark:hover:bg-zinc-800/50"
                        )}
                      >
                        {toc.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Quick Metrics Capsule */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-zinc-900/60 p-4 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2">
                  System Scale Targets
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-100 dark:border-white/[0.05] pb-1.5">
                    <span className="text-slate-500">Read QPS:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">~60,000/s Peak</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-white/[0.05] pb-1.5">
                    <span className="text-slate-500">Redirect Latency:</span>
                    <span className="font-mono font-bold text-lime-600 dark:text-lime-400">&lt; 2ms (RAM)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-white/[0.05] pb-1.5">
                    <span className="text-slate-500">5-Year Storage:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">~9.15 TB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Redis Cache:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">100 GB (Top 20%)</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* MAIN ARTICLE CONTENT */}
            <main className="lg:col-span-9 space-y-16">
              {/* # SECTION 01: THE CORE PROBLEM */}
              <section id="overview" className="scroll-mt-32 space-y-4">
                <div className="border-b border-slate-200 dark:border-white/[0.08] pb-3">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-lime-600 dark:text-lime-400">
                    // SECTION 01
                  </span>
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1">
                    What is a URL Shortener? (The Core Problem)
                  </h2>
                  {/* 1 to 2 line definition */}
                  <p className="mt-2 text-sm font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">
                    A URL shortener accepts any long destination URL, generates an ultra-compact 7-character alias, and redirects visitors in under 2 milliseconds while logging analytics in the background.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 mt-4">
                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/60 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-lime-600 dark:text-lime-400 font-bold text-sm">
                      <Zap size={16} />
                      <span>100:1 Read-Heavy</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      For every 1 link created by a user, over 100 people click on it. The system is overwhelmingly read-heavy, making in-memory caching the #1 performance priority.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/60 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
                      <Clock size={16} />
                      <span>Sub-2ms Redirection</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      Users expect immediate redirects. If redirection takes 200ms, the user experience suffers and marketing analytics time out.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/60 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                      <CheckCircle2 size={16} />
                      <span>Zero Collisions</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      Two different users shortening different URLs must never receive the same alias. Uniqueness is guaranteed at generation time.
                    </p>
                  </div>
                </div>

                {/* Next Section Button */}
                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => scrollToSection("capacity")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-lime-600 dark:text-lime-400 hover:underline"
                  >
                    <span>Next: 02. Traffic &amp; Storage Sizing</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </section>

              {/* # SECTION 02: CAPACITY ESTIMATION */}
              <section id="capacity" className="scroll-mt-32 space-y-6">
                <div className="border-b border-slate-200 dark:border-white/[0.08] pb-3">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-lime-600 dark:text-lime-400">
                    // SECTION 02
                  </span>
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1">
                    Sizing Up the System: Traffic &amp; Storage Sizing
                  </h2>
                  {/* 1 to 2 line definition */}
                  <p className="mt-2 text-sm font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Back-of-the-envelope calculations estimate that 1 Billion daily redirects and 10 Million new URLs require ~100 GB RAM for caching and ~9.15 TB disk storage over 5 years.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/60 p-4 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      Link Creation (Writes)
                    </p>
                    <p className="font-mono text-lg font-black text-slate-900 dark:text-white mt-1">
                      10M URLs / Day
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">~116 writes/sec (Peak: ~580/s)</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/60 p-4 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      Redirection Traffic (Reads)
                    </p>
                    <p className="font-mono text-lg font-black text-lime-600 dark:text-lime-400 mt-1">
                      1B Clicks / Day
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">~11,574 reads/sec (Peak: ~60k/s)</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/60 p-4 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      5-Year Storage &amp; RAM
                    </p>
                    <p className="font-mono text-lg font-black text-cyan-600 dark:text-cyan-400 mt-1">
                      9.15 TB &bull; 100 GB RAM
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Top 20% hot links cached in memory</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-slate-50/70 dark:bg-zinc-900/50 p-4 sm:p-5 text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white block font-bold mb-1">
                    💡 The 80/20 Pareto Principle in System Design:
                  </strong>
                  In production, 20% of the links generate 80% of all redirect traffic (viral posts, trending news, brand campaigns). By caching only this hot 20% in a 100 GB Redis cluster, over 80% to 90% of requests are resolved directly from fast RAM without ever touching the persistent disk database!
                </div>

                {/* Next Section Button */}
                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => scrollToSection("hld")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-lime-600 dark:text-lime-400 hover:underline"
                  >
                    <span>Next: 03. High-Level Architecture (HLD)</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </section>

              {/* # SECTION 03: HIGH-LEVEL ARCHITECTURE */}
              <section id="hld" className="scroll-mt-32 space-y-6">
                <div className="border-b border-slate-200 dark:border-white/[0.08] pb-3">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-lime-600 dark:text-lime-400">
                    // SECTION 03
                  </span>
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1">
                    High-Level Architecture (The Big Picture)
                  </h2>
                  {/* 1 to 2 line definition */}
                  <p className="mt-2 text-sm font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">
                    The architecture strictly decouples link generation from link redirection so that viral traffic spikes on existing links never block or slow down new link creation.
                  </p>
                </div>

                {/* Diagram 1: High Level Architecture */}
                <DiagramCard
                  src="/images/system-design/url-shortener-hld.webp"
                  alt="High-Level Architecture Diagram for URL Shortener"
                  caption="Global architecture: Clients access DNS/CDN edges, traffic is balanced across stateless app nodes, tokens are claimed from Key Generation Service (KGS), and redirects resolve in sub-2ms via Redis."
                />

                {/* 4 Core Component Cards */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50/70 dark:bg-zinc-900/50 p-4">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Server size={14} className="text-lime-500" />
                      <span>1. Global CDN &amp; Load Balancer</span>
                    </h4>
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      Terminates SSL/TLS connections at edge locations close to users and routes HTTP requests across stateless web application nodes.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50/70 dark:bg-zinc-900/50 p-4">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Cpu size={14} className="text-cyan-400" />
                      <span>2. Key Generation Service (KGS)</span>
                    </h4>
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      A standalone service that pre-computes unique 7-character tokens offline and keeps them in memory. Assigns tokens in microseconds with zero database lock contention.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50/70 dark:bg-zinc-900/50 p-4">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Zap size={14} className="text-emerald-500" />
                      <span>3. In-Memory Redis Cache Cluster</span>
                    </h4>
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      Stores the most active short-to-long URL mappings in RAM with Least Recently Used (LRU) eviction, answering over 90% of requests in ~1.2ms.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50/70 dark:bg-zinc-900/50 p-4">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Database size={14} className="text-amber-500" />
                      <span>4. Sharded Persistent Database</span>
                    </h4>
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      Distributed Key-Value or sharded relational database maintaining the source of truth for all URL records, creation timestamps, and ownership metadata.
                    </p>
                  </div>
                </div>

                {/* Next Section Button */}
                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => scrollToSection("request-flow")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-lime-600 dark:text-lime-400 hover:underline"
                  >
                    <span>Next: 04. Request Lifecycles</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </section>

              {/* # SECTION 04: REQUEST LIFECYCLES */}
              <section id="request-flow" className="scroll-mt-32 space-y-6">
                <div className="border-b border-slate-200 dark:border-white/[0.08] pb-3">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-lime-600 dark:text-lime-400">
                    // SECTION 04
                  </span>
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1">
                    Request Lifecycles: Creating a Link vs. Redirecting
                  </h2>
                  {/* 1 to 2 line definition */}
                  <p className="mt-2 text-sm font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Writing and reading follow two separate lifecycles: link creation claims a pre-allocated token from memory, while redirection resolves in under 2ms via Redis.
                  </p>
                </div>

                {/* Diagram 2: Request Flow */}
                <DiagramCard
                  src="/images/system-design/url-shortener-request-flow.webp"
                  alt="Request Flow Sequence for Creating and Redirecting URLs"
                  caption="Sequence diagram comparing the write path (token assignment, database write, cache warming) against the read path (cache hit, HTTP 302 redirect, async analytics logging)."
                />

                {/* Interactive Lifecycle Switcher */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/[0.08] pb-2">
                    <button
                      type="button"
                      onClick={() => setActivePipeline("write")}
                      className={clsx(
                        "rounded-xl px-4 py-2 text-xs font-bold transition",
                        activePipeline === "write"
                          ? "bg-lime-400 text-slate-950 font-black shadow-xs"
                          : "text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white"
                      )}
                    >
                      Creation Lifecycle (Write Path)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePipeline("read")}
                      className={clsx(
                        "rounded-xl px-4 py-2 text-xs font-bold transition",
                        activePipeline === "read"
                          ? "bg-lime-400 text-slate-950 font-black shadow-xs"
                          : "text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white"
                      )}
                    >
                      Redirection Lifecycle (Read Path)
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {activePipeline === "write" ? (
                      <>
                        <div className="rounded-xl border border-slate-200/80 dark:border-white/[0.06] bg-slate-50/70 dark:bg-zinc-900/50 p-4">
                          <span className="font-mono text-xs font-black text-lime-600 dark:text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded">
                            Step 1
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">
                            Submit Long Destination URL
                          </h4>
                          <p className="mt-1 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                            Client issues a POST request with the destination URL. Rate limiters and threat detection filters inspect the URL asynchronously.
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-200/80 dark:border-white/[0.06] bg-slate-50/70 dark:bg-zinc-900/50 p-4">
                          <span className="font-mono text-xs font-black text-lime-600 dark:text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded">
                            Step 2
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">
                            Assign Token from Memory
                          </h4>
                          <p className="mt-1 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                            The application server takes an unused 7-character Base62 key from its local pre-allocated KGS memory buffer. Zero database locks!
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-200/80 dark:border-white/[0.06] bg-slate-50/70 dark:bg-zinc-900/50 p-4">
                          <span className="font-mono text-xs font-black text-lime-600 dark:text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded">
                            Step 3
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">
                            Persist &amp; Warm Cache
                          </h4>
                          <p className="mt-1 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                            Saves the mapping to the persistent database and simultaneously writes to Redis so early clicks resolve immediately from RAM.
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-200/80 dark:border-white/[0.06] bg-slate-50/70 dark:bg-zinc-900/50 p-4">
                          <span className="font-mono text-xs font-black text-lime-600 dark:text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded">
                            Step 4
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">
                            Return Compact Short Link
                          </h4>
                          <p className="mt-1 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                            The user receives their short URL (e.g. <code>short.ly/aB3x9Qz</code>) in under 15ms.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="rounded-xl border border-slate-200/80 dark:border-white/[0.06] bg-slate-50/70 dark:bg-zinc-900/50 p-4">
                          <span className="font-mono text-xs font-black text-lime-600 dark:text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded">
                            Step 1
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">
                            Visitor Taps Short Link
                          </h4>
                          <p className="mt-1 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                            HTTP GET request for <code>short.ly/aB3x9Qz</code> arrives at the nearest edge load balancer.
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-200/80 dark:border-white/[0.06] bg-slate-50/70 dark:bg-zinc-900/50 p-4">
                          <span className="font-mono text-xs font-black text-lime-600 dark:text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded">
                            Step 2
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">
                            Instant Redis In-Memory Lookup
                          </h4>
                          <p className="mt-1 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                            Server checks Redis for key <code>aB3x9Qz</code>. Over 90% of requests hit the cache and resolve in under 1.2ms.
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-200/80 dark:border-white/[0.06] bg-slate-50/70 dark:bg-zinc-900/50 p-4">
                          <span className="font-mono text-xs font-black text-lime-600 dark:text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded">
                            Step 3
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">
                            HTTP 302 Redirection Sent
                          </h4>
                          <p className="mt-1 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                            Returns an HTTP 302 (Found) header with <code>Location: https://example.com/very/long/destination</code>.
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-200/80 dark:border-white/[0.06] bg-slate-50/70 dark:bg-zinc-900/50 p-4">
                          <span className="font-mono text-xs font-black text-lime-600 dark:text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded">
                            Step 4
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">
                            Asynchronous Analytics Logging
                          </h4>
                          <p className="mt-1 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                            Click metrics (country, browser, referrer) are emitted asynchronously to a message broker (Kafka/Queue) without delaying the redirect.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Next Section Button */}
                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => scrollToSection("algorithms")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-lime-600 dark:text-lime-400 hover:underline"
                  >
                    <span>Next: 05. Base62 Math (3.5T URLs)</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </section>

              {/* # SECTION 05: BASE62 MATH */}
              <section id="algorithms" className="scroll-mt-32 space-y-6">
                <div className="border-b border-slate-200 dark:border-white/[0.08] pb-3">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-lime-600 dark:text-lime-400">
                    // SECTION 05
                  </span>
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1">
                    The Key Secret: How 7 Characters Give 3.5 Trillion URLs
                  </h2>
                  {/* 1 to 2 line definition */}
                  <p className="mt-2 text-sm font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">
                    By combining letters [a-z, A-Z] and digits [0-9], we get 62 possible characters per slot, creating over 3.52 Trillion combinations in just 7 characters.
                  </p>
                </div>

                {/* Base62 Formula Card */}
                <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-5 shadow-sm space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="text-lime-500 font-mono">01.</span>
                    <span>The Math Behind Base62 Encoding</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                    Base62 uses 10 numbers [0-9] + 26 lowercase letters [a-z] + 26 uppercase letters [A-Z] = 62 characters. Unlike Base64, which contains &apos;+&apos; and &apos;/&apos; characters that require URL-encoding, every single Base62 character is 100% URL-safe without escape codes.
                  </p>
                  <div className="rounded-xl bg-zinc-950 p-4 font-mono text-xs text-lime-400 space-y-1">
                    <p className="text-slate-400">// Combinations Formula: 62^Length</p>
                    <p>&bull; 6 Characters: 62^6 = 56,800,235,584 (~56.8 Billion URLs)</p>
                    <p className="font-bold text-lime-300">&bull; 7 Characters: 62^7 = 3,521,614,606,208 (~3.52 Trillion URLs!)</p>
                    <p>&bull; 8 Characters: 62^8 = 218,340,105,584,896 (~218 Trillion URLs)</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    ✅ <strong>Verdict:</strong> A 7-character string gives 3.52 Trillion unique links. Even generating 10 Million new URLs every day, it takes more than <strong>964 years</strong> to exhaust the key space!
                  </p>
                </div>

                {/* Comparison of 3 Approaches */}
                <div className="space-y-3">
                  <h3 className="font-jakarta text-sm font-bold text-slate-900 dark:text-white">
                    Three Ways to Generate Short Codes (And Why KGS Wins)
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-4 text-xs">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                        1. MD5 Hash Truncation
                      </h4>
                      <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                        Hash the URL with MD5 and take the first 7 characters.
                      </p>
                      <p className="mt-2 text-red-600 dark:text-red-400 font-semibold">
                        ❌ Fatal Flaw: Hash Collisions! High write lock contention under concurrency.
                      </p>
                    </div>

                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4 text-xs">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                        2. Auto-Increment ID Base62
                      </h4>
                      <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                        Assign sequential numbers (1, 2, 3...) and convert to Base62.
                      </p>
                      <p className="mt-2 text-amber-600 dark:text-amber-400 font-semibold">
                        ⚠️ Flaw: Predictable sequences. Competitors can scrape all links in order.
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.05] p-4 text-xs">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                        3. Key Generation Service (KGS)
                      </h4>
                      <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                        Pre-generate random unique 7-char keys offline into key pools.
                      </p>
                      <p className="mt-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                        ✅ Production Choice: Guaranteed unique, instant microsecond token claiming.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Next Section Button */}
                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => scrollToSection("data-model")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-lime-600 dark:text-lime-400 hover:underline"
                  >
                    <span>Next: 06. Database &amp; Storage Strategy</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </section>

              {/* # SECTION 06: DATABASE & STORAGE STRATEGY */}
              <section id="data-model" className="scroll-mt-32 space-y-6">
                <div className="border-b border-slate-200 dark:border-white/[0.08] pb-3">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-lime-600 dark:text-lime-400">
                    // SECTION 06
                  </span>
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1">
                    How We Store the Data: Database &amp; Storage Strategy
                  </h2>
                  {/* 1 to 2 line definition */}
                  <p className="mt-2 text-sm font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Because URL shortening is purely key-to-value lookups with no table joins, distributed NoSQL or sharded relational databases provide high throughput and zero bottlenecks.
                  </p>
                </div>

                {/* Diagram 3: Data Model */}
                <DiagramCard
                  src="/images/system-design/url-shortener-data-model.webp"
                  alt="Database Schema & Data Model Diagram"
                  caption="Data model: Clean key-value mappings storing short code, destination URL, creator ID, expiration date, and aggregated click statistics."
                />

                {/* Database Architecture Breakdown */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/60 p-4 shadow-sm">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <Database size={15} className="text-lime-500" />
                      <span>What We Store in Every Record (~500 Bytes)</span>
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-400">
                      <li>&bull; <strong className="text-slate-800 dark:text-zinc-200">short_code:</strong> Unique 7-character string (Indexed B-Tree key)</li>
                      <li>&bull; <strong className="text-slate-800 dark:text-zinc-200">original_url:</strong> Destination link (up to 2,048 chars)</li>
                      <li>&bull; <strong className="text-slate-800 dark:text-zinc-200">user_id:</strong> Creator account identifier (nullable for anonymous links)</li>
                      <li>&bull; <strong className="text-slate-800 dark:text-zinc-200">created_at / expires_at:</strong> Timestamp for link lifespan &amp; TTL purging</li>
                      <li>&bull; <strong className="text-slate-800 dark:text-zinc-200">is_active:</strong> Soft-kill boolean flag to disable abusive URLs instantly</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/60 p-4 shadow-sm">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <Layers size={15} className="text-cyan-500" />
                      <span>NoSQL vs. Relational (SQL) Trade-Off</span>
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed mb-2">
                      Since we only do simple lookups like <code>GET original_url WHERE short_code = &apos;xyz&apos;</code> without relational foreign key joins:
                    </p>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      &bull; <strong>Distributed NoSQL / Key-Value</strong> (Cassandra, DynamoDB, MongoDB) scales horizontally with zero maintenance.<br />
                      &bull; <strong>Sharded SQL</strong> (PostgreSQL / MySQL) with consistent hashing on <code>short_code</code> also handles the 9 TB volume easily.
                    </p>
                  </div>
                </div>

                {/* Next Section Button */}
                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => scrollToSection("scalability")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-lime-600 dark:text-lime-400 hover:underline"
                  >
                    <span>Next: 07. Redis Caching &amp; Scaling</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </section>

              {/* # SECTION 07: SCALING WITH REDIS */}
              <section id="scalability" className="scroll-mt-32 space-y-6">
                <div className="border-b border-slate-200 dark:border-white/[0.08] pb-3">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-lime-600 dark:text-lime-400">
                    // SECTION 07
                  </span>
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1">
                    Scaling Up: Redis Caching &amp; Redirection Protocol
                  </h2>
                  {/* 1 to 2 line definition */}
                  <p className="mt-2 text-sm font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Following the 80/20 Pareto principle, caching the top 20% viral links in a Redis cluster absorbs over 90% of all redirect traffic directly from fast RAM in ~1.2ms.
                  </p>
                </div>

                {/* Diagram 4: Scalability Architecture */}
                <DiagramCard
                  src="/images/system-design/url-shortener-scalability.webp"
                  alt="System Scalability, Redis Caching & Sharding Architecture"
                  caption="Scalability topology: Traffic passes through global Edge CDNs to regional Redis in-memory clusters, while an asynchronous event stream logs analytics without adding latency."
                />

                {/* 3 Core Decisions */}
                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/60 p-4 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-lime-500" />
                        <span>1. Cache Eviction Policy: Redis LRU (Least Recently Used)</span>
                      </span>
                      <span className="font-mono text-[10px] text-lime-600 dark:text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded">
                        Cache-Aside
                      </span>
                    </h4>
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      When the 100 GB cache reaches capacity, Redis automatically discards the links that haven&apos;t been clicked recently. Popular links stay permanently in memory, serving users at lightning speed.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/60 p-4 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-cyan-400" />
                        <span>2. Redirection Status Code: HTTP 302 (Found) vs. HTTP 301</span>
                      </span>
                      <span className="font-mono text-[10px] text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                        Protocol Trade-Off
                      </span>
                    </h4>
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      <strong>HTTP 301 (Moved Permanently)</strong> is cached by the visitor&apos;s browser forever, meaning future clicks bypass your servers and analytics are lost. <strong>HTTP 302 (Found)</strong> forces every click to reach our servers, preserving 100% accurate click analytics and allowing link revocation.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/60 p-4 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span>3. Decoupled Click Analytics via Message Queue</span>
                      </span>
                      <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Zero Latency
                      </span>
                    </h4>
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      Updating click counters synchronously in the database on every click creates massive lock contention. Instead, web servers push a lightweight click event to an asynchronous queue (Kafka / RabbitMQ), which background workers batch-process without delaying user redirects.
                    </p>
                  </div>
                </div>

                {/* Next Section Button */}
                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => scrollToSection("edge-cases")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-lime-600 dark:text-lime-400 hover:underline"
                  >
                    <span>Next: 08. Edge Cases &amp; Takeaways</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </section>

              {/* # SECTION 08: EDGE CASES & TAKEAWAYS */}
              <section id="edge-cases" className="scroll-mt-32 space-y-6">
                <div className="border-b border-slate-200 dark:border-white/[0.08] pb-3">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-lime-600 dark:text-lime-400">
                    // SECTION 08
                  </span>
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1">
                    Real-World Edge Cases &amp; Key Takeaways
                  </h2>
                  {/* 1 to 2 line definition */}
                  <p className="mt-2 text-sm font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Production systems must withstand sudden cache stampedes, eliminate single points of failure on key generators, and actively block phishing abuse.
                  </p>
                </div>

                {/* 4 Edge Cases Cards */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50/70 dark:bg-zinc-900/50 p-4 space-y-2 text-xs">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-amber-500" />
                      <span>1. The Cache Stampede (Dog-Piling)</span>
                    </h4>
                    <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                      <strong>The Danger:</strong> When a viral short link with 100k requests/sec expires from Redis, all 100k concurrent requests miss the cache at the exact same millisecond and crash the database.
                    </p>
                    <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
                      🛡️ <strong>Solution:</strong> Use distributed mutex locks (Redlock) or XFetch probabilistic early expiration so only 1 worker queries the DB to refresh the cache.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50/70 dark:bg-zinc-900/50 p-4 space-y-2 text-xs">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-amber-500" />
                      <span>2. Single Point of Failure on KGS</span>
                    </h4>
                    <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                      <strong>The Danger:</strong> If the Key Generation Service goes down, new URL creation halts completely across the system.
                    </p>
                    <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
                      🛡️ <strong>Solution:</strong> Deploy an active-passive standby KGS replica with ZooKeeper, and have application servers maintain a buffer of 10,000 pre-fetched keys in local memory.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50/70 dark:bg-zinc-900/50 p-4 space-y-2 text-xs">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-amber-500" />
                      <span>3. Phishing Scams &amp; Malware Links</span>
                    </h4>
                    <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                      <strong>The Danger:</strong> Spammers shorten malicious phishing links to mask destination URLs and cause domain blacklisting.
                    </p>
                    <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
                      🛡️ <strong>Solution:</strong> Validate destination URLs against Google Safe Browsing API asynchronously and provide an instant soft-kill flag (<code>is_active = false</code>) to disable flagged links globally.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50/70 dark:bg-zinc-900/50 p-4 space-y-2 text-xs">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-amber-500" />
                      <span>4. Database Bloat from Expired Links</span>
                    </h4>
                    <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                      <strong>The Danger:</strong> Billions of abandoned or expired links bloat index sizes and degrade lookup query performance over time.
                    </p>
                    <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
                      🛡️ <strong>Solution:</strong> Use lazy deletion during lookup (if expired, delete immediately and return 404) and run nocturnal batch purge jobs during off-peak traffic hours.
                    </p>
                  </div>
                </div>

                {/* Final Checklist Card */}
                <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-5 shadow-sm space-y-3">
                  <h3 className="font-jakarta text-sm font-bold text-slate-900 dark:text-white">
                    Summary Checklist to Remember
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2 text-xs">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-lime-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-zinc-300">
                        <strong>Token Math:</strong> 62^7 gives 3.52 Trillion URLs (964 years of headroom).
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-lime-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-zinc-300">
                        <strong>KGS Key Pooling:</strong> Offline pre-generation eliminates database write locks.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-lime-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-zinc-300">
                        <strong>Redis Caching:</strong> 100 GB in-memory RAM handles 80-90% of all viral redirect traffic.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-lime-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-zinc-300">
                        <strong>HTTP 302 Protocol:</strong> Ensures full click tracking and analytics measurement.
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* BOTTOM NAVIGATION: PREVIOUS & NEXT SYSTEM */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200 dark:border-white/[0.08]">
                {prevSystem ? (
                  <Link
                    to={`${baseRoute}/${prevSystem.id}`}
                    className="group flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white transition"
                  >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <div className="text-left">
                      <span className="text-[9px] uppercase tracking-wider block text-slate-400">Previous</span>
                      <span>{prevSystem.title}</span>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                <Link
                  to={backUrl}
                  className="inline-flex items-center gap-2 rounded-xl bg-lime-400 text-slate-950 px-5 py-2.5 text-xs font-bold hover:bg-lime-300 shadow-sm transition"
                >
                  {backLabel}
                </Link>

                {nextSystem ? (
                  <Link
                    to={`${baseRoute}/${nextSystem.id}`}
                    className="group flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white transition"
                  >
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-wider block text-slate-400">Next</span>
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
