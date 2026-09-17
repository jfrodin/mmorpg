import type { AppearanceDescriptor } from "shared";

export function drawCharacter(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  facing: { x: number; y: number },
  appearance: AppearanceDescriptor
): void {
  ctx.save();
  ctx.translate(screenX, screenY);

  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.beginPath();
  ctx.ellipse(0, 14, 12, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(20, 18, 16, 0.35)";
  ctx.lineWidth = 1.5;

  ctx.fillStyle = appearance.pantsColor;
  ctx.fillRect(-7, 2, 14, 12);
  ctx.strokeRect(-7, 2, 14, 12);

  ctx.fillStyle = appearance.jacketColor;
  ctx.beginPath();
  ctx.roundRect(-10, -14, 20, 20, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = appearance.skinColor;
  ctx.beginPath();
  ctx.arc(0, -20, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = appearance.hairColor;
  ctx.beginPath();
  ctx.arc(0, -23, 8, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (facing.x !== 0 || facing.y !== 0) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.beginPath();
    ctx.arc(facing.x * 5, -20 + facing.y * 5, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function drawNameTag(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  name: string
): void {
  ctx.save();
  ctx.font = "12px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillText(name, screenX + 1, screenY - 34);
  ctx.fillStyle = "#f0ece0";
  ctx.fillText(name, screenX, screenY - 35);
  ctx.restore();
}

export function drawInteractPrompt(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  label: string = "Prata"
): void {
  ctx.save();
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "center";
  const text = `[E] ${label}`;
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillText(text, screenX + 1, screenY - 47);
  ctx.fillStyle = "#e8c96a";
  ctx.fillText(text, screenX, screenY - 48);
  ctx.restore();
}
