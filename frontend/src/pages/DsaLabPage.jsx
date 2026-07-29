import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, Code2, Network, Cpu, Play, Pause, RotateCcw, SkipForward, ChevronRight, CheckCircle2, BarChart2, Layers, Zap } from "lucide-react";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import { createBreadcrumbSchema } from "@/utils/seo";

// ─────────────────────────────────────────────────────────────────────────────
// Sorting Algorithm Generators (yield every step)
// ─────────────────────────────────────────────────────────────────────────────

function* quickSortGen(arr, low = 0, high = arr.length - 1, comparisons = { count: 0 }) {
  if (low >= high) return;
  // Partition
  const pivot = arr[high];
  let i = low - 1;
  yield { arr: [...arr], comparing: [high], pivotIdx: high, swapped: [], phase: `Pivot = ${pivot}` };

  for (let j = low; j < high; j++) {
    comparisons.count++;
    yield { arr: [...arr], comparing: [j, high], pivotIdx: high, swapped: [], comparisons: comparisons.count, phase: `Compare arr[${j}]=${arr[j]} with pivot=${pivot}` };
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      yield { arr: [...arr], comparing: [], pivotIdx: high, swapped: [i, j], comparisons: comparisons.count, phase: `Swap arr[${i}] ↔ arr[${j}]` };
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  const pi = i + 1;
  yield { arr: [...arr], comparing: [], pivotIdx: pi, swapped: [pi, high], sorted: [pi], comparisons: comparisons.count, phase: `Placed pivot ${arr[pi]} at index ${pi}` };

  yield* quickSortGen(arr, low, pi - 1, comparisons);
  yield* quickSortGen(arr, pi + 1, high, comparisons);
}

function* mergeSortGen(arr, left = 0, right = arr.length - 1, aux = [...arr], comparisons = { count: 0 }) {
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);

  yield { arr: [...arr], comparing: [left, mid], swapped: [], phase: `Divide [${left}..${mid}] | [${mid + 1}..${right}]` };
  yield* mergeSortGen(arr, left, mid, aux, comparisons);
  yield* mergeSortGen(arr, mid + 1, right, aux, comparisons);

  // Merge
  let i = left, j = mid + 1, k = left;
  const temp = [];

  while (i <= mid && j <= right) {
    comparisons.count++;
    yield { arr: [...arr], comparing: [i, j], swapped: [], comparisons: comparisons.count, phase: `Merge: Compare arr[${i}]=${arr[i]} vs arr[${j}]=${arr[j]}` };
    if (arr[i] <= arr[j]) {
      temp.push(arr[i++]);
    } else {
      temp.push(arr[j++]);
    }
  }
  while (i <= mid) temp.push(arr[i++]);
  while (j <= right) temp.push(arr[j++]);

  for (let x = 0; x < temp.length; x++) {
    arr[left + x] = temp[x];
    yield { arr: [...arr], comparing: [], swapped: [left + x], comparisons: comparisons.count, phase: `Write merged value ${temp[x]} at index ${left + x}` };
  }
}

function* heapSortGen(arr, comparisons = { count: 0 }) {
  const n = arr.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(arr, n, i, comparisons, "Build Max Heap");
  }

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    yield { arr: [...arr], comparing: [0, i], swapped: [0, i], sorted: Array.from({ length: n - i }, (_, k) => i + k), comparisons: comparisons.count, phase: `Extract max ${arr[0]} → index ${i}` };
    [arr[0], arr[i]] = [arr[i], arr[0]];
    yield* heapify(arr, i, 0, comparisons, "Heapify");
  }
}

function* heapify(arr, n, i, comparisons, label) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  comparisons.count++;
  if (left < n && arr[left] > arr[largest]) largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;

  yield { arr: [...arr], comparing: [i, left < n ? left : i, right < n ? right : i].filter((v, idx, a) => a.indexOf(v) === idx), swapped: [], comparisons: comparisons.count, phase: `${label}: Heapify at index ${i}` };

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    yield { arr: [...arr], comparing: [], swapped: [i, largest], comparisons: comparisons.count, phase: `Swap arr[${i}] ↔ arr[${largest}]` };
    yield* heapify(arr, n, largest, comparisons, label);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Complexity data
