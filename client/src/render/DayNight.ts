export function getDarkness(timeOfDay: number): number {
  return (1 - Math.cos(timeOfDay * Math.PI * 2)) / 2;
}

export function drawDayNightOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  timeOfDay: number
): void {
  const darkness = getDarkness(timeOfDay);
  if (darkness <= 0.02) return;

  ctx.save();
  ctx.fillStyle = `rgba(8, 12, 32, ${(darkness * 0.6).toFixed(3)})`;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

export function drawFogOverlay(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.save();
  ctx.fillStyle = "rgba(210, 214, 218, 0.28)";
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}
