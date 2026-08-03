import { useState, useEffect, useRef } from "react";
import {
  BarChart2,
  Network,
  GitCommit,
  Grid,
  Sliders,
  Crown,
  Database,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Plus,
  Trash2,
  Search,
  ArrowLeftRight,
} from "lucide-react";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import { createBreadcrumbSchema } from "@/utils/seo";

// Sorting algorithm visualizer

function* quickSortGen(arr, low = 0, high = arr.length - 1, comparisons = { count: 0 }) {
  if (low >= high) return;
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

  let i = left, j = mid + 1;
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
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(arr, n, i, comparisons, "Build Max Heap");
  }
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

const SORT_COMPLEXITY = {
  QuickSort: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)", stable: "No", method: "Partition", color: "#22d3ee" },
  MergeSort: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)", stable: "Yes", method: "Merge", color: "#a78bfa" },
  HeapSort:  { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)", stable: "No", method: "Selection", color: "#f59e0b" },
};

const SORT_ALGORITHMS = ["QuickSort", "MergeSort", "HeapSort"];
const SPEEDS = { Slow: 500, Normal: 180, Fast: 60, Turbo: 16 };

const randomArray = (size = 20) =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 85) + 10);

function collectSortSteps(algorithm, inputArr) {
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
  steps.push({ arr: [...arr], comparing: [], swapped: [], sorted: arr.map((_, i) => i), comparisons: comparisons.count, phase: "✅ Sorting Complete!" });
  return steps;
}

const SortBar = ({ value, maxVal, isComparing, isSwapped, isSorted, isPivot, barColor }) => {
  const heightPct = Math.max(4, Math.round((value / maxVal) * 100));
  let bg = "#1e293b";
  if (isSorted) bg = "#22c55e";
  else if (isPivot) bg = "#f97316";
  else if (isSwapped) bg = "#ec4899";
  else if (isComparing) bg = barColor;

  return (
    <div className="relative flex flex-col items-center justify-end group" style={{ height: "100%", flex: 1, minWidth: 0 }}>
      <div
        style={{
          height: `${heightPct}%`,
          backgroundColor: bg,
          width: "100%",
          borderRadius: "3px 3px 0 0",
          transition: "height 0.1s ease, background-color 0.1s ease",
          boxShadow: (isComparing || isSwapped || isPivot || isSorted) ? `0 0 10px ${bg}88` : "none",
        }}
        title={`${value}`}
      />
    </div>
  );
};

