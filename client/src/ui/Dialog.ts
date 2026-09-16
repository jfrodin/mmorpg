let hideTimeout: number | undefined;
let box: HTMLDivElement | null = null;

const DIALOG_LIFETIME_MS = 4500;

export function showDialog(name: string, text: string): void {
  if (!box) {
    box = document.createElement("div");
    box.id = "dialog-box";
    document.body.appendChild(box);
  }

  box.innerHTML = "";
  const nameEl = document.createElement("div");
  nameEl.className = "dialog-name";
  nameEl.textContent = name;
  const textEl = document.createElement("div");
  textEl.className = "dialog-text";
  textEl.textContent = text;
  box.appendChild(nameEl);
  box.appendChild(textEl);

  box.classList.remove("fade");
  box.hidden = false;

  if (hideTimeout) window.clearTimeout(hideTimeout);
  hideTimeout = window.setTimeout(() => {
    box?.classList.add("fade");
  }, DIALOG_LIFETIME_MS);
}
