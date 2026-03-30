import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookText,
  BriefcaseBusiness,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import type { SiteContent, StatItem } from "@/types/content";

type HeroSectionProps = {
  site: SiteContent;
  stats: StatItem[];
};

export function HeroSection({ site, stats }: HeroSectionProps) {
  const socialLinks = [
    {
      label: "LinkedIn",
      href: site.contact.linkedin,
      icon: Linkedin,
    },
    {
      label: "GitHub",
      href: site.contact.github,
      icon: Github,
    },
    {
      label: "Email",
      href: `mailto:${site.contact.email}`,
      icon: Mail,
    },
    {
      label: "WhatsApp",
      href: site.contact.whatsapp,
      icon: MessageCircle,
    },
    {
      label: "Medium",
      href: site.contact.medium,
      icon: BookText,
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-[color:var(--border-soft)] pb-16 pt-14 sm:pb-20 sm:pt-20">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-soft)] bg-white/85 px-4 py-2 text-sm font-medium text-[color:var(--text-primary-on-light)] shadow-[var(--shadow-soft)]">
              <MapPin className="h-4 w-4 text-[color:var(--accent-strong)]" />
              {site.location.city}, {site.location.country}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-soft)] bg-white/85 px-4 py-2 text-sm font-medium text-[color:var(--text-primary-on-light)] shadow-[var(--shadow-soft)]">
              <GraduationCap className="h-4 w-4 text-[color:var(--accent-strong)]" />
              {site.education}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-soft)] bg-white/85 px-4 py-2 text-sm font-medium text-[color:var(--text-primary-on-light)] shadow-[var(--shadow-soft)]">
              <BriefcaseBusiness className="h-4 w-4 text-[color:var(--accent-strong)]" />
              {site.role}
            </div>
          </div>

          <div className="space-y-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent-strong)]">
              {site.hero.eyebrow}
            </p>
            <h1 className="max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-[color:var(--text-primary-on-light)] sm:text-5xl lg:text-[4.35rem] lg:leading-[1.02]">
              {site.hero.title}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[color:var(--text-secondary-on-light)] sm:text-xl">
              {site.hero.description}
            </p>
            <p className="max-w-2xl text-base leading-7 text-[color:var(--text-secondary-on-light)]">
              {site.availability}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href={site.hero.primaryCta.href}
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--bg-card)] px-6 py-3 text-sm font-semibold text-[color:var(--text-primary-on-dark)] shadow-[var(--shadow-card)] hover:-translate-y-0.5"
            >
              {site.hero.primaryCta.label}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a
              href={site.hero.secondaryCta.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[color:var(--border-soft)] bg-white px-6 py-3 text-sm font-semibold text-[color:var(--text-primary-on-light)] hover:border-[color:var(--accent-primary)] hover:bg-[color:var(--bg-section-soft)]"
            >
              {site.hero.secondaryCta.label}
            </a>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[color:var(--accent-strong)]" />
              <p className="text-sm font-semibold text-[color:var(--text-primary-on-light)]">
                Social and direct contact
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center justify-between gap-3 rounded-[22px] border border-[color:var(--border-soft)] bg-white/90 px-4 py-3 text-sm font-semibold text-[color:var(--text-primary-on-light)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:border-[color:var(--accent-primary)] hover:bg-[color:var(--bg-section-soft)]"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon className="h-4 w-4 text-[color:var(--accent-strong)]" />
                      {item.label}
                    </span>
                    <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <a
                key={stat.id}
                href={stat.link}
                target="_blank"
                rel="noreferrer"
                className="rounded-[28px] border border-[color:var(--border-soft)] bg-white/90 p-5 shadow-[var(--shadow-soft)] hover:-translate-y-1"
              >
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
                  {stat.label}
                </p>
                <p className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold text-[color:var(--text-primary-on-light)]">
                  {stat.value}
                </p>
                {stat.detail ? (
                  <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary-on-light)]">
                    {stat.detail}
                  </p>
                ) : null}
              </a>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute inset-0 translate-x-6 translate-y-6 rounded-[40px] bg-[color:var(--accent-soft)]/60 blur-3xl" />
          <div className="relative overflow-hidden rounded-[40px] border border-[color:var(--border-strong)] bg-[linear-gradient(180deg,#0a1f3b,#102c50)] p-5 shadow-[var(--shadow-card)]">
            <div className="rounded-[30px] border border-white/10 bg-white/[0.06] p-3">
              <Image
                src={site.profileImage.publicPath}
                alt={site.profileImage.alt}
                width={720}
                height={900}
                priority
                className="aspect-[4/5] h-auto w-full rounded-[24px] object-cover object-top"
              />
            </div>
            <div className="mt-4 grid gap-4">
              <div className="flex items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-white/5 px-5 py-4">
                <div>
                  <p className="font-[family-name:var(--font-heading)] text-xl font-bold text-[color:var(--text-primary-on-dark)]">
                    {site.siteName}
                  </p>
                  <p className="mt-1 text-sm text-[color:var(--text-muted-on-dark)]">
                    {site.headline}
                  </p>
                </div>
                <div className="rounded-full border border-[color:var(--border-strong)] bg-white/5 px-3 py-1 font-mono text-xs uppercase tracking-[0.24em] text-[color:var(--accent-soft)]">
                  Live Build
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--accent-soft)]">
                    Primary Focus
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-[color:var(--text-primary-on-dark)]">
                    Full stack web development with practical product building.
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--accent-soft)]">
                    Secondary Edge
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-[color:var(--text-primary-on-dark)]">
                    Cyber security learning through labs, tools, and writeups.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
