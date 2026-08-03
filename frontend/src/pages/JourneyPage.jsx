import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  FileBadge,
  GitBranch,
  Grid2X2,
  MapPin,
  Search,
  Trophy,
  ExternalLink,
  Award,
  Code2,
  Briefcase,
  Cpu,
  BookOpen,
  Rocket,
  Shield,
  Star,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Images,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import SeoHead from "@/components/seo/SeoHead";
import { createBreadcrumbSchema } from "@/utils/seo";
import { useLocation } from "react-router-dom";


// DATA
const journeyData = [
  {
    id: "bca-bbd-2024",
    year: 2024,
    category: "Academic Programs",
    mode: "Offline",
    title: "Bachelor of Computer Applications",
    subtitle: "Journey Starts",
    organization: "Babu Banarasi Das University",
    duration: "2024-03",
    location: "Lucknow, Uttar Pradesh",
    description:
      "Persuing BCA at BBD University with a strong focus on Artificial Intelligence, Cyber Security, Full-Stack Web Development, and practical software engineering.",
    imageUrl: "/images/journey/bbdu.jpg",
    imageFit: "contain",
    hasCertificate: false,
    certificateUrl: "",
    detailsUrl: "",
    icon: BookOpen,
    accent: "from-cyan-400 to-blue-600",
    tag: "Education",
    details: {
      university: "Babu Banarasi Das University",
      course: "Bachelor of Computer Applications (BCA)",
      status: "In Progress",
      expectedGraduation: "March 2027",
      journeyTitle: "BCA with AI & Web Focus",
      overview:
        "Currently pursuing a Bachelor of Computer Applications (BCA) with a strong focus on Artificial Intelligence, Cyber Security, Full-Stack Web Development, and practical software engineering. Alongside academics, actively building production-grade projects, participating in hackathons, internships, workshops, and open-source programs.",
      objectives:
        "Establish a rigorous computer science and application programming foundation while actively participating in high-impact technical ecosystems.",
      outcomes:
        "Currently building production-grade web applications, deploying models, and collaborating in community hackathons.",
      areasOfStudy: [
        "Programming: Foundations in Python, JavaScript, and C",
        "Data Structures: Implementation of algorithmic arrays, trees, stacks, queues, and search/sort patterns",
        "Database Management: Modeling complex relational databases using SQL and schema configuration",
        "Computer Networks: Deep dive into network layers, security, routing protocols, and topologies",
        "Artificial Intelligence: Fundamentals of cognitive computation, heuristics, and modeling search algorithms",
        "Machine Learning: Principles of supervised classification, regression models, and data pipelines",
        "Web Development: Client side component architecture and server middleware pipelines",
        "Software Engineering: Clean code patterns, system development lifecycle, and rapid problem-solving",
      ],
      skills: ["Python", "JavaScript", "React", "Node.js", "MongoDB", "Git", "SQL", "Problem Solving", "Teamwork", "AI/ML", "Communication"],
      technologies: ["Python", "JavaScript", "SQL", "React", "Node.js", "MongoDB", "Git"],
      gallery: ["/images/journey/bbdu.jpg"],
    },
  },
  {
    id: "started-cybersecurity-journey-2025",
    year: 2025,
    category: "Open Source",
    mode: "Online",
    title: "Started Cybersecurity Journey",
    subtitle: "Level Up",
    organization: "TryHackMe & Self-Learning",
    duration: "2025-08",
    location: "Remote",
    description:
      "Began hands-on cybersecurity learning through TryHackMe, Linux, networking fundamentals, penetration testing, and CTF challenges.",
    imageUrl: "/images/journey/tryhackme.png",
    imageFit: "contain-dark",
    hasCertificate: false,
    certificateUrl: "",
    detailsUrl: "/journey/tryhackme",
    icon: Shield,
    accent: "from-emerald-400 to-teal-600",
    tag: "Security",
    details: {
      university: "TryHackMe & Self-Learning",
      course: "Hands-on Cyber Security Labs",
      status: "Ongoing",
      expectedGraduation: "N/A",
      journeyTitle: "TryHackMe Journey Update",
      overview: "Continuously developing and sharpening hands-on cyber security skills across both offensive and defensive disciplines, progressing from a student to a highly competent security professional. Solved 354 completed rooms with 24 badges earned, achieving a Lab Solve Rank of Top 1% (Global Rank: 10,818).",
      objectives: "To continuously develop and sharpen hands-on cyber security skills across both offensive and defensive disciplines, progressing from a student to a highly competent security professional.",
      outcomes: "Global Solve Rank: Top 1% (Global Rank: 10,818). Solved 354 completed rooms with 24 badges earned.",
      areasOfStudy: [
        "Core Fundamentals: Advanced networking theory, Linux terminal operations, and Windows file system/administration basics.",
        "Web Exploitation: Understanding the full architecture of how websites work, DNS/HTTP protocols, and how to identify web vulnerabilities.",
        "Offensive Security: Hands-on ethical hacking methodologies, penetration testing principles, and legal exploitation strategies.",
        "Defensive Security: Incident response, Threat Intelligence, Security Operations Center (SOC) fundamentals, Digital Forensics (DFIR), Malware Analysis, and SIEM management."
      ],
      skills: ["Cybersecurity", "Offensive Security", "Defensive Security", "Web Exploitation", "Incident Response", "Malware Analysis", "Threat Intelligence", "Digital Forensics"],
      technologies: ["Kali Linux", "Nmap", "Wireshark", "Burp Suite", "Metasploit", "Splunk", "CyberChef"],
      gallery: ["/images/journey/tryhackme.png"]
    }
  },
  {
    id: "cisco-ethical-hacker-2025",
    year: 2025,
    category: "Certifications",
    mode: "Online",
    title: "Cisco Certified Ethical Hacker",
    subtitle: "Certification",
    organization: "Cisco",
    duration: "2025-09",
    location: "Remote",
    description:
      "Earned Cisco Ethical Hacker certification covering network vulnerabilities, exploitation techniques, and responsible disclosure.",
    imageUrl: "/journey/cisco-ethical-hacker-cert.jpg",
    imageFit: "contain-dark",
    hasCertificate: true,
    certificateUrl: "https://drive.google.com/file/d/1VZ6ruA9iM0k6h_kh3COMYTg-iRmQ_HOL/view?usp=sharing",
    detailsUrl: "",
    icon: Award,
    accent: "from-amber-400 to-orange-600",
    tag: "Certification",
    details: {
      university: "Cisco Networking Academy",
      course: "Cisco Certified Ethical Hacker",
      status: "Completed",
      expectedGraduation: "September 2025",
      journeyTitle: "Cisco Ethical Hacker Certification",
      overview: "Earned Cisco Certified Ethical Hacker certification to establish a solid grasp of ethical hacking methodologies, network auditing, and vulnerabilities assessment.",
      objectives: "Identify system weaknesses and implement secure network architectures in enterprise settings.",
      outcomes: "Developed skills in network reconnaissance, system exploitation, and responsible disclosure strategies.",
      areasOfStudy: [
        "Network Auditing: Scanning ports, mapping network assets, and identifying active services",
        "Exploitation: Exploiting known vulnerabilities safely and executing privilege escalation",
        "Web Security: Assessing common injection points, OWASP Top 10 vulnerabilities, and authentication flaws",
        "Defense Controls: Implementing firewalls, intrusion detection systems, and baseline controls"
      ],
      skills: ["Ethical Hacking", "Network Scanning", "Vulnerability Assessment", "Exploitation", "Information Security"],
      technologies: ["Nmap", "Wireshark", "Metasploit", "Kali Linux"],
      gallery: ["/journey/cisco-ethical-hacker-cert.jpg"]
    }
  },
  {
    id: "tryhackme-advent-cyber-2025",
    year: 2025,
    category: "Certifications",
    mode: "Online",
    title: "THM Advent of Cyber 2025",
    subtitle: "Certificate of Completion",
    organization: "TryHackMe",
    duration: "2025-12",
    location: "Remote",
    description:
      "Completed 24 consecutive days of hands-on security challenges covering different cybersecurity domains, from web security to digital forensics.",
    imageUrl: "/journey/tryhackme-advent-cyber-cert.jpg",
    imageFit: "contain-dark",
    hasCertificate: true,
    certificateUrl: "https://drive.google.com/file/d/1g6I1DDxG5GmxIlyr9QwMy1LtfsOL6iMN/view?usp=sharing",
    detailsUrl: "",
    icon: Shield,
    accent: "from-red-500 to-rose-600",
    tag: "Advent of Cyber",
    details: {
      university: "TryHackMe",
      course: "Advent of Cyber 2025",
      status: "Completed",
      expectedGraduation: "December 2025",
      journeyTitle: "24-Day Cyber Security Challenge",
      overview: "Completed 24 cyber security challenges covering web application security, cryptography, log analysis, malware analysis, and network defense.",
      objectives: "Develop real-world, hands-on defensive security capabilities through gamified daily rooms.",
      outcomes: "Earned certificate of completion showing consistent daily study and problem solving in cybersecurity.",
      areasOfStudy: [
        "Web Exploitation: Identification of web vulnerabilities like directory traversal and command injection",
        "Malware Analysis: Inspecting malicious payloads, analyzing obfuscated scripts, and understanding behavior",
        "Security Operations: Analyzing server logs, detecting attacks, and investigating traffic flows",
        "Digital Forensics: Reconstructing attack vectors and memory forensics analysis"
      ],
      skills: ["Defensive Security", "Web Exploitation", "Log Analysis", "Malware Analysis", "Incident Response"],
      technologies: ["Wireshark", "CyberChef", "Splunk", "Linux CLI"],
      gallery: ["/journey/tryhackme-advent-cyber-cert.jpg"]
    }
  },
  {
    id: "launch-pad-startup-screening-2026",
    year: 2026,
    category: "Startup Events",
    mode: "Offline",
    title: "Launch Pad Startup Screening",
    subtitle: "Startup Program",
    organization: "BBD University",
    duration: "2026-01",
    location: "Lucknow, Uttar Pradesh",
    description:
      "Selected for the Launch Pad Startup Screening Program at BBD University — pitched Task Nexus, a platform connecting gig workers with clients, to industry mentors and venture scouts.",
    imageUrl: "/journey/startup.webp",
    imageFit: "contain-dark",
    gallery: [
      "/journey/startup.webp",
      "/images/journey/launch1.jpg",
      "/images/journey/launch2.jpg",
      "/images/journey/launch3.jpg",
      "/images/journey/launch4.jpg",
      "/images/journey/launch5.jpg",
      "/images/journey/launch6.jpg",
    ],
    hasCertificate: true,
    certificateUrl: "/journey/startup.webp",
    icon: Rocket,
    accent: "from-lime-400 to-green-600",
    tag: "Startup",
    details: {
      university: "BBD University, SOCA",
      course: "Launch Pad Startup Screening",
      status: "Completed",
      expectedGraduation: "January 2026",
      journeyTitle: "Task Nexus — Gig Economy Middleman Platform",
      overview:
        "Participated in BBD University's Launch Pad Startup Screening program held on 30th January 2026 at CA Block, SOCA. Pitched Task Nexus — a digital marketplace bridging the gap between gig workers and clients by providing a transparent, skill-verified, and escrow-protected task assignment platform.",
      objectives:
        "Design and present a scalable startup idea that solves a real-world employment gap in the gig economy. Demonstrate market research, technical feasibility, and a monetization model to industry mentors and venture scouts.",
      outcomes:
        "Successfully cleared the initial screening round, received mentor feedback on business model refinement, and earned a Certificate of Participation from the School of Computer Applications, BBD University.",
      areasOfStudy: [
        "Startup Ideation: Identifying market gaps in the gig economy and defining a problem-solution fit",
        "Business Model: Subscription tiers, escrow payment flow, and platform commission structure",
        "Product Design: User journey mapping for gig workers and clients on Task Nexus",
        "Pitching Skills: Communicating the value proposition clearly within a limited time to non-technical judges",
        "Market Research: Competitor analysis (Fiverr, Upwork) and differentiation strategy",
      ],
      skills: ["Startup Pitching", "Business Model Design", "Market Research", "Product Thinking", "Communication", "Entrepreneurship"],
      technologies: ["Figma (UI Prototype)", "Google Slides", "Market Analysis Tools"],
      gallery: [
        "/journey/startup.webp",
        "/images/journey/launch1.jpg",
        "/images/journey/launch3.jpg",
        "/images/journey/launch4.jpg",
        "/images/journey/launch5.jpg",
        "/images/journey/launch6.jpg",
      ],
    },
  },

  {
    id: "techx26-hackathon-2026",
    year: 2026,
    category: "Hackathons",
    mode: "Offline",
    title: "TechX26 Hackathon",
    subtitle: "Hackathon",
    organization: "BBD University",
    duration: "2026-02",
    location: "Lucknow, Uttar Pradesh",
    description:
      "Competed in TechX26 Hackathon — built SmartMess, a smart hostel mess management platform designed to streamline meal tracking, feedback, attendance, and administrative operations, under 24 hours.",
    imageUrl: "/images/journey/techx1.jpeg",
    imageFit: "cover",
    gallery: [
      "/images/journey/techx1.jpeg",
      "/images/journey/Techx7.jpg",
      "/images/journey/techx2.jpeg",
      "/images/journey/techx3.jpeg",
      "/images/journey/techx4.jpeg",
      "/images/journey/techx5.jpeg",
      "/images/journey/techx6.jpeg",
    ],
    hasCertificate: true,
    certificateUrl: "https://drive.google.com/file/d/1cFR77Gv6aDqL4qnpzfpa2vo1soz931Xk/view?usp=sharing",
    icon: Code2,
    accent: "from-cyan-400 to-blue-600",
    tag: "Hackathon",
    details: {
      university: "BBD University",
      course: "TechX26 Hackathon — 24-Hour Build Sprint",
      status: "Completed",
      expectedGraduation: "February 2026",
      journeyTitle: "SmartMess — Hostel Mess Management Platform",
      overview:
        "Participated in TechX26, a 24-hour hackathon at BBD University. Built SmartMess — a full-stack web application that digitizes and streamlines hostel mess operations including meal tracking, attendance, feedback collection, and administrative reporting for hostel managers.",
      objectives:
        "Design and deploy a fully functional product within 24 hours that solves a real campus problem. Demonstrate technical depth, teamwork, and a working demo in front of a panel of industry judges and faculty.",
      outcomes:
        "Successfully presented a working prototype of SmartMess with live demo. Gained hands-on experience building under pressure, managing deployment pipelines rapidly, and communicating product value to a judging panel.",
      areasOfStudy: [
        "Full-Stack Development: Rapid API and frontend development with React and Node.js",
        "Database Design: Relational data modeling for meal plans, attendance, and user roles",
        "UI/UX Under Pressure: Designing intuitive admin and student dashboards within time constraints",
        "Team Collaboration: Git-based coordination and task division in a live hackathon environment",
        "Product Demo: Articulating technical implementation and business value to non-technical judges",
      ],
      skills: ["React", "Node.js", "MongoDB", "REST APIs", "UI/UX Design", "Team Collaboration", "Product Demo", "Problem Solving"],
      technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Git"],
      gallery: [
        "/images/journey/techx1.jpeg",
        "/images/journey/Techx7.jpg",
        "/images/journey/techx2.jpeg",
        "/images/journey/techx3.jpeg",
        "/images/journey/techx4.jpeg",
        "/images/journey/techx5.jpeg",
        "/images/journey/techx6.jpeg",
      ],
    },
  },
  {
    id: "hackwithsmile-ctf-2026",
    year: 2026,
    category: "Hackathons",
    mode: "Offline",
    title: "HackWithSmile Conference & CTF",
    subtitle: "Capture The Flag Challenge",
    organization: "HackWithSmile.In",
    duration: "2026-03",
    location: "LPCPS Auditorium, Lucknow",
    description:
      "Participated in the HackWithSmile 2026 Cybersecurity Conference and competed in the live Capture The Flag (CTF) security challenge.",
    imageUrl: "/journey/hackwithsmile-ctf-cert.png",
    imageFit: "contain-dark",
    gallery: [
      "/journey/hackwithsmile-ctf-cert.png",
      "/images/journey/HWS6.JPG",
      "/images/journey/HWS1.jpeg",
      "/images/journey/HWS2.jpg",
      "/images/journey/HWS3.jpeg",
      "/images/journey/HWS4.jpg",
      "/images/journey/HWS5.jpg",
    ],
    hasCertificate: true,
    certificateUrl: "https://drive.google.com/file/d/1OKngJ7O7qKgcvxfsZpIj_LuOuS__RULB/view?usp=sharing",
    icon: Trophy,
    accent: "from-purple-400 to-indigo-600",
    tag: "CTF Challenge",
    details: {
      university: "LPCPS, Lucknow",
      course: "HackWithSmile 2026 CTF",
      status: "Completed",
      expectedGraduation: "March 2026",
      journeyTitle: "HackWithSmile Conference & CTF Participation",
      overview: "Attended the cybersecurity conference sessions and actively solved jeopardy-style CTF challenges in cryptography, reverse engineering, web security, and network forensics.",
      objectives: "Apply analytical thinking and active engagement to solve complex cybersecurity flags under competitive pressure.",
      outcomes: "Recognized with a certificate of participation for solving multiple CTF flags.",
      areasOfStudy: [
        "Jeopardy CTF: Crypto, steganography, reverse engineering, and web exploration tasks",
        "Cyber Security Conference: Industry expert keynotes on zero-trust architectures and cloud security",
        "Engagement: Collaborating with cybersecurity peers and building community connections"
      ],
      skills: ["Capture The Flag", "Analytical Thinking", "Cryptography", "Network Forensics", "Vulnerability Exploitation"],
      technologies: ["Kali Linux", "CyberChef", "Wireshark", "Burp Suite"],
      gallery: [
        "/journey/hackwithsmile-ctf-cert.png",
        "/images/journey/HWS6.JPG",
        "/images/journey/HWS1.jpeg",
        "/images/journey/HWS2.jpg",
        "/images/journey/HWS3.jpeg",
        "/images/journey/HWS4.jpg",
        "/images/journey/HWS5.jpg",
      ],
    }
  },
  {
    id: "wscubetech-masterclass-2026",
    year: 2026,
    category: "Certifications",
    mode: "Online",
    title: "Ethical Hacking Fundamentals",
    subtitle: "WsCube Tech Masterclass",
    organization: "WsCube Tech",
    duration: "2026-03",
    location: "Remote",
    description:
      "Participated in the WsCube Tech Masterclass on Ethical Hacking Fundamentals, gaining introductory insight into penetration testing principles.",
    imageUrl: "/journey/wscubetech-masterclass-cert.jpg",
    imageFit: "contain-dark",
    hasCertificate: true,
    certificateUrl: "https://drive.google.com/file/d/1xrqqWEp5qSzGH6TrQZAcRI7VfhLNh8dR/view?usp=sharing",
    icon: Award,
    accent: "from-teal-400 to-cyan-600",
    tag: "Masterclass",
    details: {
      university: "WsCube Tech",
      course: "Ethical Hacking Fundamentals in 90 Minutes",
      status: "Completed",
      expectedGraduation: "March 2026",
      journeyTitle: "Ethical Hacking Masterclass Participation",
      overview: "Joined the live masterclass session by WsCube Tech focusing on penetration testing, basic reconnaissance, and web vulnerability vectors.",
      objectives: "Understand the methodology of professional white-hat hacking operations.",
      outcomes: "Gained knowledge about the lifecycle of cybersecurity attacks and remediation strategies.",
      areasOfStudy: [
        "Reconnaissance: Basic domain discovery, scanning, and DNS lookups",
        "Penetration Testing: Phases of penetration testing and reporting standards",
        "Security Baselines: Understanding how firewalls and patch management prevent basic exploits"
      ],
      skills: ["Ethical Hacking Basics", "Cybersecurity Concepts", "Vulnerability Scanning", "Network Basics"],
      technologies: ["Nmap", "Whois", "VirtualBox"],
      gallery: ["/journey/wscubetech-masterclass-cert.jpg"]
    }
  },
  {
    id: "top-1-percent-tryhackme-2026",
    year: 2026,
    category: "Achievements",
    mode: "Online",
    title: "Top 1% on TryHackMe",
    subtitle: "Achievement",
    organization: "TryHackMe",
    duration: "2026-03",
    location: "Remote",
    description:
      "Achieved Top 1% global ranking on TryHackMe with a 310+ day learning streak, completing rooms in pentesting, web security, and digital forensics.",
    imageUrl: "/images/journey/top1-thm.png",
    imageFit: "contain-dark",
    hasCertificate: false,
    certificateUrl: "",
    detailsUrl: "https://tryhackme.com/",
    icon: Star,
    accent: "from-yellow-400 to-amber-600",
    tag: "Achievement",
  },
  {
    id: "product-builders-day-2026",
    year: 2026,
    category: "Workshops",
    mode: "Offline",
    title: "Learning Beyond Code at Product Builder's Day",
    subtitle: "Workshops",
    organization: "Google Developer Groups Lucknow",
    duration: "March 28, 2026",
    location: "Integral University, Lucknow, Uttar Pradesh",
    description:
      "A refreshing break from regular coding, focused on builder mindset, entrepreneurship, networking, and AI-powered systems.",
    imageUrl: "/images/journey/Product1.jpeg",
    imageFit: "cover",
    gallery: [
      "/images/journey/Product1.jpeg",
      "/images/journey/Product2.jpeg",
      "/images/journey/Product3.jpeg",
      "/images/journey/Product4.jpeg",
      "/images/journey/Product5.jpeg",
    ],
    hasCertificate: false,
    certificateUrl: "",
    icon: Rocket,
    accent: "from-amber-400 to-orange-600",
    tag: "Workshops",
    details: {
      university: "Google Developer Groups Lucknow",
      course: "Product Builder's Day",
      status: "Completed",
      expectedGraduation: "March 28, 2026",
      journeyTitle: "Product Builder's Day at Integral University",
      overview: "A refreshing break from regular coding, focused on builder mindset, entrepreneurship, networking, and AI-powered systems.",
      objectives: "Focus on shifting mindset from developer to builder, learning entrepreneurship skills, and deploying AI-powered applications.",
      outcomes: "Acquired hands-on exposure to Gemini Code Assist, established relationships with local developers, and learned practical business planning workflows.",
      areasOfStudy: [
        "Developer-to-builder and founder mindset insights",
        "Practical networking strategies for student developers",
        "Future direction of AI-powered applications",
        "Real-world implementation workshop with Gemini Code Assist"
      ],
      skills: ["Generative AI", "Gemini Code Assist", "Networking", "Entrepreneurship", "System Design"],
      technologies: ["Gemini API", "React", "Google Cloud Platform"],
      gallery: [
        "/images/journey/Product1.jpeg",
        "/images/journey/Product2.jpeg",
        "/images/journey/Product3.jpeg",
        "/images/journey/Product4.jpeg",
        "/images/journey/Product5.jpeg",
      ]
    }
  },
  {
    id: "hackerone-security-researcher-2026",
    year: 2026,
    category: "Experience",
    mode: "Online",
    title: "HackerOne Security Researcher",
    subtitle: "Bug Bounty",
    organization: "HackerOne",
    duration: "2026-05",
    location: "Remote",
    description:
      "Started independent Security Research on HackerOne — performing web application and API security testing, discovering and disclosing real-world vulnerabilities.",
    imageUrl: "/images/journey/hackerone.jpg",
    imageFit: "contain-dark",
    hasCertificate: false,
    certificateUrl: "",
    detailsUrl: "https://hackerone.com/",
    icon: Shield,
    accent: "from-orange-400 to-red-600",
    tag: "Research",
  },
  {
    id: "openai-ai-foundations-2026",
    year: 2026,
    category: "Certifications",
    mode: "Online",
    title: "OpenAI Academy - AI Foundations",
    subtitle: "Certification",
    organization: "OpenAI Academy",
    duration: "2026-06",
    location: "Remote",
    description:
      "Completed OpenAI Academy's AI Foundations course covering generative model architectures, prompt engineering, fine-tuning concepts, and ethical AI implementation.",
    imageUrl: "/journey/openai-ai-foundations-cert.jpg",
    imageFit: "contain-dark",
    hasCertificate: true,
    certificateUrl: "https://drive.google.com/file/d/1bZPYeVsI4lhTePoSWyH2DsibkQ2UiDVu/view?usp=sharing",
    icon: Cpu,
    accent: "from-emerald-400 to-green-600",
    tag: "AI Foundations",
    details: {
      university: "OpenAI Academy",
      course: "AI Foundations",
      status: "Completed",
      expectedGraduation: "June 2026",
      journeyTitle: "AI Foundations Course Completion",
      overview: "Gained structural understanding of large language models, reinforcement learning from human feedback (RLHF), prompt design, and deploying models using OpenAI APIs.",
      objectives: "Harness modern generative models to build intelligent systems while adhering to safety guidelines.",
      outcomes: "Capable of designing agentic workflows, prompt templates, and integrating AI features into applications.",
      areasOfStudy: [
        "Model Architectures: Transformers, self-attention mechanisms, and scaling laws",
        "Prompt Engineering: Few-shot learning, chain-of-thought prompting, and system instructions",
        "API Development: Fine-tuning endpoints, embedding search, and function calling workflows",
        "AI Ethics: Safety alignments, toxicity mitigation, and compliance frameworks"
      ],
      skills: ["Artificial Intelligence", "Prompt Engineering", "Large Language Models", "API Integration", "AI Ethics"],
      technologies: ["OpenAI API", "GPT-4", "Embeddings", "Function Calling"],
      gallery: ["/journey/openai-ai-foundations-cert.jpg"]
    }
  },
  {
    id: "assocham-samarth-2026",
    year: 2026,
    category: "Internships",
    mode: "Offline",
    title: "ASSOCHAM SAMARTH 2.0 Internship",
    subtitle: "Industry Internship",
    organization: "ASSOCHAM UP-UK",
    duration: "1 June - 15 July 2026",
    location: "Lucknow, Uttar Pradesh",
    description:
      "Selected for AICTE-supported SAMARTH 2.0 Industry Exposure Internship — gained real-world industry experience under ASSOCHAM guidance.",
    imageUrl: "/images/journey/Certi1.jpeg",
    imageFit: "cover",
    gallery: [
      "/images/journey/Certi1.jpeg",
      "/images/journey/samarth-internship-cert.jpeg",
      "/images/journey/Cert2.jpeg",
      "/images/journey/Cert3.jpeg",
    ],
    hasCertificate: true,
    certificateUrl: "/images/journey/samarth-internship-cert.jpeg",
    icon: Briefcase,
    accent: "from-teal-400 to-cyan-600",
    tag: "Internship",
    details: {
      university: "ASSOCHAM UP-UK",
      course: "SAMARTH 2.0 Internship",
      status: "Completed",
      expectedGraduation: "June 2026",
      journeyTitle: "SAMARTH 2.0 Industry Exposure Program",
      overview: "Selected for the AICTE-supported SAMARTH 2.0 Industry Exposure Internship. Gained direct insights into trade organization operations, industrial policy advocacy, regional business development ecosystems, and corporate compliance frameworks.",
      objectives: "Understand how trade bodies facilitate regional business growth, connect enterprises with academic initiatives, and drive digital compliance policies.",
      outcomes: "Completed the internship program, participated in trade organization workshops, and earned an internship completion certificate from ASSOCHAM.",
      areasOfStudy: [
        "Trade Body Operations: Internal functioning of trade councils and industrial coordination",
        "Policy Advocacy: How industrial policies are formulated, reviewed, and recommended to government bodies",
        "Enterprise Digitalization: Exposure to technology integration and compliance across regional MSMEs"
      ],
      skills: ["Industry Exposure", "Policy Advocacy", "Corporate Communication", "Digital Compliance", "Business Networking"],
      technologies: ["Office Suite", "Collaboration Tools", "CRM Platforms"],
      gallery: [
        "/images/journey/Certi1.jpeg",
        "/images/journey/samarth-internship-cert.jpeg",
        "/images/journey/Cert2.jpeg",
        "/images/journey/Cert3.jpeg",
      ],
    }
  },
  {
    id: "android-nova-2026",
    year: 2026,
    category: "Hackathons",
    mode: "Offline",
    title: "Android Nova 2.0 Participation",
    subtitle: "Tech Event & Collaboration",
    organization: "Android Lucknow & CIC",
    duration: "17 July 2026",
    location: "LPCPS, Lucknow",
    description:
      "Actively participated in Android Nova 2.0, organized by Android Lucknow in collaboration with Cyber Intelligence Community (CIC).",
    imageUrl: "/images/journey/Android2.jpeg",
    imageFit: "cover",
    gallery: [
      "/images/journey/Android2.jpeg",
      "/images/journey/Android1.png",
      "/images/journey/Android3.jpeg",
      "/images/journey/Android4.jpg",
      "/images/journey/Android5.jpg",
      "/images/journey/Android6.jpg",
    ],
    hasCertificate: true,
    certificateUrl: "https://drive.google.com/file/d/1d__UiL6FYPGlbWf1zHwrFyURRqzkjRM6/view?usp=sharing",
    icon: Rocket,
    accent: "from-lime-400 to-green-600",
    tag: "Participation",
    details: {
      university: "LPCPS, Lucknow",
      course: "Android Nova 2.0",
      status: "Completed",
      expectedGraduation: "2026",
      journeyTitle: "Android Nova 2.0 Collaborative Event",
      overview: "Participated in workshops and collaboration sprints during the Android Nova 2.0 developer gathering, learning mobile development and app security.",
      objectives: "Engage with mobile development experts and implement Android app development best practices.",
      outcomes: "Earned certificate of participation from Android Lucknow and Cyber Intelligence Community.",
      areasOfStudy: [
        "Android Ecosystem: Overview of mobile application frameworks and SDKs",
        "App Security: Overview of reverse engineering and vulnerability scanning on mobile platforms",
        "Collaborative Dev: Brainstorming ideas and designing responsive Android user interfaces"
      ],
      skills: ["Android Development", "App Design", "Mobile Security", "Collaboration"],
      technologies: ["Android SDK", "Java/Kotlin", "XML", "Git"],
      gallery: [
        "/images/journey/Android2.jpeg",
        "/images/journey/Android1.png",
        "/images/journey/Android3.jpeg",
        "/images/journey/Android4.jpg",
        "/images/journey/Android5.jpg",
        "/images/journey/Android6.jpg",
      ],
    }
  },
  {
    id: "nerds-hack-days-lucknow-2026",
    year: 2026,
    category: "Hackathons",
    mode: "Offline",
    title: "Nerds Hack Days Lucknow",
    subtitle: "Nerds Room × Major League Hacking (MLH)",
    organization: "PW Institute of Innovation, Lucknow",
    duration: "2026-07-26",
    location: "PW Institute of Innovation, Lucknow",
    description:
      "Participated in Nerds Hack Days Lucknow, a national hackathon organized by Nerds Room and supported by Major League Hacking (MLH). Built Kanoon-Mate, an AI-powered Legal Operating System that simplifies legal documents, provides intelligent legal guidance, and demonstrates AI-driven case tracking for citizens and lawyers.",
    imageUrl: "/images/journey/Nerd1.jpg",
    imageFit: "cover",
    gallery: [
      "/images/journey/Nerd1.jpg",
      "/images/journey/Nerd2.jpg",
      "/images/journey/Nerd3.jpg",
      "/images/journey/Nerd4.jpg",
      "/images/journey/Nerd5.jpg",
      "/images/journey/Nerd6.jpg",
      "/images/journey/Nerd7.jpg",
    ],
    hasCertificate: true,
    certificateUrl: "https://drive.google.com/file/d/1zx1V8cE4ARLKrAYyu1ILGtZVwmpDGVbA/view?usp=sharing",
    icon: Trophy,
    accent: "from-emerald-400 to-teal-500",
    tag: "Hackathon",
    details: {
      university: "PW Institute of Innovation, Lucknow",
      course: "Nerds Hack Days Lucknow — AI & LegalTech Innovation Hackathon",
      status: "Completed",
      journeyTitle: "Kanoon-Mate — AI Legal Operating System",
      overview:
        "Participated in Nerds Hack Days Lucknow, where our team Bro Code designed and developed Kanoon-Mate, an AI-powered Legal Operating System focused on making legal assistance more accessible. The platform leverages AI to analyze legal documents, simplify complex legal language, detect relevant laws, assess risks, and automate legal workflows through an intelligent multi-agent architecture.",
      problem:
        "Millions of citizens struggle to understand legal documents, identify applicable laws, and know the next steps after receiving legal notices. At the same time, lawyers spend considerable time manually tracking hearing dates, court orders, and case progress, leading to repetitive administrative work and reduced efficiency.",
      solution:
        "Developed Kanoon-Mate, an AI-powered Legal Operating System that transforms complex legal processes into simple, guided workflows. The platform combines document intelligence, legal analysis, AI-generated summaries, actionable guidance, and an AI-powered case tracking workflow to assist both citizens and legal professionals.",
      objectives:
        "Design and build an AI-powered legal assistance platform within the hackathon timeframe that addresses real-world legal accessibility challenges, demonstrates practical AI integration, and delivers a functional prototype capable of solving meaningful problems for citizens and lawyers.",
      outcomes:
        "Successfully presented a working prototype of Kanoon-Mate to mentors and judges. The project received valuable feedback on product vision, workflow automation, and real-world deployment considerations. Beyond the technical implementation, the experience strengthened our understanding of AI agents, rapid product development, collaborative problem-solving, and effective technical pitching under time constraints.",
      challenge:
        "One of the biggest challenges was designing an intelligent legal workflow that could demonstrate automated case tracking without direct access to live court systems. We addressed this by creating a realistic prototype using mock legal data while designing the architecture to support future integration with official court data sources where permitted.",
      keyFeatures: [
        "AI-powered Legal Document Analysis & Summarization",
        "Relevant Law & Section Detection",
        "Risk Assessment & Personalized Legal Guidance",
        "Hearing Timeline & Deadline Extraction",
        "AI Case Tracking Workflow for Automated Updates",
        "Smart Notifications for Citizens & Lawyers",
        "Multi-Agent AI Workflow Architecture",
      ],
      areasOfStudy: [
        "AI Agent Architecture & Workflow Design",
        "Generative AI Integration (Gemini API)",
        "OCR & Intelligent Document Processing",
        "Full-Stack Development with React & Node.js",
        "LegalTech Product Design & User Experience",
        "Team Collaboration & Agile Development",
        "Product Pitching & Technical Communication",
        "Rapid Prototyping in a Hackathon Environment",
      ],
      skills: [
        "Artificial Intelligence",
        "Generative AI",
        "React",
        "Node.js",
        "MongoDB",
        "OCR",
        "AI Workflow Design",
        "Problem Solving",
        "Product Pitching",
        "Team Collaboration",
        "Rapid Prototyping",
        "LegalTech",
      ],
      technologies: [
        "React",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Tailwind CSS",
        "Gemini API",
        "OCR",
        "JavaScript",
        "Git",
        "GitHub",
        "Vercel",
      ],
      gallery: [
        "/images/journey/Nerd1.jpg",
        "/images/journey/Nerd2.jpg",
        "/images/journey/Nerd3.jpg",
        "/images/journey/Nerd4.jpg",
        "/images/journey/Nerd5.jpg",
        "/images/journey/Nerd6.jpg",
        "/images/journey/Nerd7.jpg",
      ],
    },
  },
];

