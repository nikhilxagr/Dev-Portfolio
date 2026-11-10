export const SITE_PROFILE = {
  fullName: "Nikhil Agrahari",
  shortName: "Nikhil",
  title: "Nikhil Agrahari Portfolio",
  headline: "BCA Student (3rd Year) | Aspiring Full Stack Developer",
  role: "Full Stack Developer",
  education: "BCA (3rd Year), Babu Banarasi Das University, Lucknow",
  location: "Lucknow, India",
  availability:
    "Open to freelance projects, custom web development, and collaboration.",
  shortIntro:
    "Full-stack MERN developer and application security researcher building web applications, REST APIs, and security labs.",
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
  "I am a third-year BCA student at Babu Banarasi Das University, Lucknow, and an aspiring Full Stack Developer actively seeking internship and entry-level opportunities.",
  "I build full-stack web applications using React, Node.js, Express, and MongoDB, focusing on clean user interfaces, reliable APIs, and secure database workflows.",
  "Beyond development, I practice cybersecurity on TryHackMe, solve problem-solving challenges on LeetCode, and explore practical AI tools to continuously improve as an engineer.",
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
  {
    id: "cyber-security",
    title: "Cyber Security Analyst",
    summary:
      "Applying OWASP Top 10 methodology, Burp Suite workflows, and threat modeling to identify and remediate web vulnerabilities in authorized lab environments.",
    tags: ["OWASP Top 10", "Burp Suite", "SQLi / XSS", "Threat Modeling"],
    icon: "ShieldCheck",
    color: "cyan",
    progressPercent: 78,
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
    value: "150+",
    detail: "Algorithms & Data Structures",
    link: "https://leetcode.com/u/nikhilxagr/",
  },
  {
    id: "gfg",
    label: "GFG Score",
    value: "400+",
    detail: "Problems Solved",
    link: "https://www.geeksforgeeks.org/profile/nikhilxagr?tab=activity",
  },
  {
    id: "tryhackme",
    label: "TryHackMe Rank",
    value: "Top 1%",
    detail: "275+ Rooms Solved",
    link: "https://tryhackme.com/p/nikhilxagr",
  },
  {
    id: "github",
    label: "GitHub Repos",
    value: "30+",
    detail: "Public Repositories",
    link: "https://github.com/nikhilxagr",
  },
];

export { PROJECT_CATEGORIES, SIGNATURE_PROJECTS } from "../data/projectsData.js";

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
    businessImpact: "Establishes a secure, repeatable testing baseline â€” reducing exposure from misconfigured lab environments.",
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
    businessImpact: "Identifies exposed services before attackers do â€” directly reducing attack surface awareness gap.",
    proofType: "Lab Report",
  },
  {
    slug: "tryhackme-rooms",
    title: "TryHackMe Room Practice â€” 275+ Rooms",
    summary:
      "Working through guided rooms to strengthen fundamentals in networking, web security, privilege escalation, and practical attack-defense thinking. Ranked in Global Top 1%.",
    focus: "Guided Application Security & CTF Learning",
    tools: ["TryHackMe", "Linux", "Burp Suite", "Nmap", "Metasploit"],
    level: "Beginner to Intermediate",
    status: "ongoing",
    writeupStatus: "add-room-wise-later",
    cvssScore: "8.1",
    cvssLevel: "high",
    businessImpact: "Demonstrates active, measurable offensive security skill â€” ranked Top 1% globally out of millions of users.",
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
    businessImpact: "Validates and remediates injection & auth vulnerabilities before they reach production â€” directly preventing data breach vectors.",
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
    businessImpact: "Identifies unencrypted sensitive data in transit â€” critical for enforcing TLS and secure data handling policies.",
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
    businessImpact: "Prevents the most common web app attack vectors (injection, auth bypass, XSS) at the code level â€” reducing breach risk by applying OWASP remediation patterns.",
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
    slug: "frontend-development",
    name: "Frontend Development",
    category: "Frontend",
    price: "INR 1099 - 1499",
    amountInr: 1499,
    turnaround: "3 to 5 days for basic scope",
    summary:
      "Responsive frontend modules or small websites focused on clean UI, usability, and handover clarity.",
  },
  {
    slug: "backend-development",
    name: "Backend Development",
    category: "Backend",
    price: "INR 1299 - 1799",
    amountInr: 1799,
    turnaround: "3 to 6 days",
    summary:
      "Node.js and Express-based backend support for APIs, validation, routing, and simple data workflows.",
  },
  {
    slug: "full-stack-development",
    name: "Full Stack Development",
    category: "Full Stack",
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
