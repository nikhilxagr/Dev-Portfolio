import { useState } from "react";
import { Sparkles, Code2, Network, Cpu, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import SeoHead from "@/components/seo/SeoHead";
import Button from "@/components/ui/Button";
import FadeInUp from "@/components/animations/FadeInUp";
import { createBreadcrumbSchema } from "@/utils/seo";

const UPCOMING_LABS = [
  {
    id: "sorting",
    title: "Sorting & Space Complexity Visualizer",
    desc: "Interactive visualizer comparing QuickSort, MergeSort, and HeapSort with step-by-step memory pointer highlights.",
    status: "In Active Development",
    icon: Code2,
    tags: ["QuickSort", "MergeSort", "Time Complexity", "Pointers"],
  },
  {
    id: "graphs",
    title: "Graph Traversal & Shortest Path",
    desc: "Interactive node canvas demonstrating Dijkstra, BFS, and DFS graph traversal algorithm steps in real time.",
    status: "Design Phase",
    icon: Network,
    tags: ["Dijkstra", "BFS / DFS", "Adjacency Matrix", "Weighted Graphs"],
  },
  {
    id: "dp",
    title: "Dynamic Programming & Memoization Tree",
    desc: "Visualizing call stacks and memoization tables for 0/1 Knapsack and Longest Common Subsequence.",
    status: "Planned",
    icon: Cpu,
    tags: ["DP", "Memoization", "Recursion Tree", "Space Tradeoff"],
  },
];

const DsaLabPage = () => {
  const [notified, setNotified] = useState(false);
  const [email, setEmail] = useState("");

  const handleNotify = (e) => {
    e.preventDefault();
    if (!email) return;
    setNotified(true);
  };

  return (
    <>
      <SeoHead
        title="Data Structure & Algorithm Lab | Nikhil Agrahari"
        description="Interactive Data Structure and Algorithm visualizers, problem-solving breakdowns, and complexity analytics by Nikhil Agrahari."
        pathname="/experiments/dsa"
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Experiments", path: "/experiments" },
          { name: "Data Structure Lab", path: "/experiments/dsa" },
        ])}
      />

      {/* DSA Lab Content */}
      <section className="section-wrap pt-4 sm:pt-6 pb-20">
        
        {/* Hero title */}
        <FadeInUp>
          <div className="text-center max-w-4xl mx-auto mb-10">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-wider text-slate-900 dark:text-white drop-shadow-sm">
              DATA STRUCTURE &amp; <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">ALGORITHM LAB</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Interactive visualizers for sorting algorithms, graph traversals, dynamic programming, and space-time complexity analysis.
            </p>
          </div>
        </FadeInUp>

        {/* Launch banner */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-9 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/90 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] mb-12">
          <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
                // Interactive Module Under Construction
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Algorithm Visualizers Launching Soon
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                I am building custom step-by-step canvas visualizers for sorting algorithms, graph traversals, and dynamic programming memoization tables.
              </p>
            </div>

            <div className="shrink-0">
              {notified ? (
                <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 size={16} /> Subscribed for Launch Updates
                </div>
              ) : (
                <form onSubmit={handleNotify} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email for updates"
                    className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white"
                    required
                  />
                  <Button type="submit">
                    Notify Me
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Labs Grid */}
        <div className="mb-6">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">// UPCOMING LAB MODULES</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Planned Visualizer Modules
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Step-by-step algorithm execution and memory pointer inspection.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {UPCOMING_LABS.map((lab) => {
            const Icon = lab.icon;
            return (
              <div
                key={lab.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 dark:border-emerald-500/30 dark:bg-[#030d07]/95"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Icon size={20} />
                    </span>
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                      {lab.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                    {lab.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {lab.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex flex-wrap gap-1.5">
                    {lab.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:border-emerald-500/20 dark:bg-[#020803]/80 dark:text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </section>
    </>
  );
};

export default DsaLabPage;
