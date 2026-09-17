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
  cameraY: number,
  timeSec: number,
  darkness: number
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
      let shade = 0.85 + n * 0.3;

      if (tile === "water") {
        shade += Math.sin(timeSec * 1.4 + tileX * 0.4 + tileY * 0.35) * 0.06;
      }

      const screenX = tileX * TILE_SIZE - cameraX + width / 2;
      const screenY = tileY * TILE_SIZE - cameraY + height / 2;

      ctx.fillStyle = `rgb(${Math.min(255, br * shade) | 0}, ${Math.min(255, bg * shade) | 0}, ${Math.min(255, bb * shade) | 0})`;
      ctx.fillRect(screenX, screenY, TILE_SIZE + 1, TILE_SIZE + 1);

      if (tile === "grass" || tile === "forest_floor") {
        drawGrassDetail(ctx, screenX, screenY, tileX, tileY, tile === "forest_floor");
      } else if (tile === "cobble") {
        drawCobbleDetail(ctx, screenX, screenY, tileX, tileY);
      } else if (tile === "building") {
        drawBuildingTile(ctx, screenX, screenY, tileX, tileY, n, darkness);
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

function drawGrassDetail(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tileX: number,
  tileY: number,
  dark: boolean
): void {
  ctx.save();
  ctx.strokeStyle = dark ? "rgba(70, 100, 60, 0.35)" : "rgba(140, 175, 110, 0.35)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 3; i++) {
    const n = hash(tileX * 4 + i, tileY * 4 + i * 3);
    const bx = screenX + 6 + n * (TILE_SIZE - 12);
    const by = screenY + 8 + hash(tileX + i, tileY - i) * (TILE_SIZE - 16);
    ctx.beginPath();
    ctx.moveTo(bx, by + 5);
    ctx.lineTo(bx + (n - 0.5) * 3, by - 4);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCobbleDetail(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tileX: number,
  tileY: number
): void {
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
  for (let i = 0; i < 2; i++) {
    const n = hash(tileX * 5 + i * 2, tileY * 5 + i);
    const cx = screenX + 8 + n * (TILE_SIZE - 16);
    const cy = screenY + 8 + hash(tileX - i, tileY + i * 2) * (TILE_SIZE - 16);
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawBuildingTile(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tileX: number,
  tileY: number,
  n: number,
  darkness: number
): void {
  const isTopEdge = getTile(tileX, tileY - 1) !== "building";
  const isBottomEdge = getTile(tileX, tileY + 1) !== "building";
  const isLeftEdge = getTile(tileX - 1, tileY) !== "building";
  const isRightEdge = getTile(tileX + 1, tileY) !== "building";

  ctx.save();

  if (isTopEdge) {
    ctx.fillStyle = `rgb(${(70 + n * 20) | 0}, ${(48 + n * 12) | 0}, ${(40 + n * 10) | 0})`;
    ctx.beginPath();
    ctx.moveTo(screenX - 2, screenY + 10);
    ctx.lineTo(screenX + TILE_SIZE / 2, screenY - 10);
    ctx.lineTo(screenX + TILE_SIZE + 2, screenY + 10);
    ctx.closePath();
    ctx.fill();
  } else if (isBottomEdge && !isLeftEdge && !isRightEdge) {
    ctx.fillStyle = "rgba(30, 18, 14, 0.6)";
    ctx.fillRect(screenX + TILE_SIZE * 0.32, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.36, TILE_SIZE * 0.7);
  } else if (!isTopEdge && !isBottomEdge && hash(tileX * 3, tileY * 3) < 0.4) {
    const lit = darkness > 0.4;
    ctx.fillStyle = lit ? "rgba(255, 214, 130, 0.85)" : "rgba(220, 230, 235, 0.55)";
    ctx.fillRect(screenX + TILE_SIZE * 0.28, screenY + TILE_SIZE * 0.28, TILE_SIZE * 0.44, TILE_SIZE * 0.34);
    ctx.strokeStyle = "rgba(30, 20, 15, 0.5)";
    ctx.lineWidth = 1;
    ctx.strokeRect(screenX + TILE_SIZE * 0.28, screenY + TILE_SIZE * 0.28, TILE_SIZE * 0.44, TILE_SIZE * 0.34);
  }

  ctx.restore();
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
