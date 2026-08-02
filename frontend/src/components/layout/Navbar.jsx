import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SearchModal from "@/components/layout/SearchModal";
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
  FlaskConical,
  Folder,
  GitBranch,
  GraduationCap,
  Home,
  LayoutDashboard,
  Mail,
  Menu,
  Milestone,
  Moon,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Sun,
  SunMedium,
  Terminal,
  User,
  UserCheck,
  Workflow,
  Wrench,
  X,
  LogIn,
  LogOut,
  Receipt,
} from "lucide-react";
import { useUserAuth } from "@/context/UserAuthContext";
import { NAV_LINKS, QUICK_CONTACT, SITE_PROFILE } from "@/constants/siteData";
import { useTheme } from "@/context/ThemeContext";
import UserAvatar from "@/components/ui/UserAvatar";

const NAV_OFFSET_REM = 6;
const OPPORTUNITY_BANNER_HEIGHT_REM = 2.25;

const mobileNavIconMap = {
  "My Dashboard": LayoutDashboard,
  Home: LayoutDashboard,
  About: User,
  Skills: Cpu,
  Projects: Folder,
  Experiments: FlaskConical,
  Journey: Milestone,
  Blog: BookOpen,
  Services: Briefcase,
  Contact: Mail,
};

const subIconMap = {
  "Main Dashboard": LayoutDashboard,
  "Recruiter Dashboard": UserCheck,
  "Resume Dashboard": FileText,
  "How I Build": Workflow,
  "Security Labs": ShieldCheck,
  "Dev Terminal": Terminal,
  "Data Structure Lab": Cpu,
  "Cyber Tools": Search,
  "Document Methodology": FileText,
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showOpportunityBanner, setShowOpportunityBanner] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return sessionStorage.getItem("opportunity_banner_dismissed") !== "true";
    } catch {
      return true;
    }
  });
  const { isDark, toggleTheme } = useTheme();
  const { user, logout, openSignInModal, openProfileModal } = useUserAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);
  const [experimentsOpen, setExperimentsOpen] = useState(false);
  const experimentsRef = useRef(null);
  const experimentsTimeoutRef = useRef(null);

  const [mobileDropdowns, setMobileDropdowns] = useState({});

  const location = useLocation();

  const handleExperimentsMouseEnter = () => {
    if (experimentsTimeoutRef.current) clearTimeout(experimentsTimeoutRef.current);
    setExperimentsOpen(true);
  };
  const handleExperimentsMouseLeave = () => {
    experimentsTimeoutRef.current = setTimeout(() => setExperimentsOpen(false), 180);
  };

  const toggleMobileDropdown = (label) => {
    setMobileDropdowns((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (experimentsRef.current && !experimentsRef.current.contains(e.target)) {
        setExperimentsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      if (experimentsTimeoutRef.current) clearTimeout(experimentsTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ctrl+K / Cmd+K global shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
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
    try {
      sessionStorage.setItem("opportunity_banner_dismissed", "true");
    } catch {
      // ignore
    }
  };

  const navItemClass = ({ isActive }) =>
    clsx(
      "group relative inline-flex items-center gap-1 rounded-full px-3 2xl:px-4 py-1.5 font-outfit text-[13.5px] 2xl:text-sm font-semibold transition-all duration-300 select-none shrink-0",
      isActive
        ? "bg-lime-400 text-slate-950 font-extrabold shadow-[0_0_18px_rgba(163,230,53,0.65)]"
        : isDark
          ? "text-zinc-200 hover:text-white hover:bg-white/[0.08]"
          : "text-slate-700 hover:text-slate-950 hover:bg-black/[0.05]",
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
        isScrolled ? "pt-4 px-[2%]" : "pt-0"
      )}>
        <div
          className={clsx(
            "mx-auto transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] backdrop-blur-xl border-b",
            isScrolled
              ? isDark
                ? "w-full max-w-[90rem] rounded-full px-4 2xl:px-6 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.35)] border-white/[0.06] bg-zinc-950/20"
                : "w-full max-w-[90rem] rounded-full px-4 2xl:px-6 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border-zinc-900/[0.06] bg-white/20"
              : isDark
                ? "w-full max-w-none rounded-none px-6 sm:px-12 lg:px-16 py-3.5 shadow-none border-transparent bg-transparent"
                : "w-full max-w-none rounded-none px-6 sm:px-12 lg:px-16 py-3.5 shadow-none border-zinc-200/40 bg-white/60"
          )}
        >
            <div className={clsx(
              "relative flex items-center justify-between transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
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

              {/* Logo — CENTERED on mobile via absolute, LEFT on desktop */}
              <div className="absolute left-1/2 -translate-x-1/2 xl:static xl:translate-x-0 xl:mr-6 xl:order-first">
                <Link
                  to="/"
                  onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="group flex items-center shrink-0"
                >
                  <span
                    id="navbar-logo-text"
                    className={clsx(
                      "font-outfit text-[1.4rem] sm:text-[1.6rem] font-black tracking-[0.16em] uppercase select-none transition-all duration-300",
                      "bg-gradient-to-r from-teal-300 via-emerald-400 to-lime-400 bg-clip-text text-transparent",
                      "drop-shadow-[0_4px_22px_rgba(52,211,153,0.65)] group-hover:drop-shadow-[0_6px_30px_rgba(52,211,153,0.9)] group-hover:scale-[1.03]",
                      "inline-block"
                    )}
                  >
                    NIKHIL
                  </span>
                </Link>
              </div>

              {/* Mobile right — Search button */}
              <div className="ml-auto flex items-center gap-1 xl:hidden">
                <button
                  type="button"
                  onClick={openSearch}
                  aria-label="Open search"
                  className={clsx(
                    "flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-200",
                    isDark
                      ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20 hover:border-cyan-400/60"
                      : "border-sky-500/30 bg-sky-50 text-sky-600 hover:bg-sky-100 hover:border-sky-400",
                  )}
                >
                  <Search size={15} />
                </button>
              </div>

              <nav className="hidden items-center gap-1 xl:flex justify-center flex-1">
                {NAV_LINKS.map((item) => {
                  if (item.isDropdown) {
                    const isDropdownOpen = experimentsOpen;
                    const setDropdownOpen = setExperimentsOpen;
                    const dropdownRef = experimentsRef;
                    const mouseEnterHandler = handleExperimentsMouseEnter;
                    const mouseLeaveHandler = handleExperimentsMouseLeave;

                    const isParentActive =
                      location.pathname.startsWith("/experiments") ||
                      location.pathname.startsWith("/security") ||
                      location.pathname.startsWith("/terminal") ||
                      location.pathname.startsWith("/cyber-tools") ||
                      location.pathname.startsWith("/dsa") ||
                      location.pathname.startsWith("/methodology");

                    return (
                      <div
                        key={item.label}
                        ref={dropdownRef}
                        className="relative"
                        onMouseEnter={mouseEnterHandler}
                        onMouseLeave={mouseLeaveHandler}
                      >
                        <NavLink
                          to={item.to || "/"}
                          className={clsx(
                            "group relative inline-flex items-center gap-1 rounded-full px-3 2xl:px-4 py-1.5 font-outfit text-[13.5px] 2xl:text-sm font-semibold transition-all duration-300 select-none shrink-0",
                            isParentActive
                              ? "bg-lime-400 text-slate-950 font-extrabold shadow-[0_0_18px_rgba(163,230,53,0.65)]"
                              : isDark
                                ? "text-zinc-200 hover:text-white hover:bg-white/[0.08]"
                                : "text-slate-700 hover:text-slate-950 hover:bg-black/[0.05]",
                          )}
                        >
                          <span className="relative z-10 flex items-center gap-1">
                            {item.label}
                            <ChevronDown size={13} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                          </span>
                        </NavLink>

                        {isDropdownOpen && (
                          <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2.5 w-[330px] z-50">
                            <div className="rounded-3xl border border-slate-200/90 dark:border-emerald-500/30 bg-white/98 dark:bg-[#030d07]/95 text-slate-900 dark:text-white shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_50px_rgba(0,10,2,0.9)] backdrop-blur-2xl transition-all duration-300 animate-fadeIn ring-1 ring-black/5 dark:ring-transparent">
                              <div className="px-3 py-1.5 font-mono text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-widest border-b border-slate-200/60 dark:border-emerald-500/20 mb-2">
                                // {item.label.toUpperCase()}
                              </div>
                              <div className="space-y-1">
                                {item.children.map((sub) => {
                                  const SubIcon = subIconMap[sub.label] || ShieldCheck;
                                  return (
                                    <NavLink
                                      key={sub.to}
                                      to={sub.to}
                                      onClick={() => setDropdownOpen(false)}
                                      className={({ isActive }) => clsx(
                                        "group/sub flex items-center justify-between gap-3 rounded-2xl p-2.5 sm:p-3 transition-all duration-300 ease-out border font-outfit",
                                        isActive
                                          ? "bg-emerald-50 dark:bg-emerald-500/15 border-emerald-400/50 dark:border-emerald-500/40 text-emerald-950 dark:text-emerald-300 font-extrabold shadow-sm dark:shadow-[0_0_20px_rgba(52,211,153,0.25)]"
                                          : "border-transparent text-slate-800 dark:text-slate-200/90 hover:bg-emerald-50/70 dark:hover:bg-white/[0.08] hover:border-emerald-300/40 dark:hover:border-emerald-500/30 hover:text-slate-950 dark:hover:text-white",
                                      )}
                                    >
                                      <div className="flex items-center gap-3">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover/sub:scale-110 group-hover/sub:bg-emerald-500 group-hover/sub:text-white dark:group-hover/sub:text-black transition-all duration-300 shadow-sm">
                                          <SubIcon size={16} />
                                        </span>
                                        <span className="text-xs sm:text-sm font-extrabold tracking-wide text-slate-900 dark:text-slate-100">
                                          {sub.label}
                                        </span>
                                      </div>

                                      <ChevronRight
                                        size={15}
                                        className="text-slate-400 dark:text-slate-500 opacity-0 -translate-x-2 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 group-hover/sub:text-emerald-500 dark:group-hover/sub:text-emerald-400 transition-all duration-200 shrink-0"
                                      />
                                    </NavLink>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <NavLink key={item.to} to={item.to} className={navItemClass}>
                      <span className="relative z-10">{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <div className={clsx("hidden items-center xl:flex shrink-0", isScrolled ? "gap-1.5 2xl:gap-2 ml-2" : "gap-1.5 2xl:gap-3 ml-2 2xl:ml-6")}>
                {/* Desktop Search Button */}
                <button
                  type="button"
                  onClick={openSearch}
                  aria-label="Open search (Ctrl+K)"
                  title="Search (Ctrl+K)"
                  className={clsx(
                    "flex items-center gap-2 rounded-full border px-2.5 2xl:px-3 py-1.5 text-xs font-medium transition-all duration-200 shrink-0",
                    isDark
                      ? "border-slate-700 bg-slate-800/60 text-slate-400 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300"
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:border-sky-400/40 hover:bg-sky-50 hover:text-sky-700",
                  )}
                >
                  <Search size={13} />
                  <span className="hidden 2xl:inline">Search</span>
                </button>
                <motion.button
                  type="button"
                  onClick={toggleTheme}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.88, rotate: -15 }}
                  className={clsx(
                    "relative flex h-8 w-8 2xl:h-9 2xl:w-9 items-center justify-center rounded-full border shadow-lg backdrop-blur-xl transition-all duration-300 overflow-hidden group shrink-0",
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
                        <Sun size={16} className="text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                      ) : (
                        <Moon size={16} className="text-indigo-600 drop-shadow-[0_0_6px_rgba(99,102,241,0.6)]" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>

                {/* User Auth Controls */}
                {user ? (
                  <div className="relative shrink-0" ref={userMenuRef}>
                    <button
                      type="button"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 p-1 pr-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 hover:border-emerald-500 transition shadow-sm"
                    >
                      <UserAvatar user={user} className="h-7 w-7 text-xs" />
                      <span className="hidden xl:inline-block max-w-[65px] 2xl:max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2 shadow-2xl z-50">
                        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                            <span className="text-emerald-500 font-bold">G</span> {user.email}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            openProfileModal();
                          }}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
                        >
                          <User size={14} className="text-emerald-500" /> My Profile
                        </button>
                        <Link
                          to="/receipt-portal"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
                        >
                          <Receipt size={14} /> My Receipts
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition"
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : null}

                <a
                  href={QUICK_CONTACT.resumeFullStack}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-400/60 bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-green-500/15 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.35)] hover:border-emerald-300 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-lime-400 hover:text-slate-950 hover:shadow-[0_0_30px_rgba(52,211,153,0.65)] hover:scale-[1.04] transition-all duration-300 ease-out"
                  aria-label="Download Full Stack Resume"
                >
                  <Download size={14} />
                  Resume
                </a>
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
              <Link
                to="/"
                onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="group"
              >
                <span className={clsx(
                  "font-outfit text-[1.4rem] font-black tracking-[0.18em] uppercase select-none",
                  "bg-gradient-to-r from-teal-300 via-emerald-400 to-lime-400 bg-clip-text text-transparent",
                  "drop-shadow-[0_4px_18px_rgba(52,211,153,0.6)] group-hover:drop-shadow-[0_4px_24px_rgba(52,211,153,0.9)]"
                )}>
                  NIKHIL
                </span>
              </Link>
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
                  const isOpen = Boolean(mobileDropdowns[item.label]);

                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex items-center gap-1">
                        <NavLink
                          to={item.to || "/"}
                          onClick={() => setOpen(false)}
                          className={({ isActive }) => clsx(
                            "group flex-1 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold border transition-all duration-200",
                            isActive
                              ? isDark
                                ? "bg-gradient-to-r from-sky-500/20 via-teal-500/20 to-green-500/20 border-sky-400/40 text-white shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                                : "bg-emerald-500/10 border-emerald-500/40 text-emerald-900 shadow-sm"
                              : isDark
                                ? "border-transparent text-zinc-400 hover:text-white hover:border-sky-500/30"
                                : "border-transparent text-slate-800 hover:text-slate-950 hover:border-slate-300",
                          )}
                        >
                          <Icon size={16} className={isDark ? "text-sky-400" : "text-emerald-600"} />
                          <span className="flex-1 tracking-wide">{item.label}</span>
                        </NavLink>
                        <button
                          type="button"
                          onClick={() => toggleMobileDropdown(item.label)}
                          className={clsx(
                            "p-2.5 rounded-xl border transition-all duration-200",
                            isDark
                              ? "border-transparent text-zinc-400 hover:text-white"
                              : "border-transparent text-slate-700 hover:text-slate-950"
                          )}
                          aria-label={`Toggle ${item.label} sub-menu`}
                        >
                          <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                      </div>

                      {isOpen && (
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
                                      ? "border-transparent text-zinc-400 hover:text-white"
                                      : "border-transparent text-slate-700 hover:text-slate-950",
                                )}
                              >
                                <SubIcon size={14} className="text-emerald-500 shrink-0" />
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
              {/* Google Sign-In — only when not logged in */}
              {!user && (
                <button
                  type="button"
                  onClick={() => { openSignInModal(); setOpen(false); }}
                  className={clsx(
                    "flex w-full items-center justify-center gap-2.5 rounded-xl border py-2.5 text-xs font-bold transition-all duration-200",
                    isDark
                      ? "border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20"
                      : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-300",
                  )}
                  aria-label="Sign in with Google"
                >
                  {/* Google G icon */}
                  <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </button>
              )}

              {/* User Profile Card on Mobile */}
              {user ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} className="h-9 w-9 text-sm font-black" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                        <span className="text-emerald-500 font-bold">G</span> {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2 pt-2 border-t border-emerald-500/20">
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        openProfileModal();
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 py-2 text-xs font-bold text-slate-800 dark:text-slate-200"
                    >
                      <User size={13} className="text-emerald-500" /> Profile
                    </button>
                    <Link
                      to="/receipt-portal"
                      onClick={() => setOpen(false)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 py-2 text-xs font-bold text-slate-800 dark:text-slate-200"
                    >
                      <Receipt size={13} /> Receipts
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="flex items-center justify-center gap-1 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400"
                    >
                      <LogOut size={13} /> Sign Out
                    </button>
                  </div>
                </div>
              ) : null}

              <a
                href={QUICK_CONTACT.resumeFullStack}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 py-3 text-xs font-black uppercase tracking-wider text-black shadow-[0_4px_18px_rgba(34,197,94,0.35)] hover:shadow-[0_6px_24px_rgba(34,197,94,0.5)] transition-all duration-300"
                aria-label="Download Full Stack Resume"
              >
                <Download size={14} />
                Download Resume
              </a>

              <p className="text-[10px] text-center text-slate-500 dark:text-zinc-500 font-medium pt-0.5">
                Made with 💚 by Nikhil
              </p>
            </div>
          </aside>
        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
    </header>
  );
};

export default Navbar;

