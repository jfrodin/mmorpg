import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { parse as parseCookie } from "cookie";
import { eq } from "drizzle-orm";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  RemotePlayerState,
  Character,
} from "shared";
import { db } from "../db/client";
import { characters } from "../db/schema";
import type { SessionPayload } from "../auth/session";

interface SocketData {
  accountId: string;
  character: Character;
}

const players = new Map<string, RemotePlayerState>();

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

    socket.emit("world_snapshot", {
      players: Array.from(players.values()).filter((p) => p.accountId !== accountId),
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

    socket.on("disconnect", () => {
      players.delete(accountId);
      socket.broadcast.emit("player_left", { accountId });
    });
  });
}
