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

      {/* Security Labs Header & Grid */}
      <section className="section-wrap pt-4 sm:pt-6 pb-16">
        
        {/* Hero title */}
        <FadeInUp>
          <div className="text-center max-w-4xl mx-auto mb-10">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-wider text-slate-900 dark:text-white drop-shadow-sm">
              SECURITY <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">LABS</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Documented lab exercises focused on vulnerability research, lab tooling, methodology notes, and responsible testing scope.
            </p>
          </div>
        </FadeInUp>

        {/* Labs grid */}
        <div className="grid gap-6 xl:grid-cols-2">
          {PRACTICALS.map((item, index) => (
            <FadeInUp
              key={item.slug}
              delay={index * 0.06}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-7 shadow-xl backdrop-blur-xl transition-all duration-300 dark:border-emerald-500/30 dark:bg-[#030d07]/95 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)]"
            >
              <div className="pointer-events-none absolute -top-14 -right-12 h-36 w-36 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 blur-3xl" />

              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                    {item.focus}
                  </p>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    {item.level}
                  </span>
                </div>

                <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl leading-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-xs sm:text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.summary}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {item.tools.map((tool) => (
                    <span
                      key={`${item.slug}-${tool}`}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-800 dark:border-emerald-500/20 dark:bg-[#020803]/80 dark:text-slate-200"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-300">
                    Status: {formatStatusLabel(item.status)}
                  </span>
                  <span className="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-teal-700 dark:text-teal-300">
                    Writeup: {formatStatusLabel(item.writeupStatus)}
                  </span>
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
      </section>

      {/* Tools Used & Vulnerability Themes Section */}
      <section className="section-wrap pt-4 pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          
          <article className="rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-7 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/95 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)]">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Wrench size={18} />
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Tools Used Across Labs
              </h2>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {allTools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 dark:border-emerald-500/20 dark:bg-[#020803]/80 dark:text-slate-200"
                >
                  {tool}
                </span>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-7 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/95 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)]">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldAlert size={18} />
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Vulnerability Themes Practiced
              </h2>
            </div>

            <ul className="mt-5 space-y-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
              {vulnerabilities.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {/* Governance & Scope Section */}
      <section className="section-wrap pt-4 pb-20">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">// GOVERNANCE &amp; ETHICS</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Responsible Testing Standards
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
            Testing is performed only in local lab environments, owned assets, or explicitly authorized targets.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-7 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/95">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <FileText size={18} />
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Security Testing Notice
              </h3>
            </div>
            <p className="mt-3 text-xs sm:text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300">
              {LEGAL_NOTICES.securityTesting}
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-7 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/95">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Portfolio Disclaimer
            </h3>
            <p className="mt-3 text-xs sm:text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300">
              {LEGAL_NOTICES.portfolioDisclaimer}
            </p>
            <p className="mt-3 text-xs sm:text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300">
              {LEGAL_NOTICES.practicalsEthics}
            </p>
          </article>
        </div>
      </section>
    </>
  );
};

export default SecurityPage;
