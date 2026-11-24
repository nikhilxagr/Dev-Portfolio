import { FileText, ShieldAlert, Wrench } from "lucide-react";
import FadeInUp from "@/components/animations/FadeInUp";
import SeoHead from "@/components/seo/SeoHead";
import { createBreadcrumbSchema } from "@/utils/seo";
import { LEGAL_NOTICES, PRACTICALS } from "@/constants/siteData";

const vulnerabilities = [
  "SQL and NoSQL injection attack patterns",
  "Cross-site scripting (XSS) and output encoding gaps",
  "Broken authentication and weak session handling",
  "Security misconfiguration in APIs and HTTP headers",
  "Access-control weaknesses including insecure direct object references",
];

const allTools = Array.from(
  new Set(PRACTICALS.flatMap((item) => item.tools)),
).sort((a, b) => a.localeCompare(b));

const statusLabelMap = {
  ready: "Ready",
  ongoing: "Ongoing",
  "summary-ready": "Summary Ready",
  "add-room-wise-later": "Room-wise Writeups Planned",
};

const formatStatusLabel = (value = "") => {
  if (statusLabelMap[value]) {
    return statusLabelMap[value];
  }

  return value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const SecurityPage = () => {
  return (
    <>
      <SeoHead
        title="Security Engineering Practicals & Labs | Nikhil Agrahari"
        description="Security engineering practicals by Nikhil Agrahari, including vulnerability themes, lab tooling, methodology notes, and responsible testing scope."
        pathname="/security"
        keywords={[
          "Nikhil security practicals",
          "Nikhil secure engineering labs",
          "application security learning",
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Practicals", path: "/security" },
        ])}
      />

      <section className="section-wrap pt-6 sm:pt-8 pb-16">
        <FadeInUp>
          <div className="mx-auto mb-10 max-w-4xl text-center">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-950 dark:text-ink-50 sm:text-4xl lg:text-5xl">
              Security <span className="text-emerald-600 dark:text-emerald-400">Labs</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-base">
              Documented lab exercises focused on vulnerability research, lab tooling, methodology notes, and responsible testing scope.
            </p>
          </div>
        </FadeInUp>

        <div className="grid gap-6 xl:grid-cols-2">
          {PRACTICALS.map((item, index) => (
            <FadeInUp
              key={item.slug}
              delay={index * 0.06}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-black/[0.08] bg-white p-6 transition-colors duration-200 hover:border-emerald-600/30 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-emerald-500/30 sm:p-7"
            >
              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {item.focus}
                  </p>
                  <span className="rounded-full border border-emerald-600/25 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
                    {item.level}
                  </span>
                </div>

                <h3 className="mt-3 text-xl font-semibold leading-tight text-ink-950 dark:text-ink-50 sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                  {item.summary}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {item.tools.map((tool) => (
                    <span
                      key={`${item.slug}-${tool}`}
                      className="rounded-lg border border-black/[0.08] bg-black/[0.03] px-2.5 py-1 text-xs font-medium text-ink-700 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-ink-200"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-black/[0.06] pt-4 text-xs font-medium dark:border-white/[0.06]">
                  <span className="rounded-full border border-emerald-600/25 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
                    Status: {formatStatusLabel(item.status)}
                  </span>
                  <span className="rounded-full border border-black/[0.08] bg-black/[0.03] px-3 py-1 text-ink-700 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-ink-300">
                    Writeup: {formatStatusLabel(item.writeupStatus)}
                  </span>
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
      </section>

      <section className="section-wrap pt-4 pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-black/[0.08] bg-white p-6 transition-colors hover:border-emerald-600/30 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-emerald-500/30 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/25 dark:text-emerald-400">
                <Wrench size={18} strokeWidth={1.5} />
              </span>
              <h2 className="text-xl font-semibold text-ink-950 dark:text-ink-50">
                Tools Used Across Labs
              </h2>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {allTools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-lg border border-black/[0.08] bg-black/[0.03] px-3 py-1.5 text-xs font-medium text-ink-700 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-ink-200"
                >
                  {tool}
                </span>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-black/[0.08] bg-white p-6 transition-colors hover:border-emerald-600/30 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-emerald-500/30 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/25 dark:text-emerald-400">
                <ShieldAlert size={18} strokeWidth={1.5} />
              </span>
              <h2 className="text-xl font-semibold text-ink-950 dark:text-ink-50">
                Vulnerability Themes Practiced
              </h2>
            </div>

            <ul className="mt-5 space-y-2.5 text-sm text-ink-600 dark:text-ink-300">
              {vulnerabilities.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section-wrap pt-4 pb-20">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Governance &amp; Ethics</span>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink-950 dark:text-ink-50 sm:text-3xl">
            Responsible Testing Standards
          </h2>
          <p className="mt-1.5 text-sm text-ink-600 dark:text-ink-400">
            Testing is performed only in local lab environments, owned assets, or explicitly authorized targets.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-black/[0.08] bg-white p-6 transition-colors hover:border-emerald-600/30 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-emerald-500/30 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/25 dark:text-emerald-400">
                <FileText size={18} strokeWidth={1.5} />
              </span>
              <h3 className="text-lg font-semibold text-ink-950 dark:text-ink-50">
                Security Testing Notice
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              {LEGAL_NOTICES.securityTesting}
            </p>
          </article>

          <article className="rounded-2xl border border-black/[0.08] bg-white p-6 transition-colors hover:border-emerald-600/30 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-emerald-500/30 sm:p-7">
            <h3 className="text-lg font-semibold text-ink-950 dark:text-ink-50">
              Portfolio Disclaimer
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              {LEGAL_NOTICES.portfolioDisclaimer}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              {LEGAL_NOTICES.practicalsEthics}
            </p>
          </article>
        </div>
      </section>
    </>
  );
};

export default SecurityPage;
