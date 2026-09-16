import type { AppearanceDescriptor } from "./appearance";

export interface Vector2 {
  x: number;
  y: number;
}

export interface RemotePlayerState {
  accountId: string;
  name: string;
  x: number;
  y: number;
  facing: Vector2;
  appearance: AppearanceDescriptor;
}

export interface ChatMessage {
  accountId: string;
  name: string;
  text: string;
  x: number;
  y: number;
  at: number;
}

export type HarvestResult =
  | { ok: true; itemId: string; quantity: number; xp: number; totalXp: number }
  | { ok: false; error: string };

export type Weather = "clear" | "fog";

export interface ClientToServerEvents {
  move: (payload: { x: number; y: number; facing: Vector2 }) => void;
  chat: (payload: { text: string }) => void;
  harvest: (payload: { nodeId: string }, callback: (result: HarvestResult) => void) => void;
}

export interface ServerToClientEvents {
  world_snapshot: (payload: {
    players: RemotePlayerState[];
    depletedNodes: string[];
    dayStartedAt: number;
    dayLengthMs: number;
    weather: Weather;
  }) => void;
  player_joined: (payload: { player: RemotePlayerState }) => void;
  player_moved: (payload: { accountId: string; x: number; y: number; facing: Vector2 }) => void;
  player_left: (payload: { accountId: string }) => void;
  chat_message: (payload: ChatMessage) => void;
  node_depleted: (payload: { nodeId: string }) => void;
  node_respawned: (payload: { nodeId: string }) => void;
  weather_changed: (payload: { weather: Weather }) => void;
}
