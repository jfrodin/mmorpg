import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "shared";

export function connectSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
  return io("http://localhost:3001", {
    withCredentials: true,
  });
}
