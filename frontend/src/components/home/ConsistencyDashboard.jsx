import { memo } from "react";
import FadeInUp from "@/components/animations/FadeInUp";
import { QUICK_CONTACT } from "@/constants/siteData";
import {
  GitHubStreakCard,
  LeetCodeStatsCard,
  TryHackMeBadgeCard,
} from "@/components/ui/StatCardImage";

const ConsistencyDashboard = () => {
  const githubUsername =
    QUICK_CONTACT.github.split("/").filter(Boolean).pop() || "nikhilxagr";
  const leetcodeUsername =
    QUICK_CONTACT.leetcode.split("/").filter(Boolean).pop() || "nikhilxagr";
  const tryHackMeUsername =
    QUICK_CONTACT.tryhackme.split("/").filter(Boolean).pop() || "nikhilxagr";

  return (
    <section className="section-wrap section-divider pt-10 pb-16">
      <FadeInUp>
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(52,211,153,0.08),transparent_34%),radial-gradient(circle_at_86%_84%,rgba(16,185,129,0.08),transparent_40%)]" />

          <div className="relative text-center mb-6">
            <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              // Proof of Work
            </p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Coding Consistency <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">Showcase</span>
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              Live GitHub, LeetCode, and TryHackMe platform statistics.
            </p>
          </div>

          <div className="relative grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <GitHubStreakCard username={githubUsername} profileUrl={QUICK_CONTACT.github} />
            <LeetCodeStatsCard username={leetcodeUsername} profileUrl={QUICK_CONTACT.leetcode} />
            <TryHackMeBadgeCard username={tryHackMeUsername} profileUrl={QUICK_CONTACT.tryhackme} />
          </div>
        </div>
      </FadeInUp>
    </section>
  );
};

const MemoizedConsistencyDashboard = memo(ConsistencyDashboard);
MemoizedConsistencyDashboard.displayName = "ConsistencyDashboard";

export default MemoizedConsistencyDashboard;
