import { FileText, ShieldAlert, Wrench } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
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
        title="Security Engineering Practicals"
        description="Security engineering practicals by Nikhil Agrahari, including vulnerability themes, lab tooling, methodology notes, and responsible testing scope."
        pathname="/security"
        keywords={[
          "Nikhil security practicals",
          "Nikhil Lucknow secure engineering labs",
          "application security learning",
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Practicals", path: "/security" },
        ])}
      />

      <section className="section-wrap pt-12 sm:pt-20">
        <SectionTitle
          eyebrow="Security Practicals"
          title="Security Engineering Practicals"
          description="Documented lab exercises focused on tools, methodology, and authorized testing scope."
        />

        <div className="mt-8 grid gap-4 sm:gap-5 xl:grid-cols-2">
          {PRACTICALS.map((item, index) => (
            <FadeInUp
              key={item.slug}
              delay={index * 0.06}
              className="card-surface relative overflow-hidden rounded-3xl p-5 sm:p-6"
            >
              <div className="pointer-events-none absolute -top-14 -right-12 h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl" />

              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">
                    {item.focus}
                  </p>
                  <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-1 text-xs font-medium text-cyan-100">
                    {item.level}
                  </span>
                </div>

                <h3 className="mt-3 text-xl font-semibold text-cyan-100 sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {item.summary}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tools.map((tool) => (
                    <span
                      key={`${item.slug}-${tool}`}
                      className="rounded-md border border-cyan-300/20 bg-slate-900/70 px-2.5 py-1 text-xs text-slate-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.12em]">
                  <span className="rounded-full border border-emerald-300/35 bg-emerald-300/10 px-2.5 py-1 text-emerald-100">
                    Status: {formatStatusLabel(item.status)}
                  </span>
                  <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2.5 py-1 text-cyan-100">
                    Writeup: {formatStatusLabel(item.writeupStatus)}
                  </span>
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
      </section>

      <section className="section-wrap pt-4 sm:pt-6">
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
          <article className="card-surface rounded-3xl p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 text-cyan-100">
                <Wrench size={17} />
              </span>
              <h2 className="text-xl font-semibold text-cyan-100">
                Tools Used Across Labs
              </h2>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {allTools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-md border border-cyan-300/25 bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-cyan-100"
                >
                  {tool}
                </span>
              ))}
            </div>
          </article>

          <article className="card-surface rounded-3xl p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-300/30 bg-emerald-300/10 text-emerald-100">
                <ShieldAlert size={17} />
              </span>
              <h2 className="text-xl font-semibold text-cyan-100">
                Vulnerability Themes Practiced
              </h2>
            </div>

            <ul className="mt-4 space-y-2.5 text-sm leading-7 text-slate-300">
              {vulnerabilities.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section-wrap pt-4 sm:pt-6">
        <SectionTitle
          eyebrow="Governance and Scope"
          title="Responsible Testing Standards"
          description="Testing is performed only in lab environments, owned assets, or explicitly authorized targets."
        />

        <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-2">
          <article className="card-surface rounded-3xl p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 text-cyan-100">
                <FileText size={17} />
              </span>
              <h3 className="text-lg font-semibold text-cyan-100">
                Security Testing Notice
              </h3>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {LEGAL_NOTICES.securityTesting}
            </p>
          </article>

          <article className="card-surface rounded-3xl p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-cyan-100">
              Portfolio Disclaimer
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {LEGAL_NOTICES.portfolioDisclaimer}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {LEGAL_NOTICES.practicalsEthics}
            </p>
          </article>
        </div>
      </section>
    </>
  );
};

export default SecurityPage;
