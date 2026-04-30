"use client";

export default function RulesPanel() {
  return (
    <div className="bg-black border border-gray-700 rounded-xl p-4 mt-4 w-full max-w-[1000px] lg:max-w-[1000px] text-white">
      <h2 className="text-lg font-bold mb-3 text-yellow-400">
        How to Play (Algorithm Gauntlet)
      </h2>

      <ul className="space-y-2 text-sm text-gray-300">
        <li>Click on grid → Create WALL (blocks path)</li>
        <li className="text-xs text-gray-400 lg:hidden">
          On mobile: use the Wall/Mud toggle above the grid
        </li>
        <li>Right-click (desktop) / Use "Mud" toggle (mobile) → Create MUD (high cost terrain)</li>
        <li>Yellow path → Final chosen path</li>
        <li>Green → A* exploration</li>
        <li>Purple border → Dijkstra exploration</li>
        <li>Blue border → BFS exploration</li>
      </ul>

      <div className="mt-4 text-sm text-gray-400 space-y-2">
        <div><span className="text-white">Start BFS</span> → Blind exploration (shortest steps)</div>
        <div><span className="text-white">Start Dijkstra</span> → Cost-aware pathfinding</div>
        <div><span className="text-white">Start A*</span> → Smart + heuristic guided</div>
        <div>Race Mode → All algorithms compete</div>
        <div>Random Weights → Generates muddy terrain</div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Goal: Reach bottom-right cell using optimal strategy.
        <br />
        Winner = Fastest to reach goal (least iterations).
        <br />
        Efficiency = Least steps taken (cost-aware for Dijkstra & A*).
      </div>
    </div>
  );
}