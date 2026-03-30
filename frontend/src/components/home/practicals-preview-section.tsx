import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Practical } from "@/types/content";

type PracticalsPreviewSectionProps = {
  title: string;
  practicals: Practical[];
};

export function PracticalsPreviewSection({
  title,
  practicals,
}: PracticalsPreviewSectionProps) {
  return (
    <section className="py-20 sm:py-24">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Practicals"
          title={title}
          description="Hands-on cyber security learning stays visible in the portfolio instead of hidden behind a skills list."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {practicals.map((practical) => (
            <article
              key={practical.slug}
              className="rounded-[28px] border border-[color:var(--border-soft)] bg-[color:var(--bg-card)] p-6 shadow-[var(--shadow-card)]"
            >
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-[color:var(--accent-soft)]">
                {practical.level}
              </p>
              <h3 className="mt-4 font-[family-name:var(--font-heading)] text-xl font-bold text-[color:var(--text-primary-on-dark)]">
                {practical.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-muted-on-dark)]">
                {practical.summary}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