// ─────────────────────────────────────────────────────────────────────────────
const COMPLEXITY = {
  QuickSort: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)", stable: "No", method: "Partition", color: "#22d3ee" },
  MergeSort: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)", stable: "Yes", method: "Merge", color: "#a78bfa" },
  HeapSort:  { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)", stable: "No", method: "Selection", color: "#f59e0b" },
};

const ALGORITHMS = ["QuickSort", "MergeSort", "HeapSort"];
const SPEEDS = { Slow: 500, Normal: 180, Fast: 60, Turbo: 16 };

// ─────────────────────────────────────────────────────────────────────────────
// Generate random array
// ─────────────────────────────────────────────────────────────────────────────
const randomArray = (size = 20) =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 85) + 10);

// ─────────────────────────────────────────────────────────────────────────────
// Collect all steps from generator
// ─────────────────────────────────────────────────────────────────────────────
function collectSteps(algorithm, inputArr) {
  const arr = [...inputArr];
  const comparisons = { count: 0 };
  let gen;
  if (algorithm === "QuickSort") gen = quickSortGen(arr, 0, arr.length - 1, comparisons);
  else if (algorithm === "MergeSort") gen = mergeSortGen(arr, 0, arr.length - 1, [...arr], comparisons);
  else gen = heapSortGen(arr, comparisons);

  const steps = [];
  let result = gen.next();
  while (!result.done) {
    steps.push(result.value);
    result = gen.next();
  }
  // Final sorted state
  steps.push({ arr: [...arr], comparing: [], swapped: [], sorted: arr.map((_, i) => i), comparisons: comparisons.count, phase: "✅ Sorting Complete!" });
  return steps;
}

