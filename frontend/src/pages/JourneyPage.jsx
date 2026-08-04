import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
import { journeyData, JOURNEY_CATEGORIES as filterGroups } from "@/data/journeyData";

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

  // Prevent body scroll when gallery modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="fixed top-6 right-6 z-[100000] flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white transition-all duration-200 hover:border-lime-300 hover:bg-black/90 hover:scale-110 shadow-xl"
        >
          <X size={20} />
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative flex h-[82vh] max-h-[680px] w-[92vw] max-w-[800px] items-center justify-center overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/95 shadow-[0_25px_70px_rgba(0,0,0,0.9)] p-2 sm:p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={images[current]}
              alt={`Gallery image ${current + 1}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="max-h-full max-w-full rounded-2xl object-contain object-center select-none shadow-md"
            />
          </AnimatePresence>

          {images.length > 1 && (
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:border-lime-300 hover:bg-black/90 hover:scale-110 active:scale-95 z-10"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {images.length > 1 && (
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:border-lime-300 hover:bg-black/90 hover:scale-110 active:scale-95 z-10"
            >
              <ChevronRight size={20} />
            </button>
          )}

          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/75 px-3.5 py-1 text-[11px] sm:text-xs font-mono font-bold tracking-wider text-white shadow-md backdrop-blur-md z-10">
            {current + 1} / {images.length}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
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
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [view, setView] = useState("timeline");
  const [activeYear, setActiveYear] = useState(2024);
  const [expandedId, setExpandedId] = useState(null);

  // Scroll to and expand card matching URL hash or search parameter (?selected=id or #id)
  useEffect(() => {
    const hashId = location.hash ? location.hash.replace("#", "") : null;
    const searchParams = new URLSearchParams(location.search);
    const selectedParam = searchParams.get("selected") || searchParams.get("id");
    const targetId = hashId || selectedParam;

    if (!targetId) return;

    // Reset search and filter to ensure target card is rendered
    setActiveFilter("All");
    setSearch("");
    setExpandedId(targetId);

    const timer = setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-lime-400", "rounded-2xl", "transition-all", "duration-500");
        setTimeout(() => {
          el.classList.remove("ring-2", "ring-lime-400");
        }, 3500);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [location.hash, location.search]);

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
                    <div key={event.id} id={event.id} className="scroll-mt-28">
                      <GridCard
                        event={event}
                        isExpanded={expandedId === event.id}
                        onToggle={() => toggleExpand(event.id)}
                      />
                    </div>
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
