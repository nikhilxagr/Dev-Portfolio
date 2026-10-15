import {
  Link2,
  Car,
  UtensilsCrossed,
  ShoppingBag,
  Camera,
  MessageSquare,
} from "lucide-react";
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
  {
    id: "uber-dispatch",
    category: "Geospatial",
    tag: "Ride-Hailing",
    title: "Uber / Ola Backend (Real-Time Driver Dispatch)",
    subtitle: "// HIGH-CONCURRENCY GEOSPATIAL MATCHING",
    domain: "Geospatial Indexing • WebSockets • Surge Pricing",
    icon: Car,
    accent: "from-cyan-400 to-blue-500",
    badgeColor: "border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
    summary:
      "Tracking millions of moving drivers and passengers in real time, matching riders to the nearest driver within 5km in sub-second time, and managing dynamic surge pricing.",
    architectureSteps: [
      { step: "01", name: "GPS Telemetry", detail: "Driver apps stream live latitude/longitude every 4 seconds over persistent WebSockets" },
      { step: "02", name: "Spatial Indexing", detail: "Location Ingest Service maps coordinates to Google S2 / Uber H3 hexagonal grid cells" },
      { step: "03", name: "Ride Request", detail: "Rider requests cab; matching engine queries nearby S2 cells in memory" },
      { step: "04", name: "Dispatch & Surge", detail: "Kafka streams compute supply/demand ratio to calculate surge pricing in real time" },
    ],
    deepDiveNotes: [
      {
        title: "Google S2 & Uber H3 Hexagonal Grid",
        desc: "Earth's surface is projected into hierarchical hexagonal cells. Rather than running slow SQL distance queries on millions of rows, the matching engine only queries drivers inside the rider's active S2 cell and the 6 neighboring adjacent cells (5km radius).",
        highlight: "Hexagonal cells provide uniform distance to all 6 adjacent neighbors.",
      },
      {
        title: "Quadtree In-Memory Indexing",
        desc: "A 2D spatial tree structure held in memory partitions geographic regions. Dense metropolitan areas have deeply subdivided child nodes, allowing lightning-fast driver discovery in sub-millisecond memory lookups.",
        highlight: "Dynamic subdivisions adjust memory density based on city traffic.",
      },
      {
        title: "Persistent WebSocket Gateway",
        desc: "Persistent bidirectional TCP connections keep driver location telemetry lightweight, bypassing the high latency and overhead of repeated HTTP handshake negotiation.",
        highlight: "Telemetry updates stream every 4 seconds without HTTP overhead.",
      },
      {
        title: "Real-Time Surge Pricing Engine",
        desc: "Kafka streams continuously aggregate incoming ride requests against active available drivers per S2 cell. If the demand/supply ratio exceeds 1.5, a dynamic surge multiplier is applied automatically.",
        highlight: "Stream processing recalculates localized pricing every 10 seconds.",
      },
    ],
    technologies: ["Google S2 / H3", "WebSockets", "Redis Geo", "Go / Node.js", "Apache Kafka"],
    readiness: "Core Study Notes Ready",
    stats: {
      traffic: "1M+ Concurrent Drivers",
      latency: "Sub-second Matching",
      storage: "TimescaleDB Time-Series",
      cache: "Redis Spatial Geo-Set",
    },
  },
  {
    id: "zomato-delivery",
    category: "Logistics",
    tag: "Food Delivery",
    title: "Zomato / Swiggy Food Delivery Platform",
    subtitle: "// HYPERLOCAL LOGISTICS & STATE MACHINES",
    domain: "Order State Machines • Inventory Locks • Rider Routing",
    icon: UtensilsCrossed,
    accent: "from-rose-400 to-amber-400",
    badgeColor: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    summary:
      "Coordinating 3 independent parties (Customer, Restaurant Merchant, Delivery Rider) with kitchen prep time estimation, stock reservation, and optimal dispatch batching.",
    architectureSteps: [
      { step: "01", name: "Order Placed", detail: "Customer orders; Redis distributed lock reserves dish inventory instantly" },
      { step: "02", name: "Merchant Accept", detail: "Restaurant tablet notifies kitchen with expected preparation timer (15-20 min)" },
      { step: "03", name: "Rider Batching", detail: "Dispatch algorithm assigns rider so arrival coincides exactly with food packing" },
      { step: "04", name: "Live Tracking", detail: "Rider GPS breadcrumbs stream to customer UI via MQTT / WebSocket events" },
    ],
    deepDiveNotes: [
      {
        title: "Distributed Order State Machine",
        desc: "Orders strictly transition through verified states: Placed → Confirmed → Cooking → Ready → Picked Up → Delivered. Each state update triggers idempotent background workers to prevent skipped steps or ghost orders.",
        highlight: "Strict lifecycle state machine guarantees zero order dropouts.",
      },
      {
        title: "Redis Distributed Locks (Redlock)",
        desc: "Prevents race conditions where two customers attempt to purchase the last available serving of a limited menu item simultaneously. A lock is acquired in Redis for 5 seconds during checkout validation.",
        highlight: "Eliminates overselling during high-concurrency lunch/dinner rushes.",
      },
      {
        title: "Batch Dispatching Heuristics",
        desc: "Algorithms bundle multiple customer orders from neighboring restaurants to a single delivery partner if their drop-off routes align, maximizing rider earnings and cutting delivery times.",
        highlight: "Traveling Salesperson heuristic groups adjacent orders seamlessly.",
      },
      {
        title: "Kitchen Preparation Estimation",
        desc: "Machine learning models predict preparation delays based on historical dish complexity and active restaurant rush hours to dispatch riders at the exact moment food is being bagged.",
        highlight: "Reduces rider waiting time at restaurants from 12 mins to under 3 mins.",
      },
    ],
    technologies: ["Redis Redlock", "PostgreSQL", "WebSockets / MQTT", "Python / FastAPI", "RabbitMQ"],
    readiness: "Core Study Notes Ready",
    stats: {
      traffic: "100k Concurrent Orders",
      latency: "15ms State Transitions",
      storage: "PostgreSQL Master-Replica",
      cache: "Redis Redlock Cluster",
    },
  },
  {
    id: "blinkit-darkstores",
    category: "Quick-Commerce",
    tag: "Quick Commerce",
    title: "Blinkit / Zepto 10-Minute Dark Store Logistics",
    subtitle: "// HYPERLOCAL MICRO-WAREHOUSE DISPATCH",
    domain: "Geofenced Inventory • Picker Routing • Stock Reservation",
    icon: ShoppingBag,
    accent: "from-amber-400 to-lime-400",
    badgeColor: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    summary:
      "Guaranteeing grocery delivery in 10 minutes through hyper-dense micro-warehouses (dark stores), real-time stock reservations, and in-store picker optimization.",
    architectureSteps: [
      { step: "01", name: "Store Mapping", detail: "Customer is strictly geofenced to the nearest dark store within 1.5 - 2.5 km" },
      { step: "02", name: "Stock Lock", detail: "Cart checkout triggers an 8-minute inventory reservation lock via Redis TTL" },
      { step: "03", name: "Picker Route", detail: "In-store picker app shows optimal 2D walking path to gather items in < 90 seconds" },
      { step: "04", name: "Instant Dispatch", detail: "Pre-staged delivery rider picks up sealed bag and completes delivery in 7-8 min" },
    ],
    deepDiveNotes: [
      {
        title: "Strict Hyperlocal Geofencing",
        desc: "Customers can only order what is physically in stock at their local micro-warehouse (dark store). If a dark store runs out of milk, the app shows out-of-stock immediately rather than fulfilling from a distant center that would blow past the 10-minute promise.",
        highlight: "Geofence boundary restricted to a tight 2km radius.",
      },
      {
        title: "8-Minute Cart Reservation Lock",
        desc: "To prevent overselling high-demand groceries, items are held with a Redis TTL timer when checkout starts. If payment isn't completed in 8 minutes, the inventory returns to the public pool automatically.",
        highlight: "TTL-backed inventory reservation prevents checkout cart hoarding.",
      },
      {
        title: "Picker Path Optimization",
        desc: "Warehouse shelves are mapped with 2D graph coordinates. Algorithms sort the picking list so the warehouse worker walks the shortest possible route to pack all items under 90 seconds.",
        highlight: "Shortest walking path algorithm keeps picking time under 90 seconds.",
      },
      {
        title: "Predictive Restocking Engine",
        desc: "Monitors localized consumption velocity (e.g. ice cream spikes on hot Friday nights) and auto-generates replenishment truck schedules from main distribution hubs.",
        highlight: "Automated replenishment forecasting based on real-time order velocity.",
      },
    ],
    technologies: ["PostGIS Geofencing", "Redis TTL", "Node.js", "MongoDB", "Graph Routing"],
    readiness: "Core Study Notes Ready",
    stats: {
      traffic: "10-Min Delivery SLA",
      latency: "90s Picking Time",
      storage: "MongoDB Sharded Inventory",
      cache: "Redis 8-Min TTL Locks",
    },
  },
  {
    id: "instagram-feed",
    category: "Social Graph",
    tag: "Social Feed",
    title: "Instagram / Twitter (Personalized Feed Generation)",
    subtitle: "// SOCIAL GRAPH & FANOUT-ON-WRITE VS PULL",
    domain: "Feed Caching • Celebrity Fanout • Media Sharding",
    icon: Camera,
    accent: "from-purple-400 to-pink-400",
    badgeColor: "border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300",
    summary:
      "Delivering personalized photo and video feeds to millions of users while solving the celebrity fanout problem when accounts with 100M+ followers post.",
    architectureSteps: [
      { step: "01", name: "Post Upload", detail: "User uploads image/video; edge CDN compresses & generates multi-resolution segments" },
      { step: "02", name: "Fanout Check", detail: "Decides whether to push post to followers (Fanout-on-Write) or pull on open" },
      { step: "03", name: "Feed Assembly", detail: "Home timeline precomputed in Redis Sorted Sets ordered by ranking algorithm" },
      { step: "04", name: "Bloom Filter", detail: "Checks user seen-history to guarantee users never see the same post twice" },
    ],
    deepDiveNotes: [
      {
        title: "Hybrid Fanout Model (Push vs Pull)",
        desc: "For normal users, their posts are pushed directly to their friends' timeline caches (Fanout-on-Write). For celebrities with 100M+ followers, writing 100M rows would crash the database; instead, followers pull celebrity posts dynamically upon opening the app.",
        highlight: "Push for standard users; dynamic pull for 100M+ celebrity accounts.",
      },
      {
        title: "Redis Sorted Sets for Timeline",
        desc: "Timelines are stored as Redis Sorted Sets with post IDs scored by ranking/timestamp. Fetching the top 20 posts takes sub-millisecond range queries: ZREVRANGEBYSCORE.",
        highlight: "O(log(N) + M) timeline retrieval time.",
      },
      {
        title: "Bloom Filters for Seen-State",
        desc: "Ultra-fast in-memory probabilistic data structures check whether a user has already seen a specific post in their feed, discarding duplicate impressions instantly.",
        highlight: "Prevents duplicate feed impressions with minimal memory footprint.",
      },
      {
        title: "Edge CDN Video Chunking (HLS)",
        desc: "Videos are chunked into 2-second segments and cached at local edge servers around the world, ensuring smooth playback with zero initial buffering.",
        highlight: "Sub-second video playback via localized edge CDN chunk caching.",
      },
    ],
    technologies: ["Redis Sorted Sets", "AWS S3 / CloudFront", "Bloom Filters", "Cassandra", "Go / Python"],
    readiness: "Core Study Notes Ready",
    stats: {
      traffic: "500M Daily Active Users",
      latency: "Sub-50ms Feed Load",
      storage: "Cassandra + AWS S3",
      cache: "Redis Sorted Set Timelines",
    },
  },
  {
    id: "whatsapp-chat",
    category: "Messaging",
    tag: "Chat Systems",
    title: "WhatsApp / Telegram (Real-Time Messaging)",
    subtitle: "// REAL-TIME SOCKETS & END-TO-END ENCRYPTION",
    domain: "Persistent WebSockets • Offline Queues • E2EE",
    icon: MessageSquare,
    accent: "from-emerald-400 to-teal-400",
    badgeColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    summary:
      "Delivering billions of chat messages with sub-second delivery, offline synchronization, presence status, and end-to-end cryptographic encryption.",
    architectureSteps: [
      { step: "01", name: "Socket Connection", detail: "Client maintains persistent lightweight WebSocket/TCP connection to gateway" },
      { step: "02", name: "Direct Routing", detail: "If recipient is online, message is dispatched directly through RAM in ~15ms" },
      { step: "03", name: "Offline Store", detail: "If recipient is offline, message is queued in Cassandra message store" },
      { step: "04", name: "Delivery Acknowledge", detail: "On reconnect, queued messages flush to phone; sender receives double ticks" },
    ],
    deepDiveNotes: [
      {
        title: "Persistent TCP / WebSocket Gateways",
        desc: "Active users stay connected to connection gateway servers. A global Redis presence server tracks which server holds the active socket for each user ID.",
        highlight: "Stateful connection gateways maintain persistent socket channels.",
      },
      {
        title: "End-to-End Encryption (Signal Protocol)",
        desc: "Messages are encrypted directly on the sender's device using public/private key pairs. The chat server only routes encrypted binary blobs and cannot read message contents.",
        highlight: "Zero-knowledge server forwarding via Double Ratchet algorithm.",
      },
      {
        title: "Offline Message Queuing",
        desc: "Messages for offline users are saved to a durable distributed store (Cassandra). The moment the phone reconnects to internet, the server pushes pending messages and deletes them from server storage.",
        highlight: "Store-and-forward architecture guarantees at-least-once delivery.",
      },
      {
        title: "Distributed Read Receipts",
        desc: "Double gray tick (stored on server & received by device) and double blue tick (read by user) are event receipts transmitted over the same socket pipeline.",
        highlight: "Lightweight acknowledgment packets update message status flags.",
      },
    ],
    technologies: ["WebSockets", "Cassandra / ScyllaDB", "Signal Protocol", "Redis Presence", "Erlang / Go"],
    readiness: "Core Study Notes Ready",
    stats: {
      traffic: "100 Billion Messages / Day",
      latency: "15ms End-to-End",
      storage: "Distributed Cassandra",
      cache: "Redis Presence Registry",
    },
  },
];

export const CATEGORIES = ["All", "Foundational", "Geospatial", "Logistics", "Quick-Commerce", "Social Graph", "Messaging"];

export const getSystemDesignById = (id) => {
  return SYSTEM_DESIGNS.find((s) => s.id === id) || null;
};

export { getSystemDesignArticleById };