const filterGroups = [
  "All",
  "Education",
  "Internships",
  "Workshops",
  "Hackathons",
  "Academic Programs",
  "Conferences",
  "Certifications",
  "Startup Events",
];

const formatLabel = (value = "") => {
  if (!value) return "";
  const parts = value.split("-");
  if (parts.length >= 2) {
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    const months = {
      "01": "January",
      "02": "February",
      "03": "March",
      "04": "April",
      "05": "May",
      "06": "June",
      "07": "July",
      "08": "August",
      "09": "September",
      "10": "October",
      "11": "November",
      "12": "December",
    };
    if (months[month]) {
      if (day) {
        return `${parseInt(day, 10)} ${months[month]} ${year}`;
      }
      return `${months[month]} ${year}`;
    }
  }
  return value;
};
// Fixed year navigator — highlights active year on scroll (exact July 20 commit implementation)
const FixedYearNav = ({ years, activeYear, onYearClick }) => (
  <div className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 xl:flex xl:flex-col xl:items-center">
    {/* Capsule container */}
    <div className="flex flex-col items-center gap-1 rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-zinc-950/95 px-3 py-4 shadow-xl dark:shadow-[0_8px_48px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      {/* Label */}
      <p className="mb-3 text-[8px] font-bold uppercase tracking-[0.4em] text-slate-500 dark:text-zinc-600">
        Years
      </p>

      {/* Year buttons */}
      <div className="flex flex-col items-center gap-2.5">
        {years.map((year) => {
          const isActive = activeYear === year;
          return (
            <button
              key={year}
              onClick={(e) => onYearClick(e, year)}
              aria-label={`Go to year ${year}`}
              className={`relative flex h-12 w-12 flex-col items-center justify-center rounded-[14px] border text-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 ${
                isActive
                  ? "scale-110 border-lime-300 bg-lime-300 shadow-[0_0_24px_rgba(163,230,53,0.6),0_0_0_4px_rgba(163,230,53,0.15)]"
                  : "border-transparent bg-zinc-900/80 text-zinc-500 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-300"
              }`}
            >
              <span
                className={`text-[9px] font-semibold leading-none ${
                  isActive ? "text-black/50" : "text-zinc-600"
                }`}
              >
                {String(year).slice(0, 2)}
              </span>
              <span
                className={`text-[14px] font-black leading-none ${
                  isActive ? "text-black" : ""
                }`}
              >
                {String(year).slice(2)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);



// GALLERY LIGHTBOX
const GalleryLightbox = ({ images, startIndex = 0, onClose }) => {
  const [current, setCurrent] = useState(startIndex);

  const prev = useCallback(() =>
    setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() =>
    setCurrent((c) => (c + 1) % images.length), [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] flex flex-col bg-black/95 backdrop-blur-xl"
        onClick={onClose}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            <Camera size={18} className="text-lime-300" />
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-white">
              Gallery
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs font-semibold text-zinc-400">
              {current + 1} / {images.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition hover:border-white/30 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Main image */}
        <div
          className="relative flex flex-1 items-center justify-center overflow-hidden px-16"
          onClick={(e) => e.stopPropagation()}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={images[current]}
              alt={`Gallery image ${current + 1}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.25 }}
              className="max-h-full max-w-full rounded-2xl object-contain shadow-[0_24px_80px_rgba(0,0,0,0.9)]"
            />
          </AnimatePresence>

          {/* Prev button */}
          <button
            onClick={prev}
            className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-lime-300/50 hover:bg-lime-300/10 hover:text-lime-300"
          >
            <ChevronLeft size={22} />
          </button>
          {/* Next button */}
          <button
            onClick={next}
            className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-lime-300/50 hover:bg-lime-300/10 hover:text-lime-300"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Thumbnail strip */}
        <div
          className="flex items-center justify-center gap-2 overflow-x-auto px-6 py-4"
          style={{ scrollbarWidth: "none" }}
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                i === current
                  ? "border-lime-300 scale-110 shadow-[0_0_16px_rgba(163,230,53,0.5)]"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <img src={src} alt={`thumb-${i}`} className="h-full w-full object-cover" width={80} height={56} loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// DETAILS PANEL — inline expandable
const DetailsPanel = ({ d, accent, imageUrl }) => (
  <div className="border-t border-zinc-200 dark:border-white/[0.07] bg-zinc-50 dark:bg-zinc-950/60 px-5 py-6">
    {/* Meta grid */}
    <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: "Location / Org", value: d.university },
        { label: "Course / Event", value: d.course },
        { label: "Current Status", value: d.status },
        { label: "Expected Graduation", value: d.expectedGraduation },
      ].filter(({ value }) => Boolean(value)).map(({ label, value }) => (
        <div key={label} className="rounded-xl border border-zinc-200 dark:border-white/[0.06] bg-white dark:bg-zinc-900/60 p-3">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-600">{label}</p>
          <p className="text-xs font-bold text-zinc-900 dark:text-white">{value}</p>
        </div>
      ))}
    </div>

    {/* Journey title */}
    <p className={`mb-4 bg-gradient-to-r ${accent} bg-clip-text text-sm font-black uppercase tracking-wider text-transparent`}>
      {d.journeyTitle}
    </p>

    {/* Text Sections */}
    {[
      { key: "overview", label: "// Overview", text: d.overview },
      { key: "problem", label: "// Problem", text: d.problem },
      { key: "solution", label: "// Solution", text: d.solution },
      { key: "objectives", label: "// Objectives", text: d.objectives },
      { key: "outcomes", label: "// Outcomes", text: d.outcomes },
      { key: "challenge", label: "// Challenge", text: d.challenge },
    ].filter(({ text }) => Boolean(text)).map(({ key, label, text }) => (
      <div key={key} className="mb-4">
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
        <p className="text-[0.8rem] leading-6 text-zinc-600 dark:text-zinc-300">{text}</p>
      </div>
    ))}

    {/* Key Features */}
    {d.keyFeatures?.length > 0 && (
      <div className="mb-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-500">// Key Features</p>
        <ul className="space-y-1.5">
          {d.keyFeatures.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-[0.78rem] leading-5 text-zinc-600 dark:text-zinc-300">
              <span className={`mt-[3px] shrink-0 bg-gradient-to-r ${accent} bg-clip-text text-xs font-black text-transparent`}>→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Areas of Study */}
    {d.areasOfStudy?.length > 0 && (
      <div className="mb-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-500">// Areas of Study</p>
        <ul className="space-y-1.5">
          {d.areasOfStudy.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-[0.78rem] leading-5 text-zinc-600 dark:text-zinc-300">
              <span className={`mt-[3px] shrink-0 bg-gradient-to-r ${accent} bg-clip-text text-xs font-black text-transparent`}>→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Gallery */}
    {d.gallery?.length > 0 && (
      <div className="mb-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">// Gallery Preview</p>
        <div className="flex gap-2">
          {d.gallery.map((src, i) => (
            <img key={i} src={src} alt="gallery" className="h-20 w-20 rounded-xl object-cover border border-white/[0.08]" width={80} height={80} loading="lazy" decoding="async" />
          ))}
        </div>
        <p className="mt-1 text-[9px] text-zinc-600">{d.gallery.length} Photo{d.gallery.length !== 1 ? "s" : ""}</p>
      </div>
    )}

    {/* Skills */}
    <div className="mb-4">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">// Skills Gained</p>
      <div className="flex flex-wrap gap-1.5">
        {d.skills.map((s) => (
          <span key={s} className="rounded-lg border border-zinc-200 dark:border-white/[0.07] bg-zinc-100 dark:bg-zinc-800/60 px-2.5 py-1 text-[10px] font-semibold text-zinc-700 dark:text-zinc-300">{s}</span>
        ))}
      </div>
    </div>

    {/* Technologies */}
    <div>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-500">// Technologies Covered</p>
      <div className="flex flex-wrap gap-1.5">
        {d.technologies.map((t) => (
          <span key={t} className={`rounded-lg bg-gradient-to-r ${accent} px-2.5 py-1 text-[10px] font-bold text-black`}>{t}</span>
        ))}
      </div>
    </div>
  </div>
);

// JOURNEY CARD
const JourneyCard = ({ event, side = "left", isExpanded, onToggle }) => {
  const Icon = event.icon || Award;
  const hasDetails = Boolean(event.details);
  const hasGallery = event.gallery?.length > 0;
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      {/* Gallery lightbox portal */}
      {lightboxOpen && hasGallery && (
        <GalleryLightbox
          images={event.gallery}
          startIndex={0}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <motion.article
        initial={{ opacity: 0, x: side === "left" ? -50 : 50, y: 16 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: "-50px 0px" }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="group relative w-full max-w-2xl overflow-hidden rounded-[1.6rem] border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/70 shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-all duration-500 hover:border-zinc-300 dark:hover:border-white/[0.15] hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.7)] transform-gpu will-change-transform"
      >
        {/* Top accent line */}
        <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${event.accent} opacity-80`} />
        {/* Ambient glow */}
        <div className={`pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br ${event.accent} opacity-[0.05] blur-3xl`} />

        {/* Image */}
        <div
          className={`relative h-64 overflow-hidden bg-zinc-800 ${hasGallery ? "cursor-pointer" : ""}`}
          onClick={hasGallery ? () => setLightboxOpen(true) : undefined}
        >
          <img
            src={event.imageUrl}
            alt={event.title}
            className={`h-full w-full transition-transform duration-700 group-hover:scale-105 ${
              event.imageFit === "contain"
                ? "object-contain p-6 bg-white"
                : event.imageFit === "contain-dark"
                ? "object-contain p-6 bg-zinc-950/80"
                : "object-cover"
            }`}
            width={800}
            height={256}
            loading="lazy"
            decoding="async"
            style={{ aspectRatio: "16/9" }}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />

          {/* Gallery hover overlay */}
          {hasGallery && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/50">
              <span className="flex translate-y-3 items-center gap-2 rounded-full border border-lime-300 bg-black/70 px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.22em] text-lime-300 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <Images size={13} />
                View Gallery
              </span>
            </div>
          )}

          {/* Photo count badge */}
          {hasGallery && (
            <div className="absolute right-4 top-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                <Camera size={10} className="text-lime-300" />
                +{event.gallery.length} Photos
              </span>
            </div>
          )}

          <div className="absolute left-4 top-4">
            <span className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${event.accent} px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-black shadow-lg`}>
              <Icon size={10} />
              {event.tag}
            </span>
          </div>
          {/* Mode badge — only show when no gallery (gallery has photo count instead) */}
          {!hasGallery && (
            <div className="absolute right-4 top-4">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
                {event.mode}
              </span>
            </div>
          )}
        </div>

      {/* Content */}
      <div className="p-6">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-500">{event.subtitle}</p>
        <h3 className="text-[1.25rem] font-black leading-snug text-zinc-900 dark:text-white sm:text-[1.4rem]">{event.title}</h3>
        <p className={`mt-1 bg-gradient-to-r ${event.accent} bg-clip-text text-xs font-semibold uppercase tracking-wider text-transparent`}>
          {event.organization}
        </p>

        <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-zinc-500 dark:text-zinc-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={11} className="text-zinc-500 dark:text-zinc-600" />
            {formatLabel(event.duration)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={11} className="text-zinc-500 dark:text-zinc-600" />
            {event.location}
          </span>
        </div>

        <p className="mt-3 text-[0.85rem] leading-6 text-zinc-600 dark:text-zinc-400">{event.description}</p>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {/* Details toggle button */}
          {hasDetails && (
            <button
              type="button"
              onClick={onToggle}
              className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${event.accent} px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-black transition-all hover:opacity-90 hover:shadow-lg`}
            >
              {isExpanded ? (
                <><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg> Hide Details</>
              ) : (
                <><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg> View Details</>
              )}
            </button>
          )}
          {/* Certificate link — only when available */}
          {event.hasCertificate && (
            <a
              href={event.certificateUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 dark:border-emerald-400/30 bg-emerald-500/10 dark:bg-emerald-400/10 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300 transition-all hover:border-emerald-500/60 dark:hover:border-emerald-400/60 hover:bg-emerald-500/20 dark:hover:bg-emerald-400/20"
            >
              <FileBadge size={11} />
              Certificate
            </a>
          )}
        </div>
      </div>

        {/* Inline details panel */}
        <AnimatePresence>
          {isExpanded && event.details && (
            <motion.div
              key="details"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
            >
              <DetailsPanel d={event.details} accent={event.accent} imageUrl={event.imageUrl} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
    </>
  );
};

// GRID CARD (compact)
const GridCard = ({ event, isExpanded, onToggle }) => {
  const Icon = event.icon || Award;
  const hasDetails = Boolean(event.details);
  const hasGallery = event.gallery?.length > 0;
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      {/* Gallery lightbox portal */}
      {lightboxOpen && hasGallery && (
        <GalleryLightbox
          images={event.gallery}
          startIndex={0}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px 0px" }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="group relative flex flex-col overflow-hidden rounded-[1.4rem] border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/60 shadow-[0_4px_24px_rgba(0,0,0,0.07)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all duration-500 hover:border-zinc-300 dark:hover:border-white/[0.14] hover:-translate-y-1 transform-gpu will-change-transform"
      >
        <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${event.accent} opacity-80`} />
        
        {/* Image wrapper */}
        <div
          className={`relative h-48 overflow-hidden bg-zinc-800 ${hasGallery ? "cursor-pointer" : ""}`}
          onClick={hasGallery ? () => setLightboxOpen(true) : undefined}
        >
          <img
            src={event.imageUrl}
            alt={event.title}
            className={`h-full w-full transition-transform duration-700 group-hover:scale-105 ${
              event.imageFit === "contain"
                ? "object-contain p-4 bg-white"
                : event.imageFit === "contain-dark"
                ? "object-contain p-4 bg-zinc-950/80"
                : "object-cover"
            }`}
            width={800}
            height={192}
            loading="lazy"
            decoding="async"
            style={{ aspectRatio: "16/9" }}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/70 to-transparent" />

          {/* Gallery hover overlay */}
          {hasGallery && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/50">
              <span className="flex translate-y-2 items-center gap-1.5 rounded-full border border-lime-300 bg-black/70 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-lime-300 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <Images size={11} />
                View Gallery
              </span>
            </div>
          )}

          {/* Photo count badge */}
          {hasGallery && (
            <div className="absolute right-3 top-3">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                <Camera size={9} className="text-lime-300" />
                +{event.gallery.length} Photos
              </span>
            </div>
          )}

          <span className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${event.accent} px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black`}>
            <Icon size={9} />
            {event.tag}
          </span>
          
          {/* Mode badge — only show when no gallery */}
          {!hasGallery && (
            <div className="absolute right-3 top-3">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
                {event.mode}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{formatLabel(event.duration)}</p>
          <h3 className="text-sm font-bold leading-snug text-zinc-900 dark:text-white">{event.title}</h3>
          <p className={`mt-0.5 bg-gradient-to-r ${event.accent} bg-clip-text text-[10px] font-semibold uppercase tracking-wider text-transparent`}>
            {event.organization}
          </p>
          <p className="mt-2 text-[11.5px] leading-5 text-zinc-600 dark:text-zinc-400">{event.description}</p>
          
          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {/* Details toggle button */}
            {hasDetails && (
              <button
                type="button"
                onClick={onToggle}
                className={`inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r ${event.accent} px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-black transition-all hover:opacity-90`}
              >
                {isExpanded ? (
                  <><svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg> Hide Details</>
                ) : (
                  <><svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg> View Details</>
                )}
              </button>
            )}

            {/* Certificate link */}
            {event.hasCertificate && (
              <a
                href={event.certificateUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 dark:border-emerald-400/30 bg-emerald-500/10 dark:bg-emerald-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300 transition-all hover:border-emerald-500/60 dark:hover:border-emerald-400/60 hover:bg-emerald-500/20 dark:hover:bg-emerald-400/20"
              >
                <FileBadge size={9} />
                Certificate
              </a>
            )}
          </div>
        </div>

        {/* Inline details panel */}
        <AnimatePresence>
          {isExpanded && event.details && (
            <motion.div
              key="details"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
            >
              <DetailsPanel d={event.details} accent={event.accent} imageUrl={event.imageUrl} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
    </>
  );
};

// TIMELINE DOT
const TimelineDot = ({ isActive }) => (
  <div
    className={`relative z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all duration-500 ${
      isActive
        ? "scale-125 border-lime-300 bg-lime-300 shadow-[0_0_20px_rgba(163,230,53,1),0_0_0_6px_rgba(163,230,53,0.2)]"
        : "border-zinc-700 bg-zinc-950 shadow-[0_0_0_4px_rgba(255,255,255,0.04)]"
    }`}
  >
    {isActive && (
      <motion.div
        className="h-1.5 w-1.5 rounded-full bg-black"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      />
    )}
  </div>
);

// MAIN PAGE
const JourneyPage = () => {
  const { hash } = useLocation();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [view, setView] = useState("timeline");
  const [activeYear, setActiveYear] = useState(2024);
  const [expandedId, setExpandedId] = useState(null);

  // Scroll to and expand card matching URL hash
  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    const timer = setTimeout(() => {

      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setExpandedId(id);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [hash]);

  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [showCategoryFilters, setShowCategoryFilters] = useState(true);
  const isScrollingLocked = useRef(false);

  const toggleExpand = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const statsSummary = useMemo(() => {
    const totalExperiences = journeyData.length;
    const internships = journeyData.filter((e) => e.category === "Internships").length;
    const workshops = journeyData.filter((e) => e.category === "Workshops" || e.category === "Startup Events").length;
    const certifications = journeyData.filter((e) => e.category === "Certifications").length;
    const conferences = journeyData.filter((e) => e.category === "Hackathons").length;
    return { totalExperiences, internships, workshops, certifications, conferences };
  }, []);

  
  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return journeyData.filter((event) => {
      const matchesCategory =
        activeFilter === "All" ||
        event.category === activeFilter ||
        (activeFilter === "Education" && event.category === "Academic Programs") ||
        (activeFilter === "Conferences" && event.category === "Hackathons");
      if (!keyword) return matchesCategory;
      const searchable =
        `${event.title} ${event.organization} ${event.description} ${event.location} ${event.year} ${event.category}`.toLowerCase();
      return matchesCategory && searchable.includes(keyword);
    });
  }, [activeFilter, search]);

  const allYears = useMemo(
    () =>
      Array.from(new Set(journeyData.map((e) => e.year))).sort((a, b) => a - b),
    []
  );

  const groupedByYear = useMemo(() => {
    const map = new Map();
    filteredData.forEach((event) => {
      const list = map.get(event.year) || [];
      list.push(event);
      map.set(event.year, list);
    });
    return allYears
      .filter((y) => map.has(y))
      .map((year) => ({ year, items: map.get(year) }));
  }, [filteredData, allYears]);

  
  const scrollToYear = useCallback((year) => {
    const el = document.getElementById(`year-${year}`);
    if (!el) return;
    const header =
      document.querySelector("header") || document.querySelector("nav");
    const headerH = header ? header.getBoundingClientRect().height : 80;
    const top = el.getBoundingClientRect().top + window.scrollY - headerH - 32;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  const handleYearClick = useCallback(
    (e, year) => {
      e.preventDefault();
      isScrollingLocked.current = true;
      setActiveYear(year);

      const hasYear = groupedByYear.some((g) => g.year === year);
      if (!hasYear) {
        setActiveFilter("All");
        setTimeout(() => {
          scrollToYear(year);
          setTimeout(() => {
            isScrollingLocked.current = false;
          }, 900);
        }, 80);
      } else {
        scrollToYear(year);
        setTimeout(() => {
          isScrollingLocked.current = false;
        }, 900);
      }
    },
    [groupedByYear, scrollToYear]
  );

  
  useEffect(() => {
    if (allYears.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingLocked.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const year = parseInt(
              entry.target.id.replace("year-", ""),
              10
            );
            if (!isNaN(year)) setActiveYear(year);
          }
        });
      },
      { root: null, rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    // Re-observe whenever view or data changes
    allYears.forEach((year) => {
      const el = document.getElementById(`year-${year}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [allYears, view, filteredData]);

  
  useEffect(() => {
    if (allYears.length > 0 && activeYear === null) {
      setActiveYear(allYears[0]);
    }
  }, [allYears, activeYear]);

  
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY < 150 && allYears.length > 0) {
        setActiveYear(allYears[0]);
      }
      if (window.scrollY > 300) {
        setShowFloatingNav(true);
      } else {
        setShowFloatingNav(false);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [allYears]);

  
  return (
    <>
      <SeoHead
        title="Professional Journey"
        description="Chronological professional journey of Nikhil Agrahari covering education, internships, workshops, hackathons, certifications, and achievements."
        pathname="/journey"
        keywords={[
          "Nikhil journey timeline",
          "portfolio timeline",
          "internships certifications hackathons",
          "professional journey",
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Journey", url: "/journey" },
        ])}
      />

      


      
      {view === "timeline" && (showFloatingNav || search.trim() !== "") && (
        <FixedYearNav
          years={allYears}
          activeYear={activeYear}
          onYearClick={handleYearClick}
        />
      )}

      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-20 bg-white/0">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/5 blur-[120px]" />
          <div className="absolute right-1/3 top-2/3 h-72 w-72 translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-lime-500/30 dark:border-lime-300/20 bg-lime-500/[0.06] dark:bg-lime-300/[0.04] px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-lime-600 dark:text-lime-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-500 dark:bg-lime-300" />
              Professional Growth
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="mt-4 font-display text-[8.2vw] sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.05] tracking-tight text-zinc-900 dark:text-white"
          >
            PROFESSIONAL
            <br />
            <span className="bg-gradient-to-r from-lime-300 to-lime-500 bg-clip-text text-transparent">
              JOURNEY
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-zinc-500 dark:text-zinc-400 sm:text-base"
          >
            A timeline of my learning, internships, workshops, hackathons, certifications, and technical experiences that shaped my journey as a Full-Stack Web Developer and Cybersecurity Researcher.
          </motion.p>

          {/* Core Stats Capsule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3 }}
            className="mx-auto mt-12 max-w-4xl rounded-[2rem] border border-zinc-200 dark:border-white/[0.08] bg-white/80 dark:bg-zinc-950/40 p-6 backdrop-blur-xl shadow-sm dark:shadow-none"
          >
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:divide-x md:divide-zinc-200 dark:md:divide-white/[0.08]">
              {[
                { label: "Started Journey", value: "2024", color: "text-zinc-900 dark:text-white" },
                { label: "Current Year", value: "2026", color: "text-lime-500 dark:text-lime-300" },
                { label: "Learning Span", value: "3 Years", color: "text-zinc-900 dark:text-white" },
                { label: "Active Status", value: "LEARNING & BUILDING", color: "text-amber-600 dark:text-amber-500" },
              ].map(({ label, value, color }, i) => (
                <div key={label} className={`flex flex-col items-center justify-center ${i > 0 ? "md:pl-4" : ""}`}>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-600 mb-1">
                    {label}
                  </span>
                  <span className={`text-xl font-black tracking-tight ${color}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Category Counters Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.4 }}
            className="mx-auto mt-6 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-5 [&>*]:shadow-sm dark:[&>*]:shadow-none"
          >
            {[
              { label: "Total Milestones", value: statsSummary.totalExperiences },
              { label: "Internships", value: statsSummary.internships },
              { label: "Workshops & Events", value: statsSummary.workshops },
              { label: "Certifications", value: statsSummary.certifications },
              { label: "Hackathons & CTFs", value: statsSummary.conferences },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col justify-between rounded-2xl border border-zinc-200 dark:border-white/[0.06] bg-white/80 dark:bg-zinc-900/30 p-4 text-left transition-all duration-300 hover:border-zinc-300 dark:hover:border-white/[0.12] hover:bg-white dark:hover:bg-zinc-900/50 shadow-sm dark:shadow-none"
              >
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-500 leading-snug">
                  {label}
                </span>
                <span className="mt-4 text-3xl font-black text-zinc-900 dark:text-white leading-none">
                  {value}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      
      
      <section className="section-wrap border-b border-zinc-200 dark:border-white/[0.05] pb-6">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            {/* Search + Filters row */}
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search input */}
              <label className="relative flex-1">
                <Search
                  size={15}
                  className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-500"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, organization, skill, or year..."
                  className="w-full rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/80 py-2.5 pr-4 pl-10 text-sm text-zinc-800 dark:text-zinc-100 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all focus:border-lime-400/60 dark:focus:border-lime-300/40 focus:ring-1 focus:ring-lime-400/20 dark:focus:ring-lime-300/20 shadow-sm dark:shadow-none"
                />
              </label>

              {/* Filters toggle button */}
              <button
                type="button"
                onClick={() => setShowCategoryFilters(!showCategoryFilters)}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                  showCategoryFilters
                    ? "border-lime-500 dark:border-lime-300 bg-lime-500/10 dark:bg-lime-300/10 text-lime-600 dark:text-lime-300"
                    : "border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-white/[0.15] hover:text-zinc-900 dark:hover:text-white shadow-sm dark:shadow-none"
                }`}
              >
                <SlidersHorizontal size={13} />
                Filters
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-300 ${showCategoryFilters ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {/* View toggle */}
            <div className="inline-flex items-center gap-1 rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-1 shadow-sm dark:shadow-none">
              {[
                { id: "timeline", label: "Timeline", Icon: GitBranch },
                { id: "grid", label: "Grid", Icon: Grid2X2 },
              ].map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setView(id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300 ${
                    view === id
                      ? "bg-lime-300 text-black shadow-[0_0_12px_rgba(163,230,53,0.3)]"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Filter pills */}
          <AnimatePresence>
            {showCategoryFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 flex gap-2 overflow-x-auto pb-1"
                style={{ scrollbarWidth: "none", overflow: "hidden" }}
              >
                {filterGroups.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setActiveFilter(item)}
                    className={`shrink-0 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-all duration-300 ${
                      activeFilter === item
                        ? "border-lime-400 bg-lime-400 text-black font-black shadow-[0_0_12px_rgba(163,230,53,0.35)]"
                        : "border-slate-300 dark:border-white/[0.07] bg-white/90 dark:bg-zinc-900/60 text-slate-700 dark:text-zinc-400 hover:border-slate-400 dark:hover:border-white/[0.15] hover:text-slate-950 dark:hover:text-zinc-200 shadow-xs"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      
      {view === "timeline" && (
        <div className="sticky top-[4.5rem] z-40 xl:hidden border-b border-slate-200 dark:border-white/[0.05] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl">
          <div className="section-wrap py-3">
            <div
              className="flex items-center gap-3 overflow-x-auto"
              style={{ scrollbarWidth: "none" }}
            >
              <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500 dark:text-zinc-600">
                Jump to
              </span>
              {allYears.map((year) => {
                const isActive = activeYear === year;
                return (
                  <button
                    key={year}
                    onClick={(e) => handleYearClick(e, year)}
                    className={`shrink-0 rounded-xl border px-5 py-1.5 text-xs font-black transition-all duration-300 ${
                      isActive
                        ? "border-lime-400 bg-lime-400 text-black shadow-[0_0_12px_rgba(163,230,53,0.3)]"
                        : "border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-zinc-900/60 text-slate-700 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-zinc-200"
                    }`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      
      <section className="section-wrap py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <AnimatePresence mode="wait">
            
            {view === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredData.length === 0 ? (
                  <div className="col-span-full py-24 text-center text-sm font-semibold text-slate-500 dark:text-zinc-500">
                    No milestones match your current filter.
                  </div>
                ) : (
                  filteredData.map((event) => (
                    <GridCard
                      key={event.id}
                      event={event}
                      isExpanded={expandedId === event.id}
                      onToggle={() => toggleExpand(event.id)}
                    />
                  ))
                )}
              </motion.div>
            ) : (
              
              <motion.div
                key="timeline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-20"
              >
                {groupedByYear.length === 0 ? (
                  <div className="py-24 text-center text-sm font-semibold text-slate-500 dark:text-zinc-500">
                    No milestones match your current filter.
                  </div>
                ) : (
                  groupedByYear.map(({ year, items }) => (
                    <div key={year} id={`year-${year}`} className="scroll-mt-28">
                      
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-12 flex items-center gap-4"
                      >
                        <div
                          className={`flex h-16 w-16 flex-col items-center justify-center rounded-2xl border transition-all duration-500 ${
                            activeYear === year
                              ? "border-lime-400 bg-lime-400 text-black shadow-[0_0_32px_rgba(163,230,53,0.45)]"
                              : "border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm"
                          }`}
                        >
                          <span
                            className={`text-[9px] font-bold uppercase tracking-widest ${
                              activeYear === year
                                ? "text-black/60"
                                : "text-slate-500 dark:text-zinc-600"
                            }`}
                          >
                            Year
                          </span>
                          <span
                            className={`text-xl font-black ${
                              activeYear === year
                                ? "text-black"
                                : "text-slate-900 dark:text-zinc-200"
                            }`}
                          >
                            {year}
                          </span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-slate-300 via-slate-200 to-transparent dark:from-zinc-700 dark:via-zinc-800" />
                        <span className="rounded-full border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-400 shadow-xs">
                          {items.length} milestone
                          {items.length !== 1 ? "s" : ""}
                        </span>
                      </motion.div>

                      
                      <div className="relative">
                        
                        <div className="absolute inset-y-0 left-4 w-px bg-slate-300 dark:bg-zinc-800 lg:left-1/2 lg:-translate-x-px" />

                        
                        {activeYear === year && (
                          <motion.div
                            className="absolute inset-y-0 left-4 w-px bg-gradient-to-b from-lime-300/90 via-emerald-400/60 to-transparent lg:left-1/2 lg:-translate-x-px"
                            initial={{ scaleY: 0, originY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                          />
                        )}

                        <div className="space-y-12 pl-12 lg:space-y-20 lg:pl-0">
                          {items.map((event, idx) => {
                            const isLeft = idx % 2 === 0;
                            return (
                              <div key={event.id} id={event.id} className="relative scroll-mt-28">

                                <div className="absolute left-4 top-8 -translate-x-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:top-10">
                                  <TimelineDot
                                    isActive={activeYear === year}
                                  />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-center lg:gap-0">
                                  {isLeft ? (
                                    <>
                                      <div className="flex justify-end lg:pr-14">
                                        <JourneyCard
                                          event={event}
                                          side="left"
                                          isExpanded={expandedId === event.id}
                                          onToggle={() => toggleExpand(event.id)}
                                        />
                                      </div>
                                      <div className="hidden lg:flex lg:flex-col lg:items-start lg:pl-14">
                                        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
                                          {formatLabel(event.duration)}
                                        </span>
                                        <span
                                          className={`mt-1 bg-gradient-to-r ${event.accent} bg-clip-text text-xs font-bold text-transparent`}
                                        >
                                          {event.category}
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="hidden lg:flex lg:flex-col lg:items-end lg:pr-14 lg:text-right">
                                        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
                                          {formatLabel(event.duration)}
                                        </span>
                                        <span
                                          className={`mt-1 bg-gradient-to-r ${event.accent} bg-clip-text text-xs font-bold text-transparent`}
                                        >
                                          {event.category}
                                        </span>
                                      </div>
                                      <div className="flex justify-start lg:pl-14">
                                        <JourneyCard
                                          event={event}
                                          side="right"
                                          isExpanded={expandedId === event.id}
                                          onToggle={() => toggleExpand(event.id)}
                                        />
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
};

export default JourneyPage;
