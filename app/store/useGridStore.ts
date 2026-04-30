import { create } from "zustand";
import { Grid, Node } from "@/app/engine/core/types";

const ROWS = 20;
const COLS = 20;

function createEmptyGrid(): Grid {
  const grid: Grid = [];

  for (let i = 0; i < ROWS; i++) {
    const row: Node[] = [];
    for (let j = 0; j < COLS; j++) {
      row.push({
        x: i,
        y: j,
        type: "empty",
        weight: 1,
      });
    }
    grid.push(row);
  }

  return grid;
}

interface GridState {
  grid: Grid;
  visited: Set<string>;
  setVisited: (visited: Set<string>) => void;

  toggleWall: (x: number, y: number) => void;
  toggleMud: (x: number, y: number) => void;
  resetGrid: () => void;
}

export const useGridStore = create<GridState>((set) => ({
  grid: createEmptyGrid(),
  visited: new Set(),
  setVisited: (visited) => set({ visited }),

  toggleWall: (x, y) =>
    set((state) => {
      const newGrid = state.grid.map((row) => row.map((cell) => ({ ...cell })));

      const node = newGrid[x][y];
      node.type = node.type === "wall" ? "empty" : "wall";

      return { grid: newGrid };
    }),

  toggleMud: (x, y) =>
    set((state) => {
      const newGrid = state.grid.map((row) => row.map((cell) => ({ ...cell })));

      const node = newGrid[x][y];

      if (node.type === "wall") return { grid: newGrid }; // don't allow mud on walls

      if (node.weight === 1) {
        node.weight = 15;
        node.type = "mud";
      } else {
        node.weight = 1;
        node.type = "empty";
      }

      return { grid: newGrid };
    }),

  resetGrid: () => set({ grid: createEmptyGrid() }),
}));