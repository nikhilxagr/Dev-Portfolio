export const SITE_PROFILE = {
  fullName: "Nikhil Agrahari",
  shortName: "Nikhil",
  title: "Nikhil Agrahari Portfolio",
  headline: "BCA Student | Full Stack Developer | Web Solutions Builder",
  role: "Web Developer",
  education: "BCA, BBD University, Lucknow",
  location: "Lucknow, India",
  availability:
    "Open to freelance projects, portfolio guidance, mentorship, and collaboration.",
  shortIntro:
    "Passionate about creating modern, user-friendly web applications with clean architecture and reliable delivery. Transforming ideas into interactive digital experiences.",
  profileImage: "/images/profile/nikhil-upload-hero.webp",
  profileImageAlt: "Portrait of Nikhil Agrahari",
};

export const HERO_CONTENT = {
  eyebrow: "Full Stack Developer | Product Builder",
  title: "Building modern web products with clean and reliable implementation.",
  description:
    "I work across frontend and backend development, build user-focused experiences, and follow secure coding practices for production-ready delivery.",
  primaryCta: {
    label: "View Projects",
    to: "/projects",
  },
  secondaryCta: {
    label: "Contact Me",
    to: "/contact",
  },
};

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/skills", label: "Skills" },
  { to: "/projects", label: "Projects" },
  {
    to: "/experiments",
    label: "Experiments",
    isDropdown: true,
    children: [
      { to: "/experiments/security-labs", label: "Security Labs", description: "Cyber security labs & writeups" },
      { to: "/experiments/terminal", label: "Dev Terminal", description: "Interactive CLI & hacker sandbox" },
      { to: "/experiments/dsa", label: "Data Structure Lab", description: "Algorithm & data visualizers" },
      { to: "/experiments/tools", label: "Cyber Tools", description: "Real security utilities & breach checker" },
      { to: "/experiments/methodology", label: "Document Methodology", description: "Pentesting & security standards" },
    ],
  },
  { to: "/journey", label: "Journey" },
  { to: "/blog", label: "Blog" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
];

export const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/nikhilxagr" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nikhilxagr/" },
  { label: "Instagram", href: "https://www.instagram.com/nikhilxagr/" },
  { label: "Medium", href: "https://medium.com/@nikhilxagr" },
  { label: "TryHackMe", href: "https://tryhackme.com/p/nikhilxagr" },
  { label: "WhatsApp", href: "https://wa.me/7897872883" },
];

export const QUICK_CONTACT = {
  email: "nikhilagrahari530@gmail.com",
  billingEmail: "nikhilagrahari530@gmail.com",
  supportEmail: "nikhilagrahari530@gmail.com",
  phone: "+91 7897872883",
  whatsapp: "https://wa.me/7897872883",
  instagram: "https://www.instagram.com/nikhilxagr/",
  linkedin: "https://www.linkedin.com/in/nikhilxagr/",
  github: "https://github.com/nikhilxagr",
  leetcode: "https://leetcode.com/u/nikhilxagr/",
  gfg: "https://www.geeksforgeeks.org/profile/nikhilxagr?tab=activity",
  tryhackme: "https://tryhackme.com/p/nikhilxagr",
  medium: "https://medium.com/@nikhilxagr",
  refundPolicyPath: "/refund-policy",
  resume: "/images/resume/WebDev_Resume.pdf",
  resumeFullStack: "/images/resume/WebDev_Resume.pdf",
  resumeSecurity: "/images/resume/CyberSecurity_Resume.pdf",
};

export const LEGAL_LINKS = [
  { label: "Refund Policy", to: "/refund-policy" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms and Conditions", to: "/terms-and-conditions" },
  { label: "Cancellation Policy", to: "/cancellation-policy" },
  { label: "Delivery and Fulfillment", to: "/delivery-policy" },
];

export const ABOUT_STORY = [
  "Hi, I'm Nikhil Agrahari.",
  "I am a second-year BCA student at BBD University, Lucknow, focused on web development and practical software engineering. Currently working as a web developer, I enjoy turning ideas into interactive, user-friendly digital solutions.",
  "I believe in writing clean, efficient code and building projects that create real value. Alongside development, I continuously improve secure coding practices, performance, and reliability.",
  "My learning path stays broad on purpose. I enjoy frontend development, backend logic, and deployment workflows, because understanding the complete system helps deliver better products.",
  "Beyond coding, I am focused on consistent growth, collaboration, and building work that reflects both curiosity and discipline.",
];

export const FOCUS_AREAS = [
  "Responsive frontend development",
  "Backend API development",
  "Portfolio and product building",
  "Secure coding and production best practices",
  "Clean UI with strong usability",
];

export const SKILL_GROUPS = [
  {
    title: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "JavaScript", "HTML", "CSS"],
  },
  {
    title: "Backend",
    items: [
      "Node.js",
      "Express.js",
      "Supabase",
      "REST APIs",
      "Authentication",
      "MERN Stack",
    ],
  },
  {
    title: "Languages",
    items: ["JavaScript", "Python", "C", "SQL"],
  },
  {
    title: "Database",
    items: [
      "MongoDB Atlas",
      "Mongoose",
      "Supabase Postgres",
      "SQL Querying",
      "Schema Design",
      "Indexing",
    ],
  },
  {
    title: "Security and Testing Tools",
    items: [
      "Kali Linux",
      "Burp Suite",
      "Nmap",
      "Wireshark",
      "Steghide",
      "SQLMap",
      "Metasploit",
    ],
  },
  {
    title: "Other Tools",
    items: ["Git", "GitHub", "Postman", "Linux", "Vercel", "Render"],
  },
];

