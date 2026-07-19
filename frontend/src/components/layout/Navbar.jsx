import { useEffect, useState } from "react";
import clsx from "clsx";
import { Link, NavLink } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  ChevronRight,
  Download,
  Folder,
  GitBranch,
  Home,
  Mail,
  Menu,
  Moon,
  Shield,
  ShieldCheck,
  Sparkles,
  SunMedium,
  ToggleLeft,
  ToggleRight,
  User,
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
  Journey: GitBranch,
  Projects: Folder,
  Practicals: ShieldCheck,
  Blog: BookOpen,
  Services: Briefcase,
  Contact: Mail,
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showOpportunityBanner, setShowOpportunityBanner] = useState(true);
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

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

    return () => {
      document.body.style.overflow = previousOverflow;
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
              : "w-full max-w-none rounded-none px-6 sm:px-12 lg:px-16 py-3.5 shadow-none border-transparent bg-transparent"
          )}
        >
            <div className={clsx(
              "flex items-center justify-between transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
              isScrolled ? "h-11" : "h-14"
            )}>
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="group flex items-center gap-2 mr-6 xl:mr-10 shrink-0"
              >
                <span className="font-outfit text-[15px] font-black tracking-[0.25em] text-white uppercase transition-all duration-300 group-hover:text-lime-300 group-hover:[text-shadow:0_0_12px_rgba(163,230,53,0.65)] inline-block">
                  NIKHIL
                </span>
              </Link>

              <nav className="hidden items-center gap-1 xl:flex justify-center flex-1">
                {NAV_LINKS.map((item) => (
                  <NavLink key={item.to} to={item.to} className={navItemClass}>
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="hidden items-center gap-3 xl:flex shrink-0 ml-6 xl:ml-10">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={clsx(
                    "rounded-full p-2 transition",
                    isDark
                      ? "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-black/5",
                  )}
                  aria-label="Toggle theme"
                  title="Toggle dark or light mode"
                >
                  {isDark ? <SunMedium size={16} /> : <Moon size={16} />}
                </button>

                <a
                  href={QUICK_CONTACT.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/45 bg-zinc-950 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.15)] hover:border-lime-400 hover:bg-lime-400 hover:text-black hover:shadow-[0_0_20px_rgba(163,230,53,0.45)] transition-all duration-300 ease-out"
                  aria-label="Open resume"
                >
                  <Download size={11} />
                  Resume
                </a>
              </div>

              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className={clsx(
                  "rounded-full p-2 transition xl:hidden",
                  isDark
                    ? "text-zinc-300 hover:bg-white/5"
                    : "text-zinc-700 hover:bg-black/5",
                )}
                aria-label="Toggle menu"
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

      {open && (
        <div className="fixed inset-0 z-40 xl:hidden">
          <button
            type="button"
            aria-label="Close menu overlay"
            onClick={() => setOpen(false)}
            className={clsx(
              "absolute inset-0 backdrop-blur-sm",
              isDark ? "bg-slate-950/70" : "bg-slate-900/35",
            )}
          />

          <aside
            className={clsx(
              "absolute right-0 top-0 flex h-screen w-[min(82vw,290px)] flex-col p-6 z-50 transition-all duration-300 ease-out",
              isDark
                ? "bg-zinc-950/98 backdrop-blur-xl text-white shadow-[-10px_0_40px_rgba(0,0,0,0.8)]"
                : "bg-white/98 backdrop-blur-xl text-zinc-900 shadow-[-10px_0_30px_rgba(0,0,0,0.06)]",
            )}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-4">
              <span className="font-outfit text-base font-black tracking-[0.25em] text-white uppercase">
                NIKHIL
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={clsx(
                  "rounded-full p-2 transition",
                  isDark
                    ? "text-zinc-400 hover:text-white hover:bg-white/5"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-black/5",
                )}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-3 px-2">
              Navigation
            </p>

            <div className="space-y-1 overflow-y-auto pr-1 flex-1">
              {NAV_LINKS.map((item) => {
                const Icon = mobileNavIconMap[item.label] || Shield;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        "group flex items-center gap-3 rounded-full px-4 py-3 text-xs font-bold transition-all duration-300",
                        isActive
                          ? "bg-lime-400 text-black shadow-[0_4px_16px_rgba(163,230,53,0.35)]"
                          : isDark
                            ? "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                            : "text-zinc-600 hover:text-zinc-950 hover:bg-black/[0.04]",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={15}
                          className={clsx(
                            isActive
                              ? "text-black"
                              : isDark
                                ? "text-zinc-500 group-hover:text-zinc-300"
                                : "text-zinc-500 group-hover:text-zinc-700",
                          )}
                        />
                        <span className="flex-1 tracking-wide">{item.label}</span>
                        {isActive ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-black" />
                        ) : (
                          <ChevronRight
                            size={13}
                            className="text-zinc-600 opacity-60 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>

            <div className="mt-auto space-y-3 pt-6 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={toggleTheme}
                className={clsx(
                  "flex w-full items-center justify-between rounded-full px-4 py-3 text-xs font-bold transition",
                  isDark
                    ? "text-zinc-400 hover:text-white hover:bg-white/5"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-black/5",
                )}
                aria-label="Toggle theme"
              >
                <span className="tracking-wide">Theme Mode</span>
                {isDark ? (
                  <ToggleRight size={18} className="text-lime-400" />
                ) : (
                  <ToggleLeft size={18} />
                )}
              </button>

              <a
                href={QUICK_CONTACT.resume}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-lime-400 py-3.5 text-xs font-black uppercase tracking-wider text-[#121212] shadow-[0_4px_16px_rgba(163,230,53,0.3)] hover:opacity-90 transition-all duration-300"
                aria-label="View Resume"
              >
                <Download size={14} />
                View Resume
              </a>

              <p className="text-[10px] text-center text-zinc-500 font-medium pt-2">
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
