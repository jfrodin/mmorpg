export interface AppearanceDescriptor {
  jacketColor: string;
  pantsColor: string;
  skinColor: string;
  hairColor: string;
}

export const DEFAULT_APPEARANCE: AppearanceDescriptor = {
  jacketColor: "#c1502e",
  pantsColor: "#3a3f4a",
  skinColor: "#e8b98a",
  hairColor: "#4a3728",
};

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

  ctx.fillStyle = appearance.pantsColor;
  ctx.fillRect(-7, 2, 14, 12);

  ctx.fillStyle = appearance.jacketColor;
  ctx.beginPath();
  ctx.roundRect(-10, -14, 20, 20, 6);
  ctx.fill();

  ctx.fillStyle = appearance.skinColor;
  ctx.beginPath();
  ctx.arc(0, -20, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = appearance.hairColor;
  ctx.beginPath();
  ctx.arc(0, -23, 8, Math.PI, Math.PI * 2);
  ctx.fill();

  if (facing.x !== 0 || facing.y !== 0) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.beginPath();
    ctx.arc(facing.x * 5, -20 + facing.y * 5, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
