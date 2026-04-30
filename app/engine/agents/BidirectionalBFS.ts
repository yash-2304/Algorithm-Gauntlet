

type Node = {
  x: number;
  y: number;
  type?: string;
};

export class BidirectionalBFS {
  private grid: Node[][];
  private start: Node;
  private goal: Node;

  private qStart: Node[] = [];
  private qGoal: Node[] = [];

  private visitedStart = new Set<string>();
  private visitedGoal = new Set<string>();

  private parentStart = new Map<string, string>();
  private parentGoal = new Map<string, string>();

  private meetKey: string | null = null;
  private finished = false;

  constructor(grid: Node[][], start: Node, goal: Node) {
    this.grid = grid;
    this.start = start;
    this.goal = goal;

    const sKey = this.key(start);
    const gKey = this.key(goal);

    this.qStart.push(start);
    this.qGoal.push(goal);

    this.visitedStart.add(sKey);
    this.visitedGoal.add(gKey);

    this.parentStart.set(sKey, "");
    this.parentGoal.set(gKey, "");
  }

  private key(n: Node) {
    return `${n.x}-${n.y}`;
  }

  private neighbors(node: Node): Node[] {
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    const out: Node[] = [];

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
        if (next.type !== "wall") out.push(next);
      }
    }

    return out;
  }

  private expandFront(
    queue: Node[],
    visitedThis: Set<string>,
    visitedOther: Set<string>,
    parentThis: Map<string, string>
  ): Node | null {
    if (queue.length === 0) return null;

    const current = queue.shift()!;
    const cKey = this.key(current);

    // If other side already visited this, we met
    if (visitedOther.has(cKey)) {
      this.meetKey = cKey;
      this.finished = true;
      return current;
    }

    for (const n of this.neighbors(current)) {
      const nKey = this.key(n);
      if (!visitedThis.has(nKey)) {
        visitedThis.add(nKey);
        parentThis.set(nKey, cKey);
        queue.push(n);
      }
    }

    return current;
  }

  step(): Node | null {
    if (this.finished) return null;

    // expand from start side
    const s = this.expandFront(
      this.qStart,
      this.visitedStart,
      this.visitedGoal,
      this.parentStart
    );
    if (this.finished) return s;

    // expand from goal side
    const g = this.expandFront(
      this.qGoal,
      this.visitedGoal,
      this.visitedStart,
      this.parentGoal
    );
    if (this.finished) return g;

    return s || g;
  }

  isFinished() {
    return this.finished;
  }

  getVisitedStart() {
    return this.visitedStart;
  }

  getVisitedGoal() {
    return this.visitedGoal;
  }

  getVisitedCombined() {
    return new Set([...this.visitedStart, ...this.visitedGoal]);
  }

  getPath(): Node[] {
    if (!this.meetKey) return [];

    const pathStart: string[] = [];
    let cur = this.meetKey;

    // backtrack to start
    while (cur) {
      pathStart.push(cur);
      cur = this.parentStart.get(cur) || "";
    }
    pathStart.reverse();

    const pathGoal: string[] = [];
    cur = this.meetKey;

    // forward to goal (using goal parents)
    while (cur) {
      cur = this.parentGoal.get(cur) || "";
      if (cur) pathGoal.push(cur);
    }

    const full = [...pathStart, ...pathGoal];

    return full.map((k) => {
      const [x, y] = k.split("-").map(Number);
      return this.grid[x][y];
    });
  }
}