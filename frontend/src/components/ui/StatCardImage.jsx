import { useState } from "react";
import { Flame, ShieldCheck, ExternalLink, Code2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export const GitHubStreakCard = ({ username = "nikhilxagr", profileUrl = "https://github.com/nikhilxagr" }) => {
  const { isDark } = useTheme();
  const [imgFailed, setImgFailed] = useState(false);
  const imageUrl = `https://streak-stats.demolab.com?user=${username}&theme=${isDark ? "Nightowl" : "default"}&hide_border=false`;

  return (
    <div className="flex flex-col justify-between h-full rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:border-emerald-500/50 hover:shadow-md dark:border-emerald-500/20 dark:bg-[#050d14] dark:hover:border-emerald-400/40">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-emerald-600 dark:text-emerald-400">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span className="font-display text-base font-bold text-slate-900 dark:text-white">
            GitHub Streak
          </span>
        </div>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View GitHub Profile for Nikhil Agrahari"
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
        >
          View GitHub <ExternalLink size={11} />
        </a>
      </div>

      {/* Image or Fallback */}
      <div className="flex items-center justify-center my-auto overflow-hidden rounded-xl">
        {!imgFailed ? (
          <img
            src={imageUrl}
            alt="GitHub Streak Stats for Nikhil Agrahari"
            className="w-full h-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-full grid grid-cols-3 gap-2 text-center my-auto py-2">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 dark:border-emerald-500/20 dark:bg-emerald-950/20">
              <p className="text-xl font-black text-slate-900 dark:text-white">1,208</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Contributions</p>
            </div>
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3">
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                318 <Flame size={14} className="text-amber-500 fill-amber-500" />
              </p>
              <p className="mt-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Streak</p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 dark:border-emerald-500/20 dark:bg-emerald-950/20">
              <p className="text-xl font-black text-slate-900 dark:text-white">318</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Longest</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/5 pt-2.5">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Profile
        </span>
        <span>@{username}</span>
      </div>
    </div>
  );
};

export const LeetCodeStatsCard = ({ username = "nikhilxagr", profileUrl = "https://leetcode.com/u/nikhilxagr/" }) => {
  const { isDark } = useTheme();
  const [imgFailed, setImgFailed] = useState(false);
  const imageUrl = `https://leetcard.jacoblin.cool/${username}?theme=${isDark ? "dark" : "light"}&ext=heatmap`;

  return (
    <div className="flex flex-col justify-between h-full rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:border-amber-500/50 hover:shadow-md dark:border-amber-500/20 dark:bg-[#050d14] dark:hover:border-amber-400/40">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-amber-500" />
          <span className="font-display text-base font-bold text-slate-900 dark:text-white">
            LeetCode Stats
          </span>
        </div>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View LeetCode Profile for Nikhil Agrahari"
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
        >
          View LeetCode <ExternalLink size={11} />
        </a>
      </div>

      {/* Image or Fallback */}
      <div className="flex items-center justify-center my-auto overflow-hidden rounded-xl">
        {!imgFailed ? (
          <img
            src={imageUrl}
            alt="LeetCode Profile Stats for Nikhil Agrahari"
            className="w-full h-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-full space-y-2 py-2">
            <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
              <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300">Total Solved</span>
              <span className="text-xl font-black text-amber-600 dark:text-amber-400">134 Problems</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2">
                <p className="text-base font-black text-emerald-600 dark:text-emerald-400">97</p>
                <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">Easy</p>
              </div>
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2">
                <p className="text-base font-black text-amber-600 dark:text-amber-400">36</p>
                <p className="text-[10px] font-bold text-amber-700 dark:text-amber-300">Medium</p>
              </div>
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2">
                <p className="text-base font-black text-rose-600 dark:text-rose-400">1</p>
                <p className="text-[10px] font-bold text-rose-700 dark:text-rose-300">Hard</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/5 pt-2.5">
        <span>Rank: #1,244,884</span>
        <span>@{username}</span>
      </div>
    </div>
  );
};

export const TryHackMeBadgeCard = ({ username = "nikhilxagr", profileUrl = "https://tryhackme.com/p/nikhilxagr" }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const imageUrl = `https://tryhackme-badges.s3.amazonaws.com/${username}.png`;

  return (
    <div className="flex flex-col justify-between h-full rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:border-rose-500/50 hover:shadow-md dark:border-rose-500/20 dark:bg-[#050d14] dark:hover:border-rose-400/40">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-rose-500" />
          <span className="font-display text-base font-bold text-slate-900 dark:text-white">
            TryHackMe Proof
          </span>
        </div>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View TryHackMe Profile for Nikhil Agrahari"
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
        >
          View TryHackMe <ExternalLink size={11} />
        </a>
      </div>

      {/* Image or Fallback */}
      <div className="flex items-center justify-center my-auto overflow-hidden rounded-xl">
        {!imgFailed ? (
          <img
            src={imageUrl}
            alt="TryHackMe Badge for Nikhil Agrahari"
            className="w-full h-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-full grid grid-cols-3 gap-2 text-center my-auto py-2">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 dark:border-rose-500/20 dark:bg-rose-950/20">
              <p className="text-xl font-black text-slate-900 dark:text-white">38,011</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Points</p>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">172</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Streak</p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 dark:border-rose-500/20 dark:bg-rose-950/20">
              <p className="text-xl font-black text-slate-900 dark:text-white">275+</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rooms</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/5 pt-2.5">
        <span className="rounded-full border border-rose-500/40 bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-300">
          Top 1% Global
        </span>
        <span>@{username}</span>
      </div>
    </div>
  );
};




