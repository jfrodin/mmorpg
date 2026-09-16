export function drawIslandLight(ctx: CanvasRenderingContext2D, screenX: number, screenY: number): void {
  ctx.save();

  const glow = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, 42);
  glow.addColorStop(0, "rgba(255, 240, 180, 0.85)");
  glow.addColorStop(0.4, "rgba(255, 220, 140, 0.3)");
  glow.addColorStop(1, "rgba(255, 220, 140, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(screenX, screenY, 42, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fff2c8";
  ctx.beginPath();
  ctx.arc(screenX, screenY, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
