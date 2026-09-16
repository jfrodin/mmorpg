import { getMoveVector } from "./input/Keyboard";
import { drawGround } from "./render/Ground";
import { drawCharacter, DEFAULT_APPEARANCE } from "./appearance/Character";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

function resize(): void {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const player = {
  x: 0,
  y: 0,
  facing: { x: 0, y: 1 },
};

const MOVE_SPEED = 160;

let lastTime = performance.now();

function tick(now: number): void {
  const dt = (now - lastTime) / 1000;
  lastTime = now;

  const move = getMoveVector();
  if (move.x !== 0 || move.y !== 0) {
    player.x += move.x * MOVE_SPEED * dt;
    player.y += move.y * MOVE_SPEED * dt;
    player.facing = move;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGround(ctx, canvas.width, canvas.height, player.x, player.y);
  drawCharacter(ctx, canvas.width / 2, canvas.height / 2, player.facing, DEFAULT_APPEARANCE);

  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
