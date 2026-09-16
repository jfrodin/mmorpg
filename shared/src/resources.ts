export interface ResourceNodeDefinition {
  id: string;
  x: number;
  y: number;
  itemId: string;
  respawnMs: number;
}

const TILE = 48;

export const RESOURCE_NODES: ResourceNodeDefinition[] = [
  { id: "berry-1", x: 20 * TILE, y: 50 * TILE, itemId: "blueberries", respawnMs: 60_000 },
  { id: "berry-2", x: 22 * TILE, y: 55 * TILE, itemId: "blueberries", respawnMs: 60_000 },
  { id: "mushroom-1", x: 15 * TILE, y: 40 * TILE, itemId: "chanterelle", respawnMs: 90_000 },
  { id: "mushroom-2", x: 10 * TILE, y: 35 * TILE, itemId: "chanterelle", respawnMs: 90_000 },
  { id: "lingon-1", x: 25 * TILE, y: 30 * TILE, itemId: "lingonberries", respawnMs: 60_000 },
  { id: "lingon-2", x: 8 * TILE, y: 60 * TILE, itemId: "lingonberries", respawnMs: 60_000 },
];

export const FORAGING_XP_PER_HARVEST = 5;
export const INTERACT_RANGE = 70;
