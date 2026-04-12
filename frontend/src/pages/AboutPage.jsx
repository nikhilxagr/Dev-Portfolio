import { ArrowRight, Code2, Server, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import SectionTitle from "@/components/ui/SectionTitle";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import { createBreadcrumbSchema, createPersonSchema } from "@/utils/seo";
import {
  ABOUT_STORY,
  FOCUS_AREAS,
  QUICK_CONTACT,
  SITE_PROFILE,
  STATS_METRICS,
} from "@/constants/siteData";

const aboutIdentityPoints = [
  `Education: ${SITE_PROFILE.education}`,
  `Location: ${SITE_PROFILE.location}`,
  "Approach: clean execution, practical learning, and secure implementation habits.",
];

const aboutCapabilities = [
  {
    title: "Frontend Product Experience",
    summary:
      "Build responsive interfaces with React, structured components, and clear user flow.",
    icon: Code2,
  },
  {
    title: "Backend API Development",
    summary:
      "Develop maintainable Node.js and Express APIs with validation and reliable data flow.",
    icon: Server,
  },
  {
    title: "Security-Aware Delivery",
    summary:
      "Apply authorized lab learning and security-first thinking to improve implementation quality.",
    icon: ShieldCheck,
  },
];

const aboutCurrentDirection = [
  "Improve full stack architecture decisions and production readiness.",
  "Strengthen practical cybersecurity methodology through consistent labs.",
  "Build portfolio projects that show clear impact and technical depth.",
];

const AboutPage = () => {
  const conciseStory = ABOUT_STORY.slice(0, 3);

  return (
    <>
      <SeoHead
        title="About"
        description="About Nikhil Agrahari, BCA student at BBD University Lucknow, focused on full stack development, practical cybersecurity learning, and reliable product execution."
        pathname="/about"
        image={SITE_PROFILE.profileImage}
        imageAlt={SITE_PROFILE.profileImageAlt}
        keywords={[
          "Nikhil Lucknow",
          "Nikhil BBD",
          "About Nikhil Agrahari",
          "BBD University student portfolio",
        ]}
        jsonLd={[
          createPersonSchema(),
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />

      <section className="section-wrap pt-12 sm:pt-20">
        <SectionTitle
          className="text-center [&>p]:mx-auto"
          eyebrow="Professional Profile"
          title="About Me"
          description="Background, capabilities, and current learning focus."
        />

        <FadeInUp className="card-surface relative mt-8 overflow-hidden rounded-[2rem] p-5 sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_86%_84%,rgba(16,185,129,0.12),transparent_40%)]" />

          <div className="relative grid gap-4 sm:gap-5 lg:grid-cols-2">
            <article className="relative overflow-hidden rounded-3xl border border-cyan-300/25 bg-slate-950/55 p-5 sm:p-7">
              <div className="pointer-events-none absolute -top-14 -right-10 h-32 w-32 rounded-full bg-cyan-300/15 blur-3xl" />

              <div className="relative">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                  Who I Am
                </p>
                <h3 className="mt-2 text-[1.55rem] font-semibold leading-tight text-cyan-100 sm:text-3xl">
                  Student Builder with a Security Learning Mindset
                </h3>

                <div className="mt-4 space-y-3 text-[0.95rem] leading-6 text-slate-300 sm:space-y-4 sm:text-base sm:leading-7">
                  {conciseStory.map((paragraph, index) => (
                    <p
                      key={paragraph}
                      className={
                        index === 0 ? "text-lg font-medium text-cyan-50" : ""
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <ul className="mt-4 space-y-2.5 sm:space-y-3">
                  {aboutIdentityPoints.map((point) => (
                    <li
                      key={point}
                      className="rounded-xl border border-cyan-300/20 bg-slate-900/75 p-3 text-sm leading-6 text-slate-300 sm:leading-7"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <article className="relative overflow-hidden rounded-3xl border border-cyan-300/25 bg-slate-950/55 p-5 sm:p-7">
              <div className="pointer-events-none absolute -bottom-16 -left-14 h-36 w-36 rounded-full bg-emerald-300/12 blur-3xl" />

              <div className="relative">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                  What I Can Do
                </p>
                <h3 className="mt-2 text-[1.55rem] font-semibold leading-tight text-cyan-100 sm:text-3xl">
                  Build, Improve, and Support with Practical Focus
                </h3>

                <div className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
                  {aboutCapabilities.map((item) => {
                    const Icon = item.icon;

                    return (
                      <article
                        key={item.title}
                        className="rounded-xl border border-cyan-300/20 bg-slate-900/75 p-3"
                      >
                        <div className="flex items-start gap-3">
                          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-300/35 bg-cyan-300/12 text-cyan-100">
                            <Icon size={17} />
                          </span>

                          <div>
                            <p className="text-sm font-semibold text-cyan-100">
                              {item.title}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-300 sm:leading-7">
                              {item.summary}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-emerald-100">
                    Best Fit
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-200 sm:leading-7">
                    Students, founders, and small teams who need practical web
                    product delivery and clear technical guidance.
                  </p>
                </div>
              </div>
            </article>
          </div>

          <div className="relative mt-6 flex flex-wrap justify-center gap-3 sm:mt-7 sm:justify-start">
            <Button to="/projects">
              View Projects <ArrowRight size={16} />
            </Button>
            <Button to="/contact" variant="ghost">
              Work With Me
            </Button>
            <Button
              href={QUICK_CONTACT.resume}
              target="_blank"
              rel="noreferrer"
              variant="secondary"
            >
              Resume
            </Button>
          </div>
        </FadeInUp>

        <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <FadeInUp delay={0.1} className="card-surface rounded-3xl p-5 sm:p-7">
            <h3 className="text-2xl font-semibold text-cyan-100 sm:text-[1.9rem]">
              Current Direction
            </h3>

            <div className="mt-4 space-y-3">
              {aboutCurrentDirection.map((point) => (
                <p
                  key={point}
                  className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-3 text-sm leading-6 text-slate-300 sm:leading-7"
                >
                  {point}
                </p>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-slate-900/70 p-4">
              <p className="text-sm uppercase tracking-[0.14em] text-emerald-300">
                Focus Areas
              </p>

              <ul className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                {FOCUS_AREAS.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-cyan-300/15 bg-slate-950/55 px-3 py-2"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeInUp>

          <FadeInUp
            delay={0.14}
            className="card-surface rounded-3xl p-5 sm:p-6"
          >
            {SITE_PROFILE.profileImage ? (
              <div className="mb-6 flex justify-center">
                <div className="h-56 w-56 overflow-hidden rounded-full border-4 border-cyan-300/35 bg-slate-900/70 shadow-[0_0_0_4px_rgba(34,211,238,0.08)]">
                  <img
                    src={SITE_PROFILE.profileImage}
                    alt={SITE_PROFILE.profileImageAlt}
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : null}

            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
              Profile Snapshot
            </p>
            <h3 className="mt-2 text-xl font-semibold text-cyan-100">
              {SITE_PROFILE.fullName}
            </h3>
            <p className="mt-2 text-[0.95rem] leading-6 text-slate-300 sm:text-base sm:leading-7">
              {SITE_PROFILE.headline}
            </p>

            <div className="mt-4 space-y-2 text-sm text-slate-300 sm:text-base">
              <p>
                <span className="text-slate-500">Email:</span>{" "}
                {QUICK_CONTACT.email}
              </p>
              <p>
                <span className="text-slate-500">Availability:</span>{" "}
                {SITE_PROFILE.availability}
              </p>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {STATS_METRICS.map((metric) => (
                <a
                  key={metric.id}
                  href={metric.link}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-3"
                >
                  <p className="font-display text-2xl text-cyan-100">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-300">
                    {metric.label}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">
                    {metric.detail}
                  </p>
                </a>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                href={QUICK_CONTACT.resume}
                target="_blank"
                rel="noreferrer"
              >
                Resume
              </Button>
              <Button
                href={QUICK_CONTACT.linkedin}
                target="_blank"
                rel="noreferrer"
                variant="ghost"
              >
                LinkedIn
              </Button>
              <Button to="/contact" variant="secondary">
                Contact
              </Button>
            </div>
          </FadeInUp>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
