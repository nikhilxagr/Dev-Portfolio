import { Link } from "react-router-dom";
import { Mail, ShieldCheck, ArrowUpRight } from "lucide-react";
import {
  LEGAL_LINKS,
  NAV_LINKS,
  QUICK_CONTACT,
  SITE_PROFILE,
  SOCIAL_LINKS,
} from "@/constants/siteData";
import { getSkillLogoUrl } from "@/constants/skillLogos";
import { useTheme } from "@/context/ThemeContext";

const Footer = () => {
  const { isDark } = useTheme();
  const primaryLinks = NAV_LINKS.filter(
    (item) => !item.to.startsWith("/admin"),
  );
  const socialProfiles = [
    ...SOCIAL_LINKS,
    { label: "LeetCode", href: QUICK_CONTACT.leetcode },
    { label: "GeeksforGeeks", href: QUICK_CONTACT.gfg },
  ];

  return (
    <footer className="relative border-t border-slate-300 bg-slate-100 text-slate-900 dark:border-emerald-500/20 dark:bg-[#030906] dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          
          {/* Left Column: Brand & Social Grid */}
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] font-extrabold text-emerald-700 dark:text-emerald-400">
              // CONNECT WITH ME
            </span>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {SITE_PROFILE.fullName}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              Full stack developer &amp; application security engineer focused on practical delivery, clean architecture, and reliable execution.
            </p>

            {/* Social Grid Cards */}
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-3 lg:max-w-2xl">
              {socialProfiles.map((item) => {
                const logoUrl = getSkillLogoUrl(item.label, isDark);

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${item.label} profile for Nikhil Agrahari`}
                    className="group flex items-center justify-between gap-2 rounded-2xl border border-slate-300 bg-white p-2.5 sm:p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-950/30 dark:hover:bg-emerald-500/10 dark:hover:border-emerald-400/40"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 shrink-0 text-slate-800 dark:text-white">
                        {item.label === "LinkedIn" ? (
                          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#0A66C2]">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.026-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        ) : item.label === "GitHub" ? (
                          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                          </svg>
                        ) : item.label === "LeetCode" ? (
                          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#FFA116]">
                            <path d="M16.102 17.93l-2.697 2.607c-.466.45-1.135.528-1.68.275l-4.71-2.181a1.488 1.488 0 01-.845-1.348V6.717c0-.573.328-1.09.845-1.348l4.71-2.181c.545-.253 1.214-.175 1.68.275l2.697 2.607a.64.64 0 01-.892.918l-2.696-2.607a.208.208 0 00-.23-.035l-4.71 2.181a.208.208 0 00-.118.188v10.566c0 .08.046.152.118.188l4.71 2.181c.075.035.163.023.23-.035l2.696-2.607a.64.64 0 01.892.918z" />
                            <path d="M20.25 12a.64.64 0 01-.64.64H9.64a.64.64 0 010-1.28h9.97c.353 0 .64.287.64.64z" />
                          </svg>
                        ) : item.label === "TryHackMe" ? (
                          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#E11D48]">
                            <path d="M12 1L2 6v6c0 5.55 3.84 10.74 10 12 6.16-1.26 10-5.45 10-12V6l-10-5zm0 4.8l6 3.6v4.8c0 3.8-2.6 7.3-6 8.3-3.4-1-6-4.5-6-8.3V9.4l6-3.6z" />
                          </svg>
                        ) : item.label === "GeeksforGeeks" ? (
                          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#2F8D46]">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-4H8v4H6V7h2v4h2V7h2v10zm6 0h-4V7h4v2h-2v2h2v2h-2v2h2v2z" />
                          </svg>
                        ) : item.label === "Instagram" ? (
                          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#E4405F]">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        ) : logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={`${item.label} logo`}
                            loading="lazy"
                            decoding="async"
                            className="h-4 w-4 object-contain"
                          />
                        ) : (
                          <span className="font-mono text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                            {item.label.slice(0, 2)}
                          </span>
                        )}
                      </span>

                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors truncate">
                          {item.label}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium truncate">Open profile</p>
                      </div>
                    </div>

                    <ArrowUpRight size={14} className="shrink-0 text-slate-400 dark:text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Column: Navigation Links, Contact CTA, Policies */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Quick Navigation */}
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                Quick Navigation
              </h3>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-2.5 text-xs font-bold text-slate-800 dark:text-slate-300">
                {primaryLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="transition hover:text-emerald-700 dark:hover:text-emerald-400 truncate"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/how-i-build"
                  className="transition hover:text-emerald-700 dark:hover:text-emerald-400 truncate"
                >
                  How I Build
                </Link>
              </div>
            </div>

            {/* Let's Work Together CTA */}
            <div>
              <h3 className="inline-flex items-center gap-2 font-display text-base font-bold text-slate-900 dark:text-white">
                <ShieldCheck size={18} className="text-emerald-700 dark:text-emerald-400" />
                Let's Work Together
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                Have a project in mind? Need frontend, backend, or application security auditing?
              </p>
              <Link
                to="/contact"
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-600/40 bg-emerald-600/10 text-emerald-900 hover:bg-emerald-600 hover:text-white dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500 dark:hover:text-slate-950 px-4 py-2.5 text-xs font-bold shadow-sm transition-all duration-300 hover:scale-[1.03]"
              >
                <Mail size={15} />
                Let's Talk
              </Link>
            </div>

            {/* Legal Policies */}
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Policies</h3>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-2.5 text-xs font-bold text-slate-800 dark:text-slate-300">
                {LEGAL_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="transition hover:text-emerald-700 dark:hover:text-emerald-400 truncate"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-slate-300 dark:border-emerald-500/20 pt-6 text-xs text-slate-700 dark:text-slate-400">
          <p>
            Copyright © {new Date().getFullYear()}{" "}
            <Link
              to="/admin/login"
              className="font-extrabold text-slate-900 dark:text-emerald-300 transition hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              {SITE_PROFILE.fullName}
            </Link>
            . All rights reserved.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400 font-extrabold">
            FULL STACK DEVELOPER // CYBERSECURITY
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
