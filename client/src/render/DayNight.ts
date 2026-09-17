export function getDarkness(timeOfDay: number): number {
  return (1 - Math.cos(timeOfDay * Math.PI * 2)) / 2;
}

function bell(t: number, center: number, width: number): number {
  const d = (t - center) / width;
  return Math.exp(-d * d);
}

export function getDuskWarmth(timeOfDay: number): number {
  return Math.max(bell(timeOfDay, 0.25, 0.06), bell(timeOfDay, 0.75, 0.06));
}

export function drawDayNightOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  timeOfDay: number
): void {
  const darkness = getDarkness(timeOfDay);
  const warmth = getDuskWarmth(timeOfDay);

  ctx.save();
  if (darkness > 0.02) {
    ctx.fillStyle = `rgba(8, 10, 30, ${(darkness * 0.82).toFixed(3)})`;
    ctx.fillRect(0, 0, width, height);
  }
  if (warmth > 0.04) {
    ctx.fillStyle = `rgba(255, 140, 60, ${(warmth * 0.22).toFixed(3)})`;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.restore();
}

export function drawFogOverlay(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.save();
  ctx.fillStyle = "rgba(210, 214, 218, 0.28)";
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

export function drawVignette(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const radius = Math.hypot(width, height) / 2;
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    radius * 0.55,
    width / 2,
    height / 2,
    radius
  );
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.32)");
  ctx.save();
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}
