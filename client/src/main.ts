import type { RemotePlayerState, Weather } from "shared";
import { RESOURCE_NODES, INTERACT_RANGE, ISLAND_LIGHT_POSITION, isIslandLightActive } from "shared";
import { getMoveVector } from "./input/Keyboard";
import { drawWorld } from "./render/World";
import { drawResourceNode } from "./render/ResourceNode";
import { drawDayNightOverlay, drawFogOverlay, drawVignette, getDarkness } from "./render/DayNight";
import { drawIslandLight } from "./render/Mystery";
import { isWalkableWorld } from "./world/tilemap";
import { drawCharacter, drawNameTag, drawInteractPrompt } from "./appearance/Character";
import { drawOffscreenIndicator } from "./render/OffscreenIndicator";
import { runAuthFlow } from "./ui/AuthOverlay";
import { initChat } from "./ui/Chat";
import { showDialog } from "./ui/Dialog";
import { initInventoryPanel, applyHarvestResult } from "./ui/Inventory";
import { initTimeIndicator, updateTimeIndicator } from "./ui/TimeIndicator";
import { savePosition, getInventory } from "./net/api";
import { connectSocket } from "./net/socket";
import { NPCS } from "./world/npcs";
import { soundEngine } from "./audio/SoundEngine";

window.addEventListener("keydown", () => soundEngine.unlock(), { once: true });
window.addEventListener("pointerdown", () => soundEngine.unlock(), { once: true });

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
const FOG_VISIBILITY_RADIUS = 320;
const FOOTSTEP_INTERVAL_MS = 320;

