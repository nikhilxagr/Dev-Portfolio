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
    <section className="section-wrap section-divider">
      <FadeInUp>
        <div className="mb-8 max-w-2xl">
          <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Proof of Work
          </p>
          <h2 className="mt-2 font-display text-3xl font-medium tracking-[-0.02em] text-slate-900 sm:text-4xl dark:text-[#eef0f5]">
            Coding Consistency
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-[#a3a9b8]">
            Verified activity across GitHub, LeetCode, and TryHackMe.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <GitHubStreakCard
            username={githubUsername}
            profileUrl={QUICK_CONTACT.github}
          />
          <LeetCodeStatsCard
            username={leetcodeUsername}
            profileUrl={QUICK_CONTACT.leetcode}
          />
          <TryHackMeBadgeCard
            username={tryHackMeUsername}
            profileUrl={QUICK_CONTACT.tryhackme}
          />
        </div>
      </FadeInUp>
    </section>
  );
};

const MemoizedConsistencyDashboard = memo(ConsistencyDashboard);
MemoizedConsistencyDashboard.displayName = "ConsistencyDashboard";

export default MemoizedConsistencyDashboard;
