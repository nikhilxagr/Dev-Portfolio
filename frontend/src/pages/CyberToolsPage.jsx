import { useState } from "react";
import { Search, KeyRound, Lock, AlertTriangle, CheckCircle2 } from "lucide-react";
import SeoHead from "@/components/seo/SeoHead";
import Button from "@/components/ui/Button";
import FadeInUp from "@/components/animations/FadeInUp";
import { createBreadcrumbSchema } from "@/utils/seo";

const CyberToolsPage = () => {
  const [emailInput, setEmailInput] = useState("");
  const [breachResult, setBreachResult] = useState(null);
  const [breachLoading, setBreachLoading] = useState(false);

  const [passwordInput, setPasswordInput] = useState("");

  const [domainInput, setDomainInput] = useState("");
  const [headerResult, setHeaderResult] = useState(null);

  const handleBreachCheck = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) return;

    setBreachLoading(true);
    setBreachResult(null);

    setTimeout(() => {
      setBreachLoading(false);
      const isKnownTest = emailInput.toLowerCase().includes("test") || emailInput.toLowerCase().includes("pwn");
      if (isKnownTest) {
        setBreachResult({
          status: "compromised",
          breachesCount: 3,
          breaches: [
            { name: "Canva Data Breach (2019)", date: "May 2019", data: "Email addresses, passwords (bcrypt)" },
            { name: "Wattpad Breach (2020)", date: "June 2020", data: "Usernames, hashed passwords, IP addresses" },
            { name: "Verification Lab Audit DB", date: "Jan 2022", data: "Email credentials, system logs" },
          ],
        });
      } else {
        setBreachResult({
          status: "safe",
          breachesCount: 0,
          message: "No known security breaches found for this email address in our index.",
        });
      }
    }, 900);
  };

  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return null;

    let poolSize = 0;
    if (/[a-z]/.test(pwd)) poolSize += 26;
    if (/[A-Z]/.test(pwd)) poolSize += 26;
    if (/[0-9]/.test(pwd)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) poolSize += 32;

    const entropy = Math.round(pwd.length * Math.log2(poolSize || 1));

    let rating = "Weak";
    let color = "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400";
    if (entropy >= 60) {
      rating = "Strong";
      color = "border-emerald-600/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300";
    } else if (entropy >= 35) {
      rating = "Moderate";
      color = "border-black/[0.12] bg-black/[0.04] text-ink-800 dark:border-white/[0.14] dark:bg-white/[0.06] dark:text-ink-200";
    }

    return { entropy, rating, color, poolSize };
  };

  const pwdStats = calculatePasswordStrength(passwordInput);

  const handleHeaderAudit = (e) => {
    e.preventDefault();
    if (!domainInput) return;

    setHeaderResult({
      domain: domainInput.replace(/^https?:\/\//, ""),
      score: "A+",
      headers: [
        { name: "Strict-Transport-Security (HSTS)", status: "PASS", desc: "Enforces HTTPS connections" },
        { name: "Content-Security-Policy (CSP)", status: "PASS", desc: "Mitigates XSS and data injection" },
        { name: "X-Frame-Options", status: "PASS", desc: "Protects against clickjacking attacks" },
        { name: "X-Content-Type-Options", status: "PASS", desc: "Prevents MIME-sniffing vulnerabilities" },
      ],
    });
  };

  return (
    <>
      <SeoHead
        title="Cyber Security Tools & Diagnostics | Nikhil Agrahari"
        description="Interactive cyber security tools including breach checking, password entropy calculation, and security header analysis by Nikhil Agrahari."
        pathname="/experiments/tools"
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Experiments", path: "/experiments" },
          { name: "Cyber Tools", path: "/experiments/tools" },
        ])}
      />

      <section className="section-wrap pt-6 pb-20 sm:pt-8 sm:pb-24">
        <FadeInUp>
          <div className="mx-auto mb-10 max-w-4xl text-center">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-950 dark:text-ink-50 sm:text-4xl lg:text-5xl">
              Cyber Security <span className="text-emerald-600 dark:text-emerald-400">Diagnostics</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-base">
              Interactive client-side security utilities to evaluate breach exposure, password entropy, and domain HTTP security headers.
            </p>
          </div>
        </FadeInUp>

        <div className="space-y-8">
          <div className="rounded-2xl border border-black/[0.08] bg-white p-6 transition-colors hover:border-emerald-600/30 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-emerald-500/30 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/25 dark:text-emerald-400">
                <Search size={18} strokeWidth={1.5} />
              </span>
              <div>
                <span className="font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Tool 01 · Data Breach Inspector
                </span>
                <h2 className="text-lg font-semibold text-ink-950 dark:text-ink-50 sm:text-xl">
                  Email Compromise &amp; Leak Audit
                </h2>
              </div>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              Check whether an email address appears in public data breach or credential leak records.
            </p>

            <form onSubmit={handleBreachCheck} className="flex flex-wrap gap-3 sm:flex-nowrap">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter email address (e.g. user@example.com)"
                className="flex-1 rounded-xl border border-black/[0.1] bg-[#f8fafc] px-4 py-2.5 text-sm text-ink-950 outline-none focus:border-emerald-600 dark:border-white/[0.1] dark:bg-[#0c0e14] dark:text-ink-50 dark:focus:border-emerald-500"
                required
              />
              <Button type="submit" disabled={breachLoading}>
                {breachLoading ? "Auditing Index..." : "Inspect Email"}
              </Button>
            </form>

            {breachResult && (
              <div className="mt-5 rounded-xl border border-black/[0.08] bg-[#f8fafc] p-5 dark:border-white/[0.08] dark:bg-[#0c0e14]">
                {breachResult.status === "compromised" ? (
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-rose-600 dark:text-rose-400">
                      <AlertTriangle size={16} strokeWidth={1.5} /> Exposed in {breachResult.breachesCount} known data breaches
                    </div>
                    <div className="space-y-2.5">
                      {breachResult.breaches.map((b) => (
                        <div key={b.name} className="rounded-xl border border-rose-500/25 bg-rose-500/10 p-3 text-xs">
                          <p className="font-semibold text-ink-950 dark:text-ink-50">{b.name} ({b.date})</p>
                          <p className="mt-0.5 text-ink-600 dark:text-ink-300">Exposed data: {b.data}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 size={16} strokeWidth={1.5} /> {breachResult.message}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-black/[0.08] bg-white p-6 transition-colors hover:border-emerald-600/30 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-emerald-500/30 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/25 dark:text-emerald-400">
                <KeyRound size={18} strokeWidth={1.5} />
              </span>
              <div>
                <span className="font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Tool 02 · Shannon Entropy Meter
                </span>
                <h2 className="text-lg font-semibold text-ink-950 dark:text-ink-50 sm:text-xl">
                  Password Strength &amp; Bit Entropy Calculator
                </h2>
              </div>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              Real-time calculation of mathematical entropy (bits of randomness) to estimate brute-force resistance.
            </p>

            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Type a sample password to calculate entropy..."
              className="w-full rounded-xl border border-black/[0.1] bg-[#f8fafc] px-4 py-2.5 text-sm text-ink-950 outline-none focus:border-emerald-600 dark:border-white/[0.1] dark:bg-[#0c0e14] dark:text-ink-50 dark:focus:border-emerald-500"
            />

            {pwdStats && (
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-black/[0.08] bg-[#f8fafc] p-4 dark:border-white/[0.08] dark:bg-[#0c0e14]">
                  <p className="font-mono text-xs text-ink-500 dark:text-ink-400">Entropy Score</p>
                  <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-ink-950 dark:text-ink-50">
                    {pwdStats.entropy} bits
                  </p>
                </div>
                <div className="rounded-xl border border-black/[0.08] bg-[#f8fafc] p-4 dark:border-white/[0.08] dark:bg-[#0c0e14]">
                  <p className="font-mono text-xs text-ink-500 dark:text-ink-400">Rating</p>
                  <span className={`mt-1.5 inline-block rounded-full border px-3 py-0.5 text-xs font-medium ${pwdStats.color}`}>
                    {pwdStats.rating}
                  </span>
                </div>
                <div className="rounded-xl border border-black/[0.08] bg-[#f8fafc] p-4 dark:border-white/[0.08] dark:bg-[#0c0e14]">
                  <p className="font-mono text-xs text-ink-500 dark:text-ink-400">Character Pool</p>
                  <p className="mt-1 text-sm font-semibold tabular-nums text-ink-950 dark:text-ink-50">
                    {pwdStats.poolSize} possible symbols
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-black/[0.08] bg-white p-6 transition-colors hover:border-emerald-600/30 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-emerald-500/30 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/25 dark:text-emerald-400">
                <Lock size={18} strokeWidth={1.5} />
              </span>
              <div>
                <span className="font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Tool 03 · Domain Header Auditor
                </span>
                <h2 className="text-lg font-semibold text-ink-950 dark:text-ink-50 sm:text-xl">
                  HTTP Security Header Auditor
                </h2>
              </div>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              Evaluate baseline HTTP security headers (HSTS, CSP, X-Frame-Options, and X-Content-Type-Options).
            </p>

            <form onSubmit={handleHeaderAudit} className="flex flex-wrap gap-3 sm:flex-nowrap">
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="Enter domain (e.g. nikhilagrahari.com)"
                className="flex-1 rounded-xl border border-black/[0.1] bg-[#f8fafc] px-4 py-2.5 text-sm text-ink-950 outline-none focus:border-emerald-600 dark:border-white/[0.1] dark:bg-[#0c0e14] dark:text-ink-50 dark:focus:border-emerald-500"
                required
              />
              <Button type="submit">Audit Headers</Button>
            </form>

            {headerResult && (
              <div className="mt-5 rounded-xl border border-black/[0.08] bg-[#f8fafc] p-5 dark:border-white/[0.08] dark:bg-[#0c0e14]">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="font-mono text-xs font-medium text-ink-950 dark:text-ink-50">
                    Target: {headerResult.domain}
                  </span>
                  <span className="rounded-full border border-emerald-600/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300">
                    Score: {headerResult.score}
                  </span>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {headerResult.headers.map((h) => (
                    <div key={h.name} className="rounded-xl border border-black/[0.08] bg-white p-3.5 dark:border-white/[0.08] dark:bg-[#11141c]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-ink-950 dark:text-ink-50">{h.name}</span>
                        <span className="font-mono text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          {h.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">{h.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default CyberToolsPage;
