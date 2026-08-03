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
