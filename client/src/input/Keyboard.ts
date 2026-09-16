const pressed = new Set<string>();

function isTypingTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
}

window.addEventListener("keydown", (e) => {
  if (isTypingTarget(e.target)) return;
  pressed.add(e.key.toLowerCase());
});
window.addEventListener("keyup", (e) => {
  if (isTypingTarget(e.target)) return;
  pressed.delete(e.key.toLowerCase());
});
window.addEventListener("blur", () => pressed.clear());

export function isDown(...keys: string[]): boolean {
  return keys.some((k) => pressed.has(k));
}

export function getMoveVector(): { x: number; y: number } {
  let x = 0;
  let y = 0;
  if (isDown("a", "arrowleft")) x -= 1;
  if (isDown("d", "arrowright")) x += 1;
  if (isDown("w", "arrowup")) y -= 1;
  if (isDown("s", "arrowdown")) y += 1;

  if (x !== 0 && y !== 0) {
    const len = Math.sqrt(2);
    x /= len;
    y /= len;
  }
  return { x, y };
}
