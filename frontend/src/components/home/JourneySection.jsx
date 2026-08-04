import { memo } from "react";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import FadeInUp from "@/components/animations/FadeInUp";

const featuredHomeJourney = [
  {
    id: "nerds-hack-days-lucknow-2026",
    tag: "HACKATHONS",
    date: "JULY 26, 2026",
    title: "NERDS HACK DAYS: BUILDING KANOON-MATE",
    subOrg: "// NERDS COMMUNITY LUCKNOW",
    description:
      "Participated in the Nerds Hack Days offline hackathon in Lucknow, collaborating with developers, designers, and AI builders to engineer Kanoon-Mate—an intelligent AI legal...",
    imageUrl: "/images/journey/Nerd1.jpg",
    skills: ["Generative AI", "Google Gemini API", "OCR Integration"],
  },
  {
    id: "android-nova-2026",
    tag: "WORKSHOPS",
    date: "JULY 17, 2026",
    title: "ANDROID NOVA 2.0",
    subOrg: "// CYBER INTELLIGENCE COMMUNITY LUCKNOW",
    description:
      "Attended Android Nova 2.0 today, and it was an amazing experience! Great to learn about Android Development, AI, and future technologies, while connecting with passionate.. developers and tech enthusiasts.",
    imageUrl: "/images/journey/Android2.jpeg",
    skills: ["Android Development", "AI", "Mobile Development"],
  },
  {
    id: "assocham-samarth-2026",
    tag: "INTERNSHIP",
    date: "JUNE 01 - JULY 15, 2026",
    title: "ASSOCHAM SAMARTH 2.0 INTERNSHIP",
    subOrg: "// ASSOCHAM UP-UK",
    description:
      "Selected for AICTE-supported SAMARTH 2.0 Industry Exposure Internship — gained real-world industry experience under ASSOCHAM guidance.",
    imageUrl: "/images/journey/Certi1.jpeg",
    skills: ["Industry Exposure", "Policy Advocacy", "Digital Compliance"],
  },
];

const JourneySection = () => {
  return (
    <section className="section-wrap section-divider pt-10 pb-12">
      <FadeInUp>
        <div className="text-center max-w-3xl mx-auto">
          <div className="mb-4 inline-block">
            <span className="inline-flex items-center gap-2 rounded-full border border-lime-500/40 dark:border-[#ccff00]/30 bg-lime-500/10 dark:bg-[#ccff00]/10 px-4.5 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-lime-700 dark:text-[#ccff00]">
              CONTINUOUS LEARNING &amp; GROWTH
            </span>
          </div>

          <h2 className="font-display text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
            PROFESSIONAL
            <span className="block text-slate-900 dark:text-white">JOURNEY</span>
          </h2>

          <p className="mt-4 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Explore my experiences beyond projects and blogs, including internships, workshops, hackathons, conferences, certifications, industrial visits, and technical events.
          </p>
        </div>
      </FadeInUp>

      {/* 3 Featured Cards Grid */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredHomeJourney.map((item, index) => (
          <FadeInUp key={item.id} delay={index * 0.08}>
            <a
              href={`/journey?selected=${item.id}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#070e14] shadow-md dark:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-lime-500/50 dark:hover:border-[#ccff00]/40"
            >
              {/* Card Image Cover */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-950">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  width={640}
                  height={208}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              </div>

              {/* Card Header Tag & Date */}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center rounded-sm border border-lime-500/50 dark:border-[#ccff00]/40 bg-lime-500/10 dark:bg-[#ccff00]/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-lime-700 dark:text-[#ccff00]">
                    {item.tag}
                  </span>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {item.date}
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="mt-3 font-display text-sm sm:text-base font-black uppercase tracking-tight text-slate-900 dark:text-white leading-snug group-hover:text-lime-600 dark:group-hover:text-[#ccff00] transition-colors line-clamp-2">
                  {item.title}
                </h3>

                {/* Sub Organization Line */}
                <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {item.subOrg}
                </p>

                {/* Description */}
                <p className="mt-2.5 flex-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
                  {item.description}
                </p>

                {/* Skill Pills Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex flex-wrap gap-1.5">
                  {item.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="inline-flex items-center rounded-md border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-2 py-0.5 font-mono text-[9.5px] text-slate-600 dark:text-slate-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          </FadeInUp>
        ))}
      </div>

      {/* Bright Neon-Lime Pill CTA Button */}
      <FadeInUp delay={0.25}>
        <div className="mt-10 flex justify-center">
          <Button
            to="/journey"
            className="rounded-full bg-[#ccff00] text-black font-black font-mono text-xs uppercase tracking-wider px-8 py-3.5 hover:bg-lime-300 dark:hover:bg-[#b8e600] shadow-[0_0_24px_rgba(204,255,0,0.4)] transition-all duration-300 transform hover:scale-105 active:scale-95 inline-flex items-center gap-2 border-0"
          >
            EXPLORE COMPLETE JOURNEY <ArrowRight size={14} strokeWidth={3} />
          </Button>
        </div>
      </FadeInUp>
    </section>
  );
};

const MemoizedJourneySection = memo(JourneySection);
MemoizedJourneySection.displayName = "JourneySection";

export default MemoizedJourneySection;
