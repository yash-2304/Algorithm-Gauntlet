import { Grid, Node } from "../core/types";

export class DFS {
  private stack: Node[] = [];
  private visited = new Set<string>();
  private parent = new Map<string, string>();
  private path: Node[] = [];
  private grid: Grid;
  private goal: Node;
  private finished = false;

  constructor(grid: Grid, start: Node, goal: Node) {
    this.grid = grid;
    this.goal = goal;

    this.stack.push(start);
    this.visited.add(this.key(start));
    this.parent.set(this.key(start), "");
  }

  private key(node: Node) {
    return `${node.x}-${node.y}`;
  }

  step(): Node | null {
    if (this.stack.length === 0 || this.finished) return null;

    const current = this.stack.pop()!;

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

        if (
          neighbor.type !== "wall" &&
          !this.visited.has(this.key(neighbor))
        ) {
          this.stack.push(neighbor);
          this.visited.add(this.key(neighbor));
          this.parent.set(this.key(neighbor), this.key(current));
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
