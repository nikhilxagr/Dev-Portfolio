import { useEffect, useRef, memo } from "react";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
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
            ? "rgba(74, 222, 128, 0.40)"
            : "rgba(56, 189, 248, 0.45)";
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
    <section className="relative min-h-[94vh] flex flex-col justify-center overflow-hidden section-wrap pt-12 pb-20 sm:pt-16 sm:pb-24">
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full opacity-65 hidden sm:block"
        />

        <div
          className="hero-aurora-orb-1 absolute -top-24 -left-24 h-[500px] w-[500px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(56,189,248,0.45) 0%, rgba(14,165,233,0.18) 50%, transparent 72%)",
            filter: "blur(20px)",
            transform: "translate3d(0, 0, 0)",
            willChange: "transform",
          }}
        />
        <div
          className="hero-aurora-orb-2 absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full opacity-18"
          style={{
            background:
              "radial-gradient(circle, rgba(34,197,94,0.42) 0%, rgba(74,222,128,0.15) 55%, transparent 72%)",
            filter: "blur(20px)",
            transform: "translate3d(0, 0, 0)",
            willChange: "transform",
          }}
        />

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
                    ? "rgba(56,189,248,0.55)"
                    : "rgba(74,222,128,0.50)",
                animation: `particle-float ${p.dur}s ease-in-out ${p.delay}s infinite`,
                boxShadow:
                  i % 3 === 0
                    ? `0 0 ${p.size * 3}px rgba(56,189,248,0.55)`
                    : `0 0 ${p.size * 3}px rgba(74,222,128,0.55)`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
        <div className="order-2 flex flex-col text-center sm:text-left lg:order-1">
          <motion.div
            {...fadeUp(0.05)}
            className="mb-4 flex justify-center sm:justify-start"
          >
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

          <motion.div
            {...fadeUp(0.18)}
            className="mt-4 flex justify-center sm:justify-start"
          >
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-green-300">
              // CYBER SECURITY &amp; WEB DEVELOPER
            </span>
          </motion.div>

          <motion.div
            {...fadeUp(0.24)}
            className="mt-4 flex flex-wrap justify-center gap-2.5 sm:justify-start"
          >
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
            {...fadeUp(0.3)}
            className="font-display mt-6 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl leading-tight"
          >
            Building Secure &amp;<br />
            <span className="text-green-300">Scalable Applications</span>
          </motion.h2>

          <motion.div
            {...fadeUp(0.36)}
            className="mt-5 space-y-2.5 text-sm text-slate-400"
          >
            <p className="flex items-center justify-center gap-2 sm:justify-start">
              BCA at BBDU Lucknow, India
            </p>
            <p className="flex items-center justify-center gap-2 sm:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-green-400/20 bg-green-400/5 px-3 py-1.5 text-xs font-semibold text-green-400">
                Open for Internships &amp; Freelance
              </span>
            </p>
          </motion.div>

          <motion.div
            {...fadeUp(0.42)}
            className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:justify-start"
          >
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
              View Projects{" "}
              <ArrowRight
                size={13}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
          </motion.div>

          <motion.div
            {...fadeUp(0.48)}
            className="mt-6 flex items-center justify-center gap-2.5"
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
                  className={`group relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all duration-300 ${hoverClass}`}
                >
                  <Icon
                    size={17}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />
                </a>
              ),
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
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
    </section>
  );
};

const MemoizedHeroSection = memo(HeroSection);
MemoizedHeroSection.displayName = "HeroSection";

export default MemoizedHeroSection;
