import { TILE_SIZE } from "./types";

export type DecorationType = "well" | "lamppost" | "bench";

export interface DecorationDefinition {
  id: string;
  type: DecorationType;
  x: number;
  y: number;
  rotated?: boolean;
}

function at(id: string, type: DecorationType, tileX: number, tileY: number, rotated = false): DecorationDefinition {
  return { id, type, x: tileX * TILE_SIZE + TILE_SIZE / 2, y: tileY * TILE_SIZE + TILE_SIZE / 2, rotated };
}

export const DECORATIONS: DecorationDefinition[] = [
  at("square-well", "well", 44, 38),
  at("square-lamp-1", "lamppost", 38, 46),
  at("square-lamp-2", "lamppost", 54, 46),
  at("square-bench-1", "bench", 42, 48, true),
  at("square-bench-2", "bench", 50, 48, true),
];
