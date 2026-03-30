import Link from "next/link";

import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <main className="flex-1 py-24">
      <Container>
        <div className="rounded-[32px] border border-[color:var(--border-soft)] bg-white p-10 text-center shadow-[var(--shadow-soft)] sm:p-14">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent-strong)]">
            404
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-[color:var(--text-primary-on-light)]">
            This page is not here yet.
          </h1>
          <p className="mt-4 text-lg leading-8 text-[color:var(--text-secondary-on-light)]">
            The route either does not exist yet or is still being built as part
            of the portfolio roadmap.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-full bg-[color:var(--bg-card)] px-6 py-3 text-sm font-semibold text-[color:var(--text-primary-on-dark)]"
          >
            Back to Home
          </Link>
        </div>
      </Container>
    </main>
  );
}