async function main(): Promise<void> {
  const character = await runAuthFlow();

  const inventory = await getInventory().catch(() => ({ items: [], skills: [] }));
  initInventoryPanel(inventory);
  initTimeIndicator();

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

  initChat(socket);

  const depletedNodes = new Set<string>();
  socket.on("world_snapshot", ({ depletedNodes: initiallyDepleted }) => {
    depletedNodes.clear();
    for (const id of initiallyDepleted) depletedNodes.add(id);
  });
  socket.on("node_depleted", ({ nodeId }) => depletedNodes.add(nodeId));
  socket.on("node_respawned", ({ nodeId }) => depletedNodes.delete(nodeId));

  let dayStartedAt = Date.now();
  let dayLengthMs = 30 * 60 * 1000;
  let weather: Weather = "clear";
  socket.on("world_snapshot", (snapshot) => {
    dayStartedAt = snapshot.dayStartedAt;
    dayLengthMs = snapshot.dayLengthMs;
    weather = snapshot.weather;
  });
  socket.on("weather_changed", ({ weather: w }) => {
    weather = w;
  });

  const npcLineIndex = new Map<string, number>();
  let nearest: { type: "npc" | "node"; id: string } | null = null;

  window.addEventListener("keydown", (e) => {
    if (e.target instanceof HTMLInputElement) return;
    if (e.key.toLowerCase() !== "e" || !nearest) return;

    if (nearest.type === "npc") {
      const npc = NPCS.find((n) => n.id === nearest!.id);
      if (!npc) return;
      const index = npcLineIndex.get(npc.id) ?? 0;
      showDialog(npc.name, npc.lines[index % npc.lines.length]);
      npcLineIndex.set(npc.id, index + 1);
      soundEngine.playTalk();
    } else {
      const nodeId = nearest.id;
      if (depletedNodes.has(nodeId)) return;
      socket.emit("harvest", { nodeId }, (result) => {
        if (!result.ok) {
          showDialog("", result.error);
          return;
        }
        applyHarvestResult(result.itemId, result.quantity, result.totalXp);
        soundEngine.playHarvest();
      });
    }
  });

  let dirtySinceLastSave = false;
  setInterval(() => {
    if (!dirtySinceLastSave) return;
    dirtySinceLastSave = false;
    savePosition(player.x, player.y).catch((err) => console.error("save position failed", err));
  }, POSITION_SAVE_INTERVAL_MS);

  let lastBroadcast = 0;
  let lastFootstep = 0;

  let lastTime = performance.now();

  function tick(now: number): void {
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    const move = getMoveVector();
    if (move.x !== 0 || move.y !== 0) {
      const nextX = player.x + move.x * MOVE_SPEED * dt;
      const nextY = player.y + move.y * MOVE_SPEED * dt;
      const moved = isWalkableWorld(nextX, player.y) || isWalkableWorld(player.x, nextY);
      if (isWalkableWorld(nextX, player.y)) player.x = nextX;
      if (isWalkableWorld(player.x, nextY)) player.y = nextY;
      player.facing = move;
      dirtySinceLastSave = true;

      if (moved && now - lastFootstep >= FOOTSTEP_INTERVAL_MS) {
        lastFootstep = now;
        soundEngine.playFootstep();
      }

      if (now - lastBroadcast >= MOVE_BROADCAST_INTERVAL_MS) {
        lastBroadcast = now;
        socket.emit("move", { x: player.x, y: player.y, facing: player.facing });
      }
    }

    const timeOfDay = ((Date.now() - dayStartedAt) % dayLengthMs) / dayLengthMs;
    const darkness = getDarkness(timeOfDay);
    updateTimeIndicator(darkness, weather);

    ctx.clearRect(0, 0, viewWidth, viewHeight);
    drawWorld(ctx, viewWidth, viewHeight, player.x, player.y, now / 1000, darkness);

    let nearestDist = Infinity;
    nearest = null;
    for (const npc of NPCS) {
      const dist = Math.hypot(npc.x - player.x, npc.y - player.y);
      if (dist <= INTERACT_RANGE && dist < nearestDist) {
        nearestDist = dist;
        nearest = { type: "npc", id: npc.id };
      }
    }
    for (const node of RESOURCE_NODES) {
      if (depletedNodes.has(node.id)) continue;
      const dist = Math.hypot(node.x - player.x, node.y - player.y);
      if (dist <= INTERACT_RANGE && dist < nearestDist) {
        nearestDist = dist;
        nearest = { type: "node", id: node.id };
      }
    }

    for (const npc of NPCS) {
      const dx = npc.x - player.x;
      const dy = npc.y - player.y;
      if (weather === "fog" && Math.hypot(dx, dy) > FOG_VISIBILITY_RADIUS) continue;
      const screenX = viewWidth / 2 + dx;
      const screenY = viewHeight / 2 + dy;
      drawCharacter(ctx, screenX, screenY, { x: 0, y: 1 }, npc.appearance);
      drawNameTag(ctx, screenX, screenY, npc.name);
      if (nearest?.type === "npc" && nearest.id === npc.id) {
        drawInteractPrompt(ctx, screenX, screenY);
      }
    }

    for (const node of RESOURCE_NODES) {
      const dx = node.x - player.x;
      const dy = node.y - player.y;
      if (weather === "fog" && Math.hypot(dx, dy) > FOG_VISIBILITY_RADIUS) continue;
      const screenX = viewWidth / 2 + dx;
      const screenY = viewHeight / 2 + dy;
      const depleted = depletedNodes.has(node.id);
      drawResourceNode(ctx, screenX, screenY, node.itemId, depleted);
      if (nearest?.type === "node" && nearest.id === node.id) {
        drawInteractPrompt(ctx, screenX, screenY - 6);
      }
    }

    for (const remote of remotePlayers.values()) {
      const dx = remote.x - player.x;
      const dy = remote.y - player.y;
      const screenX = viewWidth / 2 + dx;
      const screenY = viewHeight / 2 + dy;

      const withinScreenBounds =
        screenX > -20 && screenX < viewWidth + 20 && screenY > -20 && screenY < viewHeight + 20;
      const withinFogVisibility =
        weather !== "fog" || Math.hypot(dx, dy) <= FOG_VISIBILITY_RADIUS;
      const onScreen = withinScreenBounds && withinFogVisibility;

      if (onScreen) {
        drawCharacter(ctx, screenX, screenY, remote.facing, remote.appearance);
        drawNameTag(ctx, screenX, screenY, remote.name);
      } else {
        drawOffscreenIndicator(ctx, viewWidth, viewHeight, dx, dy, remote.name);
      }
    }

    drawCharacter(ctx, viewWidth / 2, viewHeight / 2, player.facing, character.appearance);
    drawNameTag(ctx, viewWidth / 2, viewHeight / 2, character.name);

    if (weather === "fog") {
      drawFogOverlay(ctx, viewWidth, viewHeight);
    }
    drawDayNightOverlay(ctx, viewWidth, viewHeight, timeOfDay);
    drawVignette(ctx, viewWidth, viewHeight);

    if (isIslandLightActive(dayStartedAt, dayLengthMs, weather, darkness)) {
      const lightScreenX = viewWidth / 2 + (ISLAND_LIGHT_POSITION.x - player.x);
      const lightScreenY = viewHeight / 2 + (ISLAND_LIGHT_POSITION.y - player.y);
      if (
        lightScreenX > -50 &&
        lightScreenX < viewWidth + 50 &&
        lightScreenY > -50 &&
        lightScreenY < viewHeight + 50
      ) {
        drawIslandLight(ctx, lightScreenX, lightScreenY);
      }
    }

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
