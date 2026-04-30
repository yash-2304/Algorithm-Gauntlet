"use client";

import { useEffect, useRef } from "react";

interface Props {
  logs: string[];
  steps?: { bfs: number; dijkstra: number; astar: number };
  winner?: string | null;
}

export default function AlgoExplanationPanel({ logs, steps, winner }: Props) {
  const safeSteps = steps ?? { bfs: 0, dijkstra: 0, astar: 0 };
  const safeWinner = winner ?? "-";
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to latest log ONLY if user is near the bottom
  useEffect(() => {
    const container = bottomRef.current?.parentElement;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 50;

    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const minSteps = Math.min(safeSteps.bfs, safeSteps.dijkstra, safeSteps.astar);

  const efficiencyWinner =
    minSteps === safeSteps.astar
      ? "A*"
      : minSteps === safeSteps.dijkstra
      ? "Dijkstra"
      : "BFS";

  return (
    <div className="w-full max-w-2xl mt-6 max-h-145 bg-black border border-gray-700 rounded-lg p-4 text-sm text-gray-200 overflow-y-auto ">
      <div className="font-bold text-green-400 mb-2">
        Algorithm Thinking
      </div>

      <div className="text-xs text-gray-400 mb-2">
        Winner (fastest): {safeWinner} | Most Efficient: {efficiencyWinner}
      </div>

      {logs.length === 0 ? (
        <div className="text-gray-500">No steps yet...</div>
      ) : (
        logs.map((log, index) => (
          <div key={index} className="mb-1">
            <span className="text-gray-500">[{index + 1}]</span> {log}
          </div>
        ))
      )}

      <div ref={bottomRef} />
    </div>
  );
}