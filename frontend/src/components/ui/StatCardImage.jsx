import { Code2, ExternalLink, GitBranch, ShieldCheck } from "lucide-react";

const StatCardShell = ({
  icon: Icon,
  title,
  linkLabel,
  profileUrl,
  ariaLabel,
  footerLeft,
  username,
  children,
}) => (
  <article className="flex h-full flex-col justify-between rounded-xl border border-black/[0.08] bg-white p-5 transition-colors duration-150 hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-white/[0.16]">
    <div className="flex items-center justify-between gap-2 border-b border-black/[0.06] pb-3 dark:border-white/[0.08]">
      <div className="flex items-center gap-2">
        <Icon size={16} strokeWidth={1.5} className="text-slate-500 dark:text-[#7a8296]" />
        <span className="font-display text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
          {title}
        </span>
      </div>
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 transition-colors duration-150 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
      >
        {linkLabel}
        <ExternalLink size={12} strokeWidth={1.5} />
      </a>
    </div>

    <div className="my-auto py-4">{children}</div>

    <div className="flex items-center justify-between border-t border-black/[0.06] pt-3 font-mono text-xs text-slate-500 dark:border-white/[0.06] dark:text-[#7a8296]">
      <div>{footerLeft}</div>
      <span>@{username}</span>
    </div>
  </article>
);

export const GitHubStreakCard = ({
  username = "nikhilxagr",
  profileUrl = "https://github.com/nikhilxagr",
}) => (
  <StatCardShell
    icon={GitBranch}
    title="GitHub Activity"
    linkLabel="GitHub"
    profileUrl={profileUrl}
    ariaLabel="View GitHub Profile for Nikhil Agrahari"
    username={username}
    footerLeft={
      <span className="inline-flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
        Active Streak
      </span>
    }
  >
    <div className="space-y-3">
      <div className="flex items-baseline justify-between rounded-lg border border-black/[0.06] bg-slate-50 px-4 py-3 dark:border-white/[0.06] dark:bg-[#1a1e28]">
        <div>
          <p className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
            Total Contributions
          </p>
          <p className="mt-1 font-display text-2xl font-medium tracking-[-0.02em] text-slate-900 tabular-nums dark:text-[#eef0f5]">
            1,657
          </p>
        </div>
        <span className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
          Since Sep 2024
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-emerald-600/25 bg-emerald-500/[0.08] p-3 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <p className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
            Current Streak
          </p>
          <p className="mt-1 font-display text-xl font-medium text-emerald-800 tabular-nums dark:text-emerald-300">
            437 days
          </p>
        </div>
        <div className="rounded-lg border border-black/[0.06] bg-slate-50 p-3 dark:border-white/[0.06] dark:bg-[#1a1e28]">
          <p className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
            Longest Streak
          </p>
          <p className="mt-1 font-display text-xl font-medium text-slate-900 tabular-nums dark:text-[#eef0f5]">
            437 days
          </p>
        </div>
      </div>
    </div>
  </StatCardShell>
);

export const LeetCodeStatsCard = ({
  username = "nikhilxagr",
  profileUrl = "https://leetcode.com/u/nikhilxagr/",
}) => {
  const breakdown = [
    { label: "Easy", count: "109", total: "978", pct: "72.7%" },
    { label: "Medium", count: "40", total: "2,152", pct: "26.7%" },
    { label: "Hard", count: "1", total: "994", pct: "0.6%" },
  ];

  return (
    <StatCardShell
      icon={Code2}
      title="LeetCode Progress"
      linkLabel="LeetCode"
      profileUrl={profileUrl}
      ariaLabel="View LeetCode Profile for Nikhil Agrahari"
      username={username}
      footerLeft={<span className="tabular-nums">Rank #1,202,742</span>}
    >
      <div className="space-y-3">
        <div className="flex items-baseline justify-between rounded-lg border border-black/[0.06] bg-slate-50 px-4 py-3 dark:border-white/[0.06] dark:bg-[#1a1e28]">
          <div>
            <p className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
              Problems Solved
            </p>
            <p className="mt-1 font-display text-2xl font-medium tracking-[-0.02em] text-slate-900 tabular-nums dark:text-[#eef0f5]">
              150
            </p>
          </div>
          <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
            52-week streak
          </span>
        </div>

        {/* Single stacked distribution bar */}
        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/[0.08]">
          <div className="h-full bg-emerald-600 dark:bg-emerald-400" style={{ width: "72.7%" }} />
          <div className="h-full bg-slate-400 dark:bg-[#a3a9b8]" style={{ width: "26.7%" }} />
          <div className="h-full bg-slate-600 dark:bg-[#eef0f5]" style={{ width: "0.6%" }} />
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {breakdown.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-black/[0.06] bg-slate-50 p-2.5 dark:border-white/[0.06] dark:bg-[#1a1e28]"
            >
              <p className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                {item.label}
              </p>
              <p className="mt-1 font-display text-base font-medium text-slate-900 tabular-nums dark:text-[#eef0f5]">
                {item.count}
                <span className="text-xs font-normal text-slate-400 dark:text-[#7a8296]">
                  /{item.total}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </StatCardShell>
  );
};

export const TryHackMeBadgeCard = ({
  username = "nikhilxagr",
  profileUrl = "https://tryhackme.com/p/nikhilxagr",
}) => (
  <StatCardShell
    icon={ShieldCheck}
    title="TryHackMe Security"
    linkLabel="TryHackMe"
    profileUrl={profileUrl}
    ariaLabel="View TryHackMe Profile for Nikhil Agrahari"
    username={username}
    footerLeft={
      <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
        Top 1% Global
      </span>
    }
  >
    <div className="space-y-3">
      <div className="flex items-baseline justify-between rounded-lg border border-black/[0.06] bg-slate-50 px-4 py-3 dark:border-white/[0.06] dark:bg-[#1a1e28]">
        <div>
          <p className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
            Total Points
          </p>
          <p className="mt-1 font-display text-2xl font-medium tracking-[-0.02em] text-slate-900 tabular-nums dark:text-[#eef0f5]">
            38,011
          </p>
        </div>
        <span className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
          Rank [0xB]
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-lg border border-black/[0.06] bg-slate-50 p-2.5 dark:border-white/[0.06] dark:bg-[#1a1e28]">
          <p className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
            Streak
          </p>
          <p className="mt-1 font-display text-base font-medium text-slate-900 tabular-nums dark:text-[#eef0f5]">
            172d
          </p>
        </div>
        <div className="rounded-lg border border-black/[0.06] bg-slate-50 p-2.5 dark:border-white/[0.06] dark:bg-[#1a1e28]">
          <p className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
            Rooms
          </p>
          <p className="mt-1 font-display text-base font-medium text-slate-900 tabular-nums dark:text-[#eef0f5]">
            275+
          </p>
        </div>
        <div className="rounded-lg border border-black/[0.06] bg-slate-50 p-2.5 dark:border-white/[0.06] dark:bg-[#1a1e28]">
          <p className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
            Badges
          </p>
          <p className="mt-1 font-display text-base font-medium text-slate-900 tabular-nums dark:text-[#eef0f5]">
            19
          </p>
        </div>
      </div>
    </div>
  </StatCardShell>
);
