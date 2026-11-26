import { memo } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowUpRight } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa";
import {
  SiGithub,
  SiInstagram,
  SiMedium,
  SiTryhackme,
  SiWhatsapp,
  SiLeetcode,
  SiGeeksforgeeks,
} from "react-icons/si";
import {
  LEGAL_LINKS,
  NAV_LINKS,
  QUICK_CONTACT,
  SITE_PROFILE,
  SOCIAL_LINKS,
} from "@/constants/siteData";
import { useSiteContent } from "@/context/SiteContentContext";

const DEFAULT_SOCIAL_META = {
  icon: null,
  iconColor: "text-emerald-700 dark:text-emerald-400",
  cardHover:
    "hover:border-emerald-600/35 hover:bg-emerald-500/[0.04] dark:hover:border-emerald-500/40 dark:hover:bg-emerald-500/[0.08]",
  iconBoxHover:
    "group-hover:border-emerald-600/30 group-hover:bg-emerald-500/10 group-hover:text-emerald-700 dark:group-hover:border-emerald-500/35 dark:group-hover:bg-emerald-500/15 dark:group-hover:text-emerald-400",
  titleHover:
    "group-hover:text-emerald-700 dark:group-hover:text-emerald-400",
  arrowHover:
    "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
};

const SOCIAL_CARD_META = {
  GitHub: {
    icon: SiGithub,
    iconColor: "text-slate-900 dark:text-[#f0f6fc]",
    cardHover:
      "hover:border-slate-900/35 hover:bg-slate-900/[0.04] dark:hover:border-white/35 dark:hover:bg-white/[0.06]",
    iconBoxHover:
      "group-hover:border-slate-900/25 group-hover:bg-slate-900/[0.08] group-hover:text-slate-950 dark:group-hover:border-white/25 dark:group-hover:bg-white/[0.12] dark:group-hover:text-white",
    titleHover: "group-hover:text-slate-950 dark:group-hover:text-white",
    arrowHover: "group-hover:text-slate-900 dark:group-hover:text-white",
  },
  LinkedIn: {
    icon: FaLinkedinIn,
    iconColor: "text-[#0A66C2] dark:text-[#60A5FA]",
    cardHover:
      "hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/[0.05] dark:hover:border-[#3897F0]/45 dark:hover:bg-[#0A66C2]/[0.12]",
    iconBoxHover:
      "group-hover:border-[#0A66C2]/35 group-hover:bg-[#0A66C2]/10 group-hover:text-[#0A66C2] dark:group-hover:border-[#3897F0]/40 dark:group-hover:bg-[#0A66C2]/25 dark:group-hover:text-[#60A5FA]",
    titleHover: "group-hover:text-[#0A66C2] dark:group-hover:text-[#60A5FA]",
    arrowHover: "group-hover:text-[#0A66C2] dark:group-hover:text-[#60A5FA]",
  },
  Instagram: {
    icon: SiInstagram,
    iconColor: "text-[#D81B60] dark:text-pink-400",
    cardHover:
      "hover:border-[#E1306C]/45 hover:bg-[#E1306C]/[0.05] dark:hover:border-pink-400/50 dark:hover:bg-pink-500/[0.10]",
    iconBoxHover:
      "group-hover:border-[#E1306C]/35 group-hover:bg-[#E1306C]/10 group-hover:text-[#D81B60] dark:group-hover:border-pink-400/40 dark:group-hover:bg-pink-500/20 dark:group-hover:text-pink-400",
    titleHover: "group-hover:text-[#C2185B] dark:group-hover:text-pink-400",
    arrowHover: "group-hover:text-[#D81B60] dark:group-hover:text-pink-400",
  },
  Medium: {
    icon: SiMedium,
    iconColor: "text-[#008755] dark:text-[#1FD495]",
    cardHover:
      "hover:border-[#00AB6C]/45 hover:bg-[#00AB6C]/[0.05] dark:hover:border-[#00AB6C]/50 dark:hover:bg-[#00AB6C]/[0.10]",
    iconBoxHover:
      "group-hover:border-[#00AB6C]/35 group-hover:bg-[#00AB6C]/12 group-hover:text-[#008755] dark:group-hover:border-[#00AB6C]/40 dark:group-hover:bg-[#00AB6C]/20 dark:group-hover:text-[#1FD495]",
    titleHover: "group-hover:text-[#008755] dark:group-hover:text-[#1FD495]",
    arrowHover: "group-hover:text-[#008755] dark:group-hover:text-[#1FD495]",
  },
  TryHackMe: {
    icon: SiTryhackme,
    iconColor: "text-red-600 dark:text-red-400",
    cardHover:
      "hover:border-red-600/40 hover:bg-red-600/[0.05] dark:hover:border-red-500/50 dark:hover:bg-red-500/[0.10]",
    iconBoxHover:
      "group-hover:border-red-600/35 group-hover:bg-red-600/10 group-hover:text-red-600 dark:group-hover:border-red-400/40 dark:group-hover:bg-red-500/20 dark:group-hover:text-red-400",
    titleHover: "group-hover:text-red-700 dark:group-hover:text-red-400",
    arrowHover: "group-hover:text-red-600 dark:group-hover:text-red-400",
  },
  WhatsApp: {
    icon: SiWhatsapp,
    iconColor: "text-[#15803D] dark:text-[#25D366]",
    cardHover:
      "hover:border-[#25D366]/45 hover:bg-[#25D366]/[0.06] dark:hover:border-[#25D366]/50 dark:hover:bg-[#25D366]/[0.10]",
    iconBoxHover:
      "group-hover:border-[#25D366]/40 group-hover:bg-[#25D366]/15 group-hover:text-[#15803D] dark:group-hover:border-[#25D366]/40 dark:group-hover:bg-[#25D366]/20 dark:group-hover:text-[#25D366]",
    titleHover: "group-hover:text-[#15803D] dark:group-hover:text-[#25D366]",
    arrowHover: "group-hover:text-[#15803D] dark:group-hover:text-[#25D366]",
  },
  LeetCode: {
    icon: SiLeetcode,
    iconColor: "text-[#C26D00] dark:text-[#FFA116]",
    cardHover:
      "hover:border-[#FFA116]/50 hover:bg-[#FFA116]/[0.07] dark:hover:border-[#FFA116]/50 dark:hover:bg-[#FFA116]/[0.10]",
    iconBoxHover:
      "group-hover:border-[#FFA116]/45 group-hover:bg-[#FFA116]/15 group-hover:text-[#C26D00] dark:group-hover:border-[#FFA116]/40 dark:group-hover:bg-[#FFA116]/20 dark:group-hover:text-[#FFA116]",
    titleHover: "group-hover:text-[#B45309] dark:group-hover:text-[#FFA116]",
    arrowHover: "group-hover:text-[#C26D00] dark:group-hover:text-[#FFA116]",
  },
  GeeksforGeeks: {
    icon: SiGeeksforgeeks,
    iconColor: "text-[#2F8D46] dark:text-[#4ADE80]",
    cardHover:
      "hover:border-[#2F8D46]/45 hover:bg-[#2F8D46]/[0.06] dark:hover:border-[#2F8D46]/60 dark:hover:bg-[#2F8D46]/[0.12]",
    iconBoxHover:
      "group-hover:border-[#2F8D46]/40 group-hover:bg-[#2F8D46]/15 group-hover:text-[#2F8D46] dark:group-hover:border-[#4ADE80]/40 dark:group-hover:bg-[#2F8D46]/25 dark:group-hover:text-[#4ADE80]",
    titleHover: "group-hover:text-[#257338] dark:group-hover:text-[#4ADE80]",
    arrowHover: "group-hover:text-[#2F8D46] dark:group-hover:text-[#4ADE80]",
  },
};

