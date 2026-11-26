import { memo, useEffect, useState } from "react";
import { ArrowRight, GraduationCap, Mail, Terminal, Layers, ShieldCheck } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import { QUICK_CONTACT, SITE_PROFILE } from "@/constants/siteData";
import { useSiteContent } from "@/context/SiteContentContext";

const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;

const TypedBadgeText = ({ text }) => {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [visibleLength, setVisibleLength] = useState(() =>
    prefersReducedMotion ? text.length : 0,
  );

  useEffect(() => {
    if (prefersReducedMotion || !text) return undefined;
    let intervalId = null;
    const startDelay = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setVisibleLength((prev) => {
          if (prev >= text.length) {
            window.clearInterval(intervalId);
            return prev;
          }
          return prev + 1;
        });
      }, 75);
    }, 200);

    return () => {
      window.clearTimeout(startDelay);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [prefersReducedMotion, text]);

  const isTyping = !prefersReducedMotion && visibleLength < text.length;

  return (
    <span className="relative inline-block" aria-label={text}>
      <span className="invisible select-none" aria-hidden="true">
        {text}
      </span>
      <span className="absolute inset-0 flex items-center whitespace-nowrap">
        <span>{text.slice(0, visibleLength)}</span>
        {isTyping && (
          <span
            aria-hidden="true"
            className="ml-0.5 inline-block h-3.5 w-[1.5px] bg-emerald-600 dark:bg-emerald-400"
          />
        )}
      </span>
    </span>
  );
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, ease: "easeOut", delay },
});

const SOCIAL_ICON_LINKS = [
  {
    icon: FaGithub,
    href: QUICK_CONTACT?.github || "https://github.com/nikhilxagr",
    label: "GitHub",
  },
  {
    icon: FaLinkedinIn,
    href: QUICK_CONTACT?.linkedin || "https://www.linkedin.com/in/nikhilxagr/",
    label: "LinkedIn",
  },
  {
    icon: FaWhatsapp,
    href: QUICK_CONTACT?.whatsapp || "https://wa.me/7897872883",
    label: "WhatsApp",
  },
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/nikhilxagr/",
    label: "Instagram",
  },
];

const SKILL_TAGS = [
  { icon: Terminal, label: "Python" },
  { icon: Layers, label: "Full Stack" },
  { icon: ShieldCheck, label: "SOC Analyst" },
];

