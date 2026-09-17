import { TILE_SIZE } from "./types";

export interface BuildingDefinition {
  id: string;
  x: number;
  y: number;
  widthTiles: number;
  heightTiles: number;
  wallColor: string;
  trimColor: string;
  roofColor: string;
}

function tilesToBuilding(
  id: string,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  wallColor: string,
  trimColor: string,
  roofColor: string
): BuildingDefinition {
  return {
    id,
    x: x0 * TILE_SIZE,
    y: y0 * TILE_SIZE,
    widthTiles: x1 - x0,
    heightTiles: y1 - y0,
    wallColor,
    trimColor,
    roofColor,
  };
}

// Footprints must match the "building" fills in starting-area.ts exactly —
// those still drive collision/walkability. This file only adds how each
// footprint is illustrated.
export const BUILDINGS: BuildingDefinition[] = [
  tilesToBuilding("square-n1", 36, 27, 42, 33, "#8b2e22", "#efe9db", "#2f2f2f"),
  tilesToBuilding("square-n2", 50, 27, 56, 33, "#b8973a", "#efe9db", "#3a3a3a"),
  tilesToBuilding("square-w", 28, 36, 33, 44, "#7a2a1f", "#efe9db", "#262626"),
  tilesToBuilding("square-e", 59, 36, 64, 44, "#dcd3b8", "#5a4a38", "#4a2a24"),
  tilesToBuilding("square-s", 40, 53, 48, 58, "#a8862e", "#efe9db", "#2f2f2f"),
  tilesToBuilding("farmhouse", 138, 36, 146, 44, "#8b3a28", "#efe9db", "#1f1f1f"),
  tilesToBuilding("barn", 156, 52, 166, 60, "#6e2a1c", "#e0d8c0", "#3a3a3a"),
];
