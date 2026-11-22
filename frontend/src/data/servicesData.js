export const SERVICE_OFFERINGS = [
  {
    slug: "frontend-development",
    name: "Frontend Development",
    category: "Frontend",
    price: "INR 1099 - INR 1499",
    amountInr: 1499,
    turnaround: "3 to 5 days for basic scope",
    badge: "Popular Scope",
    badgeColor: "border-emerald-600/25 bg-emerald-500/[0.08] text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400",
    expectedOutcome:
      "Responsive React and Tailwind frontend modules with clean component handoff in 3 to 5 days for standard scope.",
    summary:
      "Modern responsive interfaces built with clean React component structure and smooth interaction polish.",
    bullets: [
      "React and Tailwind responsive UI development",
      "Cross-device layout and navigation structure",
      "Performance and accessibility checks included",
    ],
  },
  {
    slug: "backend-development",
    name: "Backend Development",
    category: "Backend",
    price: "INR 1299 - INR 1799",
    amountInr: 1799,
    turnaround: "3 to 6 days",
    badge: "API Engineering",
    badgeColor: "border-black/[0.08] bg-slate-50 text-slate-700 dark:border-white/[0.10] dark:bg-[#1a1e28] dark:text-[#a3a9b8]",
    expectedOutcome:
      "Validated Express API endpoints with database schemas, authentication middleware, and rate limiting in 3 to 6 days.",
    summary:
      "Structured server APIs with authentication, input validation, and clean database schemas.",
    bullets: [
      "REST API routing with Node.js and Express",
      "MongoDB schema design and indexed queries",
      "Validation, rate limiting, and session security",
    ],
  },
  {
    slug: "full-stack-development",
    name: "Full Stack Development",
    category: "Full Stack",
    price: "INR 2999 - INR 3499",
    amountInr: 3499,
    turnaround: "Depends on scope",
    badge: "End-to-End Build",
    badgeColor: "border-emerald-600/25 bg-emerald-500/[0.08] text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400",
    expectedOutcome:
      "Complete full-stack web application delivered across agreed milestones with hosting setup.",
    summary:
      "Combined frontend UI, Express REST APIs, database persistence, and cloud deployment.",
    bullets: [
      "Frontend and backend API integration",
      "Authentication and protected user flows",
      "Production deployment and environment setup",
    ],
  },
  {
    slug: "security-software-project",
    name: "Security Software & Project",
    category: "Security",
    price: "INR 2499 - INR 2999",
    amountInr: 2499,
    turnaround: "Phased Milestones / Custom Scope",
    badge: "Security Focus",
    badgeColor: "border-black/[0.08] bg-slate-50 text-slate-700 dark:border-white/[0.10] dark:bg-[#1a1e28] dark:text-[#a3a9b8]",
    expectedOutcome:
      "OWASP vulnerability checklist review, API hardening updates, or scoped security software build.",
    summary:
      "Defensive web security reviews, OWASP Top 10 checks, API hardening, and custom utility builds.",
    bullets: [
      "Security architecture and OWASP review",
      "Custom scoped security tools or modules",
      "Rate limiting, CORS, and auth hardening",
    ],
  },
];

export const ETHICAL_HACKING_TOOL_CARDS = [
  {
    title: "Recon and Diagnostics",
    summary:
      "Discovery tools for mapping system surfaces and collecting actionable diagnostic data.",
    tools: ["Kali Linux", "Nmap", "Gobuster", "Whois", "Subdomain Discovery"],
  },
  {
    title: "Application Security Review",
    summary:
      "Inspecting web applications for common vulnerabilities through manual testing and structured checklists.",
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
      "Analyzing packet flows, open ports, and protocol behavior to find reliability and transport gaps.",
    tools: ["Wireshark", "Tcpdump", "Port Analysis", "Protocol Inspection"],
  },
  {
    title: "Data and File Analysis Basics",
    summary:
      "Inspecting metadata clues, hidden embeds, and file integrity markers with standard command utilities.",
    tools: ["Steghide", "ExifTool", "strings", "File Signature Checks"],
  },
  {
    title: "Validation and Hardening Workflows",
    summary:
      "Structured checks to reproduce findings cleanly and apply reliable remediation patterns.",
    tools: [
      "Metasploit",
      "Risk Verification",
      "Configuration Checks",
      "Hardening Basics",
    ],
  },
];

export const MAIN_SKILL_SHOWCASE = [
  {
    id: "web-development",
    title: "Full Stack Development",
    summary:
      "Building complete web applications with responsive interfaces, modular structure, and reliable MERN backends.",
    tags: ["React", "Node.js", "MongoDB", "REST APIs"],
    icon: "Code2",
    color: "emerald",
    progressPercent: 85,
  },
  {
    id: "languages-frameworks",
    title: "Languages & Frameworks",
    summary:
      "Developing web products and utilities using JavaScript and Python alongside React and Next.js.",
    tags: ["JavaScript", "Python", "React", "Next.js"],
    icon: "Braces",
    color: "emerald",
    progressPercent: 80,
  },
  {
    id: "cyber-security",
    title: "Cyber Security Analyst",
    summary:
      "Applying OWASP Top 10 methodology, Burp Suite testing, and threat modeling across web apps and lab targets.",
    tags: ["OWASP Top 10", "Burp Suite", "SQLi / XSS", "Threat Modeling"],
    icon: "ShieldCheck",
    color: "emerald",
    progressPercent: 78,
  },
];

export const SUPPORT_PAYMENT_CONFIG = {
  slug: "support-me",
  title: "Support My Work",
  minAmountInr: 1,
  maxAmountInr: 50000,
  quickAmounts: [49, 99, 149, 199, 499, 999],
};
