export const TILE_SIZE = 48;

export type TileType =
  | "grass"
  | "forest_floor"
  | "cobble"
  | "path"
  | "sand"
  | "water"
  | "building"
  | "tree"
  | "bridge";

export const WALKABLE: Record<TileType, boolean> = {
  grass: true,
  forest_floor: true,
  cobble: true,
  path: true,
  sand: true,
  water: false,
  building: false,
  tree: false,
  bridge: true,
};

export interface RegionFill {
  type: TileType;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface RegionScatter {
  type: TileType;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  density: number;
  seed: number;
}

export type RegionLayer = { kind: "fill"; data: RegionFill } | { kind: "scatter"; data: RegionScatter };

export interface RegionDefinition {
  id: string;
  widthTiles: number;
  heightTiles: number;
  layers: RegionLayer[];
}
