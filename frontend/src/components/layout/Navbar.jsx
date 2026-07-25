import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Code2,
  Cpu,
  Download,
  FileText,
  Folder,
  GitBranch,
  Home,
  Mail,
  Menu,
  Moon,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Sun,
  SunMedium,
  Terminal,
  User,
  Wrench,
  X,
} from "lucide-react";
import { NAV_LINKS, QUICK_CONTACT, SITE_PROFILE } from "@/constants/siteData";
import { useTheme } from "@/context/ThemeContext";

const NAV_OFFSET_REM = 6;
const OPPORTUNITY_BANNER_HEIGHT_REM = 2.25;

const mobileNavIconMap = {
  Home,
  About: User,
  Skills: Sparkles,
  Projects: Folder,
  Experiments: Terminal,
  Journey: GitBranch,
  Blog: BookOpen,
  Services: Briefcase,
  Contact: Mail,
};

const subIconMap = {
  "Security Labs": ShieldCheck,
  "Dev Terminal": Terminal,
  "Data Structure Lab": Cpu,
  "Cyber Tools": Search,
  "Document Methodology": FileText,
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showOpportunityBanner, setShowOpportunityBanner] = useState(true);
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [resumeDropdownOpen, setResumeDropdownOpen] = useState(false);
  const resumeDropdownRef = useRef(null);

  const [experimentsOpen, setExperimentsOpen] = useState(false);
  const [mobileExperimentsOpen, setMobileExperimentsOpen] = useState(false);
  const experimentsRef = useRef(null);
  const experimentsTimeoutRef = useRef(null);

  const handleExperimentsMouseEnter = () => {
    if (experimentsTimeoutRef.current) {
      clearTimeout(experimentsTimeoutRef.current);
    }
    setExperimentsOpen(true);
  };

  const handleExperimentsMouseLeave = () => {
    experimentsTimeoutRef.current = setTimeout(() => {
      setExperimentsOpen(false);
    }, 180);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (resumeDropdownRef.current && !resumeDropdownRef.current.contains(e.target)) {
        setResumeDropdownOpen(false);
      }
      if (experimentsRef.current && !experimentsRef.current.contains(e.target)) {
        setExperimentsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      if (experimentsTimeoutRef.current) {
        clearTimeout(experimentsTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const nextOffset = showOpportunityBanner
      ? NAV_OFFSET_REM + OPPORTUNITY_BANNER_HEIGHT_REM
      : NAV_OFFSET_REM;

    document.documentElement.style.setProperty(
      "--site-top-offset",
      `${nextOffset}rem`,
    );

    return () => {
      document.documentElement.style.setProperty(
        "--site-top-offset",
        `${NAV_OFFSET_REM}rem`,
      );
    };
  }, [showOpportunityBanner]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const closeOpportunityBanner = () => {
    setShowOpportunityBanner(false);
  };

  const navItemClass = ({ isActive }) =>
    clsx(
      "rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300",
      isActive
        ? "bg-lime-400 text-[#121212] shadow-[0_0_20px_rgba(163,230,53,0.65),0_0_4px_rgba(163,230,53,0.4)]"
        : isDark
          ? "text-zinc-400/80 hover:text-white hover:bg-white/[0.06]"
          : "text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.04]",
    );

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {showOpportunityBanner ? (
        <div
          className={clsx(
            "opportunity-banner-shell relative border-b backdrop-blur-lg",
            isDark
              ? "border-emerald-300/25 bg-gradient-to-r from-emerald-950/65 via-emerald-900/40 to-cyan-950/45"
              : "border-emerald-500/30 bg-gradient-to-r from-emerald-100/80 via-cyan-100/75 to-sky-100/80",
          )}
        >
          <div
            className={clsx(
              "pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-32",
              isDark
                ? "bg-gradient-to-r from-slate-950/95 via-slate-950/50 to-transparent"
                : "bg-gradient-to-r from-white/95 via-white/60 to-transparent",
            )}
          />
          <div
            className={clsx(
              "pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-32",
              isDark
                ? "bg-gradient-to-l from-slate-950/95 via-slate-950/50 to-transparent"
                : "bg-gradient-to-l from-white/95 via-white/60 to-transparent",
            )}
          />

          <div className="mx-auto relative flex h-9 max-w-7xl items-center px-3 sm:px-6 lg:px-10">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-14 sm:hidden">
              <Link
                to="/contact"
                className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-emerald-300/45 bg-emerald-300/12 px-2.5 py-1 text-[10px] font-semibold text-emerald-100 transition hover:bg-emerald-300/22"
              >
                Let's talk
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="pointer-events-none absolute inset-0 hidden items-center justify-center px-12 sm:flex sm:px-24">
              <div className="flex min-w-0 items-center justify-center gap-2 text-emerald-100">
                <span className="relative inline-flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300/65" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(74,222,128,0.95)]" />
                </span>

                <p className="truncate text-center text-[10px] font-semibold uppercase tracking-[0.14em] sm:text-xs">
                  Open to opportunities
                </p>
                <p className="hidden text-xs text-emerald-200/90 lg:block">
                  Internships, freelance and collaborations
                </p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5">
              <Link
                to="/contact"
                className="hidden items-center gap-1 rounded-full border border-emerald-300/45 bg-emerald-300/12 px-3 py-1 text-[11px] font-semibold text-emerald-100 transition hover:bg-emerald-300/22 sm:inline-flex"
              >
                Let's talk
                <ArrowRight size={13} />
              </Link>
              <button
                type="button"
                onClick={closeOpportunityBanner}
                aria-label="Close opportunities banner"
                className="rounded-full p-1 text-emerald-200/80 transition hover:bg-emerald-300/15 hover:text-emerald-100"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className={clsx(
        "w-full transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-50",
        isScrolled ? "pt-4" : "pt-0"
      )}>
        <div
          className={clsx(
            "mx-auto transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] backdrop-blur-xl border-b",
            isScrolled
              ? isDark
                ? "w-[97%] max-w-6xl rounded-full px-6 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.35)] border-white/[0.06] bg-zinc-950/20"
                : "w-[97%] max-w-6xl rounded-full px-6 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border-zinc-900/[0.06] bg-white/20"
              : isScrolled
                ? "w-full max-w-none rounded-none px-6 sm:px-12 lg:px-16 py-3.5 shadow-none border-transparent bg-transparent"
                : isDark
                  ? "w-full max-w-none rounded-none px-6 sm:px-12 lg:px-16 py-3.5 shadow-none border-transparent bg-transparent"
                  : "w-full max-w-none rounded-none px-6 sm:px-12 lg:px-16 py-3.5 shadow-none border-zinc-200/40 bg-white/60"
          )}
        >
            <div className={clsx(
              "flex items-center justify-between transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
              isScrolled ? "h-11" : "h-14"
            )}>
              {/* Hamburger Button — LEFT on mobile */}
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className={clsx(
                  "rounded-full p-2 transition xl:hidden shrink-0",
                  isDark
                    ? "text-zinc-300 hover:bg-white/10 hover:text-sky-400"
                    : "text-zinc-700 hover:bg-black/5 hover:text-sky-600",
                )}
                aria-label="Toggle menu"
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>

              {/* Logo — RIGHT on mobile, LEFT on desktop */}
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="group flex items-center shrink-0 xl:mr-10 xl:order-first"
              >
                <span className={clsx(
                  "font-outfit text-[1.4rem] sm:text-[1.7rem] font-black tracking-[0.18em] uppercase select-none transition-all duration-300",
                  "bg-gradient-to-r from-teal-300 via-emerald-400 to-lime-400 bg-clip-text text-transparent",
                  "drop-shadow-[0_4px_22px_rgba(52,211,153,0.65)] group-hover:drop-shadow-[0_6px_30px_rgba(52,211,153,0.9)] group-hover:scale-[1.03]",
                  "inline-block"
                )}>
                  NIKHIL
                </span>
              </Link>

              <nav className="hidden items-center gap-1 xl:flex justify-center flex-1">
                {NAV_LINKS.map((item) => {
                  if (item.isDropdown) {
                    return (
                      <div
                        key={item.label}
                        ref={experimentsRef}
                        className="relative"
                        onMouseEnter={handleExperimentsMouseEnter}
                        onMouseLeave={handleExperimentsMouseLeave}
                      >
                        <button
                          type="button"
                          onClick={() => setExperimentsOpen((v) => !v)}
                          className={clsx(
                            "inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300",
                            location.pathname.startsWith("/experiments") || location.pathname.startsWith("/security")
                              ? "bg-lime-400 text-[#121212] shadow-[0_0_20px_rgba(163,230,53,0.65),0_0_4px_rgba(163,230,53,0.4)]"
                              : isDark
                                ? "text-zinc-400/80 hover:text-white hover:bg-white/[0.06]"
                                : "text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.04]",
                          )}
                        >
                          {item.label}
                          <ChevronDown size={13} className={`transition-transform duration-200 ${experimentsOpen ? "rotate-180" : ""}`} />
                        </button>

                        {experimentsOpen && (
                          <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2.5 w-72 z-50">
                            <div className={clsx(
                              "rounded-2xl border p-2 shadow-[0_18px_45px_rgba(0,10,2,0.85)] backdrop-blur-xl transition-all duration-200 animate-fadeIn",
                              isDark
                                ? "border-green-400/25 bg-[#030d07]/95 text-white"
                                : "border-green-400/30 bg-white/95 text-slate-900",
                            )}>
                              <div className="px-3 py-1.5 font-mono text-[10px] uppercase font-bold text-emerald-400 tracking-widest border-b border-emerald-500/20 mb-1">
                                // EXPERIMENTAL LABS
                              </div>
                              {item.children.map((sub) => {
                                const SubIcon = subIconMap[sub.label] || ShieldCheck;
                                return (
                                  <NavLink
                                    key={sub.to}
                                    to={sub.to}
                                    onClick={() => setExperimentsOpen(false)}
                                    className={({ isActive }) => clsx(
                                      "flex items-start gap-3 rounded-xl p-2.5 transition-all duration-200",
                                      isActive
                                        ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold"
                                        : isDark
                                          ? "hover:bg-white/5 hover:text-emerald-300 text-slate-300"
                                          : "hover:bg-emerald-50 text-slate-800",
                                    )}
                                  >
                                    <span className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                                      <SubIcon size={14} />
                                    </span>
                                    <div>
                                      <p className="text-xs font-bold leading-tight">{sub.label}</p>
                                      <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{sub.description}</p>
                                    </div>
                                  </NavLink>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <NavLink key={item.to} to={item.to} className={navItemClass}>
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="hidden items-center gap-3 xl:flex shrink-0 ml-6 xl:ml-10">
                <motion.button
                  type="button"
                  onClick={toggleTheme}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.88, rotate: -15 }}
                  className={clsx(
                    "relative flex h-9 w-9 items-center justify-center rounded-full border shadow-lg backdrop-blur-xl transition-all duration-300 overflow-hidden group",
                    isDark
                      ? "border-amber-400/40 bg-amber-400/10 text-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.35)] hover:border-amber-300 hover:bg-amber-400/20 hover:shadow-[0_0_24px_rgba(251,191,36,0.6)]"
                      : "border-indigo-600/40 bg-indigo-500/10 text-indigo-700 shadow-[0_0_16px_rgba(99,102,241,0.25)] hover:border-indigo-600 hover:bg-indigo-500/20 hover:shadow-[0_0_24px_rgba(99,102,241,0.45)]"
                  )}
                  aria-label="Toggle theme"
                  title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={isDark ? "dark" : "light"}
                      initial={{ rotate: -90, scale: 0.3, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      exit={{ rotate: 90, scale: 0.3, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "backOut" }}
                      className="flex items-center justify-center"
                    >
                      {isDark ? (
                        <Sun size={17} className="text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                      ) : (
                        <Moon size={17} className="text-indigo-600 drop-shadow-[0_0_6px_rgba(99,102,241,0.6)]" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>

                <div ref={resumeDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setResumeDropdownOpen((v) => !v)}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-400/60 bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-green-500/15 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.35)] hover:border-emerald-300 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-lime-400 hover:text-slate-950 hover:shadow-[0_0_30px_rgba(52,211,153,0.65)] hover:scale-[1.04] transition-all duration-300 ease-out"
                    aria-label="Open resume dropdown"
                    aria-expanded={resumeDropdownOpen}
                  >
                    <Download size={14} />
                    Resume
                    <ChevronDown size={14} className={`transition-transform duration-200 ${resumeDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {resumeDropdownOpen && (
                    <div className={clsx(
                      "absolute right-0 top-full mt-2.5 w-56 rounded-2xl border p-1.5 shadow-[0_16px_40px_rgba(0,10,2,0.7)] backdrop-blur-xl z-50",
                      isDark
                        ? "border-green-400/20 bg-[#030a03]/95"
                        : "border-green-400/30 bg-white/95",
                    )}>
                      <a
                        href={QUICK_CONTACT.resumeFullStack}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setResumeDropdownOpen(false)}
                        className={clsx(
                          "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200",
                          isDark
                            ? "text-slate-200 hover:bg-green-400/12 hover:text-green-300"
                            : "text-slate-700 hover:bg-green-50 hover:text-green-700",
                        )}
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-green-400/30 bg-green-400/10 text-green-400">
                          <Code2 size={13} />
                        </span>
                        <div>
                          <p className="font-black uppercase tracking-wide">Full-Stack Dev</p>
                          <p className={clsx("text-[10px] font-medium", isDark ? "text-slate-500" : "text-slate-400")}>React · Node.js · MERN</p>
                        </div>
                      </a>

                      <a
                        href={QUICK_CONTACT.resumeSecurity}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setResumeDropdownOpen(false)}
                        className={clsx(
                          "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200",
                          isDark
                            ? "text-slate-200 hover:bg-green-400/12 hover:text-green-300"
                            : "text-slate-700 hover:bg-green-50 hover:text-green-700",
                        )}
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-400/10 text-emerald-400">
                          <ShieldCheck size={13} />
                        </span>
                        <div>
                          <p className="font-black uppercase tracking-wide">Cyber Security</p>
                          <p className={clsx("text-[10px] font-medium", isDark ? "text-slate-500" : "text-slate-400")}>AppSec · OWASP · PenTest</p>
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      {open && (
        <div className="fixed inset-0 z-40 xl:hidden">
          <button
            type="button"
            aria-label="Close menu overlay"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <aside
            className={clsx(
              "absolute left-0 top-0 flex h-full max-h-screen w-[min(85vw,310px)] flex-col overflow-y-auto p-5 sm:p-6 z-50 transition-all duration-300 ease-out border-r",
              isDark
                ? "bg-[#050d14] border-sky-400/20 text-white shadow-[10px_0_50px_rgba(0,10,25,0.9)]"
                : "bg-white border-slate-300 text-slate-900 shadow-[10px_0_40px_rgba(0,0,0,0.18)]",
            )}
            role="dialog"
            aria-modal="true"
          >
            <div className={clsx(
              "flex items-center justify-between pb-4 mb-3 border-b shrink-0",
              isDark ? "border-sky-400/15" : "border-slate-200"
            )}>
              <span className={clsx(
                "font-outfit text-[1.4rem] font-black tracking-[0.18em] uppercase select-none",
                "bg-gradient-to-r from-teal-300 via-emerald-400 to-lime-400 bg-clip-text text-transparent",
                "drop-shadow-[0_4px_18px_rgba(52,211,153,0.6)]"
              )}>
                NIKHIL
              </span>
              <div className="flex items-center gap-2">
                <motion.button
                  type="button"
                  onClick={toggleTheme}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.88, rotate: -15 }}
                  className={clsx(
                    "relative flex h-8 w-8 items-center justify-center rounded-full border shadow-md backdrop-blur-xl transition-all duration-300 overflow-hidden",
                    isDark
                      ? "border-amber-400/40 bg-amber-400/10 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.35)]"
                      : "border-indigo-600/40 bg-indigo-500/10 text-indigo-700 shadow-[0_0_12px_rgba(99,102,241,0.25)]"
                  )}
                  aria-label="Toggle theme"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={isDark ? "dark" : "light"}
                      initial={{ rotate: -90, scale: 0.3, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      exit={{ rotate: 90, scale: 0.3, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "backOut" }}
                      className="flex items-center justify-center"
                    >
                      {isDark ? (
                        <Sun size={15} className="text-amber-300" />
                      ) : (
                        <Moon size={15} className="text-indigo-600" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={clsx(
                    "rounded-full p-2 transition",
                    isDark
                      ? "text-zinc-400 hover:text-sky-400 hover:bg-sky-400/10"
                      : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50",
                  )}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <p className={clsx(
              "text-[10px] uppercase tracking-[0.2em] font-bold mb-2.5 px-1 shrink-0",
              isDark ? "text-sky-400" : "text-emerald-700"
            )}>
              Navigation
            </p>

            <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 min-h-0">
              {NAV_LINKS.map((item) => {
                const Icon = mobileNavIconMap[item.label] || Shield;

                if (item.isDropdown) {
                  return (
                    <div key={item.label} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => setMobileExperimentsOpen((v) => !v)}
                        className={clsx(
                          "group w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold border transition-all duration-200 text-left",
                          location.pathname.startsWith("/experiments") || location.pathname.startsWith("/security")
                            ? isDark
                              ? "bg-gradient-to-r from-sky-500/20 via-teal-500/20 to-green-500/20 border-sky-400/40 text-white"
                              : "bg-emerald-500/10 border-emerald-500/40 text-emerald-900 shadow-sm"
                            : isDark
                              ? "border-transparent text-zinc-400 hover:text-white"
                              : "border-transparent text-slate-800 hover:text-slate-950",
                        )}
                      >
                        <Icon size={16} className={isDark ? "text-sky-400" : "text-emerald-600"} />
                        <span className="flex-1 tracking-wide">{item.label}</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${mobileExperimentsOpen ? "rotate-180" : ""}`} />
                      </button>

                      {mobileExperimentsOpen && (
                        <div className="pl-6 space-y-1 pt-1 pb-1">
                          {item.children.map((sub) => {
                            const SubIcon = subIconMap[sub.label] || ShieldCheck;
                            return (
                              <NavLink
                                key={sub.to}
                                to={sub.to}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) => clsx(
                                  "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold border transition-all duration-200",
                                  isActive
                                    ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                                    : isDark
                                      ? "border-transparent text-zinc-400 hover:text-white hover:bg-white/5"
                                      : "border-transparent text-slate-700 hover:text-slate-950 hover:bg-slate-100",
                                )}
                              >
                                <SubIcon size={14} className="text-emerald-400 shrink-0" />
                                <span>{sub.label}</span>
                              </NavLink>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold border transition-all duration-200",
                        isActive
                          ? isDark
                            ? "bg-gradient-to-r from-sky-500/20 via-teal-500/20 to-green-500/20 border-sky-400/40 text-white shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                            : "bg-emerald-500/10 border-emerald-500/40 text-emerald-900 shadow-sm"
                          : isDark
                            ? "border-transparent text-zinc-400 hover:text-white hover:border-sky-500/30 hover:bg-gradient-to-r hover:from-sky-500/10 hover:via-teal-500/10 hover:to-green-500/10"
                            : "border-transparent text-slate-800 hover:text-slate-950 hover:border-slate-300 hover:bg-slate-100",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={16}
                          className={clsx(
                            "transition-colors duration-200",
                            isActive
                              ? isDark ? "text-sky-400" : "text-emerald-600"
                              : isDark
                                ? "text-zinc-500 group-hover:text-sky-400"
                                : "text-slate-500 group-hover:text-emerald-700",
                          )}
                        />
                        <span className="flex-1 tracking-wide">{item.label}</span>
                        {isActive ? (
                          <span className={clsx(
                            "h-2 w-2 rounded-full",
                            isDark ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                          )} />
                        ) : (
                          <ChevronRight
                            size={14}
                            className={clsx(
                              "opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all duration-200",
                              isDark ? "text-zinc-500 group-hover:text-green-400" : "text-slate-400 group-hover:text-emerald-600"
                            )}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>

            <div className={clsx(
              "mt-auto space-y-2.5 pt-4 border-t shrink-0",
              isDark ? "border-sky-400/15" : "border-slate-200"
            )}>
              <a
                href={QUICK_CONTACT.resume}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 py-3 text-xs font-black uppercase tracking-wider text-black shadow-[0_4px_18px_rgba(34,197,94,0.35)] hover:shadow-[0_6px_24px_rgba(34,197,94,0.5)] transition-all duration-300"
                aria-label="View Resume"
              >
                <Download size={14} />
                View Resume
              </a>

              <p className="text-[10px] text-center text-slate-500 dark:text-zinc-500 font-medium pt-0.5">
                Made with 💚 by Nikhil
              </p>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
};

export default Navbar;
