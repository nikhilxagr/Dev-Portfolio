import { useState } from "react";
import clsx from "clsx";
import { Link, NavLink } from "react-router-dom";
import { Menu, Moon, SunMedium, X } from "lucide-react";
import { NAV_LINKS, SITE_PROFILE } from "@/constants/siteData";
import { useTheme } from "@/context/ThemeContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const navItemClass = ({ isActive }) =>
    clsx(
      "rounded-lg px-3 py-2 text-sm font-medium transition",
      isActive
        ? "bg-cyan-400/15 text-cyan-200 shadow-neon"
        : "text-slate-300 hover:bg-cyan-400/10 hover:text-cyan-100",
    );

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-cyan-300/15 bg-slate-950/80 backdrop-blur-lg">
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
