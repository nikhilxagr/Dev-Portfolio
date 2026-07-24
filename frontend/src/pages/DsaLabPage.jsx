import { useState } from "react";
import { Sparkles, Code2, Network, Cpu, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import SeoHead from "@/components/seo/SeoHead";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
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
        title="Data Structure & Algorithm Lab"
        description="Interactive Data Structure and Algorithm visualizers, problem-solving breakdowns, and complexity analytics by Nikhil Agrahari."
        pathname="/experiments/dsa"
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Experiments", path: "/experiments" },
          { name: "Data Structure Lab", path: "/experiments/dsa" },
        ])}
      />

      <section className="section-wrap pt-12 sm:pt-20">
        <SectionTitle
          eyebrow="Interactive Lab"
          title="Data Structure &amp; Algorithm Lab"
          description="Interactive visualizers for sorting, graph traversals, dynamic programming, and space-time complexity analysis."
        />
      </section>

      <section className="section-wrap section-divider pt-8 pb-16">
        
        {/* Lab Coming Soon Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/90 p-8 shadow-xl dark:border-slate-800/80 dark:bg-[#050d14]/90 backdrop-blur-xl mb-12">
          <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-emerald-500/10 dark:bg-green-400/10 blur-3xl" />
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-bold text-emerald-400 uppercase">
                <Clock size={13} /> Active Development
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Interactive DSA Visualizers Launching Soon
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Building custom step-by-step visualizers to demonstrate data structures, memory pointer operations, and time complexity tradeoffs in real time.
              </p>
            </div>

            {/* Email Notify Box */}
            <div className="w-full md:w-auto shrink-0">
              {notified ? (
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl">
                  <CheckCircle2 size={18} /> You will be notified when DSA Labs launch!
                </div>
              ) : (
                <form onSubmit={handleNotify} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email to get notified..."
                    required
                    className="rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs outline-none focus:border-green-400 text-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-green-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-green-400 transition uppercase tracking-wider"
                  >
                    Notify Me
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Lab Modules Preview */}
        <div className="mb-8">
          <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Upcoming DSA Lab Modules
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Preview of algorithm modules being developed for interactive execution.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {UPCOMING_LABS.map((lab) => {
            const Icon = lab.icon;
            return (
              <div
                key={lab.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-green-500/50 dark:border-slate-800/90 dark:bg-[#050d14]/90"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                      <Icon size={20} />
                    </span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      {lab.status}
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {lab.title}
                  </h4>
                  <p className="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {lab.desc}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-1.5 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                  {lab.tags.map((t) => (
                    <span key={t} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                      {t}
                    </span>
                  ))}
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
