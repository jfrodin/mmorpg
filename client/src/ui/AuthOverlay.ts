import type { Character } from "shared";
import { DEFAULT_APPEARANCE } from "shared";
import { login, register, getMyCharacter, createCharacter } from "../net/api";

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

    const title = document.createElement("h2");
    title.textContent = "Namnge din karaktär";
    form.appendChild(title);

    const name = document.createElement("input");
    name.placeholder = "Namn";
    form.appendChild(name);

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
        const character = await createCharacter(name.value, DEFAULT_APPEARANCE);
        resolve(character);
      } catch (err) {
        error.textContent = err instanceof Error ? err.message : "Något gick fel";
        submit.disabled = false;
      }
    });

    container.appendChild(form);
  });
}
