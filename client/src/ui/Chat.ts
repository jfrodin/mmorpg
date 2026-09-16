import type { Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "shared";

const MAX_LOG_MESSAGES = 8;
const MESSAGE_LIFETIME_MS = 12000;

export function initChat(
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
): void {
  const log = document.createElement("div");
  log.id = "chat-log";
  document.body.appendChild(log);

  const inputBar = document.createElement("div");
  inputBar.id = "chat-input-bar";
  inputBar.hidden = true;
  const input = document.createElement("input");
  input.placeholder = "Skriv ett meddelande... (Enter skickar, Esc avbryter)";
  inputBar.appendChild(input);
  document.body.appendChild(inputBar);

  function addMessage(name: string, text: string): void {
    const line = document.createElement("div");
    line.className = "chat-line";

    const nameSpan = document.createElement("span");
    nameSpan.className = "chat-name";
    nameSpan.textContent = `${name}: `;

    const textSpan = document.createElement("span");
    textSpan.textContent = text;

    line.appendChild(nameSpan);
    line.appendChild(textSpan);
    log.appendChild(line);

    while (log.children.length > MAX_LOG_MESSAGES) {
      log.removeChild(log.firstChild!);
    }

    setTimeout(() => line.classList.add("fade"), MESSAGE_LIFETIME_MS);
  }

  socket.on("chat_message", ({ name, text }) => addMessage(name, text));

  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && document.activeElement !== input) {
      inputBar.hidden = false;
      input.focus();
      e.preventDefault();
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const text = input.value.trim();
      if (text) socket.emit("chat", { text });
      input.value = "";
      input.blur();
      inputBar.hidden = true;
    } else if (e.key === "Escape") {
      input.value = "";
      input.blur();
      inputBar.hidden = true;
    }
  });
}
