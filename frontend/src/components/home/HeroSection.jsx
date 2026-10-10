import { useEffect, useRef, memo } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  GraduationCap,
  Layers,
  Mail,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { FaGithub, FaLinkedinIn, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import { QUICK_CONTACT, SITE_PROFILE } from "@/constants/siteData";

const PARTICLES = [
  { top: "12%", left: "8%", size: 3, delay: 0, dur: 7 },
  { top: "28%", left: "18%", size: 2, delay: 1.2, dur: 9 },
  { top: "60%", left: "6%", size: 4, delay: 0.5, dur: 11 },
  { top: "80%", left: "22%", size: 2, delay: 2, dur: 8 },
  { top: "18%", left: "88%", size: 3, delay: 0.8, dur: 10 },
  { top: "45%", left: "92%", size: 2, delay: 1.5, dur: 7 },
  { top: "72%", left: "85%", size: 4, delay: 0.3, dur: 12 },
  { top: "5%", left: "55%", size: 2, delay: 1.8, dur: 9 },
  { top: "90%", left: "48%", size: 3, delay: 0.6, dur: 8 },
  { top: "38%", left: "75%", size: 2, delay: 2.5, dur: 11 },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut", delay },
});

const SOCIAL_ICON_LINKS = [
  {
    icon: FaGithub,
    href: QUICK_CONTACT?.github || "https://github.com/nikhilxagr",
    label: "GitHub",
    hoverClass:
      "hover:border-slate-300 hover:bg-slate-300/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]",
  },
  {
    icon: FaLinkedinIn,
    href: QUICK_CONTACT?.linkedin || "https://www.linkedin.com/in/nikhilxagr/",
    label: "LinkedIn",
    hoverClass:
      "hover:border-[#0A66C2] hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:shadow-[0_0_15px_rgba(10,102,194,0.35)]",
  },
  {
    icon: FaWhatsapp,
    href: QUICK_CONTACT?.whatsapp || "https://wa.me/7897872883",
    label: "WhatsApp",
    hoverClass:
      "hover:border-[#25D366] hover:bg-[#25D366]/10 hover:text-[#25D366] hover:shadow-[0_0_15px_rgba(37,211,102,0.35)]",
  },
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/nikhilxagr/",
    label: "Instagram",
    hoverClass:
      "hover:border-[#E1306C] hover:bg-[#E1306C]/10 hover:text-[#E1306C] hover:shadow-[0_0_15px_rgba(225,48,108,0.35)]",
  },
];

