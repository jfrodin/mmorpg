import type { AppearanceDescriptor } from "shared";

export interface NpcDefinition {
  id: string;
  name: string;
  x: number;
  y: number;
  appearance: AppearanceDescriptor;
  lines: string[];
}

export const NPCS: NpcDefinition[] = [
  {
    id: "square-local",
    name: "Birgitta",
    x: 46 * 48,
    y: 43 * 48,
    appearance: {
      jacketColor: "#6b3a5a",
      pantsColor: "#2e2e2e",
      skinColor: "#e8b98a",
      hairColor: "#8a8a8a",
    },
    lines: [
      "Vackert väder idag, eller hur?",
      "Har du provat fiskbullarna på torget? Rekommenderas.",
      "Bussen är sen igen. Som vanligt den här tiden på året.",
    ],
  },
  {
    id: "forest-edge",
    name: "Sten",
    x: 32 * 48,
    y: 45 * 48,
    appearance: {
      jacketColor: "#3a6b47",
      pantsColor: "#4a3728",
      skinColor: "#c98f5e",
      hairColor: "#4a3728",
    },
    lines: [
      "Jag brukar plocka svamp härute på hösten.",
      "Skogen är lugn så här dags. Mest.",
      "Passa dig för myrstackarna om du går längre in.",
    ],
  },
  {
    id: "shore-fisherman",
    name: "Rune",
    x: 50 * 48,
    y: 62 * 48,
    appearance: {
      jacketColor: "#2e5a8a",
      pantsColor: "#3a3f4a",
      skinColor: "#9c6b42",
      hairColor: "#1a1a1a",
    },
    lines: [
      "Fisket har varit sisådär i år.",
      "Grannen påstår att han sett ett ljus ute på ön om nätterna. Skrönor, om du frågar mig.",
      "Sjön kan vara lynnig. Ta det lugnt där ute.",
    ],
  },
];