export const MAIN_SKILL_SHOWCASE = [
  {
    id: "appsec",
    title: "Application Security",
    summary:
      "Applying OWASP Top 10 methodology, Burp Suite workflows, and threat modeling to identify and remediate web vulnerabilities in authorized lab environments.",
    tags: ["OWASP Top 10", "Burp Suite", "SQLi / XSS", "Threat Modeling"],
    icon: "ShieldCheck",
    color: "green",
    progressPercent: 78,
  },
  {
    id: "web-development",
    title: "Full Stack Development",
    summary:
      "Delivering end-to-end web applications with responsive interfaces, clean architecture, and reliable backend integration using MERN stack.",
    tags: ["React", "Node.js", "MongoDB", "REST APIs"],
    icon: "Code2",
    color: "emerald",
    progressPercent: 85,
  },
  {
    id: "languages-frameworks",
    title: "Languages & Frameworks",
    summary:
      "Building practical solutions with JavaScript and Python, powered by React and Next.js for modern product development.",
    tags: ["JavaScript", "Python", "React", "Next.js"],
    icon: "Braces",
    color: "lime",
    progressPercent: 80,
  },
];

export const SKILL_EXPERTISE_TRACKS = [
  {
    title: "Full Stack Developer",
    summary:
      "Designing and shipping complete products from frontend experience to backend delivery with security-aware implementation.",
    skills: [
      "React",
      "Next.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Deployment Workflows",
    ],
  },
  {
    title: "Backend Engineer",
    summary:
      "Building robust server-side logic, authentication-ready APIs, and reliable data pipelines for scalable applications.",
    skills: [
      "Node.js",
      "Express.js",
      "Supabase",
      "MongoDB",
      "SQL",
      "API Validation",
    ],
  },
  {
    title: "Application Security Learner",
    summary:
      "Applying a defense-first mindset to application review, secure coding, and practical risk reduction across products.",
    skills: [
      "Threat Analysis",
      "Security Review",
      "Security Documentation",
      "Risk-based Prioritization",
    ],
  },
  {
    title: "Secure Development Practitioner",
    summary:
      "Practicing authorized testing methodology with structured validation and clear remediation reporting.",
    skills: [
      "Scope Validation",
      "Web App Testing",
      "Burp Suite Workflows",
      "Remediation Notes",
    ],
  },
  {
    title: "Quality and Risk Reviewer",
    summary:
      "Following a structured review lifecycle from scope definition to risk validation and implementation improvements.",
    skills: [
      "Surface Mapping",
      "Manual Review",
      "Validation of Findings",
      "Remediation Guidance",
    ],
  },
];

export const ETHICAL_HACKING_TOOL_CARDS = [
  {
    title: "Recon and Diagnostics",
    summary:
      "Discovery-focused tools for mapping system surfaces and collecting actionable diagnostic data.",
    tools: ["Kali Linux", "Nmap", "Gobuster", "Whois", "Subdomain Discovery"],
  },
  {
    title: "Application Security Review",
    summary:
      "Reviewing web applications for common risks with manual validation and guided frameworks.",
    tools: [
      "Burp Suite",
      "OWASP Testing Guide",
      "SQLMap",
      "Nikto",
      "Manual Payload Validation",
    ],
  },
  {
    title: "Network and Traffic Diagnostics",
    summary:
      "Inspecting packets, services, and protocol behavior to identify reliability and defense gaps.",
    tools: ["Wireshark", "Tcpdump", "Port Analysis", "Protocol Inspection"],
  },
  {
    title: "Data and File Analysis Basics",
    summary:
      "Using basic forensic utilities to inspect hidden data, metadata clues, and file integrity indicators.",
    tools: ["Steghide", "ExifTool", "strings", "File Signature Checks"],
  },
  {
    title: "Validation and Hardening Workflows",
    summary:
      "Structured validation practice to confirm findings and support practical hardening workflows.",
    tools: [
      "Metasploit",
      "Risk Verification",
      "Configuration Checks",
      "Hardening Basics",
    ],
  },
];