const Footer = () => {
  const { profile, contact } = useSiteContent();
  const primaryLinks = NAV_LINKS.filter(
    (item) => !item.to.startsWith("/admin"),
  );
  const socialProfiles = [
    { label: "GitHub", href: contact?.github || SOCIAL_LINKS[0]?.href },
    { label: "LinkedIn", href: contact?.linkedin || SOCIAL_LINKS[1]?.href },
    { label: "Instagram", href: contact?.instagram || SOCIAL_LINKS[2]?.href },
    { label: "Medium", href: contact?.medium || SOCIAL_LINKS[3]?.href },
    { label: "TryHackMe", href: contact?.tryhackme || SOCIAL_LINKS[4]?.href },
    { label: "WhatsApp", href: contact?.whatsapp || SOCIAL_LINKS[5]?.href },
    { label: "LeetCode", href: contact?.leetcode || QUICK_CONTACT.leetcode },
    { label: "GeeksforGeeks", href: contact?.gfg || QUICK_CONTACT.gfg },
  ].filter((item) => Boolean(item.href));

  return (
    <footer className="relative border-t border-black/[0.08] bg-[#f5f7fa] text-slate-900 dark:border-white/[0.08] dark:bg-[#090a0f] dark:text-[#eef0f5] transition-colors duration-150">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Column: Brand & Social Grid */}
          <div>
            <span className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Connect
            </span>
            <h2 className="mt-1.5 font-display text-2xl font-medium tracking-[-0.02em] text-slate-900 dark:text-[#eef0f5]">
              {profile?.fullName || SITE_PROFILE.fullName}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8]">
              {profile?.footerBio ||
                "Full-stack developer and application security practitioner focused on clean architecture, tested APIs, and dependable delivery."}
            </p>

            {/* Social Grid Cards */}
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-3 lg:max-w-2xl">
              {socialProfiles.map((item) => {
                const meta = SOCIAL_CARD_META[item.label] || DEFAULT_SOCIAL_META;
                const PlatformIcon = meta.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${item.label} profile for Nikhil Agrahari`}
                    className={`group flex items-center justify-between gap-2 rounded-xl border border-black/[0.08] bg-white p-2.5 sm:p-3 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 dark:border-white/[0.08] dark:bg-[#11141c] ${meta.cardHover}`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <span
                        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/[0.08] bg-slate-50 transition-colors duration-150 dark:border-white/[0.08] dark:bg-[#1a1e28] ${meta.iconColor} ${meta.iconBoxHover}`}
                      >
                        {PlatformIcon ? (
                          <PlatformIcon size={16} aria-hidden="true" />
                        ) : (
                          <span className="font-mono text-xs font-medium">
                            {item.label.slice(0, 2)}
                          </span>
                        )}
                      </span>

                      <div className="min-w-0">
                        <p
                          className={`text-xs sm:text-sm font-medium text-slate-900 dark:text-[#eef0f5] truncate transition-colors duration-150 ${meta.titleHover}`}
                        >
                          {item.label}
                        </p>
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-[#7a8296] truncate">
                          Open profile
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight
                      size={15}
                      strokeWidth={1.5}
                      className={`hidden min-[380px]:block shrink-0 text-slate-400 dark:text-[#7a8296] transition-colors duration-150 ${meta.arrowHover}`}
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Column: Navigation Links, Contact CTA, Policies */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Quick Navigation */}
            <div>
              <h3 className="font-display text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
                Navigation
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-slate-600 dark:text-[#a3a9b8] sm:grid-cols-1">
                {primaryLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="transition-colors duration-150 hover:text-slate-900 dark:hover:text-[#eef0f5] truncate"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/how-i-build"
                  className="transition-colors duration-150 hover:text-slate-900 dark:hover:text-[#eef0f5] truncate"
                >
                  How I Build
                </Link>
              </div>
            </div>

            {/* Work Inquiry CTA */}
            <div>
              <h3 className="font-display text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
                Work Together
              </h3>
              <p className="mt-4 text-xs leading-relaxed text-slate-600 dark:text-[#a3a9b8]">
                Have a project in mind or need full-stack and security review help?
              </p>
              <Link
                to="/contact"
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-black/[0.08] bg-white px-4 py-2 text-xs font-medium text-slate-900 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 dark:border-white/[0.10] dark:bg-[#1a1e28] dark:text-[#eef0f5] dark:hover:border-white/[0.18] dark:hover:bg-[#222734]"
              >
                <Mail size={16} strokeWidth={1.5} className="text-slate-500 dark:text-[#7a8296]" />
                Get in touch
              </Link>
            </div>

            {/* Legal Policies */}
            <div>
              <h3 className="font-display text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
                Policies
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-slate-600 dark:text-[#a3a9b8] sm:grid-cols-1">
                {LEGAL_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="transition-colors duration-150 hover:text-slate-900 dark:hover:text-[#eef0f5] truncate"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-black/[0.08] pt-6 text-xs text-slate-500 dark:border-white/[0.08] dark:text-[#7a8296]">
          <p>
            Copyright &copy; {new Date().getFullYear()}{" "}
            <Link
              to="/admin/login"
              className="font-medium text-slate-900 dark:text-[#eef0f5] transition-colors duration-150 hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              {SITE_PROFILE.fullName}
            </Link>
            . All rights reserved.
          </p>
          <p className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
            {profile?.footerRoleLine || "Full-Stack Developer & Security Researcher"}
          </p>
        </div>
      </div>
    </footer>
  );
};

const MemoizedFooter = memo(Footer);
MemoizedFooter.displayName = "Footer";

export default MemoizedFooter;
