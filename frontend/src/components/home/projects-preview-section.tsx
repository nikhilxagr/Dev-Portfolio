import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Project } from "@/types/content";

type ProjectsPreviewSectionProps = {
  title: string;
  projects: Project[];
};

export function ProjectsPreviewSection({
  title,
  projects,
}: ProjectsPreviewSectionProps) {
  return (
    <section className="border-y border-[color:var(--border-soft)] bg-[color:var(--bg-section-soft)] py-20 sm:py-24">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Projects"
          title={title}
          description="A few selected builds that already show how the portfolio will present real work."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.slug}
              className="flex h-full flex-col rounded-[30px] border border-[color:var(--border-soft)] bg-white p-6 shadow-[var(--shadow-soft)]"
            >
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[color:var(--accent-strong)]">
                Featured Project
              </p>
              <h3 className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-bold text-[color:var(--text-primary-on-light)]">
                {project.name}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary-on-light)]">
                {project.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.stack.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-[color:var(--bg-section-soft)] px-3 py-1 text-xs font-medium text-[color:var(--text-primary-on-light)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex gap-4 text-sm font-semibold">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[color:var(--text-primary-on-light)] underline-offset-4 hover:underline"
                >
                  GitHub
                </a>
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[color:var(--accent-strong)] underline-offset-4 hover:underline"
                  >
                    Live Demo
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