export const STATS_METRICS = [
  {
    id: "leetcode",
    label: "LeetCode Solved",
    value: "130+",
    detail: "Algorithms & Data Structures",
    link: "https://leetcode.com/u/nikhilxagr/",
    accentColor: "text-yellow-400",
  },
  {
    id: "gfg",
    label: "GFG Score",
    value: "400+",
    detail: "Problems Solved",
    link: "https://www.geeksforgeeks.org/profile/nikhilxagr?tab=activity",
    accentColor: "text-green-400",
  },
  {
    id: "tryhackme",
    label: "TryHackMe Rank",
    value: "Top 1%",
    detail: "275+ Rooms Solved",
    link: "https://tryhackme.com/p/nikhilxagr",
    accentColor: "text-red-400",
  },
  {
    id: "github",
    label: "GitHub Repos",
    value: "30+",
    detail: "Public Repositories",
    link: "https://github.com/nikhilxagr",
    accentColor: "text-green-300",
  },
];

export const PROJECT_CATEGORIES = ["All", "Web Dev", "Python", "Cyber Security", "AI"];

export const SIGNATURE_PROJECTS = [
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
    tags: [
      "Hackathon Project",
      "Collaboration Project",
    ],
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
      "Built a full stack production-style workflow with API integration, persistence, and a practical URL utility use-case.",
    highlights: [
      "Short link generation",
      "Frontend and backend integration",
      "REST API workflow",
      "Database-backed URL management",
    ],
    techStack: [
      "React",
      "React Router DOM",
      "JavaScript",
      "Axios",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Mongoose",
    ],
    githubUrl: "https://github.com/nikhilxagr/snapurl-URL-SHORTNER",
    liveDemoUrl: "https://snapurl-url-shortner.vercel.app/",
    imageUrl: "/images/projects/snapurl-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "ai-powered-code-reviewer",
    title: "AI Powered Code Reviewer",
    category: "AI",
    tagline:
      "An AI-assisted review platform focused on code quality and developer support.",
    description:
      "AI Powered Code Reviewer is a MERN-based platform designed to analyze code, highlight issues, suggest improvements, and maintain code quality standards in a more streamlined workflow.",
    problemStatement:
      "Developers often need faster feedback on code quality, possible bugs, and maintainability without losing track of previous reviews.",
    solutionSummary:
      "This project reflects interest in AI-assisted developer tooling, secure access control, and building feature-rich full stack platforms.",
    outcome:
      "Showcased AI-assisted developer workflow design with strong focus on productivity and secure collaboration paths.",
    highlights: [
      "AI-based code review flow",
      "Security scanning direction",
      "Authentication and user management",
      "Review history tracking",
    ],
    techStack: ["MongoDB", "Express.js", "React", "Node.js"],
    githubUrl:
      "https://github.com/nikhilxagr/AI-Powered-Code-Reviewer-MERN-Project",
    liveDemoUrl: "",
    imageUrl: "/images/projects/ai-powered-code-reviewer-cover.webp",
    featured: true,
    hasDetails: true,
  },
  {
    slug: "notes-app",
    title: "Notes App",
    category: "Web Dev",
    tagline:
      "A sleek, fast, local-storage powered note-taking web application.",
    description:
      "Notes App is an intuitive note management web application designed for creating, organizing, editing, and deleting personal notes with real-time local storage persistence and responsive card layouts.",
    problemStatement:
      "Users need a lightweight, fast, distraction-free tool to capture quick thoughts, organize notes, and maintain data across sessions without requiring complex user logins.",
    solutionSummary:
      "Built using core web technologies (HTML5, CSS3, JavaScript) featuring dynamic DOM manipulation, real-time input validation, local storage auto-sync, and responsive UI design.",
    outcome:
      "Delivered a practical web utility with instant load time, zero external dependencies, and smooth user interaction flow across all devices.",
    highlights: [
      "Dynamic note creation & editing",
      "LocalStorage data persistence",
      "Instant search & category filtering",
      "Responsive UI card layout",
    ],
    techStack: ["HTML", "CSS", "JavaScript"],
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/Notes%20App",
    liveDemoUrl: "https://notes-app-agr.netlify.app/",
    imageUrl: "/images/projects/notes-app-cover.webp",
    featured: true,
  },
  {
    slug: "qrcode-generator",
    title: "QRCode Generator",
    category: "Web Dev",
    tagline:
      "An instant, customizable QR code generation utility for links, text, and data.",
    description:
      "QRCode Generator is an interactive web tool built to create scannable, high-resolution QR codes dynamically for web URLs, Wi-Fi details, text snippets, and contact information with instant live download capability.",
    problemStatement:
      "Users and businesses frequently need quick, reliable, ad-free tools to convert links and text into downloadable QR codes without data privacy risks.",
    solutionSummary:
      "Developed using HTML5, CSS3, and modern JavaScript API integrations to generate vector-rendered QR codes with custom size options, instant live preview, and high-quality image download features.",
    outcome:
      "Delivered a practical utility tool with instant client-side generation, clean UI feedback, and universal cross-device browser compatibility.",
    highlights: [
      "Real-time QR code rendering",
      "Instant image download capability",
      "Custom input URL & text support",
      "Clean, responsive interface",
    ],
    techStack: ["HTML", "CSS", "JavaScript"],
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/QR%20Code%20Generator",
    liveDemoUrl: "https://qrcode-generator-agr.netlify.app/",
    imageUrl: "/images/projects/qrcode-generator-cover.webp",
    featured: true,
  },
  {
    slug: "weather-app",
    title: "Weather App",
    category: "Web Dev",
    tagline:
      "A real-time weather forecasting web application powered by OpenWeather API.",
    description:
      "Weather App is a responsive, interactive web application built to fetch real-time atmospheric data, temperature, humidity, wind speed, and weather condition forecasts for cities worldwide via external REST API integration.",
    problemStatement:
      "Users need an easy, instant way to search and view current weather metrics, forecasts, and atmospheric conditions for any global location without heavy page reloads.",
    solutionSummary:
      "Developed using core web standards (HTML5, CSS3, JavaScript) with asynchronous fetch API calls, JSON data parsing, dynamic weather condition icon mapping, and user error handling for invalid city queries.",
    outcome:
      "Delivered a fast, responsive weather dashboard with live API data fetching, smooth card transitions, and clean mobile-first layout UI.",
    highlights: [
      "Real-time OpenWeather API integration",
      "Global city search with auto-fetch",
      "Dynamic weather condition icons & metrics",
      "Responsive card layout & glassmorphic design",
    ],
    techStack: ["HTML", "CSS", "JavaScript", "REST API"],
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/Weather%20App%20(%20Using%20API%20)",
    liveDemoUrl: "https://weatherappagr.netlify.app/",
    imageUrl: "/images/projects/weather-app-cover.webp",
    featured: true,
  },
  {
    slug: "todo-list-app",
    title: "To Do List App",
    category: "Web Dev",
    tagline:
      "A clean, productive task management web application with browser persistence.",
    description:
      "To Do List App is a lightweight, responsive task management application designed to help users create, organize, mark complete, and delete daily tasks with instant browser local storage persistence.",
    problemStatement:
      "Individuals need a quick, distraction-free tool to organize daily priorities, check off completed goals, and preserve task states across browser refreshes.",
    solutionSummary:
      "Built using core web technologies (HTML5, CSS3, JavaScript) featuring dynamic DOM node creation, event delegation, strike-through task completion toggles, and local storage auto-sync.",
    outcome:
      "Delivered a practical daily productivity utility with zero load delay, clean interactive UX feedback, and mobile-responsive layout execution.",
    highlights: [
      "Task creation, completion & deletion",
      "LocalStorage data persistence",
      "Interactive completion checkmarks",
      "Responsive card UI layout",
    ],
    techStack: ["HTML", "CSS", "JavaScript"],
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/To%20do%20List",
    liveDemoUrl: "https://todo-list-agr.netlify.app/",
    imageUrl: "/images/projects/todo-list-cover.webp",
    featured: true,
  },
  {
    slug: "age-calculator",
    title: "Age Calculator",
    category: "Web Dev",
    tagline:
      "An exact age calculation web utility that computes years, months, and days dynamically.",
    description:
      "Age Calculator is an interactive web tool built to calculate precise chronological age in years, months, and days based on a user's date of birth with real-time input validation and leap year accounting.",
    problemStatement:
      "Users often need to calculate exact age metrics for application forms, official verification, and milestone tracking without manual calendar math errors.",
    solutionSummary:
      "Developed using core web standards (HTML5, CSS3, JavaScript) featuring JS Date object methods, leap year algorithms, edge-case date validation, and responsive result cards.",
    outcome:
      "Delivered a fast, reliable calculation tool with instant feedback, zero external dependencies, and smooth user experience across mobile and desktop devices.",
    highlights: [
      "Exact years, months & days calculation",
      "Leap year & date edge-case validation",
      "Real-time dynamic result display",
      "Clean responsive card layout",
    ],
    techStack: ["HTML", "CSS", "JavaScript"],
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/Age%20Calculator",
    liveDemoUrl: "https://age-calc-agr.netlify.app/",
    imageUrl: "/images/projects/age-calculator-cover.webp",
    featured: true,
  },
  {
    slug: "text-to-speech",
    title: "Text To Speech Converter",
    category: "Web Dev",
    tagline:
      "An interactive web application that converts text into natural-sounding spoken audio.",
    description:
      "Text To Speech Converter is a responsive web application leveraging the browser-native Web Speech API to convert written text into natural vocal narration with customizable voice selection, pitch, rate, and playback controls.",
    problemStatement:
      "Users and content creators need an instant, free, accessible tool to listen to written text, verify pronunciation, and audit audio readability without installing external software.",
    solutionSummary:
      "Developed using core web standards (HTML5, CSS3, JavaScript) incorporating `window.speechSynthesis` API bindings, dynamic voice dropdown population, live speech controls (play/pause/stop), and volume modulation.",
    outcome:
      "Built a browser-accessible audio converter featuring instant voice synthesis, zero latency, and seamless responsive controls across desktop and mobile devices.",
    highlights: [
      "Browser Web Speech API integration",
      "Dynamic voice & accent dropdown selection",
      "Interactive play, pause & stop controls",
      "Responsive card UI with volume slider",
    ],
    techStack: ["HTML", "CSS", "JavaScript", "Web Speech API"],
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/Text%20To%20Speech",
    liveDemoUrl: "https://text-to-speech-agr.netlify.app/",
    imageUrl: "/images/projects/text-to-speech-cover.webp",
    featured: true,
  },
  {
    slug: "music-player",
    title: "Music Player",
    category: "Web Dev",
    tagline:
      "A sleek, interactive web music player with audio controls, playlists, and progress tracking.",
    description:
      "Music Player is a modern, responsive web application designed for playing audio tracks with smooth track navigation, interactive seek bar, volume modulation, playlist queuing, and album artwork visualization.",
    problemStatement:
      "Users need an intuitive, fast, ad-free web audio player interface with smooth playback controls, real-time track progress visualizers, and responsive media handling.",
    solutionSummary:
      "Developed using core web standards (HTML5 Audio API, CSS3 glassmorphism, JavaScript) featuring custom play/pause state management, dynamic seek progress sliders, track duration formatters, and playlist index switching.",
    outcome:
      "Delivered a feature-rich audio web utility with instant responsive controls, smooth track switching, and an aesthetically polished UI.",
    highlights: [
      "HTML5 Audio API integration",
      "Interactive seek bar & volume slider",
      "Playlist queuing & track navigation",
      "Sleek glassmorphic card design",
    ],
    techStack: ["HTML", "CSS", "JavaScript"],
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/Music%20Player",
    liveDemoUrl: "https://music-player-agr.netlify.app/",
    imageUrl: "/images/projects/music-player-cover.webp",
    featured: true,
  },
  {
    slug: "mini-calendar",
    title: "Mini Calendar App",
    category: "Web Dev",
    tagline:
      "A real-time, dynamic date & month calendar widget with aesthetic date tracking.",
    description:
      "Mini Calendar App is a sleek, lightweight web application built to display real-time date metrics including current day, month, date number, and year dynamically synchronized with the user's system clock.",
    problemStatement:
      "Developers and users need a fast, minimal calendar widget component for dashboard interfaces, scheduling utilities, and date verification.",
    solutionSummary:
      "Developed using core web standards (HTML5, CSS3, JavaScript) incorporating JS `Date` constructor methods, array formatting for month/day names, and glassmorphic card UI styling.",
    outcome:
      "Delivered a lightweight, zero-dependency date widget with instant system clock auto-update and mobile-responsive aesthetic design.",
    highlights: [
      "Real-time system clock synchronization",
      "Dynamic month, day & year formatting",
      "Sleek glassmorphic card layout",
      "Lightweight zero-dependency architecture",
    ],
    techStack: ["HTML", "CSS", "JavaScript"],
    githubUrl:
      "https://github.com/nikhilxagr/Web-Dev-Projects/tree/main/Mini%20Calendar",
    liveDemoUrl: "https://mini-calender-agr.netlify.app/",
    imageUrl: "/images/projects/mini-calendar-cover.webp",
    featured: true,
  },
  {
    slug: "upi-qrcode-generator",
    title: "UPI QR Code Generator",
    category: "Python",
    tagline:
      "A desktop GUI utility in Python & Tkinter for generating instant payment UPI QR codes.",
    description:
      "UPI QR Code Generator is a desktop GUI application built in Python using Tkinter and Pillow. It generates dynamic, scannable Unified Payments Interface (UPI) QR codes embedded with merchant VPA ID, payee name, transaction note, and exact billing amount.",
    problemStatement:
      "Small merchants and freelancers need a standalone, desktop-offline tool to generate instant payment QR codes for custom billing amounts without relying on web connections.",
    solutionSummary:
      "Engineered using Python, Tkinter GUI library, `qrcode` library, and Pillow image rendering to construct NPCI-compliant UPI URI strings (`upi://pay?pa=...`), render vector matrix codes, and export PNG images.",
    outcome:
      "Delivered a lightweight, desktop payment utility with instant GUI rendering, input field validation, and offline image export capabilities.",
    highlights: [
      "Tkinter desktop GUI interface",
      "NPCI compliant UPI payment URI string construction",
      "Dynamic VPA, payee name & amount parameters",
      "Instant high-res PNG export & preview",
    ],
    techStack: ["Python", "Tkinter", "Pillow", "QRCode Lib"],
    githubUrl:
      "https://github.com/nikhilxagr/Python-projects/tree/main/QR%20Code%20Generator",
    liveDemoUrl: "",
    imageUrl: "/images/projects/upi-qrcode-generator-cover.webp",
    featured: true,
  },
  {
    slug: "tic-tac-toe-python",
    title: "Tic Tac Toe (Python GUI)",
    category: "Python",
    tagline:
      "A classic 2-player desktop Tic Tac Toe game interface built using Python & Tkinter.",
    description:
      "Tic Tac Toe is an interactive desktop GUI game built in Python featuring dynamic 3x3 grid button layouts, turn-based X & O move logic, win/draw detection algorithms, score counters, and instant game reset controls.",
    problemStatement:
      "Learners and game enthusiasts need a lightweight desktop demonstration of matrix state management, event-driven GUI programming, and conditional win-checking algorithms in Python.",
    solutionSummary:
      "Developed using Python's native `tkinter` GUI framework featuring 2D array matrix state tracking, linear & diagonal win evaluation functions, score state persistence, and responsive popup alert dialogues.",
    outcome:
      "Delivered a fun, responsive desktop game application showcasing clean object-oriented Python code structuring and GUI event handling.",
    highlights: [
      "Tkinter interactive 3x3 grid GUI",
      "Turn-based player turn management",
      "Automatic win & draw condition detection",
      "Scoreboard tracking & game reset feature",
    ],
    techStack: ["Python", "Tkinter", "OOP"],
    githubUrl:
      "https://github.com/nikhilxagr/Python-projects/tree/main/Tic%20Tac%20Toe%20Game",
    liveDemoUrl: "",
    imageUrl: "/images/projects/tic-tac-toe-cover.webp",
    featured: true,
  },
];

