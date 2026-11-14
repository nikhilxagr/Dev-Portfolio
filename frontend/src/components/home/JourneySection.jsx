import { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import FadeInUp from "@/components/animations/FadeInUp";

const featuredHomeJourney = [
  {
    id: "lenovo-leap-hackathon-2026",
    tag: "Hackathons",
    date: "Sep 18, 2026",
    title: "Lenovo LEAP Hackathon",
    subOrg: "AKTU, Lucknow",
    description:
      "Presented TaskNexus at AKTU, Lucknow—a service marketplace concept connecting clients with freelancers and streamlining task assignment, quality checks, and delivery.",
    imageUrl: "/images/journey/Lenovo1.jpg",
    skills: ["Hackathons", "Problem Solving", "Rapid Prototyping"],
  },
  {
    id: "nerds-hack-days-lucknow-2026",
    tag: "Hackathons",
    date: "Jul 26, 2026",
    title: "Nerds Hack Days: Building Kanoon-Mate",
    subOrg: "Nerds Community Lucknow",
    description:
      "Built Kanoon-Mate during the Nerds Hack Days offline hackathon in Lucknow, combining OCR document extraction, law detection, and guided case tracking.",
    imageUrl: "/images/journey/Nerd1.jpg",
    skills: ["Generative AI", "Google Gemini API", "OCR Integration"],
  },
  {
    id: "qualcomm-ai-hub-heygen-2026",
    tag: "Workshops",
    date: "Sep 27, 2026",
    title: "Qualcomm AI Hub Meetup & HeyGen Event",
    subOrg: "Qualcomm & HeyGen Lucknow",
    description:
      "Attended an engineering workshop in Lucknow covering Qualcomm AI Hub and HeyGen, exploring on-device inference and structured AI agent workflows.",
    imageUrl: "/images/journey/Qualcum1.jpg",
    skills: ["On-Device AI", "Generative AI", "AI Agents"],
  },
];

const JourneySection = () => {
  return (
    <section className="section-wrap section-divider">
      <FadeInUp>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Experience &amp; Events
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-[-0.02em] text-slate-900 sm:text-4xl dark:text-[#eef0f5]">
              Professional Journey
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-[#a3a9b8]">
              Hackathons, workshops, conferences, and technical milestones outside regular project work.
            </p>
          </div>
          <Link
            to="/journey"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-emerald-700 transition-colors duration-150 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            All milestones
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </FadeInUp>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredHomeJourney.map((item, index) => (
          <FadeInUp key={item.id} delay={index * 0.06}>
            <a
              href={`/journey?selected=${item.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-black/[0.08] bg-white transition-colors duration-150 hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-white/[0.16]"
            >
              <div className="relative aspect-[16/10] overflow-hidden border-b border-black/[0.06] bg-slate-950 dark:border-white/[0.08]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  width={640}
                  height={400}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-12 bg-gradient-to-t from-[#11141c]/50 to-transparent dark:block" />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center rounded-md border border-black/[0.08] bg-slate-50 px-2.5 py-0.5 font-mono text-xs text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]">
                    {item.tag}
                  </span>
                  <span className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                    {item.date}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-lg font-medium leading-snug tracking-[-0.01em] text-slate-900 line-clamp-2 transition-colors duration-150 group-hover:text-emerald-700 dark:text-[#eef0f5] dark:group-hover:text-emerald-400">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-[#7a8296]">
                  {item.subOrg}
                </p>

                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3 dark:text-[#a3a9b8]">
                  {item.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-black/[0.06] pt-4 dark:border-white/[0.08]">
                  {item.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="inline-flex items-center rounded-md border border-black/[0.08] bg-slate-50 px-2 py-0.5 font-mono text-xs text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]"
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
    </section>
  );
};

const MemoizedJourneySection = memo(JourneySection);
MemoizedJourneySection.displayName = "JourneySection";

export default MemoizedJourneySection;
