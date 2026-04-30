

"use client";

import React from "react";

type Props = {
  bfsQueue?: string[];
  dijkstraPQ?: string[];
  astarOpen?: string[];
};

export default function AlgoStatePanel({
  bfsQueue = [],
  dijkstraPQ = [],
  astarOpen = [],
}: Props) {
  return (
    <div className="bg-black border border-gray-700 rounded-xl p-4 mt-4 w-full max-w-xl text-white">
      <h2 className="text-lg font-bold mb-3 text-green-400">
        Algorithm State (Live)
      </h2>

      <div className="space-y-3 text-sm">
        <div>
          <span className="text-blue-400 font-semibold">BFS Queue:</span>
          <div className="text-gray-300">
            {bfsQueue.length ? bfsQueue.join(" → ") : "Empty"}
          </div>
        </div>

        <div>
          <span className="text-purple-400 font-semibold">
            Dijkstra PQ:
          </span>
          <div className="text-gray-300">
            {dijkstraPQ.length ? dijkstraPQ.join(" → ") : "Empty"}
          </div>
        </div>

        <div>
          <span className="text-green-400 font-semibold">
            A* Open Set:
          </span>
          <div className="text-gray-300">
            {astarOpen.length ? astarOpen.join(" → ") : "Empty"}
          </div>
        </div>
      </div>
    </div>
  );
}