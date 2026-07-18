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
} from "lucide-react";
import SeoHead from "@/components/seo/SeoHead";
import { createBreadcrumbSchema } from "@/utils/seo";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
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
      "Started BCA at BBD University with a strong focus on Artificial Intelligence, Machine Learning, Full-Stack Web Development, and practical software engineering.",
    imageUrl: "/journey/bbd-university.webp",
    hasCertificate: false,
    certificateUrl: "",
    detailsUrl: "/education",
    icon: BookOpen,
    accent: "from-cyan-400 to-blue-600",
    tag: "Education",
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
    hasCertificate: false,
    certificateUrl: "",
    detailsUrl: "/journey/tryhackme",
    icon: Shield,
    accent: "from-emerald-400 to-teal-600",
    tag: "Security",
  },
  {
    id: "forage-cyber-security-specialist-2025",
    year: 2025,
    category: "Internships",
    mode: "Online",
    title: "Cyber Security Specialist",
    subtitle: "Internship",
    organization: "Forage",
    duration: "2025-09",
    location: "Remote",
    description:
      "Completed enterprise cyber defense simulation — threat intelligence, incident response, and security operations centre workflows.",
    imageUrl: "/images/journey/forage-logo.jpg",
    hasCertificate: true,
    certificateUrl: "/certificates/forage-cyber-security.pdf",
    detailsUrl: "https://www.theforage.com/",
    icon: Briefcase,
    accent: "from-violet-400 to-purple-600",
    tag: "Internship",
  },
  {
    id: "cisco-ethical-hacker-2025",
    year: 2025,
    category: "Certifications",
    mode: "Online",
    title: "Cisco Certified Ethical Hacker",
    subtitle: "Certification",
    organization: "Cisco",
    duration: "2025",
    location: "Remote",
    description:
      "Earned Cisco Ethical Hacker certification covering network vulnerabilities, exploitation techniques, and responsible disclosure.",
    imageUrl: "/journey/cisco.webp",
    hasCertificate: true,
    certificateUrl: "/certificates/cisco-ethical-hacker.pdf",
    detailsUrl: "https://www.cisco.com/",
    icon: Award,
    accent: "from-amber-400 to-orange-600",
    tag: "Certification",
  },
  {
    id: "deloitte-cybersecurity-job-simulation-2025",
    year: 2025,
    category: "Certifications",
    mode: "Online",
    title: "Deloitte Cybersecurity Simulation",
    subtitle: "Job Simulation",
    organization: "Deloitte",
    duration: "2025",
    location: "Remote",
    description:
      "Completed Deloitte Cybersecurity Job Simulation — analysed real-world threat scenarios, wrote incident response reports, and applied Big 4 security methodologies.",
    imageUrl: "/journey/deloitte.webp",
    hasCertificate: true,
    certificateUrl: "/certificates/deloitte-cyber.pdf",
    detailsUrl: "https://www.theforage.com/",
    icon: Cpu,
    accent: "from-sky-400 to-indigo-600",
    tag: "Simulation",
  },
  {
    id: "tata-cybersecurity-analyst-2025",
    year: 2025,
    category: "Certifications",
    mode: "Online",
    title: "Tata Cybersecurity Analyst",
    subtitle: "Job Simulation",
    organization: "Tata Consultancy Services",
    duration: "2025",
    location: "Remote",
    description:
      "Completed Tata Cybersecurity Analyst Job Simulation focused on risk assessment, identity management, and security architecture.",
    imageUrl: "/journey/tata.webp",
    hasCertificate: true,
    certificateUrl: "/certificates/tata-cyber.pdf",
    detailsUrl: "https://www.theforage.com/",
    icon: Award,
    accent: "from-rose-400 to-pink-600",
    tag: "Certification",
  },
  {
    id: "launch-pad-startup-screening-2025",
    year: 2025,
    category: "Startup Events",
    mode: "Offline",
    title: "Launch Pad Startup Screening",
    subtitle: "Startup Program",
    organization: "BBD University",
    duration: "2025",
    location: "Lucknow, Uttar Pradesh",
    description:
      "Selected for the Launch Pad Startup Screening Program — pitched an innovative tech product idea to industry mentors and venture scouts.",
    imageUrl: "/journey/startup.webp",
    hasCertificate: true,
    certificateUrl: "/certificates/startup-screening.pdf",
    detailsUrl: "#",
    icon: Rocket,
    accent: "from-lime-400 to-green-600",
    tag: "Startup",
  },
  {
    id: "techx26-hackathon-2026",
    year: 2026,
    category: "Hackathons",
    mode: "Offline",
    title: "TechX26 Hackathon",
    subtitle: "Hackathon",
    organization: "BBD University",
    duration: "2026",
    location: "Lucknow, Uttar Pradesh",
    description:
      "Competed in TechX26 Hackathon — built a security-focused web application prototype under 24 hours.",
    imageUrl: "/journey/techx26.webp",
    hasCertificate: true,
    certificateUrl: "/certificates/techx26.pdf",
    detailsUrl: "#",
    icon: Code2,
    accent: "from-cyan-400 to-blue-600",
    tag: "Hackathon",
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
    hasCertificate: false,
    certificateUrl: "",
    detailsUrl: "https://hackerone.com/",
    icon: Shield,
    accent: "from-orange-400 to-red-600",
    tag: "Research",
  },
  {
    id: "assocham-samarth-2026",
    year: 2026,
    category: "Internships",
    mode: "Offline",
    title: "ASSOCHAM SAMARTH 2.0 Internship",
    subtitle: "Industry Internship",
    organization: "ASSOCHAM UP-UK",
    duration: "2026-06",
    location: "Lucknow, Uttar Pradesh",
    description:
      "Selected for AICTE-supported SAMARTH 2.0 Industry Exposure Internship — gained real-world industry experience under ASSOCHAM guidance.",
    imageUrl: "/images/journey/samarth-internship-cert.jpeg",
    hasCertificate: false,
    certificateUrl: "",
    detailsUrl: "https://www.assocham.org/",
    icon: Briefcase,
    accent: "from-teal-400 to-cyan-600",
    tag: "Internship",
  },
  {
    id: "top-1-percent-tryhackme-2026",
    year: 2026,
    category: "Achievements",
    mode: "Online",
    title: "Top 1% on TryHackMe",
    subtitle: "Achievement",
    organization: "TryHackMe",
    duration: "2026",
    location: "Remote",
    description:
      "Achieved Top 1% global ranking on TryHackMe with a 310+ day learning streak, completing rooms in pentesting, web security, and digital forensics.",
    imageUrl: "/images/journey/top1-thm.png",
    hasCertificate: false,
    certificateUrl: "",
    detailsUrl: "https://tryhackme.com/",
    icon: Star,
    accent: "from-yellow-400 to-amber-600",
    tag: "Achievement",
  },
];

