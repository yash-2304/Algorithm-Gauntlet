

export type Node = {
  x: number;
  y: number;
  type: string;
  weight?: number;
};

export type Grid = Node[][];