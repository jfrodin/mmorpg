import type { BuildingDefinition } from "../world/buildings";

function hash(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amount));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amount));
  const b = Math.max(0, Math.min(255, (n & 255) + amount));
  return `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
}

export function drawBuilding(
  ctx: CanvasRenderingContext2D,
  building: BuildingDefinition,
  screenX: number,
  screenY: number,
  widthPx: number,
  heightPx: number,
  darkness: number
): void {
  // The footprint (widthPx x heightPx) is the collision area on the
  // ground, but rendering it as a literally-that-tall structure made
  // deep buildings look like towers. Anchor the drawing to the front
  // (bottom) of the footprint and cap how tall it's actually drawn, so
  // buildings stay low, squat cottages regardless of footprint depth.
  const groundY = screenY + heightPx;
  const visualHeight = Math.min(heightPx, 92);
  const roofHeight = Math.min(visualHeight * 0.34, 28);
  const wallHeight = visualHeight - roofHeight;
  const wallTop = groundY - visualHeight + roofHeight;
  const roofApexY = groundY - visualHeight;
  const overhang = 6;
  const seed = hash(building.x, building.y);

  ctx.save();

  // Ground shadow.
  ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
  ctx.beginPath();
  ctx.ellipse(screenX + widthPx / 2, groundY + 6, widthPx / 2 + 4, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Walls, with a faint plank-line texture.
  ctx.fillStyle = building.wallColor;
  ctx.fillRect(screenX, wallTop, widthPx, wallHeight);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.12)";
  ctx.lineWidth = 1;
  for (let ly = wallTop + 8; ly < groundY; ly += 8) {
    ctx.beginPath();
    ctx.moveTo(screenX, ly);
    ctx.lineTo(screenX + widthPx, ly);
    ctx.stroke();
  }

  // Corner trim boards.
  ctx.fillStyle = building.trimColor;
  ctx.fillRect(screenX, wallTop, 4, wallHeight);
  ctx.fillRect(screenX + widthPx - 4, wallTop, 4, wallHeight);

  // Gable roof (two-tone for a little pseudo-3D depth).
  const apexX = screenX + widthPx / 2;
  ctx.fillStyle = shade(building.roofColor, -10);
  ctx.beginPath();
  ctx.moveTo(screenX - overhang, wallTop + 2);
  ctx.lineTo(apexX, roofApexY);
  ctx.lineTo(apexX, wallTop + 2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = shade(building.roofColor, 8);
  ctx.beginPath();
  ctx.moveTo(apexX, roofApexY);
  ctx.lineTo(screenX + widthPx + overhang, wallTop + 2);
  ctx.lineTo(apexX, wallTop + 2);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(apexX, roofApexY);
  ctx.lineTo(apexX, wallTop + 2);
  ctx.stroke();

  // Chimney.
  if (seed > 0.4) {
    const chimneyX = screenX + widthPx * (seed > 0.7 ? 0.72 : 0.28);
    ctx.fillStyle = shade(building.wallColor, -25);
    ctx.fillRect(chimneyX - 4, roofApexY - 8, 9, roofHeight * 0.55 + 12);
  }

  // Windows, symmetric either side of the door.
  const windowLit = darkness > 0.4;
  const windowY = wallTop + wallHeight * 0.32;
  const windowSize = Math.min(widthPx * 0.16, 12);
  for (const dir of [-1, 1]) {
    const wx = apexX + dir * widthPx * 0.28 - windowSize / 2;
    ctx.fillStyle = windowLit ? "rgba(255, 214, 130, 0.9)" : "rgba(200, 220, 230, 0.6)";
    ctx.fillRect(wx, windowY, windowSize, windowSize);
    ctx.strokeStyle = building.trimColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(wx, windowY, windowSize, windowSize);
  }

  // Door, centered, resting on the ground.
  const doorWidth = Math.min(widthPx * 0.3, 22);
  const doorHeight = Math.min(wallHeight * 0.34, 26);
  const doorX = apexX - doorWidth / 2;
  const doorY = groundY - doorHeight;
  ctx.fillStyle = "#3a2418";
  ctx.fillRect(doorX, doorY, doorWidth, doorHeight);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
  ctx.lineWidth = 1;
  ctx.strokeRect(doorX + 2, doorY + 3, doorWidth - 4, doorHeight - 6);
  ctx.fillStyle = "rgba(230, 200, 120, 0.9)";
  ctx.beginPath();
  ctx.arc(doorX + doorWidth - 3, doorY + doorHeight / 2, 1.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
