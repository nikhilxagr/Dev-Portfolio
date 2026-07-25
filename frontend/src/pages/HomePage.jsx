import { useEffect, useRef, useState, useCallback } from "react";
import {
  ArrowRight,
  Braces,
  Code2,
  Cpu,
  Database,
  Sparkles,
  ShieldCheck,
  Download,
  ChevronDown,
  Terminal,
  X,
  RotateCcw,
  ExternalLink,
  Filter,
  GitBranch,
  Lock,
  Zap,
  Globe,
  CheckCircle2,
  Activity,
  BookOpen,
  CalendarCheck,
  Target,
  Layers,
} from "lucide-react";
import { FaGithub, FaLinkedinIn, FaWhatsapp, FaInstagram } from "react-icons/fa";
import Button from "@/components/ui/Button";
import SectionTitle from "@/components/ui/SectionTitle";
import SkillLogoBadge from "@/components/ui/SkillLogoBadge";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import ProjectCard from "@/components/ui/ProjectCard";
import BlogCard from "@/components/ui/BlogCard";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import { StaggerGrid, StaggerItem } from "@/components/animations/StaggerGrid";
import { useTheme } from "@/context/ThemeContext";
import { getProjects } from "@/services/projects.service";
import { getBlogs } from "@/services/blogs.service";
import { getErrorMessage } from "@/services/api";
import { mergeStaticAndApiContent } from "@/services/contentMerge";
import {
  createPersonSchema,
  createProfessionalServiceSchema,
  createWebSiteSchema,
} from "@/utils/seo";
import {
  BLOG_LINKS,
  HERO_CONTENT,
  MAIN_SKILL_SHOWCASE,
  PRACTICALS,
  QUICK_CONTACT,
  SERVICE_OFFERINGS,
  SIGNATURE_PROJECTS,
  SITE_PROFILE,
  STATS_METRICS,
} from "@/constants/siteData";
import { motion, useInView } from "framer-motion";

const HERO_ROLES = [
  "Full Stack Developer",
  "Cyber Security Enthusiast",
  "MERN Stack Engineer",
  "AppSec Practitioner",
  "Problem Solver",
];

function useTypewriter(words, { typingSpeed = 80, deletingSpeed = 45, pauseMs = 1800 } = {}) {
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex % words.length];
    let timeout;
    if (!isDeleting && displayText === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), pauseMs);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
    } else {
      const speed = isDeleting ? deletingSpeed : typingSpeed;
      timeout = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? currentWord.slice(0, displayText.length - 1)
            : currentWord.slice(0, displayText.length + 1)
        );
      }, speed);
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseMs]);

  return displayText;
}

