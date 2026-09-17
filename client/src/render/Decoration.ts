import type { DecorationDefinition } from "../world/decorations";

export function drawDecoration(
  ctx: CanvasRenderingContext2D,
  decoration: DecorationDefinition,
  screenX: number,
  screenY: number,
  darkness: number
): void {
  switch (decoration.type) {
    case "well":
      drawWell(ctx, screenX, screenY);
      break;
    case "lamppost":
      drawLamppost(ctx, screenX, screenY, darkness);
      break;
    case "bench":
      drawBench(ctx, screenX, screenY, decoration.rotated ?? false);
      break;
  }
}

function drawWell(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.beginPath();
  ctx.ellipse(x, y + 4, 13, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#8a8578";
  ctx.beginPath();
  ctx.arc(x, y, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3a3a30";
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#6b4a30";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 6);
  ctx.lineTo(x - 10, y - 18);
  ctx.moveTo(x + 10, y - 6);
  ctx.lineTo(x + 10, y - 18);
  ctx.stroke();

  ctx.fillStyle = "#7a3a2e";
  ctx.beginPath();
  ctx.moveTo(x - 14, y - 18);
  ctx.lineTo(x, y - 27);
  ctx.lineTo(x + 14, y - 18);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawLamppost(ctx: CanvasRenderingContext2D, x: number, y: number, darkness: number): void {
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  ctx.beginPath();
  ctx.ellipse(x, y + 2, 5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#2a2a2a";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 26);
  ctx.stroke();

  const lit = darkness > 0.35;
  if (lit) {
    const glow = ctx.createRadialGradient(x, y - 29, 0, x, y - 29, 16);
    glow.addColorStop(0, "rgba(255, 220, 140, 0.55)");
    glow.addColorStop(1, "rgba(255, 220, 140, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y - 29, 16, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = lit ? "#ffdf8c" : "#c9c2b0";
  ctx.beginPath();
  ctx.arc(x, y - 29, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#2a2a2a";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

function drawBench(ctx: CanvasRenderingContext2D, x: number, y: number, rotated: boolean): void {
  ctx.save();
  ctx.translate(x, y);
  if (rotated) ctx.rotate(Math.PI / 2);

  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 5, 12, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#3a3025";
  ctx.fillRect(-9, 2, 3, 5);
  ctx.fillRect(6, 2, 3, 5);

  ctx.fillStyle = "#6b4a30";
  ctx.fillRect(-11, -2, 22, 4);
  ctx.fillRect(-11, -9, 22, 3);
  ctx.restore();
}
