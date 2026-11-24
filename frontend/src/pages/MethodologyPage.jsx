import { ArrowRight } from "lucide-react";
import SeoHead from "@/components/seo/SeoHead";
import Button from "@/components/ui/Button";
import FadeInUp from "@/components/animations/FadeInUp";
import { createBreadcrumbSchema } from "@/utils/seo";

const STAGES = [
  {
    step: "01",
    title: "Scope Definition & Authorized Reconnaissance",
    desc: "Establishing clear authorization bounds, target domain scope, passive threat intelligence gathering, Nmap host discovery, and OS fingerprinting.",
  },
  {
    step: "02",
    title: "Vulnerability Analysis & OWASP Top 10 Mapping",
    desc: "Systematic auditing against OWASP Top 10 categories (SQLi, XSS, Broken Auth, SSRF, IDOR), evaluating API endpoint inputs and request flows.",
  },
  {
    step: "03",
    title: "Threat Modeling & Defensive Remediation",
    desc: "Scoring severity (CVSS v3.1) and implementing secure code fixes across JWT validation, security headers, parameterized queries, and rate limiting.",
  },
  {
    step: "04",
    title: "Verification & Documentation Writeups",
    desc: "Re-testing patch effectiveness, writing clear reproduction notes, and assembling concise remediation summaries.",
  },
];

const MethodologyPage = () => {
  return (
    <>
      <SeoHead
        title="Engineering & Pentesting Methodology | Nikhil Agrahari"
        description="Documented application security testing, OWASP vulnerability auditing, and engineering security standards by Nikhil Agrahari."
        pathname="/experiments/methodology"
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Experiments", path: "/experiments" },
          { name: "Document Methodology", path: "/experiments/methodology" },
        ])}
      />

      <section className="section-wrap pt-6 pb-20 sm:pt-8 sm:pb-24">
        <FadeInUp>
          <div className="mx-auto mb-10 max-w-4xl text-center">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-950 dark:text-ink-50 sm:text-4xl lg:text-5xl">
              Documented <span className="text-emerald-600 dark:text-emerald-400">Methodology</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-base">
              A structured workflow for authorized application security auditing, threat modeling, defense-in-depth engineering, and responsible documentation.
            </p>
          </div>
        </FadeInUp>

        <div className="mb-12 rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c] sm:p-9">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Responsible Disclosure &amp; Ethics
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-ink-950 dark:text-ink-50 sm:text-3xl">
              Ethics &amp; Authorized Scope First
            </h2>
            <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-base">
              All security experiments, lab tests, and vulnerability assessments follow strict authorization rules, local sandboxed environments, and responsible disclosure ethics. Application security is treated as an architectural responsibility.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Audit Workflow</span>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink-950 dark:text-ink-50 sm:text-3xl">
            4-Stage Security Audit Workflow
          </h2>
          <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">
            Systematic process applied across security labs and backend API reviews.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {STAGES.map((s) => (
            <div
              key={s.step}
              className="flex flex-col justify-between rounded-2xl border border-black/[0.08] bg-white p-6 transition-colors duration-200 hover:border-emerald-600/30 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-emerald-500/30 sm:p-7"
            >
              <div>
                <span className="font-mono text-xs font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                  Stage {s.step}
                </span>
                <h3 className="mt-1.5 text-lg font-semibold leading-snug text-ink-950 dark:text-ink-50 sm:text-xl">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-black/[0.08] pt-8 dark:border-white/[0.08]">
          <p className="text-sm font-medium text-ink-900 dark:text-ink-100">
            Explore documented security writeups and hands-on lab exercises
          </p>
          <div className="flex flex-wrap gap-3">
            <Button to="/experiments/security-labs" variant="primary">
              View Security Labs <ArrowRight size={15} strokeWidth={1.5} />
            </Button>
            <Button to="/experiments/tools" variant="ghost">
              Cyber Tools
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default MethodologyPage;
