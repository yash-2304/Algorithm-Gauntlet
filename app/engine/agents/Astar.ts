

import { Grid, Node } from "../core/types";

export class AStar {
  private grid: Grid;
  private goal: Node;

  private openSet: Node[] = [];
  private gScore = new Map<string, number>();
  private fScore = new Map<string, number>();
  private parent = new Map<string, string>();
  private visited = new Set<string>();

  private finished = false;
  private path: Node[] = [];

  constructor(grid: Grid, start: Node, goal: Node) {
    this.grid = grid;
    this.goal = goal;

    const startKey = this.key(start);
    this.openSet.push(start);
    this.gScore.set(startKey, 0);
    this.fScore.set(startKey, this.heuristic(start));
    this.parent.set(startKey, "");
  }

  private key(node: Node) {
    return `${node.x}-${node.y}`;
  }

  private heuristic(node: Node) {
    // Manhattan distance
    return Math.abs(node.x - this.goal.x) + Math.abs(node.y - this.goal.y);
  }

  step(): Node | null {
    if (this.openSet.length === 0 || this.finished) return null;

    // pick node with lowest fScore
    this.openSet.sort(
      (a, b) =>
        (this.fScore.get(this.key(a)) ?? Infinity) -
        (this.fScore.get(this.key(b)) ?? Infinity)
    );

    const current = this.openSet.shift()!;
    const currentKey = this.key(current);

    if (this.visited.has(currentKey)) {
      return this.step();
    }

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
        const tentativeG = (this.gScore.get(currentKey) ?? Infinity) + weight;

        if (tentativeG < (this.gScore.get(neighborKey) ?? Infinity)) {
          this.parent.set(neighborKey, currentKey);
          this.gScore.set(neighborKey, tentativeG);
          this.fScore.set(
            neighborKey,
            tentativeG + this.heuristic(neighbor)
          );
          this.openSet.push(neighbor);
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