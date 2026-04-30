"use client";

import { useGridStore } from "@/app/store/useGridStore";
import { useEffect, useRef, useState } from "react";
import { BFS } from "@/app/engine/agents/BFS";
import { Dijkstra } from "@/app/engine/agents/Dijkstra";
import { AStar } from "@/app/engine/agents/Astar";
import { DFS } from "@/app/engine/agents/DFS";
import { Greedy } from "@/app/engine/agents/Greedy";
import { BidirectionalBFS } from "@/app/engine/agents/BidirectionalBFS";
import AlgoExplanationPanel from "./AlgoExplanationPanel";
import RulesPanel from "./RulesPanel";

export default function GridCanvas() {
  const grid = useGridStore((state) => state.grid);
  const toggleWall = useGridStore((state) => state.toggleWall);
  const toggleMud = useGridStore((state) => state.toggleMud);
  const setVisited = useGridStore((state) => state.setVisited);
  const visited = useGridStore((state) => state.visited);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [speed, setSpeed] = useState(50);
  const [isPaused, setIsPaused] = useState(false);
  const bfsRef = useRef<BFS | null>(null);
  const [path, setPath] = useState<Set<string>>(new Set());
  const [visitedBFS, setVisitedBFS] = useState<Set<string>>(new Set());
  const [visitedDijkstra, setVisitedDijkstra] = useState<Set<string>>(new Set());
  const [visitedAStar, setVisitedAStar] = useState<Set<string>>(new Set());
  const [visitedDFS, setVisitedDFS] = useState<Set<string>>(new Set());
  const [visitedGreedy, setVisitedGreedy] = useState<Set<string>>(new Set());
  const [visitedBiStart, setVisitedBiStart] = useState<Set<string>>(new Set());
  const [visitedBiGoal, setVisitedBiGoal] = useState<Set<string>>(new Set());
  const startBidirectional = () => {
    setLogs([]);
    setPath(new Set());
    setVisitedBiStart(new Set());
    setVisitedBiGoal(new Set());
    setActiveAlgo("bidirectional");

    const start = grid[0][0];
    const goal = grid[grid.length - 1][grid[0].length - 1];

    const bi = new BidirectionalBFS(grid, start, goal);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (isPaused) return;
      const step = bi.step();

      if (step) {
        setLogs(prev => [...prev, `Bi-BFS expanding (${step.x}, ${step.y}) - dual front search`]);
      }

      if (!step) {
        if (intervalRef.current) clearInterval(intervalRef.current);

        const finalPath = bi.getPath();
        const pathSet = new Set(finalPath.map((n) => `${n.x}-${n.y}`));
        setPath(pathSet);
        return;
      }

      setVisitedBiStart(new Set(bi.getVisitedStart()));
      setVisitedBiGoal(new Set(bi.getVisitedGoal()));
    }, speed);
  };
  const startDFS = () => {
    setLogs([]);
    setPath(new Set());
    setVisitedDFS(new Set());
    setActiveAlgo("dfs");

    const start = grid[0][0];
    const goal = grid[grid.length - 1][grid[0].length - 1];

    const dfs = new DFS(grid, start, goal);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (isPaused) return;
      const step = dfs.step();

      if (step) {
        setLogs(prev => [...prev, `DFS diving (${step.x}, ${step.y}) - going deeper`]);
      }

      if (!step) {
        if (intervalRef.current) clearInterval(intervalRef.current);

        const finalPath = dfs.getPath();
        const pathSet = new Set(finalPath.map((n) => `${n.x}-${n.y}`));
        setPath(pathSet);

        return;
      }

      setVisitedDFS(new Set(dfs.getVisited()));
    }, speed);
  };

  const startGreedy = () => {
    setLogs([]);
    setPath(new Set());
    setVisitedGreedy(new Set());
    setActiveAlgo("greedy");

    const start = grid[0][0];
    const goal = grid[grid.length - 1][grid[0].length - 1];

    const greedy = new Greedy(grid, start, goal);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (isPaused) return;
      const step = greedy.step();

      if (step) {
        setLogs(prev => [...prev, `Greedy targeting (${step.x}, ${step.y}) - heuristic only`]);
      }

      if (!step) {
        if (intervalRef.current) clearInterval(intervalRef.current);

        const finalPath = greedy.getPath();
        const pathSet = new Set(finalPath.map((n) => `${n.x}-${n.y}`));
        setPath(pathSet);
        return;
      }

      setVisitedGreedy(new Set(greedy.getVisited()));
    }, speed);
  };
  const [winner, setWinner] = useState<string | null>(null);
  const [steps, setSteps] = useState({
    bfs: 0,
    dijkstra: 0,
    astar: 0,
    dfs: 0,
    greedy: 0,
    bidirectional: 0,
  });
  const [goalTimes, setGoalTimes] = useState<{
    bfs: number | null;
    dijkstra: number | null;
    astar: number | null;
    dfs: number | null;
    greedy: number | null;
    bidirectional: number | null;
  }>({
    bfs: null,
    dijkstra: null,
    astar: null,
    dfs: null,
    greedy: null,
    bidirectional: null,
  });
  const [costStats, setCostStats] = useState({
    bfs: 0,
    dijkstra: 0,
    astar: 0,
    dfs: 0,
    greedy: 0,
    bidirectional: 0,
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [drawMode, setDrawMode] = useState<"wall" | "mud">("wall");
  const [viewMode, setViewMode] = useState<"exploration" | "path" | "focused">("exploration");
  const [activeAlgo, setActiveAlgo] = useState<"bfs" | "dijkstra" | "astar" | "dfs" | "greedy" | "bidirectional" | "compare" | null>(null);
  const [compareAlgos, setCompareAlgos] = useState<string[]>([]);

  const algorithmInfo: Record<string, { title: string; description: string; whenToUse: string; complexity: string; strengths: string; weaknesses: string }> = {
    bfs: {
      title: "Breadth-First Search (BFS)",
      description: "BFS explores the grid level by level using a queue (FIFO). It guarantees the shortest path in an unweighted grid because it visits all nodes at distance k before moving to k+1.",
      whenToUse: "Use when all edges have equal weight and you need the shortest number of steps.",
      complexity: "Time: O(V + E), Space: O(V)",
      strengths: "Guarantees shortest path, simple logic, reliable for unweighted graphs.",
      weaknesses: "Slow on large grids, explores many unnecessary nodes."
    },
    dijkstra: {
      title: "Dijkstra's Algorithm",
      description: "Dijkstra expands the node with the lowest accumulated cost using a priority queue. It guarantees the minimum cost path even when weights vary.",
      whenToUse: "Use when grid has weights (like mud) and you need the optimal path.",
      complexity: "Time: O((V + E) log V), Space: O(V)",
      strengths: "Always finds lowest cost path, handles weighted graphs.",
      weaknesses: "Slower than A*, explores more nodes than necessary."
    },
    astar: {
      title: "A* Search",
      description: "A* combines actual cost (g) and heuristic estimate (h) to guide the search efficiently toward the goal. It balances speed and optimality.",
      whenToUse: "Use when you want fastest optimal pathfinding with a good heuristic.",
      complexity: "Time: O((V + E) log V), Space: O(V)",
      strengths: "Fast and optimal with good heuristic, explores fewer nodes.",
      weaknesses: "Depends heavily on heuristic quality."
    },
    dfs: {
      title: "Depth-First Search (DFS)",
      description: "DFS explores as deep as possible before backtracking using a stack (LIFO). It does not guarantee shortest or optimal paths.",
      whenToUse: "Use for exploring all paths or when memory is limited.",
      complexity: "Time: O(V + E), Space: O(V)",
      strengths: "Low memory in some cases, simple recursion-based logic.",
      weaknesses: "Can get stuck in deep paths, not optimal."
    },
    greedy: {
      title: "Greedy Best-First Search",
      description: "Greedy search selects the node closest to the goal using only heuristic (h). It ignores actual cost.",
      whenToUse: "Use when speed is more important than accuracy.",
      complexity: "Time: O(E), Space: O(V)",
      strengths: "Very fast, reaches goal quickly.",
      weaknesses: "Does not guarantee optimal path, can take bad routes."
    },
    bidirectional: {
      title: "Bidirectional BFS",
      description: "Runs BFS from both start and goal simultaneously. The search stops when the two frontiers meet.",
      whenToUse: "Use when both start and goal are known and graph is large.",
      complexity: "Time: O(V + E), but faster in practice, Space: O(V)",
      strengths: "Faster than BFS in many cases, reduces search space.",
      weaknesses: "More complex to implement, requires known goal."
    }
  };

  const getActiveInfo = () => {
    if (activeAlgo && activeAlgo !== "compare") return [activeAlgo];
    return compareAlgos;
  };
  const startCompare = () => {
    if (compareAlgos.length === 0) return;

    setLogs([]);
    setPath(new Set());
    setVisitedBFS(new Set());
    setVisitedDijkstra(new Set());
    setVisitedAStar(new Set());
    setVisitedDFS(new Set());
    setVisitedGreedy(new Set());
    setVisitedBiStart(new Set());
    setVisitedBiGoal(new Set());
    setActiveAlgo("compare");

    const start = grid[0][0];
    const goal = grid[grid.length - 1][grid[0].length - 1];

    const agents: any = {};
    if (compareAlgos.includes("bfs")) agents.bfs = new BFS(grid, start, goal);
    if (compareAlgos.includes("dijkstra")) agents.dijkstra = new Dijkstra(grid, start, goal);
    if (compareAlgos.includes("astar")) agents.astar = new AStar(grid, start, goal);
    if (compareAlgos.includes("dfs")) agents.dfs = new DFS(grid, start, goal);
    if (compareAlgos.includes("greedy")) agents.greedy = new Greedy(grid, start, goal);
    if (compareAlgos.includes("bidirectional")) agents.bidirectional = new BidirectionalBFS(grid, start, goal);

    // Step tracking variables for compare
    let stepCounts: any = {};
    let goalHits: any = {};

    compareAlgos.forEach(algo => {
      stepCounts[algo] = 0;
      goalHits[algo] = null;
    });

    // Cost tracking for compare
    let costCounts: any = {};
    compareAlgos.forEach(algo => {
      costCounts[algo] = 0;
    });

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (isPaused) return;
      let running = false;

      Object.keys(agents).forEach((key) => {
        const step = agents[key].step();

        if (step && goalHits[key] === null) {
          stepCounts[key]++;
          running = true;
        }

        // Cost calculation
        if (step && goalHits[key] === null) {
          const nodeType = grid[step.x][step.y].type;
          const cost = nodeType === "mud" ? 5 : 1;
          costCounts[key] += cost;
        }

        if (step) {
          setLogs(prev => [
            ...prev,
            `${key.toUpperCase()} visiting (${step.x}, ${step.y})`
          ]);
        }

        if (step && step.x === goal.x && step.y === goal.y && goalHits[key] === null) {
          goalHits[key] = stepCounts[key];
        }
      });

      if (!running) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      // update global stats (reusing existing UI)
      setSteps({
        bfs: compareAlgos.includes("bfs") ? stepCounts.bfs ?? 0 : 0,
        dijkstra: compareAlgos.includes("dijkstra") ? stepCounts.dijkstra ?? 0 : 0,
        astar: compareAlgos.includes("astar") ? stepCounts.astar ?? 0 : 0,
        dfs: compareAlgos.includes("dfs") ? stepCounts.dfs ?? 0 : 0,
        greedy: compareAlgos.includes("greedy") ? stepCounts.greedy ?? 0 : 0,
        bidirectional: compareAlgos.includes("bidirectional") ? stepCounts.bidirectional ?? 0 : 0,
      });

      setGoalTimes({
        bfs: compareAlgos.includes("bfs") ? goalHits.bfs ?? null : null,
        dijkstra: compareAlgos.includes("dijkstra") ? goalHits.dijkstra ?? null : null,
        astar: compareAlgos.includes("astar") ? goalHits.astar ?? null : null,
        dfs: compareAlgos.includes("dfs") ? goalHits.dfs ?? null : null,
        greedy: compareAlgos.includes("greedy") ? goalHits.greedy ?? null : null,
        bidirectional: compareAlgos.includes("bidirectional") ? goalHits.bidirectional ?? null : null,
      });

      setCostStats({
        bfs: costCounts.bfs ?? 0,
        dijkstra: costCounts.dijkstra ?? 0,
        astar: costCounts.astar ?? 0,
        dfs: costCounts.dfs ?? 0,
        greedy: costCounts.greedy ?? 0,
        bidirectional: costCounts.bidirectional ?? 0,
      });

      const finished = Object.entries(goalHits)
        .filter(([_, v]) => v !== null) as [string, number][];

      if (finished.length > 0) {
        const fastest = [...finished].sort((a, b) => a[1] - b[1])[0];
        const cheapest = (Object.entries(costCounts) as [string, number][])
          .filter(([k]) => compareAlgos.includes(k))
          .sort((a, b) => a[1] - b[1])[0];
        setWinner(`${fastest[0].toUpperCase()} (fastest) | ${cheapest[0].toUpperCase()} (efficient)`);
      }

      // visited updates (keep existing)
      if (agents.bfs) setVisitedBFS(new Set(agents.bfs.getVisited()));
      if (agents.dijkstra) setVisitedDijkstra(new Set(agents.dijkstra.getVisited()));
      if (agents.astar) setVisitedAStar(new Set(agents.astar.getVisited()));
      if (agents.dfs) setVisitedDFS(new Set(agents.dfs.getVisited()));
      if (agents.greedy) setVisitedGreedy(new Set(agents.greedy.getVisited()));
      if (agents.bidirectional) {
        setVisitedBiStart(new Set(agents.bidirectional.getVisitedStart()));
        setVisitedBiGoal(new Set(agents.bidirectional.getVisitedGoal()));
      }
    }, speed);
  };

  const randomizeWeights = () => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (Math.random() < 0.3) {
          toggleMud(i, j);
        }
      }
    }
  };

  const startRace = () => {
    setLogs([]);
    setVisitedBFS(new Set());
    setVisitedDijkstra(new Set());
    setVisitedAStar(new Set());
    setPath(new Set());
    setWinner(null);
    setSteps({ bfs: 0, dijkstra: 0, astar: 0 });
    setGoalTimes({ bfs: null, dijkstra: null, astar: null });

    const start = grid[0][0];
    const goal = grid[grid.length - 1][grid[0].length - 1];

    const bfs = new BFS(grid, start, goal);
    const dijkstra = new Dijkstra(grid, start, goal);
    const astar = new AStar(grid, start, goal);

    let bfsCount = 0;
    let dijCount = 0;
    let astarCount = 0;

    let bfsGoal: number | null = null;
    let dijGoal: number | null = null;
    let astarGoal: number | null = null;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (isPaused) return;
      const bfsStep = bfs.step();
      const dijStep = dijkstra.step();
      const astarStep = astar.step();

      // Only count steps until each algo reaches goal
      if (bfsStep && bfsGoal === null) bfsCount++;
      if (dijStep && dijGoal === null) dijCount++;
      if (astarStep && astarGoal === null) astarCount++;

      setSteps({
        bfs: bfsGoal ?? bfsCount,
        dijkstra: dijGoal ?? dijCount,
        astar: astarGoal ?? astarCount,
      });

      if (bfsStep) {
        setLogs(prev => [...prev, `BFS exploring (${bfsStep.x}, ${bfsStep.y}) - expanding neighbors`]);
      }
      if (dijStep) {
        setLogs(prev => [...prev, `Dijkstra picked (${dijStep.x}, ${dijStep.y}) - lowest cost so far`]);
      }
      if (astarStep) {
        setLogs(prev => [...prev, `A* targeting (${astarStep.x}, ${astarStep.y}) - guided by heuristic`]);
      }

      // Track first time each algorithm reaches goal
      if (astarStep && astarStep.x === goal.x && astarStep.y === goal.y && astarGoal === null) {
        astarGoal = astarCount;
      }
      if (dijStep && dijStep.x === goal.x && dijStep.y === goal.y && dijGoal === null) {
        dijGoal = dijCount;
      }
      if (bfsStep && bfsStep.x === goal.x && bfsStep.y === goal.y && bfsGoal === null) {
        bfsGoal = bfsCount;
      }

      setGoalTimes({ bfs: bfsGoal, dijkstra: dijGoal, astar: astarGoal });

      // Winner = whoever reached goal first (based on local counters)
      if (!winner) {
        const a = astarGoal ?? Infinity;
        const d = dijGoal ?? Infinity;
        const b = bfsGoal ?? Infinity;

        const min = Math.min(a, d, b);

        if (min !== Infinity) {
          if (min === a) setWinner("A*");
          else if (min === d) setWinner("Dijkstra");
          else setWinner("BFS");
        }
      }

      if (!bfsStep && !dijStep && !astarStep) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      setVisitedBFS(new Set(bfs.getVisited()));
      setVisitedDijkstra(new Set(dijkstra.getVisited()));
      setVisitedAStar(new Set(astar.getVisited()));
    }, speed);
  };

  const startBFS = () => {
    setLogs([]);
    setPath(new Set());
    setVisitedBFS(new Set());
    setActiveAlgo("bfs");

    const start = grid[0][0];
    const goal = grid[grid.length - 1][grid[0].length - 1];

    const bfs = new BFS(grid, start, goal);
    bfsRef.current = bfs;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (isPaused) return;
      const step = bfs.step();

      if (step) {
        setLogs(prev => [...prev, `BFS visiting (${step.x}, ${step.y}) - level expansion`]);
      }

      if (!step) {
        if (intervalRef.current) clearInterval(intervalRef.current);

        const finalPath = bfs.getPath();
        const pathSet = new Set(finalPath.map((n) => `${n.x}-${n.y}`));
        setPath(pathSet);

        return;
      }

      setVisitedBFS(new Set(bfs.getVisited()));
    }, speed);
  };

  const startDijkstra = () => {
    setLogs([]);
    setPath(new Set());
    setVisitedDijkstra(new Set());
    setActiveAlgo("dijkstra");

    const start = grid[0][0];
    const goal = grid[grid.length - 1][grid[0].length - 1];

    const dijkstra = new Dijkstra(grid, start, goal);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (isPaused) return;
      const step = dijkstra.step();

      if (step) {
        setLogs(prev => [...prev, `Dijkstra visiting (${step.x}, ${step.y}) - updating shortest cost`]);
      }

      if (!step) {
        if (intervalRef.current) clearInterval(intervalRef.current);

        const finalPath = dijkstra.getPath();
        const pathSet = new Set(finalPath.map((n) => `${n.x}-${n.y}`));
        setPath(pathSet);

        return;
      }

      setVisitedDijkstra(new Set(dijkstra.getVisited()));
    }, speed);
  };

  const startAStar = () => {
    setLogs([]);
    setVisitedAStar(new Set());
    setPath(new Set());
    setActiveAlgo("astar");

    const start = grid[0][0];
    const goal = grid[grid.length - 1][grid[0].length - 1];

    const astar = new AStar(grid, start, goal);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (isPaused) return;
      const step = astar.step();

      if (step) {
        setLogs(prev => [...prev, `A* visiting (${step.x}, ${step.y}) - f(n) = g + h`]);
      }

      if (!step) {
        if (intervalRef.current) clearInterval(intervalRef.current);

        const finalPath = astar.getPath();
        const pathSet = new Set(finalPath.map((n) => `${n.x}-${n.y}`));
        setPath(pathSet);

        return;
      }

      setVisitedAStar(new Set(astar.getVisited()));
    }, speed);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full px-2 bg-black min-h-screen">
      <div className="flex flex-wrap mt-6 justify-center gap-3 px-2">
        <div className="flex flex-wrap gap-2 justify-center w-full mb-2">
          {["bfs","dijkstra","astar","dfs","greedy","bidirectional"].map((algo) => (
            <button
              key={algo}
              onClick={() => {
                setCompareAlgos(prev => {
                  if (prev.includes(algo)) return prev.filter(a => a !== algo);
                  if (prev.length >= 3) return prev;
                  return [...prev, algo];
                });
              }}
              className={`px-3 py-1 rounded-md text-xs border ${
                compareAlgos.includes(algo)
                  ? "bg-white/10 border-white/30 text-white"
                  : "border-white/10 text-white/50"
              }`}
            >
              {algo.toUpperCase()}
            </button>
          ))}
          <button
            onClick={startCompare}
            className="px-4 py-1 rounded-md text-xs border border-green-400/40 text-green-300 hover:bg-green-500/20"
          >
            Start Compare
          </button>
        </div>
        <button
          onClick={startBidirectional}
          className="px-5 py-2.5 rounded-lg border border-indigo-400/40 bg-indigo-500/10 text-indigo-300 backdrop-blur-md shadow-sm transition-all duration-200 hover:bg-indigo-500/20 hover:shadow-[0_0_12px_rgba(99,102,241,0.4)] active:scale-95 font-medium"
        >
          Start Bi-BFS
        </button>
        <button
          onClick={startBFS}
          className="px-5 py-2.5 rounded-lg border border-blue-400/40 bg-blue-500/10 text-blue-300 backdrop-blur-md shadow-sm transition-all duration-200 hover:bg-blue-500/20 hover:shadow-[0_0_12px_rgba(59,130,246,0.4)] active:scale-95 font-medium"
        >
          Start BFS
        </button>

        <button
          onClick={startDijkstra}
          className="px-5 py-2.5 rounded-lg border border-purple-400/40 bg-purple-500/10 text-purple-300 backdrop-blur-md shadow-sm transition-all duration-200 hover:bg-purple-500/20 hover:shadow-[0_0_12px_rgba(168,85,247,0.4)] active:scale-95 font-medium"
        >
          Start Dijkstra
        </button>

        <button
          onClick={startAStar}
          className="px-5 py-2.5 rounded-lg border border-green-400/40 bg-green-500/10 text-green-300 backdrop-blur-md shadow-sm transition-all duration-200 hover:bg-green-500/20 hover:shadow-[0_0_12px_rgba(34,197,94,0.4)] active:scale-95 font-medium"
        >
          Start A*
        </button>
        <button
          onClick={startDFS}
          className="px-5 py-2.5 rounded-lg border border-cyan-400/40 bg-cyan-500/10 text-cyan-300 backdrop-blur-md shadow-sm transition-all duration-200 hover:bg-cyan-500/20 hover:shadow-[0_0_12px_rgba(34,211,238,0.4)] active:scale-95 font-medium"
        >
          Start DFS
        </button>
        <button
          onClick={startGreedy}
          className="px-5 py-2.5 rounded-lg border border-pink-400/40 bg-pink-500/10 text-pink-300 backdrop-blur-md shadow-sm transition-all duration-200 hover:bg-pink-500/20 hover:shadow-[0_0_12px_rgba(236,72,153,0.4)] active:scale-95 font-medium"
        >
          Start Greedy
        </button>
        <button
          onClick={randomizeWeights}
          className="px-5 py-2.5 rounded-lg border border-yellow-400/40 bg-yellow-500/10 text-yellow-300 backdrop-blur-md shadow-sm transition-all duration-200 hover:bg-yellow-500/20 hover:shadow-[0_0_12px_rgba(234,179,8,0.4)] active:scale-95 font-medium"
        >
          Random Weights
        </button>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => setViewMode("exploration")}
          className={`px-3 py-1 rounded-md text-sm border ${viewMode === "exploration" ? "bg-white/10 border-white/30" : "border-white/10 text-white/60"}`}
        >
          Exploration
        </button>
        <button
          onClick={() => setViewMode("path")}
          className={`px-3 py-1 rounded-md text-sm border ${viewMode === "path" ? "bg-white/10 border-white/30" : "border-white/10 text-white/60"}`}
        >
          Path
        </button>
        <button
          onClick={() => setViewMode("focused")}
          className={`px-3 py-1 rounded-md text-sm border ${viewMode === "focused" ? "bg-white/10 border-white/30" : "border-white/10 text-white/60"}`}
        >
          Focus
        </button>
      </div>
      <div className="flex gap-2 justify-center lg:hidden">
        <button
          onClick={() => setDrawMode("wall")}
          className={`px-3 py-1 rounded ${drawMode === "wall" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"}`}
        >
          Wall
        </button>
        <button
          onClick={() => setDrawMode("mud")}
          className={`px-3 py-1 rounded ${drawMode === "mud" ? "bg-orange-600 text-white" : "bg-gray-700 text-gray-200"}`}
        >
          Mud
        </button>
      </div>

      {winner && (
        <div className="text-white text-lg font-bold bg-gray-900 rounded-lg shadow-md border border-gray-800/50 px-4 py-2">
          Winner: {winner} | Comparing: {compareAlgos.map(a => a.toUpperCase()).join(", ")}
        </div>
      )}

      <div className="text-sm text-gray-300 flex flex-col bg-gray-900 rounded-lg shadow-md border border-gray-800/50 px-4 py-3 w-full max-w-4xl">
        {/* STEPS */}
        <div className="flex flex-wrap justify-between items-center gap-3 pb-2">
          <span className="text-blue-400">BFS: {steps.bfs}</span>
          <span className="text-purple-400">Dijkstra: {steps.dijkstra}</span>
          <span className="text-green-400">A*: {steps.astar}</span>
          <span className="text-cyan-400">DFS: {steps.dfs}</span>
          <span className="text-pink-400">Greedy: {steps.greedy}</span>
          <span className="text-indigo-400">Bi-BFS: {steps.bidirectional}</span>
        </div>

        {/* divider */}
        <div className="border-t border-white/10 my-2"></div>

        {/* GOALS */}
        <div className="flex flex-wrap justify-between items-center gap-3 pb-2 text-xs">
          <span className="text-blue-300">BFS Goal: {goalTimes.bfs ?? "-"}</span>
          <span className="text-purple-300">Dijkstra Goal: {goalTimes.dijkstra ?? "-"}</span>
          <span className="text-green-300">A* Goal: {goalTimes.astar ?? "-"}</span>
          <span className="text-cyan-300">DFS Goal: {goalTimes.dfs ?? "-"}</span>
          <span className="text-pink-300">Greedy Goal: {goalTimes.greedy ?? "-"}</span>
          <span className="text-indigo-300">Bi-BFS Goal: {goalTimes.bidirectional ?? "-"}</span>
        </div>

        {/* divider */}
        <div className="border-t border-white/10 my-2"></div>

        {/* COST */}
        <div className="flex flex-wrap justify-between items-center gap-3 text-xs">
          <span className="text-blue-200">BFS Cost: {costStats.bfs}</span>
          <span className="text-purple-200">Dijkstra Cost: {costStats.dijkstra}</span>
          <span className="text-green-200">A* Cost: {costStats.astar}</span>
          <span className="text-cyan-200">DFS Cost: {costStats.dfs}</span>
          <span className="text-pink-200">Greedy Cost: {costStats.greedy}</span>
          <span className="text-indigo-200">Bi-BFS Cost: {costStats.bidirectional}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto items-stretch justify-center gap-1 lg:gap-2">
        {/* LEFT PANEL */}
        <div className="w-full lg:w-[300px] flex order-2 lg:order-none">
          <div className="flex-1 h-fit max-h-[250px] lg:max-h-none overflow-y-auto flex flex-col bg-gray-900 rounded-lg shadow-md border border-gray-800/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition">
            <div className="flex-1">
              <RulesPanel />
            </div>
          </div>
        </div>

        {/* GRID CENTER */}
        <div className="flex-1 flex items-center justify-center order-1 lg:order-none w-full overflow-hidden">
          <div
            className="grid gap-[3px] w-full max-w-full overflow-x-auto overflow-y-hidden bg-[#0f172a]/80 backdrop-blur-md p-3 rounded-2xl border border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative before:absolute before:inset-0 before:bg-blue-500/5 before:blur-2xl before:pointer-events-none transition"
            style={{
              gridTemplateColumns: `repeat(${grid[0].length}, minmax(14px, 1fr))`,
            }}
          >
            {grid.map((row, i) =>
              row.map((node, j) => {
                const key = `${i}-${j}`;
                const isVisited = visited.has(key);
                const isPath = path.has(key);
                // --- cellClass logic start ---
                let cellClass = "";

                // Bi-BFS exploration mode highlight (must be first in exploration mode)
                if (viewMode === "exploration") {
                  if (activeAlgo === "compare") {
                    if (node.type === "wall") {
                      cellClass = "bg-[#1f2937]";
                    } else if (node.type === "mud") {
                      cellClass = "bg-orange-500/80";
                    } else if (visitedBiStart.has(key)) cellClass = "bg-indigo-400";
                    else if (visitedBiGoal.has(key)) cellClass = "bg-teal-400";
                    else if (visitedGreedy.has(key)) cellClass = "bg-pink-400";
                    else if (visitedDFS.has(key)) cellClass = "bg-cyan-400";
                    else if (visitedAStar.has(key)) cellClass = "bg-green-500";
                    else if (visitedDijkstra.has(key)) cellClass = "bg-purple-500";
                    else if (visitedBFS.has(key)) cellClass = "bg-blue-500";
                    else cellClass = "bg-[#e5e7eb]";
                  } else {
                    if (visitedBiStart.has(key)) {
                      cellClass = "bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.6)]";
                    } else if (visitedBiGoal.has(key)) {
                      cellClass = "bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.6)]";
                    }
                  }
                }

                if (!cellClass) {
                  if (node.type === "wall") {
                    cellClass = "bg-[#1f2937]";
                  } else if (node.type === "mud") {
                    cellClass = "bg-orange-500/80";
                  } else if (isPath && viewMode === "path") {
                    cellClass = "bg-yellow-300/90";
                  } else if (viewMode === "focused") {
                    // Bi-BFS focused mode highlight (top priority)
                    if (activeAlgo === "bidirectional") {
                      if (visitedBiStart.has(key)) {
                        cellClass = "bg-indigo-400 animate-pulse shadow-[0_0_18px_rgba(99,102,241,0.7)]";
                      } else if (visitedBiGoal.has(key)) {
                        cellClass = "bg-teal-400 animate-pulse shadow-[0_0_18px_rgba(45,212,191,0.7)]";
                      } else {
                        cellClass = "bg-[#e5e7eb]/20";
                      }
                    } else if (activeAlgo === "greedy" && visitedGreedy.has(key)) {
                      cellClass = "bg-pink-400 animate-pulse shadow-[0_0_20px_rgba(236,72,153,0.8),0_0_35px_rgba(236,72,153,0.4)]";
                    } else if (activeAlgo === "astar" && visitedAStar.has(key)) {
                      cellClass = "bg-green-500 animate-pulse shadow-[0_0_18px_rgba(34,197,94,0.8),0_0_30px_rgba(34,197,94,0.4)]";
                    } else if (activeAlgo === "dijkstra" && visitedDijkstra.has(key)) {
                      cellClass = "bg-purple-500 animate-pulse shadow-[0_0_18px_rgba(168,85,247,0.8),0_0_30px_rgba(168,85,247,0.4)]";
                    } else if (activeAlgo === "dfs" && visitedDFS.has(key)) {
                      cellClass = "bg-cyan-400 animate-pulse shadow-[0_0_20px_rgba(34,211,238,0.8),0_0_35px_rgba(34,211,238,0.4)]";
                    } else if (activeAlgo === "bfs" && visitedBFS.has(key)) {
                      cellClass = "bg-blue-500 animate-pulse shadow-[0_0_18px_rgba(59,130,246,0.8),0_0_30px_rgba(59,130,246,0.4)]";
                    } else {
                      cellClass = "bg-[#e5e7eb]/20";
                    }
                  } else if (viewMode === "exploration") {
                    if (activeAlgo === "greedy" && visitedGreedy.has(key)) {
                      cellClass = "bg-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.6)]";
                    } else if (activeAlgo === "dfs" && visitedDFS.has(key)) {
                      cellClass = "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]";
                    } else if (activeAlgo === "astar" && visitedAStar.has(key)) {
                      cellClass = "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]";
                    } else if (activeAlgo === "dijkstra" && visitedDijkstra.has(key)) {
                      cellClass = "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]";
                    } else if (activeAlgo === "bfs" && visitedBFS.has(key)) {
                      cellClass = "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]";
                    } else if (activeAlgo === "bidirectional") {
                      // handled above already, fallback
                      cellClass = cellClass || "bg-[#e5e7eb]";
                    } else {
                      cellClass = "bg-[#e5e7eb]";
                    }
                  } else {
                    cellClass = "bg-[#e5e7eb]";
                  }
                }
                // close exploration compare branch
                if (viewMode === "exploration" && activeAlgo === "compare") {
                }
                // --- cellClass logic end ---
                return (
                  <div
                    key={key}
                    onClick={() => {
                      if (drawMode === "wall") toggleWall(i, j);
                      else toggleMud(i, j);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      toggleMud(i, j);
                    }}
                    className={`aspect-square w-full max-w-[24px] cursor-pointer transition-all duration-300 rounded-[6px] ${cellClass} hover:scale-[1.05] hover:shadow-[0_0_10px_rgba(255,255,255,0.15)]`}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full lg:w-[300px] flex order-3 lg:order-none">
          <div className="flex-1 h-fit max-h-[250px] lg:max-h-none overflow-y-auto flex flex-col bg-gray-900 rounded-lg shadow-md border border-gray-800/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition">
            <div className="flex-1">
              <AlgoExplanationPanel logs={logs} steps={steps} winner={winner} compareAlgos={compareAlgos} />
            </div>
          </div>
        </div>
      </div>
      {/* ALGORITHM INFO PANEL */}
      <div className="w-full max-w-5xl mt-6 bg-gray-900 border border-gray-800/50 rounded-lg p-4 text-gray-300">
        <h2 className="text-lg font-semibold text-white mb-3">Algorithm Insights</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {getActiveInfo().map((algo) => {
            const info = algorithmInfo[algo];
            if (!info) return null;

            return (
              <div key={algo} className="bg-black/40 border border-white/10 rounded-md p-3">
                <h3 className="text-white font-medium mb-1">{info.title}</h3>
                <p className="text-sm text-gray-400 mb-2">{info.description}</p>
                <p className="text-xs text-gray-500">
                  <span className="text-gray-300 font-medium">When to use:</span> {info.whenToUse}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="text-gray-300 font-medium">Complexity:</span> {info.complexity}
                </p>
                <p className="text-xs text-green-400 mt-1">
                  <span className="font-medium">Strengths:</span> {info.strengths}
                </p>
                <p className="text-xs text-red-400 mt-1">
                  <span className="font-medium">Weaknesses:</span> {info.weaknesses}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
