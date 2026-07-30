import { useState } from "react";

export const GitHubStreakCard = ({ isDark, username = "nikhilxagr" }) => {
  const [imgState, setImgState] = useState("primary");

  const primaryUrl = `https://streak-stats.demolab.com/?user=${username}&theme=${isDark ? "algolia" : "default"}&hide_border=true`;
  const secondaryUrl = `https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=${isDark ? "dark" : "default"}&hide_border=true`;

  if (imgState === "primary") {
    return (
      <img
        src={primaryUrl}
        alt={`GitHub streak stats for ${username}`}
        className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
        loading="lazy"
        decoding="async"
        onError={() => setImgState("secondary")}
      />
    );
  }

  if (imgState === "secondary") {
    return (
      <img
        src={secondaryUrl}
        alt={`GitHub streak stats for ${username}`}
        className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
        loading="lazy"
        decoding="async"
        onError={() => setImgState("fallback")}
      />
    );
  }

  return (
    <div className="w-full rounded-xl bg-[#091522] p-4 text-white font-outfit shadow-inner border border-green-500/20">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <span className="text-xs font-mono font-bold text-green-400">@{username} // GITHUB STREAK</span>
        <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-slate-900/80 p-2.5 border border-white/5">
          <p className="text-lg font-black text-cyan-300">1,208</p>
          <p className="text-[10px] font-medium text-slate-400">Total Contributions</p>
        </div>
        <div className="rounded-lg bg-green-950/40 p-2.5 border border-green-500/30">
          <p className="text-lg font-black text-green-400">318 🔥</p>
          <p className="text-[10px] font-bold text-green-300">Current Streak</p>
        </div>
        <div className="rounded-lg bg-slate-900/80 p-2.5 border border-white/5">
          <p className="text-lg font-black text-cyan-300">318</p>
          <p className="text-[10px] font-medium text-slate-400">Longest Streak</p>
        </div>
      </div>
    </div>
  );
};

export const LeetCodeStatsCard = ({ isDark, username = "nikhilxagr" }) => {
  const [imgState, setImgState] = useState("primary");

  const primaryUrl = `https://leetcard.jacoblin.cool/${username}?theme=${isDark ? "dark" : "light"}&ext=heatmap`;
  const secondaryUrl = `https://leetcode-badge.vercel.app/api/users/${username}`;

  if (imgState === "primary") {
    return (
      <img
        src={primaryUrl}
        alt={`LeetCode stats for ${username}`}
        className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
        loading="lazy"
        decoding="async"
        onError={() => setImgState("secondary")}
      />
    );
  }

  if (imgState === "secondary") {
    return (
      <img
        src={secondaryUrl}
        alt={`LeetCode stats for ${username}`}
        className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
        loading="lazy"
        decoding="async"
        onError={() => setImgState("fallback")}
      />
    );
  }

  return (
    <div className="w-full rounded-xl bg-[#0d1117] p-4 text-white font-outfit shadow-inner border border-amber-500/20">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-amber-400">@{username}</span>
          <span className="text-[10px] font-mono text-slate-400">#1244884</span>
        </div>
        <span className="text-xs font-black text-amber-400">134 Solved</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <div className="rounded-lg bg-emerald-950/40 p-2 border border-emerald-500/30">
          <p className="text-base font-black text-emerald-400">97</p>
          <p className="text-[10px] font-bold text-emerald-300">Easy</p>
        </div>
        <div className="rounded-lg bg-amber-950/40 p-2 border border-amber-500/30">
          <p className="text-base font-black text-amber-400">36</p>
          <p className="text-[10px] font-bold text-amber-300">Medium</p>
        </div>
        <div className="rounded-lg bg-rose-950/40 p-2 border border-rose-500/30">
          <p className="text-base font-black text-rose-400">1</p>
          <p className="text-[10px] font-bold text-rose-300">Hard</p>
        </div>
      </div>
      <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden flex">
        <div className="h-full bg-emerald-400" style={{ width: "72%" }} />
        <div className="h-full bg-amber-400" style={{ width: "27%" }} />
        <div className="h-full bg-rose-400" style={{ width: "1%" }} />
      </div>
    </div>
  );
};

export const TryHackMeBadgeCard = ({ username = "nikhilxagr" }) => {
  const [imgState, setImgState] = useState("primary");

  const primaryUrl = `https://tryhackme-badges.s3.amazonaws.com/${username}.png`;

  if (imgState === "primary") {
    return (
      <img
        src={primaryUrl}
        alt={`TryHackMe badge for ${username}`}
        className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
        loading="lazy"
        decoding="async"
        onError={() => setImgState("fallback")}
      />
    );
  }

  return (
    <div className="w-full rounded-xl bg-[#09101d] p-4 text-white font-outfit border border-red-500/30 shadow-inner">
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-red-400">@{username}</span>
          <span className="text-[10px] font-mono text-slate-400">[0xB]</span>
        </div>
        <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-black text-red-400 border border-red-500/40">
          TOP 1%
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-slate-900 p-2 border border-white/5">
          <p className="text-base font-black text-red-400">38,011</p>
          <p className="text-[10px] text-slate-400">Points</p>
        </div>
        <div className="rounded-lg bg-slate-900 p-2 border border-white/5">
          <p className="text-base font-black text-green-400">172</p>
          <p className="text-[10px] text-slate-400">Days Streak</p>
        </div>
        <div className="rounded-lg bg-slate-900 p-2 border border-white/5">
          <p className="text-base font-black text-cyan-400">275+</p>
          <p className="text-[10px] text-slate-400">Rooms Solved</p>
        </div>
      </div>
    </div>
  );
};