export const PRACTICALS = [
  {
    slug: "kali-linux-setup",
    title: "Kali Linux Setup & Environment Hardening",
    summary:
      "Configured a Kali Linux environment for practical learning in networking, reconnaissance, and web security workflows with service hardening.",
    focus: "Environment Setup & Tool Familiarity",
    tools: ["Kali Linux", "Linux CLI", "systemctl", "UFW Firewall"],
    level: "Beginner",
    status: "ready",
    writeupStatus: "summary-ready",
    cvssScore: "N/A",
    cvssLevel: "low",
    businessImpact: "Establishes a secure, repeatable testing baseline — reducing exposure from misconfigured lab environments.",
    proofType: "Lab Setup",
  },
  {
    slug: "nmap-scanning-lab",
    title: "Nmap Network Reconnaissance Lab",
    summary:
      "Practiced host discovery, service enumeration, OS fingerprinting, and structured scanning techniques in a controlled environment.",
    focus: "Reconnaissance & Network Visibility",
    tools: ["Nmap", "Linux", "Grep", "Script Engine (NSE)"],
    level: "Beginner",
    status: "ready",
    writeupStatus: "summary-ready",
    cvssScore: "5.3",
    cvssLevel: "medium",
    businessImpact: "Identifies exposed services before attackers do — directly reducing attack surface awareness gap.",
    proofType: "Lab Report",
  },
  {
    slug: "tryhackme-rooms",
    title: "TryHackMe Room Practice — 275+ Rooms",
    summary:
      "Working through guided rooms to strengthen fundamentals in networking, web security, privilege escalation, and practical attack-defense thinking. Ranked in Global Top 1%.",
    focus: "Guided Application Security & CTF Learning",
    tools: ["TryHackMe", "Linux", "Burp Suite", "Nmap", "Metasploit"],
    level: "Beginner to Intermediate",
    status: "ongoing",
    writeupStatus: "add-room-wise-later",
    cvssScore: "8.1",
    cvssLevel: "high",
    businessImpact: "Demonstrates active, measurable offensive security skill — ranked Top 1% globally out of millions of users.",
    proofType: "TryHackMe Profile",
    proofUrl: "https://tryhackme.com/p/nikhilxagr",
  },
  {
    slug: "burp-suite-practice",
    title: "Burp Suite Web Application Testing",
    summary:
      "Used Burp Suite in lab scenarios to intercept HTTP/S traffic, test for OWASP Top 10 vulnerabilities, and validate remediation effectiveness.",
    focus: "Web Application Security Testing (OWASP)",
    tools: ["Burp Suite", "OWASP ZAP", "Browser DevTools", "SQLMap"],
    level: "Beginner to Intermediate",
    status: "ready",
    writeupStatus: "summary-ready",
    cvssScore: "7.5",
    cvssLevel: "high",
    businessImpact: "Validates and remediates injection & auth vulnerabilities before they reach production — directly preventing data breach vectors.",
    proofType: "Lab Writeup",
  },
  {
    slug: "wireshark-traffic-analysis",
    title: "Wireshark Traffic Analysis & Protocol Inspection",
    summary:
      "Captured and analyzed network packets to identify protocol behavior, unencrypted credentials, and anomalous traffic patterns.",
    focus: "Network Forensics & Traffic Analysis",
    tools: ["Wireshark", "Tcpdump", "Protocol Analysis"],
    level: "Beginner",
    status: "ready",
    writeupStatus: "summary-ready",
    cvssScore: "6.5",
    cvssLevel: "medium",
    businessImpact: "Identifies unencrypted sensitive data in transit — critical for enforcing TLS and secure data handling policies.",
    proofType: "PCAP Analysis",
  },
  {
    slug: "secure-coding-mern",
    title: "Secure MERN Stack Development Practices",
    summary:
      "Applied security-first practices to MERN applications: JWT hardening, rate limiting with Express, Helmet HTTP headers, and MongoDB injection prevention via Mongoose schemas.",
    focus: "DevSecOps & Secure Web Development",
    tools: ["Node.js", "Express", "Helmet.js", "Mongoose", "JWT", "bcrypt"],
    level: "Intermediate",
    status: "ready",
    writeupStatus: "summary-ready",
    cvssScore: "9.1",
    cvssLevel: "critical",
    businessImpact: "Prevents the most common web app attack vectors (injection, auth bypass, XSS) at the code level — reducing breach risk by applying OWASP remediation patterns.",
    proofType: "GitHub Repo",
  },
];

