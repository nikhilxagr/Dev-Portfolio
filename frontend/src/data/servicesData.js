export const SERVICE_OFFERINGS = [
  {
    slug: "frontend-development",
    name: "Frontend Development",
    category: "Frontend",
    price: "INR 1099 - INR 1499",
    amountInr: 1499,
    turnaround: "3 to 5 days for basic scope",
    badge: "CLIENT FAVORITE",
    badgeColor: "border-lime-500/40 text-lime-400 bg-lime-500/10",
    expectedOutcome:
      "Production-ready responsive frontend modules with clear handover in 3–5 days for basic scope.",
    summary:
      "Modern, responsive frontend experiences with clean component architecture and performance-focused implementation.",
    bullets: [
      "React and Tailwind responsive development",
      "Responsive layout and interaction design",
      "Performance and accessibility-first delivery",
    ],
  },
  {
    slug: "backend-development",
    name: "Backend Development",
    category: "Backend",
    price: "INR 1299 - INR 1799",
    amountInr: 1799,
    turnaround: "3 to 6 days",
    badge: "SECURE APIS",
    badgeColor: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
    expectedOutcome:
      "Ship secure API modules with validation and logging baseline in 3–6 days.",
    summary:
      "Reliable backend systems with API design, authentication, validation, and production-focused architecture.",
    bullets: [
      "REST API development with Node.js and Express",
      "Database modeling and integration",
      "Validation, rate limiting, and secure patterns",
    ],
  },
  {
    slug: "full-stack-development",
    name: "Full Stack Development",
    category: "Full Stack",
    price: "INR 2999 - INR 3499",
    amountInr: 3499,
    turnaround: "Depends on scope",
    badge: "PREMIUM DELIVERY",
    badgeColor: "border-amber-500/40 text-amber-400 bg-amber-500/10",
    expectedOutcome:
      "Receive a functional full-stack scope with phased milestones and deployment support.",
    summary:
      "End-to-end development from UI to APIs with practical product thinking, deployment support, and production readiness.",
    bullets: [
      "Frontend + backend integration",
      "Authentication and protected workflows",
      "Deployment-ready project setup",
    ],
  },
  {
    slug: "security-software-project",
    name: "Security Software & Project",
    category: "Security",
    price: "INR 2499 - INR 2999",
    amountInr: 2499,
    turnaround: "Phased Milestones / Custom Scope",
    badge: "CUSTOM SCOPE",
    badgeColor: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10",
    expectedOutcome:
      "Custom security architecture, vulnerability audit & tailored software scope with milestone delivery.",
    summary:
      "Tailored security-focused software engineering, OWASP vulnerability assessments, API hardening, and custom project architecture.",
    bullets: [
      "Security architecture review & OWASP auditing",
      "Custom software engineering & scope discussion",
      "Defensive coding, rate limiting & auth hardening",
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

export const SUPPORT_PAYMENT_CONFIG = {
  slug: "support-me",
  title: "Support My Work",
  minAmountInr: 1,
  maxAmountInr: 50000,
  quickAmounts: [49, 99, 149, 199, 499, 999],
};
