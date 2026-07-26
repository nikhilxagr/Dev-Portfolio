import { ShieldCheck, CheckCircle2, FileText, Lock, AlertTriangle, ArrowRight } from "lucide-react";
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
        title="Engineering & Pentesting Methodology | Nikhil Agrahari"
        description="Documented application security testing, OWASP vulnerability auditing, and engineering security standards by Nikhil Agrahari."
        pathname="/experiments/methodology"
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Experiments", path: "/experiments" },
          { name: "Document Methodology", path: "/experiments/methodology" },
        ])}
      />

      {/* Methodology Page Content */}
      <section className="section-wrap pt-4 sm:pt-6 pb-20">
        
        {/* Hero title */}
        <FadeInUp>
          <div className="text-center max-w-4xl mx-auto mb-10">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-wider text-slate-900 dark:text-white drop-shadow-sm">
              DOCUMENTED <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">METHODOLOGY</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              A structured workflow for authorized application security auditing, threat modeling, defense-in-depth engineering, and responsible documentation.
            </p>
          </div>
        </FadeInUp>

        {/* Ethics overview */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-9 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] mb-12">
          <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 blur-3xl" />
          
          <div className="relative space-y-3 max-w-3xl">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
              // Responsible Disclosure &amp; Ethics
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Ethics &amp; Authorized Scope First
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
              All security experiments, lab tests, and vulnerability assessments follow strict authorization rules, local sandboxed environments, and responsible disclosure ethics. I treat application security as an architectural responsibility.
            </p>
          </div>
        </div>

        {/* 4-stage audit workflow */}
        <div className="mb-6">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">// AUDIT WORKFLOW</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            4-Stage Security Audit Workflow
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Systematic process applied across security labs and backend API reviews.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {STAGES.map((s) => (
            <div
              key={s.step}
              className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-7 shadow-xl backdrop-blur-xl transition-all duration-300 dark:border-emerald-500/30 dark:bg-[#030d07]/95"
            >
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                  STAGE {s.step}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1.5 leading-snug">
                  {s.title}
                </h3>
                <p className="mt-3 text-xs sm:text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer links */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800/80 pt-8">
          <div>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white">
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
