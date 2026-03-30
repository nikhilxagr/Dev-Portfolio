import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";

type AboutSnapshotSectionProps = {
  shortIntro: string;
  focusAreas: string[];
};

export function AboutSnapshotSection({
  shortIntro,
  focusAreas,
}: AboutSnapshotSectionProps) {
  return (
    <section className="py-20 sm:py-24">
      <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-[color:var(--border-soft)] bg-white p-8 shadow-[var(--shadow-soft)] sm:p-10">
          <SectionHeading
            eyebrow="About Snapshot"
            title="A developer who builds, learns, and documents the process."
            description={shortIntro}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {focusAreas.map((item) => (
            <div
              key={item}
              className="rounded-[28px] border border-[color:var(--border-soft)] bg-[color:var(--bg-card)] p-6 shadow-[var(--shadow-card)]"
            >
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[color:var(--accent-soft)]">
                Focus
              </p>
              <p className="mt-4 text-lg font-semibold leading-7 text-[color:var(--text-primary-on-dark)]">
                {item}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
