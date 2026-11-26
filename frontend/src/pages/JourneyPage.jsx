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
import { JOURNEY_CATEGORIES as filterGroups } from "@/data/journeyData";
import { useSiteContent } from "@/context/SiteContentContext";

const MotionDiv = motion.div;
const MotionArticle = motion.article;
const MotionH1 = motion.h1;
const MotionP = motion.p;
const MotionImg = motion.img;

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

  // Lock body + Lenis scroll while modal is open
  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (window.__activeLenis?.stop) window.__activeLenis.stop();
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      if (window.__activeLenis?.start) window.__activeLenis.start();
    };
  }, []);

  return createPortal(
    <AnimatePresence>
      <MotionDiv
        key="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 p-4"
        onClick={onClose}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="fixed top-6 right-6 z-[100000] flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white transition-all duration-200 hover:border-emerald-400 hover:bg-black/90 shadow-xl"
        >
          <X size={20} />
        </button>

        <MotionDiv
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative flex h-[82vh] max-h-[680px] w-[92vw] max-w-[800px] items-center justify-center overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/95 shadow-[0_25px_70px_rgba(0,0,0,0.9)] p-2 sm:p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <AnimatePresence mode="wait">
            <MotionImg
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
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:border-emerald-400 hover:bg-black/90 active:scale-95 z-10"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {images.length > 1 && (
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:border-emerald-400 hover:bg-black/90 active:scale-95 z-10"
            >
              <ChevronRight size={20} />
            </button>
          )}

          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/80 px-3.5 py-1 text-xs font-mono font-medium tabular-nums text-white z-10">
            {current + 1} / {images.length}
          </div>
        </MotionDiv>
      </MotionDiv>
    </AnimatePresence>,
    document.body
  );
};

