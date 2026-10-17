import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import {
  CheckCircle2,
  AlertTriangle,
  Database,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  Zap,
  Server,
  Layers,
  Cpu,
  Heart,
  MessageSquare,
  Trash2,
  Send,
  ExternalLink,
  Share2,
} from "lucide-react";
import SeoHead from "@/components/seo/SeoHead";
import { createBreadcrumbSchema } from "@/utils/seo";
import { useUserAuth } from "@/context/UserAuthContext";
import {
  getArticleInteractionsService,
  toggleArticleLikeService,
  addArticleCommentService,
  deleteArticleCommentService,
} from "@/services/articles.service";

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

// Real industry sources & further reading
const SOURCES = [
  {
    title: "Design a URL Shortener (TinyURL & Bitly Architecture)",
    publisher: "System Design Primer • Donne Martin",
    url: "https://github.com/donnemartin/system-design-primer",
  },
  {
    title: "The Bitly Architecture & URL Redirection at Scale",
    publisher: "High Scalability Distributed Systems",
    url: "http://highscalability.com/",
  },
  {
    title: "Redis Cache Eviction Strategies: LRU vs. LFU in Production",
    publisher: "Redis Official Documentation • In-Memory Systems",
    url: "https://redis.io/docs/latest/develop/reference/eviction/",
  },
  {
    title: "Distributed Unique ID Generation: Twitter Snowflake & KGS",
    publisher: "Distributed Systems Engineering Standards",
    url: "https://en.wikipedia.org/wiki/Snowflake_ID",
  },
  {
    title: "Database Indexing & B+ Trees for High Read Throughput",
    publisher: "Database Internals • O'Reilly Architecture",
    url: "https://www.databass.dev/",
  },
];

