export function drawOffscreenIndicator(
  ctx: CanvasRenderingContext2D,
  viewWidth: number,
  viewHeight: number,
  dx: number,
  dy: number,
  name: string
): void {
  const margin = 40;
  const halfW = viewWidth / 2 - margin;
  const halfH = viewHeight / 2 - margin;

  const scale = Math.min(
    dx !== 0 ? Math.abs(halfW / dx) : Infinity,
    dy !== 0 ? Math.abs(halfH / dy) : Infinity
  );
  const edgeX = viewWidth / 2 + dx * scale;
  const edgeY = viewHeight / 2 + dy * scale;
  const angle = Math.atan2(dy, dx);

  ctx.save();
  ctx.translate(edgeX, edgeY);
  ctx.rotate(angle);
  ctx.fillStyle = "rgba(240, 236, 224, 0.85)";
  ctx.beginPath();
  ctx.moveTo(10, 0);
  ctx.lineTo(-6, -6);
  ctx.lineTo(-6, 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  const distance = Math.round(Math.hypot(dx, dy));
  ctx.save();
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(240, 236, 224, 0.85)";
  ctx.fillText(`${name} · ${distance}m`, edgeX, edgeY + (dy > 0 ? 18 : -14));
  ctx.restore();
}
