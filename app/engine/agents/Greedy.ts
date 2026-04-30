

type Node = {
  x: number;
  y: number;
  type?: string;
};

export class Greedy {
  private grid: Node[][];
  private start: Node;
  private goal: Node;
  private open: Node[];
  private visited: Set<string>;
  private cameFrom: Map<string, string>;

  constructor(grid: Node[][], start: Node, goal: Node) {
    this.grid = grid;
    this.start = start;
    this.goal = goal;
    this.open = [start];
    this.visited = new Set();
    this.cameFrom = new Map();
  }

  private key(n: Node) {
    return `${n.x}-${n.y}`;
  }

  private heuristic(a: Node, b: Node) {
    // Manhattan distance (fast + clean)
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  private getNeighbors(node: Node) {
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    const neighbors: Node[] = [];

    for (const [dx, dy] of dirs) {
      const nx = node.x + dx;
      const ny = node.y + dy;

      if (
        nx >= 0 &&
        ny >= 0 &&
        nx < this.grid.length &&
        ny < this.grid[0].length
      ) {
        const next = this.grid[nx][ny];
        if (next.type !== "wall") {
          neighbors.push(next);
        }
      }
    }

    return neighbors;
  }

  step(): Node | null {
    if (this.open.length === 0) return null;

    // pick node closest to goal (greedy)
    this.open.sort(
      (a, b) =>
        this.heuristic(a, this.goal) - this.heuristic(b, this.goal)
    );

    const current = this.open.shift()!;
    const key = this.key(current);

    if (this.visited.has(key)) {
      return this.step();
    }

    this.visited.add(key);

    if (current.x === this.goal.x && current.y === this.goal.y) {
      return null;
    }

    const neighbors = this.getNeighbors(current);

    for (const n of neighbors) {
      const nKey = this.key(n);
      if (!this.visited.has(nKey)) {
        this.open.push(n);
        if (!this.cameFrom.has(nKey)) {
          this.cameFrom.set(nKey, key);
        }
      }
    }

    return current;
  }

  getVisited() {
    return this.visited;
  }

  getPath(): Node[] {
    const path: Node[] = [];
    let currentKey = this.key(this.goal);

    while (this.cameFrom.has(currentKey)) {
      const [x, y] = currentKey.split("-").map(Number);
      path.push({ x, y });

      currentKey = this.cameFrom.get(currentKey)!;
    }

    return path.reverse();
  }
}