export const SECURITY_PRACTICALS = PRACTICALS.map((item) => ({
  platform: item.focus,
  title: item.title,
  summary: item.summary,
}));

export const SUPPORT_PAYMENT_CONFIG = {
  slug: "support-me",
  title: "Support My Work",
  minAmountInr: 1,
  maxAmountInr: 50000,
  quickAmounts: [49, 99, 149, 199, 499, 999],
};

export const SERVICE_OFFERINGS = [
  {
    slug: "mentorship-call",
    name: "1:1 Mentorship",
    category: "Guidance",
    price: "INR 99",
    amountInr: 99,
    turnaround: "Schedule-based",
    summary:
      "A short student-friendly session for guidance on web development, project direction, learning roadmaps, or portfolio improvement.",
  },
  {
    slug: "resume-review-help",
    name: "Resume Review and Help",
    category: "Career Support",
    price: "INR 149",
    amountInr: 149,
    turnaround: "1 to 2 days",
    summary:
      "Resume feedback and improvement support for students and freshers who want a cleaner, stronger technical profile.",
  },
  {
    slug: "portfolio-guidance",
    name: "Portfolio Guidance",
    category: "Guidance",
    price: "INR 99",
    amountInr: 99,
    turnaround: "1 to 2 days",
    summary:
      "Guidance for students who want to improve portfolio structure, project presentation, and personal branding.",
  },
  {
    slug: "frontend-development",
    name: "Frontend Development",
    category: "Build and Delivery",
    price: "INR 1099 - 1499",
    amountInr: 1499,
    turnaround: "3 to 5 days for basic scope",
    summary:
      "Responsive frontend modules or small websites focused on clean UI, usability, and handover clarity.",
  },
  {
    slug: "backend-development",
    name: "Backend Development",
    category: "Build and Delivery",
    price: "INR 1299 - 1799",
    amountInr: 1799,
    turnaround: "3 to 6 days",
    summary:
      "Node.js and Express-based backend support for APIs, validation, routing, and simple data workflows.",
  },
  {
    slug: "full-stack-development",
    name: "Full Stack Development",
    category: "Build and Delivery",
    price: "INR 2999 - 3499",
    amountInr: 3499,
    turnaround: "Depends on scope",
    summary:
      "Small full stack builds with frontend, backend, database integration, and basic deployment support.",
  },
];