const SortingVisualizer = () => {
  const [algorithm, setAlgorithm] = useState("QuickSort");
  const [arraySize, setArraySize] = useState(() => (typeof window !== "undefined" && window.innerWidth < 640 ? 16 : 24));
  const [speed, setSpeed] = useState("Normal");
  const [inputArray, setInputArray] = useState(() => randomArray(typeof window !== "undefined" && window.innerWidth < 640 ? 16 : 24));
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const s = collectSortSteps(algorithm, inputArray);
    setSteps(s);
    setStepIdx(0);
    setPlaying(false);
    clearInterval(intervalRef.current);
  }, [algorithm, inputArray]);

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

  const regenerate = () => setInputArray(randomArray(arraySize));

  const currentStep = steps[stepIdx] || {};
  const arr = currentStep.arr || inputArray;
  const maxVal = Math.max(...arr, 1);
  const comparing = new Set(currentStep.comparing || []);
  const swapped = new Set(currentStep.swapped || []);
  const sorted = new Set(currentStep.sorted || []);
  const pivotIdx = currentStep.pivotIdx ?? -1;
  const barColor = SORT_COMPLEXITY[algorithm].color;
  const progress = steps.length > 1 ? Math.round((stepIdx / (steps.length - 1)) * 100) : 0;

  return (
    <div className="rounded-3xl border border-emerald-500/20 bg-[#030d07] shadow-2xl overflow-hidden">
      <div className="relative p-4 sm:px-6 sm:py-5 border-b border-emerald-500/15" style={{ background: "linear-gradient(135deg, #050d08 0%, #030d07 60%, #030b0a 100%)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 shrink-0">
              <BarChart2 className="text-emerald-400" size={18} />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-xl font-black uppercase text-white tracking-wider">
                Sorting &amp; Space Visualizer
              </h2>
              <p className="font-mono text-[10px] text-slate-500">Interactive Memory Pointer &amp; Swapping Engine</p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-bold text-emerald-300 self-start sm:self-auto">
            {algorithm} · {arraySize} Elements
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-7 space-y-5 sm:space-y-6">
        <div>
          <p className="font-mono text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2.5">Choose Algorithm</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {SORT_ALGORITHMS.map((a) => {
              const isActive = algorithm === a;
              const c = SORT_COMPLEXITY[a];
              return (
                <button
                  key={a}
                  onClick={() => setAlgorithm(a)}
                  className={`relative flex flex-col items-start gap-1.5 rounded-2xl border p-3.5 sm:p-4 text-left transition-all duration-200 ${
                    isActive ? "shadow-lg" : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60"
                  }`}
                  style={isActive ? { borderColor: `${c.color}60`, backgroundColor: `${c.color}12`, boxShadow: `0 0 24px ${c.color}28` } : {}}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: isActive ? c.color : "#334155" }} />
                    {isActive && <span className="rounded-md px-1.5 py-0.5 text-[9px] font-bold font-mono" style={{ backgroundColor: `${c.color}30`, color: c.color }}>ACTIVE</span>}
                  </div>
                  <span className="text-sm sm:text-base font-black text-white">{a}</span>
                  <span className="font-mono text-[10px] text-slate-500">{c.avg} avg</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <span className="font-mono text-[11px] uppercase text-slate-500 font-bold whitespace-nowrap">Array Size</span>
            <div className="flex items-center gap-2 flex-1 sm:flex-none">
              <input
                type="range" min={8} max={40} value={arraySize}
                onChange={(e) => { setArraySize(+e.target.value); setInputArray(randomArray(+e.target.value)); }}
                className="w-full sm:w-28 accent-emerald-400 cursor-pointer"
              />
              <span className="font-mono text-xs font-bold text-white w-6 text-center">{arraySize}</span>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-3">
            <span className="font-mono text-[11px] uppercase text-slate-500 font-bold whitespace-nowrap">Speed</span>
            <div className="grid grid-cols-4 rounded-xl border border-slate-800 overflow-hidden w-full sm:w-auto text-center">
              {Object.keys(SPEEDS).map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2.5 sm:px-3 py-1.5 font-mono text-[11px] sm:text-xs font-bold transition ${speed === s ? "bg-emerald-500 text-black" : "bg-slate-900/60 text-slate-400 hover:text-white"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={regenerate}
            className="w-full md:w-auto ml-0 md:ml-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 font-mono text-xs font-bold text-slate-300 hover:border-emerald-500/60 hover:text-emerald-300 transition"
          >
            <RotateCcw size={14} /> Shuffle Array
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-slate-800/60 bg-slate-950/40 p-3 sm:px-4 sm:py-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="h-2 w-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: barColor }} />
            <p className="font-mono text-xs text-slate-200 font-bold truncate">
              {currentStep.phase || "Press Play to start visualizing"}
            </p>
          </div>

          <div className="grid grid-cols-3 sm:flex items-center justify-between sm:justify-end gap-1 sm:gap-4 font-mono text-[10px] sm:text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 sm:pt-0 sm:border-t-0 text-center sm:text-left">
            <span>Step <span className="text-white font-bold">{stepIdx + 1}</span>/{steps.length}</span>
            <span><span className="text-white font-bold">{currentStep.comparisons ?? 0}</span> comps</span>
            <span><span className="font-bold" style={{ color: barColor }}>{progress}%</span> done</span>
          </div>
        </div>

        <div className="h-1 w-full rounded-full bg-slate-900 overflow-hidden -mt-3 sm:-mt-4">
          <div className="h-full rounded-full transition-all duration-100" style={{ width: `${progress}%`, backgroundColor: barColor }} />
        </div>

        <div className="relative flex items-end gap-[2px] sm:gap-1 overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-b from-[#020b05] to-[#010804] px-2 sm:px-3 pt-3 pb-0 h-[220px] sm:h-[280px]">
          {arr.map((val, i) => (
            <SortBar key={i} value={val} maxVal={maxVal} isComparing={comparing.has(i)} isSwapped={swapped.has(i)} isSorted={sorted.has(i)} isPivot={i === pivotIdx && !sorted.has(i)} barColor={barColor} />
          ))}
        </div>

        <div className="flex items-center justify-center gap-1.5 sm:gap-3 w-full px-1">
          <button onClick={() => { setStepIdx(0); setPlaying(false); }} className="flex-1 sm:flex-initial flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-3 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            <RotateCcw size={13} /> Reset
          </button>
          <button onClick={() => setStepIdx((p) => Math.max(0, p - 1))} className="flex-1 sm:flex-initial flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-4 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            ◀ Prev
          </button>
          <button onClick={() => setPlaying((p) => !p)} className="flex-[1.8] sm:flex-initial flex items-center justify-center gap-1.5 rounded-2xl px-4 sm:px-8 py-2 sm:py-3 font-mono text-xs sm:text-sm font-black text-black transition-all shadow-lg hover:scale-105 active:scale-95 shrink-0" style={{ backgroundColor: barColor, boxShadow: `0 4px 24px ${barColor}55` }}>
            {playing ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Play</>}
          </button>
          <button onClick={() => setStepIdx((p) => Math.min(steps.length - 1, p + 1))} className="flex-1 sm:flex-initial flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-4 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            Next ▶
          </button>
          <button onClick={() => { setStepIdx(steps.length - 1); setPlaying(false); }} className="flex-1 sm:flex-initial flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-3 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            <SkipForward size={13} /> End
          </button>
        </div>
      </div>
    </div>
  );
};

// Graph traversal and shortest path

const DEFAULT_GRAPH_NODES = [
  { id: "A", x: 65, y: 120 },
  { id: "B", x: 195, y: 45 },
  { id: "C", x: 195, y: 195 },
  { id: "D", x: 335, y: 45 },
  { id: "E", x: 335, y: 195 },
  { id: "F", x: 465, y: 120 },
];

const DEFAULT_GRAPH_EDGES = [
  { u: "A", v: "B", weight: 4 },
  { u: "A", v: "C", weight: 2 },
  { u: "B", v: "C", weight: 1 },
  { u: "B", v: "D", weight: 5 },
  { u: "C", v: "E", weight: 8 },
  { u: "C", v: "D", weight: 10 },
  { u: "D", v: "E", weight: 2 },
  { u: "D", v: "F", weight: 6 },
  { u: "E", v: "F", weight: 3 },
];

function buildAdjacencyList(nodes, edges) {
  const adj = {};
  nodes.forEach((n) => { adj[n.id] = []; });
  edges.forEach((e) => {
    adj[e.u].push({ neighbor: e.v, weight: e.weight });
    adj[e.v].push({ neighbor: e.u, weight: e.weight });
  });
  return adj;
}

function* bfsGraphGen(nodes, edges, startNode = "A", targetNode = "F") {
  const adj = buildAdjacencyList(nodes, edges);
  const visited = new Set();
  const queue = [startNode];
  const parent = {};

  visited.add(startNode);
  yield { current: startNode, ds: [...queue], visited: Array.from(visited), activeEdges: [], path: [], phase: `Started BFS at Node ${startNode}. Enqueued initial node.` };

  while (queue.length > 0) {
    const curr = queue.shift();

    if (curr === targetNode) {
      const path = [];
      let temp = targetNode;
      while (temp) { path.unshift(temp); temp = parent[temp]; }
      yield { current: curr, ds: [...queue], visited: Array.from(visited), activeEdges: [], path, phase: `🎯 Target Node ${targetNode} Reached! Path: ${path.join(" → ")}` };
      return;
    }

    const neighbors = adj[curr] || [];
    for (const { neighbor } of neighbors) {
      const edgeKey = [curr, neighbor].sort().join("-");
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent[neighbor] = curr;
        queue.push(neighbor);
        yield { current: curr, ds: [...queue], visited: Array.from(visited), activeEdges: [edgeKey], path: [], phase: `Visited ${neighbor} from ${curr}. Enqueued ${neighbor}.` };
      }
    }
  }

  yield { current: null, ds: [], visited: Array.from(visited), activeEdges: [], path: [], phase: `BFS Traversal Completed.` };
}

function* dfsGraphGen(nodes, edges, startNode = "A", targetNode = "F") {
  const adj = buildAdjacencyList(nodes, edges);
  const visited = new Set();
  const stack = [startNode];
  const parent = {};

  while (stack.length > 0) {
    const curr = stack.pop();

    if (!visited.has(curr)) {
      visited.add(curr);

      if (curr === targetNode) {
        const path = [];
        let temp = targetNode;
        while (temp) { path.unshift(temp); temp = parent[temp]; }
        yield { current: curr, ds: [...stack], visited: Array.from(visited), activeEdges: [], path, phase: `🎯 Target Node ${targetNode} Reached! Path: ${path.join(" → ")}` };
        return;
      }

      yield { current: curr, ds: [...stack], visited: Array.from(visited), activeEdges: [], path, phase: `Popped Node ${curr} from stack.` };

      const neighbors = adj[curr] || [];
      for (const { neighbor } of neighbors) {
        if (!visited.has(neighbor)) {
          parent[neighbor] = curr;
          stack.push(neighbor);
          const edgeKey = [curr, neighbor].sort().join("-");
          yield { current: curr, ds: [...stack], visited: Array.from(visited), activeEdges: [edgeKey], path: [], phase: `Pushed neighbor ${neighbor} to stack.` };
        }
      }
    }
  }

  yield { current: null, ds: [], visited: Array.from(visited), activeEdges: [], path: [], phase: `DFS Traversal Completed.` };
}

function* dijkstraGen(nodes, edges, startNode = "A", targetNode = "F") {
  const adj = buildAdjacencyList(nodes, edges);
  const dist = {};
  const prev = {};
  const unvisited = new Set();

  nodes.forEach((n) => { dist[n.id] = Infinity; prev[n.id] = null; unvisited.add(n.id); });
  dist[startNode] = 0;

  yield { current: startNode, dist: { ...dist }, visited: [], activeEdges: [], path: [], phase: `Initialized Dijkstra: dist[${startNode}] = 0, all others = ∞.` };

  const visitedList = [];

  while (unvisited.size > 0) {
    let curr = null;
    let minD = Infinity;

    unvisited.forEach((n) => {
      if (dist[n] < minD) { minD = dist[n]; curr = n; }
    });

    if (curr === null || dist[curr] === Infinity) break;

    unvisited.delete(curr);
    visitedList.push(curr);

    yield { current: curr, dist: { ...dist }, visited: [...visitedList], activeEdges: [], path: [], phase: `Selected Node ${curr} with min distance = ${dist[curr]}. Updating neighbors...` };

    if (curr === targetNode) {
      const path = [];
      let temp = targetNode;
      while (temp) { path.unshift(temp); temp = prev[temp]; }
      yield { current: curr, dist: { ...dist }, visited: [...visitedList], activeEdges: [], path, phase: `🏁 Shortest Path Found to ${targetNode}! Total Distance = ${dist[targetNode]} (${path.join(" → ")})` };
      return;
    }

    const neighbors = adj[curr] || [];
    for (const { neighbor, weight } of neighbors) {
      if (unvisited.has(neighbor)) {
        const alt = dist[curr] + weight;
        const edgeKey = [curr, neighbor].sort().join("-");

        if (alt < dist[neighbor]) {
          dist[neighbor] = alt;
          prev[neighbor] = curr;
          yield { current: curr, dist: { ...dist }, visited: [...visitedList], activeEdges: [edgeKey], path: [], phase: `Updated dist[${neighbor}] = ${alt} (via ${curr}, weight ${weight}).` };
        } else {
          yield { current: curr, dist: { ...dist }, visited: [...visitedList], activeEdges: [edgeKey], phase: `Checked neighbor ${neighbor}: dist[${neighbor}] (${dist[neighbor]}) ≤ new dist (${alt}). No update.` };
        }
      }
    }
  }

  const path = [];
  let temp = targetNode;
  while (temp && prev[temp] !== undefined) { path.unshift(temp); temp = prev[temp]; }
  yield { current: null, dist: { ...dist }, visited: [...visitedList], activeEdges: [], path, phase: `Finished Dijkstra calculation.` };
}

const GRAPH_ALGORITHMS = {
  Dijkstra: { label: "Dijkstra's Shortest Path", time: "O((V + E) log V)", space: "O(V)", color: "#38bdf8", desc: "Finds shortest weighted path using priority queue" },
  BFS: { label: "Breadth-First Search (BFS)", time: "O(V + E)", space: "O(V)", color: "#a78bfa", desc: "Traverses graph layer-by-layer using FIFO queue" },
  DFS: { label: "Depth-First Search (DFS)", time: "O(V + E)", space: "O(V)", color: "#f59e0b", desc: "Explores deep paths first using LIFO stack" },
};

function collectGraphSteps(algo, nodes, edges, startNode, targetNode) {
  let gen;
  if (algo === "Dijkstra") gen = dijkstraGen(nodes, edges, startNode, targetNode);
  else if (algo === "BFS") gen = bfsGraphGen(nodes, edges, startNode, targetNode);
  else gen = dfsGraphGen(nodes, edges, startNode, targetNode);

  const steps = [];
  let result = gen.next();
  while (!result.done) {
    steps.push(result.value);
    result = gen.next();
  }
  return steps;
}

const GraphVisualizer = () => {
  const [algo, setAlgo] = useState("Dijkstra");
  const [nodes] = useState(DEFAULT_GRAPH_NODES);
  const [edges, setEdges] = useState(DEFAULT_GRAPH_EDGES);
  const [startNode, setStartNode] = useState("A");
  const [targetNode, setTargetNode] = useState("F");
  const [speed, setSpeed] = useState("Normal");
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const s = collectGraphSteps(algo, nodes, edges, startNode, targetNode);
    setSteps(s);
    setStepIdx(0);
    setPlaying(false);
    clearInterval(intervalRef.current);
  }, [algo, nodes, edges, startNode, targetNode]);

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
      }, SPEEDS[speed] * 2);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, speed, steps.length]);

  const randomizeWeights = () => {
    setEdges((prevEdges) =>
      prevEdges.map((e) => ({
        ...e,
        weight: Math.floor(Math.random() * 9) + 1,
      }))
    );
  };

  const currStep = steps[stepIdx] || {};
  const activeNode = currStep.current;
  const visitedSet = new Set(currStep.visited || []);
  const activeEdgesSet = new Set(currStep.activeEdges || []);
  const pathNodes = currStep.path || [];
  const pathSet = new Set(pathNodes);

  const pathEdgesSet = new Set();
  for (let i = 0; i < pathNodes.length - 1; i++) {
    const key = [pathNodes[i], pathNodes[i + 1]].sort().join("-");
    pathEdgesSet.add(key);
  }

  const themeColor = GRAPH_ALGORITHMS[algo].color;
  const progress = steps.length > 1 ? Math.round((stepIdx / (steps.length - 1)) * 100) : 0;

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#030d07] shadow-2xl overflow-hidden">
      <div className="relative p-4 sm:px-6 sm:py-5 border-b border-cyan-500/15" style={{ background: "linear-gradient(135deg, #050e18 0%, #030d07 60%, #020912 100%)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 shrink-0">
              <Network className="text-cyan-400" size={18} />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-xl font-black uppercase text-white tracking-wider">
                Graph Traversal &amp; Shortest Path
              </h2>
              <p className="font-mono text-[10px] text-slate-400">Dijkstra, BFS &amp; DFS Node State Visualizer</p>
            </div>
          </div>
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono font-bold text-cyan-300 self-start sm:self-auto">
            {algo} · Start: {startNode} → Target: {targetNode}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-7 space-y-5 sm:space-y-6">
        <div>
          <p className="font-mono text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2.5">Choose Graph Algorithm</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {Object.keys(GRAPH_ALGORITHMS).map((key) => {
              const item = GRAPH_ALGORITHMS[key];
              const isActive = algo === key;
              return (
                <button
                  key={key}
                  onClick={() => setAlgo(key)}
                  className={`flex flex-col items-start gap-1 rounded-2xl border p-3.5 text-left transition-all ${
                    isActive ? "shadow-lg" : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
                  }`}
                  style={isActive ? { borderColor: `${item.color}60`, backgroundColor: `${item.color}12`, boxShadow: `0 0 24px ${item.color}28` } : {}}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-black text-white">{key}</span>
                    {isActive && <span className="rounded px-1.5 py-0.5 text-[9px] font-bold font-mono" style={{ backgroundColor: `${item.color}30`, color: item.color }}>ACTIVE</span>}
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border border-slate-800/80 bg-slate-950/50">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 font-mono text-xs font-bold text-slate-300">
              Start Node:
              <select value={startNode} onChange={(e) => setStartNode(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-cyan-400 font-black outline-none">
                {nodes.map((n) => <option key={n.id} value={n.id}>{n.id}</option>)}
              </select>
            </label>

            <label className="flex items-center gap-2 font-mono text-xs font-bold text-slate-300">
              Target Node:
              <select value={targetNode} onChange={(e) => setTargetNode(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-lime-400 font-black outline-none">
                {nodes.map((n) => <option key={n.id} value={n.id}>{n.id}</option>)}
              </select>
            </label>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-3">
            <span className="font-mono text-[11px] uppercase text-slate-500 font-bold whitespace-nowrap">Speed</span>
            <div className="grid grid-cols-3 rounded-xl border border-slate-800 overflow-hidden w-full sm:w-auto text-center">
              {["Slow", "Normal", "Fast"].map((s) => (
                <button key={s} onClick={() => setSpeed(s)} className={`px-3 py-1.5 font-mono text-[11px] font-bold transition ${speed === s ? "bg-cyan-500 text-black" : "bg-slate-900/60 text-slate-400 hover:text-white"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button onClick={randomizeWeights} className="w-full md:w-auto ml-0 md:ml-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 font-mono text-xs font-bold text-slate-300 hover:border-cyan-500/60 hover:text-cyan-300 transition">
            <RotateCcw size={14} /> Randomize Weights
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-slate-800/60 bg-slate-950/40 p-3 sm:px-4 sm:py-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="h-2 w-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: themeColor }} />
            <p className="font-mono text-xs text-slate-200 font-bold truncate">
              {currStep.phase || "Press Play to start graph traversal"}
            </p>
          </div>
          <span className="font-mono text-[11px] text-slate-400 shrink-0">
            Step <span className="text-white font-bold">{stepIdx + 1}</span>/{steps.length} · <span className="font-bold" style={{ color: themeColor }}>{progress}%</span>
          </span>
        </div>

        <div className="relative w-full overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-b from-[#020912] to-[#01060c] p-4 sm:p-6 flex items-center justify-center min-h-[260px] sm:min-h-[310px]">
          <svg viewBox="0 0 540 250" className="w-full max-w-2xl h-auto overflow-visible">
            {edges.map((edge) => {
              const uNode = nodes.find((n) => n.id === edge.u);
              const vNode = nodes.find((n) => n.id === edge.v);
              if (!uNode || !vNode) return null;

              const edgeKey = [edge.u, edge.v].sort().join("-");
              const isPath = pathEdgesSet.has(edgeKey);
              const isActive = activeEdgesSet.has(edgeKey);

              let strokeColor = "#1e293b";
              let strokeWidth = 2;
              if (isPath) { strokeColor = "#f59e0b"; strokeWidth = 4; }
              else if (isActive) { strokeColor = themeColor; strokeWidth = 3; }

              const midX = (uNode.x + vNode.x) / 2;
              const midY = (uNode.y + vNode.y) / 2;

              return (
                <g key={edgeKey}>
                  <line x1={uNode.x} y1={uNode.y} x2={vNode.x} y2={vNode.y} stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={isActive && !isPath ? "4 4" : "none"} className="transition-all duration-300" />
                  <g transform={`translate(${midX}, ${midY})`}>
                    <circle r="11" fill="#091322" stroke={isPath ? "#f59e0b" : "#334155"} strokeWidth="1.5" />
                    <text textAnchor="middle" dy="3.5" fontSize="10" fontWeight="bold" fill={isPath ? "#f59e0b" : "#94a3b8"} fontFamily="monospace">
                      {edge.weight}
                    </text>
                  </g>
                </g>
              );
            })}

            {nodes.map((node) => {
              const isStart = node.id === startNode;
              const isTarget = node.id === targetNode;
              const isCurrent = node.id === activeNode;
              const isVisited = visitedSet.has(node.id);
              const isInPath = pathSet.has(node.id);

              let fill = "#0f172a";
              let stroke = "#334155";
              let strokeW = "2";

              if (isInPath) { fill = "#f59e0b"; stroke = "#fbbf24"; strokeW = "3"; }
              else if (isCurrent) { fill = themeColor; stroke = "#ffffff"; strokeW = "3"; }
              else if (isVisited) { fill = "#10b981"; stroke = "#34d399"; strokeW = "2"; }

              const nodeDist = currStep.dist ? currStep.dist[node.id] : null;

              return (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                  {(isCurrent || isInPath) && <circle r="22" fill="none" stroke={isInPath ? "#f59e0b" : themeColor} strokeWidth="2" opacity="0.5" className="animate-ping" />}
                  <circle r="18" fill={fill} stroke={stroke} strokeWidth={strokeW} className="transition-all duration-300" />
                  <text textAnchor="middle" dy="4" fontSize="12" fontWeight="900" fill={fill === "#f59e0b" || fill === themeColor ? "#000000" : "#ffffff"} fontFamily="monospace">
                    {node.id}
                  </text>
                  {isStart && (
                    <g transform="translate(0, -26)">
                      <rect x="-18" y="-9" width="36" height="14" rx="4" fill="#0284c7" />
                      <text textAnchor="middle" dy="1" fontSize="8" fontWeight="bold" fill="#ffffff" fontFamily="monospace">START</text>
                    </g>
                  )}
                  {isTarget && (
                    <g transform="translate(0, 28)">
                      <rect x="-20" y="-7" width="40" height="14" rx="4" fill="#16a34a" />
                      <text textAnchor="middle" dy="3" fontSize="8" fontWeight="bold" fill="#ffffff" fontFamily="monospace">TARGET</text>
                    </g>
                  )}
                  {nodeDist !== null && (
                    <g transform="translate(22, 0)">
                      <rect x="0" y="-8" width="24" height="14" rx="4" fill="#0f172a" stroke="#334155" />
                      <text textAnchor="middle" x="12" dy="2" fontSize="9" fontWeight="bold" fill="#38bdf8" fontFamily="monospace">
                        {nodeDist === Infinity ? "∞" : nodeDist}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex items-center justify-center gap-1.5 sm:gap-3 w-full px-1">
          <button onClick={() => { setStepIdx(0); setPlaying(false); }} className="flex-1 sm:flex-initial flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-3 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            <RotateCcw size={13} /> Reset
          </button>
          <button onClick={() => setStepIdx((p) => Math.max(0, p - 1))} className="flex-1 sm:flex-initial flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-4 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            ◀ Prev
          </button>
          <button onClick={() => setPlaying((p) => !p)} className="flex-[1.8] sm:flex-initial flex items-center justify-center gap-1.5 rounded-2xl px-4 sm:px-8 py-2 sm:py-3 font-mono text-xs sm:text-sm font-black text-black transition-all shadow-lg hover:scale-105 active:scale-95 shrink-0" style={{ backgroundColor: themeColor, boxShadow: `0 4px 24px ${themeColor}55` }}>
            {playing ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Play</>}
          </button>
          <button onClick={() => setStepIdx((p) => Math.min(steps.length - 1, p + 1))} className="flex-1 sm:flex-initial flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-4 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            Next ▶
          </button>
          <button onClick={() => { setStepIdx(steps.length - 1); setPlaying(false); }} className="flex-1 sm:flex-initial flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-3 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            <SkipForward size={13} /> End
          </button>
        </div>
      </div>
    </div>
  );
};

// BST and AVL self-balancing tree

class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.height = 1;
    this.id = `node-${val}-${Math.random().toString(36).slice(2, 6)}`;
  }
}

function getNodeHeight(node) { return node ? node.height : 0; }
function getBalance(node) { return node ? getNodeHeight(node.left) - getNodeHeight(node.right) : 0; }
function updateHeight(node) { if (node) node.height = Math.max(getNodeHeight(node.left), getNodeHeight(node.right)) + 1; }

function cloneTree(node) {
  if (!node) return null;
  const copy = new TreeNode(node.val);
  copy.id = node.id;
  copy.height = node.height;
  copy.left = cloneTree(node.left);
  copy.right = cloneTree(node.right);
  return copy;
}

function computeLayout(node, x = 260, y = 40, level = 0, dx = 90) {
  if (!node) return null;
  const nextDx = Math.max(22, dx * 0.52);
  return {
    ...node,
    x,
    y,
    left: computeLayout(node.left, x - dx, y + 55, level + 1, nextDx),
    right: computeLayout(node.right, x + dx, y + 55, level + 1, nextDx),
  };
}

function flattenTree(layoutNode, nodesArr = [], edgesArr = []) {
  if (!layoutNode) return { nodes: nodesArr, edges: edgesArr };
  nodesArr.push({ id: layoutNode.id, val: layoutNode.val, height: layoutNode.height, x: layoutNode.x, y: layoutNode.y });

  if (layoutNode.left) {
    edgesArr.push({ u: layoutNode.id, v: layoutNode.left.id, x1: layoutNode.x, y1: layoutNode.y, x2: layoutNode.left.x, y2: layoutNode.left.y });
    flattenTree(layoutNode.left, nodesArr, edgesArr);
  }
  if (layoutNode.right) {
    edgesArr.push({ u: layoutNode.id, v: layoutNode.right.id, x1: layoutNode.x, y1: layoutNode.y, x2: layoutNode.right.x, y2: layoutNode.right.y });
    flattenTree(layoutNode.right, nodesArr, edgesArr);
  }

  return { nodes: nodesArr, edges: edgesArr };
}

function* bstInsertGen(root, val, isAvl = true) {
  function* insertHelper(node, val) {
    if (!node) return new TreeNode(val);

    yield { tree: null, activeVal: val, comparingVal: node.val, phase: `Compare value ${val} with current node ${node.val}` };

    if (val < node.val) node.left = yield* insertHelper(node.left, val);
    else if (val > node.val) node.right = yield* insertHelper(node.right, val);
    else return node;

    updateHeight(node);
    const balance = getBalance(node);

    if (isAvl) {
      if (balance > 1 && val < node.left.val) return rightRotate(node);
      if (balance < -1 && val > node.right.val) return leftRotate(node);
      if (balance > 1 && val > node.left.val) { node.left = leftRotate(node.left); return rightRotate(node); }
      if (balance < -1 && val < node.right.val) { node.right = rightRotate(node.right); return leftRotate(node); }
    }
    return node;
  }

  function rightRotate(y) {
    const x = y.left, T2 = x.right;
    x.right = y; y.left = T2;
    updateHeight(y); updateHeight(x);
    return x;
  }

  function leftRotate(x) {
    const y = x.right, T2 = y.left;
    y.left = x; x.right = T2;
    updateHeight(x); updateHeight(y);
    return y;
  }

  return yield* insertHelper(root, val);
}

function* inorderGen(node, result = []) {
  if (!node) return;
  yield* inorderGen(node.left, result);
  result.push(node.val);
  yield { activeVal: node.val, result: [...result], phase: `In-Order: Visited node ${node.val}` };
  yield* inorderGen(node.right, result);
}

function* preorderGen(node, result = []) {
  if (!node) return;
  result.push(node.val);
  yield { activeVal: node.val, result: [...result], phase: `Pre-Order: Visited node ${node.val}` };
  yield* preorderGen(node.left, result);
  yield* preorderGen(node.right, result);
}

function* postorderGen(node, result = []) {
  if (!node) return;
  yield* postorderGen(node.left, result);
  yield* postorderGen(node.right, result);
  result.push(node.val);
  yield { activeVal: node.val, result: [...result], phase: `Post-Order: Visited node ${node.val}` };
}

const TREE_PRESETS = {
  Balanced: [25, 15, 35, 10, 20, 30, 40],
  Degenerate: [10, 20, 30, 40, 50],
  AVL_Test: [50, 25, 75, 10, 30, 60, 80, 5, 15],
};

const BstTreeVisualizer = () => {
  const [treeRoot, setTreeRoot] = useState(() => {
    let r = null;
    [25, 15, 35, 10, 20, 30, 40].forEach((v) => {
      const g = bstInsertGen(r, v, true);
      let res = g.next();
      while (!res.done) res = g.next();
      r = res.value;
    });
    return r;
  });

  const [inputVal, setInputVal] = useState("");
  const [traversalType, setTraversalType] = useState("In-Order");
  const [speed, setSpeed] = useState("Normal");
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [isAvl, setIsAvl] = useState(true);
  const intervalRef = useRef(null);

  const handleInsert = (v) => {
    const val = Number(v || inputVal);
    if (isNaN(val)) return;

    const cloned = cloneTree(treeRoot);
    const gen = bstInsertGen(cloned, val, isAvl);
    const collected = [];
    let res = gen.next();
    while (!res.done) {
      collected.push({ ...res.value, tree: cloneTree(cloned) });
      res = gen.next();
    }
    const finalTree = res.value;
    collected.push({ tree: cloneTree(finalTree), activeVal: val, comparingVal: val, phase: `✅ Successfully inserted ${val} into Tree!` });

    setTreeRoot(finalTree);
    setSteps(collected);
    setStepIdx(0);
    setPlaying(true);
    setInputVal("");
  };

  const handleRunTraversal = (tType) => {
    const type = tType || traversalType;
    setTraversalType(type);
    let gen;
    if (type === "In-Order") gen = inorderGen(treeRoot);
    else if (type === "Pre-Order") gen = preorderGen(treeRoot);
    else gen = postorderGen(treeRoot);

    const collected = [];
    let res = gen.next();
    while (!res.done) {
      collected.push(res.value);
      res = gen.next();
    }

    setSteps(collected);
    setStepIdx(0);
    setPlaying(true);
  };

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
      }, SPEEDS[speed] * 2);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, speed, steps.length]);

  const loadPreset = (presetName) => {
    let r = null;
    TREE_PRESETS[presetName].forEach((v) => {
      const g = bstInsertGen(r, v, isAvl);
      let res = g.next();
      while (!res.done) res = g.next();
      r = res.value;
    });
    setTreeRoot(r);
    setSteps([{ tree: cloneTree(r), activeVal: null, comparingVal: null, phase: `Loaded ${presetName} Tree Preset.` }]);
    setStepIdx(0);
    setPlaying(false);
  };

  const clearTree = () => { setTreeRoot(null); setSteps([]); setStepIdx(0); setPlaying(false); };

  const currStep = steps[stepIdx] || {};
  const activeTree = currStep.tree || treeRoot;
  const layoutTree = computeLayout(activeTree);
  const { nodes: svgNodes, edges: svgEdges } = flattenTree(layoutTree);
  const themeColor = "#a78bfa";

  return (
    <div className="rounded-3xl border border-violet-500/20 bg-[#030d07] shadow-2xl overflow-hidden">
      <div className="relative p-4 sm:px-6 sm:py-5 border-b border-violet-500/15" style={{ background: "linear-gradient(135deg, #0b0518 0%, #030d07 60%, #080212 100%)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 shrink-0">
              <GitCommit className="text-violet-400" size={18} />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-xl font-black uppercase text-white tracking-wider">
                BST &amp; AVL Self-Balancing Tree Lab
              </h2>
              <p className="font-mono text-[10px] text-slate-400">Interactive Rotations &amp; Traversal Engine</p>
            </div>
          </div>

          <button
            onClick={() => setIsAvl((prev) => !prev)}
            className={`rounded-full border px-3 py-1 font-mono text-xs font-bold transition self-start sm:self-auto ${isAvl ? "border-emerald-400 bg-emerald-500/20 text-emerald-300" : "border-slate-700 bg-slate-900 text-slate-400"}`}
          >
            {isAvl ? "⚡ AVL Auto-Balance ON" : "Unbalanced BST Mode"}
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-7 space-y-5 sm:space-y-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border border-slate-800/80 bg-slate-950/50">
          <div className="flex flex-wrap items-center gap-2.5">
            <input
              type="number"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInsert()}
              placeholder="Enter val (e.g. 42)"
              className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white font-mono font-bold outline-none focus:border-violet-500 w-36"
            />
            <button onClick={() => handleInsert()} className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 font-mono text-xs font-extrabold text-white hover:bg-violet-500 transition shadow-md">
              <Plus size={14} /> Insert Node
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">Presets:</span>
            {Object.keys(TREE_PRESETS).map((pName) => (
              <button key={pName} onClick={() => loadPreset(pName)} className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 font-mono text-[11px] font-bold text-slate-300 hover:border-violet-500/50 hover:text-violet-300 transition">
                {pName}
              </button>
            ))}
            <button onClick={clearTree} className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 font-mono text-[11px] font-bold text-rose-300 hover:bg-rose-500/20 transition ml-auto">
              <Trash2 size={12} className="inline mr-1" /> Clear
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-800 bg-slate-950/60">
          <span className="font-mono text-[11px] uppercase font-bold text-slate-400">Run Traversal:</span>
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            {["In-Order", "Pre-Order", "Post-Order"].map((t) => (
              <button key={t} onClick={() => handleRunTraversal(t)} className="flex-1 sm:flex-initial rounded-xl border border-violet-500/30 bg-violet-500/10 px-3.5 py-1.5 font-mono text-xs font-bold text-violet-300 hover:bg-violet-500/20 transition text-center">
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-slate-800/60 bg-slate-950/40 p-3 sm:px-4 sm:py-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="h-2 w-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: themeColor }} />
            <p className="font-mono text-xs text-slate-200 font-bold truncate">
              {currStep.phase || "Tree is ready. Insert nodes or select a traversal."}
            </p>
          </div>
          <span className="font-mono text-[11px] text-slate-400 shrink-0">
            Step <span className="text-white font-bold">{stepIdx + 1}</span>/{steps.length || 1}
          </span>
        </div>

        <div className="relative w-full overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-b from-[#060212] to-[#020108] p-4 sm:p-6 flex items-center justify-center min-h-[280px] sm:min-h-[340px]">
          {svgNodes.length === 0 ? (
            <div className="text-center text-slate-500 font-mono text-xs">
              <GitCommit size={32} className="mx-auto mb-2 opacity-40 text-violet-400" />
              Empty Tree. Type a number above and click "Insert Node".
            </div>
          ) : (
            <svg viewBox="0 0 520 280" className="w-full max-w-2xl h-auto overflow-visible">
              {svgEdges.map((edge) => (
                <line key={`${edge.u}-${edge.v}`} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke="#334155" strokeWidth="2" className="transition-all duration-300" />
              ))}
              {svgNodes.map((node) => {
                const isActive = currStep.comparingVal === node.val || currStep.activeVal === node.val;
                let fill = "#0f172a";
                let stroke = "#38bdf8";
                if (isActive) { fill = "#a78bfa"; stroke = "#ffffff"; }
                return (
                  <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                    {isActive && <circle r="22" fill="none" stroke="#a78bfa" strokeWidth="2" opacity="0.6" className="animate-ping" />}
                    <circle r="18" fill={fill} stroke={stroke} strokeWidth="2" className="transition-all duration-300" />
                    <text textAnchor="middle" dy="4" fontSize="12" fontWeight="900" fill={isActive ? "#000000" : "#ffffff"} fontFamily="monospace">
                      {node.val}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {currStep.result && (
          <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4">
            <span className="font-mono text-[10px] font-extrabold uppercase text-violet-300 tracking-wider">
              {traversalType} Traversal Output Stream
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {currStep.result.map((v, i) => (
                <span key={i} className="rounded-lg border border-violet-400/40 bg-violet-400/20 px-3 py-1 font-mono text-xs font-black text-white">
                  {v}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-1.5 sm:gap-3 w-full px-1">
          <button onClick={() => { setStepIdx(0); setPlaying(false); }} className="flex-1 sm:flex-initial flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-3 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            <RotateCcw size={13} /> Reset
          </button>
          <button onClick={() => setStepIdx((p) => Math.max(0, p - 1))} className="flex-1 sm:flex-initial flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-4 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            ◀ Prev
          </button>
          <button onClick={() => setPlaying((p) => !p)} className="flex-[1.8] sm:flex-initial flex items-center justify-center gap-1.5 rounded-2xl px-4 sm:px-8 py-2 sm:py-3 font-mono text-xs sm:text-sm font-black text-black transition-all shadow-lg hover:scale-105 active:scale-95 shrink-0" style={{ backgroundColor: themeColor, boxShadow: `0 4px 24px ${themeColor}55` }}>
            {playing ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Play</>}
          </button>
          <button onClick={() => setStepIdx((p) => Math.min(steps.length - 1, p + 1))} className="flex-1 sm:flex-initial flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-4 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            Next ▶
          </button>
          <button onClick={() => { setStepIdx(steps.length - 1); setPlaying(false); }} className="flex-1 sm:flex-initial flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-3 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            <SkipForward size={13} /> End
          </button>
        </div>
      </div>
    </div>
  );
};

// Dynamic programming grid visualizer

const DEFAULT_KNAPSACK_ITEMS = [
  { name: "Item 1", wt: 2, val: 3 },
  { name: "Item 2", wt: 3, val: 4 },
  { name: "Item 3", wt: 4, val: 5 },
  { name: "Item 4", wt: 5, val: 8 },
];

function* knapsackDpGen(items, capacity = 6) {
  const N = items.length;
  const dp = Array.from({ length: N + 1 }, () => Array(capacity + 1).fill(0));

  yield {
    dp: dp.map((row) => [...row]),
    activeCell: null,
    depCells: [],
    selectedItems: [],
    phase: `Initialized 2D Memoization Table (${N + 1}×${capacity + 1}) filled with 0s.`,
  };

  for (let i = 1; i <= N; i++) {
    const item = items[i - 1];
    for (let w = 0; w <= capacity; w++) {
      if (item.wt <= w) {
        const includeVal = item.val + dp[i - 1][w - item.wt];
        const excludeVal = dp[i - 1][w];

        yield {
          dp: dp.map((row) => [...row]),
          activeCell: [i, w],
          depCells: [[i - 1, w], [i - 1, w - item.wt]],
          selectedItems: [],
          phase: `${item.name} (wt:${item.wt}, val:${item.val}) fits! max(Include: ${item.val}+${dp[i - 1][w - item.wt]}=${includeVal}, Exclude: ${excludeVal})`,
        };

        dp[i][w] = Math.max(includeVal, excludeVal);
      } else {
        dp[i][w] = dp[i - 1][w];
        yield {
          dp: dp.map((row) => [...row]),
          activeCell: [i, w],
          depCells: [[i - 1, w]],
          selectedItems: [],
          phase: `${item.name} (wt:${item.wt}) > capacity ${w}. Inheriting value ${dp[i - 1][w]} from top cell.`,
        };
      }
    }
  }

  let w = capacity;
  const selected = [];
  const backtrackCells = [];
  for (let i = N; i > 0 && w > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(items[i - 1]);
      backtrackCells.push([i, w]);
      w -= items[i - 1].wt;
    }
  }

  yield {
    dp: dp.map((row) => [...row]),
    activeCell: [N, capacity],
    depCells: backtrackCells,
    selectedItems: selected,
    isBacktrack: true,
    phase: `🎯 Backtracked Optimal Items: ${selected.map((it) => `${it.name} (val:${it.val})`).join(" + ")} | Max Value = ${dp[N][capacity]}`,
  };
}

function* lcsDpGen(strA = "AGGTAB", strB = "GXTXAYB") {
  const M = strA.length;
  const N = strB.length;
  const dp = Array.from({ length: M + 1 }, () => Array(N + 1).fill(0));

  yield {
    dp: dp.map((row) => [...row]),
    activeCell: null,
    depCells: [],
    lcsString: "",
    phase: `Initialized LCS Grid (${M + 1}×${N + 1}) comparing '${strA}' vs '${strB}'.`,
  };

  for (let i = 1; i <= M; i++) {
    for (let j = 1; j <= N; j++) {
      const charA = strA[i - 1];
      const charB = strB[j - 1];

      if (charA === charB) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
        yield {
          dp: dp.map((row) => [...row]),
          activeCell: [i, j],
          depCells: [[i - 1, j - 1]],
          lcsString: "",
          phase: `Match Found! '${charA}' == '${charB}' → 1 + dp[${i - 1}][${j - 1}] (${dp[i - 1][j - 1]}) = ${dp[i][j]}`,
        };
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        yield {
          dp: dp.map((row) => [...row]),
          activeCell: [i, j],
          depCells: [[i - 1, j], [i, j - 1]],
          lcsString: "",
          phase: `Mismatch '${charA}' ≠ '${charB}' → max(Top: ${dp[i - 1][j]}, Left: ${dp[i][j - 1]}) = ${dp[i][j]}`,
        };
      }
    }
  }

  let i = M, j = N;
  let lcsChars = [];
  const backtrackCells = [];

  while (i > 0 && j > 0) {
    if (strA[i - 1] === strB[j - 1]) {
      lcsChars.unshift(strA[i - 1]);
      backtrackCells.push([i, j]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  const finalLcs = lcsChars.join("");
  yield {
    dp: dp.map((row) => [...row]),
    activeCell: [M, N],
    depCells: backtrackCells,
    lcsString: finalLcs,
    isBacktrack: true,
    phase: `🎯 Longest Common Subsequence Found: '${finalLcs}' (Length ${dp[M][N]})`,
  };
}

const DpGridVisualizer = () => {
  const [problem, setProblem] = useState("Knapsack");
  const [items] = useState(DEFAULT_KNAPSACK_ITEMS);
  const [capacity, setCapacity] = useState(6);
  const [strA, setStrA] = useState("AGGTAB");
  const [strB, setStrB] = useState("GXTXAYB");

  const [speed, setSpeed] = useState("Normal");
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    let collected = [];
    if (problem === "Knapsack") {
      const gen = knapsackDpGen(items, capacity);
      let res = gen.next();
      while (!res.done) {
        collected.push(res.value);
        res = gen.next();
      }
    } else {
      const gen = lcsDpGen(strA, strB);
      let res = gen.next();
      while (!res.done) {
        collected.push(res.value);
        res = gen.next();
      }
    }
    setSteps(collected);
    setStepIdx(0);
    setPlaying(false);
    clearInterval(intervalRef.current);
  }, [problem, items, capacity, strA, strB]);

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
      }, SPEEDS[speed] * 2);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, speed, steps.length]);

  const currStep = steps[stepIdx] || {};
  const dpMatrix = currStep.dp || [];
  const activeCell = currStep.activeCell || [];
  const depCells = currStep.depCells || [];
  const depSet = new Set(depCells.map((c) => `${c[0]}-${c[1]}`));
  const isBacktrack = currStep.isBacktrack;

  const themeColor = problem === "Knapsack" ? "#84cc16" : "#06b6d4";
  const progress = steps.length > 1 ? Math.round((stepIdx / (steps.length - 1)) * 100) : 0;

  return (
    <div className="rounded-3xl border border-lime-500/20 bg-[#030d07] shadow-2xl overflow-hidden">
      <div className="relative p-4 sm:px-6 sm:py-5 border-b border-lime-500/15" style={{ background: "linear-gradient(135deg, #091404 0%, #030d07 60%, #041002 100%)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-lime-500/30 bg-lime-500/10 shrink-0">
              <Grid className="text-lime-400" size={18} />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-xl font-black uppercase text-white tracking-wider">
                Dynamic Programming &amp; 2D Grid Lab
              </h2>
              <p className="font-mono text-[10px] text-slate-400">Interactive 2D Memoization Table &amp; Backtracking Engine</p>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setProblem("Knapsack")}
              className={`flex-1 sm:flex-initial rounded-xl border px-3.5 py-1.5 font-mono text-xs font-bold transition text-center ${problem === "Knapsack" ? "border-lime-400 bg-lime-500/20 text-lime-200" : "border-slate-700 bg-slate-900 text-slate-400"}`}
            >
              🎒 0/1 Knapsack
            </button>
            <button
              onClick={() => setProblem("LCS")}
              className={`flex-1 sm:flex-initial rounded-xl border px-3.5 py-1.5 font-mono text-xs font-bold transition text-center ${problem === "LCS" ? "border-cyan-400 bg-cyan-500/20 text-cyan-200" : "border-slate-700 bg-slate-900 text-slate-400"}`}
            >
              🔤 LCS Subsequence
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-7 space-y-5 sm:space-y-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border border-slate-800/80 bg-slate-950/50">
          {problem === "Knapsack" ? (
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] uppercase text-slate-400 font-bold">Knapsack Capacity W:</span>
              <input type="range" min={4} max={8} value={capacity} onChange={(e) => setCapacity(+e.target.value)} className="w-28 accent-lime-400 cursor-pointer" />
              <span className="font-mono text-xs font-black text-lime-400">{capacity}</span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 font-mono text-xs font-bold text-slate-300">
                Str A:
                <input type="text" maxLength={7} value={strA} onChange={(e) => setStrA(e.target.value.toUpperCase())} className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-cyan-400 font-black outline-none w-24 uppercase" />
              </label>
              <label className="flex items-center gap-2 font-mono text-xs font-bold text-slate-300">
                Str B:
                <input type="text" maxLength={7} value={strB} onChange={(e) => setStrB(e.target.value.toUpperCase())} className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-lime-400 font-black outline-none w-24 uppercase" />
              </label>
            </div>
          )}

          <div className="flex items-center justify-between sm:justify-start gap-3">
            <span className="font-mono text-[11px] uppercase text-slate-500 font-bold whitespace-nowrap">Speed</span>
            <div className="grid grid-cols-3 rounded-xl border border-slate-800 overflow-hidden w-full sm:w-auto text-center">
              {["Slow", "Normal", "Fast"].map((s) => (
                <button key={s} onClick={() => setSpeed(s)} className={`px-3 py-1.5 font-mono text-[11px] font-bold transition ${speed === s ? "bg-lime-500 text-black" : "bg-slate-900/60 text-slate-400 hover:text-white"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-slate-800/60 bg-slate-950/40 p-3 sm:px-4 sm:py-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="h-2 w-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: themeColor }} />
            <p className="font-mono text-xs text-slate-200 font-bold truncate">
              {currStep.phase || "Press Play to step through 2D Matrix computation."}
            </p>
          </div>
          <span className="font-mono text-[11px] text-slate-400 shrink-0">
            Step <span className="text-white font-bold">{stepIdx + 1}</span>/{steps.length} · <span className="font-bold" style={{ color: themeColor }}>{progress}%</span>
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4">
          <table className="w-full font-mono text-xs border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500">
                <th className="p-2 text-left bg-slate-900/50">i / j</th>
                {problem === "Knapsack" ? (
                  Array.from({ length: capacity + 1 }, (_, w) => (
                    <th key={w} className="p-2 text-center bg-slate-900/50">w={w}</th>
                  ))
                ) : (
                  ["∅", ...strB.split("")].map((ch, idx) => (
                    <th key={idx} className="p-2 text-center bg-slate-900/50">{ch} (j={idx})</th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {dpMatrix.map((row, i) => (
                <tr key={i} className="border-b border-slate-800/40">
                  <td className="p-2 font-bold text-slate-400 bg-slate-900/30 whitespace-nowrap">
                    {problem === "Knapsack"
                      ? (i === 0 ? "∅ (0)" : `${items[i - 1].name} (i=${i})`)
                      : (i === 0 ? "∅ (0)" : `${strA[i - 1]} (i=${i})`)}
                  </td>
                  {row.map((val, j) => {
                    const isActive = activeCell[0] === i && activeCell[1] === j;
                    const isDep = depSet.has(`${i}-${j}`);
                    let cellBg = "bg-slate-900/20 text-slate-300";
                    let borderCls = "border-slate-800/50";

                    if (isBacktrack && isDep) {
                      cellBg = "bg-amber-500/20 text-amber-300 font-black shadow-[inset_0_0_12px_rgba(245,158,11,0.3)]";
                      borderCls = "border-amber-500/50";
                    } else if (isActive) {
                      cellBg = problem === "Knapsack" ? "bg-lime-500/25 text-lime-200 font-black" : "bg-cyan-500/25 text-cyan-200 font-black";
                      borderCls = problem === "Knapsack" ? "border-lime-400" : "border-cyan-400";
                    } else if (isDep) {
                      cellBg = "bg-violet-500/20 text-violet-300 font-bold";
                      borderCls = "border-violet-500/40";
                    }

                    return (
                      <td key={j} className={`p-2.5 text-center border font-mono transition-all duration-150 ${cellBg} ${borderCls}`}>
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currStep.selectedItems?.length > 0 && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
            <span className="font-mono text-[10px] font-extrabold uppercase text-amber-300 tracking-wider">
              Selected Optimal Knapsack Items
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {currStep.selectedItems.map((it, idx) => (
                <span key={idx} className="rounded-lg border border-amber-400/40 bg-amber-400/20 px-3 py-1 font-mono text-xs font-black text-amber-200">
                  📦 {it.name} (wt: {it.wt}, val: {it.val})
                </span>
              ))}
            </div>
          </div>
        )}

        {currStep.lcsString && (
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4">
            <span className="font-mono text-[10px] font-extrabold uppercase text-cyan-300 tracking-wider">
              Longest Common Subsequence Output
            </span>
            <div className="mt-2 font-mono text-lg font-black text-cyan-200 tracking-widest">
              "{currStep.lcsString}"
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-1.5 sm:gap-3 w-full px-1">
          <button onClick={() => { setStepIdx(0); setPlaying(false); }} className="flex-1 sm:flex-initial flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-3 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            <RotateCcw size={13} /> Reset
          </button>
          <button onClick={() => setStepIdx((p) => Math.max(0, p - 1))} className="flex-1 sm:flex-initial flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-4 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            ◀ Prev
          </button>
          <button onClick={() => setPlaying((p) => !p)} className="flex-[1.8] sm:flex-initial flex items-center justify-center gap-1.5 rounded-2xl px-4 sm:px-8 py-2 sm:py-3 font-mono text-xs sm:text-sm font-black text-black transition-all shadow-lg hover:scale-105 active:scale-95 shrink-0" style={{ backgroundColor: themeColor, boxShadow: `0 4px 24px ${themeColor}55` }}>
            {playing ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Play</>}
          </button>
          <button onClick={() => setStepIdx((p) => Math.min(steps.length - 1, p + 1))} className="flex-1 sm:flex-initial flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-4 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            Next ▶
          </button>
          <button onClick={() => { setStepIdx(steps.length - 1); setPlaying(false); }} className="flex-1 sm:flex-initial flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-3 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            <SkipForward size={13} /> End
          </button>
        </div>
      </div>
    </div>
  );
};

// Two-pointer and sliding window

const BINARY_SEARCH_ARRAY = [5, 12, 18, 24, 31, 42, 55, 68, 77, 89, 95];
const SLIDING_WINDOW_ARRAY = [4, 2, 1, 7, 8, 1, 2, 8, 1, 0];
const WATER_CONTAINER_ARRAY = [1, 8, 6, 2, 5, 4, 8, 3, 7];

function* binarySearchGen(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  yield { arr, left, right, mid: Math.floor((left + right) / 2), foundIdx: null, phase: `Initialized Binary Search for target ${target}. Left=0, Right=${right}` };

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midVal = arr[mid];

    yield { arr, left, right, mid, foundIdx: null, phase: `Checked MID arr[${mid}] = ${midVal}. Comparing with target ${target}` };

    if (midVal === target) {
      yield { arr, left, right, mid, foundIdx: mid, phase: `🎯 Target ${target} Found at Index ${mid}!` };
      return;
    } else if (midVal < target) {
      left = mid + 1;
      yield { arr, left, right, mid, foundIdx: null, phase: `arr[${mid}] (${midVal}) < ${target} → Move Left pointer to ${left}` };
    } else {
      right = mid - 1;
      yield { arr, left, right, mid, foundIdx: null, phase: `arr[${mid}] (${midVal}) > ${target} → Move Right pointer to ${right}` };
    }
  }

  yield { arr, left: null, right: null, mid: null, foundIdx: -1, phase: `❌ Target ${target} not found in array.` };
}

function* slidingWindowGen(arr, windowSize = 3) {
  let maxSum = 0;
  let currSum = 0;
  let bestWindow = [0, windowSize - 1];

  for (let i = 0; i < windowSize; i++) currSum += arr[i];
  maxSum = currSum;

  yield { arr, window: [0, windowSize - 1], currSum, maxSum, bestWindow: [0, windowSize - 1], phase: `Initial Window [0..${windowSize - 1}] Sum = ${currSum}` };

  for (let i = windowSize; i < arr.length; i++) {
    currSum = currSum - arr[i - windowSize] + arr[i];
    const winL = i - windowSize + 1;
    const winR = i;

    if (currSum > maxSum) {
      maxSum = currSum;
      bestWindow = [winL, winR];
    }

    yield { arr, window: [winL, winR], currSum, maxSum, bestWindow, phase: `Slid window to [${winL}..${winR}]. Subtract arr[${i - windowSize}] (${arr[i - windowSize]}), Add arr[${i}] (${arr[i]}) → Sum = ${currSum} (Max = ${maxSum})` };
  }

  yield { arr, window: bestWindow, currSum: maxSum, maxSum, bestWindow, phase: `🏆 Max Sum Subarray Found! Range [${bestWindow[0]}..${bestWindow[1]}] with Max Sum = ${maxSum}` };
}

function* waterContainerGen(heights) {
  let left = 0;
  let right = heights.length - 1;
  let maxArea = 0;
  let bestPair = [0, heights.length - 1];

  while (left < right) {
    const width = right - left;
    const hL = heights[left];
    const hR = heights[right];
    const minH = Math.min(hL, hR);
    const area = width * minH;

    if (area > maxArea) {
      maxArea = area;
      bestPair = [left, right];
    }

    yield { heights, left, right, currArea: area, maxArea, bestPair, phase: `Pointers L=${left} (h=${hL}), R=${right} (h=${hR}) → Width = ${width}, Min Height = ${minH} → Area = ${area} (Max = ${maxArea})` };

    if (hL < hR) left++;
    else right--;
  }

  yield { heights, left: bestPair[0], right: bestPair[1], currArea: maxArea, maxArea, bestPair, phase: `🏆 Maximum Water Container Found! Range [${bestPair[0]}..${bestPair[1]}] with Max Capacity = ${maxArea} units²` };
}

const TwoPointerVisualizer = () => {
  const [pattern, setPattern] = useState("BinarySearch");
  const [target, setTarget] = useState(42);
  const [windowSize, setWindowSize] = useState(3);

  const [speed, setSpeed] = useState("Normal");
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    let collected = [];
    if (pattern === "BinarySearch") {
      const gen = binarySearchGen(BINARY_SEARCH_ARRAY, target);
      let res = gen.next();
      while (!res.done) { collected.push(res.value); res = gen.next(); }
    } else if (pattern === "SlidingWindow") {
      const gen = slidingWindowGen(SLIDING_WINDOW_ARRAY, windowSize);
      let res = gen.next();
      while (!res.done) { collected.push(res.value); res = gen.next(); }
    } else {
      const gen = waterContainerGen(WATER_CONTAINER_ARRAY);
      let res = gen.next();
      while (!res.done) { collected.push(res.value); res = gen.next(); }
    }

    setSteps(collected);
    setStepIdx(0);
    setPlaying(false);
    clearInterval(intervalRef.current);
  }, [pattern, target, windowSize]);

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
      }, SPEEDS[speed] * 2);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, speed, steps.length]);

  const currStep = steps[stepIdx] || {};
  const themeColor = pattern === "BinarySearch" ? "#38bdf8" : pattern === "SlidingWindow" ? "#f59e0b" : "#ec4899";
  const progress = steps.length > 1 ? Math.round((stepIdx / (steps.length - 1)) * 100) : 0;

  return (
    <div className="rounded-3xl border border-amber-500/20 bg-[#030d07] shadow-2xl overflow-hidden">
      <div className="relative p-4 sm:px-6 sm:py-5 border-b border-amber-500/15" style={{ background: "linear-gradient(135deg, #180d04 0%, #030d07 60%, #120902 100%)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 shrink-0">
              <Sliders className="text-amber-400" size={18} />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-xl font-black uppercase text-white tracking-wider">
                Two-Pointer &amp; Sliding Window Lab
              </h2>
              <p className="font-mono text-[10px] text-slate-400">Binary Search, Sliding Window &amp; Water Container Pointers</p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
            <button onClick={() => setPattern("BinarySearch")} className={`flex-1 sm:flex-initial rounded-xl border px-3 py-1.5 font-mono text-xs font-bold transition ${pattern === "BinarySearch" ? "border-cyan-400 bg-cyan-500/20 text-cyan-200" : "border-slate-700 bg-slate-900 text-slate-400"}`}>
              🔍 Binary Search
            </button>
            <button onClick={() => setPattern("SlidingWindow")} className={`flex-1 sm:flex-initial rounded-xl border px-3 py-1.5 font-mono text-xs font-bold transition ${pattern === "SlidingWindow" ? "border-amber-400 bg-amber-500/20 text-amber-200" : "border-slate-700 bg-slate-900 text-slate-400"}`}>
              🪟 Sliding Window
            </button>
            <button onClick={() => setPattern("WaterContainer")} className={`flex-1 sm:flex-initial rounded-xl border px-3 py-1.5 font-mono text-xs font-bold transition ${pattern === "WaterContainer" ? "border-pink-400 bg-pink-500/20 text-pink-200" : "border-slate-700 bg-slate-900 text-slate-400"}`}>
              💧 Water Container
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-7 space-y-5 sm:space-y-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border border-slate-800/80 bg-slate-950/50">
          {pattern === "BinarySearch" ? (
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] uppercase text-slate-400 font-bold">Search Target:</span>
              <select value={target} onChange={(e) => setTarget(+e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-cyan-400 font-black outline-none">
                {BINARY_SEARCH_ARRAY.map((v) => <option key={v} value={v}>{v}</option>)}
                <option value={99}>99 (Not Found)</option>
              </select>
            </div>
          ) : pattern === "SlidingWindow" ? (
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] uppercase text-slate-400 font-bold">Window Size K:</span>
              <input type="range" min={2} max={5} value={windowSize} onChange={(e) => setWindowSize(+e.target.value)} className="w-28 accent-amber-400 cursor-pointer" />
              <span className="font-mono text-xs font-black text-amber-400">{windowSize}</span>
            </div>
          ) : (
            <span className="font-mono text-xs font-bold text-slate-400">Container Width × Min(H_Left, H_Right)</span>
          )}

          <div className="flex items-center justify-between sm:justify-start gap-3">
            <span className="font-mono text-[11px] uppercase text-slate-500 font-bold whitespace-nowrap">Speed</span>
            <div className="grid grid-cols-3 rounded-xl border border-slate-800 overflow-hidden w-full sm:w-auto text-center">
              {["Slow", "Normal", "Fast"].map((s) => (
                <button key={s} onClick={() => setSpeed(s)} className={`px-3 py-1.5 font-mono text-[11px] font-bold transition ${speed === s ? "bg-amber-500 text-black" : "bg-slate-900/60 text-slate-400 hover:text-white"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-slate-800/60 bg-slate-950/40 p-3 sm:px-4 sm:py-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="h-2 w-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: themeColor }} />
            <p className="font-mono text-xs text-slate-200 font-bold truncate">
              {currStep.phase || "Press Play to step through two-pointer execution."}
            </p>
          </div>
          <span className="font-mono text-[11px] text-slate-400 shrink-0">
            Step <span className="text-white font-bold">{stepIdx + 1}</span>/{steps.length} · <span className="font-bold" style={{ color: themeColor }}>{progress}%</span>
          </span>
        </div>

        <div className="relative w-full overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-b from-[#0e0702] to-[#040201] p-4 sm:p-6 flex flex-col items-center justify-center min-h-[220px]">
          {pattern === "BinarySearch" && (
            <div className="flex items-center gap-2 flex-wrap justify-center my-6">
              {BINARY_SEARCH_ARRAY.map((val, i) => {
                const isLeft = currStep.left === i;
                const isRight = currStep.right === i;
                const isMid = currStep.mid === i;
                const isFound = currStep.foundIdx === i;

                let border = "border-slate-800 bg-slate-900/40 text-slate-400";
                if (isFound) border = "border-emerald-400 bg-emerald-500/30 text-emerald-200 shadow-[0_0_16px_rgba(34,197,94,0.5)]";
                else if (isMid) border = "border-amber-400 bg-amber-500/30 text-amber-200 shadow-[0_0_16px_rgba(245,158,11,0.5)]";
                else if (isLeft || isRight) border = "border-cyan-400 bg-cyan-500/20 text-cyan-200";

                return (
                  <div key={i} className="relative flex flex-col items-center">
                    <div className="h-5 font-mono text-[9px] font-black uppercase text-cyan-400">
                      {isLeft && "L "}
                      {isRight && "R"}
                      {isMid && <span className="text-amber-400">MID</span>}
                    </div>
                    <div className={`h-11 w-11 rounded-xl border flex items-center justify-center font-mono text-sm font-black transition-all ${border}`}>
                      {val}
                    </div>
                    <span className="font-mono text-[9px] text-slate-600 mt-1">[{i}]</span>
                  </div>
                );
              })}
            </div>
          )}

          {pattern === "SlidingWindow" && (
            <div className="flex items-center gap-2 flex-wrap justify-center my-6">
              {SLIDING_WINDOW_ARRAY.map((val, i) => {
                const inWin = currStep.window && i >= currStep.window[0] && i <= currStep.window[1];
                let border = "border-slate-800 bg-slate-900/40 text-slate-400";
                if (inWin) border = "border-amber-400 bg-amber-500/20 text-amber-200 shadow-[0_0_16px_rgba(245,158,11,0.4)]";

                return (
                  <div key={i} className="relative flex flex-col items-center">
                    <div className={`h-11 w-11 rounded-xl border flex items-center justify-center font-mono text-sm font-black transition-all ${border}`}>
                      {val}
                    </div>
                    <span className="font-mono text-[9px] text-slate-600 mt-1">[{i}]</span>
                  </div>
                );
              })}
            </div>
          )}

          {pattern === "WaterContainer" && (
            <div className="flex items-end justify-center gap-2 sm:gap-3 h-[160px] w-full max-w-lg pt-4">
              {WATER_CONTAINER_ARRAY.map((h, i) => {
                const isL = currStep.left === i;
                const isR = currStep.right === i;
                const isBetween = currStep.left !== undefined && i >= currStep.left && i <= currStep.right;

                let barBg = "bg-slate-800";
                if (isL || isR) barBg = "bg-pink-500 shadow-[0_0_16px_rgba(236,72,153,0.6)]";
                else if (isBetween) barBg = "bg-pink-950/60 border-t border-pink-500/40";

                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                    <span className="font-mono text-[9px] font-bold text-pink-300 mb-1">{isL ? "L" : isR ? "R" : ""}</span>
                    <div style={{ height: `${(h / 9) * 100}%` }} className={`w-full rounded-t-md transition-all ${barBg}`} />
                    <span className="font-mono text-[9px] text-slate-500 mt-1">h={h}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {pattern === "SlidingWindow" && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-amber-300">Current Window Sum: <span className="text-white font-black text-sm">{currStep.currSum}</span></span>
            <span className="font-mono text-xs font-bold text-amber-400">Max Subarray Sum: <span className="text-white font-black text-sm">{currStep.maxSum}</span></span>
          </div>
        )}

        {pattern === "WaterContainer" && (
          <div className="rounded-2xl border border-pink-500/30 bg-pink-500/10 p-4 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-pink-300">Current Water Area: <span className="text-white font-black text-sm">{currStep.currArea} units²</span></span>
            <span className="font-mono text-xs font-bold text-pink-400">Max Capacity: <span className="text-white font-black text-sm">{currStep.maxArea} units²</span></span>
          </div>
        )}

        <div className="flex items-center justify-center gap-1.5 sm:gap-3 w-full px-1">
          <button onClick={() => { setStepIdx(0); setPlaying(false); }} className="flex-1 sm:flex-initial flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-3 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            <RotateCcw size={13} /> Reset
          </button>
          <button onClick={() => setStepIdx((p) => Math.max(0, p - 1))} className="flex-1 sm:flex-initial flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-4 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            ◀ Prev
          </button>
          <button onClick={() => setPlaying((p) => !p)} className="flex-[1.8] sm:flex-initial flex items-center justify-center gap-1.5 rounded-2xl px-4 sm:px-8 py-2 sm:py-3 font-mono text-xs sm:text-sm font-black text-black transition-all shadow-lg hover:scale-105 active:scale-95 shrink-0" style={{ backgroundColor: themeColor, boxShadow: `0 4px 24px ${themeColor}55` }}>
            {playing ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Play</>}
          </button>
          <button onClick={() => setStepIdx((p) => Math.min(steps.length - 1, p + 1))} className="flex-1 sm:flex-initial flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-4 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            Next ▶
          </button>
          <button onClick={() => { setStepIdx(steps.length - 1); setPlaying(false); }} className="flex-1 sm:flex-initial flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-3 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            <SkipForward size={13} /> End
          </button>
        </div>
      </div>
    </div>
  );
};

// Backtracking N-Queens visualizer

function* nQueensGen(N = 4) {
  const board = Array(N).fill(-1);
  let solutionsCount = 0;
  let backtracksCount = 0;

  function* solve(row) {
    if (row === N) {
      solutionsCount++;
      yield {
        board: [...board],
        activeRow: row - 1,
        activeCol: board[row - 1],
        conflict: null,
        isSolution: true,
        solutionsCount,
        backtracksCount,
        phase: `👑 Solution #${solutionsCount} Found! Valid Queen Configuration for N=${N}`,
      };
      return;
    }

    for (let col = 0; col < N; col++) {
      board[row] = col;

      let conflictRow = null;
      for (let r = 0; r < row; r++) {
        if (board[r] === col || Math.abs(board[r] - col) === Math.abs(r - row)) {
          conflictRow = r;
          break;
        }
      }

      if (conflictRow === null) {
        yield {
          board: [...board],
          activeRow: row,
          activeCol: col,
          conflict: null,
          isSolution: false,
          solutionsCount,
          backtracksCount,
          phase: `Placed Queen at Row ${row}, Col ${col} (Safe position). Proceeding to Row ${row + 1}`,
        };
        yield* solve(row + 1);
      } else {
        yield {
          board: [...board],
          activeRow: row,
          activeCol: col,
          conflict: [conflictRow, board[conflictRow]],
          isSolution: false,
          solutionsCount,
          backtracksCount,
          phase: `❌ Attack Conflict! Queen at (${row}, ${col}) is threatened by Queen at (${conflictRow}, ${board[conflictRow]})`,
        };
      }
    }

    board[row] = -1;
    backtracksCount++;
    yield {
      board: [...board],
      activeRow: row,
      activeCol: null,
      conflict: null,
      isBacktrack: true,
      solutionsCount,
      backtracksCount,
      phase: `↩️ Backtracking from Row ${row}. Removing Queen and trying next option.`,
    };
  }

  yield* solve(0);
}

const BacktrackingVisualizer = () => {
  const [boardSize, setBoardSize] = useState(4);
  const [speed, setSpeed] = useState("Normal");
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const gen = nQueensGen(boardSize);
    const collected = [];
    let res = gen.next();
    while (!res.done) {
      collected.push(res.value);
      res = gen.next();
    }
    setSteps(collected);
    setStepIdx(0);
    setPlaying(false);
    clearInterval(intervalRef.current);
  }, [boardSize]);

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
      }, SPEEDS[speed] * 2);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, speed, steps.length]);

  const currStep = steps[stepIdx] || {};
  const board = currStep.board || Array(boardSize).fill(-1);
  const activeRow = currStep.activeRow;
  const activeCol = currStep.activeCol;
  const conflict = currStep.conflict;
  const isSolution = currStep.isSolution;

  const themeColor = "#f43f5e";
  const progress = steps.length > 1 ? Math.round((stepIdx / (steps.length - 1)) * 100) : 0;

  return (
    <div className="rounded-3xl border border-rose-500/20 bg-[#030d07] shadow-2xl overflow-hidden">
      <div className="relative p-4 sm:px-6 sm:py-5 border-b border-rose-500/15" style={{ background: "linear-gradient(135deg, #1c050a 0%, #030d07 60%, #140206 100%)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 shrink-0">
              <Crown className="text-rose-400" size={18} />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-xl font-black uppercase text-white tracking-wider">
                Backtracking N-Queens Visualizer
              </h2>
              <p className="font-mono text-[10px] text-slate-400">Recursive Call Stack Rollback &amp; Attack Conflict Detection</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-400">Board Size:</span>
            <button onClick={() => setBoardSize(4)} className={`rounded-xl border px-3 py-1 font-mono text-xs font-bold transition ${boardSize === 4 ? "border-rose-400 bg-rose-500/20 text-rose-200" : "border-slate-700 bg-slate-900 text-slate-400"}`}>
              4 × 4
            </button>
            <button onClick={() => setBoardSize(8)} className={`rounded-xl border px-3 py-1 font-mono text-xs font-bold transition ${boardSize === 8 ? "border-rose-400 bg-rose-500/20 text-rose-200" : "border-slate-700 bg-slate-900 text-slate-400"}`}>
              8 × 8
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-7 space-y-5 sm:space-y-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs font-bold text-slate-300">
              Valid Solutions: <span className="text-emerald-400 font-black text-sm">{currStep.solutionsCount || 0}</span>
            </span>
            <span className="font-mono text-xs font-bold text-slate-300">
              Backtracks: <span className="text-rose-400 font-black text-sm">{currStep.backtracksCount || 0}</span>
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-3">
            <span className="font-mono text-[11px] uppercase text-slate-500 font-bold whitespace-nowrap">Speed</span>
            <div className="grid grid-cols-4 rounded-xl border border-slate-800 overflow-hidden w-full sm:w-auto text-center">
              {["Slow", "Normal", "Fast", "Turbo"].map((s) => (
                <button key={s} onClick={() => setSpeed(s)} className={`px-2.5 py-1.5 font-mono text-[11px] font-bold transition ${speed === s ? "bg-rose-500 text-black" : "bg-slate-900/60 text-slate-400 hover:text-white"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-slate-800/60 bg-slate-950/40 p-3 sm:px-4 sm:py-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="h-2 w-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: themeColor }} />
            <p className="font-mono text-xs text-slate-200 font-bold truncate">
              {currStep.phase || "Press Play to step through N-Queens backtracking."}
            </p>
          </div>
          <span className="font-mono text-[11px] text-slate-400 shrink-0">
            Step <span className="text-white font-bold">{stepIdx + 1}</span>/{steps.length} · <span className="font-bold" style={{ color: themeColor }}>{progress}%</span>
          </span>
        </div>

        <div className="relative w-full overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-b from-[#100306] to-[#040102] p-4 sm:p-6 flex items-center justify-center min-h-[260px] sm:min-h-[320px]">
          <div className={`grid gap-1 border-2 border-slate-800 p-2 rounded-xl bg-slate-950 ${boardSize === 4 ? "grid-cols-4 w-64 h-64" : "grid-cols-8 w-80 h-80 sm:w-96 sm:h-96"}`}>
            {Array.from({ length: boardSize * boardSize }, (_, idx) => {
              const r = Math.floor(idx / boardSize);
              const c = idx % boardSize;
              const isDarkCell = (r + c) % 2 === 1;
              const hasQueen = board[r] === c;
              const isActiveCell = activeRow === r && activeCol === c;
              const isConflictCell = conflict && (conflict[0] === r && conflict[1] === c || isActiveCell && conflict);

              let bgCls = isDarkCell ? "bg-slate-900/80" : "bg-slate-800/40";
              let borderCls = "border-transparent";

              if (isSolution) {
                bgCls = "bg-emerald-500/20";
                borderCls = "border-emerald-400";
              } else if (isConflictCell) {
                bgCls = "bg-rose-500/30 animate-pulse";
                borderCls = "border-rose-500";
              } else if (isActiveCell) {
                bgCls = "bg-amber-500/30";
                borderCls = "border-amber-400";
              } else if (hasQueen) {
                bgCls = "bg-violet-500/20";
                borderCls = "border-violet-500/40";
              }

              return (
                <div key={idx} className={`relative flex items-center justify-center rounded-lg border transition-all duration-150 ${bgCls} ${borderCls}`}>
                  {hasQueen && (
                    <Crown size={boardSize === 4 ? 26 : 18} className={isSolution ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "text-amber-400"} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 sm:gap-3 w-full px-1">
          <button onClick={() => { setStepIdx(0); setPlaying(false); }} className="flex-1 sm:flex-initial flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-3 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            <RotateCcw size={13} /> Reset
          </button>
          <button onClick={() => setStepIdx((p) => Math.max(0, p - 1))} className="flex-1 sm:flex-initial flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-4 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            ◀ Prev
          </button>
          <button onClick={() => setPlaying((p) => !p)} className="flex-[1.8] sm:flex-initial flex items-center justify-center gap-1.5 rounded-2xl px-4 sm:px-8 py-2 sm:py-3 font-mono text-xs sm:text-sm font-black text-black transition-all shadow-lg hover:scale-105 active:scale-95 shrink-0" style={{ backgroundColor: themeColor, boxShadow: `0 4px 24px ${themeColor}55` }}>
            {playing ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Play</>}
          </button>
          <button onClick={() => setStepIdx((p) => Math.min(steps.length - 1, p + 1))} className="flex-1 sm:flex-initial flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-4 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            Next ▶
          </button>
          <button onClick={() => { setStepIdx(steps.length - 1); setPlaying(false); }} className="flex-1 sm:flex-initial flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-900 px-2.5 sm:px-3 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition">
            <SkipForward size={13} /> End
          </button>
        </div>
      </div>
    </div>
  );
};

// LRU cache and doubly linked list

const DEFAULT_LRU_ITEMS = [
  { key: "A", val: 10 },
  { key: "B", val: 20 },
  { key: "C", val: 30 },
];

const LinkedListVisualizer = () => {
  const [lruCache, setLruCache] = useState(DEFAULT_LRU_ITEMS);
  const [capacity] = useState(4);
  const [keyInput, setKeyInput] = useState("");
  const [valInput, setValInput] = useState("");

  const [activeKey, setActiveKey] = useState(null);
  const [evictedKey, setEvictedKey] = useState(null);
  const [phaseMsg, setPhaseMsg] = useState("LRU Cache System initialized. Capacity = 4.");

  const handleGet = () => {
    const k = keyInput.trim().toUpperCase();
    if (!k) return;

    setEvictedKey(null);
    const existingIdx = lruCache.findIndex((it) => it.key === k);
    if (existingIdx !== -1) {
      const targetItem = lruCache[existingIdx];
      const updated = [targetItem, ...lruCache.filter((it) => it.key !== k)];
      setLruCache(updated);
      setActiveKey(k);
      setPhaseMsg(`🎯 GET('${k}'): Cache HIT! Value=${targetItem.val}. Promoted node to MRU (Head).`);
    } else {
      setActiveKey(k);
      setPhaseMsg(`❌ GET('${k}'): Cache MISS! Key '${k}' not found in Cache Map.`);
    }
    setKeyInput("");
  };

  const handlePut = () => {
    const k = keyInput.trim().toUpperCase();
    const v = Number(valInput) || Math.floor(Math.random() * 90) + 10;
    if (!k) return;

    setEvictedKey(null);
    const existingIdx = lruCache.findIndex((it) => it.key === k);

    if (existingIdx !== -1) {
      const updated = [{ key: k, val: v }, ...lruCache.filter((it) => it.key !== k)];
      setLruCache(updated);
      setActiveKey(k);
      setPhaseMsg(`🔄 PUT('${k}', ${v}): Updated existing key. Promoted node to MRU (Head).`);
    } else {
      let evicted = null;
      let nextList = [...lruCache];

      if (lruCache.length >= capacity) {
        evicted = nextList.pop();
        setEvictedKey(evicted.key);
      }

      nextList = [{ key: k, val: v }, ...nextList];
      setLruCache(nextList);
      setActiveKey(k);

      if (evicted) {
        setPhaseMsg(`⚠️ PUT('${k}', ${v}): Cache FULL! Evicted LRU Tail Node '${evicted.key}'. Inserted new MRU Head.`);
      } else {
        setPhaseMsg(`✅ PUT('${k}', ${v}): Inserted new node at MRU Head.`);
      }
    }

    setKeyInput("");
    setValInput("");
  };

  return (
    <div className="rounded-3xl border border-teal-500/20 bg-[#030d07] shadow-2xl overflow-hidden">
      <div className="relative p-4 sm:px-6 sm:py-5 border-b border-teal-500/15" style={{ background: "linear-gradient(135deg, #031412 0%, #030d07 60%, #010c0a 100%)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-teal-500/30 bg-teal-500/10 shrink-0">
              <Database className="text-teal-400" size={18} />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-xl font-black uppercase text-white tracking-wider">
                LRU Cache &amp; Doubly Linked List Lab
              </h2>
              <p className="font-mono text-[10px] text-slate-400">Least Recently Used Eviction &amp; Pointer Operations</p>
            </div>
          </div>

          <span className="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-mono font-bold text-teal-300 self-start sm:self-auto">
            Capacity: {lruCache.length} / {capacity} Nodes
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-7 space-y-5 sm:space-y-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border border-slate-800/80 bg-slate-950/50">
          <div className="flex flex-wrap items-center gap-2.5">
            <input
              type="text"
              maxLength={2}
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Key (e.g. D)"
              className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white font-mono font-bold outline-none focus:border-teal-500 w-28 uppercase"
            />
            <input
              type="number"
              value={valInput}
              onChange={(e) => setValInput(e.target.value)}
              placeholder="Val (e.g. 40)"
              className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white font-mono font-bold outline-none focus:border-teal-500 w-28"
            />

            <button
              onClick={handleGet}
              className="flex items-center gap-1 rounded-xl bg-teal-600 px-3.5 py-2 font-mono text-xs font-extrabold text-white hover:bg-teal-500 transition"
            >
              <Search size={13} /> GET(key)
            </button>
            <button
              onClick={handlePut}
              className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-2 font-mono text-xs font-extrabold text-white hover:bg-emerald-500 transition"
            >
              <Plus size={13} /> PUT(key, val)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-800/60 bg-slate-950/40 p-3 sm:px-4">
          <span className="h-2 w-2 rounded-full animate-pulse bg-teal-400 shrink-0" />
          <p className="font-mono text-xs text-slate-200 font-bold truncate">
            {phaseMsg}
          </p>
        </div>

        <div className="relative w-full overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-b from-[#021210] to-[#010807] p-4 sm:p-6 flex flex-col items-center justify-center min-h-[220px]">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center my-4">
            {lruCache.map((item, idx) => {
              const isHead = idx === 0;
              const isTail = idx === lruCache.length - 1;
              const isActive = activeKey === item.key;
              const isEvicted = evictedKey === item.key;

              let nodeBg = "bg-slate-900/60 border-slate-700 text-slate-200";
              if (isEvicted) nodeBg = "bg-rose-500/20 border-rose-500 text-rose-200 animate-pulse";
              else if (isActive) nodeBg = "bg-teal-500/30 border-teal-400 text-teal-100 shadow-[0_0_16px_rgba(20,184,166,0.5)]";

              return (
                <div key={item.key} className="flex items-center gap-2 sm:gap-4">
                  <div className={`relative flex flex-col items-center p-3.5 rounded-2xl border min-w-[90px] transition-all duration-300 ${nodeBg}`}>
                    <div className="flex items-center gap-1 mb-1">
                      {isHead && <span className="rounded px-1.5 py-0.5 text-[8px] font-black font-mono bg-emerald-500/30 text-emerald-300">MRU HEAD</span>}
                      {isTail && <span className="rounded px-1.5 py-0.5 text-[8px] font-black font-mono bg-cyan-500/30 text-cyan-300">LRU TAIL</span>}
                    </div>

                    <span className="font-mono text-base font-black text-white">{item.key}</span>
                    <span className="font-mono text-[10px] text-slate-400">val: {item.val}</span>
                  </div>

                  {idx < lruCache.length - 1 && (
                    <div className="flex flex-col items-center text-slate-500">
                      <ArrowLeftRight size={18} className="text-teal-400/70" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-2 font-mono text-[10px] text-slate-400 border-t border-slate-800/60 pt-3 w-full max-w-lg">
            <span className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> MRU (Most Recently Used)</span>
            <span className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-cyan-400" /> LRU (Least Recently Used)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main DSA Lab Page

const DsaLabPage = () => {
  return (
    <>
      <SeoHead
        title="Data Structure & Algorithm Lab | Nikhil Agrahari"
        description="Interactive Data Structure and Algorithm visualizers, sorting algorithm step-by-step visualizer with QuickSort, MergeSort, HeapSort, Dijkstra, BFS, DFS, AVL Trees, DP Grid, Binary Search, Sliding Window, N-Queens Backtracking, LRU Cache by Nikhil Agrahari."
        pathname="/experiments/dsa"
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Experiments", path: "/experiments" },
          { name: "Data Structure Lab", path: "/experiments/dsa" },
        ])}
      />

      <section className="section-wrap pt-4 sm:pt-6 pb-20">
        <FadeInUp>
          <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-10">
            <h1 className="font-display text-3xl sm:text-6xl lg:text-7xl font-black uppercase tracking-wider text-slate-900 dark:text-white drop-shadow-sm">
              DATA STRUCTURE &amp;{" "}
              <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                ALGORITHM LAB
              </span>
            </h1>
            <p className="mt-3 text-xs sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Interactive step-by-step algorithm visualizers for sorting, graph traversal, AVL Trees, Dynamic Programming, Two-Pointer sliding windows, N-Queens Backtracking, and LRU Cache.
            </p>
          </div>
        </FadeInUp>

        {/* Module 01: Sorting */}
        <FadeInUp delay={0.1}>
          <div className="mb-5 sm:mb-6">
            <div className="flex items-center gap-3 mb-1.5">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                // MODULE 01 — SORTING ALGORITHMS
              </span>
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                🟢 Live
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Sorting &amp; Space Complexity Visualizer
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
              QuickSort · MergeSort · HeapSort — step-by-step with memory pointer highlights and complexity analysis.
            </p>
          </div>

          <SortingVisualizer />
        </FadeInUp>

        {/* Module 02: Graphs */}
        <div className="cv-auto">
          <FadeInUp delay={0.2} className="mt-14 sm:mt-16">
            <div className="mb-5 sm:mb-6">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                  // MODULE 02 — GRAPH TRAVERSAL
                </span>
                <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300">
                  🟢 Live
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Graph Traversal &amp; Shortest Path Lab
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                Dijkstra · BFS · DFS — interactive node graph canvas with weighted distance tracking and queue/stack state.
              </p>
            </div>

            <GraphVisualizer />
          </FadeInUp>
        </div>

        {/* Module 03: Trees */}
        <div className="cv-auto">
          <FadeInUp delay={0.3} className="mt-14 sm:mt-16">
            <div className="mb-5 sm:mb-6">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                  // MODULE 03 — AVL &amp; BST TREES
                </span>
                <span className="rounded-full border border-violet-500/40 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-bold text-violet-300">
                  🟢 Live
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                BST &amp; AVL Self-Balancing Tree Lab
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                Binary Search Tree · AVL Rotations · In-Order, Pre-Order, Post-Order Traversals with interactive node insertion.
              </p>
            </div>

            <BstTreeVisualizer />
          </FadeInUp>
        </div>

        {/* Module 04: Dynamic Programming */}
        <div className="cv-auto">
          <FadeInUp delay={0.4} className="mt-14 sm:mt-16">
            <div className="mb-5 sm:mb-6">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-lime-600 dark:text-lime-400">
                  // MODULE 04 — DYNAMIC PROGRAMMING
                </span>
                <span className="rounded-full border border-lime-500/40 bg-lime-500/10 px-2.5 py-0.5 text-[10px] font-bold text-lime-300">
                  🟢 Live
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Dynamic Programming &amp; 2D Grid Lab
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                0/1 Knapsack · Longest Common Subsequence (LCS) — 2D matrix memoization table computation with backtracking path highlights.
              </p>
            </div>

            <DpGridVisualizer />
          </FadeInUp>
        </div>

        {/* Module 05: Two Pointers */}
        <div className="cv-auto">
          <FadeInUp delay={0.5} className="mt-14 sm:mt-16">
            <div className="mb-5 sm:mb-6">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  // MODULE 05 — TWO POINTERS &amp; WINDOW
                </span>
                <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                  🟢 Live
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Two-Pointer &amp; Sliding Window Lab
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                Binary Search · Sliding Window Subarray · Container With Most Water — pointer movement and window frame tracking.
              </p>
            </div>

            <TwoPointerVisualizer />
          </FadeInUp>
        </div>

        {/* Module 06: Backtracking */}
        <div className="cv-auto">
          <FadeInUp delay={0.6} className="mt-14 sm:mt-16">
            <div className="mb-5 sm:mb-6">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
                  // MODULE 06 — N-QUEENS BACKTRACKING
                </span>
                <span className="rounded-full border border-rose-500/40 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold text-rose-300">
                  🟢 Live
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Backtracking N-Queens Visualizer
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                N-Queens Chessboard Puzzle — recursive decision tree, attack conflict alert, and rewind backtracking state.
              </p>
            </div>

            <BacktrackingVisualizer />
          </FadeInUp>
        </div>

        {/* Module 07: LRU Cache */}
        <div className="cv-auto">
          <FadeInUp delay={0.7} className="mt-14 sm:mt-16">
            <div className="mb-5 sm:mb-6">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                  // MODULE 07 — LRU CACHE &amp; LINKED LIST
                </span>
                <span className="rounded-full border border-teal-500/40 bg-teal-500/10 px-2.5 py-0.5 text-[10px] font-bold text-teal-300">
                  🟢 Live
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                LRU Cache &amp; Doubly Linked List Lab
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                Least Recently Used Cache Eviction — Hash Map + Doubly Linked List node promotion (MRU Head) and tail eviction (LRU Tail).
              </p>
            </div>

            <LinkedListVisualizer />
          </FadeInUp>
        </div>
      </section>
    </>
  );
};

export default DsaLabPage;
