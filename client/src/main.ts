import { getMoveVector } from "./input/Keyboard";
import { drawGround } from "./render/Ground";
import { drawCharacter } from "./appearance/Character";
import { runAuthFlow } from "./ui/AuthOverlay";
import { savePosition } from "./net/api";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

let viewWidth = 0;
let viewHeight = 0;

function resize(): void {
  const dpr = window.devicePixelRatio || 1;
  viewWidth = window.innerWidth;
  viewHeight = window.innerHeight;

  canvas.style.width = `${viewWidth}px`;
  canvas.style.height = `${viewHeight}px`;
  canvas.width = Math.round(viewWidth * dpr);
  canvas.height = Math.round(viewHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

const MOVE_SPEED = 160;
const POSITION_SAVE_INTERVAL_MS = 3000;

async function main(): Promise<void> {
  const character = await runAuthFlow();

  const player = {
    x: character.x,
    y: character.y,
    facing: { x: 0, y: 1 },
  };

  let dirtySinceLastSave = false;
  setInterval(() => {
    if (!dirtySinceLastSave) return;
    dirtySinceLastSave = false;
    savePosition(player.x, player.y).catch((err) => console.error("save position failed", err));
  }, POSITION_SAVE_INTERVAL_MS);

  let lastTime = performance.now();

  function tick(now: number): void {
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    const move = getMoveVector();
    if (move.x !== 0 || move.y !== 0) {
      player.x += move.x * MOVE_SPEED * dt;
      player.y += move.y * MOVE_SPEED * dt;
      player.facing = move;
      dirtySinceLastSave = true;
    }

    ctx.clearRect(0, 0, viewWidth, viewHeight);
    drawGround(ctx, viewWidth, viewHeight, player.x, player.y);
    drawCharacter(ctx, viewWidth / 2, viewHeight / 2, player.facing, character.appearance);

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  window.addEventListener("beforeunload", () => {
    if (dirtySinceLastSave) {
      navigator.sendBeacon?.(
        "http://localhost:3001/api/character/position",
        new Blob([JSON.stringify({ x: player.x, y: player.y })], { type: "application/json" })
      );
    }
  });
}

main().catch((err) => console.error("failed to start game", err));
