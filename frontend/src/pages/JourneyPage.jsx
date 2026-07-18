import { useMemo, useState } from "react";
import {
  CalendarDays,
  FileBadge,
  Filter,
  GitBranch,
  Grid2X2,
  MapPin,
  Search,
  Trophy,
} from "lucide-react";
import FadeInUp from "@/components/animations/FadeInUp";
import SectionTitle from "@/components/ui/SectionTitle";
import SeoHead from "@/components/seo/SeoHead";
import { createBreadcrumbSchema } from "@/utils/seo";

const journeyData = [
  {
    id: "bca-bbd-2024",
    year: 2024,
    category: "Academic Programs",
    mode: "Offline",
    title: "Started BCA at BBD University",
    organization: "Babu Banarasi Das University",
    duration: "2024-03",
    location: "Lucknow, Uttar Pradesh",
    description:
      "Started Bachelor of Computer Applications (BCA) at Babu Banarasi Das University, focusing on Computer Programming and Software Development.",
    imageUrl: "/journey/bbd-university.webp",
    hasCertificate: false,
    certificateUrl: "",
    detailsUrl: "/education",
  },
  {
    id: "started-cybersecurity-journey-2025",
    year: 2025,
    category: "Open Source",
    mode: "Online",
    title: "Started Cybersecurity Journey",
    organization: "TryHackMe and Self-Learning",
    duration: "2025-08",
    location: "Remote",
    description:
      "Began hands-on cybersecurity learning through TryHackMe, Linux, networking, and CTF challenges.",
    imageUrl: "/images/journey/tryhackme.png",
    hasCertificate: false,
    certificateUrl: "",
    detailsUrl: "/journey/tryhackme",
  },
  {
    id: "forage-cyber-security-specialist-2025",
    year: 2025,
    category: "Internships",
    mode: "Online",
    title: "Forage Cyber Security Specialist",
    organization: "Forage",
    duration: "2025-09",
    location: "Remote",
    description: "Completed enterprise cyber defense simulation with Forage.",
    imageUrl: "/images/journey/forage-logo.jpg",
    hasCertificate: true,
    certificateUrl: "/certificates/forage-cyber-security.pdf",
    detailsUrl: "https://www.theforage.com/",
  },
  {
    id: "cisco-ethical-hacker-2025",
    year: 2025,
    category: "Certifications",
    mode: "Online",
    title: "Cisco Certified Ethical Hacker",
    organization: "Cisco",
    duration: "2025",
    location: "Remote",
    description: "Completed Cisco Ethical Hacker certification.",
    imageUrl: "/journey/cisco.webp",
    hasCertificate: true,
    certificateUrl: "/certificates/cisco-ethical-hacker.pdf",
    detailsUrl: "https://www.cisco.com/",
  },
  {
    id: "deloitte-cybersecurity-job-simulation-2025",
    year: 2025,
    category: "Certifications",
    mode: "Online",
    title: "Deloitte Cybersecurity Job Simulation",
    organization: "Deloitte",
    duration: "2025",
    location: "Remote",
    description: "Completed Deloitte Cybersecurity Job Simulation on Forage.",
    imageUrl: "/journey/deloitte.webp",
    hasCertificate: true,
    certificateUrl: "/certificates/deloitte-cyber.pdf",
    detailsUrl: "https://www.theforage.com/",
  },
  {
    id: "tata-cybersecurity-analyst-2025",
    year: 2025,
    category: "Certifications",
    mode: "Online",
    title: "Tata Cybersecurity Analyst Simulation",
    organization: "Tata",
    duration: "2025",
    location: "Remote",
    description: "Completed Tata Cybersecurity Analyst Job Simulation.",
    imageUrl: "/journey/tata.webp",
    hasCertificate: true,
    certificateUrl: "/certificates/tata-cyber.pdf",
    detailsUrl: "https://www.theforage.com/",
  },
  {
    id: "launch-pad-startup-screening-2025",
    year: 2025,
    category: "Startup Events",
    mode: "Offline",
    title: "Launch Pad Startup Screening",
    organization: "BBD University",
    duration: "2025",
    location: "Lucknow, Uttar Pradesh",
    description: "Completed Launch Pad Startup Screening Program.",
    imageUrl: "/journey/startup.webp",
    hasCertificate: true,
    certificateUrl: "/certificates/startup-screening.pdf",
    detailsUrl: "#",
  },
  {
    id: "techx26-hackathon-2026",
    year: 2026,
    category: "Hackathons",
    mode: "Offline",
    title: "TechX26 Hackathon",
    organization: "BBD University",
    duration: "2026",
    location: "Lucknow, Uttar Pradesh",
    description: "Participated in TechX26 Hackathon.",
    imageUrl: "/journey/techx26.webp",
    hasCertificate: true,
    certificateUrl: "/certificates/techx26.pdf",
    detailsUrl: "#",
  },
  {
    id: "hackerone-security-researcher-2026",
    year: 2026,
    category: "Experience",
    mode: "Online",
    title: "HackerOne Security Researcher",
    organization: "HackerOne",
    duration: "2026-05",
    location: "Remote",
    description:
      "Started working as an independent Security Researcher performing web application and API security testing through HackerOne.",
    imageUrl: "/images/journey/hackerone.jpg",
    hasCertificate: false,
    certificateUrl: "",
    detailsUrl: "https://hackerone.com/",
  },
  {
    id: "assocham-samarth-2026",
    year: 2026,
    category: "Internships",
    mode: "Offline",
    title: "ASSOCHAM SAMARTH 2.0 Internship",
    organization: "ASSOCHAM UP-UK",
    duration: "2026-06",
    location: "Lucknow, Uttar Pradesh",
    description:
      "Selected for the AICTE-supported SAMARTH 2.0 Industry Exposure Internship with ASSOCHAM UP-UK.",
    imageUrl: "/images/journey/samarth-internship-cert.jpeg",
    hasCertificate: false,
    certificateUrl: "",
    detailsUrl: "https://www.assocham.org/",
  },
  {
    id: "top-1-percent-tryhackme-2026",
    year: 2026,
    category: "Achievements",
    mode: "Online",
    title: "Top 1% TryHackMe",
    organization: "TryHackMe",
    duration: "2026",
    location: "Remote",
    description:
      "Achieved Top 1% ranking on TryHackMe with 310+ day learning streak.",
    imageUrl: "/images/journey/top1-thm.png",
    hasCertificate: false,
    certificateUrl: "",
    detailsUrl: "https://tryhackme.com/",
  },
];

