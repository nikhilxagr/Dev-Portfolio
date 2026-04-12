import { Link } from "react-router-dom";
import { Mail, ShieldCheck } from "lucide-react";
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
    <footer className="section-divider bg-slate-950/70">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-emerald-300">
              Connect With Me
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-cyan-100">
              {SITE_PROFILE.fullName}
            </h2>
            <p className="mt-3 max-w-xl text-slate-300">
              Full stack professional portfolio focused on practical delivery,
              clear communication, and reliable execution.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:max-w-2xl">
              {socialProfiles.map((item) => {
                const logoUrl = getSkillLogoUrl(item.label, isDark);

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-cyan-300/20 bg-slate-900/65 p-3 transition hover:-translate-y-1 hover:border-cyan-300/40"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-300/25 bg-slate-950/80">
                      {item.label === "LinkedIn" ? (
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="h-5 w-5"
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
                          className="h-5 w-5 object-contain"
                        />
                      ) : (
                        <span className="font-display text-[10px] uppercase tracking-[0.04em] text-cyan-200">
                          {item.label.slice(0, 2)}
                        </span>
                      )}
                    </span>

                    <div>
                      <p className="text-sm font-semibold text-cyan-100">
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-500">Open profile</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h3 className="text-xl font-semibold text-cyan-100">
                Quick Navigation
              </h3>
              <div className="mt-4 grid gap-2 text-sm text-slate-300">
                {primaryLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="transition hover:text-cyan-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="inline-flex items-center gap-2 text-xl font-semibold text-cyan-100">
                <ShieldCheck size={20} className="text-cyan-200" />
                Let's Work Together
              </h3>
              <p className="mt-4 text-sm text-slate-300">
                Have a project in mind? Need frontend, backend, or full stack
                delivery support?
              </p>
              <Link
                to="/contact"
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
              >
                <Mail size={16} />
                Let's Talk
              </Link>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-cyan-100">Policies</h3>
              <div className="mt-4 grid gap-2 text-sm text-slate-300">
                {LEGAL_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="transition hover:text-cyan-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-cyan-300/15 pt-6 text-sm text-slate-400">
          <p>
            Copyright {new Date().getFullYear()}{" "}
            <Link
              to="/admin/login"
              className="font-semibold text-cyan-200 transition hover:text-cyan-100 hover:underline"
            >
              {SITE_PROFILE.fullName}
            </Link>
            . All rights reserved.
          </p>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
            Full Stack Developer | Web Solutions
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
