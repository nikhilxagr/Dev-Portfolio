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
  Cpu,
  Download,
  FileText,
  FlaskConical,
  Folder,
  LayoutDashboard,
  Mail,
  Menu,
  Milestone,
  Moon,
  Network,
  Search,
  Shield,
  ShieldCheck,
  Sun,
  Terminal,
  User,
  UserCheck,
  Workflow,
  X,
  LogOut,
  Receipt,
  Edit3,
} from "lucide-react";
import { useUserAuth } from "@/context/UserAuthContext";
import { NAV_LINKS, QUICK_CONTACT } from "@/constants/siteData";
import { useTheme } from "@/context/ThemeContext";
import UserAvatar from "@/components/ui/UserAvatar";
import { prefetchRoute } from "@/utils/prefetchRoute";

const MotionDiv = motion.div;
const MotionAside = motion.aside;

const NAV_OFFSET_REM = 4;
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
  "System Design Analysis": Network,
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
      "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 select-none shrink-0",
      isActive
        ? "border border-black/[0.08] bg-slate-100 text-slate-950 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#eef0f5]"
        : "border border-transparent text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-[#a3a9b8] dark:hover:bg-white/[0.05] dark:hover:text-[#eef0f5]",
    );

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {showOpportunityBanner ? (
        <div
          className={clsx(
            "opportunity-banner-shell relative border-b",
            isDark
              ? "border-white/[0.08] bg-[#0b0d14]"
              : "border-black/[0.08] bg-slate-50",
          )}
        >
          <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
            <div className="flex min-w-0 items-center gap-2 text-xs">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              <span className="truncate font-medium text-slate-800 dark:text-[#eef0f5]">
                Open to opportunities
              </span>
              <span className="hidden truncate text-slate-500 dark:text-[#7a8296] sm:inline">
                Internships, freelance and collaborations
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-emerald-700 transition-colors duration-150 hover:bg-emerald-500/10 dark:text-emerald-400"
              >
                Let&apos;s talk
                <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
              <button
                type="button"
                onClick={closeOpportunityBanner}
                aria-label="Close opportunities banner"
                className="rounded-md p-1 text-slate-500 transition-colors duration-150 hover:bg-slate-200/70 hover:text-slate-900 dark:text-[#7a8296] dark:hover:bg-white/[0.06] dark:hover:text-[#eef0f5]"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div
        className={clsx(
          "w-full border-b transition-colors duration-150",
          isDark
            ? "border-white/[0.08] bg-[#090a0f]/95"
            : "border-black/[0.08] bg-white/95",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
          {/* Hamburger Button — Mobile */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/[0.08] bg-slate-50 text-slate-700 transition-colors duration-150 hover:bg-slate-100 xl:hidden dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8] dark:hover:bg-[#1a1e28] dark:hover:text-[#eef0f5]"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
          </button>

          {/* Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 xl:static xl:mr-6 xl:translate-x-0">
            <Link
              to="/"
              onClick={() => {
                setOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center shrink-0"
            >
              <span
                id="navbar-logo-text"
                className="font-display text-lg font-medium tracking-[-0.01em] text-slate-900 select-none dark:text-[#eef0f5]"
              >
                Nikhil
              </span>
            </Link>
          </div>

          {/* Mobile right controls */}
          <div className="ml-auto flex items-center gap-2 xl:hidden">
            {user ? (
              <button
                type="button"
                onClick={openProfileModal}
                aria-label="Open user profile"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.08] bg-slate-50 dark:border-white/[0.08] dark:bg-[#11141c]"
              >
                <UserAvatar user={user} className="h-6 w-6 text-xs" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  openSignInModal({
                    title: "Sign in with Google",
                    subtitle: "Sign in or sign up with your Google account.",
                  })
                }
                aria-label="Sign in with Google"
                title="Sign in with Google"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/[0.08] bg-slate-50 text-slate-700 transition-colors duration-150 hover:bg-slate-100 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8] dark:hover:bg-[#1a1e28] dark:hover:text-[#eef0f5]"
              >
                <User size={16} strokeWidth={1.5} />
              </button>
            )}
            <button
              type="button"
              onClick={openSearch}
              aria-label="Open search"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.08] bg-slate-50 text-slate-700 transition-colors duration-150 hover:bg-slate-100 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8] dark:hover:bg-[#1a1e28] dark:hover:text-[#eef0f5]"
            >
              <Search size={16} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="hidden h-9 w-9 items-center justify-center rounded-lg border border-black/[0.08] bg-slate-50 text-slate-700 transition-colors duration-150 hover:bg-slate-100 sm:flex dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8] dark:hover:bg-[#1a1e28] dark:hover:text-[#eef0f5]"
              aria-label="Toggle theme"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex">
            {NAV_LINKS.map((item) => {
              if (item.isDropdown) {
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
                    ref={experimentsRef}
                    className="relative"
                    onMouseEnter={handleExperimentsMouseEnter}
                    onMouseLeave={handleExperimentsMouseLeave}
                  >
                    <NavLink
                      to={item.to || "/"}
                      className={clsx(
                        "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 select-none shrink-0",
                        isParentActive
                          ? "border border-black/[0.08] bg-slate-100 text-slate-950 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#eef0f5]"
                          : "border border-transparent text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-[#a3a9b8] dark:hover:bg-white/[0.05] dark:hover:text-[#eef0f5]",
                      )}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        size={14}
                        strokeWidth={1.5}
                        className={`transition-transform duration-150 ${experimentsOpen ? "rotate-180" : ""}`}
                      />
                    </NavLink>

                    {experimentsOpen && (
                      <div className="absolute left-1/2 top-full z-[9999] w-80 -translate-x-1/2 pt-2">
                        <div className="rounded-xl border border-black/[0.08] bg-white p-2 text-slate-900 shadow-lg dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#eef0f5] dark:shadow-none">
                          <div className="mb-1 border-b border-black/[0.06] px-3 py-2 font-mono text-xs text-slate-500 dark:border-white/[0.08] dark:text-[#7a8296]">
                            {item.label}
                          </div>
                          <div className="space-y-1">
                            {item.children.map((sub) => {
                              const SubIcon = subIconMap[sub.label] || ShieldCheck;
                              return (
                                <NavLink
                                  key={sub.to}
                                  to={sub.to}
                                  onClick={() => setExperimentsOpen(false)}
                                  className={({ isActive }) =>
                                    clsx(
                                      "group/sub flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm transition-colors duration-150",
                                      isActive
                                        ? "border-black/[0.08] bg-slate-100 font-medium text-slate-950 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#eef0f5]"
                                        : "border-transparent text-slate-700 hover:bg-slate-50 hover:text-slate-950 dark:text-[#a3a9b8] dark:hover:bg-white/[0.04] dark:hover:text-[#eef0f5]",
                                    )
                                  }
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-black/[0.08] bg-slate-50 text-slate-500 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#7a8296]">
                                      <SubIcon size={16} strokeWidth={1.5} />
                                    </span>
                                    <span className="text-sm font-medium">{sub.label}</span>
                                  </div>
                                  <ChevronRight
                                    size={14}
                                    strokeWidth={1.5}
                                    className="shrink-0 text-slate-400 opacity-0 transition-opacity duration-150 group-hover/sub:opacity-100 dark:text-[#7a8296]"
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
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={navItemClass}
                  onMouseEnter={() => prefetchRoute(item.to)}
                  onFocus={() => prefetchRoute(item.to)}
                >
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop Right Controls */}
          <div className="hidden shrink-0 items-center gap-2 xl:flex">
            {user ? (
              <div className="relative shrink-0" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={clsx(
                    "flex h-9 items-center gap-2 rounded-lg border px-2.5 text-sm font-medium transition-colors duration-150",
                    userMenuOpen
                      ? "border-slate-300 bg-slate-100 text-slate-950 dark:border-white/[0.16] dark:bg-[#1a1e28] dark:text-[#eef0f5]"
                      : "border-black/[0.08] bg-slate-50 text-slate-800 hover:bg-slate-100 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#eef0f5] dark:hover:bg-[#1a1e28]",
                  )}
                  aria-label="User profile menu"
                  aria-expanded={userMenuOpen}
                >
                  <UserAvatar user={user} className="h-6 w-6 text-xs" />
                  <span className="max-w-[96px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    strokeWidth={1.5}
                    className={clsx(
                      "text-slate-400 transition-transform duration-150 dark:text-[#7a8296]",
                      userMenuOpen && "rotate-180",
                    )}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-black/[0.08] bg-white p-2 text-slate-900 shadow-lg dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#eef0f5] dark:shadow-none"
                    >
                      <div className="mb-1.5 flex items-center gap-2.5 rounded-lg border border-black/[0.06] bg-slate-50 p-2 dark:border-white/[0.06] dark:bg-[#1a1e28]">
                        <UserAvatar user={user} className="h-8 w-8 shrink-0 text-xs" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
                              {user.name}
                            </p>
                            <span className="shrink-0 font-mono text-xs text-emerald-700 dark:text-emerald-400">
                              Active
                            </span>
                          </div>
                          <p className="truncate text-xs text-slate-500 dark:text-[#7a8296]">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors duration-150 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                        >
                          <div className="flex items-center gap-2.5">
                            <User size={16} strokeWidth={1.5} className="text-slate-500 dark:text-[#7a8296]" />
                            <span>Profile &amp; Activity</span>
                          </div>
                          <ChevronRight size={14} strokeWidth={1.5} className="text-slate-400 dark:text-[#7a8296]" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            openProfileModal();
                          }}
                          className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition-colors duration-150 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                        >
                          <div className="flex items-center gap-2.5">
                            <Edit3 size={16} strokeWidth={1.5} className="text-slate-500 dark:text-[#7a8296]" />
                            <span>Edit Profile</span>
                          </div>
                          <ChevronRight size={14} strokeWidth={1.5} className="text-slate-400 dark:text-[#7a8296]" />
                        </button>

                        <Link
                          to="/receipts"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors duration-150 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                        >
                          <div className="flex items-center gap-2.5">
                            <Receipt size={16} strokeWidth={1.5} className="text-slate-500 dark:text-[#7a8296]" />
                            <span>My Receipts</span>
                          </div>
                          <ChevronRight size={14} strokeWidth={1.5} className="text-slate-400 dark:text-[#7a8296]" />
                        </Link>

                        <div className="my-1 border-t border-black/[0.06] dark:border-white/[0.06]" />

                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm text-rose-600 transition-colors duration-150 hover:bg-rose-500/10 dark:text-rose-400"
                        >
                          <div className="flex items-center gap-2.5">
                            <LogOut size={16} strokeWidth={1.5} />
                            <span>Sign Out</span>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  openSignInModal({
                    title: "Sign in with Google",
                    subtitle: "Sign in or sign up with your Google account to access your receipts, bookings, and profile.",
                  })
                }
                aria-label="Sign in with Google"
                title="Sign in with Google"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/[0.08] bg-slate-50 text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8] dark:hover:bg-[#1a1e28] dark:hover:text-[#eef0f5]"
              >
                <User size={16} strokeWidth={1.5} />
              </button>
            )}

            <button
              type="button"
              onClick={openSearch}
              aria-label="Open search (Ctrl+K)"
              title="Search (Ctrl+K)"
              className="flex h-9 shrink-0 items-center gap-2 rounded-lg border border-black/[0.08] bg-slate-50 px-3 text-sm text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8] dark:hover:bg-[#1a1e28] dark:hover:text-[#eef0f5]"
            >
              <Search size={16} strokeWidth={1.5} />
              <span className="hidden 2xl:inline">Search</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/[0.08] bg-slate-50 text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8] dark:hover:bg-[#1a1e28] dark:hover:text-[#eef0f5]"
              aria-label="Toggle theme"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
            </button>

            <a
              href={QUICK_CONTACT.resumeFullStack}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition-colors duration-150 hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
              aria-label="Download Full Stack Resume"
            >
              <Download size={16} strokeWidth={1.5} />
              Resume
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 xl:hidden">
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/60 cursor-pointer"
              aria-hidden="true"
            />

            <MotionAside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className={clsx(
                "relative z-50 flex h-full max-h-screen w-72 flex-col overflow-y-auto border-r p-5",
                isDark
                  ? "border-white/[0.08] bg-[#0b0d14] text-[#eef0f5]"
                  : "border-black/[0.08] bg-white text-slate-900",
              )}
              role="dialog"
              aria-modal="true"
            >
              <div className="mb-4 flex shrink-0 items-center justify-between border-b border-black/[0.08] pb-4 dark:border-white/[0.08]">
                <Link
                  to="/"
                  onClick={() => {
                    setOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <span className="font-display text-lg font-medium tracking-[-0.01em] text-slate-900 select-none dark:text-[#eef0f5]">
                    Nikhil
                  </span>
                </Link>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.08] bg-slate-50 text-slate-600 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8]"
                    aria-label="Toggle theme"
                  >
                    {isDark ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-[#7a8296] dark:hover:bg-white/[0.06]"
                    aria-label="Close menu"
                  >
                    <X size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              <p className="mb-2 px-1 font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                Navigation
              </p>

              <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
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
                            className={({ isActive }) =>
                              clsx(
                                "flex flex-1 items-center gap-2.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-150",
                                isActive
                                  ? "border-black/[0.08] bg-slate-100 text-slate-950 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#eef0f5]"
                                  : "border-transparent text-slate-600 hover:bg-slate-50 dark:text-[#a3a9b8] dark:hover:bg-white/[0.04]",
                              )
                            }
                          >
                            <Icon size={16} strokeWidth={1.5} className="text-slate-500 dark:text-[#7a8296]" />
                            <span className="flex-1">{item.label}</span>
                          </NavLink>
                          <button
                            type="button"
                            onClick={() => toggleMobileDropdown(item.label)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-[#7a8296] dark:hover:bg-white/[0.04]"
                            aria-label={`Toggle ${item.label} sub-menu`}
                          >
                            <ChevronDown
                              size={16}
                              strokeWidth={1.5}
                              className={`transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                        </div>

                        {isOpen && (
                          <div className="space-y-1 pb-1 pl-6 pt-1">
                            {item.children.map((sub) => {
                              const SubIcon = subIconMap[sub.label] || ShieldCheck;
                              return (
                                <NavLink
                                  key={sub.to}
                                  to={sub.to}
                                  onClick={() => setOpen(false)}
                                  className={({ isActive }) =>
                                    clsx(
                                      "flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors duration-150",
                                      isActive
                                        ? "border-black/[0.08] bg-slate-100 font-medium text-slate-950 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#eef0f5]"
                                        : "border-transparent text-slate-600 hover:text-slate-950 dark:text-[#a3a9b8] dark:hover:text-[#eef0f5]",
                                    )
                                  }
                                >
                                  <SubIcon size={16} strokeWidth={1.5} className="shrink-0 text-slate-500 dark:text-[#7a8296]" />
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
                          "flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-150",
                          isActive
                            ? "border-black/[0.08] bg-slate-100 text-slate-950 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#eef0f5]"
                            : "border-transparent text-slate-600 hover:bg-slate-50 dark:text-[#a3a9b8] dark:hover:bg-white/[0.04]",
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            size={16}
                            strokeWidth={1.5}
                            className={clsx(
                              isActive
                                ? "text-emerald-700 dark:text-emerald-400"
                                : "text-slate-500 dark:text-[#7a8296]",
                            )}
                          />
                          <span className="flex-1">{item.label}</span>
                          {isActive ? (
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                          ) : null}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>

              <div className="mt-auto shrink-0 space-y-2.5 border-t border-black/[0.08] pt-4 dark:border-white/[0.08]">
                {!user && (
                  <button
                    type="button"
                    onClick={() => {
                      openSignInModal();
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-black/[0.08] bg-slate-50 py-2.5 text-sm font-medium text-slate-800 transition-colors duration-150 hover:bg-slate-100 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#eef0f5] dark:hover:bg-[#1a1e28]"
                    aria-label="Sign in with Google"
                  >
                    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
                      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                    </svg>
                    Sign in with Google
                  </button>
                )}

                {user ? (
                  <div className="space-y-3 rounded-xl border border-black/[0.08] bg-slate-50 p-3 dark:border-white/[0.08] dark:bg-[#11141c]">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={user} className="h-9 w-9 text-sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-[#7a8296]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-t border-black/[0.06] pt-2 dark:border-white/[0.06]">
                      <Link
                        to="/profile"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-black/[0.08] bg-white py-2 text-xs font-medium text-slate-800 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#eef0f5]"
                      >
                        <User size={14} strokeWidth={1.5} /> Profile
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          openProfileModal();
                        }}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-black/[0.08] bg-white py-2 text-xs font-medium text-slate-800 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#eef0f5]"
                      >
                        <Edit3 size={14} strokeWidth={1.5} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setOpen(false);
                        }}
                        className="flex items-center justify-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 py-2 text-xs font-medium text-rose-600 dark:text-rose-400"
                      >
                        <LogOut size={14} strokeWidth={1.5} /> Exit
                      </button>
                    </div>
                  </div>
                ) : null}

                <a
                  href={QUICK_CONTACT.resumeFullStack}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                  aria-label="Download Full Stack Resume"
                >
                  <Download size={16} strokeWidth={1.5} />
                  Download Resume
                </a>
              </div>
            </MotionAside>
          </div>
        )}
      </AnimatePresence>

      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
    </header>
  );
};

export default Navbar;