const stats = [
  { label: "Started Journey", value: "2024" },
  { label: "Current Year", value: "2026" },
  { label: "Learning Span", value: "3 Years" },
  { label: "Active Status", value: "Learning & Building" },
  { label: "Total Experiences", value: "14" },
  { label: "Internships", value: "2" },
  { label: "Workshops & Events", value: "6" },
  { label: "Certifications", value: "4" },
  { label: "Conferences", value: "1" },
];

const filterGroups = [
  "All",
  "Academic Programs",
  "Internships",
  "Workshops",
  "Hackathons",
  "Certifications",
  "Startup Events",
  "Open Source",
  "Experience",
  "Achievements",
];

const categoryMatches = {
  All: () => true,
  "Academic Programs": (event) => event.category === "Academic Programs",
  Internships: (event) => event.category === "Internships",
  Workshops: (event) => event.category === "Workshops",
  Hackathons: (event) => event.category === "Hackathons",
  Certifications: (event) => event.category === "Certifications",
  "Startup Events": (event) => event.category === "Startup Events",
  "Open Source": (event) => event.category === "Open Source",
  Experience: (event) => event.category === "Experience",
  Achievements: (event) => event.category === "Achievements",
};

const formatLabel = (value = "") =>
  value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const JourneyCard = ({ event }) => (
  <article className="group relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-zinc-950/90 shadow-[0_20px_70px_rgba(0,0,0,0.45)] transition hover:border-lime-300/35">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(163,230,53,0.08),transparent_32%)]" />
    <div className="relative p-4 sm:p-5">
      <div className="overflow-hidden rounded-[1.1rem] border border-white/10 bg-zinc-900">
        <img
          src={event.imageUrl}
          alt={`${event.title} thumbnail`}
          className="h-56 w-full object-cover sm:h-60"
          loading="lazy"
          onError={(eventTarget) => {
            eventTarget.currentTarget.src = "/journey/placeholder.svg";
          }}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
        <span className="rounded-full border border-lime-300/30 bg-lime-300/10 px-2.5 py-1 text-lime-200">
          {event.category}
        </span>
        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-cyan-100">
          {event.mode}
        </span>
      </div>

      <h3 className="mt-3 text-[1.3rem] font-black uppercase leading-tight tracking-[0.02em] text-white sm:text-[1.55rem]">
        {event.title}
      </h3>
      <p className="mt-1 text-sm font-medium uppercase tracking-[0.16em] text-lime-200/90">
        {event.organization}
      </p>

      <div className="mt-4 space-y-2 text-xs text-zinc-300 sm:text-sm">
        <div className="flex items-center gap-2">
          <CalendarDays size={14} className="text-lime-300" />
          <span>{formatLabel(event.duration)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-lime-300" />
          <span>{event.location}</span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-zinc-300 sm:text-[0.95rem]">
        {event.description}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em]">
        <a
          href={event.detailsUrl || "#"}
          className="inline-flex items-center gap-2 rounded-full border border-lime-300/40 bg-lime-300/10 px-4 py-2 text-lime-200 transition hover:border-lime-300 hover:bg-lime-300/20"
        >
          <GitBranch size={14} />
          View Details
        </a>
        {event.hasCertificate ? (
          <a
            href={event.certificateUrl || "#"}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-300/10 px-4 py-2 text-emerald-100 transition hover:border-emerald-200"
          >
            <FileBadge size={14} />
            Certificate Available
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-zinc-300">
            <Trophy size={14} />
            Certificate Pending
          </span>
        )}
      </div>
    </div>
  </article>
);

