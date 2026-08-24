export const STATIC_PROJECTS = [
  {
    slug: "intube",
    title: "InTube",
    subtitle: "High-Performance Media Downloader & Streaming Utility",
    category: "Full Stack",
    tagline: "Stateless, privacy-focused 4K media utility and downloader for YouTube, Instagram, and Facebook.",
    description:
      "InTube is a modern, privacy-first web application engineered to analyze, transcode, and download high-definition media from YouTube (4K UHD, 1080p, Shorts, and 320kbps MP3), Instagram (Reels, Posts, Stories), and Facebook without advertisements, logins, or user tracking. Built with a dual-engine architecture to overcome cloud datacenter anti-bot restrictions, featuring real-time download telemetry and immediate ephemeral storage cleanup.",
    overview:
      "InTube is a modern, privacy-first web application engineered to analyze, transcode, and download high-definition media from YouTube (4K UHD, 1080p, Shorts, and 320kbps MP3), Instagram (Reels, Posts, Stories), and Facebook without advertisements, logins, or user tracking. Built with a dual-engine architecture to overcome cloud datacenter anti-bot restrictions, featuring real-time download telemetry and immediate ephemeral storage cleanup.",
    problemStatement:
      "Users face intrusive ads, mandatory logins, IP tracking, and datacenter bot-blocking when trying to download high-definition (4K/1080p) media and audio streams from social media platforms.",
    solutionSummary:
      "Engineered a stateless dual-engine architecture combining yt-dlp mobile protocol extraction and native Innertube API with live FFmpeg transcoding pipelines, zero-storage memory cleanup, and a neon responsive React UI.",
    outcome:
      "Delivered a production-ready, 100% stateless media utility supporting 4K UHD 60fps downloads, 320kbps MP3 extraction, sub-second telemetry UI, and reliable cloud deployment across Vercel and Render.",
    tags: [
      "React",
      "Node.js",
      "Express.js",
      "yt-dlp",
      "FFmpeg",
      "Innertube",
      "Tailwind CSS",
      "REST API",
    ],
    highlights: [
      "⚡ Tri-Platform Media Extraction for YouTube (up to 4K UHD 60fps & 320kbps MP3), Instagram (Reels, Posts), and Facebook HD.",
      "🛡️ Dual-Engine Cloud Resilience with automated fallback between yt-dlp and Innertube API to eliminate cloud IP bot-blocks.",
      "🧹 Zero-Storage Ephemeral Lifecycle where video/audio chunks are transcoded on-the-fly and wiped immediately from server memory.",
      "📊 Real-Time Download Telemetry featuring circular countdown timers, live speed (MB/s), ETA, and FFmpeg stream merger status.",
      "🔍 Production SEO & Indexing verified on Google Search Console with XML sitemaps, Open Graph cards, and Schema.org JSON-LD.",
    ],
    challenges: [
      "Overcoming YouTube's SABR anti-bot datacenter challenges on cloud environments (Render/AWS) by implementing client-skip flags and Innertube fallback systems.",
      "Engineering robust Node.js stream lifecycles using FFmpeg pipes to handle large 4K video transcoding with zero memory leaks.",
      "Implementing production-grade CORS and security headers across separate cloud hosting providers (Vercel SPA + Render backend).",
      "Designing an intuitive, responsive tri-color neon design system using Tailwind CSS with synchronized dark and light modes.",
    ],
    outcomes: [
      "Engineered a production-ready 100% stateless media downloader supporting 4K UHD, 1080p, and 320kbps MP3 audio.",
      "Built resilient fallback mechanics ensuring 99.9% extraction uptime despite cloud IP rate limits.",
      "Configured end-to-end SEO architecture including JSON-LD schema, canonical indexing, and Google Search Console verification.",
      "Successfully deployed frontend client on Vercel and streaming backend on Render.",
    ],
    techStackGrouped: {
      Frontend: ["React 18", "Vite", "Tailwind CSS", "React Router v6", "Axios"],
      Backend: ["Node.js (ESM)", "Express.js", "yt-dlp", "Innertube (YouTubei.js)", "FFmpeg"],
      "Security & Performance": ["Helmet.js", "CORS Middleware", "Express Rate Limit", "Ephemeral Stream Pipes"],
      "DevOps & Cloud": ["Vercel (Frontend)", "Render (Backend)", "Google Search Console", "Schema.org JSON-LD"],
    },
    techStack: [
      "React",
      "Node.js",
      "Express.js",
      "yt-dlp",
      "FFmpeg",
      "Tailwind CSS",
      "Innertube",
      "Vite",
    ],
    learnings: [
      "Cloud IP Anti-Bot Evasion & Fallback Engine Architecture",
      "Node.js Ephemeral Stream Pipelines & FFmpeg Transcoding",
      "Zero-Memory Storage Lifecycle Management",
      "Real-Time Telemetry & Progress Event Handling",
      "Multi-Platform Social Media Extraction Protocols",
    ],
    status: "Live in Production ✅",
    githubUrl: "https://github.com/nikhilxagr/InTube",
    liveDemoUrl: "https://intubedl.vercel.app/",
    imageUrl: "/images/projects/intube-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "vistagram",
    title: "VISTAGRAM",
    subtitle: "Full-Stack Real-Time Social Media & Media Sharing Platform",
    category: "Full Stack",
    tagline: "Full-Stack Real-Time Social Media & Media Sharing Platform",
    description:
      "Vistagram is a feature-rich, full-stack social networking platform inspired by Instagram. It delivers real-time direct messaging with instant image sharing, 24-hour interactive stories (video & image support), short-form Reels with smooth snap scrolling, dynamic home feed, comment threading with likes & moderation, and instant notifications powered by WebSockets.",
    overview:
      "Vistagram is a feature-rich, full-stack social networking platform inspired by Instagram. It delivers real-time direct messaging with instant image sharing, 24-hour interactive stories (video & image support), short-form Reels with smooth snap scrolling, dynamic home feed, comment threading with likes & moderation, and instant notifications powered by WebSockets.",
    problemStatement:
      "Modern social networking requires instant responsiveness, reliable media streaming, real-time bi-directional messaging, and high-concurrency event handling without UI latency or cross-origin session loss.",
    solutionSummary:
      "Engineered a scalable full-stack social media application with React (Vite), Redux Toolkit, Tailwind CSS, Node.js, Express.js, MongoDB, Socket.IO for live messaging/notifications, and Cloudinary for optimized media storage and transformations.",
    outcome:
      "Delivered a production-ready, highly interactive social media platform with sub-second WebSocket communication, robust dual-authentication (HTTP-Only cookies + Bearer tokens), and seamless multi-device responsiveness.",
    tags: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Socket.io",
      "Redux Toolkit",
      "Cloudinary",
      "Tailwind CSS",
      "JWT",
    ],
    highlights: [
      "💬 Real-Time Chat & Direct Messaging with live online status and direct media attachments without delay.",
      "⏱️ 24-Hour Ephemeral Stories supporting video & image uploads with auto-play, pause-on-hold, viewers list, and progress indicators.",
      "🎬 Instagram-Style Reels with smooth snap scrolling, aspect-ratio preservation, video scrubbing, and comment drawers.",
      "📰 Interactive Post Feed with likes, bookmarks/saved posts, share modal, and edit/delete capabilities.",
      "🧵 Threaded Comments System with long-press delete for authors, moderation security, and real-time comment likes.",
      "🔔 Real-Time Notification Engine for likes, comments, and follower updates over Socket.IO.",
      "🔐 Dual Authentication Architecture supporting both HTTP-Only Cookies and Bearer Tokens for cross-domain stability.",
    ],
    challenges: [
      "Implementing low-latency real-time chat with online presence tracking across active Socket.IO connections.",
      "Managing complex synchronized video playback, snap-scrolling, and responsive aspect ratios for Reels.",
      "Structuring deeply nested comment threads with real-time likes, optimistic UI updates, and author permissions.",
      "Ensuring secure, cross-domain dual authentication using both HTTP-Only cookies and Bearer tokens for production deployments.",
    ],
    outcomes: [
      "Engineered a feature-complete, modern social platform with real-time direct messaging and live presence.",
      "Delivered responsive ephemeral stories and snap-scroll reels with optimized Cloudinary media pipelines.",
      "Implemented centralized state management with Redux Toolkit for seamless feed, chat, and notification updates.",
      "Successfully deployed live production client on Vercel and backend services with robust WebSocket connectivity.",
    ],
    techStackGrouped: {
      Frontend: ["React.js (Vite)", "Redux Toolkit", "Tailwind CSS", "Axios"],
      Backend: ["Node.js", "Express.js", "Socket.IO", "Multer"],
      Database: ["MongoDB & Mongoose"],
      "Cloud & Auth": ["Cloudinary API", "JWT & Dual-Auth (Bearer + Cookies)"],
      Tools: ["Git", "GitHub", "Vercel", "Postman"],
    },
    techStack: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Socket.io",
      "Redux Toolkit",
      "Cloudinary",
      "Tailwind CSS",
      "JWT",
    ],
    learnings: [
      "WebSocket Event-Driven Architecture",
      "Cloudinary Multimedia Management & Transformations",
      "Redux Toolkit State Normalization",
      "Dual Authentication Strategies (Cookies + Bearer)",
      "Ephemeral Story Timeline Logic",
      "Mobile Snap-Scroll UX Patterns",
    ],
    status: "Completed ✅ (Live on Vercel)",
    githubUrl: "https://github.com/nikhilxagr/Vistagram",
    liveDemoUrl: "https://myvistagram.vercel.app/",
    apkUrl: "/Vistagram.apk",
    imageUrl: "/images/projects/vistagram-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "kanoon-mate",
    title: "Kanoon-Mate",
    subtitle: "AI-Powered Legal Operating System",
    category: "AI",
    tagline: "AI-Powered Legal Operating System developed during Nerds Hack Days Lucknow",
    description:
      "Kanoon-Mate is an AI-powered Legal Operating System developed during Nerds Hack Days Lucknow. It simplifies legal documents, detects relevant laws, provides AI-driven legal guidance, and demonstrates intelligent case tracking for citizens and lawyers.",
    overview:
      "Kanoon-Mate is an AI-powered Legal Operating System built during Nerds Hack Days Lucknow by Team Bro Code. The platform leverages Generative AI and intelligent workflow automation to simplify legal documents, explain legal concepts in plain language, identify applicable laws, assess legal risks, and guide users through the next steps in their legal journey. Beyond document analysis, Kanoon-Mate introduces an AI-powered case tracking workflow that demonstrates how legal updates can be intelligently managed for both citizens and legal professionals.",
    problemStatement:
      "Millions of citizens struggle to understand legal documents, while lawyers spend considerable time manually tracking hearing dates, court orders, and case progress.",
    solutionSummary:
      "Built an AI-powered Legal Operating System that combines document intelligence, AI-assisted legal guidance, workflow automation, and intelligent case tracking into a single platform.",
    outcome:
      "Developed a functional AI-powered LegalTech prototype within the hackathon, demonstrating AI-assisted legal document understanding and an intelligent case tracking workflow.",
    tags: ["Hackathon Project", "Collaboration Project"],
    highlights: [
      "📄 AI Legal Document Analysis & Summarization",
      "⚖️ Relevant Law & Section Detection",
      "🤖 AI-Powered Legal Guidance",
      "🚨 Risk Assessment & Next-Step Recommendations",
      "📅 Hearing Timeline & Deadline Tracking",
      "🔔 Smart Notifications",
      "🧠 Multi-Agent AI Workflow",
      "⚡ AI Case Tracking Prototype",
    ],
    challenges: [
      "Designing a scalable AI workflow within a limited hackathon timeframe.",
      "Demonstrating automated case tracking without direct access to live court systems.",
      "Building an intuitive LegalTech experience for both citizens and lawyers.",
      "Coordinating development, UI, AI integration, and pitching as a team under strict deadlines.",
    ],
    outcomes: [
      "Developed a functional AI-powered LegalTech prototype within the hackathon.",
      "Successfully demonstrated AI-assisted legal document understanding.",
      "Designed an intelligent AI case tracking workflow for future scalability.",
      "Enhanced skills in AI integration, rapid prototyping, teamwork, and product pitching.",
    ],
    techStackGrouped: {
      Frontend: ["React", "Tailwind CSS"],
      Backend: ["Node.js", "Express.js"],
      Database: ["MongoDB"],
      "AI & Automation": ["Gemini API", "OCR", "AI Workflow Design"],
      Tools: ["Git", "GitHub", "Vercel", "Figma"],
    },
    techStack: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Tailwind CSS",
      "Gemini API",
    ],
    collaboration: {
      team: "Bro Code",
      members: ["Nikhil Agrahari", "Gaurav Kumar Yadav", "Devansh Yadav"],
      context:
        "Built collaboratively during Nerds Hack Days Lucknow, combining expertise in Full-Stack Development, AI integration, UI/UX, and product strategy.",
    },
    learnings: [
      "Multi-Agent AI Architecture",
      "Prompt Engineering",
      "Rapid MVP Development",
      "AI Workflow Design",
      "Team Collaboration",
      "Product Thinking",
      "Technical Pitching",
      "Problem Solving Under Time Constraints",
    ],
    status: "Completed ✅ (Built during Nerds Hack Days Lucknow 2026)",
    githubUrl: "https://github.com/nikhilxagr/Kanoon-Mate--HackethonProjects-",
    liveDemoUrl: "",
    imageUrl: "/images/projects/kanoon-mate-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "fast-feast",
    title: "Fast Feast",
    category: "Web Dev",
    tagline:
      "A modern food delivery experience with a clean browsing and ordering flow.",
    description:
      "Fast Feast is a frontend-focused food delivery project built to simulate the experience of exploring menus, adding items to a cart, and following a smooth order journey.",
    problemStatement:
      "The goal was to build a user-friendly food delivery interface that felt modern, simple to navigate, and visually engaging.",
    solutionSummary:
      "The project demonstrates layout design, responsive UI structure, and clean interaction flow using core web technologies.",
    outcome:
      "Demonstrated end-to-end user flow clarity, responsive UI quality, and practical frontend implementation discipline.",
    highlights: [
      "Interactive menu browsing",
      "Cart functionality",
      "Order tracking interface",
      "Responsive frontend layout",
    ],
    techStack: ["HTML", "CSS", "JavaScript"],
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/Food%20Delivery%20Website",
    liveDemoUrl: "https://fastfeast-agr.netlify.app/",
    imageUrl: "/images/projects/fast-feast-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "snapurl",
    title: "snapURL",
    category: "Web Dev",
    tagline: "A MERN-based URL shortener for clean, shareable links.",
    description:
      "snapURL is a full stack URL shortener that helps users convert long URLs into compact links that are easier to share, organize, and manage.",
    problemStatement:
      "Long links are difficult to share neatly, especially across social posts, student work, and project documentation.",
    solutionSummary:
      "This project shows end-to-end application development with a React frontend, Express backend, and MongoDB-powered data flow.",
    outcome:
      "Demonstrated practical full-stack URL processing, persistent storage, and clean URL redirection handling.",
    highlights: [
      "Short link generation",
      "Frontend and backend integration",
      "REST API workflow",
      "Database-backed URL management",
    ],
    techStack: ["React", "Node.js", "Express.js", "MongoDB"],
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/URL%20Shortener",
    liveDemoUrl: "https://snapurl-agr.netlify.app/",
    imageUrl: "/images/projects/snapurl-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "ai-powered-code-reviewer",
    title: "AI Powered Code Reviewer",
    category: "AI",
    tagline:
      "An intelligent tool that analyzes code snippets and highlights potential fixes.",
    description:
      "AI Powered Code Reviewer uses AI concepts and automated checks to help developers spot syntax issues, improve structure, and optimize code quickly.",
    problemStatement:
      "Manual code reviews take time, and beginner developers often need quick feedback on code clarity and best practices.",
    solutionSummary:
      "Built a review interface that accepts code inputs, runs analysis logic, and outputs actionable feedback in a clear format.",
    outcome:
      "Created an accessible AI tool workflow that makes code review feedback faster and easier to understand.",
    highlights: [
      "Code analysis interface",
      "Suggestions and improvements view",
      "Developer-focused utility layout",
    ],
    techStack: ["React", "JavaScript", "AI Integration"],
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/AI%20Code%20Reviewer",
    liveDemoUrl: "https://ai-code-reviewer-agr.netlify.app/",
    imageUrl: "/images/projects/ai-powered-code-reviewer-cover.webp",
    featured: true,
    hasDetails: true,
  },
];
