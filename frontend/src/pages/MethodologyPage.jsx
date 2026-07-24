import { ShieldCheck, CheckCircle2, FileText, Lock, AlertTriangle, ArrowRight } from "lucide-react";
import SeoHead from "@/components/seo/SeoHead";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
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
    desc: "Systematic auditing against OWASP Top 10 vulnerabilities (SQLi, XSS, Broken Auth, SSRF, IDOR), evaluating API endpoint request parameters.",
  },
  {
    step: "03",
    title: "Threat Modeling & Defensive Remediation",
    desc: "Defining risk severity scores (CVSS v3.1), designing secure code fixes (JWT hardening, Helmet headers, parameterized SQL, rate limiting).",
  },
  {
    step: "04",
    title: "Verification & Documentation Writeups",
    desc: "Re-testing patch effectiveness, writing clear technical writeups, documenting reproduction steps, and producing executive remediation summaries.",
  },
];

const MethodologyPage = () => {
  return (
    <>
      <SeoHead
        title="Engineering & Pentesting Methodology"
        description="Documented application security testing, OWASP vulnerability auditing, and engineering security standards by Nikhil Agrahari."
        pathname="/experiments/methodology"
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Experiments", path: "/experiments" },
          { name: "Document Methodology", path: "/experiments/methodology" },
        ])}
      />

      <section className="section-wrap pt-12 sm:pt-20">
        <SectionTitle
          eyebrow="Security Standards"
          title="Documented Testing Methodology"
          description="A structured workflow for authorized application security auditing, threat modeling, defense-in-depth engineering, and responsible documentation."
        />
      </section>

      <section className="section-wrap section-divider pt-8 pb-16">
        
        {/* Core Principles Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/90 p-8 shadow-xl dark:border-slate-800/80 dark:bg-[#050d14]/90 backdrop-blur-xl mb-12">
          <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-green-500/10 dark:bg-green-400/10 blur-3xl" />
          
          <div className="relative space-y-4 max-w-3xl">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-green-600 dark:text-green-400">
              // Responsible Disclosure &amp; Ethics
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Ethics &amp; Authorized Scope First
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              All security experiments, lab tests, and vulnerability assessments follow strict authorization rules, local sandboxed environments, and responsible disclosure ethics. I treat application security as an architectural responsibility.
            </p>
          </div>
        </div>

        {/* 4 Stage Methodology Grid */}
        <div className="mb-8">
          <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            4-Stage Security Audit Workflow
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Systematic process applied across security labs and backend API reviews.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {STAGES.map((s) => (
            <div
              key={s.step}
              className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-green-500/50 dark:border-slate-800/90 dark:bg-[#050d14]/90"
            >
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-green-600 dark:text-green-400">
                  STAGE {s.step}
                </span>
                <h4 className="font-display text-xl font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                  {s.title}
                </h4>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/80 dark:border-slate-800/80 pt-8">
          <div>
            <p className="font-display text-base font-bold text-slate-900 dark:text-white">
              Explore documented security writeups and hands-on lab exercises
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to="/experiments/security-labs" variant="primary">
              View Security Labs <ArrowRight size={15} />
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
