import { Grid, Node } from "../core/types";

export class Dijkstra {
  private grid: Grid;
  private goal: Node;

  private distances = new Map<string, number>();
  private parent = new Map<string, string>();
  private visited = new Set<string>();

  private queue: Node[] = [];
  private finished = false;
  private path: Node[] = [];

  constructor(grid: Grid, start: Node, goal: Node) {
    this.grid = grid;
    this.goal = goal;

    const startKey = this.key(start);
    this.distances.set(startKey, 0);
    this.queue.push(start);
    this.parent.set(startKey, "");
  }

  private key(node: Node) {
    return `${node.x}-${node.y}`;
  }

  step(): Node | null {
    if (this.queue.length === 0 || this.finished) return null;

    let current: Node | undefined;
    let currentKey = "";

    // keep pulling from queue until we find an unvisited node
    while (this.queue.length > 0) {
      this.queue.sort(
        (a, b) =>
          (this.distances.get(this.key(a)) ?? Infinity) -
          (this.distances.get(this.key(b)) ?? Infinity)
      );

      const node = this.queue.shift()!;
      const key = this.key(node);

      if (!this.visited.has(key)) {
        current = node;
        currentKey = key;
        break;
      }
    }

    if (!current) return null;

    this.visited.add(currentKey);

    if (current.x === this.goal.x && current.y === this.goal.y) {
      this.finished = true;
      this.buildPath(current);
      return current;
    }

    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    for (const [dx, dy] of directions) {
      const nx = current.x + dx;
      const ny = current.y + dy;

      if (
        nx >= 0 &&
        ny >= 0 &&
        nx < this.grid.length &&
        ny < this.grid[0].length
      ) {
        const neighbor = this.grid[nx][ny];
        const neighborKey = this.key(neighbor);

        if (neighbor.type === "wall") continue;

        const weight = neighbor.weight || 1;
        const newDist =
          (this.distances.get(currentKey) ?? Infinity) + weight;

        if (newDist < (this.distances.get(neighborKey) ?? Infinity)) {
          this.distances.set(neighborKey, newDist);
          this.parent.set(neighborKey, currentKey);
          this.queue.push(neighbor);
        }
      }
    }

    return current;
  }

  isFinished() {
    return this.finished;
  }

  getVisited() {
    return this.visited;
  }

  getPath() {
    return this.path;
  }

  private buildPath(node: Node) {
    let currentKey = this.key(node);

    while (currentKey) {
      const [x, y] = currentKey.split("-").map(Number);
      this.path.push(this.grid[x][y]);
      currentKey = this.parent.get(currentKey) || "";
    }

    this.path.reverse();
  }
}