// DETAILS PANEL — rendered inside popup modal
const DetailsPanel = ({ d, onOpenLightbox }) => (
  <div className="space-y-5">
    {/* Meta grid */}
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: "Location / Org", value: d.university || d.organization },
        { label: "Course / Event", value: d.course || d.title },
        { label: "Current Status", value: d.status },
        { label: "Expected Graduation", value: d.expectedGraduation },
      ].filter(({ value }) => Boolean(value)).map(({ label, value }) => (
        <div key={label} className="rounded-xl border border-black/[0.08] bg-[#f8fafc] p-3.5 dark:border-white/[0.08] dark:bg-[#0c0e14]">
          <p className="mb-1 text-[11px] font-medium text-slate-500 dark:text-[#7a8296]">{label}</p>
          <p className="text-xs font-semibold leading-snug tabular-nums text-slate-900 dark:text-[#eef0f5]">{value}</p>
        </div>
      ))}
    </div>

    {/* Journey title */}
    {d.journeyTitle && (
      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
        {d.journeyTitle}
      </p>
    )}

    {/* Text Sections */}
    {[
      { key: "overview", label: "Overview", text: d.overview },
      { key: "problem", label: "Problem", text: d.problem },
      { key: "solution", label: "Solution", text: d.solution },
      { key: "objectives", label: "Objectives", text: d.objectives },
      { key: "outcomes", label: "Outcomes", text: d.outcomes },
      { key: "challenge", label: "Challenge", text: d.challenge },
    ].filter(({ text }) => Boolean(text)).map(({ key, label, text }) => (
      <div key={key}>
        <p className="mb-1.5 text-xs font-semibold text-slate-500 dark:text-[#7a8296]">{label}</p>
        {Array.isArray(text) ? (
          <ul className="mt-1 space-y-1.5">
            {text.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700 dark:text-[#d1d5df]">
                <span className="mt-[2px] shrink-0 text-xs font-semibold text-emerald-600 dark:text-emerald-400">•</span>
                <span>{typeof item === "string" ? item : item.name ? `${item.name}: ${item.description}` : item.title || ""}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm leading-relaxed text-slate-700 dark:text-[#d1d5df]">{text}</p>
        )}
      </div>
    ))}

    {/* Key Features / Event Highlights */}
    {(d.keyFeatures?.length > 0 || d.eventHighlights?.length > 0) && (
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-[#7a8296]">
          {d.keyFeatures?.length > 0 ? "Key Features" : "Event Highlights"}
        </p>
        <ul className="space-y-1.5">
          {(d.keyFeatures || d.eventHighlights).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700 dark:text-[#d1d5df]">
              <span className="mt-[2px] shrink-0 text-xs font-semibold text-emerald-600 dark:text-emerald-400">→</span>
              <span>{typeof item === "string" ? item : item.name ? `${item.name}: ${item.description}` : item.title || ""}</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Areas of Study */}
    {d.areasOfStudy?.length > 0 && (
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-[#7a8296]">Areas of Study</p>
        <ul className="space-y-1.5">
          {d.areasOfStudy.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700 dark:text-[#d1d5df]">
              <span className="mt-[2px] shrink-0 text-xs font-semibold text-emerald-600 dark:text-emerald-400">→</span>
              <span>
                {typeof item === "string" ? (
                  item
                ) : item.name ? (
                  <>
                    <strong className="font-semibold text-slate-900 dark:text-[#eef0f5]">{item.name}:</strong>{" "}
                    {item.description}
                  </>
                ) : (
                  item.description || item.title || ""
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Gallery */}
    {(d.gallery?.length > 0 || d.galleryPreview?.length > 0) && (
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-[#7a8296]">Gallery Preview</p>
        <div className="flex flex-wrap gap-2">
          {(d.gallery || d.galleryPreview).map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Gallery preview ${i + 1}`}
              onClick={() => onOpenLightbox?.(i)}
              className="h-20 w-20 cursor-pointer rounded-xl border border-black/[0.08] object-cover transition-colors hover:border-emerald-500 dark:border-white/[0.08]"
              width={80}
              height={80}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-[#7a8296]">
          Click any photo to view full gallery
        </p>
      </div>
    )}

    {/* Skills */}
    {(d.skills?.length > 0 || d.skillsGained?.length > 0) && (
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-[#7a8296]">Skills Gained</p>
        <div className="flex flex-wrap gap-1.5">
          {(d.skills || d.skillsGained).map((s) => (
            <span
              key={s}
              className="rounded-md border border-black/[0.08] bg-[#f8fafc] px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-[#d1d5df]"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Technologies */}
    {(d.technologies?.length > 0 || d.technologiesCovered?.length > 0) && (
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-[#7a8296]">Technologies Covered</p>
        <div className="flex flex-wrap gap-1.5">
          {(d.technologies || d.technologiesCovered).map((t) => (
            <span
              key={t}
              className="rounded-md border border-black/[0.08] bg-[#f8fafc] px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-[#d1d5df]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

// DETAILS POPUP MODAL
const JourneyDetailsModal = ({ event, onClose }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (window.__activeLenis?.stop) window.__activeLenis.stop();

    const onKey = (e) => {
      if (e.key === "Escape" && !lightboxOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      if (window.__activeLenis?.start) window.__activeLenis.start();
    };
  }, [lightboxOpen, onClose]);

  if (!event || typeof document === "undefined") return null;

  const hasGallery = event.gallery?.length > 0;

  return (
    <>
      {lightboxOpen && hasGallery && (
        <GalleryLightbox
          images={event.gallery}
          startIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {createPortal(
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center p-3 sm:p-6"
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Backdrop */}
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
          />

          {/* Centered Detail Card */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={event.title}
            className="relative z-10 flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-black/[0.1] bg-white text-slate-900 shadow-2xl dark:border-white/[0.1] dark:bg-[#11141c] dark:text-[#eef0f5]"
          >
            {/* Header Bar */}
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-black/[0.08] bg-[#f8fafc] px-5 py-4 sm:px-6 dark:border-white/[0.08] dark:bg-[#0c0e14]">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-md border border-emerald-600/25 bg-emerald-50 px-2 py-0.5 font-mono text-[11px] font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
                    {event.tag || event.category}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500 dark:text-[#7a8296]">
                    {formatLabel(event.duration)}
                  </span>
                  {event.mode && (
                    <span className="font-mono text-[11px] text-slate-500 dark:text-[#7a8296]">
                      · {event.mode}
                    </span>
                  )}
                </div>
                <h2 className="mt-1.5 font-display text-lg font-semibold leading-snug text-slate-900 sm:text-xl dark:text-[#eef0f5]">
                  {event.title}
                </h2>
                <p className="mt-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  {event.organization}
                  {event.location ? ` · ${event.location}` : ""}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {event.hasCertificate && (
                  <a
                    href={event.certificateUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-500/10 px-3 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-500/20 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300"
                  >
                    <FileBadge size={13} strokeWidth={1.6} />
                    <span>Certificate</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close details popup"
                  title="Close (Esc)"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.1] bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-white/[0.1] dark:bg-[#11141c] dark:text-[#a3a9b8] dark:hover:border-white/[0.2] dark:hover:bg-[#1a1e28] dark:hover:text-white"
                >
                  <X size={16} strokeWidth={1.6} />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              className="flex-1 space-y-5 overflow-y-auto overscroll-contain p-5 sm:p-6"
            >
              {event.imageUrl && (
                <div
                  className={`relative h-48 sm:h-56 overflow-hidden rounded-xl border border-black/[0.08] bg-zinc-900 dark:border-white/[0.08] ${
                    hasGallery ? "cursor-pointer group" : ""
                  }`}
                  onClick={
                    hasGallery
                      ? () => {
                          setLightboxIndex(0);
                          setLightboxOpen(true);
                        }
                      : undefined
                  }
                >
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className={`h-full w-full ${
                      event.imageFit === "contain"
                        ? "object-contain p-5 bg-white"
                        : event.imageFit === "contain-dark"
                        ? "object-contain p-5 bg-zinc-950/90"
                        : "object-cover"
                    }`}
                  />
                  {hasGallery && (
                    <div className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/75 px-3 py-1 text-[11px] font-medium text-white">
                      <Images size={12} strokeWidth={1.6} />
                      <span>View {event.gallery.length} photos</span>
                    </div>
                  )}
                </div>
              )}

              <p className="text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8]">
                {event.description}
              </p>

              {event.details ? (
                <DetailsPanel
                  d={event.details}
                  onOpenLightbox={(idx) => {
                    setLightboxIndex(idx);
                    setLightboxOpen(true);
                  }}
                />
              ) : null}

              {event.hasCertificate && (
                <div className="sm:hidden pt-1">
                  <a
                    href={event.certificateUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-500/10 px-4 text-xs font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300"
                  >
                    <FileBadge size={14} strokeWidth={1.6} />
                    <span>View Certificate</span>
                  </a>
                </div>
              )}
            </div>
          </MotionDiv>
        </div>,
        document.body,
      )}
    </>
  );
};

// JOURNEY CARD
const JourneyCard = ({ event, onOpenDetails }) => {
  const Icon = event.icon || Award;
  const hasDetails = Boolean(event.details || event.description);
  const hasGallery = event.gallery?.length > 0;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  return (
    <>
      {/* Gallery lightbox portal */}
      {lightboxOpen && hasGallery && (
        <GalleryLightbox
          images={event.gallery}
          startIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <MotionArticle
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px 0px" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="group relative w-full max-w-2xl overflow-hidden rounded-2xl border border-black/[0.08] bg-white transition-colors duration-200 hover:border-emerald-600/30 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-emerald-500/30"
      >
        {/* Image */}
        <div
          className={`relative h-44 sm:h-56 md:h-64 overflow-hidden bg-zinc-900 ${hasGallery ? "cursor-pointer" : ""}`}
          onClick={hasGallery ? () => { setLightboxIndex(0); setLightboxOpen(true); } : undefined}
        >
          <img
            src={event.imageUrl}
            alt={event.title}
            className={`h-full w-full ${
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
              <span className="flex translate-y-3 items-center gap-2 rounded-full border border-white/30 bg-black/70 px-5 py-2.5 text-[11px] font-medium text-white/90 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <Images size={13} strokeWidth={1.5} />
                View Gallery
              </span>
            </div>
          )}

          {/* Photo count badge */}
          {hasGallery && (
            <div className="absolute right-4 top-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white/80">
                <Camera size={10} strokeWidth={1.5} />
                +{event.gallery.length} Photos
              </span>
            </div>
          )}

          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white/90">
              <Icon size={10} strokeWidth={1.5} />
              {event.tag}
            </span>
          </div>
          {/* Mode badge — only show when no gallery (gallery has photo count instead) */}
          {!hasGallery && (
            <div className="absolute right-4 top-4">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] font-medium text-white/80">
                {event.mode}
              </span>
            </div>
          )}
        </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <p className="mb-1 text-[11px] font-medium text-slate-500 dark:text-[#7a8296]">{event.subtitle}</p>
        <h3 className="text-base font-semibold leading-snug text-slate-900 dark:text-[#eef0f5] sm:text-xl">{event.title}</h3>
        <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          {event.organization}
        </p>

        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-[#7a8296]">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={12} strokeWidth={1.5} className="text-slate-500 dark:text-[#7a8296]" />
            {formatLabel(event.duration)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={12} strokeWidth={1.5} className="text-slate-500 dark:text-[#7a8296]" />
            {event.location}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8]">{event.description}</p>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {/* Details modal trigger */}
          {hasDetails && (
            <button
              type="button"
              onClick={onOpenDetails}
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-ink-950 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-ink-900 dark:border-white/[0.1] dark:bg-emerald-500 dark:text-ink-950 dark:hover:bg-emerald-400"
            >
              <ExternalLink size={13} strokeWidth={1.6} />
              View Details
            </button>
          )}
          {/* Certificate link — only when available */}
          {event.hasCertificate && (
            <a
              href={event.certificateUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-500/20 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/25"
            >
              <FileBadge size={13} strokeWidth={1.5} />
              Certificate
            </a>
          )}
        </div>
      </div>
      </MotionArticle>
    </>
  );
};

// GRID CARD (compact)
const GridCard = ({ event, onOpenDetails }) => {
  const Icon = event.icon || Award;
  const hasDetails = Boolean(event.details || event.description);
  const hasGallery = event.gallery?.length > 0;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  return (
    <>
      {/* Gallery lightbox portal */}
      {lightboxOpen && hasGallery && (
        <GalleryLightbox
          images={event.gallery}
          startIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <MotionArticle
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px 0px" }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white transition-colors duration-200 hover:border-emerald-600/30 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-emerald-500/30"
      >

        
        {/* Image wrapper */}
        <div
          className={`relative h-48 shrink-0 overflow-hidden bg-zinc-800 ${hasGallery ? "cursor-pointer" : ""}`}
          onClick={hasGallery ? () => { setLightboxIndex(0); setLightboxOpen(true); } : undefined}
        >
          <img
            src={event.imageUrl}
            alt={event.title}
            className={`h-full w-full ${
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
              <span className="flex translate-y-2 items-center gap-1.5 rounded-full border border-white/30 bg-black/70 px-4 py-2 text-[10px] font-medium text-white/90 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <Images size={11} strokeWidth={1.5} />
                View Gallery
              </span>
            </div>
          )}

          {/* Photo count badge */}
          {hasGallery && (
            <div className="absolute right-3 top-3">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/60 px-2 py-0.5 text-[9px] font-medium text-white/80">
                <Camera size={9} strokeWidth={1.5} />
                +{event.gallery.length} Photos
              </span>
            </div>
          )}

          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 text-[9px] font-medium text-white/90">
            <Icon size={9} strokeWidth={1.5} />
            {event.tag}
          </span>
          
          {/* Mode badge — only show when no gallery */}
          {!hasGallery && (
            <div className="absolute right-3 top-3">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-[9px] font-medium text-white/80">
                {event.mode}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <p className="mb-1 font-mono text-[11px] font-medium text-slate-500 dark:text-[#7a8296]">
            {formatLabel(event.duration)}
          </p>
          <h3 className="line-clamp-1 font-display text-sm font-semibold leading-snug text-slate-900 dark:text-[#eef0f5]">
            {event.title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            {event.organization}
          </p>
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-[#a3a9b8]">
            {event.description}
          </p>

          {/* Actions */}
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
            {/* Details popup trigger */}
            {hasDetails && (
              <button
                type="button"
                onClick={onOpenDetails}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors duration-150 hover:bg-emerald-500/20 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/25"
              >
                <ExternalLink size={12} strokeWidth={1.6} />
                View Details
              </button>
            )}

            {/* Certificate link */}
            {event.hasCertificate && (
              <a
                href={event.certificateUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors duration-150 hover:bg-emerald-500/20 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/25"
              >
                <FileBadge size={12} strokeWidth={1.5} />
                Certificate
              </a>
            )}
          </div>
        </div>
      </MotionArticle>
    </>
  );
};

// TIMELINE DOT
const TimelineDot = ({ isActive }) => (
  <div
    className={`relative z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all duration-500 ${
      isActive
        ? "scale-110 border-emerald-500 bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]"
        : "border-slate-400 bg-white dark:border-zinc-700 dark:bg-zinc-950"
    }`}
  >
    {isActive && (
      <MotionDiv
        className="h-1.5 w-1.5 rounded-full bg-white dark:bg-black"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      />
    )}
  </div>
);

// MAIN PAGE
const JourneyPage = () => {
  const { journeyItems: journeyData } = useSiteContent();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [view, setView] = useState("timeline");
  const [activeYear, setActiveYear] = useState(2024);
  const [selectedDetailId, setSelectedDetailId] = useState(null);
  const [activeItemId, setActiveItemId] = useState(
    journeyData[0]?.id || "bca-bbd-2024"
  );

  const selectedDetailEvent = useMemo(
    () => journeyData.find((item) => item.id === selectedDetailId) || null,
    [journeyData, selectedDetailId]
  );

  // Scroll to and open details popup matching URL hash or search parameter (?selected=id or #id)
  useEffect(() => {
    const hashId = location.hash ? location.hash.replace("#", "") : null;
    const searchParams = new URLSearchParams(location.search);
    const selectedParam = searchParams.get("selected") || searchParams.get("id");
    const targetId = hashId || selectedParam;

    if (!targetId) return;

    const timer = setTimeout(() => {
      setActiveFilter("All");
      setSearch("");
      setSelectedDetailId(targetId);

      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-2", "ring-emerald-500", "rounded-2xl", "transition-all", "duration-500");
          setTimeout(() => {
            el.classList.remove("ring-2", "ring-emerald-500");
          }, 3500);
        }
      }, 60);
    }, 240);

    return () => clearTimeout(timer);
  }, [location.hash, location.search]);

  const [showCategoryFilters, setShowCategoryFilters] = useState(true);
  const isScrollingLocked = useRef(false);

  const statsSummary = useMemo(() => {
    const internships = journeyData.filter((e) => e.category === "Internships").length;
    const workshops = journeyData.filter(
      (e) =>
        e.category === "Workshops" ||
        e.category === "Startup Events" ||
        e.category === "Academic Programs"
    ).length;
    const certifications = journeyData.filter(
      (e) => e.category === "Certifications" || e.category === "Achievements"
    ).length;
    const conferences = journeyData.filter(
      (e) => e.category === "Hackathons" || e.category === "Open Source"
    ).length;

    const totalExperiences = internships + workshops + certifications + conferences;
    return { totalExperiences, internships, workshops, certifications, conferences };
  }, [journeyData]);

  
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
  }, [activeFilter, journeyData, search]);

  const allYears = useMemo(
    () =>
      Array.from(new Set(journeyData.map((e) => e.year))).sort((a, b) => a - b),
    [journeyData]
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
    const handleScroll = () => {
      if (isScrollingLocked.current) return;
      const scrollY = window.scrollY;
      if (scrollY < 120 && filteredData.length > 0) {
        if (activeItemId !== filteredData[0].id) {
          setActiveItemId(filteredData[0].id);
          if (filteredData[0].year) setActiveYear(filteredData[0].year);
        }
        return;
      }

      const triggerY = scrollY + window.innerHeight * 0.38;

      let closestId = null;
      let minDistance = Infinity;

      filteredData.forEach((event) => {
        const el = document.getElementById(event.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + scrollY;
          const dist = Math.abs(top - triggerY);
          if (dist < minDistance) {
            minDistance = dist;
            closestId = event.id;
          }
        }
      });

      if (closestId && closestId !== activeItemId) {
        setActiveItemId(closestId);
        const item = filteredData.find((e) => e.id === closestId);
        if (item && item.year) {
          setActiveYear(item.year);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredData, activeItemId]);

  
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

      


      

      <section id="journey-hero" className="relative overflow-hidden pt-6 sm:pt-8 pb-12 sm:pb-16">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <MotionDiv
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-500/[0.08] px-4 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400">
              Professional Growth
            </span>
          </MotionDiv>

          <MotionH1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.08] tracking-tight text-slate-900 dark:text-[#eef0f5]"
          >
            Professional{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              Journey
            </span>
          </MotionH1>

          <MotionP
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8] sm:text-base"
          >
            A timeline of my learning, internships, workshops, hackathons, certifications, and technical experiences that shaped my journey as a Full-Stack Web Developer and Cybersecurity Researcher.
          </MotionP>

          {/* Core Stats Capsule */}
          <MotionDiv
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-8 sm:mt-10 max-w-4xl rounded-2xl border border-black/[0.08] bg-white p-4 sm:p-6 dark:border-white/[0.08] dark:bg-[#11141c]"
          >
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 md:divide-x md:divide-black/[0.08] dark:md:divide-white/[0.08]">
              {[
                { label: "Started Journey", value: "2024", color: "text-slate-900 dark:text-[#eef0f5]" },
                { label: "Current Year", value: "2026", color: "text-emerald-600 dark:text-emerald-400" },
                { label: "Learning Span", value: "3 Years", color: "text-slate-900 dark:text-[#eef0f5]" },
                { label: "Active Status", value: "Learning & Building", color: "text-emerald-600 dark:text-emerald-400" },
              ].map(({ label, value, color }, i) => (
                <div key={label} className={`flex flex-col items-center justify-center text-center ${i > 0 ? "md:pl-4" : ""}`}>
                  <span className="mb-1 text-xs font-medium text-slate-500 dark:text-[#7a8296]">
                    {label}
                  </span>
                  <span className={`text-base sm:text-lg font-semibold tracking-tight tabular-nums ${color}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </MotionDiv>

          {/* Category Counters Grid */}
          <MotionDiv
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-4 sm:mt-5 grid max-w-4xl grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-5"
          >
            {[
              { label: "Total Milestones", value: statsSummary.totalExperiences, span: "col-span-2 md:col-span-1" },
              { label: "Internships", value: statsSummary.internships, span: "" },
              { label: "Workshops & Events", value: statsSummary.workshops, span: "" },
              { label: "Certifications", value: statsSummary.certifications, span: "" },
              { label: "Hackathons & CTFs", value: statsSummary.conferences, span: "" },
            ].map(({ label, value, span }) => (
              <div
                key={label}
                className={`flex flex-col justify-between rounded-xl border border-black/[0.08] bg-white p-3.5 sm:p-4 text-left transition-colors duration-150 hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-white/[0.14] ${span}`}
              >
                <span className="text-[11px] font-medium text-slate-500 dark:text-[#7a8296] leading-snug">
                  {label}
                </span>
                <span className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-semibold tabular-nums text-slate-900 dark:text-[#eef0f5] leading-none">
                  {value}
                </span>
              </div>
            ))}
          </MotionDiv>
        </div>
      </section>

      <section className="section-wrap border-b border-black/[0.08] dark:border-white/[0.06] py-5 sm:py-6">
        <div className="mx-auto max-w-5xl">
          <MotionDiv
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            {/* Search input */}
            <label className="relative flex-1">
              <Search
                size={15}
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400 dark:text-[#7a8296]"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, organization, skill, or year..."
                className="w-full rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] py-2.5 pr-4 pl-10 text-sm text-slate-900 dark:text-[#eef0f5] outline-none placeholder:text-slate-400 dark:placeholder:text-[#7a8296] transition-colors focus:border-emerald-600/50 dark:focus:border-emerald-500/50"
              />
            </label>

            {/* Filters toggle + View toggle row */}
            <div className="flex items-center justify-between gap-2.5 sm:justify-end">
              <button
                type="button"
                onClick={() => setShowCategoryFilters(!showCategoryFilters)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors duration-150 ${
                  showCategoryFilters
                    ? "border-emerald-600/40 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300"
                    : "border-black/[0.08] bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8] dark:hover:border-white/[0.16] dark:hover:text-[#eef0f5]"
                }`}
              >
                <SlidersHorizontal size={13} strokeWidth={1.5} />
                Filters
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${showCategoryFilters ? "rotate-180" : ""}`}
                />
              </button>

              <div className="inline-flex items-center gap-1 rounded-xl border border-black/[0.08] bg-white p-1 dark:border-white/[0.08] dark:bg-[#11141c]">
                {[
                  { id: "timeline", label: "Timeline", icon: GitBranch },
                  { id: "grid", label: "Grid", icon: Grid2X2 },
                ].map((tab) => {
                  const TabIcon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setView(tab.id)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
                        view === tab.id
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : "text-slate-500 hover:text-slate-900 dark:text-[#7a8296] dark:hover:text-[#eef0f5]"
                      }`}
                    >
                      <TabIcon size={13} strokeWidth={1.5} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </MotionDiv>

          {/* Filter pills */}
          <AnimatePresence>
            {showCategoryFilters && (
              <MotionDiv
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                style={{ overflow: "hidden" }}
              >
                <div className="flex flex-wrap items-center gap-2 pt-3.5">
                  {filterGroups.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setActiveFilter(item)}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 ${
                        activeFilter === item
                          ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-slate-950"
                          : "border-black/[0.08] bg-white text-slate-700 hover:border-slate-300 hover:text-slate-950 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8] dark:hover:border-white/[0.16] dark:hover:text-[#eef0f5]"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </section>

      {view === "timeline" && (
        <div
          className="sticky z-40 xl:hidden border-b border-black/[0.08] dark:border-white/[0.08] bg-white/95 dark:bg-[#090a0f]/95 backdrop-blur-md"
          style={{ top: "var(--site-top-offset, 4rem)" }}
        >
          <div className="mx-auto max-w-6xl px-4 py-2 sm:px-6 lg:px-10">
            <div
              className="flex items-center gap-2 overflow-x-auto"
              style={{ scrollbarWidth: "none" }}
            >
              <span className="shrink-0 text-xs font-medium text-slate-500 dark:text-[#7a8296]">
                Jump to
              </span>
              {allYears.map((year) => {
                const isActive = activeYear === year;
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={(e) => handleYearClick(e, year)}
                    className={`shrink-0 rounded-lg border px-3 py-1 text-xs font-medium tabular-nums transition-colors duration-150 ${
                      isActive
                        ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-slate-950"
                        : "border-black/[0.08] dark:border-white/[0.08] bg-slate-100 dark:bg-[#11141c] text-slate-700 dark:text-[#a3a9b8] hover:text-slate-950 dark:hover:text-[#eef0f5]"
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

      <section className="section-wrap py-8 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <AnimatePresence mode="wait">
            {view === "grid" ? (
              <MotionDiv
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredData.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-sm font-medium text-slate-500 dark:text-[#7a8296]">
                    No milestones match your current filter.
                  </div>
                ) : (
                  filteredData.map((event) => (
                    <div key={event.id} id={event.id} className="h-full scroll-mt-32">
                      <GridCard
                        event={event}
                        onOpenDetails={() => setSelectedDetailId(event.id)}
                      />
                    </div>
                  ))
                )}
              </MotionDiv>
            ) : (
              <MotionDiv
                key="timeline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-12 sm:space-y-16"
              >
                {groupedByYear.length === 0 ? (
                  <div className="py-20 text-center text-sm font-medium text-slate-500 dark:text-[#7a8296]">
                    No milestones match your current filter.
                  </div>
                ) : (
                  groupedByYear.map(({ year, items }) => (
                    <div key={year} id={`year-${year}`} className="scroll-mt-32">
                      <MotionDiv
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35 }}
                        className="mb-6 sm:mb-8 flex items-center gap-3"
                      >
                        <div
                          className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 transition-colors duration-200 ${
                            activeYear === year
                              ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-slate-950"
                              : "border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#11141c] text-slate-900 dark:text-[#eef0f5]"
                          }`}
                        >
                          <span
                            className={`font-mono text-[11px] font-medium ${
                              activeYear === year
                                ? "text-white/85 dark:text-slate-900/75"
                                : "text-slate-500 dark:text-[#7a8296]"
                            }`}
                          >
                            Year
                          </span>
                          <span className="font-display text-sm font-semibold tabular-nums">
                            {year}
                          </span>
                        </div>
                        <div className="h-px flex-1 bg-black/[0.08] dark:bg-white/[0.08]" />
                        <span className="shrink-0 font-mono text-xs font-medium tabular-nums text-slate-500 dark:text-[#7a8296]">
                          {items.length} milestone{items.length !== 1 ? "s" : ""}
                        </span>
                      </MotionDiv>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-3 w-px bg-black/[0.08] dark:bg-white/[0.08] lg:left-1/2 lg:-translate-x-px" />

                        {activeYear === year && (
                          <MotionDiv
                            className="absolute inset-y-0 left-3 w-px bg-emerald-600/30 dark:bg-emerald-500/30 lg:left-1/2 lg:-translate-x-px"
                            initial={{ scaleY: 0, originY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                        )}

                        <div className="space-y-8 pl-8 sm:pl-10 lg:space-y-16 lg:pl-0">
                          {items.map((event, idx) => {
                            const isLeft = idx % 2 === 0;
                            return (
                              <div key={event.id} id={event.id} className="relative scroll-mt-32">
                                <div className="absolute left-3 top-6 -translate-x-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:top-10">
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
                                          onOpenDetails={() => setSelectedDetailId(event.id)}
                                        />
                                      </div>
                                      <div className="hidden lg:flex lg:flex-col lg:items-start lg:pl-14">
                                        <span className="text-[11px] font-medium text-slate-500 dark:text-[#7a8296]">
                                          {formatLabel(event.duration)}
                                        </span>
                                        <span className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                          {event.category}
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="hidden lg:flex lg:flex-col lg:items-end lg:pr-14 lg:text-right">
                                        <span className="text-[11px] font-medium text-slate-500 dark:text-[#7a8296]">
                                          {formatLabel(event.duration)}
                                        </span>
                                        <span className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                          {event.category}
                                        </span>
                                      </div>
                                      <div className="flex justify-start lg:pl-14">
                                        <JourneyCard
                                          event={event}
                                          onOpenDetails={() => setSelectedDetailId(event.id)}
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
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>
        {selectedDetailEvent ? (
          <JourneyDetailsModal
            key={selectedDetailEvent.id}
            event={selectedDetailEvent}
            onClose={() => setSelectedDetailId(null)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default JourneyPage;
