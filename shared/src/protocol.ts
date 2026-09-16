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

export interface ClientToServerEvents {
  move: (payload: { x: number; y: number; facing: Vector2 }) => void;
  chat: (payload: { text: string }) => void;
}

export interface ServerToClientEvents {
  world_snapshot: (payload: { players: RemotePlayerState[] }) => void;
  player_joined: (payload: { player: RemotePlayerState }) => void;
  player_moved: (payload: { accountId: string; x: number; y: number; facing: Vector2 }) => void;
  player_left: (payload: { accountId: string }) => void;
  chat_message: (payload: ChatMessage) => void;
}
