import type { Server } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents, Weather } from "shared";

export const DAY_LENGTH_MS = 30 * 60 * 1000;

const dayStartedAt = Date.now();
let currentWeather: Weather = "clear";

const MIN_WEATHER_INTERVAL_MS = 3 * 60 * 1000;
const MAX_WEATHER_INTERVAL_MS = 8 * 60 * 1000;
const FOG_CHANCE = 0.35;

export function getWorldClockState(): {
  dayStartedAt: number;
  dayLengthMs: number;
  weather: Weather;
} {
  return { dayStartedAt, dayLengthMs: DAY_LENGTH_MS, weather: currentWeather };
}

export function startWorldClock(io: Server<ClientToServerEvents, ServerToClientEvents>): void {
  function scheduleNextWeatherChange(): void {
    const delay =
      MIN_WEATHER_INTERVAL_MS + Math.random() * (MAX_WEATHER_INTERVAL_MS - MIN_WEATHER_INTERVAL_MS);
    setTimeout(() => {
      currentWeather = Math.random() < FOG_CHANCE ? "fog" : "clear";
      io.emit("weather_changed", { weather: currentWeather });
      scheduleNextWeatherChange();
    }, delay);
  }
  scheduleNextWeatherChange();
}