const CvssBadge = ({ score, level }) => {
  const levelClass = {
    critical: "cvss-critical",
    high: "cvss-high",
    medium: "cvss-medium",
    low: "cvss-low",
  }[level] || "cvss-low";

  return (
    <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${levelClass}`}>
      {score !== "N/A" && <span>CVSS {score}</span>}
      <span className="opacity-60">|</span>
      <span>{level.toUpperCase()}</span>
    </span>
  );
};

const PARTICLES = [
  { top: "12%",  left: "8%",  size: 3, delay: 0,    dur: 7  },
  { top: "28%",  left: "18%", size: 2, delay: 1.2,  dur: 9  },
  { top: "60%",  left: "6%",  size: 4, delay: 0.5,  dur: 11 },
  { top: "80%",  left: "22%", size: 2, delay: 2,    dur: 8  },
  { top: "18%",  left: "88%", size: 3, delay: 0.8,  dur: 10 },
  { top: "45%",  left: "92%", size: 2, delay: 1.5,  dur: 7  },
  { top: "72%",  left: "85%", size: 4, delay: 0.3,  dur: 12 },
  { top: "5%",   left: "55%", size: 2, delay: 1.8,  dur: 9  },
  { top: "90%",  left: "48%", size: 3, delay: 0.6,  dur: 8  },
  { top: "38%",  left: "75%", size: 2, delay: 2.5,  dur: 11 },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut", delay },
});

const SOCIAL_ICON_LINKS = [
  {
    icon: FaGithub,
    href: QUICK_CONTACT.github,
    label: "GitHub",
    hoverClass: "hover:border-slate-300 hover:bg-slate-300/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]",
  },
  {
    icon: FaLinkedinIn,
    href: QUICK_CONTACT.linkedin,
    label: "LinkedIn",
    hoverClass: "hover:border-[#0A66C2] hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:shadow-[0_0_15px_rgba(10,102,194,0.35)]",
  },
  {
    icon: FaWhatsapp,
    href: QUICK_CONTACT.whatsapp,
    label: "WhatsApp",
    hoverClass: "hover:border-[#25D366] hover:bg-[#25D366]/10 hover:text-[#25D366] hover:shadow-[0_0_15px_rgba(37,211,102,0.35)]",
  },
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/nikhilxagr/",
    label: "Instagram",
    hoverClass: "hover:border-[#E1306C] hover:bg-[#E1306C]/10 hover:text-[#E1306C] hover:shadow-[0_0_15px_rgba(225,48,108,0.35)]",
  },
];

const HeroSection = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const isMobile = window.innerWidth < 768;
    const particles = [];
    const particleCount = isMobile ? 14 : 45;
    const connectionDistance = isMobile ? 85 : 110;
    const sqConnectionDistance = connectionDistance * connectionDistance;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * (isMobile ? 0.3 : 0.45);
        this.vy = (Math.random() - 0.5) * (isMobile ? 0.3 : 0.45);
        this.radius = Math.random() * 1.5 + 1;
        this.color = Math.random() > 0.4
          ? "rgba(74, 222, 128, 0.40)"   // dev green
          : "rgba(56, 189, 248, 0.45)";  // cyber blue
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < sqConnectionDistance) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / connectionDistance) * 0.16;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }
    };

    let isScrolling = false;
    let scrollTimeout;
    const handleScroll = () => {
      if (!isMobile) return;
      isScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 120);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const animate = () => {
      if (!isScrolling) {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p) => {
          p.update();
          p.draw();
        });

        drawConnections();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <section className="relative min-h-[94vh] flex flex-col justify-center overflow-hidden section-wrap pt-12 pb-20 sm:pt-16 sm:pb-24">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-65" />

        <svg className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-[0.015]" viewBox="0 0 100 100" preserveAspectRatio="none">
          <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="font-display font-black text-[28px]" fill="none" stroke="#38bdf8" strokeWidth="0.08">
            DEVSEC
          </text>
        </svg>

        <div
          className="hero-aurora-orb-1 absolute -top-24 -left-24 h-[500px] w-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,0.45) 0%, rgba(14,165,233,0.18) 50%, transparent 72%)", filter: "blur(70px)" }}
        />
        <div
          className="hero-aurora-orb-2 absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full opacity-18"
          style={{ background: "radial-gradient(circle, rgba(34,197,94,0.42) 0%, rgba(74,222,128,0.15) 55%, transparent 72%)", filter: "blur(80px)" }}
        />
        <div
          className="hero-aurora-orb-3 absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full opacity-12"
          style={{ background: "radial-gradient(circle, rgba(20,184,166,0.35) 0%, rgba(56,189,248,0.12) 55%, transparent 72%)", filter: "blur(90px)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: "linear-gradient(rgba(56,189,248,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              top: p.top, left: p.left,
              width: p.size, height: p.size,
              background: i % 3 === 0 ? "rgba(56,189,248,0.55)" : "rgba(74,222,128,0.50)",
              animation: `particle-float ${p.dur}s ease-in-out ${p.delay}s infinite`,
              boxShadow: i % 3 === 0
                ? `0 0 ${p.size * 3}px rgba(56,189,248,0.55)`
                : `0 0 ${p.size * 3}px rgba(74,222,128,0.55)`,
            }}
          />
        ))}
      </div>

      <div className="relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
        <div className="order-2 flex flex-col text-center sm:text-left lg:order-1">

          <motion.div {...fadeUp(0.05)} className="mb-4 flex justify-center sm:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-green-400/35 bg-green-400/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-green-400">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 green-glow-pulse" />
              WELCOME TO MY PORTFOLIO
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.12)}
            className="font-display text-5xl font-black uppercase tracking-tight text-white sm:text-6xl lg:text-[4.6rem] leading-[0.93]"
          >
            Nikhil <span className="text-glow-green text-green-400">Agrahari</span>
          </motion.h1>

          <motion.div {...fadeUp(0.18)} className="mt-4 flex justify-center sm:justify-start">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-green-300">
              // CYBER SECURITY &amp; WEB DEVELOPER
            </span>
          </motion.div>

          <motion.div {...fadeUp(0.24)} className="mt-4 flex flex-wrap justify-center gap-2.5 sm:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-1.5 text-xs font-semibold text-slate-200">
              Python
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-1.5 text-xs font-semibold text-slate-200">
              Full Stack
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-1.5 text-xs font-semibold text-slate-200">
              SOC Analyst
            </span>
          </motion.div>

          <motion.h2
            {...fadeUp(0.30)}
            className="font-display mt-6 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl leading-tight"
          >
            Building Secure &amp;<br />
            <span className="text-green-300">Scalable Applications</span>
          </motion.h2>

          <motion.div {...fadeUp(0.36)} className="mt-5 space-y-2.5 text-sm text-slate-400">
            <p className="flex items-center justify-center gap-2 sm:justify-start">
              BCA at BBDU Lucknow, India
            </p>
            <p className="flex items-center justify-center gap-2 sm:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-green-400/20 bg-green-400/5 px-3 py-1.5 text-xs font-semibold text-green-400">
                Open for Internships &amp; Freelance
              </span>
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.42)} className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <a
              href="/security"
              className="group inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-xs font-black uppercase tracking-wider text-black transition-all duration-300 hover:-translate-y-1 hover:bg-green-400 hover:shadow-[0_8px_24px_rgba(34,197,94,0.45)]"
            >
              <ShieldCheck size={14} />
              View Cyber Labs
            </a>
            <a
              href="/services"
              className="group inline-flex items-center gap-2 rounded-xl border border-green-400/50 bg-green-400/10 px-5 py-3 text-xs font-black uppercase tracking-wider text-green-400 transition-all duration-300 hover:-translate-y-1 hover:bg-green-400/20"
            >
              <Zap size={14} />
              Book Service
            </a>
            <a
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-green-400/30 hover:text-green-300"
            >
              View Projects <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          </motion.div>

          <motion.div {...fadeUp(0.48)} className="mt-6 flex items-center justify-center gap-2.5">
            {SOCIAL_ICON_LINKS.map(({ icon: Icon, href, label, hoverClass }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
                className={`group relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all duration-300 ${hoverClass}`}
              >
                <Icon size={17} className="transition-transform duration-200 group-hover:scale-110" />
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.90, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="order-1 mx-auto flex w-full max-w-sm justify-center lg:order-2 lg:max-w-md xl:max-w-lg"
        >
          {SITE_PROFILE.profileImage ? (
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-full bg-green-500/20 blur-3xl scale-125" />
              <div className="relative group">
                <div className="absolute -inset-6 rounded-full border border-dashed border-green-400/25 animate-[spin_40s_linear_infinite]" />
                <div className="absolute -inset-3 rounded-full border border-green-400/30 shadow-[0_0_50px_rgba(34,197,94,0.2)]" />
                <div className="relative h-[320px] w-[320px] sm:h-[380px] sm:w-[380px] lg:h-[420px] lg:w-[420px] xl:h-[460px] xl:w-[460px] overflow-hidden rounded-full border-[5px] border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.4)] bg-green-950 transition-transform duration-500 hover:scale-[1.02]">
                  <img
                    src={SITE_PROFILE.profileImage}
                    alt={SITE_PROFILE.profileImageAlt}
                    className="h-full w-full object-cover object-center"
                    width={460}
                    height={460}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                </div>
                <div className="absolute bottom-2 right-6 sm:right-8 rounded-full border-2 border-green-400 bg-green-500 px-5 py-1.5 text-xs sm:text-sm font-black uppercase tracking-wider text-black shadow-[0_6px_25px_rgba(34,197,94,0.6)]">
                  <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-black animate-pulse" />
                  AVAILABLE!
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Scroll</span>
        <ChevronDown size={15} className="text-green-400 animate-bounce" />
      </motion.div>
    </section>
  );
};

const StatsBar = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="section-wrap section-divider pt-6 pb-6 sm:pt-8 sm:pb-8">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {STATS_METRICS.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="stat-card-green flex flex-col items-center gap-1 p-4 text-center sm:p-5 group"
          >
            <p className={`font-outfit text-2xl font-black sm:text-3xl ${item.accentColor || "text-green-400"}`}>
              {item.value}
            </p>
            <p className="text-xs font-semibold text-slate-200 dark:text-slate-200">{item.label}</p>
            <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">{item.detail}</p>
          </a>
        ))}
      </div>
    </section>
  );
};

const FULLSTACK_OBJECTIVES = [
  { icon: Layers,       text: "Build full-stack MERN apps with clean, production-ready architecture" },
  { icon: Code2,        text: "Deliver responsive UIs (React/Next.js) with smooth UX & component reuse" },
  { icon: GitBranch,    text: "Design and consume RESTful APIs with Express.js, validation & error handling" },
  { icon: CheckCircle2, text: "Ship with Git workflows, Vercel/Render deployments & documentation habits" },
];

const SECURITY_OBJECTIVES = [
  { icon: ShieldCheck,  text: "Apply OWASP Top 10 methodology to identify real web app vulnerabilities" },
  { icon: Target,       text: "TryHackMe Global Top 1% — 275+ rooms in recon, privesc & web exploitation" },
  { icon: BookOpen,     text: "Practise Burp Suite intercept, SQLMap, Nmap scanning in controlled lab environments" },
  { icon: CalendarCheck,text: "Write security-aware backend code: JWT hardening, Helmet.js, rate limiting" },
];

const DualRoleIdentity = () => {
  return (
    <section className="section-wrap section-divider pt-8 sm:pt-12">
      <FadeInUp>
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white dark:bg-[#050d14] shadow-xl dark:border-green-400/22 dark:bg-gradient-to-br dark:from-[#050d14] dark:via-[#082218] dark:to-[#050d14] dark:shadow-none p-6 sm:p-8 mb-6">
          <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-green-500/10 dark:bg-green-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-emerald-500/8 dark:bg-emerald-400/8 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-green-600 dark:text-green-400">About Me</p>
            <h2 className="mt-2 text-4xl font-black text-slate-900 dark:text-white sm:text-5xl lg:text-6xl leading-[0.95]">
              Who I Am
            </h2>
            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto]">
              <div className="space-y-4 max-w-2xl">
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  I'm a <span className="font-bold text-green-600 dark:text-green-400">BCA student at BBD University, Lucknow</span>, combining full-stack engineering with practical cybersecurity. I don't just learn tools — I build real products and solve real problems.
                </p>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  My approach: write clean code, think about security from day one, and document everything. Whether it's a MERN application or a security lab writeup, I care about the quality of my output.
                </p>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Currently seeking <span className="font-semibold text-slate-900 dark:text-white">internship opportunities</span> in Full Stack Engineering, Application Security, or DevSecOps — where both my skills create real value.
                </p>
              </div>
              <div className="flex flex-col gap-2 lg:items-end">
                <div className="flex flex-wrap gap-2 lg:flex-col">
                  {["BCA · BBD University", "Lucknow, India 🇮🇳", "Open to Internships", "Security-First Mindset"].map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1.5 rounded-lg border border-green-500/25 bg-green-500/10 text-green-700 dark:border-green-400/22 dark:bg-green-400/8 dark:text-green-300 px-3 py-1.5 text-xs font-semibold">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 dark:bg-green-400" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.22em] text-green-600 dark:text-green-400">Dual-Role Profile</p>
          <h3 className="mt-1.5 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">What I Can Deliver</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Clear objectives across both roles — no filler, no guesses.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <article className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white dark:bg-[#050d14] shadow-lg dark:border-green-400/25 dark:bg-gradient-to-br dark:from-[#050d14] dark:via-[#082218] dark:to-[#050d14] dark:shadow-none p-6 sm:p-7 backdrop-blur-md">
            <div className="pointer-events-none absolute -top-12 -right-10 h-36 w-36 rounded-full bg-green-500/10 dark:bg-green-400/12 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-green-500/30 bg-green-500/10 text-green-600 dark:border-green-400/35 dark:bg-green-400/12 dark:text-green-400">
                  <Code2 size={22} />
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-green-600/70 dark:text-green-400/70">Role 01</p>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Full Stack Developer</h4>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["React", "Node.js", "MongoDB", "Express", "Next.js"].map(t => (
                  <span key={t} className="rounded-md border border-green-500/20 bg-green-50 text-green-700 dark:border-green-400/22 dark:bg-green-400/8 dark:text-green-300 px-2 py-0.5 text-[10px] font-semibold">{t}</span>
                ))}
              </div>
              <ul className="mt-5 space-y-3">
                {FULLSTACK_OBJECTIVES.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-green-500/25 bg-green-500/10 text-green-600 dark:border-green-400/25 dark:bg-green-400/10 dark:text-green-400">
                      <Icon size={12} />
                    </span>
                    <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{text}</span>
                  </li>
                ))}
              </ul>
              <a href="/projects" className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors">
                View Full-Stack Projects <ArrowRight size={13} />
              </a>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white dark:bg-[#050d14] shadow-lg dark:border-cyan-500/25 dark:bg-gradient-to-br dark:from-[#050d14] dark:via-[#081e2e] dark:to-[#050d14] dark:shadow-none p-6 sm:p-7 backdrop-blur-md">
            <div className="pointer-events-none absolute -bottom-14 -left-10 h-36 w-36 rounded-full bg-emerald-500/10 dark:bg-cyan-400/12 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:border-cyan-400/35 dark:bg-cyan-400/12 dark:text-cyan-400">
                  <ShieldCheck size={22} />
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-600/70 dark:text-cyan-400/70">Role 02</p>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">CyberSec Practitioner</h4>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["Burp Suite", "Nmap", "Kali Linux", "OWASP", "TryHackMe"].map(t => (
                  <span key={t} className="rounded-md border border-emerald-500/20 bg-emerald-50 text-emerald-700 dark:border-cyan-400/22 dark:bg-cyan-400/8 dark:text-cyan-300 px-2 py-0.5 text-[10px] font-semibold">{t}</span>
                ))}
              </div>
              <ul className="mt-5 space-y-3">
                {SECURITY_OBJECTIVES.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-400">
                      <Icon size={12} />
                    </span>
                    <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{text}</span>
                  </li>
                ))}
              </ul>
              <a href="/security" className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors">
                View Security Labs <ArrowRight size={13} />
              </a>
            </div>
          </article>
        </div>
      </FadeInUp>
    </section>
  );
};

const TERMINAL_COMMANDS = {
  help: () => [
    { type: "info", text: "Available commands:" },
    { type: "cmd",  text: "  whoami        — About Nikhil" },
    { type: "cmd",  text: "  skills        — Tech stack & expertise" },
    { type: "cmd",  text: "  projects      — Featured projects" },
    { type: "cmd",  text: "  scan          — Security header scan of this portfolio" },
    { type: "cmd",  text: "  contact       — Contact info" },
    { type: "cmd",  text: "  cat resume.txt — Download resume" },
    { type: "cmd",  text: "  clear         — Clear terminal" },
  ],
  whoami: () => [
    { type: "info",    text: "nikhil@secops:~$  WHO AM I" },
    { type: "success", text: "  Name    : Nikhil Agrahari" },
    { type: "success", text: "  Role    : Full Stack Dev + CyberSec Enthusiast" },
    { type: "success", text: "  College : BCA · BBD University, Lucknow" },
    { type: "success", text: "  THM     : Top 1% Global · 275+ Rooms" },
    { type: "success", text: "  Status  : 🟢 Open for Internships" },
  ],
  skills: () => [
    { type: "info", text: "[FULL STACK]" },
    { type: "cmd",  text: "  ▸ React · Next.js · TypeScript · Tailwind CSS" },
    { type: "cmd",  text: "  ▸ Node.js · Express · REST APIs · MongoDB · Supabase" },
    { type: "info", text: "[SECURITY]" },
    { type: "cmd",  text: "  ▸ Burp Suite · Nmap · Wireshark · Kali Linux" },
    { type: "cmd",  text: "  ▸ OWASP Top 10 · SQLMap · Metasploit · Steghide" },
    { type: "info", text: "[TOOLS]" },
    { type: "cmd",  text: "  ▸ Git · GitHub · Postman · Vercel · Render · Linux" },
  ],
  projects: () => [
    { type: "info",    text: "[ Featured Projects ]" },
    { type: "success", text: "  01. Dev Portfolio    → nikhilxagr.vercel.app" },
    { type: "success", text: "  02. snapURL          → snapurl-url-shortner.vercel.app" },
    { type: "success", text: "  03. Fast Feast       → fastfeast-agr.netlify.app" },
    { type: "success", text: "  04. AI Code Reviewer → github.com/nikhilxagr" },
    { type: "info",    text: "  → Run: open /projects  to view all" },
  ],
  scan: () => [
    { type: "info",    text: "Initiating security scan on this portfolio..." },
    { type: "cmd",     text: "  [●] Checking HTTPS enforcement......... ✅ PASS" },
    { type: "cmd",     text: "  [●] Content-Security-Policy header...... ✅ PASS" },
    { type: "cmd",     text: "  [●] X-Frame-Options (Clickjacking)...... ✅ PASS" },
    { type: "cmd",     text: "  [●] Strict-Transport-Security (HSTS).... ✅ PASS" },
    { type: "cmd",     text: "  [●] X-Content-Type-Options.............. ✅ PASS" },
    { type: "cmd",     text: "  [●] Referrer-Policy..................... ✅ PASS" },
    { type: "cmd",     text: "  [●] Snyk Dependency Audit.............. ✅ 0 CRITICAL" },
    { type: "success", text: "  RESULT: Security Grade A+ — 0 Vulnerabilities Found" },
  ],
  contact: () => [
    { type: "info",    text: "[ Contact Info ]" },
    { type: "success", text: `  Email  : ${QUICK_CONTACT.email}` },
    { type: "success", text: `  GitHub : github.com/nikhilxagr` },
    { type: "success", text: `  LinkedIn: linkedin.com/in/nikhilxagr` },
    { type: "success", text: `  THM    : tryhackme.com/p/nikhilxagr` },
  ],
  "cat resume.txt": () => [
    { type: "info",    text: "Fetching resume file..." },
    { type: "success", text: "  Downloading: WebDev_Resume.pdf ..." },
    { type: "success", text: "  ✅ Download triggered!" },
  ],
};

const InteractiveTerminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lines, setLines] = useState([{ type: "info", text: 'Type "help" to see all commands.' }]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  const handleCommand = useCallback((raw) => {
    const cmd = raw.trim().toLowerCase();
    const newLines = [{ type: "prompt", text: `nikhil@secops:~$ ${raw}` }];

    if (cmd === "clear") {
      setLines([{ type: "info", text: 'Terminal cleared. Type "help" for commands.' }]);
      setHistory(h => [raw, ...h]);
      setHistoryIdx(-1);
      setInput("");
      return;
    }

    if (cmd === "cat resume.txt") {
      const link = document.createElement("a");
      link.href = QUICK_CONTACT.resumeFullStack;
      link.download = "Nikhil_Resume.pdf";
      link.click();
    }

    const handler = TERMINAL_COMMANDS[cmd];
    if (handler) {
      newLines.push(...handler());
    } else if (cmd !== "") {
      newLines.push({ type: "error", text: `  bash: ${raw}: command not found. Type "help".` });
    }

    setLines(prev => [...prev, ...newLines]);
    setHistory(h => [raw, ...h.slice(0, 20)]);
    setHistoryIdx(-1);
    setInput("");
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { handleCommand(input); }
    else if (e.key === "ArrowUp") { const idx = Math.min(historyIdx + 1, history.length - 1); setHistoryIdx(idx); setInput(history[idx] || ""); }
    else if (e.key === "ArrowDown") { const idx = Math.max(historyIdx - 1, -1); setHistoryIdx(idx); setInput(idx === -1 ? "" : history[idx] || ""); }
  };

  useEffect(() => {
    if (isOpen) { setTimeout(() => inputRef.current?.focus(), 100); }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const lineColor = { prompt: "text-green-400", info: "text-green-300/80", success: "text-green-200", cmd: "text-slate-300", error: "text-red-400" };

  return (
    <section className="section-wrap section-divider pt-8 sm:pt-12">
      <FadeInUp>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-green-400">Interactive</p>
            <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Hacker Terminal</h2>
          </div>
          <span className="hidden text-xs text-slate-500 sm:block">Try: whoami · skills · scan · projects</span>
        </div>

        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="w-full rounded-2xl border border-green-400/30 bg-[#020c02] p-5 text-left transition-all duration-300 hover:border-green-400/55 hover:shadow-[0_0_24px_rgba(34,197,94,0.15)] group"
            aria-label="Open terminal"
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-slate-500">nikhil-portfolio — bash</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="font-mono text-sm text-green-400">nikhil@secops:~$</span>
              <span className="terminal-cursor" />
              <span className="ml-2 text-xs text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">Click to open terminal</span>
            </div>
          </button>
        )}

        {isOpen && (
          <div className="terminal-widget terminal-slide-in overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-green-400/20 bg-[#010801] px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  <button onClick={() => setIsOpen(false)} className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[11px] text-slate-500 font-mono">nikhil-portfolio — bash — 80×24</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setLines([{ type: "info", text: 'Terminal cleared.' }])} title="Clear" className="text-slate-600 hover:text-green-400 transition-colors"><RotateCcw size={13} /></button>
                <button onClick={() => setIsOpen(false)} title="Close" className="text-slate-600 hover:text-red-400 transition-colors"><X size={14} /></button>
              </div>
            </div>

            <div className="h-72 overflow-y-auto p-4 font-mono text-xs leading-6 sm:h-80" onClick={() => inputRef.current?.focus()}>
              <p className="text-green-400/60 mb-3 text-[10px]">Nikhil Agrahari · Portfolio Terminal v1.0 · Type "help"</p>
              {lines.map((line, i) => (
                <p key={i} className={lineColor[line.type] || "text-slate-300"}>{line.text}</p>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="flex items-center gap-2 border-t border-green-400/15 bg-[#010801] px-4 py-2.5">
              <span className="shrink-0 font-mono text-xs text-green-400">nikhil@secops:~$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent font-mono text-xs text-green-200 outline-none placeholder:text-slate-600"
                placeholder="type a command..."
                autoComplete="off"
                spellCheck={false}
              />
              <button onClick={() => handleCommand(input)} className="shrink-0 rounded px-2 py-0.5 text-[10px] font-bold text-green-400 hover:bg-green-400/10 transition-colors">RUN</button>
            </div>
          </div>
        )}
      </FadeInUp>
    </section>
  );
};

const PROJECT_FILTER_TABS = ["All", "Web Dev", "Cyber Security", "AI"];

const PROJECT_SECURITY_BADGES = {
  "fast-feast":                  ["Responsive UI", "Clean Architecture"],
  "snapurl":                     ["JWT Ready", "REST API", "Rate Limiting"],
  "ai-powered-code-reviewer":    ["Auth & Access Control", "AI Integration", "HTTPS"],
};

const sortBlogsByDate = (blogs = []) =>
  [...blogs].sort((a, b) => {
    const timeA = new Date(a.publishedAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.publishedAt || b.createdAt || 0).getTime();
    return timeB - timeA;
  });

const staticLatestBlogs = sortBlogsByDate(BLOG_LINKS).slice(0, 3);

const homeFeaturedJourney = [
  {
    id: "android-nova-2026",
    title: "Android Nova 2.0",
    category: "WORKSHOPS",
    date: "July 17, 2026",
    subtitle: "// Cyber Intelligence Community Lucknow",
    description: "Attended Android Nova 2.0 — amazing experience learning about Android Development, AI, and future technologies while connecting with passionate developers.",
    imageUrl: "/images/journey/Android2.jpeg",
    tags: ["Android Development", "AI", "Mobile Development"],
  },
  {
    id: "assocham-samarth-2026",
    title: "SAMARTH INTERNSHIP 2.0",
    category: "INTERNSHIPS",
    date: "June 1 – July 15, 2026",
    subtitle: "// AKTU Labs & CSIR-CDRI",
    description: "Successfully completed Samarth 2.0 Internship — a comprehensive industrial program involving technical evaluations at CSIR-CDRI, AKTU Labs, and other premier institutions.",
    imageUrl: "/images/journey/Certi1.jpeg",
    tags: ["Industrial Workflows", "Research & Analysis", "System Engineering"],
  },
  {
    id: "techx26-hackathon-2026",
    title: "TechX26 Hackathon",
    category: "HACKATHONS",
    date: "February 2026",
    subtitle: "// BBD University",
    description: "Competed in TechX26 — built SmartMess, a smart hostel mess management platform for meal tracking, feedback, and attendance under 24 hours.",
    imageUrl: "/images/journey/techx1.jpeg",
    tags: ["React", "Node.js", "Hackathon", "MongoDB"],
  },
];

const statusConfig = {
  ready: { label: "Lab Complete", icon: CheckCircle2, color: "text-green-400 border-green-400/35 bg-green-400/10" },
  ongoing: { label: "Ongoing", icon: Activity, color: "text-yellow-400 border-yellow-400/35 bg-yellow-400/10" },
  "summary-ready": { label: "Summary Ready", icon: CheckCircle2, color: "text-emerald-400 border-emerald-400/35 bg-emerald-400/10" },
};

const SecurityLabCard = ({ item, index }) => {
  const StatusIcon = statusConfig[item.status]?.icon || CheckCircle2;
  const statusClasses = statusConfig[item.status]?.color || "text-green-600 border-green-500/35 bg-green-500/10 dark:text-green-400 dark:border-green-400/35 dark:bg-green-400/10";
  const statusLabel = statusConfig[item.status]?.label || item.status;

  return (
    <FadeInUp delay={index * 0.07}>
      <article className="relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:bg-[#050d14] shadow-md dark:border-cyan-400/22 dark:bg-gradient-to-br dark:from-[#050d14] dark:via-[#081e2e] dark:to-[#050d14] dark:shadow-none p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 dark:hover:border-cyan-400/35 hover:shadow-xl sm:p-6">
        <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-cyan-500/10 dark:bg-cyan-400/8 blur-3xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">{item.focus}</span>
          <div className="flex items-center gap-2">
            <CvssBadge score={item.cvssScore || "N/A"} level={item.cvssLevel || "low"} />
            <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusClasses}`}>
              <StatusIcon size={10} />
              {statusLabel}
            </span>
          </div>
        </div>

        <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white sm:text-lg">{item.title}</h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{item.summary}</p>

        {item.businessImpact && (
          <div className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-50/80 dark:border-cyan-400/15 dark:bg-cyan-400/5 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-400">Business Impact</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">{item.businessImpact}</p>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tools.map((tool) => (
            <span key={tool} className="rounded-md border border-slate-200 bg-slate-100 text-slate-700 dark:border-cyan-400/18 dark:bg-slate-900/50 dark:text-cyan-300 px-2 py-0.5 text-[10px] font-medium">
              {tool}
            </span>
          ))}
        </div>

        {item.proofUrl && (
          <a
            href={item.proofUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors"
          >
            <ExternalLink size={11} /> View {item.proofType}
          </a>
        )}
      </article>
    </FadeInUp>
  );
};

const skillVisualMap = {
  "Application Security": {
    cardClass: "border-slate-200/80 bg-white dark:bg-[#050d14] shadow-md dark:border-cyan-400/28 dark:bg-gradient-to-br dark:from-[#050d14] dark:via-[#081e2e] dark:to-[#050d14] dark:shadow-none",
    orbClass: "bg-cyan-500/10 dark:bg-cyan-400/18",
    iconWrapClass: "border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:border-cyan-400/40 dark:bg-cyan-400/12 dark:text-cyan-300",
    iconColorClass: "text-cyan-600 dark:text-cyan-300",
    titleClass: "text-cyan-700 dark:text-cyan-300",
    tagClass: "border-cyan-500/20 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:border-cyan-400/35 dark:bg-cyan-950/70 dark:text-cyan-300 dark:hover:bg-cyan-900/70",
  },
  "Full Stack Development": {
    cardClass: "border-slate-200/80 bg-white dark:bg-[#050d14] shadow-md dark:border-green-400/28 dark:bg-gradient-to-br dark:from-[#050d14] dark:via-[#082218] dark:to-[#050d14] dark:shadow-none",
    orbClass: "bg-green-500/10 dark:bg-green-400/18",
    iconWrapClass: "border-green-500/30 bg-green-500/10 text-green-600 dark:border-green-400/40 dark:bg-green-400/12 dark:text-green-300",
    iconColorClass: "text-green-600 dark:text-green-300",
    titleClass: "text-green-700 dark:text-green-300",
    tagClass: "border-green-500/20 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-400/35 dark:bg-green-950/70 dark:text-green-300 dark:hover:bg-green-900/70",
  },
  "Languages & Frameworks": {
    cardClass: "border-slate-200/80 bg-white dark:bg-[#050d14] shadow-md dark:border-lime-400/28 dark:bg-gradient-to-br dark:from-[#050d14] dark:via-[#122608] dark:to-[#050d14] dark:shadow-none",
    orbClass: "bg-lime-500/10 dark:bg-lime-400/18",
    iconWrapClass: "border-lime-500/30 bg-lime-500/10 text-lime-700 dark:border-lime-400/40 dark:bg-lime-400/12 dark:text-lime-300",
    iconColorClass: "text-lime-700 dark:text-lime-300",
    titleClass: "text-lime-800 dark:text-lime-300",
    tagClass: "border-lime-500/20 bg-lime-50 text-lime-800 hover:bg-lime-100 dark:border-lime-400/35 dark:bg-lime-950/70 dark:text-lime-300 dark:hover:bg-lime-900/70",
  },
};

const skillIconMap = {
  "Application Security": ShieldCheck,
  "Full Stack Development": Code2,
  "Languages & Frameworks": Braces,
};

// Main HomePage Component
const HomePage = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectError, setProjectError] = useState("");
  const [latestBlogs, setLatestBlogs] = useState(staticLatestBlogs);
  const [loadingLatestBlog, setLoadingLatestBlog] = useState(staticLatestBlogs.length === 0);
  const [latestBlogError, setLatestBlogError] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const { isDark } = useTheme();

  const githubUsername = QUICK_CONTACT.github.split("/").filter(Boolean).pop() || "nikhilxagr";
  const leetcodeUsername = QUICK_CONTACT.leetcode.split("/").filter(Boolean).pop() || "nikhilxagr";
  const tryHackMeUsername = QUICK_CONTACT.tryhackme.split("/").filter(Boolean).pop() || "nikhilxagr";
  const tryHackMeMetric = STATS_METRICS.find((item) => item.id === "tryhackme");
  const homePublicMetrics = STATS_METRICS.filter((item) => item.id !== "gfg");

  const githubStreakCardUrl = `https://streak-stats.demolab.com/?user=${githubUsername}&theme=${isDark ? "algolia" : "default"}&hide_border=true`;
  const leetcodeCardUrl = `https://leetcard.jacoblin.cool/${leetcodeUsername}?theme=${isDark ? "dark" : "light"}&ext=heatmap`;
  const tryHackMeCardUrl = `https://tryhackme-badges.s3.amazonaws.com/${tryHackMeUsername}.png`;

  useEffect(() => {
    const loadFeatured = async () => {
      setLoadingProjects(true);
      try {
        const response = await getProjects({ featured: true, limit: 3 });
        setFeaturedProjects(response.data || []);
      } catch (error) {
        setProjectError(getErrorMessage(error, "Unable to load featured projects now."));
      } finally { setLoadingProjects(false); }
    };

    const loadLatestBlog = async () => {
      setLoadingLatestBlog(staticLatestBlogs.length === 0);
      setLatestBlogError("");
      try {
        const response = await getBlogs({ limit: 2 });
        const apiBlogs = response.data || [];
        const mergedMap = new Map();
        BLOG_LINKS.forEach((staticBlog) => { mergedMap.set(staticBlog.slug, staticBlog); });
        apiBlogs.forEach((apiBlog) => {
          const staticBlog = BLOG_LINKS.find((item) => item.slug === apiBlog.slug);
          const merged = mergeStaticAndApiContent(staticBlog, apiBlog);
          mergedMap.set(merged.slug || apiBlog.slug || apiBlog._id, merged);
        });
        setLatestBlogs(sortBlogsByDate(Array.from(mergedMap.values())).slice(0, 2));
      } catch (error) {
        setLatestBlogs(staticLatestBlogs);
        if (staticLatestBlogs.length === 0) setLatestBlogError(getErrorMessage(error, "Unable to load latest blog right now."));
      } finally { setLoadingLatestBlog(false); }
    };

    loadFeatured().catch(() => undefined);
    loadLatestBlog().catch(() => undefined);
  }, []);

  const mergedFeaturedProjects =
    featuredProjects.length > 0
      ? featuredProjects.map((project) => {
          const staticProject = SIGNATURE_PROJECTS.find((item) => item.slug === project.slug);
          return mergeStaticAndApiContent(staticProject, project);
        })
      : SIGNATURE_PROJECTS.filter((item) => item.featured);

  const filteredProjects =
    projectFilter === "All"
      ? mergedFeaturedProjects
      : mergedFeaturedProjects.filter((p) => p.category === projectFilter);

  const liveDemoCount = mergedFeaturedProjects.filter((p) => Boolean(p.liveDemoUrl)).length;
  const fallbackProjectImage = "/images/placeholders/content-placeholder.svg";
  const handleProjectPreviewError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackProjectImage;
  };

  return (
    <>
      <SeoHead
        title="Nikhil Agrahari | Best Full Stack Developer in Lucknow & Prayagraj"
        description="Nikhil Agrahari is the Best Full Stack Developer & MERN Stack Engineer in Lucknow and Prayagraj, UP. Expert in React, Node.js, AI web application development & secure software engineering."
        pathname="/"
        image={SITE_PROFILE.profileImage}
        imageAlt="Nikhil Agrahari - Best Full Stack Developer in Lucknow & Prayagraj"
        keywords={[
          "best full stack developer in lucknow",
          "best full stack developer in prayagraj",
          "top full stack developer lucknow",
          "top full stack developer prayagraj",
          "full stack developer prayagraj",
          "full stack web developer lucknow",
          "best mern stack developer in lucknow",
          "best mern stack developer in prayagraj",
          "hire full stack developer in lucknow",
          "freelance web developer prayagraj",
          "nikhil agrahari full stack developer",
          "Nikhil BBD Lucknow",
        ]}
        jsonLd={[
          createPersonSchema(),
          createWebSiteSchema(),
          createProfessionalServiceSchema(),
        ]}
      />

      {/* S1: Hero */}
      <HeroSection />

      {/* S2: Stats Bar */}
      <StatsBar />

      {/* S3: Dual Role Identity */}
      <DualRoleIdentity />

      {/* S5: Featured Projects */}
      <section className="section-wrap section-divider pt-10">
        {/* Section Header */}
        <FadeInUp>
          <div className="relative text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-green-400/35 bg-green-400/10 px-3 py-1 font-display text-[10px] uppercase tracking-[0.2em] text-green-300 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              Featured Projects
            </p>
            <h2 className="mt-3 font-display text-4xl font-black sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-green-300 via-emerald-300 to-lime-300 bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300">
              Selected projects with implementation details, source code, and live demos.
            </p>
          </div>
        </FadeInUp>

        {/* Filter Chips */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {PROJECT_FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setProjectFilter(tab)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                projectFilter === tab
                  ? "border-green-400 bg-green-400/15 text-green-300"
                  : "border-white/12 bg-white/5 text-slate-400 hover:border-green-400/40 hover:text-green-400"
              }`}
            >
              <Filter size={10} />
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-7">
          {loadingProjects ? <LoadingState message="Loading featured projects..." /> : null}
          {!loadingProjects && projectError && mergedFeaturedProjects.length === 0 ? (
            <EmptyState title="Could not fetch projects" message={projectError} />
          ) : null}
          {!loadingProjects && filteredProjects.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(260px,0.9fr)]">
              {filteredProjects.slice(0, 3).map((project, index) => (
                <ProjectCard key={project._id || project.slug} project={project} priority={index < 2} />
              ))}

              <FadeInUp delay={0.24} className="h-full">
                <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md dark:border-green-400/35 dark:bg-[#050d14] dark:bg-gradient-to-br dark:from-[#050d14] dark:via-[#082218] dark:to-[#050d14] dark:shadow-none p-6 transition-all duration-300 hover:border-green-500/40 dark:hover:border-green-400/45">
                  <div className="pointer-events-none absolute -top-20 -right-16 h-52 w-52 rounded-full bg-green-500/10 dark:bg-green-400/12 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-emerald-500/10 dark:bg-emerald-400/15 blur-3xl" />
                  <div className="relative">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-green-600 dark:text-green-300/80 font-bold">Explore More</p>
                    <div className="mt-6 flex justify-center">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-green-500/30 bg-green-500/10 text-green-600 dark:border-green-400/30 dark:bg-green-400/10 dark:text-green-400">
                        <GitBranch size={26} />
                      </div>
                    </div>
                    <h3 className="mt-4 text-center text-3xl font-bold text-slate-900 dark:text-white">View All Projects</h3>
                    <p className="mx-auto mt-2 max-w-[220px] text-center text-xs text-slate-600 dark:text-slate-300/80">
                      Full archive with filters, detail pages, and live demos.
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-green-400/18 dark:bg-[#020802]/60 p-3 text-center">
                        <p className="font-outfit text-2xl font-black text-green-600 dark:text-green-400">{mergedFeaturedProjects.length}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Featured</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-green-400/18 dark:bg-[#020802]/60 p-3 text-center">
                        <p className="font-outfit text-2xl font-black text-green-600 dark:text-green-400">{liveDemoCount}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Live Demos</p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {mergedFeaturedProjects.slice(0, 3).map((project) => (
                        <div key={`${project.slug}-preview`} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-green-400/15 dark:bg-[#020802]/80">
                          <img src={project.imageUrl || fallbackProjectImage} alt={`${project.title} thumbnail`} className="h-12 w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" loading="lazy" width={120} height={48} decoding="async" onError={handleProjectPreviewError} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button to="/projects" className="mt-6 w-full justify-center border border-green-500/40 bg-green-500 text-black hover:bg-green-400">
                    Show All Projects <ArrowRight size={15} />
                  </Button>
                </article>
              </FadeInUp>
            </div>
          ) : null}
          {!loadingProjects && filteredProjects.length === 0 && !projectError ? (
            <EmptyState title="No projects in this category" message="Try selecting a different filter." />
          ) : null}
        </div>
      </section>


      {/* S6: Security Labs Preview */}
      <section className="section-wrap section-divider pt-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-green-600 dark:text-green-400">Security Engineering</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Security Labs &amp; Proof-of-Work</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Authorized lab-based security practicals with CVSS risk scores, tool evidence, and documented business impact.
          </p>
        </div>

        {/* 2 preview cards only */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {PRACTICALS.slice(0, 2).map((item, index) => (
            <SecurityLabCard key={item.slug} item={item} index={index} />
          ))}
        </div>

        {/* Explore All Labs button */}
        <FadeInUp delay={0.12}>
          <div className="mt-6 flex justify-center">
            <a
              href="/security"
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-7 py-3.5 text-sm font-black uppercase tracking-wider text-black transition-all duration-300 hover:-translate-y-1 hover:bg-green-400 hover:shadow-[0_8px_28px_rgba(34,197,94,0.45)]"
            >
              <ShieldCheck size={15} />
              Explore All Labs
              <ArrowRight size={14} />
            </a>
          </div>
        </FadeInUp>
      </section>

      {/* S7: Technical Capabilities Showcase */}
      <section id="skills" className="section-wrap section-divider pt-12 sm:pt-16 pb-10">
        <FadeInUp className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-green-600 dark:text-green-400">
              // Technical Capabilities
            </span>
            <h2 className="mt-2 font-display text-3xl font-black text-slate-900 dark:text-white sm:text-4xl lg:text-5xl tracking-tight">
              Engineering Stack &amp; Skills
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Organized by production domain—focusing on clean architecture, resilient APIs, and security-first engineering.
            </p>
          </div>

          <StaggerGrid className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: "frontend",
                title: "Frontend Engineering",
                desc: "Reactive web interfaces built with React, Next.js, and modular design systems.",
                Icon: Code2,
                skills: ["React", "Next.js", "JavaScript", "TypeScript", "Tailwind CSS", "Vite"],
              },
              {
                id: "backend",
                title: "Backend & APIs",
                desc: "RESTful API services, server controllers, and authentication structures.",
                Icon: Cpu,
                skills: ["Node.js", "Express.js", "Python", "Postman", "C"],
              },
              {
                id: "cybersecurity",
                title: "Cybersecurity & Defense",
                desc: "Vulnerability analysis, application auditing, and OWASP security standards.",
                Icon: ShieldCheck,
                skills: ["Kali Linux", "Burp Suite", "Nmap", "Wireshark", "Metasploit", "TryHackMe"],
              },
              {
                id: "databases",
                title: "Databases & Storage",
                desc: "Document and relational database schemas optimized for low latency.",
                Icon: Database,
                skills: ["MongoDB", "PostgreSQL", "Supabase", "SQL"],
              },
              {
                id: "devtools",
                title: "DevOps & Tools",
                desc: "Version control workflows, cloud deployments, and Linux environments.",
                Icon: Terminal,
                skills: ["Git", "GitHub", "Linux", "Vercel", "Render", "VS Code"],
              },
              {
                id: "ai-productivity",
                title: "AI & Productivity",
                desc: "Leveraging LLM workflows for rapid code refactoring and architecture auditing.",
                Icon: Sparkles,
                skills: ["ChatGPT", "GitHub Copilot"],
              },
            ].map((cat) => {
              const Icon = cat.Icon;
              return (
                <StaggerItem key={cat.id} className="h-full">
                  <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white/90 p-5 shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-xl dark:border-slate-800/90 dark:bg-[#050d14]/90 dark:shadow-none dark:hover:border-emerald-400/40">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-emerald-400">
                          <Icon size={18} />
                        </span>
                        <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                          {cat.title}
                        </h3>
                      </div>
                      <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                      {cat.skills.map((skill) => (
                        <SkillLogoBadge key={skill} skill={skill} className="!px-2 !py-1 !text-[11px]" />
                      ))}
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </StaggerGrid>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button to="/skills" variant="primary">
              View Complete Skills Taxonomy <ArrowRight size={16} />
            </Button>
            <Button to="/projects" variant="ghost">
              See Skills in Projects
            </Button>
          </div>
        </FadeInUp>
      </section>

      {/* S8: Live Metrics */}
      <section className="section-wrap section-divider pt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-green-600 dark:text-green-400 font-bold">Proof of Work</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Live Learning Metrics</h2>
          </div>
        </div>

        {/* Security Health Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="security-health-badge"><CheckCircle2 size={10} /> HTTPS Enforced</span>
          <span className="security-health-badge"><CheckCircle2 size={10} /> Security Headers A+</span>
          <span className="security-health-badge"><CheckCircle2 size={10} /> 0 Critical Vulnerabilities</span>
          <span className="security-health-badge"><CheckCircle2 size={10} /> TryHackMe Top 1%</span>
        </div>

        <FadeInUp className="mt-8 card-green rounded-3xl p-6 sm:p-8">
          <div className="text-center">
            <h2 className="font-outfit text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">Coding Consistency Showcase</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Live profile cards showing real progress</p>
          </div>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
            <article className="group h-full rounded-2xl border border-slate-200 bg-white dark:bg-[#050d14] shadow-md dark:border-green-400/22 dark:shadow-none p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">GitHub Streak</h3>
                <a href={QUICK_CONTACT.github} target="_blank" rel="noreferrer" className="text-xs font-bold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors">Open ↗</a>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-green-400/18 dark:bg-[#050d14] p-2">
                <img src={githubStreakCardUrl} alt={`GitHub streak stats for ${githubUsername}`} className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
              </div>
            </article>

            <article className="group h-full rounded-2xl border border-slate-200 bg-white dark:bg-[#050d14] shadow-md dark:border-green-400/22 dark:shadow-none p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">LeetCode Stats</h3>
                <a href={QUICK_CONTACT.leetcode} target="_blank" rel="noreferrer" className="text-xs font-bold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors">Open ↗</a>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-green-400/18 dark:bg-[#050d14] p-2">
                <img src={leetcodeCardUrl} alt={`LeetCode stats for ${leetcodeUsername}`} className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
              </div>
            </article>

            <article className="group h-full rounded-2xl border border-slate-200 bg-white dark:bg-[#050d14] shadow-md dark:border-green-400/22 dark:shadow-none p-4 sm:p-5 md:col-span-2 xl:col-span-1">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">TryHackMe Proof</h3>
                <a href={QUICK_CONTACT.tryhackme} target="_blank" rel="noreferrer" className="text-xs font-bold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors">Open ↗</a>
              </div>
              <div className="mb-3 inline-flex rounded-full border border-green-500/30 bg-green-500/10 text-green-700 dark:border-green-400/40 dark:bg-green-400/10 dark:text-green-300 px-3 py-1 text-xs font-bold">
                {tryHackMeMetric?.value || "Top 1%"} on TryHackMe — 275 Rooms
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-green-400/18 dark:bg-[#050d14] p-2">
                <img src={tryHackMeCardUrl} alt={`TryHackMe badge for ${tryHackMeUsername}`} className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
              </div>
            </article>
          </div>
        </FadeInUp>
      </section>

      {/* S9: Professional Journey */}
      <section className="section-wrap section-divider pt-10 pb-6 sm:pb-8">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-green-600 dark:text-green-400 font-bold">Professional Growth</p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white sm:text-4xl">Professional Journey</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Internships, workshops, hackathons, certifications, and technical events that shaped my engineering mindset.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {homeFeaturedJourney.map((event) => (
            <FadeInUp
              key={event.id}
              className="group flex flex-col h-full rounded-3xl border border-slate-200/80 bg-white dark:bg-[#050d14] shadow-md dark:border-white/[0.08] dark:shadow-none p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-green-500/40 dark:hover:border-green-400/35"
            >
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-white/[0.06] dark:bg-[#07111e]">
                <img src={event.imageUrl} alt={`${event.title} cover`} className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="bg-green-500 text-black px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-sm">{event.category}</span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{event.date}</span>
              </div>
              <h3 className="mt-3 text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">{event.title}</h3>
              <p className="mt-1 text-[10px] font-mono text-slate-500 uppercase">{event.subtitle}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 flex-1">{event.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                {event.tags.map((tag) => (
                  <span key={tag} className="rounded-md border border-slate-200 bg-slate-50 text-slate-700 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-slate-500 px-2 py-0.5 text-[10px] font-medium">{tag}</span>
                ))}
              </div>
            </FadeInUp>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button to="/journey" className="bg-green-500 text-black text-xs font-black uppercase tracking-wider px-6 py-3.5 rounded-full shadow-[0_4px_18px_rgba(34,197,94,0.35)] hover:bg-green-400 transition-all duration-300 inline-flex items-center gap-2">
            Explore Complete Journey <ArrowRight size={14} />
          </Button>
        </div>
      </section>

      {/* Latest Blogs */}
      <section className="section-wrap section-divider pt-10">
        {/* Big bold centered heading */}
        <FadeInUp>
          <div className="text-center">
            <h2 className="font-display text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
              Recent Blog
              <span className="block text-green-600 dark:text-green-400">Posts</span>
            </h2>
          </div>
        </FadeInUp>

        {/* 4-column grid: 3 blog cards + 1 View All card */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_240px]">
          {/* Blog cards with cover images */}
          {loadingLatestBlog && latestBlogs.length === 0 ? <LoadingState message="Loading latest blogs..." cards={3} variant="blog" /> : null}
          {!loadingLatestBlog && latestBlogError && latestBlogs.length === 0 ? <EmptyState title="Latest blog unavailable" message={latestBlogError} /> : null}
          {latestBlogs.length > 0
            ? latestBlogs.slice(0, 3).map((blog, index) => (
                <FadeInUp key={blog._id || blog.slug} delay={index * 0.08}>
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:bg-[#050d14] shadow-md dark:border-white/[0.08] dark:shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-green-500/40 dark:hover:border-green-400/30 hover:shadow-xl">
                    {/* Cover Image */}
                    <div className="overflow-hidden">
                      <img
                        src={blog.imageUrl || blog.coverImage || "/images/placeholders/content-placeholder.svg"}
                        alt={blog.title || "Blog cover"}
                        className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        loading={index < 2 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    </div>
                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-wider">
                        {blog.publishedAt || blog.createdAt
                          ? new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })
                          : null}
                        {(blog.readTime || blog.readingTime) && (
                          <>
                            <span>•</span>
                            <span>{blog.readTime || blog.readingTime} Min Read</span>
                          </>
                        )}
                      </div>
                      <h3 className="mt-2 font-display text-sm font-bold uppercase tracking-tight text-slate-900 dark:text-white line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                        {blog.description || blog.excerpt}
                      </p>
                      {/* Category badge */}
                      {(blog.category || (blog.tags && blog.tags[0])) && (
                        <div className="mt-3">
                          <span className="inline-flex items-center rounded border border-green-500/30 bg-green-500/10 text-green-700 dark:border-green-400/30 dark:bg-green-400/10 dark:text-green-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                            {blog.category || blog.tags[0]}
                          </span>
                        </div>
                      )}
                      {/* Read More */}
                      <a
                        href={blog.url || `/blog/${blog.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-800 hover:text-green-600 dark:text-slate-300 dark:hover:text-green-400 transition-colors"
                      >
                        Read More <ArrowRight size={11} />
                      </a>
                    </div>
                  </article>
                </FadeInUp>
              ))
            : null}
          {!loadingLatestBlog && !latestBlogError && latestBlogs.length === 0 ? <EmptyState title="No blogs yet" message="Latest writing will appear here once published." /> : null}

          {/* 4th card: View All Blogs */}
          <FadeInUp delay={0.24} className="h-full">
            <article className="group relative flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:bg-[#050d14] shadow-md dark:border-green-400/25 dark:bg-gradient-to-br dark:from-[#050d14] dark:via-[#082218] dark:to-[#050d14] dark:shadow-none p-6 text-center transition-all duration-300 hover:border-green-500/40 dark:hover:border-green-400/45">
              <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-green-500/10 dark:bg-green-400/8 blur-3xl" />
              <div className="relative">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-green-500/30 bg-green-500/10 text-green-600 dark:border-green-400/30 dark:bg-green-400/10 dark:text-green-400">
                  <BookOpen size={24} />
                </div>
                <h3 className="font-display text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  View All Blogs
                </h3>
                <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-slate-500">// Read More Articles</p>
                <Button to="/blog" className="mt-6 w-full justify-center border border-green-500/40 bg-green-50 text-green-700 hover:bg-green-500 hover:text-black dark:border-green-400/40 dark:bg-green-500/10 dark:text-green-300 dark:hover:bg-green-500 dark:hover:text-black">
                  All Articles <ArrowRight size={13} />
                </Button>
              </div>
            </article>
          </FadeInUp>
        </div>
      </section>

      {/* S11: Contact CTA Banner */}
      <section className="section-wrap section-divider pt-12 pb-16 sm:pb-20">
        <FadeInUp>
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white dark:bg-[#050d14] shadow-xl dark:border-green-400/30 dark:bg-gradient-to-br dark:from-[#050d14] dark:via-[#082218] dark:to-[#050d14] dark:shadow-none p-8 text-center sm:p-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.18),transparent_55%)] dark:block hidden" />
            <div className="pointer-events-none absolute inset-0 rounded-3xl dark:block hidden" style={{ boxShadow: "inset 0 1px 0 rgba(74,222,128,0.12)" }} />

            {/* Pulsing accent dot */}
            <div className="relative mx-auto mb-4 flex justify-center">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500 dark:bg-green-400 cyber-pulse-dot" />
            </div>

            <p className="relative text-xs font-bold uppercase tracking-[0.28em] text-green-600 dark:text-green-400">Open to Opportunities</p>
            <h2 className="relative mt-3 text-3xl font-black text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              Ready to Build Something<br className="hidden sm:block" />
              <span className="text-green-600 dark:text-green-400"> Great Together?</span>
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Looking for internship roles in Full Stack Engineering, Application Security, or DevSecOps. Available for freelance projects and collaborations. Let's connect!
            </p>

            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-black transition-all duration-300 hover:-translate-y-1 hover:bg-green-400 hover:shadow-[0_8px_28px_rgba(34,197,94,0.5)]"
              >
                Send Message <ArrowRight size={15} />
              </a>
              <a
                href={QUICK_CONTACT.resumeFullStack}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-green-500/40 bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:border-green-400/45 dark:bg-green-400/10 dark:text-green-400 dark:hover:bg-green-400/20 px-6 py-3.5 text-sm font-black uppercase tracking-wider transition-all duration-300 hover:-translate-y-1"
              >
                <Download size={14} /> Download Resume
              </a>
              <a
                href={QUICK_CONTACT.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:border-white/12 dark:bg-white/5 dark:text-slate-300 dark:hover:border-green-400/30 dark:hover:text-green-300 px-6 py-3.5 text-sm font-black uppercase tracking-wider transition-all duration-300 hover:-translate-y-1"
              >
                <FaLinkedinIn size={14} /> LinkedIn
              </a>
            </div>

            {/* Bottom trust row */}
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
              <span className="security-health-badge"><Zap size={10} /> Quick Response</span>
              <span className="security-health-badge"><Globe size={10} /> Remote Ready</span>
              <span className="security-health-badge"><ShieldCheck size={10} /> Security-First Mindset</span>
            </div>
          </div>
        </FadeInUp>
      </section>
    </>
  );
};

export default HomePage;

