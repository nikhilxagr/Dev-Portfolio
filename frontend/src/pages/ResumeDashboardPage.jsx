import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Code2,
  Cpu,
  Download,
  ExternalLink,
  FileText,
  Folder,
  GraduationCap,
  Layers,
  ShieldCheck,
  Sparkles,
  Star,
  Terminal,
} from "lucide-react";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import ProjectCard from "@/components/ui/ProjectCard";
import { QUICK_CONTACT, RESUME_DATA, SIGNATURE_PROJECTS, SKILL_GROUPS } from "@/constants/siteData";

const ResumeDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = [
    { id: "All", label: "Overview", icon: Layers },
    { id: "Education", label: "Education", icon: GraduationCap },
    { id: "Experience", label: "Experience", icon: Briefcase },
    { id: "Achievements", label: "Achievements", icon: Award },
    { id: "Projects", label: "Projects", icon: Folder },
    { id: "Skills", label: "Skills", icon: Cpu },
    { id: "Certificates", label: "Certificates", icon: ShieldCheck },
  ];

  return (
    <section className="section-wrap relative pt-8 pb-20 sm:pt-12 sm:pb-28">
      <SeoHead
        title="Resume Dashboard | Interactive Digital Resume — Nikhil Agrahari"
        description="Interactive 6-section digital resume dashboard for Nikhil Agrahari detailing Education, Experience, Achievements, Projects, Skills, and Certificates."
        pathname="/dashboard/resume"
      />

      {/* Header */}
      <FadeInUp>
        <div className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:border-emerald-400/30 dark:text-emerald-300">
            <FileText size={14} className="text-emerald-500" />
            Interactive Digital Credentials
          </p>
          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            Resume <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-400 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium text-slate-600 dark:text-slate-300 sm:text-base">
            Comprehensive digital breakdown of technical education, product engineering experience, verified skills, and project portfolio.
          </p>

          {/* Quick PDF Downloads */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={QUICK_CONTACT.resumeFullStack}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-600 hover:bg-emerald-500 hover:text-slate-950 dark:text-emerald-300 transition shadow-sm"
            >
              <Download size={14} />
              Full-Stack Resume PDF
            </a>
            <a
              href={QUICK_CONTACT.resumeSecurity}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/15 px-4 py-2 text-xs font-black uppercase tracking-wider text-teal-600 hover:bg-teal-500 hover:text-slate-950 dark:text-teal-300 transition shadow-sm"
            >
              <Download size={14} />
              Cyber Security Resume PDF
            </a>
          </div>
        </div>
      </FadeInUp>

      {/* Filter Tabs */}
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                isActive
                  ? "border-emerald-400 bg-emerald-400/20 text-emerald-600 dark:text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-400/40 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Resume Content Blocks */}
      <div className="mt-12 space-y-12">
        
        {/* Section 1: Education */}
        {(activeTab === "All" || activeTab === "Education") && (
          <FadeInUp id="education">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] sm:p-8">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-emerald-500/20">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <GraduationCap size={20} />
                </span>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Section 01</span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">Education &amp; Academic Background</h2>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {RESUME_DATA.education.map((item, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-emerald-500/15 dark:bg-[#020803]/60">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">{item.degree}</h3>
                      <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-300 w-fit">
                        {item.period}
                      </span>
                    </div>
                    <p className="mt-1 font-semibold text-xs text-slate-600 dark:text-slate-300">{item.institution} · <span className="text-emerald-600 dark:text-emerald-400 font-bold">{item.cgpa}</span></p>

                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Key Coursework:</p>
                      <div className="flex flex-wrap gap-2">
                        {item.coursework.map((course, cIdx) => (
                          <span key={cIdx} className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-200">
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInUp>
        )}

        {/* Section 2: Experience */}
        {(activeTab === "All" || activeTab === "Experience") && (
          <FadeInUp id="experience">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] sm:p-8">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-emerald-500/20">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-teal-500/40 bg-teal-500/15 text-teal-600 dark:text-teal-400">
                  <Briefcase size={20} />
                </span>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Section 02</span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">Engineering &amp; Practical Experience</h2>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {RESUME_DATA.experience.map((item, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-emerald-500/15 dark:bg-[#020803]/60">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">{item.role}</h3>
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{item.company} · {item.location}</p>
                      </div>
                      <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-300 w-fit mt-1 sm:mt-0">
                        {item.period}
                      </span>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{item.description}</p>

                    <ul className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {item.highlights.map((hl, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </FadeInUp>
        )}

        {/* Section 3: Achievements */}
        {(activeTab === "All" || activeTab === "Achievements") && (
          <FadeInUp id="achievements">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] sm:p-8">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-emerald-500/20">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-lime-500/40 bg-lime-500/15 text-lime-600 dark:text-lime-400">
                  <Award size={20} />
                </span>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Section 03</span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">Key Achievements &amp; Milestones</h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {RESUME_DATA.achievements.map((item, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-emerald-500/15 dark:bg-[#020803]/60 flex items-start gap-3">
                    <span className="p-2 rounded-xl border border-lime-500/30 bg-lime-500/10 text-lime-600 dark:text-lime-400 shrink-0">
                      <Star size={18} />
                    </span>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">{item.title}</h3>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInUp>
        )}

        {/* Section 4: Signature Projects */}
        {(activeTab === "All" || activeTab === "Projects") && (
          <FadeInUp id="projects">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] sm:p-8">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-emerald-500/20">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Folder size={20} />
                </span>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Section 04</span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">Signature Projects Portfolio</h2>
                </div>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {SIGNATURE_PROJECTS.slice(0, 6).map((project, idx) => (
                  <ProjectCard key={project.slug} project={project} priority={idx < 2} />
                ))}
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-emerald-600 hover:bg-emerald-500 hover:text-slate-950 dark:text-emerald-300 transition"
                >
                  Explore All 10+ Projects Archive
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </FadeInUp>
        )}

        {/* Section 5: Skills */}
        {(activeTab === "All" || activeTab === "Skills") && (
          <FadeInUp id="skills">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] sm:p-8">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-emerald-500/20">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-500/40 bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                  <Cpu size={20} />
                </span>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Section 05</span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">Technical Skills &amp; Stack Grid</h2>
                </div>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {SKILL_GROUPS.map((group, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-emerald-500/15 dark:bg-[#020803]/60">
                    <h3 className="font-mono text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">// {group.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((skill, sIdx) => (
                        <span key={sIdx} className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-800 dark:border-emerald-500/20 dark:bg-[#040e07] dark:text-slate-200 shadow-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInUp>
        )}

        {/* Section 6: Certificates */}
        {(activeTab === "All" || activeTab === "Certificates") && (
          <FadeInUp id="certificates">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] sm:p-8">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-emerald-500/20">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck size={20} />
                </span>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Section 06</span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">Certificates &amp; Credentials</h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {RESUME_DATA.certificates.map((cert, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-emerald-500/15 dark:bg-[#020803]/60 flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">{cert.date}</span>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-sm mt-1">{cert.name}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{cert.issuer}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-emerald-500/20 flex flex-wrap gap-1.5">
                      {cert.skills.map((sk, skIdx) => (
                        <span key={skIdx} className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-300">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInUp>
        )}

      </div>
    </section>
  );
};

export default ResumeDashboardPage;
