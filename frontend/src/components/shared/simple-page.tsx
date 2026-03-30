import { Container } from "@/components/layout/container";

type SimplePageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SimplePage({
  eyebrow,
  title,
  description,
}: SimplePageProps) {
  return (
    <main className="flex-1 bg-[color:var(--bg-canvas)] py-20">
      <Container>
        <section className="rounded-[32px] border border-[color:var(--border-soft)] bg-white p-8 shadow-[var(--shadow-soft)] sm:p-12">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--accent-strong)]">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-[color:var(--text-primary-on-light)] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[color:var(--text-secondary-on-light)]">
            {description}
          </p>
          <div className="mt-8 rounded-3xl border border-dashed border-[color:var(--border-strong)] bg-[color:var(--bg-section-soft)] p-6 text-sm leading-7 text-[color:var(--text-secondary-on-light)]">
            This page is now part of the real app structure and will be expanded
            during the next build days as we add components, API connections,
            and production details.
          </div>
        </section>
      </Container>
    </main>
  );
}
