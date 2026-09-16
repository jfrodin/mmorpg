import type { Character, AppearanceDescriptor } from "shared";
import { DEFAULT_APPEARANCE } from "shared";
import { login, register, getMyCharacter, createCharacter } from "../net/api";
import { drawCharacter } from "../appearance/Character";
import { JACKET_COLORS, PANTS_COLORS, SKIN_COLORS, HAIR_COLORS } from "../appearance/palette";

export async function runAuthFlow(): Promise<Character> {
  const container = document.getElementById("auth-overlay")!;

  await authenticate(container);

  const existing = await getMyCharacter().catch(() => null);
  if (existing) {
    container.remove();
    return existing;
  }

  const character = await createCharacterFlow(container);
  container.remove();
  return character;
}

function authenticate(container: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    let mode: "login" | "register" = "login";

    function render(): void {
      container.innerHTML = "";
      const form = document.createElement("form");

      const title = document.createElement("h2");
      title.textContent = mode === "login" ? "Logga in" : "Skapa konto";
      form.appendChild(title);

      const username = document.createElement("input");
      username.placeholder = "Användarnamn";
      username.autocomplete = "username";
      form.appendChild(username);

      const password = document.createElement("input");
      password.placeholder = "Lösenord";
      password.type = "password";
      password.autocomplete = mode === "login" ? "current-password" : "new-password";
      form.appendChild(password);

      const error = document.createElement("div");
      error.className = "error";
      form.appendChild(error);

      const submit = document.createElement("button");
      submit.type = "submit";
      submit.textContent = mode === "login" ? "Logga in" : "Skapa konto";
      form.appendChild(submit);

      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "toggle";
      toggle.textContent =
        mode === "login" ? "Inget konto? Skapa ett" : "Har du redan ett konto? Logga in";
      toggle.addEventListener("click", () => {
        mode = mode === "login" ? "register" : "login";
        render();
      });
      form.appendChild(toggle);

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        error.textContent = "";
        submit.disabled = true;
        try {
          const action = mode === "login" ? login : register;
          await action(username.value, password.value);
          resolve();
        } catch (err) {
          error.textContent = err instanceof Error ? err.message : "Något gick fel";
          submit.disabled = false;
        }
      });

      container.appendChild(form);
    }

    render();
  });
}

function createCharacterFlow(container: HTMLElement): Promise<Character> {
  return new Promise((resolve) => {
    container.innerHTML = "";
    const form = document.createElement("form");
    form.className = "wide";

    const title = document.createElement("h2");
    title.textContent = "Skapa din karaktär";
    form.appendChild(title);

    const appearance: AppearanceDescriptor = { ...DEFAULT_APPEARANCE };

    const previewRow = document.createElement("div");
    previewRow.className = "preview-row";
    const preview = document.createElement("canvas");
    preview.width = 80;
    preview.height = 80;
    previewRow.appendChild(preview);
    form.appendChild(previewRow);

    const previewCtx = preview.getContext("2d")!;
    function redrawPreview(): void {
      previewCtx.clearRect(0, 0, preview.width, preview.height);
      drawCharacter(previewCtx, preview.width / 2, preview.height / 2 + 10, { x: 0, y: 1 }, appearance);
    }

    const name = document.createElement("input");
    name.placeholder = "Namn";
    form.appendChild(name);

    form.appendChild(
      buildSwatchGroup("Jacka", JACKET_COLORS, appearance.jacketColor, (color) => {
        appearance.jacketColor = color;
        redrawPreview();
      })
    );
    form.appendChild(
      buildSwatchGroup("Byxor", PANTS_COLORS, appearance.pantsColor, (color) => {
        appearance.pantsColor = color;
        redrawPreview();
      })
    );
    form.appendChild(
      buildSwatchGroup("Hy", SKIN_COLORS, appearance.skinColor, (color) => {
        appearance.skinColor = color;
        redrawPreview();
      })
    );
    form.appendChild(
      buildSwatchGroup("Hår", HAIR_COLORS, appearance.hairColor, (color) => {
        appearance.hairColor = color;
        redrawPreview();
      })
    );

    const error = document.createElement("div");
    error.className = "error";
    form.appendChild(error);

    const submit = document.createElement("button");
    submit.type = "submit";
    submit.textContent = "Starta";
    form.appendChild(submit);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      error.textContent = "";
      submit.disabled = true;
      try {
        const character = await createCharacter(name.value, appearance);
        resolve(character);
      } catch (err) {
        error.textContent = err instanceof Error ? err.message : "Något gick fel";
        submit.disabled = false;
      }
    });

    container.appendChild(form);
    redrawPreview();
  });
}

function buildSwatchGroup(
  labelText: string,
  colors: string[],
  initial: string,
  onSelect: (color: string) => void
): HTMLElement {
  const group = document.createElement("div");
  group.className = "swatch-group";

  const label = document.createElement("label");
  label.textContent = labelText;
  group.appendChild(label);

  const row = document.createElement("div");
  row.className = "swatches";

  const buttons: HTMLButtonElement[] = [];
  for (const color of colors) {
    const swatch = document.createElement("button");
    swatch.type = "button";
    swatch.className = "swatch";
    swatch.style.backgroundColor = color;
    if (color === initial) swatch.classList.add("selected");
    swatch.addEventListener("click", () => {
      for (const b of buttons) b.classList.remove("selected");
      swatch.classList.add("selected");
      onSelect(color);
    });
    buttons.push(swatch);
    row.appendChild(swatch);
  }

  group.appendChild(row);
  return group;
}
