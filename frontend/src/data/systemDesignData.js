import { Link2 } from "lucide-react";
import { getSystemDesignArticleById } from "./systemDesignArticles";

export const SYSTEM_DESIGNS = [
  {
    id: "url-shortener",
    category: "Foundational",
    tag: "URL Shortener",
    title: "URL Shortener (TinyURL / Bitly)",
    subtitle: "Distributed Key-Value & Redirect Engine",
    domain: "Key-Value Stores · Caching · HTTP Redirects",
    icon: Link2,
    badgeColor:
      "border-emerald-600/25 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300",
    hasFullArticle: true,
    imageUrl: "/images/system-design/url-shortener-hld.webp",
    summary:
      "A high-throughput distributed system designed to map long web URLs to compact 7-character aliases and serve redirects with low tail latency.",
    architectureSteps: [
      { step: "01", name: "Client Request", detail: "User submits long URL via web UI or API endpoint" },
      { step: "02", name: "Token Allocation", detail: "Key Generation Service (KGS) assigns an unused 7-char Base62 token" },
      { step: "03", name: "Store & Cache", detail: "Writes mapping to PostgreSQL DB and pre-warms Redis in-memory cache" },
      { step: "04", name: "Fast Redirect", detail: "On visit, Redis serves HTTP 302 Found redirect in ~1.2ms without hitting DB" },
    ],
    deepDiveNotes: [
      {
        title: "Base62 Encoding vs MD5 Hashing",
        desc: "Using [a-z, A-Z, 0-9] yields 62 characters. A 7-character string provides 62^7 (over 3.52 trillion) unique URLs without hash-truncation collisions or insert retry locks.",
        highlight: "62^7 ≈ 3.52 trillion URLs with zero hash collisions.",
      },
      {
        title: "Key Generation Service (KGS)",
        desc: "A standalone background service pre-generates unused 7-character Base62 keys in batches. Application servers lease keys from memory in microseconds without row lock contention.",
        highlight: "Decoupled token allocation avoids database write bottlenecks.",
      },
      {
        title: "HTTP 302 vs 301 Redirect Trade-Off",
        desc: "HTTP 301 is cached by browsers, causing repeat clicks to bypass analytics servers. HTTP 302 routes requests through the redirect service and Redis layer for accurate click telemetry and revocation.",
        highlight: "HTTP 302 preserves click analytics and immediate link revocation.",
      },
      {
        title: "Cache-Aside with Redis LRU",
        desc: "A small hot working set (around 20% of links) serves roughly 80% of traffic. Caching hot aliases in Redis with LRU eviction handles ~1.2ms reads and shields PostgreSQL during spikes.",
        highlight: "~1.2ms cache hits for hot redirect traffic.",
      },
      {
        title: "Database Schema & Sharding",
        desc: "Stores short_code (primary B-Tree indexed key), original_url, user_id, created_at, expires_at, and click_count. Consistent hashing distributes keys evenly across shards.",
        highlight: "B-Tree indexed lookups paired with consistent hash sharding.",
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
