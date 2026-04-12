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
      "rounded-xl border px-4 py-2 text-sm font-semibold transition",
      isActive
        ? isDark
          ? "border-cyan-300/45 bg-cyan-300/12 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.2),0_0_20px_rgba(34,211,238,0.14)]"
          : "border-cyan-600/35 bg-cyan-500/12 text-cyan-900 shadow-[0_0_0_1px_rgba(8,145,178,0.15),0_0_18px_rgba(8,145,178,0.14)]"
        : isDark
          ? "border-transparent text-slate-300 hover:border-cyan-300/35 hover:bg-cyan-300/10 hover:text-cyan-100"
          : "border-transparent text-slate-700 hover:border-cyan-500/35 hover:bg-cyan-500/10 hover:text-cyan-900",
    );

  return (
    <header className="fixed inset-x-0 top-0 z-30">
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

      <div
        className={clsx(
          "border-b backdrop-blur-lg",
          isDark
            ? "border-cyan-300/15 bg-slate-950/80"
            : "border-cyan-600/20 bg-white/75 shadow-[0_10px_24px_-20px_rgba(8,145,178,0.55)]",
        )}
      >
        <div className="mx-auto grid h-20 max-w-7xl grid-cols-[auto_1fr_auto] items-center px-4 sm:px-6 lg:px-10">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="group mr-4 inline-flex min-w-0 items-center gap-3 xl:mr-10"
          >
            <span
              className={clsx(
                "relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                isDark
                  ? "border-cyan-300/40 bg-slate-950/80 shadow-[0_0_0_1px_rgba(34,211,238,0.22),0_0_22px_rgba(34,211,238,0.16)]"
                  : "border-cyan-600/35 bg-white/90 shadow-[0_0_0_1px_rgba(8,145,178,0.16),0_0_18px_rgba(16,185,129,0.15)]",
              )}
            >
              <span
                className={clsx(
                  "pointer-events-none absolute inset-0 rounded-xl",
                  isDark
                    ? "bg-gradient-to-br from-cyan-300/15 via-transparent to-emerald-300/12"
                    : "bg-gradient-to-br from-cyan-500/20 via-transparent to-emerald-500/18",
                )}
              />
              <Shield
                size={17}
                className={clsx(
                  "relative",
                  isDark ? "text-cyan-200" : "text-cyan-700",
                )}
              />
              <span
                className={clsx(
                  "absolute -right-1 -top-1 h-2 w-2 rounded-full",
                  isDark
                    ? "bg-emerald-300 shadow-[0_0_10px_rgba(74,222,128,0.95)]"
                    : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.65)]",
                )}
              />
            </span>

            <span className="min-w-0">
              <p className="truncate font-display text-[13px] uppercase tracking-[0.18em] text-cyan-50 transition group-hover:text-cyan-100 sm:text-sm">
                {SITE_PROFILE.fullName}
              </p>
              <p className="truncate text-[10px] uppercase tracking-[0.2em] text-slate-500 transition group-hover:text-slate-300">
                Full Stack + Security Portfolio
              </p>
            </span>
          </Link>

          <nav className="hidden items-center justify-self-center gap-2 xl:flex xl:translate-x-4">
            {NAV_LINKS.map((item) => (
              <NavLink key={item.to} to={item.to} className={navItemClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center justify-self-end gap-3 xl:flex xl:pl-6">
            <button
              type="button"
              onClick={toggleTheme}
              className={clsx(
                "rounded-xl border px-3 py-2 transition",
                isDark
                  ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/20"
                  : "border-cyan-600/35 bg-cyan-500/10 text-cyan-800 hover:bg-cyan-500/18",
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
              className={clsx(
                "group relative ml-1 inline-flex items-center gap-1.5 overflow-hidden rounded-xl border px-4 py-2 text-xs font-semibold tracking-[0.08em] transition-all duration-300 hover:-translate-y-0.5",
                isDark
                  ? "border-emerald-300/55 bg-emerald-300/22 text-emerald-50 hover:border-emerald-200/75 hover:bg-emerald-300/30 hover:shadow-[0_12px_28px_-16px_rgba(16,185,129,0.95)]"
                  : "border-emerald-600/40 bg-emerald-500/16 text-emerald-800 hover:bg-emerald-500/24 hover:shadow-[0_12px_24px_-16px_rgba(5,150,105,0.6)]",
              )}
              aria-label="Open resume"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-emerald-100/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative inline-flex items-center gap-1.5 uppercase">
                <Download size={14} />
                Resume
              </span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className={clsx(
              "justify-self-end rounded-lg border p-2 transition xl:hidden",
              isDark
                ? "border-cyan-400/40 text-cyan-100"
                : "border-cyan-600/35 bg-white/70 text-cyan-800 hover:bg-cyan-100/70",
            )}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
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
              "absolute right-0 top-0 flex h-screen w-[min(86vw,320px)] flex-col border-l p-4",
              isDark
                ? "border-cyan-300/25 bg-gradient-to-b from-slate-950 via-[#061a2b] to-[#02121f] shadow-[0_0_0_1px_rgba(34,211,238,0.14),0_24px_60px_-18px_rgba(20,184,166,0.55)]"
                : "border-cyan-500/25 bg-gradient-to-b from-white via-cyan-50/95 to-emerald-50/95 shadow-[0_0_0_1px_rgba(8,145,178,0.12),0_22px_48px_-18px_rgba(14,116,144,0.35)]",
            )}
            role="dialog"
            aria-modal="true"
          >
            <div
              className={clsx(
                "rounded-2xl border p-3",
                isDark
                  ? "border-cyan-300/25 bg-slate-900/80"
                  : "border-cyan-500/25 bg-white/88",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p
                    className={clsx(
                      "truncate text-sm font-semibold",
                      isDark ? "text-cyan-50" : "text-cyan-900",
                    )}
                  >
                    {SITE_PROFILE.fullName}
                  </p>
                  <p
                    className={clsx(
                      "mt-1 text-[10px] uppercase tracking-[0.16em]",
                      isDark ? "text-emerald-200/80" : "text-emerald-700",
                    )}
                  >
                    Quick Navigation
                  </p>
                  <p
                    className={clsx(
                      "mt-1 text-[10px]",
                      isDark ? "text-slate-500" : "text-slate-600",
                    )}
                  >
                    Explore portfolio sections instantly.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={clsx(
                    "rounded-lg border p-1.5 transition",
                    isDark
                      ? "border-cyan-300/35 bg-cyan-300/12 text-cyan-100 hover:bg-cyan-300/24"
                      : "border-cyan-500/30 bg-cyan-500/10 text-cyan-800 hover:bg-cyan-500/18",
                  )}
                  aria-label="Close menu"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {NAV_LINKS.map((item) => {
                const Icon = mobileNavIconMap[item.label] || Shield;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        "group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition",
                        isActive
                          ? isDark
                            ? "border-cyan-300/55 bg-gradient-to-r from-cyan-500/85 via-emerald-400/80 to-teal-500/80 text-white shadow-[0_10px_24px_-12px_rgba(16,185,129,0.85)]"
                            : "border-cyan-500/35 bg-gradient-to-r from-cyan-500/16 via-emerald-500/14 to-teal-500/16 text-cyan-900 shadow-[0_10px_22px_-14px_rgba(8,145,178,0.35)]"
                          : isDark
                            ? "border-cyan-300/22 bg-slate-900/70 text-slate-200 hover:border-emerald-300/45 hover:bg-emerald-300/12"
                            : "border-cyan-500/22 bg-white/85 text-slate-700 hover:border-cyan-500/35 hover:bg-cyan-500/10",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={clsx(
                            "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border",
                            isActive
                              ? isDark
                                ? "border-white/35 bg-white/15 text-white"
                                : "border-cyan-600/35 bg-cyan-500/12 text-cyan-800"
                              : isDark
                                ? "border-cyan-300/30 bg-cyan-300/12 text-cyan-200"
                                : "border-cyan-500/30 bg-cyan-500/10 text-cyan-700",
                          )}
                        >
                          <Icon size={14} />
                        </span>

                        <span className="flex-1">{item.label}</span>

                        <ChevronRight
                          size={14}
                          className={clsx(
                            "transition-transform duration-300",
                            isActive
                              ? isDark
                                ? "text-white"
                                : "text-cyan-800"
                              : isDark
                                ? "text-slate-500 group-hover:translate-x-0.5 group-hover:text-cyan-200"
                                : "text-slate-500 group-hover:translate-x-0.5 group-hover:text-cyan-700",
                          )}
                        />
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>

            <div
              className={clsx(
                "mt-auto rounded-xl border p-2",
                isDark
                  ? "border-cyan-300/20 bg-slate-900/60"
                  : "border-cyan-500/25 bg-white/88",
              )}
            >
              <button
                type="button"
                onClick={toggleTheme}
                className={clsx(
                  "inline-flex w-full items-center justify-center gap-3 rounded-lg border px-3 py-2 transition",
                  isDark
                    ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/20"
                    : "border-cyan-500/30 bg-cyan-500/10 text-cyan-800 hover:bg-cyan-500/18",
                )}
                aria-label="Toggle theme"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                  Theme
                </span>
                {isDark ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
              </button>
            </div>

            <a
              href={QUICK_CONTACT.resume}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className={clsx(
                "group relative mt-3 inline-flex w-full items-center justify-center overflow-hidden rounded-xl border px-4 py-2.5 transition-all duration-300 hover:-translate-y-0.5",
                isDark
                  ? "border-emerald-300/55 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-[0_14px_30px_-16px_rgba(16,185,129,0.9)] hover:shadow-[0_18px_34px_-16px_rgba(20,184,166,0.92)]"
                  : "border-emerald-600/40 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-[0_12px_24px_-14px_rgba(5,150,105,0.45)] hover:shadow-[0_16px_28px_-14px_rgba(13,148,136,0.55)]",
              )}
              aria-label="Open resume"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative text-xs font-semibold uppercase tracking-[0.14em]">
                RESUME
              </span>
            </a>
          </aside>
        </div>
      )}
    </header>
  );
};

export default Navbar;
