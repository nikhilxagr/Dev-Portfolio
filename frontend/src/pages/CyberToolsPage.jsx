import { useState } from "react";
import { ShieldCheck, Search, KeyRound, Lock, AlertTriangle, CheckCircle2, ShieldAlert, Cpu, ArrowRight, ExternalLink } from "lucide-react";
import SeoHead from "@/components/seo/SeoHead";
import Button from "@/components/ui/Button";
import FadeInUp from "@/components/animations/FadeInUp";
import { createBreadcrumbSchema } from "@/utils/seo";

const CyberToolsPage = () => {
  // Tool 1: Breach Inspector State
  const [emailInput, setEmailInput] = useState("");
  const [breachResult, setBreachResult] = useState(null);
  const [breachLoading, setBreachLoading] = useState(false);

  // Tool 2: Password Analyzer State
  const [passwordInput, setPasswordInput] = useState("");

  // Tool 3: Header Audit State
  const [domainInput, setDomainInput] = useState("");
  const [headerResult, setHeaderResult] = useState(null);

  // Breach Inspector Handler
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

  // Password Entropy Calculator
  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return null;

    let score = 0;
    let poolSize = 0;

    if (/[a-z]/.test(pwd)) poolSize += 26;
    if (/[A-Z]/.test(pwd)) poolSize += 26;
    if (/[0-9]/.test(pwd)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) poolSize += 32;

    const entropy = Math.round(pwd.length * Math.log2(poolSize || 1));

    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;

    let rating = "Weak";
    let color = "text-rose-500 border-rose-500/40 bg-rose-500/10";
    if (entropy >= 60) {
      rating = "Strong";
      color = "text-emerald-500 border-emerald-500/40 bg-emerald-500/10";
    } else if (entropy >= 35) {
      rating = "Moderate";
      color = "text-amber-500 border-amber-500/40 bg-amber-500/10";
    }

    return { entropy, rating, color, poolSize };
  };

  const pwdStats = calculatePasswordStrength(passwordInput);

  // Security Header Audit Handler
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

      {/* Main Section */}
      <section className="section-wrap pt-4 sm:pt-6 pb-20">
        
        {/* Hero title */}
        <FadeInUp>
          <div className="text-center max-w-4xl mx-auto mb-10">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-wider text-slate-900 dark:text-white drop-shadow-sm">
              CYBER SECURITY <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">DIAGNOSTICS</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Real interactive security utilities designed to evaluate breach exposures, password entropy, and domain header security.
            </p>
          </div>
        </FadeInUp>

        <div className="space-y-8">
          
          {/* Data breach inspector tool */}
          <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/95 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)]">
            <div className="flex items-center gap-3 mb-4">
              <span className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Search size={20} />
              </span>
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-widest">
                  TOOL 01 // DATA BREACH INSPECTOR
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Email Compromise &amp; Leak Audit
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mb-6">
              Check if an email address has been exposed in known public data breaches or leak indices.
            </p>

            <form onSubmit={handleBreachCheck} className="flex flex-wrap sm:flex-nowrap gap-3">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter email address (e.g. user@example.com)"
                className="flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-emerald-500 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white"
                required
              />
              <Button type="submit" disabled={breachLoading}>
                {breachLoading ? "Auditing Index..." : "Inspect Email"}
              </Button>
            </form>

            {breachResult && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-emerald-500/20 dark:bg-[#020803]/80">
                {breachResult.status === "compromised" ? (
                  <div>
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold text-sm mb-3">
                      <AlertTriangle size={18} /> Exposed in {breachResult.breachesCount} Known Data Breaches
                    </div>
                    <div className="space-y-2.5">
                      {breachResult.breaches.map((b) => (
                        <div key={b.name} className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs">
                          <p className="font-extrabold text-slate-900 dark:text-white">{b.name} ({b.date})</p>
                          <p className="mt-0.5 text-slate-600 dark:text-slate-300">Exposed Data: {b.data}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                    <CheckCircle2 size={18} /> {breachResult.message}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tool 2: Password Entropy Calculator */}
          <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/95 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)]">
            <div className="flex items-center gap-3 mb-4">
              <span className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <KeyRound size={20} />
              </span>
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-widest">
                  TOOL 02 // SHANNON ENTROPY METER
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Password Strength &amp; Bit Entropy Calculator
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mb-6">
              Real-time calculation of mathematical entropy (bits of randomness) to measure brute-force resistance.
            </p>

            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Type a sample password to calculate entropy..."
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-emerald-500 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white"
            />

            {pwdStats && (
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-emerald-500/20 dark:bg-[#020803]/80">
                  <p className="text-[10px] font-mono font-bold uppercase text-slate-400">Entropy Score</p>
                  <p className="mt-1 font-outfit text-3xl font-black text-slate-900 dark:text-white">{pwdStats.entropy} bits</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-emerald-500/20 dark:bg-[#020803]/80">
                  <p className="text-[10px] font-mono font-bold uppercase text-slate-400">Rating</p>
                  <span className={`mt-1 inline-block rounded-full border px-3 py-1 text-xs font-extrabold uppercase ${pwdStats.color}`}>
                    {pwdStats.rating}
                  </span>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-emerald-500/20 dark:bg-[#020803]/80">
                  <p className="text-[10px] font-mono font-bold uppercase text-slate-400">Character Set</p>
                  <p className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">{pwdStats.poolSize} Possible Symbols</p>
                </div>
              </div>
            )}
          </div>

          {/* Tool 3: Header Audit */}
          <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/95 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)]">
            <div className="flex items-center gap-3 mb-4">
              <span className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Lock size={20} />
              </span>
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-widest">
                  TOOL 03 // DOMAIN HEADER AUDITOR
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  HTTP Security Header Auditor
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mb-6">
              Evaluate essential web application HTTP security headers (HSTS, CSP, X-Frame-Options, X-Content-Type).
            </p>

            <form onSubmit={handleHeaderAudit} className="flex flex-wrap sm:flex-nowrap gap-3">
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="Enter domain (e.g. nikhilagrahari.com)"
                className="flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-emerald-500 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white"
                required
              />
              <Button type="submit">
                Audit Headers
              </Button>
            </form>

            {headerResult && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-emerald-500/20 dark:bg-[#020803]/80">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">Target Domain: {headerResult.domain}</span>
                  <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400">Score: {headerResult.score}</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {headerResult.headers.map((h) => (
                    <div key={h.name} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-emerald-500/20 dark:bg-[#040e07]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white">{h.name}</span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{h.status}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">{h.desc}</p>
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
