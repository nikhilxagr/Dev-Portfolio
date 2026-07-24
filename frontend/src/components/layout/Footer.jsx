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
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:max-w-2xl">
              {socialProfiles.map((item) => {
                const logoUrl = getSkillLogoUrl(item.label, isDark);

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-300 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-950/30 dark:hover:bg-emerald-500/10 dark:hover:border-emerald-400/40"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 shrink-0">
                        {item.label === "LinkedIn" ? (
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="h-4 w-4"
                          >
                            <path
                              fill="#0A66C2"
                              d="M20.447 20.452h-3.554v-5.569c0-1.328-.026-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                            />
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

                      <div>
                        <p className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                          {item.label}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">Open profile</p>
                      </div>
                    </div>

                    <ArrowUpRight size={14} className="text-slate-400 dark:text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
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
              <div className="mt-4 grid gap-2 text-xs font-bold text-slate-800 dark:text-slate-300">
                {primaryLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="transition hover:text-emerald-700 dark:hover:text-emerald-400"
                  >
                    {item.label}
                  </Link>
                ))}
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
              <div className="mt-4 grid gap-2 text-xs font-bold text-slate-800 dark:text-slate-300">
                {LEGAL_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="transition hover:text-emerald-700 dark:hover:text-emerald-400"
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
