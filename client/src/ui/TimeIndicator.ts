import type { Weather } from "shared";

let el: HTMLDivElement | null = null;
let lastLabel = "";

export function initTimeIndicator(): void {
  el = document.createElement("div");
  el.id = "time-indicator";
  document.body.appendChild(el);
}

function timeLabel(darkness: number): { icon: string; text: string } {
  if (darkness > 0.75) return { icon: "🌙", text: "Natt" };
  if (darkness > 0.35) return { icon: "🌆", text: "Skymning" };
  return { icon: "☀️", text: "Dag" };
}

export function updateTimeIndicator(darkness: number, weather: Weather): void {
  if (!el) return;
  const time = timeLabel(darkness);
  const weatherText = weather === "fog" ? "Dimma" : "Klart";
  const label = `${time.icon} ${time.text} · ${weatherText}`;
  if (label === lastLabel) return;
  lastLabel = label;
  el.textContent = label;
}
