import Link from "next/link";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Service } from "@/types/content";

type ServicesPreviewSectionProps = {
  title: string;
  services: Service[];
};

export function ServicesPreviewSection({
  title,
  services,
}: ServicesPreviewSectionProps) {
  return (
    <section className="border-y border-[color:var(--border-soft)] bg-[color:var(--bg-section-soft)] py-20 sm:py-24">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Services"
          title={title}
          description="Student-friendly services with clear scope, practical delivery, and a payment flow that will connect to Razorpay."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.slug}
              className="rounded-[30px] border border-[color:var(--border-soft)] bg-white p-6 shadow-[var(--shadow-soft)]"
            >
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
                {service.category}
              </p>
              <h3 className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-bold text-[color:var(--text-primary-on-light)]">
                {service.name}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary-on-light)]">
                {service.summary}
              </p>
              <div className="mt-6 flex items-center justify-between gap-4">
                <span className="text-lg font-semibold text-[color:var(--text-primary-on-light)]">
                  {service.priceLabel}
                </span>
                <Link
                  href="/services"
                  className="rounded-full bg-[color:var(--bg-card)] px-4 py-2 text-sm font-semibold text-[color:var(--text-primary-on-dark)]"
                >
                  View Service
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