const HeroSection = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      canvas.style.display = "none";
      return;
    }

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particleCount = 45;
    const connectionDistance = 110;
    const sqConnectionDistance = connectionDistance * connectionDistance;
    const particles = [];

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.5 + 1;
        this.color =
          Math.random() > 0.4
            ? "rgba(52, 211, 153, 0.40)"
            : "rgba(45, 212, 191, 0.45)";
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
            ctx.strokeStyle = `rgba(52, 211, 153, ${alpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }
    };

    let isIntersecting = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting && !animationFrameId) {
          animate();
        } else if (!isIntersecting && animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let isScrolling = false;
    let scrollTimeout;
    const handleScroll = () => {
      isScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 120);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const animate = () => {
      if (!isIntersecting) return;
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
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <section className="relative w-full min-h-[92vh] flex flex-col justify-center overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20">
      {/* Full Bleed Background layer */}
      <div
        className="pointer-events-none absolute inset-0 w-full h-full -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full opacity-60 hidden sm:block"
        />

        {/* Ambient subtle glow orbs */}
        <div
          className="hero-aurora-orb-1 absolute -top-24 -left-24 h-[500px] w-[500px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(52,211,153,0.35) 0%, rgba(20,184,166,0.12) 50%, transparent 72%)",
            filter: "blur(40px)",
            transform: "translate3d(0, 0, 0)",
          }}
        />
        <div
          className="hero-aurora-orb-2 absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(16,185,129,0.30) 0%, rgba(52,211,153,0.10) 55%, transparent 72%)",
            filter: "blur(40px)",
            transform: "translate3d(0, 0, 0)",
          }}
        />

        {/* Floating particles */}
        <div className="hidden sm:contents">
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                top: p.top,
                left: p.left,
                width: p.size,
                height: p.size,
                background:
                  i % 3 === 0
                    ? "rgba(45,212,191,0.5)"
                    : "rgba(52,211,153,0.45)",
                animation: `particle-float ${p.dur}s ease-in-out ${p.delay}s infinite`,
                boxShadow: `0 0 ${p.size * 2}px rgba(52,211,153,0.4)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Full Bleed Ambient Moving Transparent Watermark Typography — BUILDER (Connects Edge-to-Edge) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 w-full flex overflow-hidden select-none -z-10"
        aria-hidden="true"
      >
        <div className="flex w-max animate-marquee-drift">
          <span className="font-display font-black uppercase tracking-[0.2em] text-[22vw] lg:text-[18vw] xl:text-[250px] leading-none whitespace-nowrap text-white/[0.025] dark:text-emerald-400/[0.035] [-webkit-text-stroke:1.5px_rgba(255,255,255,0.03)] dark:[-webkit-text-stroke:1.5px_rgba(52,211,153,0.045)] pr-16 sm:pr-24">
            BUILDER • BUILDER • BUILDER • BUILDER •&nbsp;
          </span>
          <span className="font-display font-black uppercase tracking-[0.2em] text-[22vw] lg:text-[18vw] xl:text-[250px] leading-none whitespace-nowrap text-white/[0.025] dark:text-emerald-400/[0.035] [-webkit-text-stroke:1.5px_rgba(255,255,255,0.03)] dark:[-webkit-text-stroke:1.5px_rgba(52,211,153,0.045)] pr-16 sm:pr-24">
            BUILDER • BUILDER • BUILDER • BUILDER •&nbsp;
          </span>
        </div>
      </div>

      {/* Main Content Container (max-w-7xl) */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14">
          {/* Left Column: Text & CTAs */}
          <div className="order-2 flex flex-col text-center sm:text-left lg:order-1">
            {/* Eyebrow badge */}
            <motion.div
              {...fadeUp(0.05)}
              className="mb-4 flex justify-center sm:justify-start"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1.5 text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400 shadow-sm backdrop-blur-md">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                WELCOME TO MY PORTFOLIO
              </span>
            </motion.div>

          {/* Primary Name Display */}
          <motion.h1
            {...fadeUp(0.12)}
            className="font-display text-5xl font-black uppercase tracking-tight text-white sm:text-6xl lg:text-[4.6rem] xl:text-[5.2rem] leading-[0.92] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
          >
            NIKHIL <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
              AGRAHARI
            </span>
          </motion.h1>

          {/* Role & Futuristic HUD line */}
          <motion.div
            {...fadeUp(0.18)}
            className="mt-4 flex items-center justify-center sm:justify-start gap-3"
          >
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
              // CYBER SECURITY &amp; WEB DEVELOPER
            </span>
            <div className="hidden sm:flex items-center flex-1 max-w-[110px]">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-emerald-500/50 to-transparent" />
              <div className="h-2 w-2 rounded-full border border-emerald-400/60 bg-emerald-400/20 flex items-center justify-center">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
              </div>
            </div>
          </motion.div>

          {/* Technical Tags — Clean Transparent Glass, NO Emojis */}
          <motion.div
            {...fadeUp(0.24)}
            className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2.5"
          >
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-emerald-400/40 hover:bg-emerald-500/10 transition-all">
              <Terminal size={13} className="text-emerald-400" />
              Python
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-emerald-400/40 hover:bg-emerald-500/10 transition-all">
              <Layers size={13} className="text-teal-400" />
              Full Stack
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-emerald-400/40 hover:bg-emerald-500/10 transition-all">
              <ShieldCheck size={13} className="text-emerald-400" />
              SOC Analyst
            </span>
          </motion.div>

          {/* Academic & Availability Status */}
          <motion.div
            {...fadeUp(0.3)}
            className="mt-4 space-y-2 text-xs sm:text-sm text-slate-300 font-medium"
          >
            <p className="flex items-center justify-center sm:justify-start gap-2">
              <GraduationCap size={15} className="text-emerald-400 shrink-0" />
              <span>BCA at BBDU Lucknow, India</span>
            </p>
            <p className="flex items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Open for Internships &amp; Freelance
              </span>
            </p>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            {...fadeUp(0.38)}
            className="mt-7 flex flex-wrap items-center justify-center sm:justify-start gap-3"
          >
            <a
              href="/services"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-xs font-black uppercase tracking-wider text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(16,185,129,0.4)]"
            >
              Book Service
              <ArrowRight
                size={13}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
            <a
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] backdrop-blur-md px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/40 hover:text-emerald-300 hover:bg-emerald-500/10"
            >
              View Projects
              <ArrowUpRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <a
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] backdrop-blur-md px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/40 hover:text-emerald-300 hover:bg-emerald-500/10"
            >
              <Mail size={13} />
              Contact Me
            </a>
          </motion.div>

          {/* Social Links in Clean Transparent Glass */}
          <motion.div
            {...fadeUp(0.44)}
            className="mt-6 flex items-center justify-center sm:justify-start gap-2.5"
          >
            {SOCIAL_ICON_LINKS.map(
              ({ icon: Icon, href, label, hoverClass }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  title={label}
                  className={`group relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md text-slate-400 transition-all duration-300 ${hoverClass}`}
                >
                  <Icon
                    size={16}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />
                </a>
              ),
            )}
          </motion.div>
        </div>

        {/* Right Column: Avatar Frame with Precision Concentric Orbit Rings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
          className="order-1 mx-auto flex w-full max-w-sm justify-center lg:order-2 lg:max-w-md xl:max-w-lg"
        >
          {SITE_PROFILE.profileImage ? (
            <div className="relative group">
              {/* Outer Precision Orbit Ring */}
              <div className="absolute -inset-5 sm:-inset-6 rounded-full border border-emerald-500/25 sm:block" />

              {/* Radar Orbit Node */}
              <div className="absolute -left-5 sm:-left-6 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full border border-emerald-400/60 bg-emerald-400/20 flex items-center justify-center shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>

              {/* Inner Circular Frame */}
              <div className="relative h-[230px] w-[230px] sm:h-[270px] sm:w-[270px] lg:h-[310px] lg:w-[310px] xl:h-[340px] xl:w-[340px] overflow-hidden rounded-full border-2 border-emerald-400/80 bg-slate-900 shadow-[0_0_35px_rgba(16,185,129,0.25)] transition-transform duration-500 group-hover:scale-[1.02]">
                <img
                  src={SITE_PROFILE.profileImage}
                  alt={SITE_PROFILE.profileImageAlt}
                  className="h-full w-full object-cover object-center"
                  width={340}
                  height={340}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>

              {/* Available Status Pill */}
              <div className="absolute bottom-1 right-2 sm:right-4 rounded-full border border-emerald-400/80 bg-emerald-500 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-black shadow-[0_4px_20px_rgba(16,185,129,0.5)]">
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-black animate-pulse" />
                AVAILABLE!
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        {...fadeUp(0.52)}
        className="mt-10 hidden lg:flex items-center justify-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-slate-500"
      >
        <span>SCROLL DOWN</span>
        <ChevronDown size={13} className="animate-bounce text-emerald-400" />
      </motion.div>
    </section>
  );
};

const MemoizedHeroSection = memo(HeroSection);
MemoizedHeroSection.displayName = "HeroSection";

export default MemoizedHeroSection;