const filterGroups = [
  "All",
  "Academic Programs",
  "Internships",
  "Certifications",
  "Hackathons",
  "Startup Events",
  "Open Source",
  "Experience",
  "Achievements",
];

const formatLabel = (value = "") =>
  value
    .split("-")
    .filter(Boolean)
    .map((part) =>
      isNaN(part) ? part.charAt(0).toUpperCase() + part.slice(1) : part
    )
    .join(" ");

/* ─────────────────────────────────────────────
   FIXED LEFT YEAR NAVIGATOR
   Always visible on the left side of the
   viewport, vertically centered. Scrolls page
   on click, highlights active year on scroll.
───────────────────────────────────────────── */
const FixedYearNav = ({ years, activeYear, onYearClick }) => (
  <div className="fixed left-6 top-1/2 z-50 hidden -translate-y-1/2 xl:flex xl:flex-col xl:items-center">
    {/* Capsule container */}
    <div className="flex flex-col items-center gap-1 rounded-[2rem] border border-white/10 bg-zinc-950/95 px-3 py-4 shadow-[0_8px_48px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      {/* Label */}
      <p className="mb-3 text-[8px] font-bold uppercase tracking-[0.4em] text-zinc-600">
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
              {/* Glow pip on active */}
              {isActive && (
                <motion.span
                  layoutId="navPip"
                  className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-lime-300 shadow-[0_0_10px_rgba(163,230,53,1)]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom divider + active year label */}
      <div className="mt-3 h-px w-8 bg-zinc-800" />
      <AnimatePresence mode="wait">
        <motion.p
          key={activeYear}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="mt-2 text-[8px] font-bold uppercase tracking-[0.3em] text-zinc-600"
        >
          {activeYear}
        </motion.p>
      </AnimatePresence>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   JOURNEY CARD
───────────────────────────────────────────── */
const JourneyCard = ({ event, side = "left" }) => {
  const Icon = event.icon || Award;
  return (
    <motion.article
      initial={{ opacity: 0, x: side === "left" ? -50 : 50, y: 16 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px -5% 0px" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="group relative w-full max-w-lg overflow-hidden rounded-[1.6rem] border border-white/[0.07] bg-zinc-900/70 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-all duration-500 hover:border-white/[0.15] hover:shadow-[0_20px_60px_rgba(0,0,0,0.7)] hover:-translate-y-1"
    >
      {/* Top accent line */}
      <div
        className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${event.accent} opacity-80`}
      />
      {/* Ambient glow */}
      <div
        className={`pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br ${event.accent} opacity-[0.05] blur-3xl`}
      />

      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-zinc-800">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />
        {/* Tag */}
        <div className="absolute left-4 top-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${event.accent} px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-black shadow-lg`}
          >
            <Icon size={10} />
            {event.tag}
          </span>
        </div>
        {/* Mode */}
        <div className="absolute right-4 top-4">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
            {event.mode}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
          {event.subtitle}
        </p>
        <h3 className="text-[1.1rem] font-black leading-snug text-white sm:text-[1.2rem]">
          {event.title}
        </h3>
        <p
          className={`mt-1 bg-gradient-to-r ${event.accent} bg-clip-text text-xs font-semibold uppercase tracking-wider text-transparent`}
        >
          {event.organization}
        </p>

        <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={11} className="text-zinc-600" />
            {formatLabel(event.duration)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={11} className="text-zinc-600" />
            {event.location}
          </span>
        </div>

        <p className="mt-3 text-[0.82rem] leading-6 text-zinc-400">
          {event.description}
        </p>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <a
            href={event.detailsUrl || "#"}
            target={
              event.detailsUrl?.startsWith("http") ? "_blank" : undefined
            }
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${event.accent} px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-black transition-all hover:opacity-90 hover:shadow-lg`}
          >
            <ExternalLink size={11} />
            Details
          </a>
          {event.hasCertificate ? (
            <a
              href={event.certificateUrl || "#"}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-emerald-300 transition-all hover:border-emerald-400/60 hover:bg-emerald-400/20"
            >
              <FileBadge size={11} />
              Certificate
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-xl border border-zinc-700/60 bg-zinc-800/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              <Trophy size={11} />
              Pending
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
};

/* ─────────────────────────────────────────────
   GRID CARD (compact)
───────────────────────────────────────────── */
const GridCard = ({ event }) => {
  const Icon = event.icon || Award;
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px -5% 0px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-[1.4rem] border border-white/[0.07] bg-zinc-900/60 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all duration-500 hover:border-white/[0.14] hover:-translate-y-1"
    >
      <div
        className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${event.accent}`}
      />
      <div className="relative h-36 overflow-hidden bg-zinc-800">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/70 to-transparent" />
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${event.accent} px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black`}
        >
          <Icon size={9} />
          {event.tag}
        </span>
      </div>
      <div className="p-4">
        <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {event.year}
        </p>
        <h3 className="text-sm font-bold leading-snug text-white">
          {event.title}
        </h3>
        <p
          className={`mt-0.5 bg-gradient-to-r ${event.accent} bg-clip-text text-[10px] font-semibold uppercase tracking-wider text-transparent`}
        >
          {event.organization}
        </p>
        <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-zinc-400">
          {event.description}
        </p>
        <div className="mt-3 flex gap-2">
          <a
            href={event.detailsUrl || "#"}
            className={`inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r ${event.accent} px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-black`}
          >
            <ExternalLink size={9} /> View
          </a>
          {event.hasCertificate && (
            <a
              href={event.certificateUrl || "#"}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300"
            >
              <FileBadge size={9} /> Cert
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

/* ─────────────────────────────────────────────
   TIMELINE DOT
───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const JourneyPage = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [view, setView] = useState("timeline");
  const [activeYear, setActiveYear] = useState(null);
  const isScrollingLocked = useRef(false);

  /* ── Derived data ── */
  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return journeyData.filter((event) => {
      const matchesCategory =
        activeFilter === "All" || event.category === activeFilter;
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

  /* ── Smooth scroll to year ── */
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

  /* ── IntersectionObserver scrollspy ── */
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

  /* ── Init active year ── */
  useEffect(() => {
    if (allYears.length > 0 && activeYear === null) {
      setActiveYear(allYears[0]);
    }
  }, [allYears, activeYear]);

  /* ── Page-top reset ── */
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY < 150 && allYears.length > 0) {
        setActiveYear(allYears[0]);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [allYears]);

  /* ─────────────── RENDER ─────────────── */
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

      {/* ══════════════════════════════════════
          FIXED LEFT YEAR NAVIGATION ISLAND
          Always centered on left of screen
      ══════════════════════════════════════ */}
      {view === "timeline" && (
        <FixedYearNav
          years={allYears}
          activeYear={activeYear}
          onYearClick={handleYearClick}
        />
      )}

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/5 blur-[120px]" />
          <div className="absolute right-1/3 top-2/3 h-72 w-72 translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/[0.06] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-lime-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-300" />
              Professional Journey
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="mt-4 font-display text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            From{" "}
            <span className="bg-gradient-to-r from-lime-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Student
            </span>{" "}
            to{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
              Builder
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg"
          >
            A living record of education, certifications, internships,
            hackathons, and real-world security research — built one milestone
            at a time.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.32 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-8"
          >
            {[
              { label: "Since", value: "2024" },
              { label: "Milestones", value: `${journeyData.length}+` },
              { label: "Certifications", value: "4" },
              { label: "THM Rank", value: "Top 1%" },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <span className="text-2xl font-black text-white sm:text-3xl">
                  {value}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CONTROLS BAR
      ══════════════════════════════════════ */}
      <section className="section-wrap border-b border-white/[0.05] pb-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            {/* Search */}
            <label className="relative flex-1 sm:max-w-sm">
              <Search
                size={15}
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-500"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search milestones…"
                className="w-full rounded-2xl border border-white/[0.08] bg-zinc-900/80 py-2.5 pr-4 pl-10 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 transition-all focus:border-lime-300/40 focus:ring-1 focus:ring-lime-300/20"
              />
            </label>

            {/* View toggle */}
            <div className="inline-flex items-center gap-1 rounded-2xl border border-white/[0.08] bg-zinc-900/60 p-1">
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
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Filter pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-4 flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {filterGroups.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setActiveFilter(item)}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${
                  activeFilter === item
                    ? "border-lime-300 bg-lime-300 text-black shadow-[0_0_10px_rgba(163,230,53,0.2)]"
                    : "border-white/[0.07] bg-zinc-900/60 text-zinc-400 hover:border-white/[0.15] hover:text-zinc-200"
                }`}
              >
                {item}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MOBILE YEAR BAR (shows below xl)
      ══════════════════════════════════════ */}
      {view === "timeline" && (
        <div className="sticky top-[4.5rem] z-40 xl:hidden border-b border-white/[0.05] bg-zinc-950/95 backdrop-blur-xl">
          <div className="section-wrap py-3">
            <div
              className="flex items-center gap-3 overflow-x-auto"
              style={{ scrollbarWidth: "none" }}
            >
              <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-600">
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
                        ? "border-lime-300 bg-lime-300 text-black shadow-[0_0_12px_rgba(163,230,53,0.3)]"
                        : "border-white/[0.08] bg-zinc-900/60 text-zinc-400 hover:text-zinc-200"
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

      {/* ══════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════ */}
      <section className="section-wrap py-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <AnimatePresence mode="wait">
            {/* ── GRID VIEW ── */}
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
                  <div className="col-span-full py-24 text-center text-sm text-zinc-500">
                    No milestones match your current filter.
                  </div>
                ) : (
                  filteredData.map((event) => (
                    <GridCard key={event.id} event={event} />
                  ))
                )}
              </motion.div>
            ) : (
              /* ── TIMELINE VIEW ── */
              <motion.div
                key="timeline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {groupedByYear.length === 0 ? (
                  <div className="py-24 text-center text-sm text-zinc-500">
                    No milestones match your current filter.
                  </div>
                ) : (
                  groupedByYear.map((group) => (
                    <div
                      key={group.year}
                      id={`year-${group.year}`}
                      className="mb-24 scroll-mt-36 last:mb-0"
                    >
                      {/* Year section header */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-12 flex items-center gap-4"
                      >
                        <div
                          className={`flex h-16 w-16 flex-col items-center justify-center rounded-2xl border transition-all duration-500 ${
                            activeYear === group.year
                              ? "border-lime-300 bg-lime-300 shadow-[0_0_32px_rgba(163,230,53,0.45)]"
                              : "border-zinc-700 bg-zinc-900"
                          }`}
                        >
                          <span
                            className={`text-[9px] font-bold uppercase tracking-widest ${
                              activeYear === group.year
                                ? "text-black/50"
                                : "text-zinc-600"
                            }`}
                          >
                            Year
                          </span>
                          <span
                            className={`text-xl font-black ${
                              activeYear === group.year
                                ? "text-black"
                                : "text-zinc-200"
                            }`}
                          >
                            {group.year}
                          </span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-zinc-700 via-zinc-800 to-transparent" />
                        <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                          {group.items.length} milestone
                          {group.items.length !== 1 ? "s" : ""}
                        </span>
                      </motion.div>

                      {/* Timeline items */}
                      <div className="relative">
                        {/* ── CENTER SPINE (always visible) ── */}
                        <div className="absolute inset-y-0 left-4 w-px bg-zinc-800 lg:left-1/2 lg:-translate-x-px" />

                        {/* Active glow spine for current year */}
                        {activeYear === group.year && (
                          <motion.div
                            className="absolute inset-y-0 left-4 w-px bg-gradient-to-b from-lime-300/90 via-emerald-400/60 to-transparent lg:left-1/2 lg:-translate-x-px"
                            initial={{ scaleY: 0, originY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                          />
                        )}

                        <div className="space-y-12 pl-12 lg:space-y-20 lg:pl-0">
                          {group.items.map((event, idx) => {
                            const isLeft = idx % 2 === 0;
                            return (
                              <div key={event.id} className="relative">
                                {/* ── DOT ── */}
                                <div className="absolute left-4 top-8 -translate-x-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:top-10">
                                  <TimelineDot
                                    isActive={activeYear === group.year}
                                  />
                                </div>

                                {/* ── CARD ROW ── */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-center lg:gap-0">
                                  {isLeft ? (
                                    <>
                                      {/* Card on left half */}
                                      <div className="flex justify-end lg:pr-14">
                                        <JourneyCard
                                          event={event}
                                          side="left"
                                        />
                                      </div>
                                      {/* Meta on right half */}
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
                                      {/* Meta on left half */}
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
                                      {/* Card on right half */}
                                      <div className="flex justify-start lg:pl-14">
                                        <JourneyCard
                                          event={event}
                                          side="right"
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
