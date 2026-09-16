// CANON mystery concept, see docs/WORLD.md ("Ljusen ute på ön"). The
// light is only ever computed, never pushed over the wire — every
// client derives the same answer from the same shared clock/weather
// state, so what one player sees, everyone currently online sees too.

export const ISLAND_LIGHT_POSITION = { x: 54 * 48, y: 96 * 48 };
const NIGHT_LIGHT_APPEAR_CHANCE = 0.5;
const DARKNESS_THRESHOLD = 0.6;

function hash(n: number): number {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

export function isIslandLightActive(
  dayStartedAt: number,
  dayLengthMs: number,
  weather: string,
  darkness: number
): boolean {
  if (weather !== "clear") return false;
  if (darkness < DARKNESS_THRESHOLD) return false;
  const cycleNumber = Math.floor((Date.now() - dayStartedAt) / dayLengthMs);
  return hash(cycleNumber) < NIGHT_LIGHT_APPEAR_CHANCE;
}
