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
  tilesToBuilding("square-n1", 36, 28, 41, 33, "#8b2e22", "#efe9db", "#2f2f2f"),
  tilesToBuilding("square-n2", 51, 28, 56, 33, "#b8973a", "#efe9db", "#3a3a3a"),
  tilesToBuilding("square-w", 29, 37, 33, 43, "#7a2a1f", "#efe9db", "#262626"),
  tilesToBuilding("square-e", 60, 37, 64, 43, "#dcd3b8", "#5a4a38", "#4a2a24"),
  tilesToBuilding("square-s", 41, 53, 47, 57, "#a8862e", "#efe9db", "#2f2f2f"),
  tilesToBuilding("farmhouse", 139, 37, 145, 43, "#8b3a28", "#efe9db", "#1f1f1f"),
  tilesToBuilding("barn", 157, 53, 165, 59, "#6e2a1c", "#e0d8c0", "#3a3a3a"),
];
