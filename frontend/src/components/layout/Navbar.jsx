import { useEffect, useState } from "react";
import clsx from "clsx";
import { Link, NavLink } from "react-router-dom";
import { ArrowRight, Menu, Moon, Shield, SunMedium, X } from "lucide-react";
import { NAV_LINKS, SITE_PROFILE } from "@/constants/siteData";
import { useTheme } from "@/context/ThemeContext";

const NAV_OFFSET_REM = 6;
const OPPORTUNITY_BANNER_HEIGHT_REM = 2.25;

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

  const closeOpportunityBanner = () => {
    setShowOpportunityBanner(false);
  };

  const navItemClass = ({ isActive }) =>
    clsx(
      "rounded-xl border px-4 py-2 text-sm font-semibold transition",
      isActive
        ? "border-cyan-300/45 bg-cyan-300/12 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.2),0_0_20px_rgba(34,211,238,0.14)]"
        : "border-transparent text-slate-300 hover:border-cyan-300/35 hover:bg-cyan-300/10 hover:text-cyan-100",
    );

  return (
    <header className="fixed inset-x-0 top-0 z-30">
      {showOpportunityBanner ? (
        <div className="opportunity-banner-shell relative border-b border-emerald-300/25 bg-gradient-to-r from-emerald-950/65 via-emerald-900/40 to-cyan-950/45 backdrop-blur-lg">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-950/95 via-slate-950/50 to-transparent sm:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-950/95 via-slate-950/50 to-transparent sm:w-32" />

          <div className="mx-auto relative flex h-9 max-w-7xl items-center px-3 sm:px-6 lg:px-10">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-12 sm:px-24">
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

      <div className="border-b border-cyan-300/15 bg-slate-950/80 backdrop-blur-lg">
        <div className="mx-auto grid h-20 max-w-7xl grid-cols-[auto_1fr_auto] items-center px-4 sm:px-6 lg:px-10">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="group mr-4 inline-flex min-w-0 items-center gap-3 xl:mr-10"
          >
            <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/40 bg-slate-950/80 shadow-[0_0_0_1px_rgba(34,211,238,0.22),0_0_22px_rgba(34,211,238,0.16)]">
              <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-300/15 via-transparent to-emerald-300/12" />
              <Shield size={17} className="relative text-cyan-200" />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(74,222,128,0.95)]" />
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

          <nav className="hidden items-center justify-self-center gap-2 xl:flex xl:translate-x-8">
            {NAV_LINKS.map((item) => (
              <NavLink key={item.to} to={item.to} className={navItemClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center justify-self-end xl:flex">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-cyan-100 transition hover:bg-cyan-300/20"
              aria-label="Toggle theme"
              title="Toggle dark or light mode"
            >
              {isDark ? <SunMedium size={16} /> : <Moon size={16} />}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="justify-self-end rounded-lg border border-cyan-400/40 p-2 text-cyan-100 xl:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-cyan-300/15 bg-slate-950/80 px-4 py-4 xl:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={navItemClass}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}

            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-cyan-100 transition hover:bg-cyan-300/20"
              aria-label="Toggle theme"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                Theme
              </span>
              {isDark ? <SunMedium size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
