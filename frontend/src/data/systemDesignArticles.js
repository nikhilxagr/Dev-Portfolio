/**
 * System Design Comprehensive Study Notes & Deep-Dive Articles
 * Written in clear, human, practical engineering language.
 * Clean, structured, and easy for any developer or student to understand.
 */

export const SYSTEM_DESIGN_ARTICLES = {
  "url-shortener": {
    id: "url-shortener",
    title: "URL Shortener System Design (TinyURL / Bitly)",
    subtitle: "How to Build a High-Throughput Distributed Key-Value & Redirection Engine",
    readingTime: "12 min read",
    level: "System Architecture • HLD & LLD Guide",
    lastUpdated: "October 2026",
    author: "Nikhil Agrahari",
    authorRole: "Full Stack & Distributed Systems Engineer",
    tableOfContents: [
      { id: "overview", label: "1. The Core Problem: Why is this challenging?" },
      { id: "requirements", label: "2. What the System Needs to Do (Requirements)" },
      { id: "capacity", label: "3. Sizing Up the System: Traffic, Storage & Cache" },
      { id: "hld", label: "4. The Big Picture: High-Level Architecture (HLD)" },
      { id: "request-flow", label: "5. Two Lifecycles: Creating a Link vs. Redirecting" },
      { id: "data-model", label: "6. How We Store the Data: Database Schema Design" },
      { id: "api-design", label: "7. REST API Design & Contracts" },
      { id: "algorithms", label: "8. The Key Secret: How 7 Characters Give 3.5 Trillion URLs" },
      { id: "scalability", label: "9. Scaling Up: Redis Caching, Sharding & HTTP 302" },
      { id: "bottlenecks", label: "10. Real-World Disasters & Edge Cases (Cache Stampede, Phishing)" },
      { id: "checklist", label: "11. Interview Cheat Sheet & Key Takeaways" },
    ],

    // ── SECTION 1: OVERVIEW ──
    overview: {
      lead: "Why is designing a URL shortener like TinyURL or Bitly one of the most classic system design interview questions? On the surface, it sounds like a weekend project: take a long link like 'https://example.com/very/long/article/slug?param=123', convert it into a short string like 'https://short.ly/aB3x9Qz', and redirect visitors when they click it. But once you scale it to real-world production—handling 1 billion redirects every day, keeping response times under 2 milliseconds, and ensuring no two users ever clash for the same code—it tests almost every foundational pillar of backend architecture.",
      keyPoints: [
        {
          title: "The Read-Heavy Reality",
          desc: "For every 1 link created, over 100 people click on it. The system is overwhelmingly read-heavy, which completely dictates how we design the database and caching tiers.",
        },
        {
          title: "The Speed Guarantee",
          desc: "When a user taps a short link on Twitter or in an SMS, they expect the destination page to start loading instantly. The redirect must resolve in under 2ms.",
        },
        {
          title: "Zero Collision Guarantee",
          desc: "The short alias must be strictly unique. Two different users submitting different long URLs can never receive the same short code.",
        },
      ],
    },

    // ── SECTION 2: REQUIREMENTS ──
    requirements: {
      intro: "Whenever you approach a system design problem, always divide expectations into functional requirements (what features the app provides) and non-functional requirements (the performance and reliability SLAs).",
      functional: [
        {
          title: "Generate Short Links",
          desc: "Given any valid long URL, the system returns a unique 7-character alias (e.g. short.ly/aB3x9Qz).",
          mustHave: true,
        },
        {
          title: "Lightning-Fast Redirection",
          desc: "Visiting the short URL immediately redirects the user to the original destination.",
          mustHave: true,
        },
        {
          title: "Custom Aliases (Optional)",
          desc: "Users can pick their own custom vanity link (e.g. short.ly/nikhil-portfolio) if it is available.",
          mustHave: false,
        },
        {
          title: "Link Expiration (TTL)",
          desc: "Links can optionally expire after a user-chosen date (e.g. 30 days) to prevent stale links from cluttering storage.",
          mustHave: false,
        },
        {
          title: "Real-Time Click Analytics",
          desc: "Creators can view how many times their link was clicked, along with the visitor's country, device, and referrer.",
          mustHave: true,
        },
        {
          title: "Link Management & Deletion",
          desc: "Registered users can disable or permanently remove links they have generated.",
          mustHave: false,
        },
      ],
      nonFunctional: [
        {
          title: "High Availability (99.99%)",
          desc: "Links are placed in social media bios, emails, and marketing campaigns. If our redirect service goes down, millions of links break across the web. Uptime is paramount.",
        },
        {
          title: "Ultra-Low Latency (< 10ms Redirect)",
          desc: "The redirect lookup must be served in microseconds from an in-memory cache, so the user perceives zero delay before the target page loads.",
        },
        {
          title: "Unpredictable Short Codes",
          desc: "Short codes should not be simple sequential numbers (1, 2, 3), otherwise anyone can easily scrape and discover every link in your database.",
        },
        {
          title: "High Scalability",
          desc: "The system should gracefully absorb 10 Million new links and over 1 Billion redirection requests every single day without degraded performance.",
        },
        {
          title: "Abuse & Malware Protection",
          desc: "Spammers love shorteners to mask phishing websites. The system must verify URLs against threat databases and rate-limit abusive IP addresses.",
        },
      ],
    },

    // ── SECTION 3: CAPACITY ESTIMATION ──
    capacity: {
      intro: "Before picking databases or writing code, we need a quick reality check on the numbers. This is known as 'back-of-the-envelope calculation'. It tells us how much RAM we need for caching and how much hard disk space we need over 5 years.",
      traffic: [
        { metric: "Read / Write Ratio", value: "100 : 1", detail: "For every link created, ~100 people click and redirect." },
        { metric: "New URLs Created", value: "10 Million / day", detail: "Roughly 116 link creations every second." },
        { metric: "Redirect Requests", value: "1 Billion / day", detail: "Roughly 11,574 redirects every second (Peak: ~60,000/s)." },
      ],
      calculations: [
        {
          title: "1. Write Throughput (Link Creation)",
          formula: "10,000,000 URLs / 86,400 seconds = ~116 writes/second",
          note: "Even if traffic spikes by 5x during peak hours, we are looking at ~580 writes per second. A single modern database can easily handle this write volume.",
        },
        {
          title: "2. Read Throughput (Link Redirection)",
          formula: "1,000,000,000 redirects / 86,400 seconds = ~11,574 reads/second",
          note: "During peak traffic spikes (e.g. a viral tweet), reads can hit 50,000 to 60,000 requests per second. A standard SQL database running on hard drives will choke under this load. We MUST put an in-memory caching layer (Redis) in front of the database.",
        },
        {
          title: "3. Storage Sizing (5-Year Plan)",
          formula: "Assume each URL record takes ~500 Bytes (ID, Short Code, Long URL, User ID, Created At, Expires At).",
          breakdown: "• Daily Storage: 10 Million × 500 Bytes = 5 GB / day\n• Yearly Storage: 5 GB × 365 = ~1.83 TB / year\n• 5-Year Storage: 1.83 TB × 5 = ~9.15 TB total storage",
          note: "9 TB over 5 years is very reasonable! A sharded PostgreSQL setup or a distributed key-value store like Cassandra or DynamoDB can store this effortlessly.",
        },
        {
          title: "4. Memory & Cache Estimation (The 80/20 Pareto Rule)",
          formula: "In the real world, 20% of your links generate 80% of all redirect traffic (the viral links). We only need to keep that hot 20% in fast RAM!",
          breakdown: "• Daily redirect volume = 1 Billion requests\n• Hot 20% working set = 200 Million URL mappings\n• Required RAM = 200 Million × 500 Bytes = 100 GB RAM",
          note: "A 100 GB Redis cluster easily holds all active viral links in memory. This means over 80% to 90% of all redirect requests will be answered directly from RAM in ~1.2ms without ever touching our persistent disk database!",
        },
      ],
    },

    // ── SECTION 4 & 5: HLD & REQUEST FLOW WITH FIGURES ──
    figures: [
      {
        id: "figure-1",
        number: "Figure 1",
        title: "High-Level Architecture (HLD)",
        src: "/images/system-design/url-shortener-hld.webp",
        alt: "High-Level System Architecture Diagram of URL Shortener Service",
        caption: "Figure 1: High-Level Architecture showing Client, DNS/CDN, API Gateway, Load Balancers, URL Creation Service, Redirect Service, Redis LRU Cache, Database Shards, Message Queue (Kafka), and Asynchronous Analytics Engine.",
      },
      {
        id: "figure-2",
        number: "Figure 2",
        title: "End-to-End Request Pipeline (Creation vs. Redirection)",
        src: "/images/system-design/url-shortener-request-flow.webp",
        alt: "URL Shortener Request Flow and Execution Sequence Diagram",
        caption: "Figure 2: Complete execution pipeline illustrating both the Write Lifecycle (URL validation, Key Generation Service token assignment, DB persistence) and Read Lifecycle (Redis cache lookup, fallback DB query, and async Kafka event publishing).",
      },
      {
        id: "figure-3",
        number: "Figure 3",
        title: "Database Schema & Entity-Relationship Model",
        src: "/images/system-design/url-shortener-data-model.webp",
        alt: "Data Model and ER Schema Diagram of URL Shortener System",
        caption: "Figure 3: Relational and distributed data model detailing core entities: User Account, ShortURL Record, URLMapping Table, CustomAlias Index, and ClickEvent Analytics entity.",
      },
      {
        id: "figure-4",
        number: "Figure 4",
        title: "Object-Oriented Class Design (SOLID Principles)",
        src: "/images/system-design/url-shortener-lld-class.webp",
        alt: "Low-Level Design and OOP Class Architecture Diagram",
        caption: "Figure 4: Low-Level OOP Class Diagram adhering strictly to SOLID principles: URLService, RedirectService, IKeyGenerator interface, Base62Encoder, TokenBucketRateLimiter, and ICacheRepository.",
      },
      {
        id: "figure-5",
        number: "Figure 5",
        title: "Multi-Region Distributed Scaling & Edge Caching",
        src: "/images/system-design/url-shortener-scalability.webp",
        alt: "Distributed Scalability and Multi-Region Deployment Architecture",
        caption: "Figure 5: Enterprise-grade scalability setup featuring Anycast DNS, Geo-Distributed Edge CDNs, Redis Cache Clustering, Database Sharding with Consistent Hashing, and Kafka Stream Decoupling.",
      },
    ],

    hldComponents: [
      {
        name: "1. Client Apps & Browsers",
        role: "The web UI, mobile apps, or third-party automated scripts creating or visiting short links.",
      },
      {
        name: "2. API Gateway & Rate Limiter",
        role: "The front gatekeeper. It verifies API keys, blocks malicious traffic, and uses a Token Bucket rate limiter so scripts cannot exhaust server capacity.",
      },
      {
        name: "3. Load Balancers (HAProxy / Nginx)",
        role: "Spreads incoming traffic across a pool of stateless web application servers so no single server is ever overloaded.",
      },
      {
        name: "4. URL Creation Service (Write Path)",
        role: "Validates incoming long URLs, checks threat blacklists, grabs a pre-generated token from the Key Generation Service, and writes to database and cache.",
      },
      {
        name: "5. URL Redirection Service (Read Path)",
        role: "A lightweight, hyper-optimized microservice whose only job is to look up short codes and return an HTTP 302 redirect as fast as possible.",
      },
      {
        name: "6. Key Generation Service (KGS)",
        role: "A standalone background worker that pre-generates unique 7-character Base62 keys in advance and hands them out to web servers from RAM.",
      },
      {
        name: "7. Redis LRU Cache Cluster",
        role: "Stores the most frequently visited short URLs in memory. Serves over 85% of all redirect requests with sub-2ms latency.",
      },
      {
        name: "8. Persistent Database Shards",
        role: "Relational database (PostgreSQL) or Key-Value store (DynamoDB) holding permanent records, sharded horizontally using consistent hashing.",
      },
      {
        name: "9. Apache Kafka Event Stream",
        role: "Buffers click analytics events asynchronously in the background so that recording visitor stats never slows down the user's redirect.",
      },
      {
        name: "10. Analytics Worker Pool",
        role: "Reads click logs from Kafka, extracts geolocation and device info, and updates analytics dashboards in batches.",
      },
    ],

    requestFlowSteps: {
      writeFlow: [
        {
          step: "01",
          title: "User Submits Long URL",
          desc: "A creator sends a POST request with destination URL: https://example.com/very/long/article/system-design.",
        },
        {
          step: "02",
          title: "Gateway Authentication & Rate Check",
          desc: "API Gateway verifies the user's token and confirms they haven't exceeded their rate limit (e.g. max 10 creates/minute).",
        },
        {
          step: "03",
          title: "Threat & Malware Inspection",
          desc: "The URL is checked against threat blacklists (e.g. Google Safe Browsing) to block phishing and scam URLs.",
        },
        {
          step: "04",
          title: "Instant Token Allocation (KGS)",
          desc: "Instead of running a slow hashing algorithm, the server instantly pops an unused 7-character token (e.g. 'aB3x9Qz') from memory.",
        },
        {
          step: "05",
          title: "Database Write & Cache Warm-Up",
          desc: "The mapping (aB3x9Qz -> original_url) is written to PostgreSQL and simultaneously added to Redis cache.",
        },
        {
          step: "06",
          title: "Return Short Link to Creator",
          desc: "The server responds with HTTP 201 Created: https://short.ly/aB3x9Qz. The entire write cycle finishes in ~15ms.",
        },
      ],
      readFlow: [
        {
          step: "01",
          title: "Visitor Clicks Short Link",
          desc: "A user visits https://short.ly/aB3x9Qz. The request hits the nearest Load Balancer.",
        },
        {
          step: "02",
          title: "Redis In-Memory Cache Lookup",
          desc: "The Redirect Service queries Redis for key 'url:aB3x9Qz'.",
        },
        {
          step: "03",
          title: "Cache Hit (90% of requests)",
          desc: "The original destination is found in Redis in ~1.2ms. The service checks that the link is active and not expired.",
        },
        {
          step: "04",
          title: "Cache Miss Fallback",
          desc: "If the link is not in Redis (cold link), the service queries the database (~12ms), returns the URL, and caches it in Redis for future visitors.",
        },
        {
          step: "05",
          title: "HTTP 302 Redirection Response",
          desc: "The server immediately sends an HTTP 302 Found response with header 'Location: https://example.com/...'. The visitor's browser redirects instantaneously.",
        },
        {
          step: "06",
          title: "Async Kafka Analytics Logging",
          desc: "In the background, a lightweight message is dropped into a Kafka queue with the timestamp, country, and referrer. The user never waits for analytics logging.",
        },
      ],
    },

    // ── SECTION 6: DATA MODEL & SCHEMA ──
    dataModel: {
      rationale: "When choosing a database for a URL shortener, look at how the data is queried: 99% of queries are simple key-value lookups: 'Given short_code, return original_url'. There are no complex multi-table joins on the critical redirect path. A relational database (PostgreSQL with B-Tree indexes) or a distributed NoSQL store (DynamoDB or Cassandra) works wonderfully. Below is the relational schema design.",
      tables: [
        {
          name: "urls",
          description: "The core mapping table storing every shortened link.",
          columns: [
            { name: "id", type: "BIGINT", constraint: "PRIMARY KEY AUTO_INCREMENT", desc: "Unique internal numeric sequential identifier" },
            { name: "short_code", type: "VARCHAR(10)", constraint: "UNIQUE NOT NULL, B-TREE INDEX", desc: "The unique 7-character Base62 alias (e.g. 'aB3x9Qz')" },
            { name: "original_url", type: "VARCHAR(2048)", constraint: "NOT NULL", desc: "Original destination URL (supports up to 2,048 characters)" },
            { name: "user_id", type: "BIGINT", constraint: "NULLABLE, INDEXED", desc: "Foreign key to users table (NULL if created anonymously)" },
            { name: "created_at", type: "TIMESTAMP WITH TIME ZONE", constraint: "NOT NULL DEFAULT NOW()", desc: "Timestamp when link was created" },
            { name: "expires_at", type: "TIMESTAMP WITH TIME ZONE", constraint: "NULLABLE, INDEXED", desc: "Expiration date for automatic TTL purging" },
            { name: "is_active", type: "BOOLEAN", constraint: "NOT NULL DEFAULT TRUE", desc: "Soft-delete flag allowing immediate manual deactivation" },
          ],
        },
        {
          name: "users",
          description: "Stores registered accounts for creators managing customized links.",
          columns: [
            { name: "id", type: "BIGINT", constraint: "PRIMARY KEY AUTO_INCREMENT", desc: "Unique user account identifier" },
            { name: "email", type: "VARCHAR(255)", constraint: "UNIQUE NOT NULL", desc: "Creator's login email" },
            { name: "api_key", type: "VARCHAR(64)", constraint: "UNIQUE NOT NULL, INDEXED", desc: "Secret API token used for programmatic rate-limited access" },
            { name: "tier", type: "VARCHAR(20)", constraint: "DEFAULT 'FREE'", desc: "Subscription plan (Free, Pro, Enterprise)" },
            { name: "created_at", type: "TIMESTAMP WITH TIME ZONE", constraint: "NOT NULL", desc: "Account creation date" },
          ],
        },
        {
          name: "click_analytics",
          description: "High-volume time-series table storing event logs for each redirect click.",
          columns: [
            { name: "id", type: "BIGINT", constraint: "PRIMARY KEY", desc: "Unique event identifier" },
            { name: "short_code", type: "VARCHAR(10)", constraint: "NOT NULL, INDEXED", desc: "Foreign reference to the clicked short URL" },
            { name: "clicked_at", type: "TIMESTAMP WITH TIME ZONE", constraint: "NOT NULL", desc: "Exact microsecond timestamp of click" },
            { name: "country_code", type: "CHAR(2)", constraint: "NULLABLE", desc: "ISO 2-letter country code derived from visitor IP" },
            { name: "referrer", type: "VARCHAR(512)", constraint: "NULLABLE", desc: "Referring domain (e.g. twitter.com, linkedin.com, or direct)" },
            { name: "device_type", type: "VARCHAR(30)", constraint: "NULLABLE", desc: "Visitor device category (Mobile, Desktop, Tablet)" },
          ],
        },
      ],
    },

    // ── SECTION 7: API DESIGN ──
    apis: [
      {
        method: "POST",
        endpoint: "/api/v1/urls",
        title: "Create Short Link",
        desc: "Accepts a long URL and returns a unique 7-character short link.",
        headers: ["Authorization: Bearer <API_TOKEN>", "Content-Type: application/json"],
        requestBody: JSON.stringify(
          {
            longUrl: "https://www.example.com/engineering/deep-dive-system-design-guide",
            customAlias: "sysdesign-2026",
            expiresAt: "2026-12-31T23:59:59Z",
          },
          null,
          2
        ),
        responseStatus: "201 Created",
        responseBody: JSON.stringify(
          {
            shortCode: "sysdesign-2026",
            shortUrl: "https://short.ly/sysdesign-2026",
            originalUrl: "https://www.example.com/engineering/deep-dive-system-design-guide",
            status: "ACTIVE",
            createdAt: "2026-10-15T01:30:00Z",
            expiresAt: "2026-12-31T23:59:59Z",
          },
          null,
          2
        ),
      },
      {
        method: "GET",
        endpoint: "/{shortCode}",
        title: "Redirect to Target URL",
        desc: "Looks up the short code and returns an HTTP 302 redirect header.",
        headers: ["User-Agent: Mozilla/5.0..."],
        requestBody: null,
        responseStatus: "302 Found",
        responseHeaders: [
          "Location: https://www.example.com/engineering/deep-dive-system-design-guide",
          "Cache-Control: private, max-age=90",
        ],
        responseBody: "// Browser automatically reads Location header and navigates immediately",
      },
      {
        method: "GET",
        endpoint: "/api/v1/urls/{shortCode}/stats",
        title: "Get Real-Time Analytics",
        desc: "Returns aggregated click counts, top countries, and traffic sources.",
        headers: ["Authorization: Bearer <API_TOKEN>"],
        requestBody: null,
        responseStatus: "200 OK",
        responseBody: JSON.stringify(
          {
            shortCode: "sysdesign-2026",
            totalClicks: 148290,
            uniqueVisitors: 94120,
            topCountries: [
              { country: "India (IN)", clicks: 68400, percent: "46.1%" },
              { country: "United States (US)", clicks: 42100, percent: "28.4%" },
              { country: "United Kingdom (UK)", clicks: 18200, percent: "12.3%" },
            ],
            referrers: [
              { source: "linkedin.com", count: 72000 },
              { source: "twitter.com", count: 48000 },
              { source: "direct", count: 28290 },
            ],
          },
          null,
          2
        ),
      },
    ],

    // ── SECTION 8: ALGORITHMS & LLD ──
    algorithms: {
      base62Math: {
        title: "Why Base62? The Simple Math Behind 7 Characters",
        explanation: "Why do services like Bitly use Base62 instead of Base64 or standard hexadecimal? Base62 uses characters [0-9, a-z, A-Z] (10 digits + 26 lowercase letters + 26 uppercase letters = 62 characters). Unlike Base64 which contains '+' and '/' characters that break inside web URLs, every single Base62 character is 100% URL-safe without needing escape codes.",
        mathProof: "Formula: Total Unique Combinations = 62^Length\n• 6 Characters: 62^6 = 56,800,235,584 (~56.8 Billion URLs)\n• 7 Characters: 62^7 = 3,521,614,606,208 (~3.52 Trillion URLs!)\n• 8 Characters: 62^8 = 218,340,105,584,896 (~218 Trillion URLs)",
        conclusion: "A 7-character string gives us over 3.52 Trillion unique links! Even if the world generates 10 Million new URLs every single day, it would take more than 964 years to run out of combinations.",
      },
      approachesComparison: [
        {
          approach: "Idea 1: Hash the URL with MD5 and truncate to 7 characters",
          howItWorks: "Hash the long URL: md5('https://...') = '9e107d9d372bb6826bd81d3542a419d6'. Take the first 7 letters: '9e107d9'.",
          pros: "Stateless and easy to implement.",
          cons: "The Fatal Flaw: Hash Collisions! When two completely different URLs produce the same first 7 characters, you get a collision. You must append a salt, re-hash, check the database again, and retry. Under high write concurrency, this creates massive database lock contention.",
          verdict: "❌ Not recommended for production.",
        },
        {
          approach: "Idea 2: Auto-Increment Database ID converted to Base62",
          howItWorks: "Assign each link a sequential integer ID (e.g. 100000000001) and mathematically convert that number to a Base62 string.",
          pros: "Guaranteed 100% unique, zero collision risk.",
          cons: "Two big problems: First, sequential IDs are predictable (competitors can easily scrape every link in your database by visiting /1, /2, /3). Second, a central auto-incrementing database becomes a single point of failure and bottleneck.",
          verdict: "⚠️ Works for small apps, but difficult to scale.",
        },
        {
          approach: "Idea 3: Key Generation Service (KGS) + ZooKeeper (The Production Choice)",
          howItWorks: "Instead of generating a short code when a user clicks submit, we have a standalone background service that pre-generates billions of random 7-character Base62 keys in advance and stores them in a key-store. When web servers boot up, each server grabs a batch of 10,000 keys from ZooKeeper into memory. When a user creates a link, the server pops a key from RAM instantly in microseconds.",
          pros: "Zero database write locks, zero collisions, completely unpredictable keys (stops scrapers), and sub-millisecond response times.",
          cons: "Requires managing an active-passive standby KGS server to ensure high availability.",
          verdict: "🏆 Industry Gold Standard used by Bitly and enterprise services.",
        },
      ],
      solidPrinciples: [
        { principle: "Single Responsibility (SRP)", desc: "URLCreationService only validates and stores links. RedirectService only resolves codes. AnalyticsWorker only handles event ingestion." },
        { principle: "Open / Closed (OCP)", desc: "The ID generation interface (IKeyGenerator) can be swapped from Base62 to Snowflake or UUID without touching the core URL storage logic." },
        { principle: "Liskov Substitution (LSP)", desc: "Any storage repository implementing IURLRepository (PostgresRepository, DynamoDBRepository) can be substituted seamlessly without breaking business logic." },
        { principle: "Interface Segregation (ISP)", desc: "Clients depend on slim interfaces: IURLReader (read-only queries) and IURLWriter (write-only inserts) so microservices aren't burdened with unneeded methods." },
        { principle: "Dependency Inversion (DIP)", desc: "High-level controllers depend on abstractions (ICacheService, IKeyGenerator) rather than hardcoded Redis or ZooKeeper clients." },
      ],
    },

    // ── SECTION 9: SCALABILITY & CACHING ──
    scalabilityNotes: [
      {
        title: "The Big Debate: HTTP 301 vs. HTTP 302 Redirection",
        desc: "• HTTP 301 (Moved Permanently): The visitor's browser saves the redirect in its own local browser cache forever. Next time they click the link, their browser skips our servers completely and goes straight to the destination. While this saves server bandwidth, it completely destroys your click analytics and prevents you from disabling spam or malicious links!\n• HTTP 302 (Found / Temporary): The browser contacts our server on every single click. Because our Redis cache answers in ~1.2ms, the speed is virtually instantaneous to the user, but we retain 100% analytics accuracy and the ability to instantly kill fraudulent links.",
        badge: "Core Architecture Decision",
      },
      {
        title: "Redis LRU In-Memory Caching (The 80/20 Rule)",
        desc: "By applying the Pareto Principle, 20% of your links generate 80% of all redirect requests. We deploy a multi-node Redis cluster with Least Recently Used (LRU) eviction. When memory is full, cold URLs are evicted automatically while hot viral links stay warm in RAM.",
        badge: "Sub-2ms Redirection",
      },
      {
        title: "Database Sharding via Consistent Hashing",
        desc: "To scale beyond a single database server, URL records are sharded across multiple database nodes using consistent hashing: shardId = hash(short_code) % numberOfShards. Consistent hashing prevents massive data migrations when adding new shard servers.",
        badge: "Horizontal Partitioning",
      },
      {
        title: "Decoupled Telemetry with Apache Kafka",
        desc: "Writing click logs directly to disk during a redirect would double latency and crash the servers during viral traffic spikes. Instead, the Redirect Service drops a lightweight event packet into a Kafka queue and immediately returns the 302 header to the user. Background workers process the Kafka queue at their own pace.",
        badge: "Zero-Latency Analytics",
      },
      {
        title: "Token Bucket Rate Limiting",
        desc: "Placed right at the API Gateway to prevent scraper bots from exhausting your Key Generation Service. Free users are limited to 10 creates/minute; authenticated pro users to 100/minute.",
        badge: "Abuse & DDoS Defense",
      },
    ],

    // ── SECTION 10: BOTTLENECKS & FAILURE MODES ──
    bottlenecks: [
      {
        problem: "1. The Cache Stampede (Dog-Piling Effect)",
        impact: "When a viral short link with 100,000 requests/sec expires from Redis, all 100,000 concurrent requests miss the cache at the exact same millisecond and slam the persistent database, crashing it.",
        solution: "Use Mutex / Distributed Locks (Redlock) or Probabilistic Early Expiration (XFetch algorithm) so only a single worker queries the database to refresh the cache while other requests read the existing value.",
      },
      {
        problem: "2. Single Point of Failure (SPOF) on Key Generator",
        impact: "If the Key Generation Service (KGS) goes down, new URL creation halts completely.",
        solution: "Deploy an active-passive standby KGS replica coordinated by Apache ZooKeeper. Maintain key buffers in application server memory so short URLs can continue to be generated for hours during an outage.",
      },
      {
        problem: "3. Malicious Links & Phishing Scams",
        impact: "Attackers shorten phishing or malware links to deceive users and trigger domain blacklisting.",
        solution: "Integrate Google Safe Browsing API and VirusTotal URL inspection asynchronously at creation time. Implement immediate soft-kill flags (is_active = FALSE) to deactivate flagged URLs across Redis in milliseconds.",
      },
      {
        problem: "4. Database Bloat from Millions of Expired Links",
        impact: "Billions of abandoned or expired links bloat database indexes and degrade query performance.",
        solution: "Implement a hybrid cleanup strategy: Lazy Expiration (check expires_at on access and return 410 Gone) combined with a nocturnal low-priority cron job that purges expired records in small batches during off-peak hours.",
      },
    ],

    // ── SECTION 11: INTERVIEW SUMMARY ──
    interviewSummary: {
      keyTakeaways: [
        "Separate the Write Path (URL creation) from the Read Path (URL redirection) to prevent traffic spikes from choking the system.",
        "A 7-character Base62 string provides 3.52 Trillion unique links — virtually inexhaustible.",
        "A Key Generation Service (KGS) pre-generating tokens eliminates hash collisions and database write locks.",
        "Use HTTP 302 Found over HTTP 301 to preserve real-time analytics and instant link revocation.",
        "Redis LRU cache handles 85%+ of all redirect queries in sub-2ms.",
        "Kafka message queues ensure analytics ingestion never adds latency to the user redirect.",
      ],
      tradeoffs: [
        { topic: "HTTP 301 vs 302", winner: "302 Found", reason: "Guarantees 100% accurate click analytics and immediate revocation capability." },
        { topic: "Base62 vs MD5 Hash", winner: "Base62 via KGS", reason: "Zero collision probability, no retries, fixed 7-character length." },
        { topic: "SQL vs NoSQL", winner: "Sharded PostgreSQL / DynamoDB", reason: "Key-value queries are simple; sharding by short_code ensures linear scaling." },
        { topic: "Sync vs Async Analytics", winner: "Kafka Async Queue", reason: "Redirect response takes 1.2ms without waiting for disk writes." },
      ],
    },
  },
};

export const getSystemDesignArticleById = (id) => {
  return SYSTEM_DESIGN_ARTICLES[id] || null;
};
