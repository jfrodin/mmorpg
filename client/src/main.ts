import type { RemotePlayerState } from "shared";
import { getMoveVector } from "./input/Keyboard";
import { drawGround } from "./render/Ground";
import { drawCharacter, drawNameTag } from "./appearance/Character";
import { drawOffscreenIndicator } from "./render/OffscreenIndicator";
import { runAuthFlow } from "./ui/AuthOverlay";
import { savePosition } from "./net/api";
import { connectSocket } from "./net/socket";

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
const MOVE_BROADCAST_INTERVAL_MS = 100;

async function main(): Promise<void> {
  const character = await runAuthFlow();

  const player = {
    x: character.x,
    y: character.y,
    facing: { x: 0, y: 1 },
  };

  const remotePlayers = new Map<string, RemotePlayerState>();
  const socket = connectSocket();

  socket.on("world_snapshot", ({ players }) => {
    remotePlayers.clear();
    for (const p of players) remotePlayers.set(p.accountId, p);
  });
  socket.on("player_joined", ({ player: remote }) => {
    remotePlayers.set(remote.accountId, remote);
  });
  socket.on("player_moved", ({ accountId, x, y, facing }) => {
    const remote = remotePlayers.get(accountId);
    if (remote) {
      remote.x = x;
      remote.y = y;
      remote.facing = facing;
    }
  });
  socket.on("player_left", ({ accountId }) => {
    remotePlayers.delete(accountId);
  });

  let dirtySinceLastSave = false;
  setInterval(() => {
    if (!dirtySinceLastSave) return;
    dirtySinceLastSave = false;
    savePosition(player.x, player.y).catch((err) => console.error("save position failed", err));
  }, POSITION_SAVE_INTERVAL_MS);

  let lastBroadcast = 0;

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

      if (now - lastBroadcast >= MOVE_BROADCAST_INTERVAL_MS) {
        lastBroadcast = now;
        socket.emit("move", { x: player.x, y: player.y, facing: player.facing });
      }
    }

    ctx.clearRect(0, 0, viewWidth, viewHeight);
    drawGround(ctx, viewWidth, viewHeight, player.x, player.y);

    for (const remote of remotePlayers.values()) {
      const dx = remote.x - player.x;
      const dy = remote.y - player.y;
      const screenX = viewWidth / 2 + dx;
      const screenY = viewHeight / 2 + dy;

      const onScreen =
        screenX > -20 && screenX < viewWidth + 20 && screenY > -20 && screenY < viewHeight + 20;

      if (onScreen) {
        drawCharacter(ctx, screenX, screenY, remote.facing, remote.appearance);
        drawNameTag(ctx, screenX, screenY, remote.name);
      } else {
        drawOffscreenIndicator(ctx, viewWidth, viewHeight, dx, dy, remote.name);
      }
    }

    drawCharacter(ctx, viewWidth / 2, viewHeight / 2, player.facing, character.appearance);
    drawNameTag(ctx, viewWidth / 2, viewHeight / 2, character.name);

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
