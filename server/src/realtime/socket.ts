import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { parse as parseCookie } from "cookie";
import { eq, sql } from "drizzle-orm";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  RemotePlayerState,
  Character,
  HarvestResult,
} from "shared";
import { RESOURCE_NODES, FORAGING_XP_PER_HARVEST, INTERACT_RANGE } from "shared";
import { db } from "../db/client";
import { characters, inventoryItems, characterSkills } from "../db/schema";
import type { SessionPayload } from "../auth/session";

async function addInventoryItem(characterId: string, itemId: string, amount: number): Promise<number> {
  const [row] = await db
    .insert(inventoryItems)
    .values({ id: crypto.randomUUID(), characterId, itemId, quantity: amount })
    .onConflictDoUpdate({
      target: [inventoryItems.characterId, inventoryItems.itemId],
      set: { quantity: sql`${inventoryItems.quantity} + ${amount}` },
    })
    .returning({ quantity: inventoryItems.quantity });
  return row.quantity;
}

async function addSkillXp(characterId: string, skill: string, amount: number): Promise<number> {
  const [row] = await db
    .insert(characterSkills)
    .values({ id: crypto.randomUUID(), characterId, skill, xp: amount })
    .onConflictDoUpdate({
      target: [characterSkills.characterId, characterSkills.skill],
      set: { xp: sql`${characterSkills.xp} + ${amount}` },
    })
    .returning({ xp: characterSkills.xp });
  return row.xp;
}

interface SocketData {
  accountId: string;
  character: Character;
}

const CHAT_RADIUS = 500;
const CHAT_MAX_LENGTH = 240;

function sanitizeChatText(text: unknown): string | null {
  if (typeof text !== "string") return null;
  // eslint-disable-next-line no-control-regex
  const cleaned = text.replace(/[\x00-\x1f\x7f]/g, "").trim();
  if (!cleaned) return null;
  return cleaned.slice(0, CHAT_MAX_LENGTH);
}

const players = new Map<string, RemotePlayerState>();
const socketsByAccountId = new Map<string, import("socket.io").Socket>();
const depletedNodes = new Map<string, ReturnType<typeof setTimeout>>();

export function setupRealtime(httpServer: HttpServer): void {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, object, SocketData>(
    httpServer,
    {
      cors: {
        origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
        credentials: true,
      },
    }
  );

  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) throw new Error("no cookie");
      const cookies = parseCookie(cookieHeader);
      const token = cookies.session;
      if (!token) throw new Error("no session cookie");

      const secret = process.env.AUTH_SECRET;
      if (!secret) throw new Error("AUTH_SECRET not set");
      const payload = jwt.verify(token, secret) as SessionPayload;

      const character = await db.query.characters.findFirst({
        where: eq(characters.accountId, payload.accountId),
      });
      if (!character) throw new Error("no character");

      socket.data.accountId = payload.accountId;
      socket.data.character = character as unknown as Character;
      next();
    } catch (err) {
      next(err instanceof Error ? err : new Error("auth failed"));
    }
  });

  io.on("connection", (socket) => {
    const { accountId, character } = socket.data;

    const state: RemotePlayerState = {
      accountId,
      name: character.name,
      x: character.x,
      y: character.y,
      facing: { x: 0, y: 1 },
      appearance: character.appearance,
    };
    players.set(accountId, state);
    socketsByAccountId.set(accountId, socket);

    socket.emit("world_snapshot", {
      players: Array.from(players.values()).filter((p) => p.accountId !== accountId),
      depletedNodes: Array.from(depletedNodes.keys()),
    });
    socket.broadcast.emit("player_joined", { player: state });

    socket.on("move", (payload) => {
      if (
        typeof payload?.x !== "number" ||
        typeof payload?.y !== "number" ||
        !Number.isFinite(payload.x) ||
        !Number.isFinite(payload.y)
      ) {
        return;
      }
      state.x = payload.x;
      state.y = payload.y;
      if (payload.facing) state.facing = payload.facing;
      socket.broadcast.emit("player_moved", {
        accountId,
        x: state.x,
        y: state.y,
        facing: state.facing,
      });
    });

    socket.on("chat", (payload) => {
      const text = sanitizeChatText(payload?.text);
      if (!text) return;

      const message = {
        accountId,
        name: state.name,
        text,
        x: state.x,
        y: state.y,
        at: Date.now(),
      };

      for (const [otherId, otherState] of players) {
        const dist = Math.hypot(otherState.x - state.x, otherState.y - state.y);
        if (dist <= CHAT_RADIUS) {
          socketsByAccountId.get(otherId)?.emit("chat_message", message);
        }
      }
    });

    socket.on("harvest", async (payload, callback) => {
      const node = RESOURCE_NODES.find((n) => n.id === payload?.nodeId);
      if (!node) {
        callback({ ok: false, error: "Okänd resurs." });
        return;
      }
      if (depletedNodes.has(node.id)) {
        callback({ ok: false, error: "Redan plockat tomt. Vänta tills det växer tillbaka." });
        return;
      }
      const dist = Math.hypot(node.x - state.x, node.y - state.y);
      if (dist > INTERACT_RANGE) {
        callback({ ok: false, error: "För långt bort." });
        return;
      }

      const timeout = setTimeout(() => {
        depletedNodes.delete(node.id);
        io.emit("node_respawned", { nodeId: node.id });
      }, node.respawnMs);
      depletedNodes.set(node.id, timeout);
      io.emit("node_depleted", { nodeId: node.id });

      try {
        const quantity = await addInventoryItem(character.id, node.itemId, 1);
        const totalXp = await addSkillXp(character.id, "foraging", FORAGING_XP_PER_HARVEST);
        const result: HarvestResult = {
          ok: true,
          itemId: node.itemId,
          quantity,
          xp: FORAGING_XP_PER_HARVEST,
          totalXp,
        };
        callback(result);
      } catch (err) {
        console.error("harvest failed", err);
        callback({ ok: false, error: "Något gick fel." });
      }
    });

    socket.on("disconnect", () => {
      players.delete(accountId);
      socketsByAccountId.delete(accountId);
      socket.broadcast.emit("player_left", { accountId });
    });
  });
}