export const BLOG_LINKS = [
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
    featured: true,
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
    featured: false,
  },
];

export const LEGAL_NOTICES = {
  securityTesting:
    "Security guidance is limited to defensive best practices for owned products and approved application contexts.",
  portfolioDisclaimer:
    "This portfolio presents real learning and project delivery focused on web development and secure engineering practices.",
  practicalsEthics:
    "All security practice is limited to labs, owned systems, or explicitly authorized defensive testing contexts.",
};

export const RESUME_DATA = {
  summary:
    "Full-Stack Web Developer and Cyber Security Practitioner pursuing BCA at BBD University, Lucknow. Specialized in React.js, Node.js, RESTful APIs, Tailwind CSS, Python, and AppSec practicals. Demonstrated track record of building 10+ production-grade web products with clean code architecture.",
  education: [
    {
      degree: "Bachelor of Computer Applications (BCA)",
      institution: "Babu Banarasi Das University (BBDU), Lucknow, UP",
      period: "2023 - 2026",
      status: "In Progress (2nd Year)",
      cgpa: "8.5+ CGPA",
      coursework: [
        "Data Structures & Algorithms",
        "Object Oriented Programming (C++/Python)",
        "Database Management Systems (SQL/MongoDB)",
        "Web Technology & Frameworks",
        "Operating Systems & Linux Kernel",
        "Computer Networks & Information Security",
      ],
    },
    {
      degree: "Senior Secondary (12th State Board)",
      institution: "Uttar Pradesh Board",
      period: "2021 - 2023",
      status: "Completed",
      cgpa: "First Division (Science Stream)",
      coursework: ["Physics", "Chemistry", "Mathematics", "Computer Applications"],
    },
  ],
  experience: [
    {
      role: "Full-Stack Web Developer & Product Architect",
      company: "Freelance & Independent Projects",
      period: "2023 - Present",
      location: "Lucknow, India",
      description:
        "Engineered, deployed, and maintained 10+ full-stack web applications and micro-utilities.",
      highlights: [
        "Architected Fast Feast food delivery app with dynamic cart state and multi-vendor menu exploration.",
        "Built SnapURL, an enterprise-grade URL shortener with real-time analytics and QR code generator.",
        "Developed AI-powered Code Reviewer integrating AI API prompts for static code security audit.",
        "Designed payment checkout integration using Razorpay & Cashfree SDKs with automated webhooks.",
      ],
    },
    {
      role: "Cyber Security Practitioner & Lab Researcher",
      company: "Self-Driven & TryHackMe Labs",
      period: "2024 - Present",
      location: "Lucknow, India",
      description:
        "Executed offensive and defensive security lab writeups, vulnerability analysis, and tool auditing.",
      highlights: [
        "Hardened Kali Linux penetration testing environment with customized zsh shell and toolchains.",
        "Audited OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF, IDOR) across simulated vulnerable targets.",
        "Created interactive Dev Terminal and Security Labs showcase embedded directly into portfolio site.",
      ],
    },
  ],
  achievements: [
    {
      title: "Built & Deployed 10+ Production Web Products",
      detail: "Live Netlify and Vercel deployments with custom domain configurations and SSL encryption.",
    },
    {
      title: "30+ Public Open-Source Repositories",
      detail: "Maintained structured GitHub codebase with clean modular commits and documentation.",
    },
    {
      title: "TryHackMe Security Badges",
      detail: "Completed hands-on practical labs in Network Security, Web Hacking Fundamentals, and Recon.",
    },
    {
      title: "Full-Stack Portfolio Engine with Payment Integration",
      detail: "Architected a custom MERN portfolio system with dynamic admin dashboard, checkout, and receipt generation.",
    },
  ],
  certificates: [
    {
      name: "Full-Stack Web Development Mastery",
      issuer: "Udemy / Online Engineering Academy",
      date: "2024",
      skills: ["React", "Node.js", "MongoDB", "Express"],
    },
    {
      name: "Cyber Security Hacking Fundamentals",
      issuer: "TryHackMe / Security Community",
      date: "2024",
      skills: ["Linux", "Nmap", "Burp Suite", "OWASP"],
    },
    {
      name: "Python Programming & Automation",
      issuer: "Python Institute / Online Certification",
      date: "2023",
      skills: ["Python 3", "Tkinter", "File I/O", "Data Structures"],
    },
  ],
};
