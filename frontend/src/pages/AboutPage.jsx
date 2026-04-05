import { Helmet } from "react-helmet-async";
import Button from "@/components/ui/Button";
import SectionTitle from "@/components/ui/SectionTitle";
import FadeInUp from "@/components/animations/FadeInUp";
import {
  ABOUT_STORY,
  FOCUS_AREAS,
  QUICK_CONTACT,
  SITE_PROFILE,
  STATS_METRICS,
} from "@/constants/siteData";

const AboutPage = () => {
  const conciseStory = [
    "Hi, I'm Nikhil Agrahari.",
    "I am a BCA student at BBD University, Lucknow, focused on full stack development and cyber security learning.",
    "I build practical web applications, improve backend quality, and keep working on secure coding habits through labs and projects.",
    "My goal is simple: become an engineer who can build modern products and protect them with the right security mindset.",
  ];

  return (
    <>
      <Helmet>
        <title>About | Nikhil Portfolio</title>
        <meta
          name="description"
          content="About Nikhil Agrahari: BCA student, full stack developer, and cybersecurity learner building practical products and labs."
        />
      </Helmet>

      <section className="section-wrap pt-12 sm:pt-20">
        <SectionTitle
          eyebrow="Professional Profile"
          title="About Me"
          description="I focus on building clean web products, improving backend reliability, and growing practical cyber security skills in a consistent way."
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <FadeInUp className="card-surface rounded-3xl p-6 sm:p-7">
            <h3 className="text-2xl font-semibold text-cyan-100 sm:text-[1.9rem]">
              My Journey in Simple Words
            </h3>
            <div className="mt-4 space-y-4 text-base leading-7 text-slate-300">
              {conciseStory.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={
                    index === 0 ? "text-lg font-medium text-cyan-50" : ""
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-slate-900/70 p-4">
              <p className="text-sm uppercase tracking-[0.14em] text-emerald-300">
                What I am improving now
              </p>
              <p className="mt-2 text-base leading-7 text-slate-300">
                Better full stack delivery, stronger backend structure, and
                practical security-focused implementation quality.
              </p>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.08} className="card-surface rounded-3xl p-6">
            {SITE_PROFILE.profileImage ? (
              <div className="mb-6 flex justify-center">
                <div className="h-56 w-56 overflow-hidden rounded-full border-4 border-cyan-300/35 bg-slate-900/70 shadow-[0_0_0_4px_rgba(34,211,238,0.08)]">
                  <img
                    src={SITE_PROFILE.profileImage}
                    alt={SITE_PROFILE.profileImageAlt}
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : null}

            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
              Profile Snapshot
            </p>
            <h3 className="mt-2 text-xl font-semibold text-cyan-100">
              {SITE_PROFILE.fullName}
            </h3>
            <p className="mt-2 text-base leading-7 text-slate-300">
              {SITE_PROFILE.headline}
            </p>

            <div className="mt-4 space-y-2 text-base text-slate-300">
              <p>
                <span className="text-slate-500">Education:</span>{" "}
                {SITE_PROFILE.education}
              </p>
              <p>
                <span className="text-slate-500">Location:</span>{" "}
                {SITE_PROFILE.location}
              </p>
              <p>
                <span className="text-slate-500">Email:</span>{" "}
                {QUICK_CONTACT.email}
              </p>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {STATS_METRICS.slice(0, 2).map((metric) => (
                <div
                  key={metric.id}
                  className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-3"
                >
                  <p className="font-display text-2xl text-cyan-100">
                    {metric.value}
                  </p>
                  <p className="text-sm text-slate-400">{metric.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                href={QUICK_CONTACT.resume}
                target="_blank"
                rel="noreferrer"
              >
                Resume
              </Button>
              <Button
                href={QUICK_CONTACT.linkedin}
                target="_blank"
                rel="noreferrer"
                variant="ghost"
              >
                LinkedIn
              </Button>
            </div>
          </FadeInUp>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <FadeInUp
            delay={0.12}
            className="card-surface rounded-2xl p-6 lg:col-span-2"
          >
            <h3 className="text-2xl font-semibold text-cyan-100">
              Focus Areas
            </h3>
            <ul className="mt-4 grid gap-3 text-base leading-7 text-slate-300 sm:grid-cols-2">
              {FOCUS_AREAS.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </FadeInUp>

          <FadeInUp delay={0.16} className="card-surface rounded-2xl p-6">
            <h3 className="text-2xl font-semibold text-cyan-100">
              Current Direction
            </h3>
            <p className="mt-3 text-base leading-7 text-slate-300">
              I am actively improving full stack delivery quality, practical
              cybersecurity knowledge, and project storytelling for recruiters
              and clients.
            </p>
            <p className="mt-3 text-base leading-7 text-slate-300">
              {SITE_PROFILE.availability}
            </p>

            <Button to="/contact" className="mt-5">
              Connect With Me
            </Button>
          </FadeInUp>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
