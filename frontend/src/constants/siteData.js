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
    to: "/experiments/security-labs",
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

export const PROJECT_CATEGORIES = ["All", "Web Dev", "Cyber Security", "AI"];

export const SIGNATURE_PROJECTS = [
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
