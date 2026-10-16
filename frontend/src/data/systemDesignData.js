import { Link2 } from "lucide-react";
import { getSystemDesignArticleById } from "./systemDesignArticles";

export const SYSTEM_DESIGNS = [
  {
    id: "url-shortener",
    category: "Foundational",
    tag: "URL Shortener",
    title: "URL Shortener (TinyURL / Bitly)",
    subtitle: "// DISTRIBUTED KEY-VALUE & REDIRECT ENGINE",
    domain: "Key-Value Stores • Caching • HTTP Redirects",
    icon: Link2,
    accent: "from-lime-400 to-emerald-400",
    badgeColor: "border-lime-500/30 bg-lime-500/10 text-lime-600 dark:text-lime-300",
    hasFullArticle: true,
    imageUrl: "/images/system-design/url-shortener-hld.webp",
    summary:
      "A foundational high-throughput distributed system designed to convert long web URLs into compact 7-character aliases, redirecting millions of users with sub-2ms latency.",
    architectureSteps: [
      { step: "01", name: "Client Request", detail: "User submits long URL via web UI or API endpoint" },
      { step: "02", name: "Token Allocation", detail: "Key Generation Service (KGS) grabs an unused 7-char Base62 token" },
      { step: "03", name: "Store & Cache", detail: "Writes mapping to PostgreSQL DB & pre-warms Redis in-memory cache" },
      { step: "04", name: "Fast Redirect", detail: "On visit, Redis serves HTTP 302 Found redirect in ~1.2ms without hitting DB" },
    ],
    deepDiveNotes: [
      {
        title: "Base62 Encoding vs MD5 Hashing",
        desc: "Using characters [a-z, A-Z, 0-9] gives 62 possible characters. A 7-character string produces 62⁷ = 3,521,614,606,208 (over 3.5 Trillion) unique URLs! This completely eliminates hash collision issues and database locking that occur when truncating MD5/SHA-256 hashes.",
        highlight: "62⁷ ≈ 3.52 Trillion URLs — zero collision risk.",
      },
      {
        title: "Key Generation Service (KGS)",
        desc: "A standalone background microservice pre-generates unique 7-character Base62 keys in advance and stores them in a key-store. Application servers read batches of keys into memory. When a shorten request arrives, the server assigns a key in microsecond time with zero database lock contention.",
        highlight: "Decoupled token generation eliminates write bottlenecks.",
      },
      {
        title: "HTTP 302 vs 301 Redirect Trade-Off",
        desc: "HTTP 301 (Moved Permanently) is cached by the user's browser, meaning future clicks bypass your servers completely. HTTP 302 (Found / Temporary) ensures every single click passes through your server and Redis cache, enabling accurate click analytics, geographic tracking, and abuse prevention.",
        highlight: "HTTP 302 preserves 100% analytics tracking and link revocation.",
      },
      {
        title: "Cache-Aside with Redis LRU",
        desc: "According to the Pareto Principle (80/20 rule), 20% of your links generate 80% of all redirect requests. By keeping the top 20% in Redis with Least Recently Used (LRU) eviction, queries resolve in sub-2ms, protecting the persistent database from read traffic storms.",
        highlight: "Sub-2ms response time for 80% of all redirect traffic.",
      },
      {
        title: "Database Schema & Sharding",
        desc: "Stores short_code (primary indexed B-Tree key), original_url, user_id, created_at, expires_at, and click_count. Horizontal sharding uses consistent hashing: hash(short_code) % N to distribute data evenly across multiple database nodes.",
        highlight: "B-Tree indexed lookup with consistent hash sharding.",
      },
    ],
    technologies: ["Redis LRU", "Node.js / Express", "PostgreSQL", "ZooKeeper", "Apache Kafka"],
    readiness: "Complete Study Blueprint",
    stats: {
      traffic: "20,000 Read QPS",
      latency: "1.2ms Cache Hit",
      storage: "15 TB (5 Years)",
      cache: "170 GB Redis Cluster",
    },
  },
];

export const CATEGORIES = ["All", "Foundational"];

export const getSystemDesignById = (id) => {
  return SYSTEM_DESIGNS.find((s) => s.id === id) || null;
};

export { getSystemDesignArticleById };
