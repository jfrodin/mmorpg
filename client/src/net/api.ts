import type { Character } from "shared";

const API_BASE = "http://localhost:3001/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export function register(username: string, password: string) {
  return request<{ accountId: string; username: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function login(username: string, password: string) {
  return request<{ accountId: string; username: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function getMyCharacter() {
  return request<Character>("/character/me");
}

export function createCharacter(name: string, appearance: Character["appearance"]) {
  return request<Character>("/character", {
    method: "POST",
    body: JSON.stringify({ name, appearance }),
  });
}

export function savePosition(x: number, y: number) {
  return request<void>("/character/position", {
    method: "PATCH",
    body: JSON.stringify({ x, y }),
  });
}

export interface InventorySummary {
  items: { itemId: string; quantity: number }[];
  skills: { skill: string; xp: number }[];
}

export function getInventory() {
  return request<InventorySummary>("/character/inventory");
}
