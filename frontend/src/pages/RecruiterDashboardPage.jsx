import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Globe,
  Mail,
  Send,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
} from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import SeoHead from "@/components/seo/SeoHead";
import SectionTitle from "@/components/ui/SectionTitle";
import FadeInUp from "@/components/animations/FadeInUp";
import { QUICK_CONTACT, SITE_PROFILE } from "@/constants/siteData";

const RecruiterDashboardPage = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [recruiterName, setRecruiterName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [inviteSent, setInviteSent] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(QUICK_CONTACT.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    setInviteSent(true);
    setTimeout(() => {
      setScheduleModalOpen(false);
      setInviteSent(false);
      setInterviewDate("");
      setInterviewTime("");
      setRecruiterName("");
      setCompanyName("");
    }, 2800);
  };

  return (
    <section className="section-wrap relative pt-8 pb-20 sm:pt-12 sm:pb-28">
      <SeoHead
        title="Recruiter Dashboard | Hiring Manager Overview — Nikhil Agrahari"
        description="Fast-track candidate evaluation dashboard for recruiters and hiring managers. View why to hire Nikhil, download resumes, schedule interviews, and verify availability."
        pathname="/dashboard/recruiter"
      />

      {/* Hero Header */}
      <FadeInUp>
        <div className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:border-emerald-400/30 dark:text-emerald-300">
            <UserCheck size={14} className="text-emerald-500" />
            Recruiter &amp; Hiring Manager Executive Brief
          </p>
          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            Recruiter <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-400 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium text-slate-600 dark:text-slate-300 sm:text-base">
            Structured candidate overview designed for 60-second technical evaluation, verified credentials, and instant scheduling.
          </p>
        </div>
      </FadeInUp>

      {/* Main Recruiter Workflow Flowchart Cards */}
      <div className="mt-12 space-y-8">
        
        {/* Section 1: Why Hire Me? */}
        <FadeInUp delay={0.1}>
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-emerald-500/20">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <Sparkles size={20} />
              </span>
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Step 01</span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">Why Hire Me?</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition-all hover:border-emerald-400/40 dark:border-emerald-500/15 dark:bg-[#020803]/60">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={16} />
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Full-Stack Execution</h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Proficient across React.js, Node.js, REST APIs, MongoDB, and Tailwind CSS. Built and deployed 10+ production-ready web products.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition-all hover:border-emerald-400/40 dark:border-emerald-500/15 dark:bg-[#020803]/60">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <ShieldCheck size={16} />
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Security-First Mindset</h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  AppSec knowledge in OWASP Top 10 vulnerabilities, secure API design, penetration testing labs, and defensive Linux hardening.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition-all hover:border-emerald-400/40 dark:border-emerald-500/15 dark:bg-[#020803]/60">
                <div className="flex items-center gap-2 text-lime-600 dark:text-lime-400">
                  <Clock size={16} />
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">High Velocity Delivery</h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Rapid prototyping to production deployment. Demonstrated capacity to ship clean, responsive products independently.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition-all hover:border-emerald-400/40 dark:border-emerald-500/15 dark:bg-[#020803]/60">
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                  <Code2 size={16} />
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Solid CS Foundation</h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  BCA 2nd Year student at BBDU Lucknow with strong Data Structures, Algorithms, OS, and Database Management fundamentals.
                </p>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Section 2: Download Resume */}
        <FadeInUp delay={0.15}>
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-emerald-500/20">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <Download size={20} />
              </span>
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Step 02</span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">Download Resume</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <a
                href={QUICK_CONTACT.resumeFullStack}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 p-4 shadow-md transition-all hover:border-emerald-400 hover:bg-emerald-500/25 hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/40 bg-emerald-400/20 text-emerald-600 dark:text-emerald-300">
                    <Code2 size={20} />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Full-Stack Developer Resume</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300">PDF Format · React, Node, Web Products</p>
                  </div>
                </div>
                <Download size={18} className="text-emerald-600 dark:text-emerald-300 transition-transform group-hover:translate-y-0.5" />
              </a>

              <a
                href={QUICK_CONTACT.resumeSecurity}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-2xl border-2 border-teal-500/50 bg-gradient-to-r from-teal-500/15 to-cyan-500/15 p-4 shadow-md transition-all hover:border-teal-400 hover:bg-teal-500/25 hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-400/40 bg-teal-400/20 text-teal-600 dark:text-teal-300">
                    <ShieldCheck size={20} />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Cyber Security Resume</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300">PDF Format · AppSec, Linux, Pentesting</p>
                  </div>
                </div>
                <Download size={18} className="text-teal-600 dark:text-teal-300 transition-transform group-hover:translate-y-0.5" />
              </a>
            </div>
          </div>
        </FadeInUp>

        {/* Section 3: GitHub & LinkedIn */}
        <FadeInUp delay={0.2}>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* GitHub Card */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] sm:p-8">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-emerald-500/20">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-400/30 bg-slate-100 text-slate-800 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-300">
                  <FaGithub size={20} />
                </span>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Step 03</span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">GitHub Profile</h2>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  30+ public repositories featuring web apps, Python scripts, security utilities, and full-stack API servers.
                </p>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800 dark:border-emerald-500/20 dark:bg-[#020803] dark:text-emerald-300">
                  github.com/nikhilxagr
                </div>
                <a
                  href={QUICK_CONTACT.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 transition"
                >
                  Visit GitHub Profile
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* LinkedIn Card */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] sm:p-8">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-emerald-500/20">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-500/15 text-sky-600 dark:text-sky-400">
                  <FaLinkedinIn size={20} />
                </span>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Step 04</span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">LinkedIn Network</h2>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Connect with me on LinkedIn for professional updates, project releases, and technical writeups.
                </p>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800 dark:border-emerald-500/20 dark:bg-[#020803] dark:text-emerald-300">
                  linkedin.com/in/nikhilxagr/
                </div>
                <a
                  href={QUICK_CONTACT.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-sky-500 transition shadow-md"
                >
                  Connect on LinkedIn
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Section 4: Schedule Interview & Email */}
        <FadeInUp delay={0.25}>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Schedule Interview Card */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] sm:p-8">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-emerald-500/20">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Calendar size={20} />
                </span>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Step 05</span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Schedule Interview</h2>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Book a 15-30 minute technical screening or introductory interview with Nikhil directly.
                </p>
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg hover:from-emerald-400 hover:to-lime-400 transition"
                >
                  <Calendar size={15} />
                  Book Interview Slot
                </button>
              </div>
            </div>

            {/* Email Contact Card */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] sm:p-8">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-emerald-500/20">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-teal-500/40 bg-teal-500/15 text-teal-600 dark:text-teal-400">
                  <Mail size={20} />
                </span>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Step 06</span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Direct Email</h2>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Reach out directly via email for job offers, contract projects, or technical inquiries.
                </p>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-900 dark:border-emerald-500/20 dark:bg-[#020803] dark:text-emerald-300">
                  <span className="truncate">{QUICK_CONTACT.email}</span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="ml-2 flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-600 dark:text-emerald-400 transition hover:bg-emerald-500/20"
                  >
                    {copiedEmail ? <Check size={12} /> : <Copy size={12} />}
                    {copiedEmail ? "Copied" : "Copy"}
                  </button>
                </div>
                <a
                  href={`mailto:${QUICK_CONTACT.email}?subject=Job%20Opportunity%20-%20Interview%20Invitation`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-800 hover:bg-slate-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20 transition"
                >
                  <Send size={14} />
                  Send Email Now
                </a>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Section 5: Availability & Current Status */}
        <FadeInUp delay={0.3}>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Availability Card */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] sm:p-8">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-emerald-500/20">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-lime-500/40 bg-lime-500/15 text-lime-600 dark:text-lime-400">
                  <Clock size={20} />
                </span>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Step 07</span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Availability</h2>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  AVAILABLE IMMEDIATELY
                </div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    Full-Stack Web Development Roles (Remote / Hybrid / On-Site)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    Software Engineering Internships &amp; Junior Roles
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    Freelance Web Applications &amp; Security Audits
                  </li>
                </ul>
              </div>
            </div>

            {/* Current Status Card */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] sm:p-8">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-emerald-500/20">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-500/40 bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                  <Briefcase size={20} />
                </span>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Step 08</span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Current Status</h2>
                </div>
              </div>

              <div className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {SITE_PROFILE.headline}
                </p>
                <p>
                  📍 <strong className="text-slate-800 dark:text-slate-200">Location:</strong> {SITE_PROFILE.location}
                </p>
                <p>
                  🎓 <strong className="text-slate-800 dark:text-slate-200">Education:</strong> {SITE_PROFILE.education}
                </p>
                <p>
                  🚀 <strong className="text-slate-800 dark:text-slate-200">Focus:</strong> React, Node, Web Security, MERN Stack
                </p>
              </div>
            </div>
          </div>
        </FadeInUp>
      </div>

      {/* Schedule Interview Modal */}
      <AnimatePresence>
        {scheduleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setScheduleModalOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-emerald-500/30 bg-white p-6 shadow-2xl dark:bg-[#040e07] dark:text-white sm:p-8 z-10"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Calendar size={20} />
                  <h3 className="font-extrabold text-base">Schedule Interview Slot</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="rounded-full p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {inviteSent ? (
                <div className="my-8 text-center space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="font-extrabold text-lg">Interview Request Sent!</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Thank you {recruiterName || "Recruiter"}! Nikhil will confirm your interview slot via email shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleScheduleSubmit} className="mt-4 space-y-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Your Name / Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins (Tech Recruiter)"
                      value={recruiterName}
                      onChange={(e) => setRecruiterName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 font-medium text-slate-900 dark:border-emerald-500/25 dark:bg-[#020803] dark:text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Tech Solutions"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 font-medium text-slate-900 dark:border-emerald-500/25 dark:bg-[#020803] dark:text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Preferred Date</label>
                      <input
                        type="date"
                        required
                        value={interviewDate}
                        onChange={(e) => setInterviewDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 font-medium text-slate-900 dark:border-emerald-500/25 dark:bg-[#020803] dark:text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Preferred Time</label>
                      <input
                        type="time"
                        required
                        value={interviewTime}
                        onChange={(e) => setInterviewTime(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 font-medium text-slate-900 dark:border-emerald-500/25 dark:bg-[#020803] dark:text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 font-black text-slate-950 uppercase tracking-wider hover:from-emerald-400 hover:to-lime-400 transition"
                  >
                    Confirm Booking Invitation
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default RecruiterDashboardPage;
