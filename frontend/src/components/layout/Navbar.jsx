import { useEffect, useState } from "react";
import clsx from "clsx";
import { Link, NavLink } from "react-router-dom";
import { ArrowRight, Menu, Moon, SunMedium, X } from "lucide-react";
import { NAV_LINKS, SITE_PROFILE } from "@/constants/siteData";
import { useTheme } from "@/context/ThemeContext";

const NAV_OFFSET_REM = 6;
const OPPORTUNITY_BANNER_HEIGHT_REM = 3;

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
      "rounded-lg px-3 py-2 text-sm font-medium transition",
      isActive
        ? "bg-cyan-400/15 text-cyan-200 shadow-neon"
        : "text-slate-300 hover:bg-cyan-400/10 hover:text-cyan-100",
    );

  return (
    <header className="fixed inset-x-0 top-0 z-30">
      {showOpportunityBanner ? (
        <div className="opportunity-banner-shell border-b border-emerald-300/25 bg-gradient-to-r from-emerald-950/65 via-emerald-900/40 to-cyan-950/45 backdrop-blur-lg">
          <div className="mx-auto relative flex h-12 max-w-7xl items-center px-4 sm:px-6 lg:px-10">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-16 sm:px-24">
              <div className="flex min-w-0 items-center justify-center gap-2.5 text-emerald-100">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
                <p className="truncate text-center text-xs font-semibold uppercase tracking-[0.14em] sm:text-sm">
                  Open to opportunities
                </p>
                <p className="hidden text-sm text-emerald-200/90 xl:block">
                  Internships, freelance and collaborations
                </p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <Link
                to="/contact"
                className="hidden items-center gap-1 rounded-full border border-emerald-300/45 bg-emerald-300/12 px-3 py-1.5 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-300/22 sm:inline-flex sm:px-4 sm:text-sm"
              >
                Let's talk
                <ArrowRight size={14} />
              </Link>
              <button
                type="button"
                onClick={closeOpportunityBanner}
                aria-label="Close opportunities banner"
                className="rounded-full p-1.5 text-emerald-200/80 transition hover:bg-emerald-300/15 hover:text-emerald-100"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="border-b border-cyan-300/15 bg-slate-950/80 backdrop-blur-lg">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link to="/" onClick={() => setOpen(false)} className="group">
            <p className="font-display text-xs uppercase tracking-[0.2em] text-cyan-100 sm:text-sm">
              {SITE_PROFILE.fullName}
            </p>
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 transition group-hover:text-slate-300">
              Full Stack + Security Portfolio
            </p>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((item) => (
              <NavLink key={item.to} to={item.to} className={navItemClass}>
                {item.label}
              </NavLink>
            ))}

            <button
              type="button"
              onClick={toggleTheme}
              className="ml-1 rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-cyan-100 transition hover:bg-cyan-300/20"
              aria-label="Toggle theme"
              title="Toggle dark or light mode"
            >
              {isDark ? <SunMedium size={16} /> : <Moon size={16} />}
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-lg border border-cyan-400/40 p-2 text-cyan-100 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-cyan-300/15 bg-slate-950/80 px-4 py-4 md:hidden">
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
              className="rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/20"
            >
              {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
