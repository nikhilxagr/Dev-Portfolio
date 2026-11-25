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

      <article className="relative pt-6 pb-20 sm:pt-8 sm:pb-24 font-sans">
        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-8 flex items-center gap-2 text-xs font-medium text-ink-400 dark:text-ink-500">
            <Link to="/" className="transition-colors hover:text-ink-950 dark:hover:text-ink-50">
              Home
            </Link>
            <span>/</span>
            <Link to="/blog" className="transition-colors hover:text-ink-950 dark:hover:text-ink-50">
              Blog
            </Link>
            <span>/</span>
            <span className="text-ink-700 dark:text-ink-300">Engineering Deep Dives</span>
          </nav>

          <header className="mb-12 max-w-4xl">
            <p className="mb-3 font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Engineering Deep Dives
            </p>

            <h1 className="mb-5 font-display text-3xl font-semibold leading-[1.12] tracking-tight text-ink-950 dark:text-ink-50 sm:text-5xl">
              URL Shortener System Design: A Complete Guide to Scalable Architecture
            </h1>

            <p className="mb-6 max-w-3xl text-base leading-relaxed text-ink-600 dark:text-ink-300 sm:text-lg">
              Designing a scalable URL shortener like TinyURL or Bitly to serve 1 billion daily redirects with ~1.2ms cache latency, zero key collisions, and resilient caching.
            </p>

            <div className="flex flex-wrap items-center gap-3 border-b border-black/[0.08] pb-8 text-xs text-ink-500 dark:border-white/[0.08] dark:text-ink-400">
              <span className="font-semibold text-ink-900 dark:text-ink-200">Nikhil Agrahari</span>
              <span>·</span>
              <span>Oct 2026</span>
              <span>·</span>
              <span>10 min read</span>
            </div>
          </header>

          <div className="sticky top-16 z-30 -mx-4 mb-8 border-y border-black/[0.08] bg-white/95 px-4 py-3 dark:border-white/[0.08] dark:bg-[#090a0f]/95 lg:hidden">
            <p className="mb-2 font-mono text-xs font-medium text-ink-500 dark:text-ink-400">
              On this page
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
                      "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      isActive
                        ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-ink-950"
                        : "border-black/[0.08] text-ink-600 dark:border-white/[0.08] dark:text-ink-400"
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
              <section id="overview" className="scroll-mt-28 space-y-6">
                <div className="border-b border-black/[0.08] pb-4 dark:border-white/[0.08]">
                  <h2 className="font-display text-2xl font-semibold text-ink-950 dark:text-ink-50 sm:text-3xl">
                    1. What is a URL Shortener? (The Core Problem)
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-400 sm:text-base">
                    A URL shortener accepts any long destination URL, generates an ultra-compact 7-character alias, and redirects visitors in under 2 milliseconds while logging analytics in the background.
                  </p>
                </div>

                <div className="space-y-6 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-8">
                  <div className="flex items-center justify-between border-b border-black/[0.06] pb-3 dark:border-white/[0.06]">
                    <span className="font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      Core System SLA &amp; Non-Functional Requirements
                    </span>
                    <span className="font-mono text-xs text-ink-500 dark:text-ink-400">
                      Production Benchmarks
                    </span>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-base font-semibold text-emerald-700 dark:text-emerald-400">
                        <Zap size={17} strokeWidth={1.5} />
                        <span>100:1 Read-to-Write Ratio</span>
                      </div>
                      <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                        For every 1 new URL created, over 100 visitors resolve it. This read-heavy skew dictates that persistent storage should stay off the hot redirect path behind fast in-memory caching.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-base font-semibold text-emerald-700 dark:text-emerald-400">
                        <Zap size={17} strokeWidth={1.5} />
                        <span>Sub-2ms Redirection SLA</span>
                      </div>
                      <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                        Slow redirects degrade UX and marketing telemetry. HTTP 302 redirects should resolve from in-memory caches at the edge in under 2 milliseconds.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-base font-semibold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 size={17} strokeWidth={1.5} />
                        <span>100% Collision-Free</span>
                      </div>
                      <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                        Distinct URLs must never collide on the same alias. Uniqueness is guaranteed at token allocation time without database write locks.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => scrollToSection("capacity")}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400 sm:text-sm"
                  >
                    <span>Next: 2. Traffic &amp; Storage Sizing</span>
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </section>

              <section id="capacity" className="scroll-mt-28 space-y-6">
                <div className="border-b border-black/[0.08] pb-4 dark:border-white/[0.08]">
                  <h2 className="font-display text-2xl font-semibold text-ink-950 dark:text-ink-50 sm:text-3xl">
                    2. Sizing Up the System: Traffic &amp; Storage Sizing
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-400 sm:text-base">
                    Back-of-the-envelope calculations estimate 1 billion daily redirects and 10 million new URLs require ~100 GB RAM for caching and ~9.15 TB disk storage over 5 years.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div className="space-y-2 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                    <p className="font-mono text-xs font-medium text-ink-500 dark:text-ink-400">
                      Link Creation (Writes)
                    </p>
                    <p className="font-mono text-2xl font-semibold tabular-nums text-ink-950 dark:text-ink-50 sm:text-3xl">
                      10M URLs / Day
                    </p>
                    <p className="text-xs text-ink-600 dark:text-ink-400 sm:text-sm">
                      ~116 writes/sec &bull; <span className="font-medium text-emerald-600 dark:text-emerald-400">Peak: ~580 writes/sec</span>
                    </p>
                  </div>

                  <div className="space-y-2 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                    <p className="font-mono text-xs font-medium text-ink-500 dark:text-ink-400">
                      Redirection Traffic (Reads)
                    </p>
                    <p className="font-mono text-2xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400 sm:text-3xl">
                      1B Clicks / Day
                    </p>
                    <p className="text-xs text-ink-600 dark:text-ink-400 sm:text-sm">
                      ~11,574 reads/sec &bull; <span className="font-medium text-emerald-600 dark:text-emerald-400">Peak: ~60,000 reads/sec</span>
                    </p>
                  </div>

                  <div className="space-y-2 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                    <p className="font-mono text-xs font-medium text-ink-500 dark:text-ink-400">
                      5-Year Capacity Budget
                    </p>
                    <p className="font-mono text-2xl font-semibold tabular-nums text-ink-950 dark:text-ink-50 sm:text-3xl">
                      9.15 TB &bull; 100 GB RAM
                    </p>
                    <p className="text-xs text-ink-600 dark:text-ink-400 sm:text-sm">
                      18.25 billion total links &bull; 500 bytes/row
                    </p>
                  </div>
                </div>

                <div className="space-y-2 rounded-r-2xl border-l-4 border-emerald-600 bg-[#f8fafc] p-6 text-sm leading-relaxed text-ink-700 dark:border-emerald-500 dark:bg-[#11141c] dark:text-ink-300 sm:text-base">
                  <h4 className="flex items-center gap-2 text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                    <span>The 80/20 Pareto Mathematical Derivation for Cache Memory</span>
                  </h4>
                  <p>
                    In typical web traffic, <strong>20% of links generate 80% of all redirect traffic</strong> (viral campaigns, breaking news, social bios).
                  </p>
                  <p className="rounded-xl border border-black/[0.08] bg-[#090a0f] p-3.5 font-mono text-xs text-emerald-400 dark:border-white/[0.08] sm:text-sm">
                    1 billion clicks/day &times; 500 bytes per URL mapping = 500 GB total daily data.<br />
                    Caching the top 20% hot links = 500 GB &times; 0.20 = <strong>100 GB RAM required in Redis.</strong>
                  </p>
                  <p className="text-xs text-ink-500 dark:text-ink-400 sm:text-sm">
                    Dedicating 100 GB RAM across a Redis cluster serves 80–90% of requests straight from memory without hitting persistent database disks.
                  </p>
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => scrollToSection("hld")}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400 sm:text-sm"
                  >
                    <span>Next: 3. High-Level Architecture (HLD)</span>
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </section>

              <section id="hld" className="scroll-mt-28 space-y-6">
                <div className="border-b border-black/[0.08] pb-4 dark:border-white/[0.08]">
                  <h2 className="font-display text-2xl font-semibold text-ink-950 dark:text-ink-50 sm:text-3xl">
                    3. High-Level Architecture (The Big Picture)
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-400 sm:text-base">
                    The architecture strictly decouples link generation from link redirection so viral traffic spikes never slow down new link creation.
                  </p>
                </div>

                <div className="space-y-1.5 rounded-r-2xl border-l-4 border-emerald-600 bg-[#f8fafc] p-6 text-sm leading-relaxed text-ink-700 dark:border-emerald-500 dark:bg-[#11141c] dark:text-ink-300 sm:text-[15px]">
                  <strong className="block text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                    Decoupled Read &amp; Write Architecture
                  </strong>
                  <p>
                    Link creation (writes) and link redirection (reads) operate on isolated services. Traffic surges hit edge caches and read replicas without competing for write-lock capacity.
                  </p>
                </div>

                <DiagramCard
                  src="/images/system-design/url-shortener-hld.webp"
                  alt="High-Level Architecture Diagram for URL Shortener"
                  caption="Global architecture: Clients hit DNS/CDN edges, stateless nodes balance requests, KGS allocates pre-computed tokens, and Redis serves fast redirects."
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-3 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                    <h4 className="flex items-center gap-2.5 font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/25 dark:text-emerald-400">
                        <Server size={17} strokeWidth={1.5} />
                      </div>
                      <span>1. Global CDN &amp; Load Balancer</span>
                    </h4>
                    <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                      Anycast DNS steers visitors to the nearest edge node to terminate TLS close to visitors, filter DDoS traffic, and load-balance across stateless API workers.
                    </p>
                  </div>

                  <div className="space-y-3 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                    <h4 className="flex items-center gap-2.5 font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/25 dark:text-emerald-400">
                        <Cpu size={17} strokeWidth={1.5} />
                      </div>
                      <span>2. Key Generation Service (KGS)</span>
                    </h4>
                    <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                      A standalone background service that pre-generates unique 7-character Base62 keys offline into key pools so API workers claim keys in microseconds with zero locks.
                    </p>
                  </div>

                  <div className="space-y-3 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                    <h4 className="flex items-center gap-2.5 font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/25 dark:text-emerald-400">
                        <Zap size={17} strokeWidth={1.5} />
                      </div>
                      <span>3. In-Memory Redis Cache Cluster</span>
                    </h4>
                    <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                      Distributed Redis cluster using Cache-Aside with LRU eviction so over 90% of hot redirects resolve directly from RAM in ~1.2ms.
                    </p>
                  </div>

                  <div className="space-y-3 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                    <h4 className="flex items-center gap-2.5 font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/25 dark:text-emerald-400">
                        <Database size={17} strokeWidth={1.5} />
                      </div>
                      <span>4. Sharded Persistent Database</span>
                    </h4>
                    <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                      Distributed Key-Value store (Cassandra/DynamoDB) or sharded PostgreSQL partitioned on a consistent hash of <code>short_code</code> for billion-row durability.
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => scrollToSection("request-flow")}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400 sm:text-sm"
                  >
                    <span>Next: 4. Request Lifecycles</span>
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </section>

              <section id="request-flow" className="scroll-mt-28 space-y-6">
                <div className="border-b border-black/[0.08] pb-4 dark:border-white/[0.08]">
                  <h2 className="font-display text-2xl font-semibold text-ink-950 dark:text-ink-50 sm:text-3xl">
                    4. Request Lifecycles: Creating a Link vs. Redirecting
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-400 sm:text-base">
                    Writing and reading follow separate lifecycles: link creation leases a pre-allocated token from memory, while redirecting resolves from Redis.
                  </p>
                </div>

                <DiagramCard
                  src="/images/system-design/url-shortener-request-flow.webp"
                  alt="Request Flow Sequence for Creating and Redirecting URLs"
                  caption="Sequence diagram comparing write path (token allocation, DB persist, cache prime) against read path (cache hit, HTTP 302 redirect, async analytics)."
                />

                <div className="space-y-5">
                  <div className="flex items-center gap-2 border-b border-black/[0.08] pb-3 dark:border-white/[0.08]">
                    <button
                      type="button"
                      onClick={() => setActivePipeline("write")}
                      className={clsx(
                        "rounded-lg px-4 py-2 text-xs font-medium transition-colors sm:text-sm",
                        activePipeline === "write"
                          ? "bg-ink-950 text-white dark:bg-emerald-500 dark:text-ink-950"
                          : "text-ink-600 hover:text-ink-950 dark:text-ink-400 dark:hover:text-ink-50"
                      )}
                    >
                      Creation Lifecycle (Write Path)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePipeline("read")}
                      className={clsx(
                        "rounded-lg px-4 py-2 text-xs font-medium transition-colors sm:text-sm",
                        activePipeline === "read"
                          ? "bg-ink-950 text-white dark:bg-emerald-500 dark:text-ink-950"
                          : "text-ink-600 hover:text-ink-950 dark:text-ink-400 dark:hover:text-ink-50"
                      )}
                    >
                      Redirection Lifecycle (Read Path)
                    </button>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {activePipeline === "write" ? (
                      <>
                        <div className="space-y-2.5 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                          <span className="inline-block rounded-md border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
                            Step 01
                          </span>
                          <h4 className="font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                            Submit Long Destination URL
                          </h4>
                          <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                            Client issues an HTTP POST containing the destination URL while rate limits and async validation checks run.
                          </p>
                        </div>

                        <div className="space-y-2.5 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                          <span className="inline-block rounded-md border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
                            Step 02
                          </span>
                          <h4 className="font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                            In-Memory Token Claim
                          </h4>
                          <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                            The API worker pops an unused 7-character Base62 key straight from its local KGS memory batch with zero DB write locks.
                          </p>
                        </div>

                        <div className="space-y-2.5 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                          <span className="inline-block rounded-md border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
                            Step 03
                          </span>
                          <h4 className="font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                            Persist &amp; Warm Cache
                          </h4>
                          <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                            Writes the mapping to persistent storage and primes Redis immediately so first clicks resolve in ~1.2ms.
                          </p>
                        </div>

                        <div className="space-y-2.5 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                          <span className="inline-block rounded-md border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
                            Step 04
                          </span>
                          <h4 className="font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                            Return Short Link
                          </h4>
                          <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                            Returns the compact short URL (e.g. <code>short.ly/aB3x9Qz</code>) with HTTP 201 Created in under 15ms.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2.5 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                          <span className="inline-block rounded-md border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
                            Step 01
                          </span>
                          <h4 className="font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                            Visitor Requests Short Link
                          </h4>
                          <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                            HTTP GET for <code>short.ly/aB3x9Qz</code> reaches the nearest Anycast edge load balancer and routes to a nearby worker.
                          </p>
                        </div>

                        <div className="space-y-2.5 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                          <span className="inline-block rounded-md border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
                            Step 02
                          </span>
                          <h4 className="font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                            Redis In-Memory Lookup
                          </h4>
                          <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                            Looks up <code>aB3x9Qz</code> in Redis. Over 90% of requests resolve from RAM in under 1.2ms without touching persistent disk.
                          </p>
                        </div>

                        <div className="space-y-2.5 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                          <span className="inline-block rounded-md border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
                            Step 03
                          </span>
                          <h4 className="font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                            HTTP 302 Redirect Dispatched
                          </h4>
                          <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                            Returns HTTP 302 (Found) with <code>Location: https://example.com/destination</code> for immediate browser navigation.
                          </p>
                        </div>

                        <div className="space-y-2.5 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                          <span className="inline-block rounded-md border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
                            Step 04
                          </span>
                          <h4 className="font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                            Async Click Stream to Kafka
                          </h4>
                          <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                            Click metadata (country, device, referrer) emits asynchronously to Kafka without adding latency to the redirect.
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
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400 sm:text-sm"
                  >
                    <span>Next: 5. Base62 Math (3.5T URLs)</span>
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </section>

              <section id="algorithms" className="scroll-mt-28 space-y-6">
                <div className="border-b border-black/[0.08] pb-4 dark:border-white/[0.08]">
                  <h2 className="font-display text-2xl font-semibold text-ink-950 dark:text-ink-50 sm:text-3xl">
                    5. The Key Secret: How 7 Characters Give 3.5 Trillion URLs
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-400 sm:text-base">
                    Combining letters [a-z, A-Z] and digits [0-9] provides 62 characters per slot, creating over 3.52 trillion combinations across 7 characters.
                  </p>
                </div>

                <div className="space-y-4 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-8">
                  <h3 className="flex items-center gap-2.5 font-display text-lg font-semibold text-ink-950 dark:text-ink-50 sm:text-xl">
                    <span className="font-mono font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">01.</span>
                    <span>The Mathematical Foundation of Base62 Encoding</span>
                  </h3>
                  <p className="text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                    Base62 utilizes 10 digits [0–9] + 26 lowercase characters [a–z] + 26 uppercase characters [A–Z] = 62 characters. Unlike Base64, which contains &apos;+&apos; and &apos;/&apos; characters that require URL percent-encoding (<code>%2B</code> and <code>%2F</code>), every single character in Base62 is 100% URL-safe per RFC 3986 without escaping or padding characters.
                  </p>

                  <div className="rounded-2xl border border-black/[0.08] bg-[#090a0f] p-5 font-mono text-sm text-ink-300 dark:border-white/[0.08] sm:p-6 sm:text-base space-y-2">
                    <p className="text-xs font-medium text-ink-400">Combinations formula: 62^Length</p>
                    <p className="text-ink-400">&bull; 6 Characters: 62^6 = 56,800,235,584 (~56.8 Billion URLs)</p>
                    <p className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 font-medium text-emerald-400">
                      &bull; 7 Characters: 62^7 = 3,521,614,606,208 (~3.52 Trillion URLs)
                    </p>
                    <p className="text-ink-400">&bull; 8 Characters: 62^8 = 218,340,105,584,896 (~218 Trillion URLs)</p>
                  </div>

                  <div className="space-y-1 rounded-r-xl border-l-4 border-emerald-600 bg-emerald-500/[0.06] p-4 text-sm leading-relaxed text-ink-700 dark:border-emerald-500 dark:text-ink-300 sm:p-5 sm:text-[15px]">
                    <p className="flex items-center gap-2 font-semibold text-ink-950 dark:text-ink-50">
                      <CheckCircle2 size={16} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Verdict &amp; Headroom Calculation</span>
                    </p>
                    <p>
                      At <strong>10 million newly created URLs every day</strong>:
                    </p>
                    <p className="font-mono text-xs font-medium tabular-nums text-emerald-700 dark:text-emerald-400 sm:text-sm">
                      3,521,614,606,208 &divide; (10,000,000 &times; 365) = 964.8 years to exhaust key space.
                    </p>
                    <p className="text-xs text-ink-500 dark:text-ink-400 sm:text-sm">
                      Seven characters provide effectively non-exhaustible namespace headroom without enlarging short URLs or memory overhead.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <h3 className="font-display text-lg font-semibold text-ink-950 dark:text-ink-50 sm:text-xl">
                    Three Ways to Generate Short Codes (And Why KGS Wins)
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2.5 rounded-2xl border border-rose-500/25 bg-rose-500/[0.04] p-6 sm:p-7">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                          1. MD5 / SHA-256 Hash Truncation
                        </h4>
                        <span className="rounded-md bg-rose-500/10 px-2.5 py-1 font-mono text-xs font-medium text-rose-600 dark:text-rose-400">
                          Flaw: Hash collisions
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-ink-700 dark:text-ink-300 sm:text-[15px]">
                        <strong>The Mechanism:</strong> Compute a hash of the destination URL and slice the first 7 characters.
                      </p>
                      <p className="text-sm leading-relaxed text-rose-700 dark:text-rose-300 sm:text-[15px]">
                        <strong>Why It Fails in Production:</strong> Different inputs collide under short prefixes, forcing read-before-write uniqueness queries and retry locks under 500+ writes/sec.
                      </p>
                    </div>

                    <div className="space-y-2.5 rounded-2xl border border-black/[0.08] bg-[#f8fafc] p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                          2. Auto-Increment Database ID to Base62
                        </h4>
                        <span className="rounded-md border border-black/[0.08] bg-black/[0.04] px-2.5 py-1 font-mono text-xs font-medium text-ink-700 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-ink-300">
                          Flaw: Predictable &amp; scrapeable
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-ink-700 dark:text-ink-300 sm:text-[15px]">
                        <strong>The Mechanism:</strong> Assign sequential integers (1, 2, 3...) and Base62-encode each row ID.
                      </p>
                      <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                        <strong>Why It Fails in Production:</strong> Sequential IDs let anyone enumerate URLs in order and introduce multi-region primary-sequence coordination bottlenecks.
                      </p>
                    </div>

                    <div className="space-y-2.5 rounded-2xl border border-emerald-600/30 bg-emerald-500/[0.05] p-6 dark:border-emerald-500/30 sm:p-7">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                          3. Key Generation Service (KGS) with Key Pooling
                        </h4>
                        <span className="rounded-md border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-1 font-mono text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
                          Production Choice
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-ink-700 dark:text-ink-300 sm:text-[15px]">
                        <strong>The Mechanism:</strong> An offline worker pre-generates randomized 7-character Base62 keys partitioned into available and assigned pools.
                      </p>
                      <p className="text-sm leading-relaxed text-emerald-800 dark:text-emerald-300 sm:text-[15px]">
                        <strong>Why It Wins:</strong> App nodes lease key batches into RAM for microsecond allocation with zero collision checks, zero write locks, and unpredictable aliases.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => scrollToSection("data-model")}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400 sm:text-sm"
                  >
                    <span>Next: 6. Database &amp; Storage Strategy</span>
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </section>

              <section id="data-model" className="scroll-mt-28 space-y-6">
                <div className="border-b border-black/[0.08] pb-4 dark:border-white/[0.08]">
                  <h2 className="font-display text-2xl font-semibold text-ink-950 dark:text-ink-50 sm:text-3xl">
                    6. How We Store the Data: Database &amp; Storage Strategy
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-400 sm:text-base">
                    Since URL shortening consists of key-to-value point lookups without relational joins, NoSQL or sharded SQL fits cleanly.
                  </p>
                </div>

                <DiagramCard
                  src="/images/system-design/url-shortener-data-model.webp"
                  alt="Database Schema & Data Model Diagram"
                  caption="Data model: Compact records storing short code, destination URL, owner ID, expiry timestamp, and soft-kill toggle."
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-3 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                    <h3 className="flex items-center gap-2.5 font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/25 dark:text-emerald-400">
                        <Database size={17} strokeWidth={1.5} />
                      </div>
                      <span>Optimized Schema (~500 Bytes / Row)</span>
                    </h3>
                    <ul className="space-y-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                      <li>
                        &bull; <strong className="font-mono text-ink-900 dark:text-ink-50">short_code (VARCHAR 7):</strong> Primary Key B+ Tree index for O(log N) lookup.
                      </li>
                      <li>
                        &bull; <strong className="font-mono text-ink-900 dark:text-ink-50">original_url (VARCHAR 2048):</strong> Target destination URL.
                      </li>
                      <li>
                        &bull; <strong className="font-mono text-ink-900 dark:text-ink-50">user_id (BIGINT):</strong> Owner reference for rate limiting and links dashboard.
                      </li>
                      <li>
                        &bull; <strong className="font-mono text-ink-900 dark:text-ink-50">created_at / expires_at:</strong> Epoch timestamps for link lifecycle and TTL purges.
                      </li>
                      <li>
                        &bull; <strong className="font-mono text-ink-900 dark:text-ink-50">is_active (BOOLEAN):</strong> Immediate disable switch for reported URLs.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                    <h3 className="flex items-center gap-2.5 font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/25 dark:text-emerald-400">
                        <Layers size={17} strokeWidth={1.5} />
                      </div>
                      <span>NoSQL vs. Relational (SQL) Trade-Off</span>
                    </h3>
                    <div className="space-y-2.5 text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                      <p>
                        Because queries are pure primary-key lookups with zero multi-table joins:
                      </p>
                      <p>
                        &bull; <strong className="text-ink-900 dark:text-ink-50">Distributed NoSQL</strong> (Cassandra, DynamoDB, MongoDB) scales horizontally via hash partitioning and regional replicas.
                      </p>
                      <p>
                        &bull; <strong className="text-ink-900 dark:text-ink-50">Sharded SQL</strong> (PostgreSQL / MySQL) partitioned on consistent hashes of <code>short_code</code> also serves multi-terabyte tables comfortably.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => scrollToSection("scalability")}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400 sm:text-sm"
                  >
                    <span>Next: 7. Redis Caching &amp; Scaling</span>
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </section>

              <section id="scalability" className="scroll-mt-28 space-y-6">
                <div className="border-b border-black/[0.08] pb-4 dark:border-white/[0.08]">
                  <h2 className="font-display text-2xl font-semibold text-ink-950 dark:text-ink-50 sm:text-3xl">
                    7. Scaling Up: Redis Caching &amp; Redirection Protocol
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-400 sm:text-base">
                    Caching the top 20% hot links in Redis absorbs over 90% of redirect load in memory at ~1.2ms.
                  </p>
                </div>

                <DiagramCard
                  src="/images/system-design/url-shortener-scalability.webp"
                  alt="System Scalability, Redis Caching & Sharding Architecture"
                  caption="Scalability topology: Traffic reaches Redis in-memory clusters via CDN edge nodes while Kafka aggregates click telemetry asynchronously."
                />

                <div className="space-y-4">
                  <div className="space-y-2.5 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="flex items-center gap-2.5 font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                        <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                        <span>1. Cache Eviction Policy: Redis LRU</span>
                      </h4>
                      <span className="rounded-md border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
                        Cache-Aside Pattern
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                      Application nodes read Redis first; misses fall back to persistent storage and backfill Redis with a TTL. Under <code>allkeys-lru</code>, cold links rotate out while hot URLs stay resident in RAM.
                    </p>
                  </div>

                  <div className="space-y-2.5 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="flex items-center gap-2.5 font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                        <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                        <span>2. Status Code: HTTP 302 (Found) vs. HTTP 301</span>
                      </h4>
                      <span className="rounded-md border border-black/[0.08] bg-black/[0.03] px-2.5 py-0.5 font-mono text-xs font-medium text-ink-700 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-ink-300">
                        Protocol Trade-Off
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                      <strong>HTTP 301</strong> caches locally in browsers and bypasses redirect telemetry. <strong>HTTP 302</strong> routes repeat clicks through our redirect cluster for analytics capture and instant abuse revocation.
                    </p>
                  </div>

                  <div className="space-y-2.5 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="flex items-center gap-2.5 font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                        <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                        <span>3. Decoupled Analytics via Event Streaming</span>
                      </h4>
                      <span className="rounded-md border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
                        Async Click Stream
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                      Emitting click events asynchronously to Kafka or RabbitMQ keeps synchronous database writes off the user redirect path.
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => scrollToSection("edge-cases")}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400 sm:text-sm"
                  >
                    <span>Next: 8. Edge Cases &amp; Takeaways</span>
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </section>

              <section id="edge-cases" className="scroll-mt-28 space-y-6">
                <div className="border-b border-black/[0.08] pb-4 dark:border-white/[0.08]">
                  <h2 className="font-display text-2xl font-semibold text-ink-950 dark:text-ink-50 sm:text-3xl">
                    8. Real-World Disasters &amp; Key Takeaways
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-400 sm:text-base">
                    Production systems guard against cache stampedes, KGS failovers, phishing links, and expired record bloat.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="flex items-center gap-2 font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                        <AlertTriangle size={17} strokeWidth={1.5} className="shrink-0 text-ink-500 dark:text-ink-400" />
                        <span>1. Cache Stampede (Thundering Herd)</span>
                      </h4>
                      <span className="rounded-md border border-black/[0.08] bg-black/[0.03] px-2.5 py-0.5 font-mono text-xs font-medium text-ink-700 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-ink-300">
                        Availability Risk
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                      <strong>Risk:</strong> When a viral key expires from Redis simultaneously across 100k requests/sec, database pools saturate.
                    </p>
                    <div className="space-y-1.5 rounded-r-xl border-l-4 border-emerald-600 bg-emerald-500/[0.05] p-4 text-sm leading-relaxed text-ink-700 dark:border-emerald-500 dark:text-ink-300">
                      <strong className="block font-semibold text-emerald-700 dark:text-emerald-400">
                        Mitigation:
                      </strong>
                      <p>&bull; Single-flight distributed mutex locks (Redlock) on cache misses plus probabilistic early refresh before TTL expiry.</p>
                    </div>
                  </div>

                  <div className="space-y-3 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="flex items-center gap-2 font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                        <AlertTriangle size={17} strokeWidth={1.5} className="shrink-0 text-ink-500 dark:text-ink-400" />
                        <span>2. Single Point of Failure on KGS</span>
                      </h4>
                      <span className="rounded-md border border-rose-500/25 bg-rose-500/10 px-2.5 py-0.5 font-mono text-xs font-medium text-rose-600 dark:text-rose-400">
                        Write Pipeline SPOF
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                      <strong>Risk:</strong> If a sole KGS node fails, new link creation stops; uncoordinated replicas risk duplicate keys.
                    </p>
                    <div className="space-y-1.5 rounded-r-xl border-l-4 border-emerald-600 bg-emerald-500/[0.05] p-4 text-sm leading-relaxed text-ink-700 dark:border-emerald-500 dark:text-ink-300">
                      <strong className="block font-semibold text-emerald-700 dark:text-emerald-400">
                        Mitigation:
                      </strong>
                      <p>&bull; Active-passive failover supervised via ZooKeeper/Raft paired with in-memory key batch buffers inside API workers.</p>
                    </div>
                  </div>

                  <div className="space-y-3 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="flex items-center gap-2 font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                        <AlertTriangle size={17} strokeWidth={1.5} className="shrink-0 text-ink-500 dark:text-ink-400" />
                        <span>3. Phishing Links &amp; Root Domain Reputation</span>
                      </h4>
                      <span className="rounded-md border border-black/[0.08] bg-black/[0.03] px-2.5 py-0.5 font-mono text-xs font-medium text-ink-700 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-ink-300">
                        Abuse &amp; Security
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                      <strong>Risk:</strong> Phishing payloads hosted behind shortened links risk blocklisting the shared root domain.
                    </p>
                    <div className="space-y-1.5 rounded-r-xl border-l-4 border-emerald-600 bg-emerald-500/[0.05] p-4 text-sm leading-relaxed text-ink-700 dark:border-emerald-500 dark:text-ink-300">
                      <strong className="block font-semibold text-emerald-700 dark:text-emerald-400">
                        Mitigation:
                      </strong>
                      <p>&bull; Async URL reputation inspection against Safe Browsing feeds combined with an instant <code>is_active</code> soft-kill switch in Redis.</p>
                    </div>
                  </div>

                  <div className="space-y-3 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="flex items-center gap-2 font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                        <AlertTriangle size={17} strokeWidth={1.5} className="shrink-0 text-ink-500 dark:text-ink-400" />
                        <span>4. Expired Link &amp; Index Bloat</span>
                      </h4>
                      <span className="rounded-md border border-black/[0.08] bg-black/[0.03] px-2.5 py-0.5 font-mono text-xs font-medium text-ink-700 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-ink-300">
                        Storage Hygiene
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-[15px]">
                      <strong>Risk:</strong> Stale one-off aliases bloat B+ Tree indexes across billions of rows over multi-year retention windows.
                    </p>
                    <div className="space-y-1.5 rounded-r-xl border-l-4 border-emerald-600 bg-emerald-500/[0.05] p-4 text-sm leading-relaxed text-ink-700 dark:border-emerald-500 dark:text-ink-300">
                      <strong className="block font-semibold text-emerald-700 dark:text-emerald-400">
                        Mitigation:
                      </strong>
                      <p>&bull; Lazy deletion when expired links are read plus scheduled off-peak partition drops.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-7">
                  <h3 className="font-display text-base font-semibold text-ink-950 dark:text-ink-50 sm:text-lg">
                    Summary Checklist
                  </h3>
                  <div className="grid gap-3.5 text-sm sm:grid-cols-2 sm:text-[15px]">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={17} strokeWidth={1.5} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-ink-700 dark:text-ink-300">
                        <strong>Token Namespace:</strong> 62^7 gives 3.52 trillion URLs (964+ years headroom).
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={17} strokeWidth={1.5} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-ink-700 dark:text-ink-300">
                        <strong>KGS Pooling:</strong> Offline key generation removes database write locks and hash collisions.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={17} strokeWidth={1.5} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-ink-700 dark:text-ink-300">
                        <strong>Redis Cache-Aside:</strong> 100 GB RAM handles 80–90% of hot traffic directly in memory.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={17} strokeWidth={1.5} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-ink-700 dark:text-ink-300">
                        <strong>HTTP 302 Redirects:</strong> Enables accurate analytics and immediate link disablement.
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section id="sources" className="scroll-mt-28 space-y-6 border-t border-black/[0.08] pt-6 dark:border-white/[0.08]">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-ink-950 dark:text-ink-50 sm:text-3xl">
                    Sources and further reading
                  </h2>
                  <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
                    Architecture papers, system benchmarks, and official engineering documentation referenced in this guide.
                  </p>
                </div>

                <div className="space-y-4">
                  {SOURCES.map((source, index) => (
                    <div key={index} className="group">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 underline decoration-black/20 underline-offset-4 transition-colors hover:text-emerald-600 hover:decoration-emerald-500 dark:text-ink-100 dark:decoration-white/20 dark:hover:text-emerald-400 sm:text-base"
                      >
                        <span>{source.title}</span>
                        <ExternalLink size={13} strokeWidth={1.5} className="shrink-0 opacity-60 group-hover:opacity-100" />
                      </a>
                      <p className="mt-0.5 font-mono text-xs text-ink-500 dark:text-ink-400">
                        {source.publisher}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-500 dark:text-zinc-400 italic pt-2 leading-relaxed border-t border-slate-100 dark:border-white/[0.04]">
                  Beginner-friendly overview based on distributed system design standards and production TinyURL/Bitly architecture. The database numbers, cache math, and request lifecycles represent industry standard engineering benchmarks.
                </p>
              </section>

              <div className="space-y-6 rounded-2xl border border-black/[0.08] bg-[#f8fafc] p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-medium text-ink-500 dark:text-ink-400">
                    Appreciation
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium tabular-nums text-rose-600 dark:text-rose-400">
                    <Heart size={13} strokeWidth={1.5} className="fill-rose-500/20 text-rose-500" />
                    <span>{likesCount} {likesCount === 1 ? "supporter" : "supporters"}</span>
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-ink-700 dark:text-ink-300">
                    Support this article if it helped you.
                  </p>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleLikeClick}
                      className={clsx(
                        "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium transition-colors",
                        hasLiked
                          ? "border-rose-500/40 bg-rose-500/15 text-rose-600 hover:bg-rose-500/25 dark:text-rose-400"
                          : "border-black/[0.08] bg-ink-950 text-white hover:bg-ink-900 dark:border-white/[0.1] dark:bg-white/[0.06] dark:text-ink-100 dark:hover:border-emerald-500/40"
                      )}
                    >
                      <Heart
                        size={14}
                        strokeWidth={1.5}
                        className={clsx(hasLiked ? "fill-current text-rose-500" : "")}
                      />
                      <span>{hasLiked ? "Supported" : "Support this post"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-black/[0.08] pt-4 text-xs dark:border-white/[0.06] sm:gap-3">
                  <span className="mr-2 font-mono text-xs font-medium text-ink-500 dark:text-ink-400">
                    Share
                  </span>
                  <button
                    type="button"
                    onClick={handleShareTwitter}
                    className="rounded-lg border border-black/[0.08] bg-white px-3.5 py-1.5 font-medium text-ink-700 transition-colors hover:border-emerald-600/35 hover:text-emerald-700 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-ink-300 dark:hover:border-emerald-500/35 dark:hover:text-emerald-400"
                  >
                    X / Twitter
                  </button>
                  <button
                    type="button"
                    onClick={handleShareLinkedIn}
                    className="rounded-lg border border-black/[0.08] bg-white px-3.5 py-1.5 font-medium text-ink-700 transition-colors hover:border-emerald-600/35 hover:text-emerald-700 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-ink-300 dark:hover:border-emerald-500/35 dark:hover:text-emerald-400"
                  >
                    LinkedIn
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white px-3.5 py-1.5 font-medium text-ink-700 transition-colors hover:border-emerald-600/35 hover:text-emerald-700 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-ink-300 dark:hover:border-emerald-500/35 dark:hover:text-emerald-400"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 size={13} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
                        <span>Copied link</span>
                      </>
                    ) : (
                      <>
                        <Share2 size={13} strokeWidth={1.5} />
                        <span>Copy link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={17} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-display text-xl font-semibold text-ink-950 dark:text-ink-50">
                      Discussion ({comments.length})
                    </h3>
                  </div>
                  {isLoggedIn && (
                    <span className="text-xs text-ink-500 dark:text-ink-400">
                      Signed in as <strong className="text-ink-900 dark:text-ink-200">{user?.name}</strong>
                    </span>
                  )}
                </div>

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
                    className="w-full resize-none rounded-xl border border-black/[0.1] bg-white p-4 text-sm text-ink-950 outline-none transition-colors placeholder:text-ink-400 focus:border-emerald-600 dark:border-white/[0.1] dark:bg-[#11141c] dark:text-ink-50 dark:placeholder:text-ink-500 dark:focus:border-emerald-500"
                  />
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tabular-nums text-ink-500 dark:text-ink-400">
                      {isLoggedIn
                        ? `${commentInput.length}/1000 characters`
                        : "Sign in with Google or email to post"}
                    </span>
                    <button
                      type="submit"
                      disabled={submittingComment || (isLoggedIn && !commentInput.trim())}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-ink-950 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.1] dark:bg-emerald-500 dark:text-ink-950 dark:hover:bg-emerald-400"
                    >
                      <Send size={13} strokeWidth={1.5} />
                      <span>{submittingComment ? "Posting..." : isLoggedIn ? "Post Comment" : "Sign in to Comment"}</span>
                    </button>
                  </div>
                </form>

                {comments.length > 0 ? (
                  <div className="space-y-3.5 pt-2">
                    {comments.map((c) => (
                      <div
                        key={c._id}
                        className="rounded-xl border border-black/[0.08] bg-white p-4 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-5"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-600/25 bg-emerald-500/10 text-xs font-semibold text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
                              {c.userName ? c.userName.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-ink-950 dark:text-ink-50">
                                {c.userName}
                              </p>
                              <p className="text-[11px] text-ink-500 dark:text-ink-400">
                                {formatCommentDate(c.createdAt)}
                              </p>
                            </div>
                          </div>

                          {(user?._id === c.userId || user?.role === "admin") && (
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(c._id)}
                              className="inline-flex items-center gap-1 text-xs text-ink-500 transition-colors hover:text-rose-500"
                              title="Delete comment"
                            >
                              <Trash2 size={12} strokeWidth={1.5} />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                        <p className="whitespace-pre-wrap pl-9 text-sm leading-relaxed text-ink-700 dark:text-ink-300">
                          {c.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl border border-dashed border-black/[0.1] bg-[#f8fafc] py-4 text-center text-xs text-ink-500 dark:border-white/[0.1] dark:bg-[#0c0e14] dark:text-ink-400">
                    No comments yet. Be the first to share your engineering perspective.
                  </p>
                )}
              </div>

              <div className="space-y-4 border-t border-black/[0.08] pt-10 dark:border-white/[0.08]">
                <p className="font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Written by
                </p>
                <h3 className="font-display text-2xl font-semibold text-ink-950 dark:text-ink-50 sm:text-3xl">
                  Nikhil Agrahari
                </h3>
                <p className="max-w-2xl text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                  Full-stack developer &amp; systems engineer exploring software architecture, AI, high-concurrency backends, and practical security engineering.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-medium">
                  <a
                    href="https://github.com/nikhilxagr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-800 transition-colors hover:text-emerald-600 dark:text-ink-200 dark:hover:text-emerald-400"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/nikhilxagr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-800 transition-colors hover:text-emerald-600 dark:text-ink-200 dark:hover:text-emerald-400"
                  >
                    LinkedIn
                  </a>
                  <Link
                    to="/about"
                    className="text-ink-800 transition-colors hover:text-emerald-600 dark:text-ink-200 dark:hover:text-emerald-400"
                  >
                    About
                  </Link>
                </div>
                <div className="pt-2">
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-600 transition-colors hover:text-ink-950 dark:text-ink-400 dark:hover:text-ink-50"
                  >
                    <span>← Back to writing</span>
                  </Link>
                </div>
              </div>

              <div className="flex flex-col items-center justify-between gap-4 border-t border-black/[0.08] pt-8 dark:border-white/[0.08] sm:flex-row">
                {prevSystem ? (
                  <Link
                    to={`${baseRoute}/${prevSystem.id}`}
                    className="flex items-center gap-2 text-xs font-medium text-ink-600 transition-colors hover:text-ink-950 dark:text-ink-400 dark:hover:text-ink-50"
                  >
                    <ChevronLeft size={16} strokeWidth={1.5} />
                    <div className="text-left">
                      <span className="block text-[11px] text-ink-400">Previous</span>
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
                      <span className="block text-[11px] text-ink-400">Next</span>
                      <span>{nextSystem.title}</span>
                    </div>
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </main>

            <aside className="sticky top-28 z-20 hidden h-fit max-h-[calc(100vh-8.5rem)] self-start overflow-y-auto lg:col-span-4 lg:block">
              <div className="border-l border-black/[0.08] pl-5 dark:border-white/[0.08]">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-mono text-xs font-medium text-ink-500 dark:text-ink-400">
                    On this page
                  </p>
                  <span className="font-mono text-xs tabular-nums text-emerald-600 dark:text-emerald-400">
                    {SECTIONS.length} sections
                  </span>
                </div>
                <nav className="space-y-1 text-xs">
                  {SECTIONS.map((sec) => {
                    const isActive = activeTocId === sec.id;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => scrollToSection(sec.id)}
                        className={clsx(
                          "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left leading-relaxed transition-colors duration-150",
                          isActive
                            ? "border-emerald-600/35 bg-emerald-500/10 font-medium text-emerald-700 dark:border-emerald-500/35 dark:text-emerald-300"
                            : "border-transparent text-ink-500 hover:bg-black/[0.03] hover:text-ink-900 dark:text-ink-400 dark:hover:bg-white/[0.04] dark:hover:text-ink-100"
                        )}
                      >
                        <span className="truncate">{sec.label}</span>
                        {isActive && (
                          <span className="ml-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>
          </div>
        </div>

        {showScrollTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed right-8 bottom-8 z-40 rounded-full border border-black/[0.1] bg-ink-950 p-3 text-white transition-colors duration-150 hover:bg-emerald-600 dark:border-white/[0.12] dark:bg-[#11141c] dark:hover:bg-emerald-500 dark:hover:text-ink-950"
            title="Scroll to top"
            aria-label="Scroll to top"
          >
            <ChevronUp size={18} strokeWidth={1.5} />
          </button>
        )}
      </article>
    </>
  );
}
