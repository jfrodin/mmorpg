import type { TileType, RegionDefinition } from "./types";
import { TILE_SIZE, WALKABLE } from "./types";
import { startingArea } from "./starting-area";

function hash(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function buildGrid(region: RegionDefinition): TileType[][] {
  const grid: TileType[][] = Array.from({ length: region.heightTiles }, () =>
    Array.from({ length: region.widthTiles }, () => "grass" as TileType)
  );

  for (const layer of region.layers) {
    const { x0, y0, x1, y1 } = layer.data;
    const minX = Math.max(0, x0);
    const maxX = Math.min(region.widthTiles, x1);
    const minY = Math.max(0, y0);
    const maxY = Math.min(region.heightTiles, y1);

    for (let y = minY; y < maxY; y++) {
      for (let x = minX; x < maxX; x++) {
        if (layer.kind === "fill") {
          grid[y][x] = layer.data.type;
        } else if (hash(x + layer.data.seed, y + layer.data.seed) < layer.data.density) {
          grid[y][x] = layer.data.type;
        }
      }
    }
  }

  return grid;
}

const grid = buildGrid(startingArea);

export function getTile(tileX: number, tileY: number): TileType {
  if (tileY < 0 || tileY >= grid.length || tileX < 0 || tileX >= grid[0].length) {
    return "grass";
  }
  return grid[tileY][tileX];
}

export function isWalkableWorld(worldX: number, worldY: number): boolean {
  const tileX = Math.floor(worldX / TILE_SIZE);
  const tileY = Math.floor(worldY / TILE_SIZE);
  return WALKABLE[getTile(tileX, tileY)];
}

export { TILE_SIZE };