const JourneyPage = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [view, setView] = useState("timeline");

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const matcher = categoryMatches[activeFilter] || categoryMatches.All;

    return journeyData.filter((event) => {
      const matchesCategory = matcher(event);

      if (!keyword) {
        return matchesCategory;
      }

      const searchable =
        `${event.title} ${event.organization} ${event.description} ${event.location} ${event.year} ${event.category}`.toLowerCase();
      return matchesCategory && searchable.includes(keyword);
    });
  }, [activeFilter, search]);

  const years = useMemo(() => {
    return Array.from(new Set(filteredData.map((event) => event.year))).sort(
      (left, right) => left - right,
    );
  }, [filteredData]);

  const groupedByYear = useMemo(() => {
    const grouped = new Map();
    filteredData.forEach((event) => {
      const yearItems = grouped.get(event.year) || [];
      yearItems.push(event);
      grouped.set(event.year, yearItems);
    });

    return years.map((year) => ({
      year,
      items: grouped.get(year) || [],
    }));
  }, [filteredData, years]);

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
          { name: "Home", path: "/" },
          { name: "Professional Journey", path: "/journey" },
        ])}
      />

      <section className="section-wrap pt-12 sm:pt-20">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Journey"
            title="Professional Journey"
            description="A chronological view of growth, certifications, internships, and hands-on learning."
          />

          <FadeInUp className="mt-8 rounded-[1.75rem] border border-white/10 bg-zinc-950/70 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {stats.map((item) => (
                <article
                  key={item.label}
                  className="rounded-2xl border border-white/8 bg-zinc-900/65 p-4"
                >
                  <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-xl font-black text-zinc-100 sm:text-2xl">
                    {item.value}
                  </p>
                </article>
              ))}
            </div>
          </FadeInUp>

          <FadeInUp
            delay={0.06}
            className="mt-7 rounded-[1.55rem] border border-white/10 bg-zinc-950/70 p-4 sm:p-5"
          >
            <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
              <label className="relative block">
                <span className="sr-only">
                  Search by title, organization, skill, or year
                </span>
                <Search
                  size={16}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-500"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by title, organization, skill, or year..."
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 py-3 pr-4 pl-9 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-lime-300/60"
                />
              </label>

              <div className="inline-flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-zinc-900/80 p-1">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300"
                >
                  <Filter size={14} />
                  Filters
                </button>
                <div className="inline-flex rounded-xl border border-lime-300/25 bg-black/20 p-1">
                  <button
                    type="button"
                    onClick={() => setView("timeline")}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition ${
                      view === "timeline"
                        ? "bg-lime-300 text-black"
                        : "text-zinc-300 hover:text-white"
                    }`}
                  >
                    <GitBranch size={14} />
                    Timeline
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition ${
                      view === "grid"
                        ? "bg-lime-300 text-black"
                        : "text-zinc-300 hover:text-white"
                    }`}
                  >
                    <Grid2X2 size={14} />
                    Grid
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {filterGroups.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveFilter(item)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                    activeFilter === item
                      ? "border-lime-300 bg-lime-300 text-black"
                      : "border-white/10 bg-zinc-900/75 text-zinc-300 hover:border-lime-300/40 hover:text-lime-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </FadeInUp>

          <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_84px] xl:items-start">
            <div>
              {groupedByYear.map((group, index) => (
                <FadeInUp
                  key={group.year}
                  delay={index * 0.05}
                  className="mb-10"
                >
                  <div id={`year-${group.year}`} className="relative">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="rounded-2xl border border-lime-300/25 bg-zinc-950/85 px-4 py-2 text-center">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                          Year
                        </p>
                        <p className="text-2xl font-black text-lime-300">
                          {group.year}
                        </p>
                      </div>
                      <div className="hidden h-px flex-1 bg-gradient-to-r from-lime-300/50 via-lime-300/15 to-transparent sm:block" />
                    </div>

                    <div
                      className={`relative ${view === "timeline" ? "pl-8 sm:pl-12" : ""}`}
                    >
                      {view === "timeline" ? (
                        <span className="absolute top-0 bottom-0 left-3 w-px bg-gradient-to-b from-lime-300/70 via-lime-300/25 to-transparent sm:left-5" />
                      ) : null}

                      {view === "grid" ? (
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                          {group.items.map((event) => (
                            <JourneyCard key={event.id} event={event} />
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-5">
                          {group.items.map((event, eventIndex) => (
                            <div key={event.id} className="relative">
                              <span className="absolute top-8 -left-[2.35rem] h-3.5 w-3.5 rounded-full border border-lime-300/75 bg-zinc-950 shadow-[0_0_0_5px_rgba(163,230,53,0.12)] sm:-left-[2.55rem]" />
                              <div
                                className={`grid gap-5 ${eventIndex % 2 === 0 ? "lg:grid-cols-[1fr_0.95fr]" : "lg:grid-cols-[0.95fr_1fr]"}`}
                              >
                                {eventIndex % 2 === 0 ? (
                                  <>
                                    <div className="flex items-center justify-start pl-1 text-xs uppercase tracking-[0.22em] text-zinc-500">
                                      <CalendarDays
                                        size={14}
                                        className="mr-2 text-lime-300"
                                      />
                                      {formatLabel(event.duration)}
                                    </div>
                                    <JourneyCard event={event} />
                                  </>
                                ) : (
                                  <>
                                    <JourneyCard event={event} />
                                    <div className="flex items-center justify-end pr-1 text-xs uppercase tracking-[0.22em] text-zinc-500">
                                      <CalendarDays
                                        size={14}
                                        className="mr-2 text-lime-300"
                                      />
                                      {formatLabel(event.duration)}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </FadeInUp>
              ))}
            </div>

            <aside className="hidden xl:block">
              <div className="sticky top-28 rounded-[1.4rem] border border-white/10 bg-zinc-950/80 p-3">
                <p className="px-2 pb-3 text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                  Years
                </p>
                <div className="space-y-2">
                  {years.map((year) => (
                    <a
                      key={year}
                      href={`#year-${year}`}
                      className="flex h-16 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/70 text-sm font-bold text-zinc-300 transition hover:border-lime-300/35 hover:text-lime-200"
                    >
                      {year}
                    </a>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {groupedByYear.length === 0 ? (
            <div className="mt-8 rounded-[1.4rem] border border-white/10 bg-zinc-950/80 p-8 text-center text-sm text-zinc-300">
              No journey events match your current search or filter.
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
};

export default JourneyPage;
