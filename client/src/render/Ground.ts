const TILE_SIZE = 48;

function hash(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export function drawGround(
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

  const baseR = 58;
  const baseG = 92;
  const baseB = 58;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tileX = startCol + col;
      const tileY = startRow + row;
      const n = hash(tileX, tileY);
      const shade = 0.85 + n * 0.3;

      const r = Math.min(255, baseR * shade);
      const g = Math.min(255, baseG * shade);
      const b = Math.min(255, baseB * shade);

      const screenX = tileX * TILE_SIZE - cameraX + width / 2;
      const screenY = tileY * TILE_SIZE - cameraY + height / 2;

      ctx.fillStyle = `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
      ctx.fillRect(screenX, screenY, TILE_SIZE + 1, TILE_SIZE + 1);
    }
  }
}