// Clean Documentation Sections for Right-Side "ON THIS PAGE" Navigation
const SECTIONS = [
  { id: "overview", label: "1. What is a URL Shortener?" },
  { id: "capacity", label: "2. Traffic & Storage Sizing" },
  { id: "hld", label: "3. High-Level Architecture (HLD)" },
  { id: "request-flow", label: "4. Request Lifecycles" },
  { id: "algorithms", label: "5. Base62 Math (3.5T URLs)" },
  { id: "data-model", label: "6. Database & Storage Strategy" },
  { id: "scalability", label: "7. Redis Caching & Scaling" },
  { id: "edge-cases", label: "8. Edge Cases & Takeaways" },
  { id: "sources", label: "9. Sources & Reading" },
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
  const { user, isLoggedIn, openSignInModal } = useUserAuth();
  const [activeTocId, setActiveTocId] = useState("overview");
  const [activePipeline, setActivePipeline] = useState("write");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Likes & Comments state
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copied, setCopied] = useState(false);

  const articleId = system?.id || "url_shortener";

  // Fetch real likes and comments on mount & auth state change
  useEffect(() => {
    let isMounted = true;
    getArticleInteractionsService(articleId).then((data) => {
      if (isMounted && data) {
        setLikesCount(data.likesCount || 0);
        setHasLiked(Boolean(data.hasLiked));
        setComments(data.comments || []);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [articleId, isLoggedIn]);

  // Reliable viewport-based scroll tracking for Table of Contents + Lenis integration
  useEffect(() => {
    const handleScroll = () => {
      // Show back to top button after 400px of scrolling
      setShowScrollTop(window.scrollY > 400);

      // Trigger point relative to viewport
      const triggerPoint = 200;
      let currentActive = SECTIONS[0].id;

      for (const sec of SECTIONS) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerPoint) {
            currentActive = sec.id;
          }
        }
      }
      setActiveTocId(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Also listen to Lenis scroll event for frame-accurate updates
    if (window.__activeLenis) {
      window.__activeLenis.on("scroll", handleScroll);
    }

    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (window.__activeLenis) {
        window.__activeLenis.off("scroll", handleScroll);
      }
    };
  }, []);

  const scrollToSection = (id) => {
    setActiveTocId(id);
    const el = document.getElementById(id);
    if (el) {
      if (window.__activeLenis) {
        window.__activeLenis.scrollTo(el, { offset: -90, duration: 0.6 });
      } else {
        const topOffset = el.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: topOffset, behavior: "smooth" });
      }
    }
  };

  // Like click handler: gates with login modal if user is not signed in
  const handleLikeClick = async () => {
    if (!isLoggedIn) {
      openSignInModal({
        title: "Sign in to Support",
        subtitle: "Sign in with Google or email to support this engineering article.",
      });
      return;
    }

    try {
      const res = await toggleArticleLikeService(articleId);
      if (res) {
        setHasLiked(res.hasLiked);
        setLikesCount(res.likesCount);
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  // Focus comment textarea: prompts sign in if not logged in
  const handleCommentFocus = () => {
    if (!isLoggedIn) {
      openSignInModal({
        title: "Sign In Required",
        subtitle: "Sign in with Google or email to join the discussion.",
      });
    }
  };

  // Submit comment handler: gates with login modal if user is not signed in
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      openSignInModal({
        title: "Sign In Required",
        subtitle: "Sign in with Google or email to join the discussion.",
      });
      return;
    }

    if (!commentInput.trim()) return;

    try {
      setSubmittingComment(true);
      const res = await addArticleCommentService(articleId, commentInput.trim());
      if (res?.comment) {
        setComments((prev) => [res.comment, ...prev]);
        setCommentInput("");
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteArticleCommentService(articleId, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const handleShareTwitter = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = encodeURIComponent(
      `Read "${article.title}" by Nikhil Agrahari — A deep dive into URL shortener architecture:`
    );
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleShareLinkedIn = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const formatCommentDate = (dateStr) => {
    if (!dateStr) return "Just now";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
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

      <article className="relative pt-6 pb-24 sm:pt-10 sm:pb-32 font-sans">
        {/* Subtle Ambient Glows with isolated overflow clipping to prevent breaking sticky elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/5 blur-[120px]" />
          <div className="absolute right-1/4 top-1/2 h-80 w-80 translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-[100px]" />
        </div>

        {/* Well-Aligned, Responsive Container (Balanced width, not overflowing whole screen) */}
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full">
          {/* Breadcrumb Navigation (Image 2 Style - Clean & Minimal) */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-zinc-500 mb-8">
            <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition">
              Home
            </Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-slate-900 dark:hover:text-white transition">
              Blog
            </Link>
            <span>/</span>
            <span className="text-slate-600 dark:text-zinc-300">Engineering Deep Dives</span>
          </nav>

          {/* Article Header (Image 2 Style - Broad, Bold, Editorial Sans Typography) */}
          <header className="mb-12 max-w-4xl">
            {/* Category Eyebrow without // */}
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400 mb-4">
              ENGINEERING DEEP DIVES
            </p>

            {/* Main Title */}
            <h1 className="font-jakarta text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.12] mb-5">
              URL Shortener System Design: A Complete Guide to Scalable Architecture
            </h1>

            {/* Subtitle / 1-2 Line Definition */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed font-normal max-w-3xl mb-6">
              How to design a scalable URL shortener like TinyURL or Bitly — handling 1 billion redirects daily with sub-2ms response times, zero key collisions, and resilient caching.
            </p>

            {/* Author, Date, Reading Time Metadata Row */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 dark:text-zinc-500 pb-8 border-b border-slate-200 dark:border-white/[0.08]">
              <span className="font-semibold text-slate-800 dark:text-zinc-200">Nikhil Agrahari</span>
              <span>•</span>
              <span>Oct 2026</span>
              <span>•</span>
              <span>10 min read</span>
            </div>
          </header>

          {/* Mobile / Tablet Quick Section Selector (Hidden on Desktop) */}
          <div className="lg:hidden sticky top-16 z-30 -mx-4 px-4 py-3 mb-8 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-y border-slate-200 dark:border-white/[0.08]">
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2">
              ON THIS PAGE
            </p>
            <div
              className="flex items-center gap-2 overflow-x-auto py-0.5"
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
                      "shrink-0 rounded-full px-3 py-1 text-xs font-medium border transition",
                      isActive
                        ? "border-lime-500 bg-lime-400 text-slate-950 font-bold"
                        : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400"
                    )}
                  >
                    {sec.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TWO-COLUMN LAYOUT: BALANCED MAIN CONTENT (LEFT) + ROCK-SOLID STICKY TOC (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
            {/* MAIN ARTICLE CONTENT (8 Columns for comfortable reading width) */}
            <main className="lg:col-span-8 space-y-16 min-w-0">
              {/* SECTION 1: THE CORE PROBLEM */}
              <section id="overview" className="scroll-mt-28 space-y-6">
                <div className="border-b border-slate-200 dark:border-white/[0.08] pb-4">
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                    1. What is a URL Shortener? (The Core Problem)
                  </h2>
                  <p className="mt-2 text-sm sm:text-base font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">
                    A URL shortener accepts any long destination URL, generates an ultra-compact 7-character alias, and redirects visitors in under 2 milliseconds while logging analytics in the background.
                  </p>
                </div>

                {/* Unified Architectural SLA & Non-Functional Requirements Showcase */}
                <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400">
                      Core System SLA &amp; Non-Functional Requirements
                    </span>
                    <span className="text-xs font-mono text-slate-400 dark:text-zinc-500">
                      Production Benchmarks
                    </span>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-lime-600 dark:text-lime-400 font-bold text-base">
                        <Zap size={18} />
                        <span>100:1 Read-to-Write Ratio</span>
                      </div>
                      <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                        For every 1 new URL created, over 100 people will click and resolve it. This extreme read-heavy skew dictates that our persistent database must almost never be queried directly on redirects. Fast in-memory caching is our #1 architectural mandate.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-cyan-500 font-bold text-base">
                        <Zap size={18} />
                        <span>Sub-2ms Redirection SLA</span>
                      </div>
                      <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                        Users demand instant page transitions. If redirection takes 200ms, marketing analytics drop off and perceived latency destroys UX. HTTP 302 redirects must resolve from RAM caches at the edge in under 2 milliseconds.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-emerald-500 font-bold text-base">
                        <CheckCircle2 size={18} />
                        <span>100% Collision-Free</span>
                      </div>
                      <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                        Two distinct users shortening different URLs must never receive the same alias. Uniqueness must be mathematically guaranteed at token generation time, without relying on expensive database write locks.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => scrollToSection("capacity")}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-lime-600 dark:text-lime-400 hover:underline"
                  >
                    <span>Next: 2. Traffic &amp; Storage Sizing</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </section>

              {/* SECTION 2: CAPACITY ESTIMATION */}
              <section id="capacity" className="scroll-mt-28 space-y-6">
                <div className="border-b border-slate-200 dark:border-white/[0.08] pb-4">
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                    2. Sizing Up the System: Traffic &amp; Storage Sizing
                  </h2>
                  <p className="mt-2 text-sm sm:text-base font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Back-of-the-envelope calculations estimate that 1 Billion daily redirects and 10 Million new URLs require ~100 GB RAM for caching and ~9.15 TB disk storage over 5 years.
                  </p>
                </div>

                {/* Sizing Metrics Display */}
                <div className="grid gap-5 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-2">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      Link Creation (Writes)
                    </p>
                    <p className="font-mono text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      10M URLs / Day
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 font-medium">
                      ~116 writes/sec &bull; <span className="text-amber-500 font-semibold">Peak: ~580 writes/sec</span>
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-2">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      Redirection Traffic (Reads)
                    </p>
                    <p className="font-mono text-2xl sm:text-3xl font-black text-lime-600 dark:text-lime-400">
                      1B Clicks / Day
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 font-medium">
                      ~11,574 reads/sec &bull; <span className="text-lime-500 font-semibold">Peak: ~60,000 reads/sec</span>
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-2">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      5-Year Capacity Budget
                    </p>
                    <p className="font-mono text-2xl sm:text-3xl font-black text-cyan-500">
                      9.15 TB &bull; 100 GB RAM
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 font-medium">
                      18.25 Billion total links &bull; 500 bytes/row
                    </p>
                  </div>
                </div>

                {/* Mathematical Derivation Callout Box */}
                <div className="border-l-4 border-lime-400 bg-slate-50/80 dark:bg-zinc-900/50 p-6 rounded-r-2xl text-sm sm:text-base text-slate-700 dark:text-zinc-300 leading-relaxed shadow-sm space-y-2">
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>The 80/20 Pareto Mathematical Derivation for Cache Memory:</span>
                  </h4>
                  <p>
                    In real-world web traffic, <strong>20% of the links generate 80% of all redirect traffic</strong> (viral campaigns, breaking news, social bios).
                  </p>
                  <p className="font-mono text-xs sm:text-sm bg-zinc-950 p-3.5 rounded-xl text-lime-400 border border-white/5">
                    1 Billion clicks/day &times; 500 bytes per URL mapping = 500 GB total daily data.<br />
                    Caching the top 20% hot links = 500 GB &times; 0.20 = <strong>100 GB RAM required in Redis!</strong>
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
                    By dedicating 100 GB of RAM across a small Redis cluster, over 80% to 90% of all global user requests resolve directly from in-memory cache without ever touching persistent database disks.
                  </p>
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => scrollToSection("hld")}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-lime-600 dark:text-lime-400 hover:underline"
                  >
                    <span>Next: 3. High-Level Architecture (HLD)</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </section>

              {/* SECTION 3: HIGH-LEVEL ARCHITECTURE */}
              <section id="hld" className="scroll-mt-28 space-y-6">
                <div className="border-b border-slate-200 dark:border-white/[0.08] pb-4">
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                    3. High-Level Architecture (The Big Picture)
                  </h2>
                  <p className="mt-2 text-sm sm:text-base font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">
                    The architecture strictly decouples link generation from link redirection so that viral traffic spikes on existing links never block or slow down new link creation.
                  </p>
                </div>

                {/* Callout Box */}
                <div className="border-l-4 border-lime-400 bg-slate-50/80 dark:bg-zinc-900/50 p-6 rounded-r-2xl text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed shadow-sm space-y-1.5">
                  <strong className="text-base sm:text-lg font-bold text-slate-900 dark:text-white block">
                    Decoupled Read &amp; Write Architecture
                  </strong>
                  <p>
                    Link generation (writes) and link redirection (reads) operate on completely isolated microservices and infrastructure pipelines. A sudden viral surge on a celebrity tweet will hammer edge caches and read replicas, but will never consume write-lock capacity or delay users shortening new URLs.
                  </p>
                </div>

                {/* Diagram 1: High Level Architecture */}
                <DiagramCard
                  src="/images/system-design/url-shortener-hld.webp"
                  alt="High-Level Architecture Diagram for URL Shortener"
                  caption="Global architecture: Clients access DNS/CDN edges, traffic is balanced across stateless app nodes, tokens are claimed from Key Generation Service (KGS), and redirects resolve in sub-2ms via Redis."
                />

                {/* 4 Core Component Cards */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-3">
                    <h4 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-lime-500/10 text-lime-500 flex items-center justify-center shrink-0">
                        <Server size={18} />
                      </div>
                      <span>1. Global CDN &amp; Load Balancer</span>
                    </h4>
                    <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                      Anycast DNS directs incoming client traffic to the nearest geographic edge location. Edge nodes terminate SSL/TLS handshakes close to visitors, absorb DDoS traffic, and route requests across stateless application clusters using round-robin load balancing with continuous health checks.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-3">
                    <h4 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                        <Cpu size={18} />
                      </div>
                      <span>2. Key Generation Service (KGS)</span>
                    </h4>
                    <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                      A standalone background service that pre-computes unique 7-character Base62 keys offline and maintains fast in-memory key pools. Application servers request keys in batches (e.g. 1,000 keys at once), minting short URLs in microseconds with zero database lock contention.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-3">
                    <h4 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Zap size={18} />
                      </div>
                      <span>3. In-Memory Redis Cache Cluster</span>
                    </h4>
                    <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                      Distributed Redis cluster configured with the Cache-Aside pattern and LRU eviction. Caching the top 20% hot links allows over 90% of all redirect requests to resolve in sub-2ms directly from RAM without touching persistent disk storage.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-3">
                    <h4 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                        <Database size={18} />
                      </div>
                      <span>4. Sharded Persistent Database</span>
                    </h4>
                    <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                      Distributed Key-Value store (Cassandra / DynamoDB) or sharded PostgreSQL cluster partitioned on the hash of <code>short_code</code>. Provides durable persistence for billions of URL mappings, creation timestamps, and user ownership metadata.
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => scrollToSection("request-flow")}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-lime-600 dark:text-lime-400 hover:underline"
                  >
                    <span>Next: 4. Request Lifecycles</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </section>

              {/* SECTION 4: REQUEST LIFECYCLES */}
              <section id="request-flow" className="scroll-mt-28 space-y-6">
                <div className="border-b border-slate-200 dark:border-white/[0.08] pb-4">
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                    4. Request Lifecycles: Creating a Link vs. Redirecting
                  </h2>
                  <p className="mt-2 text-sm sm:text-base font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">
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
                <div className="space-y-5">
                  <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/[0.08] pb-3">
                    <button
                      type="button"
                      onClick={() => setActivePipeline("write")}
                      className={clsx(
                        "rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition",
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
                        "rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition",
                        activePipeline === "read"
                          ? "bg-lime-400 text-slate-950 font-black shadow-xs"
                          : "text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white"
                      )}
                    >
                      Redirection Lifecycle (Read Path)
                    </button>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {activePipeline === "write" ? (
                      <>
                        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-2.5">
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400 bg-lime-500/10 px-2.5 py-1 rounded-md inline-block">
                            Step 1
                          </span>
                          <h4 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                            Submit Long Destination URL
                          </h4>
                          <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                            Client issues an HTTP POST request containing the destination URL. Rate limiters check user quotas and threat detection filters inspect the URL asynchronously.
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-2.5">
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400 bg-lime-500/10 px-2.5 py-1 rounded-md inline-block">
                            Step 2
                          </span>
                          <h4 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                            Microsecond Token Claim from Memory
                          </h4>
                          <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                            The application server claims an unused 7-character Base62 key directly from its local pre-allocated KGS memory buffer. Guaranteed zero database locks and zero hashing!
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-2.5">
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400 bg-lime-500/10 px-2.5 py-1 rounded-md inline-block">
                            Step 3
                          </span>
                          <h4 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                            Persist &amp; Warm Cache Simultaneously
                          </h4>
                          <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                            Saves the mapping to the persistent database and simultaneously primes the Redis cache so initial clicks resolve immediately in sub-2ms from fast RAM.
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-2.5">
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400 bg-lime-500/10 px-2.5 py-1 rounded-md inline-block">
                            Step 4
                          </span>
                          <h4 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                            Return Compact Short Link
                          </h4>
                          <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                            The user receives their compact short URL (e.g. <code>short.ly/aB3x9Qz</code>) with an HTTP 201 Created status in under 15 milliseconds.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-2.5">
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400 bg-lime-500/10 px-2.5 py-1 rounded-md inline-block">
                            Step 1
                          </span>
                          <h4 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                            Visitor Taps Short Link at Edge
                          </h4>
                          <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                            An HTTP GET request for <code>short.ly/aB3x9Qz</code> arrives at the nearest Anycast edge load balancer and routes to the closest application cluster.
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-2.5">
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400 bg-lime-500/10 px-2.5 py-1 rounded-md inline-block">
                            Step 2
                          </span>
                          <h4 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                            Instant Redis In-Memory Lookup
                          </h4>
                          <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                            Server checks Redis for key <code>aB3x9Qz</code>. Over 90% of requests hit the cache and resolve in under 1.2ms without touching persistent disks.
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-2.5">
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400 bg-lime-500/10 px-2.5 py-1 rounded-md inline-block">
                            Step 3
                          </span>
                          <h4 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                            HTTP 302 Redirection Dispatched
                          </h4>
                          <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                            Returns an HTTP 302 (Found) header with <code>Location: https://example.com/destination</code>, instructing the browser to navigate instantly.
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-2.5">
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400 bg-lime-500/10 px-2.5 py-1 rounded-md inline-block">
                            Step 4
                          </span>
                          <h4 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                            Asynchronous Click Stream to Kafka
                          </h4>
                          <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                            Click metrics (country, IP, browser, referrer) are emitted asynchronously to a message broker (Kafka / Queue) without adding even 1 millisecond of delay to the redirect.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => scrollToSection("algorithms")}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-lime-600 dark:text-lime-400 hover:underline"
                  >
                    <span>Next: 5. Base62 Math (3.5T URLs)</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </section>

              {/* SECTION 5: BASE62 MATH */}
              <section id="algorithms" className="scroll-mt-28 space-y-6">
                <div className="border-b border-slate-200 dark:border-white/[0.08] pb-4">
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                    5. The Key Secret: How 7 Characters Give 3.5 Trillion URLs
                  </h2>
                  <p className="mt-2 text-sm sm:text-base font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">
                    By combining letters [a-z, A-Z] and digits [0-9], we get 62 possible characters per slot, creating over 3.52 Trillion combinations in just 7 characters.
                  </p>
                </div>

                {/* Base62 Formula Card */}
                <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-8 shadow-sm space-y-4">
                  <h3 className="font-jakarta text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                    <span className="text-lime-500 font-mono font-black">01.</span>
                    <span>The Mathematical Foundation of Base62 Encoding</span>
                  </h3>
                  <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                    Base62 utilizes 10 digits [0–9] + 26 lowercase characters [a–z] + 26 uppercase characters [A–Z] = 62 characters. Unlike Base64, which contains &apos;+&apos; and &apos;/&apos; characters that require URL percent-encoding (<code>%2B</code> and <code>%2F</code>), every single character in Base62 is 100% URL-safe per RFC 3986 without escaping or padding characters.
                  </p>

                  <div className="rounded-2xl bg-zinc-950 p-5 sm:p-6 font-mono text-sm sm:text-base text-zinc-300 space-y-2 border border-white/5">
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Combinations Permutations Formula: 62^Length</p>
                    <p className="text-zinc-400">&bull; 6 Characters: 62^6 = 56,800,235,584 (~56.8 Billion URLs)</p>
                    <p className="font-bold text-lime-400 bg-lime-400/10 px-3 py-1.5 rounded-lg border border-lime-500/20">
                      &bull; 7 Characters: 62^7 = 3,521,614,606,208 (~3.52 Trillion URLs!)
                    </p>
                    <p className="text-zinc-400">&bull; 8 Characters: 62^8 = 218,340,105,584,896 (~218 Trillion URLs)</p>
                  </div>

                  <div className="border-l-4 border-lime-400 bg-lime-500/5 p-4 sm:p-5 rounded-r-xl text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>✅ Verdict &amp; Headroom Calculation:</span>
                    </p>
                    <p>
                      At a rapid creation velocity of <strong>10 Million newly generated URLs every single day</strong>:
                    </p>
                    <p className="font-mono text-xs sm:text-sm text-lime-600 dark:text-lime-400 font-bold">
                      3,521,614,606,208 &divide; (10,000,000 &times; 365) = 964.8 Years to exhaust the key space!
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
                      Seven characters provide an essentially infinite address space for nearly a millennium without increasing URL length or memory footprint.
                    </p>
                  </div>
                </div>

                {/* Comparison of 3 Approaches */}
                <div className="space-y-4 pt-2">
                  <h3 className="font-jakarta text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Three Ways to Generate Short Codes (And Why KGS Wins)
                  </h3>

                  <div className="space-y-4">
                    {/* Strategy 1 */}
                    <div className="rounded-2xl border border-rose-500/25 bg-rose-500/[0.03] dark:bg-rose-500/[0.04] p-6 sm:p-7 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                          1. MD5 / SHA-256 Hash Truncation
                        </h4>
                        <span className="font-mono text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md">
                          ❌ Fatal Flaw: Hash Collisions
                        </span>
                      </div>
                      <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                        <strong>The Mechanism:</strong> Compute the MD5 hash of the destination URL and take the first 7 characters.
                      </p>
                      <p className="text-sm sm:text-[15px] text-rose-700 dark:text-rose-300/90 leading-relaxed">
                        <strong>Why It Fails in Production:</strong> Distinct URLs inevitably produce the same 7-character prefix (Birthday Paradox). To detect collisions, the system must execute <code>SELECT id FROM urls WHERE short_code = ?</code> before every insertion. If taken, it appends a counter and re-hashes. Under 500+ writes/second, this causes severe database read-before-write lock contention and latency spikes.
                      </p>
                    </div>

                    {/* Strategy 2 */}
                    <div className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.03] dark:bg-amber-500/[0.04] p-6 sm:p-7 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                          2. Auto-Increment Database ID to Base62
                        </h4>
                        <span className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md">
                          ⚠️ Flaw: Predictable Sequences &amp; Scraping
                        </span>
                      </div>
                      <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                        <strong>The Mechanism:</strong> Assign sequential integer IDs (1, 2, 3... 100,000,001) in SQL and convert the integer to Base62.
                      </p>
                      <p className="text-sm sm:text-[15px] text-amber-700 dark:text-amber-300/90 leading-relaxed">
                        <strong>Why It Fails in Production:</strong> Sequential IDs make short URLs completely predictable. Competitors or malicious scrapers can easily crawl every link on your platform (<code>short.ly/1</code>, <code>short.ly/2</code>), exposing private or unlisted destination URLs. Furthermore, synchronizing an auto-increment counter across distributed multi-region databases causes severe coordination bottlenecks.
                      </p>
                    </div>

                    {/* Strategy 3 */}
                    <div className="rounded-2xl border border-emerald-500/35 bg-emerald-500/[0.05] dark:bg-emerald-500/[0.06] p-6 sm:p-7 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                          3. Key Generation Service (KGS) with Key Pooling
                        </h4>
                        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-md">
                          🏆 Production Choice: Microsecond Token Claiming
                        </span>
                      </div>
                      <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                        <strong>The Mechanism:</strong> An offline standalone service pre-generates billions of random unique 7-character Base62 keys and stores them in high-speed key pools (divided into <code>available_keys</code> and <code>assigned_keys</code>).
                      </p>
                      <p className="text-sm sm:text-[15px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                        <strong>Why It Wins:</strong> Application servers pull pre-allocated batches of keys (e.g. 10,000 keys) into local RAM. When a user creates a link, a key is claimed in microseconds. <strong>Zero hashing, zero collision checking, zero database write locks, and 100% unpredictable aliases.</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => scrollToSection("data-model")}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-lime-600 dark:text-lime-400 hover:underline"
                  >
                    <span>Next: 6. Database &amp; Storage Strategy</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </section>

              {/* SECTION 6: DATABASE & STORAGE STRATEGY */}
              <section id="data-model" className="scroll-mt-28 space-y-6">
                <div className="border-b border-slate-200 dark:border-white/[0.08] pb-4">
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                    6. How We Store the Data: Database &amp; Storage Strategy
                  </h2>
                  <p className="mt-2 text-sm sm:text-base font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">
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
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-3">
                    <h3 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-lime-500/10 text-lime-500 flex items-center justify-center shrink-0">
                        <Database size={18} />
                      </div>
                      <span>Optimized Schema (~500 Bytes per Record)</span>
                    </h3>
                    <ul className="space-y-2 text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                      <li>
                        &bull; <strong className="text-slate-900 dark:text-white font-mono">short_code (VARCHAR 7):</strong> Primary Key. Indexed B+ Tree key for instant O(log N) point lookup.
                      </li>
                      <li>
                        &bull; <strong className="text-slate-900 dark:text-white font-mono">original_url (VARCHAR 2048):</strong> Destination URL (RFC 7230 maximum standard URL length).
                      </li>
                      <li>
                        &bull; <strong className="text-slate-900 dark:text-white font-mono">user_id (BIGINT):</strong> Creator account ID for link management, custom aliases, and rate limits.
                      </li>
                      <li>
                        &bull; <strong className="text-slate-900 dark:text-white font-mono">created_at / expires_at:</strong> Epoch timestamps for link lifespan and nocturnal TTL purge jobs.
                      </li>
                      <li>
                        &bull; <strong className="text-slate-900 dark:text-white font-mono">is_active (BOOLEAN):</strong> Soft-kill flag to immediately disable phishing or abusive links globally.
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-3">
                    <h3 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                        <Layers size={18} />
                      </div>
                      <span>NoSQL vs. Relational (SQL) Trade-Off</span>
                    </h3>
                    <div className="space-y-2.5 text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                      <p>
                        Since URL shortening involves pure point lookups (<code>GET original_url WHERE short_code = &apos;xyz&apos;</code>) with zero multi-table relational joins:
                      </p>
                      <p>
                        &bull; <strong className="text-slate-900 dark:text-white">Distributed NoSQL / Key-Value</strong> (Cassandra, DynamoDB, MongoDB) provides predictable sub-5ms read latencies, automatic horizontal partitioning, and masterless multi-region replication.
                      </p>
                      <p>
                        &bull; <strong className="text-slate-900 dark:text-white">Sharded Relational SQL</strong> (PostgreSQL / MySQL) partitioned on consistent hash of <code>short_code</code> is also a battle-tested choice that effortlessly accommodates 9.15 TB of data.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => scrollToSection("scalability")}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-lime-600 dark:text-lime-400 hover:underline"
                  >
                    <span>Next: 7. Redis Caching &amp; Scaling</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </section>

              {/* SECTION 7: SCALING WITH REDIS */}
              <section id="scalability" className="scroll-mt-28 space-y-6">
                <div className="border-b border-slate-200 dark:border-white/[0.08] pb-4">
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                    7. Scaling Up: Redis Caching &amp; Redirection Protocol
                  </h2>
                  <p className="mt-2 text-sm sm:text-base font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">
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
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-lime-500" />
                        <span>1. Cache Eviction Policy: Redis LRU (Least Recently Used)</span>
                      </h4>
                      <span className="font-mono text-xs font-semibold text-lime-600 dark:text-lime-400 bg-lime-500/10 px-2.5 py-1 rounded-md">
                        Cache-Aside Pattern
                      </span>
                    </div>
                    <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                      Application servers check Redis first. On a cache miss, the record is fetched from the database and written to Redis with a TTL. When the 100 GB memory budget is reached, Redis automatically evicts the least recently accessed keys (<code>allkeys-lru</code>). Hot, viral links stay permanently in memory, serving users at sub-2ms speeds.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                        <span>2. Redirection Status Code: HTTP 302 (Found) vs. HTTP 301</span>
                      </h4>
                      <span className="font-mono text-xs font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md">
                        Protocol Trade-Off
                      </span>
                    </div>
                    <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                      <strong>HTTP 301 (Moved Permanently)</strong> is cached by the visitor&apos;s browser locally forever, meaning future clicks bypass your servers and analytics are permanently lost. <strong>HTTP 302 (Found / Temporary)</strong> forces every click to reach our servers, preserving 100% accurate click analytics, geolocation tracking, and allowing instant revocation of malicious links.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        <span>3. Decoupled Click Analytics via Distributed Event Streaming</span>
                      </h4>
                      <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                        Zero Latency Overhead
                      </span>
                    </div>
                    <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                      Incrementing click counters synchronously in the database on every redirect creates massive lock contention and degrades throughput. Instead, web servers emit a compact click event to an asynchronous stream (Apache Kafka / RabbitMQ), which background consumers batch-process out-of-band without delaying user redirects.
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => scrollToSection("edge-cases")}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-lime-600 dark:text-lime-400 hover:underline"
                  >
                    <span>Next: 8. Edge Cases &amp; Takeaways</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </section>

              {/* SECTION 8: EDGE CASES & TAKEAWAYS */}
              <section id="edge-cases" className="scroll-mt-28 space-y-6">
                <div className="border-b border-slate-200 dark:border-white/[0.08] pb-4">
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                    8. Real-World Disasters &amp; Key Takeaways
                  </h2>
                  <p className="mt-2 text-sm sm:text-base font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Production systems must withstand sudden cache stampedes, eliminate single points of failure on key generators, and actively block phishing abuse.
                  </p>
                </div>

                {/* 4 Spacious Production Disaster Scenarios */}
                <div className="space-y-4">
                  {/* Disaster 1 */}
                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                        <span>1. The Cache Stampede (Dog-Piling / Thundering Herd)</span>
                      </h4>
                      <span className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md">
                        High Availability Risk
                      </span>
                    </div>
                    <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                      <strong>The Danger:</strong> When a viral short link with 100,000 requests/sec expires from Redis, all 100k concurrent requests miss the cache at the exact same millisecond and hammer the persistent database simultaneously. This causes database connection pool exhaustion, 100% CPU spikes, and cascade failure across the entire cluster.
                    </p>
                    <div className="border-l-4 border-emerald-500 bg-emerald-500/[0.05] p-4 rounded-r-xl text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed space-y-1.5">
                      <strong className="text-emerald-700 dark:text-emerald-400 font-bold block">
                        🛡️ Production Mitigation:
                      </strong>
                      <p>
                        &bull; <strong>Distributed Mutex Lock (Redlock):</strong> When a cache miss occurs, only the first request acquires an atomic distributed lock in Redis to query the database and re-populate the cache, while concurrent requests wait 20ms or receive the stale cached copy.
                      </p>
                      <p>
                        &bull; <strong>XFetch Probabilistic Early Expiration:</strong> Workers recompute and refresh the cache before it actually expires based on read frequency and computation time: <code>-(β &times; delta &times; ln(random())) &gt; (expiry - now)</code>.
                      </p>
                    </div>
                  </div>

                  {/* Disaster 2 */}
                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                        <span>2. Single Point of Failure (SPOF) on Key Generation Service (KGS)</span>
                      </h4>
                      <span className="font-mono text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md">
                        Write Pipeline SPOF
                      </span>
                    </div>
                    <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                      <strong>The Danger:</strong> If the standalone KGS instance goes down or experiences a network partition, new short URL creation halts completely across the system. If multiple uncoordinated KGS replicas are deployed, they can generate duplicate keys and corrupt user links.
                    </p>
                    <div className="border-l-4 border-emerald-500 bg-emerald-500/[0.05] p-4 rounded-r-xl text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed space-y-1.5">
                      <strong className="text-emerald-700 dark:text-emerald-400 font-bold block">
                        🛡️ Production Mitigation:
                      </strong>
                      <p>
                        &bull; <strong>Active-Passive Standby with Apache ZooKeeper / Raft:</strong> ZooKeeper monitors the primary KGS via continuous heartbeats. If the primary drops offline, an ephemeral node vanishes and ZooKeeper automatically promotes the passive standby replica in under 50ms.
                      </p>
                      <p>
                        &bull; <strong>Application-Side Key Buffers:</strong> Application web servers pre-fetch and maintain an in-memory buffer of 10,000 unused keys. If KGS temporarily goes down for maintenance or failover, web servers continue minting new URLs uninterrupted for several minutes without user impact.
                      </p>
                    </div>
                  </div>

                  {/* Disaster 3 */}
                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                        <span>3. Phishing Scams, Malware Links &amp; Domain Blacklisting</span>
                      </h4>
                      <span className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md">
                        Reputation Threat
                      </span>
                    </div>
                    <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                      <strong>The Danger:</strong> Malicious actors exploit shorteners to mask phishing sites, ransomware downloads, and credential harvesters. If Google Safe Browsing or Spamhaus blacklists the shortener root domain, all millions of legitimate customer links across the platform are blocked in Chrome and Safari.
                    </p>
                    <div className="border-l-4 border-emerald-500 bg-emerald-500/[0.05] p-4 rounded-r-xl text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed space-y-1.5">
                      <strong className="text-emerald-700 dark:text-emerald-400 font-bold block">
                        🛡️ Production Mitigation:
                      </strong>
                      <p>
                        &bull; <strong>Asynchronous Threat Inspection Pipeline:</strong> Destination URLs are emitted to an async Kafka queue where workers validate URLs against Google Safe Browsing API, VirusTotal, and URLhaus before public routing.
                      </p>
                      <p>
                        &bull; <strong>Instant Global Soft-Kill Switch:</strong> The database schema contains an <code>is_active: false</code> flag. If a link is reported or flagged, setting <code>is_active = false</code> in Redis immediately stops redirection and displays a warning screen without expensive database deletions.
                      </p>
                    </div>
                  </div>

                  {/* Disaster 4 */}
                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                        <span>4. Database Bloat, Index Fragmentation &amp; Zombie Links</span>
                      </h4>
                      <span className="font-mono text-xs font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md">
                        Storage Optimization
                      </span>
                    </div>
                    <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                      <strong>The Danger:</strong> After 5 years, over 18 Billion links exist, but 70% of them were one-off links created for temporary SMS codes or newsletters that will never be clicked again. Billions of dead rows bloat B+ Tree indexes, fragment disk pages, degrade cache efficiency, and slow down lookup queries.
                    </p>
                    <div className="border-l-4 border-emerald-500 bg-emerald-500/[0.05] p-4 rounded-r-xl text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed space-y-1.5">
                      <strong className="text-emerald-700 dark:text-emerald-400 font-bold block">
                        🛡️ Production Mitigation:
                      </strong>
                      <p>
                        &bull; <strong>Lazy Deletion on Read Lookup:</strong> When a redirect request arrives, if <code>expires_at &lt; CURRENT_TIMESTAMP</code>, the service immediately marks the record for deletion, evicts it from cache, and returns HTTP 404.
                      </p>
                      <p>
                        &bull; <strong>Nocturnal Partition Purge Jobs:</strong> Time-based table partitions (e.g. monthly partitions) are dropped during lowest traffic windows (03:00 UTC) with zero lock impact on active tables.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Final Checklist Card */}
                <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-4">
                  <h3 className="font-jakarta text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Summary Checklist to Remember
                  </h3>
                  <div className="grid gap-3.5 sm:grid-cols-2 text-sm sm:text-[15px]">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={18} className="text-lime-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-zinc-300">
                        <strong>Token Permutations:</strong> 62^7 gives 3.52 Trillion URLs (964.8 years of headroom).
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={18} className="text-lime-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-zinc-300">
                        <strong>KGS Key Pooling:</strong> Offline pre-generation eliminates database write locks and collisions.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={18} className="text-lime-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-zinc-300">
                        <strong>Redis Caching:</strong> 100 GB in-memory RAM handles 80-90% of all viral redirect traffic.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={18} className="text-lime-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-zinc-300">
                        <strong>HTTP 302 Protocol:</strong> Ensures full click tracking and real-time analytics measurement.
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 9: SOURCES AND FURTHER READING (Image 1 Style) */}
              <section id="sources" className="scroll-mt-28 space-y-6 pt-6 border-t border-slate-200 dark:border-white/[0.08]">
                <div>
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                    Sources and further reading
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                    Real engineering whitepapers, architecture benchmarks, and official documentation referenced in this guide.
                  </p>
                </div>

                <div className="space-y-4">
                  {SOURCES.map((source, index) => (
                    <div key={index} className="group">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-slate-900 dark:text-zinc-100 hover:text-lime-600 dark:hover:text-lime-400 underline decoration-slate-300 dark:decoration-zinc-700 underline-offset-4 hover:decoration-lime-500 transition-colors"
                      >
                        <span>{source.title}</span>
                        <ExternalLink size={13} className="shrink-0 opacity-60 group-hover:opacity-100" />
                      </a>
                      <p className="text-xs font-mono text-slate-400 dark:text-zinc-500 mt-0.5">
                        {source.publisher}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-500 dark:text-zinc-400 italic pt-2 leading-relaxed border-t border-slate-100 dark:border-white/[0.04]">
                  Beginner-friendly overview based on distributed system design standards and production TinyURL/Bitly architecture. The database numbers, cache math, and request lifecycles represent industry standard engineering benchmarks.
                </p>
              </section>

              {/* APPRECIATION & SUPPORTERS CARD (Image 1 & 2 Style) */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/70 dark:bg-zinc-900/60 p-6 sm:p-8 backdrop-blur-sm shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                    APPRECIATION
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 dark:text-rose-400">
                    <span>❤️</span>
                    <span>{likesCount} {likesCount === 1 ? "supporter" : "supporters"}</span>
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                    Support this article if it helped you.
                  </p>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleLikeClick}
                      className={clsx(
                        "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition shadow-sm",
                        hasLiked
                          ? "bg-rose-500/15 border border-rose-500/40 text-rose-500 dark:text-rose-400 hover:bg-rose-500/25"
                          : "bg-slate-900 text-white dark:bg-zinc-800 dark:text-zinc-100 hover:bg-lime-400 hover:text-slate-950 dark:hover:bg-lime-400 dark:hover:text-slate-950 border border-slate-700 dark:border-white/10"
                      )}
                    >
                      <Heart
                        size={14}
                        className={clsx(hasLiked ? "fill-current text-rose-500" : "")}
                      />
                      <span>{hasLiked ? "Supported" : "Support this post"}</span>
                    </button>
                  </div>
                </div>

                {/* SHARE ROW (Image 1 & 2 Style) */}
                <div className="pt-4 border-t border-slate-200/80 dark:border-white/[0.06] flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mr-2">
                    SHARE
                  </span>
                  <button
                    type="button"
                    onClick={handleShareTwitter}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-lime-500 hover:text-lime-600 dark:hover:text-lime-400 font-semibold transition"
                  >
                    X / Twitter
                  </button>
                  <button
                    type="button"
                    onClick={handleShareLinkedIn}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-lime-500 hover:text-lime-600 dark:hover:text-lime-400 font-semibold transition"
                  >
                    LinkedIn
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-lime-500 hover:text-lime-600 dark:hover:text-lime-400 font-semibold transition"
                  >
                    <span>{copied ? "✓ Copied!" : "🔗 Copy link"}</span>
                  </button>
                </div>
              </div>

              {/* DISCUSSION / COMMENTS SYSTEM */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-lime-500" />
                    <h3 className="font-jakarta text-xl font-bold text-slate-950 dark:text-white">
                      Discussion ({comments.length})
                    </h3>
                  </div>
                  {isLoggedIn && (
                    <span className="text-xs text-slate-500 dark:text-zinc-400">
                      Signed in as <strong className="text-slate-800 dark:text-zinc-200">{user?.name}</strong>
                    </span>
                  )}
                </div>

                {/* Comment Input Box */}
                <form onSubmit={handleCommentSubmit} className="space-y-3">
                  <textarea
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onFocus={handleCommentFocus}
                    placeholder={
                      isLoggedIn
                        ? "Write a comment or ask an engineering question..."
                        : "Sign in to join the discussion or ask a question..."
                    }
                    rows={3}
                    maxLength={1000}
                    className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900/80 p-4 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 transition resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                      {isLoggedIn
                        ? `${commentInput.length}/1000 characters`
                        : "Sign in with Google or email to post"}
                    </span>
                    <button
                      type="submit"
                      disabled={submittingComment || (isLoggedIn && !commentInput.trim())}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-lime-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-lime-300 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                    >
                      <Send size={13} />
                      <span>{submittingComment ? "Posting..." : isLoggedIn ? "Post Comment" : "Sign in to Comment"}</span>
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                {comments.length > 0 ? (
                  <div className="space-y-3.5 pt-2">
                    {comments.map((c) => (
                      <div
                        key={c._id}
                        className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-zinc-900/40 p-4 sm:p-5 transition"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-lime-400/20 text-lime-600 dark:text-lime-400 font-bold text-xs flex items-center justify-center uppercase">
                              {c.userName ? c.userName.charAt(0) : "U"}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">
                                {c.userName}
                              </p>
                              <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                                {formatCommentDate(c.createdAt)}
                              </p>
                            </div>
                          </div>

                          {(user?._id === c.userId || user?.role === "admin") && (
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(c._id)}
                              className="text-xs text-slate-400 hover:text-rose-500 transition inline-flex items-center gap-1"
                              title="Delete comment"
                            >
                              <Trash2 size={12} />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap pl-9">
                          {c.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-zinc-500 text-center py-4 bg-slate-50/50 dark:bg-zinc-900/20 rounded-2xl border border-dashed border-slate-200 dark:border-white/[0.06]">
                    No comments yet. Be the first to share your engineering perspective!
                  </p>
                )}
              </div>

              {/* WRITTEN BY NIKHIL AGRAHARI (Image 2 Style) */}
              <div className="pt-10 border-t border-slate-200 dark:border-white/[0.08] space-y-4">
                <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-lime-600 dark:text-lime-400">
                  WRITTEN BY
                </p>
                <h3 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                  Nikhil Agrahari
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl font-normal">
                  Full-stack developer &amp; systems engineer exploring software architecture, AI, high-concurrency backends, and practical engineering.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold pt-1">
                  <a
                    href="https://github.com/nikhilxagr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-900 dark:text-zinc-200 hover:text-lime-600 dark:hover:text-lime-400 transition"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/nikhilxagr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-900 dark:text-zinc-200 hover:text-lime-600 dark:hover:text-lime-400 transition"
                  >
                    LinkedIn
                  </a>
                  <Link
                    to="/about"
                    className="text-slate-900 dark:text-zinc-200 hover:text-lime-600 dark:hover:text-lime-400 transition"
                  >
                    About
                  </Link>
                </div>
                <div className="pt-2">
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white transition"
                  >
                    <span>← Back to writing</span>
                  </Link>
                </div>
              </div>

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

            {/* STICKY RIGHT SIDEBAR: "ON THIS PAGE" (ALWAYS FIXED AND VISIBLE ON SCROLL) */}
            <aside className="hidden lg:block lg:col-span-4 sticky top-28 self-start h-fit max-h-[calc(100vh-8.5rem)] overflow-y-auto z-20">
              <div className="pl-5 border-l border-slate-200 dark:border-white/[0.08]">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                    ON THIS PAGE
                  </p>
                  <span className="text-[10px] font-mono text-lime-500/80 uppercase font-semibold">
                    {SECTIONS.length} sections
                  </span>
                </div>
                <nav className="space-y-1.5 text-xs">
                  {SECTIONS.map((sec) => {
                    const isActive = activeTocId === sec.id;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => scrollToSection(sec.id)}
                        className={clsx(
                          "group flex items-center justify-between w-full text-left px-3 py-2 rounded-xl border transition-all duration-150 leading-relaxed",
                          isActive
                            ? "border-lime-500/50 bg-lime-500/10 text-lime-400 font-bold shadow-sm shadow-lime-500/10"
                            : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-100/60 dark:hover:bg-white/[0.04]"
                        )}
                      >
                        <span className="truncate">{sec.label}</span>
                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-lime-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>
          </div>
        </div>

        {/* Floating Quick Back-To-Top Button (Image 3 Style) */}
        {showScrollTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-slate-900/90 dark:bg-zinc-900/90 text-white shadow-2xl hover:bg-lime-400 hover:text-slate-950 border border-slate-700/60 dark:border-white/10 hover:border-lime-400 transition-all duration-200 hover:scale-110"
            title="Scroll to top"
            aria-label="Scroll to top"
          >
            <ChevronUp size={20} />
          </button>
        )}
      </article>
    </>
  );
}
