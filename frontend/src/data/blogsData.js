export const BLOG_POSTS = [
  {
    slug: "url-shortener",
    title: "URL Shortener System Design: Base62 Math, Redis LRU & KGS Architecture",
    subtitle: "Building a scalable link shortening engine handling 20,000 QPS with sub-2ms cache redirect latency.",
    source: "System Design",
    url: "",
    excerpt: "Deep dive into TinyURL/Bitly architecture: Base62 encoding math (62⁷ ≈ 3.52 Trillion combinations), decoupled Key Generation Service (KGS), Redis LRU caching, and horizontal database sharding.",
    imageUrl: "/images/system-design/url-shortener-hld.webp",
    publishedAt: "2026-10-14T09:00:00.000Z",
    readTime: "8 min read",
    content: "A complete architectural breakdown of a distributed URL shortening service. Key design challenges include generating compact collision-free 7-character tokens, maintaining sub-2ms HTTP 302 redirects via Redis Least Recently Used (LRU) caching, handling 20,000 read QPS, and sharding persistent database storage using consistent hashing.",
    tags: ["System Design", "Distributed Systems", "Redis", "Key-Value Store"],
    category: "System Design",
    featured: true,
  },
  {
    slug: "learning-cybersecurity-web-development-and-ai-together",
    title:
      "How I'm Learning Cybersecurity, Web Development, and AI Together as a BCA Student",
    subtitle:
      "A beginner's roadmap built from curiosity, experimentation, and steady practice.",
    source: "Medium",
    url: "https://medium.com/@nikhilxagr/artificial-intelligence-concepts-for-beginnershow-im-learning-cybersecurity-web-development-and-a899bc6b4d1c",
    excerpt:
      "A reflection on learning across three connected areas and building a realistic roadmap as a student.",
    imageUrl: "/images/blogs/artmet03.webp",
    publishedAt: "2025-12-14T08:30:00.000Z",
    readTime: "5 min read",
    content:
      "This article shares how I combine cybersecurity, web development, and AI learning without burnout. I focus on consistency over speed, build small projects that connect theory to practice, and track what actually improves my skills over time.",
    tags: ["Cybersecurity", "Web Development", "AI", "Student Journey"],
    category: "Cybersecurity",
    featured: false,
  },
  {
    slug: "chatbots-and-the-mindset-of-college-students",
    title:
      "How Chatbots Are Shaping the Mindset of College Students: A Double-Edged Sword",
    subtitle:
      "A look at how AI tools influence habits, thinking, and learning behavior.",
    source: "LinkedIn",
    url: "https://www.linkedin.com/pulse/how-chatbots-shaping-mindset-college-students-sword-nikhil-agrahari-gjhbf/",
    excerpt:
      "An opinion piece exploring opportunities and risks that chatbot-driven learning brings to students.",
    imageUrl: "/images/blogs/artmet02.webp",
    publishedAt: "2026-03-22T09:00:00.000Z",
    readTime: "4 min read",
    content:
      "Chatbots are changing how students think, learn, and solve problems. The article explores both sides: faster doubt resolution and learning support, but also overdependence, shallow understanding, and reduced critical thinking if used without discipline.",
    tags: ["AI", "Education", "College Students"],
    category: "AI",
    featured: false,
  },
  {
    slug: "how-metro-systems-work",
    title:
      "How Metro Systems Work: Token Allocation, Technology Behind the Scenes and the Future of Driverless Trains",
    subtitle:
      "A curiosity-driven breakdown of public transport technology and its future.",
    source: "LinkedIn",
    url: "https://www.linkedin.com/pulse/how-metro-systems-work-token-allocation-technology-behind-agrahari-wgxqf/",
    excerpt:
      "A practical look at systems and technology that power metro networks and modern rail experiences.",
    imageUrl: "/images/blogs/artmet01.webp",
    publishedAt: "2026-03-28T11:15:00.000Z",
    readTime: "6 min read",
    content:
      "This breakdown explains token allocation, automatic fare collection, signaling, and the evolution toward driverless metro trains. It connects the passenger experience with the underlying system design and safety technology.",
    tags: ["Technology", "Infrastructure", "Innovation"],
    category: "Technology",
    featured: false,
  },
  {
    slug: "india-produces-toppers-the-world-produces-innovators",
    title:
      "India Produces Toppers. The World Produces Innovators. Why Are We Falling Behind?",
    subtitle:
      "A student perspective on education, problem solving, and the gap between marks and innovation.",
    source: "LinkedIn",
    url: "https://www.linkedin.com/pulse/india-produces-toppers-world-innovators-why-we-falling-agrahari-fyp0c/",
    excerpt:
      "A reflective piece on the difference between exam-oriented success and innovation-oriented learning.",
    imageUrl: "/images/blogs/artmet04.webp",
    publishedAt: "2026-04-07T15:45:00.000Z",
    readTime: "5 min read",
    content:
      "The article compares a marks-first education pattern with innovation-first ecosystems. It highlights the need for project-based learning, research culture, creative risk-taking, and problem-solving skills beyond exams.",
    tags: ["Education", "Innovation", "Student Perspective"],
    category: "Education",
    featured: false,
  },
];

export const BLOG_CATEGORIES = [
  "All",
  "System Design",
  "AI",
  "Cybersecurity",
  "Web Development",
  "Education",
  "Technology",
];