// ─────────────────────────────────────────────────────────────────────────────
// Visualizer Bar Component
// ─────────────────────────────────────────────────────────────────────────────
const SortBar = ({ value, maxVal, isComparing, isSwapped, isSorted, isPivot, barColor, index }) => {
  const heightPct = Math.max(4, Math.round((value / maxVal) * 100));
  let bg = "#1e293b";
  if (isSorted) bg = "#22c55e";
  else if (isPivot) bg = "#f97316";
  else if (isSwapped) bg = "#ec4899";
  else if (isComparing) bg = barColor;

  return (
    <div
      className="relative flex flex-col items-center justify-end group"
      style={{ height: "100%", flex: 1, minWidth: 0 }}
    >
      <div
        style={{
          height: `${heightPct}%`,
          backgroundColor: bg,
          width: "100%",
          borderRadius: "4px 4px 0 0",
          transition: "height 0.1s ease, background-color 0.1s ease",
          boxShadow: (isComparing || isSwapped || isPivot || isSorted)
            ? `0 0 10px ${bg}88`
            : "none",
        }}
        title={`${value}`}
      />
      {/* Value label for small arrays */}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Mini comparison mode (side-by-side 3 algo at once)
// ─────────────────────────────────────────────────────────────────────────────
const MiniVisualizer = ({ algorithm, steps, stepIdx, barColor }) => {
  const step = steps[Math.min(stepIdx, steps.length - 1)] || {};
  const arr = step.arr || [];
  const maxVal = Math.max(...arr, 1);
  const comparing = new Set(step.comparing || []);
  const swapped = new Set(step.swapped || []);
  const sorted = new Set(step.sorted || []);

  return (
    <div
      className="rounded-2xl border p-3"
      style={{ borderColor: `${barColor}40`, background: "#050e17" }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[11px] font-bold" style={{ color: barColor }}>{algorithm}</span>
        <span className="font-mono text-[9px] text-slate-500">
          {steps.length > 0 ? `${Math.min(stepIdx, steps.length - 1) + 1}/${steps.length}` : "—"}
        </span>
      </div>
      <div className="flex items-end gap-[2px]" style={{ height: 56 }}>
        {arr.map((v, i) => {
          let bg = "#1e293b";
          if (sorted.has(i)) bg = "#22c55e";
          else if (swapped.has(i)) bg = "#ec4899";
          else if (comparing.has(i)) bg = barColor;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${Math.max(6, Math.round((v / maxVal) * 100))}%`,
                backgroundColor: bg,
                borderRadius: "2px 2px 0 0",
                transition: "height 0.08s, background-color 0.08s",
              }}
            />
          );
        })}
      </div>
      <p className="font-mono text-[9px] text-slate-500 mt-2 truncate">
        {step.phase || "Ready"}
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Visualizer Component
// ─────────────────────────────────────────────────────────────────────────────
const SortingVisualizer = () => {
  const [algorithm, setAlgorithm] = useState("QuickSort");
  const [arraySize, setArraySize] = useState(24);
  const [speed, setSpeed] = useState("Normal");
  const [inputArray, setInputArray] = useState(() => randomArray(24));
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState("single"); // "single" | "compare"
  const intervalRef = useRef(null);

  // Compare mode: same steps for all 3 algos
  const [compareSteps, setCompareSteps] = useState({ QuickSort: [], MergeSort: [], HeapSort: [] });
  const [compareStepIdx, setCompareStepIdx] = useState(0);
  const [comparePlaying, setComparePlaying] = useState(false);
  const compareIntervalRef = useRef(null);

  // Precompute steps whenever algo or array changes (single mode)
  useEffect(() => {
    const s = collectSteps(algorithm, inputArray);
    setSteps(s);
    setStepIdx(0);
    setPlaying(false);
    clearInterval(intervalRef.current);
  }, [algorithm, inputArray]);

  // Auto-play single mode
  useEffect(() => {
    clearInterval(intervalRef.current);
    if (playing) {
      intervalRef.current = setInterval(() => {
        setStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, SPEEDS[speed]);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, speed, steps.length]);

  // Compare mode setup
  const startCompare = useCallback(() => {
    const cs = {};
    ALGORITHMS.forEach((a) => { cs[a] = collectSteps(a, inputArray); });
    setCompareSteps(cs);
    setCompareStepIdx(0);
    setComparePlaying(false);
    setMode("compare");
  }, [inputArray]);

  // Auto-play compare mode
  useEffect(() => {
    clearInterval(compareIntervalRef.current);
    if (comparePlaying) {
      const maxSteps = Math.max(...ALGORITHMS.map((a) => compareSteps[a]?.length || 0));
      compareIntervalRef.current = setInterval(() => {
        setCompareStepIdx((prev) => {
          if (prev >= maxSteps - 1) {
            setComparePlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, SPEEDS[speed]);
    }
    return () => clearInterval(compareIntervalRef.current);
  }, [comparePlaying, speed, compareSteps]);

  const regenerate = () => {
    const arr = randomArray(arraySize);
    setInputArray(arr);
  };

  const currentStep = steps[stepIdx] || {};
  const arr = currentStep.arr || inputArray;
  const maxVal = Math.max(...arr, 1);
  const comparing = new Set(currentStep.comparing || []);
  const swapped = new Set(currentStep.swapped || []);
  const sorted = new Set(currentStep.sorted || []);
  const pivotIdx = currentStep.pivotIdx ?? -1;
  const barColor = COMPLEXITY[algorithm].color;
  const progress = steps.length > 1 ? Math.round((stepIdx / (steps.length - 1)) * 100) : 0;

  return (
    <div className="rounded-3xl border border-emerald-500/20 bg-[#030d07] shadow-2xl overflow-hidden">
      
      {/* ── Top Header Bar ── */}
      <div className="relative px-6 py-5 border-b border-emerald-500/15"
        style={{ background: "linear-gradient(135deg, #050d08 0%, #030d07 60%, #030b0a 100%)" }}>
        <div className="absolute top-0 right-0 w-64 h-32 rounded-bl-full opacity-20"
          style={{ background: `radial-gradient(circle, ${barColor}33 0%, transparent 70%)` }} />
        
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                <BarChart2 className="text-emerald-400" size={18} />
              </div>
              <div>
                <h2 className="font-display text-lg sm:text-xl font-black uppercase text-white tracking-widest">
                  Sorting Visualizer
                </h2>
                <p className="font-mono text-[10px] text-slate-500">Interactive Step-by-Step Algorithm Execution</p>
              </div>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setMode("single")}
              className={`rounded-xl border px-4 py-2 font-mono text-xs font-bold transition ${mode === "single" ? "border-emerald-400 bg-emerald-500/20 text-emerald-200 shadow-[0_0_16px_rgba(52,211,153,0.2)]" : "border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"}`}
            >
              ◈ Single Mode
            </button>
            <button
              onClick={startCompare}
              className={`rounded-xl border px-4 py-2 font-mono text-xs font-bold transition ${mode === "compare" ? "border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-[0_0_16px_rgba(34,211,238,0.2)]" : "border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"}`}
            >
              ⊞ Compare All 3
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-6">

        {/* ── Algorithm Selector (Large Cards) ── */}
        {mode === "single" && (
          <div>
            <p className="font-mono text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-3">Choose Algorithm</p>
            <div className="grid grid-cols-3 gap-3">
              {ALGORITHMS.map((a) => {
                const isActive = algorithm === a;
                const c = COMPLEXITY[a];
                return (
                  <button
                    key={a}
                    onClick={() => setAlgorithm(a)}
                    className={`relative flex flex-col items-start gap-1.5 rounded-2xl border p-4 text-left transition-all duration-200 ${
                      isActive
                        ? "shadow-lg"
                        : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60"
                    }`}
                    style={isActive ? {
                      borderColor: `${c.color}60`,
                      backgroundColor: `${c.color}12`,
                      boxShadow: `0 0 24px ${c.color}28`,
                    } : {}}
                  >
                    {/* Color dot */}
                    <div className="flex items-center justify-between w-full">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: isActive ? c.color : "#334155" }} />
                      {isActive && (
                        <span className="rounded-md px-1.5 py-0.5 text-[9px] font-bold font-mono" style={{ backgroundColor: `${c.color}30`, color: c.color }}>
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <span className="text-sm sm:text-base font-black text-white">{a}</span>
                    <span className="font-mono text-[10px] text-slate-500">{c.avg} avg</span>
                    <div className="flex gap-1 flex-wrap mt-1">
                      <span className="rounded bg-slate-800/80 border border-slate-700/50 px-1.5 py-0.5 font-mono text-[9px] text-slate-400">
                        Space: {c.space}
                      </span>
                      <span className="rounded bg-slate-800/80 border border-slate-700/50 px-1.5 py-0.5 font-mono text-[9px] text-slate-400">
                        {c.stable === "Yes" ? "Stable" : "Unstable"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Controls Row ── */}
        <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl border border-slate-800/80 bg-slate-950/50">
          {/* Array size */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase text-slate-500 font-bold whitespace-nowrap">Array Size</span>
            <input
              type="range" min={8} max={50} value={arraySize}
              onChange={(e) => { setArraySize(+e.target.value); setInputArray(randomArray(+e.target.value)); }}
              className="w-24 accent-emerald-400"
            />
            <span className="font-mono text-xs font-bold text-white w-6 text-center">{arraySize}</span>
          </div>

          <div className="w-px h-5 bg-slate-800 hidden sm:block" />

          {/* Speed */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase text-slate-500 font-bold">Speed</span>
            <div className="flex rounded-xl border border-slate-800 overflow-hidden">
              {Object.keys(SPEEDS).map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-3 py-1.5 font-mono text-xs font-bold transition ${speed === s ? "bg-emerald-500 text-black" : "bg-slate-900/60 text-slate-400 hover:text-white"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Shuffle */}
          <button
            onClick={regenerate}
            className="ml-auto flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 font-mono text-xs font-bold text-slate-300 hover:border-emerald-500/60 hover:text-emerald-300 transition"
          >
            <RotateCcw size={14} /> Shuffle Array
          </button>
        </div>

        {/* ── SINGLE MODE VISUALIZER ── */}
        {mode === "single" && (
          <>
            {/* Phase + Stats Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800/60 bg-slate-950/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: barColor }} />
                <p className="font-mono text-xs text-slate-300 font-medium">
                  {currentStep.phase || "Press Play to start visualizing"}
                </p>
              </div>
              <div className="flex items-center gap-4 font-mono text-[11px] text-slate-500">
                <span>Step <span className="text-white font-bold">{stepIdx + 1}</span> / {steps.length}</span>
                <span>•</span>
                <span><span className="text-white font-bold">{currentStep.comparisons ?? 0}</span> comparisons</span>
                <span>•</span>
                <span><span className="font-bold" style={{ color: barColor }}>{progress}%</span> complete</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 w-full rounded-full bg-slate-900 overflow-hidden -mt-4">
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{ width: `${progress}%`, backgroundColor: barColor }}
              />
            </div>

            {/* Bar Chart — Taller */}
            <div
              className="relative flex items-end gap-[3px] sm:gap-1 overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-b from-[#020b05] to-[#010804] px-3 pt-4 pb-0"
              style={{ height: 280 }}
            >
              {/* Grid lines */}
              {[25, 50, 75].map((pct) => (
                <div key={pct} className="absolute left-0 right-0 border-t border-slate-800/30"
                  style={{ bottom: `${pct}%` }} />
              ))}

              {arr.map((val, i) => (
                <SortBar
                  key={i}
                  index={i}
                  value={val}
                  maxVal={maxVal}
                  isComparing={comparing.has(i)}
                  isSwapped={swapped.has(i)}
                  isSorted={sorted.has(i)}
                  isPivot={i === pivotIdx && !sorted.has(i)}
                  barColor={barColor}
                />
              ))}
            </div>

            {/* Legend + Playback Row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Legend */}
              <div className="flex flex-wrap gap-3">
                {[
                  { color: barColor, label: "Comparing" },
                  { color: "#ec4899", label: "Swapping" },
                  { color: "#f97316", label: "Pivot" },
                  { color: "#22c55e", label: "Sorted" },
                  { color: "#1e3a2a", label: "Unsorted", border: true },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded" style={{ backgroundColor: l.color, border: l.border ? "1px solid #334155" : "none" }} />
                    <span className="font-mono text-[10px] text-slate-400">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Playback Controls ── */}
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <button
                onClick={() => { setStepIdx(0); setPlaying(false); }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 font-mono text-xs font-bold text-slate-300 hover:border-slate-600 hover:text-white transition"
                title="Reset"
              >
                <RotateCcw size={14} /> Reset
              </button>
              <button
                onClick={() => setStepIdx((p) => Math.max(0, p - 1))}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 font-mono text-xs font-bold text-slate-300 hover:text-white transition"
              >
                ◀ Prev
              </button>

              {/* Main play button */}
              <button
                onClick={() => setPlaying((p) => !p)}
                className="flex items-center gap-2 rounded-2xl px-8 py-3 font-mono text-sm font-black text-black transition-all shadow-lg hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: barColor,
                  boxShadow: `0 4px 24px ${barColor}55`,
                }}
              >
                {playing ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Play</>}
              </button>

              <button
                onClick={() => setStepIdx((p) => Math.min(steps.length - 1, p + 1))}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 font-mono text-xs font-bold text-slate-300 hover:text-white transition"
              >
                Next ▶
              </button>
              <button
                onClick={() => { setStepIdx(steps.length - 1); setPlaying(false); }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 font-mono text-xs font-bold text-slate-300 hover:border-slate-600 hover:text-white transition"
                title="Jump to End"
              >
                <SkipForward size={14} /> End
              </button>
            </div>

            {/* ── Complexity Analysis Panel ── */}
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: `${barColor}35` }}>
              <div className="px-5 py-3.5 flex items-center justify-between" style={{ background: `${barColor}12` }}>
                <div className="flex items-center gap-2">
                  <Layers size={15} style={{ color: barColor }} />
                  <span className="font-mono text-xs font-black uppercase tracking-wider" style={{ color: barColor }}>
                    {algorithm} — Complexity Profile
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-slate-300">
                    Method: {COMPLEXITY[algorithm].method}
                  </span>
                  <span className={`rounded border px-2 py-0.5 font-bold ${COMPLEXITY[algorithm].stable === "Yes" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-slate-700 bg-slate-800/60 text-slate-400"}`}>
                    {COMPLEXITY[algorithm].stable === "Yes" ? "✓ Stable" : "✗ Unstable"}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto bg-slate-950/60">
                <table className="w-full font-mono text-sm text-slate-300">
                  <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-3 text-left">Case</th>
                      <th className="px-5 py-3 text-left">Time Complexity</th>
                      <th className="px-5 py-3 text-left">Space Complexity</th>
                      <th className="px-5 py-3 text-left">Stable Sort</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {[
                      { label: "Best Case", time: COMPLEXITY[algorithm].best, icon: "🟢" },
                      { label: "Average Case", time: COMPLEXITY[algorithm].avg, icon: "🟡" },
                      { label: "Worst Case", time: COMPLEXITY[algorithm].worst, icon: "🔴" },
                    ].map((row) => (
                      <tr key={row.label} className="hover:bg-slate-900/30 transition">
                        <td className="px-5 py-3.5 font-bold text-white text-xs">
                          <span className="mr-2">{row.icon}</span>{row.label}
                        </td>
                        <td className="px-5 py-3.5 font-black text-sm" style={{ color: barColor }}>
                          {row.time}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-300">{COMPLEXITY[algorithm].space}</td>
                        <td className="px-5 py-3.5 text-xs text-slate-300">{COMPLEXITY[algorithm].stable}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ─── COMPARE MODE VISUALIZER (All 3 Side by Side) ─── */}
        {mode === "compare" && (
          <>
            {/* Progress bar */}
            <div className="flex items-center justify-between mb-1">
              <p className="font-mono text-xs text-cyan-400 font-bold">⊞ Running all 3 algorithms on the same input array</p>
              <span className="font-mono text-[11px] text-slate-500">
                Step <span className="text-white font-bold">{compareStepIdx + 1}</span>
              </span>
            </div>
            <div className="h-1 w-full rounded-full bg-slate-900 overflow-hidden">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all duration-100"
                style={{
                  width: `${Math.round((compareStepIdx / Math.max(1, Math.max(...ALGORITHMS.map((a) => (compareSteps[a]?.length || 1) - 1)))) * 100)}%`
                }}
              />
            </div>

            {/* Three mini visualizers — taller and richer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {ALGORITHMS.map((a) => (
                <MiniVisualizer
                  key={a}
                  algorithm={a}
                  steps={compareSteps[a] || []}
                  stepIdx={compareStepIdx}
                  barColor={COMPLEXITY[a].color}
                />
              ))}
            </div>

            {/* Compare playback controls */}
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <button
                onClick={() => setCompareStepIdx(0)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 font-mono text-xs font-bold text-slate-300 hover:text-white transition"
              >
                <RotateCcw size={14} /> Reset
              </button>
              <button
                onClick={() => setCompareStepIdx((p) => Math.max(0, p - 1))}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 font-mono text-xs font-bold text-slate-300 hover:text-white transition"
              >
                ◀ Prev
              </button>
              <button
                onClick={() => setComparePlaying((p) => !p)}
                className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-8 py-3 font-mono text-sm font-black text-black transition-all hover:scale-105 active:scale-95 shadow-lg"
                style={{ boxShadow: "0 4px 24px rgba(34,211,238,0.35)" }}
              >
                {comparePlaying ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Play</>}
              </button>
              <button
                onClick={() => {
                  const max = Math.max(...ALGORITHMS.map((a) => (compareSteps[a]?.length || 1) - 1));
                  setCompareStepIdx((p) => Math.min(max, p + 1));
                }}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 font-mono text-xs font-bold text-slate-300 hover:text-white transition"
              >
                Next ▶
              </button>
              <button
                onClick={() => {
                  const max = Math.max(...ALGORITHMS.map((a) => (compareSteps[a]?.length || 1) - 1));
                  setCompareStepIdx(max);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 font-mono text-xs font-bold text-slate-300 hover:text-white transition"
              >
                <SkipForward size={14} /> End
              </button>
            </div>

            {/* Head-to-Head comparison table */}
            <div className="rounded-2xl border border-cyan-500/20 overflow-hidden">
              <div className="px-5 py-3.5 bg-cyan-500/10 border-b border-cyan-500/20 flex items-center gap-2">
                <Zap size={14} className="text-cyan-400" />
                <span className="font-mono text-xs font-black uppercase tracking-wider text-cyan-400">
                  Head-to-Head Complexity & Steps Comparison
                </span>
              </div>
              <div className="overflow-x-auto bg-slate-950/60">
                <table className="w-full font-mono text-sm text-slate-300">
                  <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-3 text-left">Algorithm</th>
                      <th className="px-5 py-3 text-left">Best</th>
                      <th className="px-5 py-3 text-left">Average</th>
                      <th className="px-5 py-3 text-left">Worst</th>
                      <th className="px-5 py-3 text-left">Space</th>
                      <th className="px-5 py-3 text-left">Stable</th>
                      <th className="px-5 py-3 text-left">Total Steps</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {ALGORITHMS.map((a) => (
                      <tr key={a} className="hover:bg-slate-900/30 transition">
                        <td className="px-5 py-3.5 font-black text-base" style={{ color: COMPLEXITY[a].color }}>{a}</td>
                        <td className="px-5 py-3.5 text-xs">{COMPLEXITY[a].best}</td>
                        <td className="px-5 py-3.5 text-xs font-bold text-white">{COMPLEXITY[a].avg}</td>
                        <td className="px-5 py-3.5 text-xs">{COMPLEXITY[a].worst}</td>
                        <td className="px-5 py-3.5 text-xs">{COMPLEXITY[a].space}</td>
                        <td className="px-5 py-3.5 text-xs">
                          <span className={`rounded px-1.5 py-0.5 font-bold text-[10px] ${
                            COMPLEXITY[a].stable === "Yes"
                              ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                              : "bg-slate-800 border border-slate-700 text-slate-400"
                          }`}>
                            {COMPLEXITY[a].stable === "Yes" ? "✓ Yes" : "✗ No"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-black text-white">{compareSteps[a]?.length ?? "—"}</span>
                          <span className="text-slate-500 text-[10px] ml-1">steps</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Upcoming labs (other planned modules)
// ─────────────────────────────────────────────────────────────────────────────
const UPCOMING_LABS = [
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

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
const DsaLabPage = () => {
  return (
    <>
      <SeoHead
        title="Data Structure & Algorithm Lab | Nikhil Agrahari"
        description="Interactive Data Structure and Algorithm visualizers, sorting algorithm step-by-step visualizer with QuickSort, MergeSort, HeapSort, complexity analytics by Nikhil Agrahari."
        pathname="/experiments/dsa"
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Experiments", path: "/experiments" },
          { name: "Data Structure Lab", path: "/experiments/dsa" },
        ])}
      />

      <section className="section-wrap pt-4 sm:pt-6 pb-20">

        {/* Hero */}
        <FadeInUp>
          <div className="text-center max-w-4xl mx-auto mb-10">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-wider text-slate-900 dark:text-white drop-shadow-sm">
              DATA STRUCTURE &{" "}
              <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                ALGORITHM LAB
              </span>
            </h1>
            <p className="mt-3 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Interactive step-by-step algorithm visualizers for sorting, graph traversal, and dynamic programming with full complexity analysis.
            </p>
          </div>
        </FadeInUp>

        {/* LIVE: Sorting & Space Complexity Visualizer */}
        <FadeInUp delay={0.1}>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                // LIVE LAB MODULE — ACTIVE
              </span>
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                🟢 Live
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Sorting & Space Complexity Visualizer
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
              QuickSort · MergeSort · HeapSort — step-by-step with memory pointer highlights and complexity analysis.
            </p>
          </div>

          <SortingVisualizer />
        </FadeInUp>

        {/* Planned Labs */}
        <div className="mt-16 mb-6">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            // UPCOMING LAB MODULES
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Next on the Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Step-by-step graph traversal and dynamic programming visualizers in development.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
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
