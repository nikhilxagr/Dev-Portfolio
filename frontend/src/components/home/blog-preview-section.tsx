import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import type { BlogPost } from "@/types/content";

type BlogPreviewSectionProps = {
  blogs: BlogPost[];
};

export function BlogPreviewSection({ blogs }: BlogPreviewSectionProps) {
  return (
    <section className="py-20 sm:py-24">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Writing"
          title="Thoughts, writeups, and public learning."
          description="Your blog section already has a clear structure, and these cards will later expand into stronger writing-driven proof."
        />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
          {blogs.map((blog) => (
            <article
              key={blog.slug}
              className="rounded-[30px] border border-[color:var(--border-soft)] bg-white p-6 shadow-[var(--shadow-soft)]"
            >
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
                {blog.source}
              </p>
              <h3 className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-bold text-[color:var(--text-primary-on-light)]">
                {blog.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary-on-light)]">
                {blog.excerpt}
              </p>
              <a
                href={blog.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex text-sm font-semibold text-[color:var(--accent-strong)] underline-offset-4 hover:underline"
              >
                Read article
              </a>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