const HeroSection = () => {
  const { profile, contact } = useSiteContent();

  const socialIconLinks = [
    {
      icon: FaGithub,
      href: contact?.github || QUICK_CONTACT?.github || "https://github.com/nikhilxagr",
      label: "GitHub",
    },
    {
      icon: FaLinkedinIn,
      href: contact?.linkedin || QUICK_CONTACT?.linkedin || "https://www.linkedin.com/in/nikhilxagr/",
      label: "LinkedIn",
    },
    {
      icon: FaWhatsapp,
      href: contact?.whatsapp || QUICK_CONTACT?.whatsapp || "https://wa.me/7897872883",
      label: "WhatsApp",
    },
    {
      icon: FaInstagram,
      href: contact?.instagram || "https://www.instagram.com/nikhilxagr/",
      label: "Instagram",
    },
  ];

  const heroImage = profile?.profileImage || SITE_PROFILE.profileImage;

  return (
    <section className="relative w-full pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">

          {/* Left Column: Text & Actions */}
          <div className="order-2 flex flex-col text-center sm:text-left lg:order-1">

            {/* Eyebrow — typed portfolio badge */}
            <MotionDiv {...fadeUp(0.03)} className="mb-5 flex items-center justify-center gap-2 sm:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                <TypedBadgeText
                  key={profile?.welcomeBadge || "Welcome to my portfolio"}
                  text={profile?.welcomeBadge || "Welcome to my portfolio"}
                />
              </span>
            </MotionDiv>

            {/* Primary Display Heading — split across two lines like original */}
            <MotionH1
              {...fadeUp(0.08)}
              className="font-display leading-[1.0] tracking-[-0.03em] text-slate-900 dark:text-[#eef0f5]"
            >
              <span className="block text-5xl font-semibold sm:text-6xl lg:text-7xl">{profile?.headlineFirst || "Nikhil"}</span>
              <span className="block text-5xl font-semibold text-emerald-600 dark:text-emerald-400 sm:text-6xl lg:text-7xl">{profile?.headlineAccent || "Agrahari"}</span>
            </MotionH1>

            {/* Subtitle role line */}
            <MotionP
              {...fadeUp(0.13)}
              className="mt-4 text-sm font-medium text-slate-600 dark:text-[#a3a9b8] sm:text-base"
            >
              {profile?.roleTitle || "Full-Stack Developer & Security Researcher"}
            </MotionP>

            {/* Skill tags row */}
            <MotionDiv
              {...fadeUp(0.17)}
              className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start"
            >
              {SKILL_TAGS.map((tagItem) => {
                const Icon = tagItem.icon;
                return (
                <span
                  key={tagItem.label}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#d1d5df]"
                >
                  <Icon size={13} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
                  {tagItem.label}
                </span>
                );
              })}
            </MotionDiv>

            {/* Education Context */}
            <MotionDiv
              {...fadeUp(0.21)}
              className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500 sm:justify-start dark:text-[#7a8296]"
            >
              <GraduationCap size={15} strokeWidth={1.5} className="shrink-0 text-emerald-700 dark:text-emerald-400" />
              <span>{profile?.educationLine || "BCA at BBDU Lucknow, India"}</span>
            </MotionDiv>

            {/* Open for work badge */}
            <MotionDiv {...fadeUp(0.24)} className="mt-3 flex items-center justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/25 bg-emerald-500/[0.08] px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                {profile?.availabilityPill || "Open for Internships & Freelance"}
              </span>
            </MotionDiv>

            {/* CTA Buttons */}
            <MotionDiv
              {...fadeUp(0.28)}
              className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:justify-start"
            >
              <a
                href="/services"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-medium text-white transition-colors duration-150 hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
              >
                Book Service
                <ArrowRight size={15} strokeWidth={1.5} />
              </a>
              <a
                href="/projects"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-black/[0.10] bg-white px-5 text-sm font-medium text-slate-800 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 dark:border-white/[0.10] dark:bg-[#11141c] dark:text-[#eef0f5] dark:hover:border-white/[0.18] dark:hover:bg-[#1a1e28]"
              >
                View Projects
                <ArrowRight size={15} strokeWidth={1.5} className="text-slate-400 dark:text-[#7a8296]" />
              </a>
              <a
                href="/contact"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-black/[0.10] bg-white px-5 text-sm font-medium text-slate-800 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 dark:border-white/[0.10] dark:bg-[#11141c] dark:text-[#eef0f5] dark:hover:border-white/[0.18] dark:hover:bg-[#1a1e28]"
              >
                <Mail size={15} strokeWidth={1.5} className="text-slate-500 dark:text-[#7a8296]" />
                Contact Me
              </a>
            </MotionDiv>

            {/* Social Links */}
            <MotionDiv
              {...fadeUp(0.32)}
              className="mt-6 flex items-center justify-center gap-2 sm:justify-start"
            >
              {socialIconLinks.map((social) => {
                const Icon = social.icon;
                return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.08] bg-white text-slate-600 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#7a8296] dark:hover:border-white/[0.16] dark:hover:bg-[#1a1e28] dark:hover:text-[#eef0f5]"
                >
                  <Icon size={16} />
                </a>
                );
              })}
            </MotionDiv>
          </div>

          {/* Right Column: Circular Portrait */}
          <MotionDiv
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.12 }}
            className="order-1 mx-auto flex w-full max-w-xs justify-center sm:max-w-sm lg:order-2"
          >
            {heroImage ? (
              <div className="relative h-60 w-60 overflow-hidden rounded-full border-2 border-black/[0.08] bg-slate-100 sm:h-72 sm:w-72 lg:h-80 lg:w-80 dark:border-white/[0.10] dark:bg-[#11141c]">
                <img
                  src={heroImage}
                  alt={SITE_PROFILE.profileImageAlt}
                  className="h-full w-full object-cover object-center"
                  width={320}
                  height={320}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
            ) : null}
          </MotionDiv>

        </div>
      </div>
    </section>
  );
};

const MemoizedHeroSection = memo(HeroSection);
MemoizedHeroSection.displayName = "HeroSection";

export default MemoizedHeroSection;
