const NODE_COLORS: Record<string, string> = {
  blueberries: "#4a5fb8",
  chanterelle: "#e0a02e",
  lingonberries: "#b83a3a",
};

export function drawResourceNode(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  itemId: string,
  depleted: boolean
): void {
  ctx.save();
  ctx.translate(screenX, screenY);

  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 8, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = depleted ? "#3a4a38" : "#3f5a3a";
  ctx.beginPath();
  ctx.arc(0, 2, 9, 0, Math.PI * 2);
  ctx.fill();

  if (!depleted) {
    const color = NODE_COLORS[itemId] ?? "#888";
    ctx.fillStyle = color;
    for (const [dx, dy] of [
      [-4, -2],
      [3, -4],
      [0, 2],
    ]) {
      ctx.beginPath();
      ctx.arc(dx, dy, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}
