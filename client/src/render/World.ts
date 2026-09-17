import type { TileType } from "../world/types";
import { TILE_SIZE } from "../world/types";
import { getTile } from "../world/tilemap";
import { BUILDINGS } from "../world/buildings";
import { drawBuilding } from "./Building";
import { DECORATIONS } from "../world/decorations";
import { drawDecoration } from "./Decoration";

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
  building: [70, 60, 48],
  tree: [42, 64, 40],
  bridge: [138, 104, 68],
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
      } else if (tile === "bridge") {
        drawBridgeDetail(ctx, screenX, screenY, tileX, tileY);
      }

      if (tile === "tree") {
        trees.push({ screenX: screenX + TILE_SIZE / 2, screenY: screenY + TILE_SIZE / 2, n });
      }
    }
  }

  for (const tree of trees) {
    drawTree(ctx, tree.screenX, tree.screenY, tree.n);
  }

  for (const building of BUILDINGS) {
    const widthPx = building.widthTiles * TILE_SIZE;
    const heightPx = building.heightTiles * TILE_SIZE;
    const screenX = building.x - cameraX + width / 2;
    const screenY = building.y - cameraY + height / 2;
    if (
      screenX + widthPx < -60 ||
      screenX > width + 60 ||
      screenY + heightPx < -60 ||
      screenY > height + 60
    ) {
      continue;
    }
    drawBuilding(ctx, building, screenX, screenY, widthPx, heightPx, darkness);
  }

  for (const decoration of DECORATIONS) {
    const screenX = decoration.x - cameraX + width / 2;
    const screenY = decoration.y - cameraY + height / 2;
    if (screenX < -40 || screenX > width + 40 || screenY < -40 || screenY > height + 40) {
      continue;
    }
    drawDecoration(ctx, decoration, screenX, screenY, darkness);
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

function drawBridgeDetail(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tileX: number,
  tileY: number
): void {
  ctx.save();
  ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
  ctx.lineWidth = 1;
  for (let ly = screenY + 8; ly < screenY + TILE_SIZE; ly += 8) {
    ctx.beginPath();
    ctx.moveTo(screenX, ly);
    ctx.lineTo(screenX + TILE_SIZE, ly);
    ctx.stroke();
  }

  ctx.fillStyle = "#5a4a34";
  if (getTile(tileX - 1, tileY) === "water") {
    ctx.fillRect(screenX, screenY, 4, TILE_SIZE);
  }
  if (getTile(tileX + 1, tileY) === "water") {
    ctx.fillRect(screenX + TILE_SIZE - 4, screenY, 4, TILE_SIZE);
  }
  if (getTile(tileX, tileY - 1) === "water") {
    ctx.fillRect(screenX, screenY, TILE_SIZE, 4);
  }
  if (getTile(tileX, tileY + 1) === "water") {
    ctx.fillRect(screenX, screenY + TILE_SIZE - 4, TILE_SIZE, 4);
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
