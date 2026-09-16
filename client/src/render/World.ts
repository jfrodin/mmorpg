import type { TileType } from "../world/types";
import { TILE_SIZE } from "../world/types";
import { getTile } from "../world/tilemap";

function hash(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

const BASE_COLOR: Record<TileType, [number, number, number]> = {
  grass: [58, 92, 58],
  forest_floor: [42, 64, 40],
  cobble: [116, 112, 106],
  path: [122, 98, 68],
  sand: [198, 180, 136],
  water: [42, 82, 120],
  building: [140, 68, 56],
  tree: [42, 64, 40],
};

interface TreeDecoration {
  screenX: number;
  screenY: number;
  n: number;
}

export function drawWorld(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cameraX: number,
  cameraY: number
): void {
  const startCol = Math.floor((cameraX - width / 2) / TILE_SIZE) - 1;
  const startRow = Math.floor((cameraY - height / 2) / TILE_SIZE) - 1;
  const cols = Math.ceil(width / TILE_SIZE) + 3;
  const rows = Math.ceil(height / TILE_SIZE) + 3;

  const trees: TreeDecoration[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tileX = startCol + col;
      const tileY = startRow + row;
      const tile = getTile(tileX, tileY);
      const n = hash(tileX, tileY);
      const [br, bg, bb] = BASE_COLOR[tile];
      const shade = 0.85 + n * 0.3;

      const screenX = tileX * TILE_SIZE - cameraX + width / 2;
      const screenY = tileY * TILE_SIZE - cameraY + height / 2;

      ctx.fillStyle = `rgb(${Math.min(255, br * shade) | 0}, ${Math.min(255, bg * shade) | 0}, ${Math.min(255, bb * shade) | 0})`;
      ctx.fillRect(screenX, screenY, TILE_SIZE + 1, TILE_SIZE + 1);

      if (tile === "building") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.fillRect(screenX, screenY, TILE_SIZE + 1, 8);
      }

      if (tile === "tree") {
        trees.push({ screenX: screenX + TILE_SIZE / 2, screenY: screenY + TILE_SIZE / 2, n });
      }
    }
  }

  for (const tree of trees) {
    drawTree(ctx, tree.screenX, tree.screenY, tree.n);
  }
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, n: number): void {
  const size = 14 + n * 10;

  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.beginPath();
  ctx.ellipse(x, y + size * 0.5, size * 0.6, size * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#4a3728";
  ctx.fillRect(x - 2, y - size * 0.1, 4, size * 0.5);

  ctx.fillStyle = `rgb(${(38 + n * 22) | 0}, ${(78 + n * 32) | 0}, 46)`;
  ctx.beginPath();
  ctx.arc(x, y - size * 0.35, size * 0.55, 0, Math.PI * 2);
  ctx.fill();
}
