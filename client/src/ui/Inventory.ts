import { ITEM_DEFINITIONS, SKILL_DEFINITIONS } from "shared";
import type { InventorySummary } from "../net/api";

const ITEM_COLORS: Record<string, string> = {
  blueberries: "#4a5fb8",
  chanterelle: "#e0a02e",
  lingonberries: "#b83a3a",
};

function levelForXp(xp: number): number {
  return Math.floor(xp / 25) + 1;
}

let panel: HTMLDivElement | null = null;
const items = new Map<string, number>();
const skills = new Map<string, number>();

function render(): void {
  if (!panel) return;
  panel.innerHTML = "";

  const title = document.createElement("div");
  title.className = "inventory-title";
  title.textContent = "🎒 Väska";
  panel.appendChild(title);

  if (items.size === 0) {
    const empty = document.createElement("div");
    empty.className = "inventory-empty";
    empty.textContent = "Tom";
    panel.appendChild(empty);
  }

  for (const [itemId, quantity] of items) {
    if (quantity <= 0) continue;
    const row = document.createElement("div");
    row.className = "inventory-row";

    const dot = document.createElement("span");
    dot.className = "inventory-dot";
    dot.style.backgroundColor = ITEM_COLORS[itemId] ?? "#888";

    const label = document.createElement("span");
    label.textContent = `${ITEM_DEFINITIONS[itemId]?.name ?? itemId} ×${quantity}`;

    row.appendChild(dot);
    row.appendChild(label);
    panel.appendChild(row);
  }

  const foragingXp = skills.get("foraging") ?? 0;
  const skillLine = document.createElement("div");
  skillLine.className = "inventory-skill";
  const skillName = SKILL_DEFINITIONS.foraging?.name ?? "Insamling";
  skillLine.textContent = `${skillName} — nivå ${levelForXp(foragingXp)} (${foragingXp} xp)`;
  panel.appendChild(skillLine);
}

export function initInventoryPanel(initial: InventorySummary): void {
  panel = document.createElement("div");
  panel.id = "inventory-panel";
  document.body.appendChild(panel);

  for (const item of initial.items) items.set(item.itemId, item.quantity);
  for (const skill of initial.skills) skills.set(skill.skill, skill.xp);
  render();
}

export function applyHarvestResult(itemId: string, quantity: number, totalXp: number): void {
  items.set(itemId, quantity);
  skills.set("foraging", totalXp);
  render();
}
