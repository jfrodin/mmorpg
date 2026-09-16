import type { RegionDefinition } from "./types";

// PROPOSAL geography (Ö-staden), see docs/WORLD.md. Place names are
// deliberately unresolved (docs/WORLD.md) — this file only encodes shape.
export const startingArea: RegionDefinition = {
  id: "starting-area",
  widthTiles: 170,
  heightTiles: 110,
  layers: [
    { kind: "fill", data: { type: "grass", x0: 0, y0: 0, x1: 120, y1: 90 } },

    // Forest, west edge.
    { kind: "fill", data: { type: "forest_floor", x0: 0, y0: 0, x1: 30, y1: 90 } },
    {
      kind: "scatter",
      data: { type: "tree", x0: 0, y0: 0, x1: 30, y1: 90, density: 0.16, seed: 7 },
    },

    // Town square.
    { kind: "fill", data: { type: "cobble", x0: 34, y0: 34, x1: 58, y1: 52 } },

    // Buildings bordering the square.
    { kind: "fill", data: { type: "building", x0: 36, y0: 27, x1: 42, y1: 33 } },
    { kind: "fill", data: { type: "building", x0: 50, y0: 27, x1: 56, y1: 33 } },
    { kind: "fill", data: { type: "building", x0: 28, y0: 36, x1: 33, y1: 44 } },
    { kind: "fill", data: { type: "building", x0: 59, y0: 36, x1: 64, y1: 44 } },
    { kind: "fill", data: { type: "building", x0: 40, y0: 53, x1: 48, y1: 58 } },

    // Road out of town, east — leads to a small rural crossroads.
    { kind: "fill", data: { type: "path", x0: 58, y0: 46, x1: 170, y1: 50 } },
    { kind: "fill", data: { type: "path", x0: 148, y0: 20, x1: 152, y1: 90 } },

    // A farm at the crossroads — one of the "landsbygd/gårdar" landmarks
    // from the approved geography concept, not yet named (see WORLD.md).
    { kind: "fill", data: { type: "building", x0: 138, y0: 36, x1: 146, y1: 44 } },
    { kind: "fill", data: { type: "building", x0: 156, y0: 52, x1: 166, y1: 60 } },
    {
      kind: "scatter",
      data: { type: "tree", x0: 130, y0: 15, x1: 147, y1: 30, density: 0.1, seed: 41 },
    },
    {
      kind: "scatter",
      data: { type: "tree", x0: 153, y0: 15, x1: 170, y1: 30, density: 0.1, seed: 42 },
    },

    // Lake shore, south.
    { kind: "fill", data: { type: "sand", x0: 15, y0: 60, x1: 95, y1: 68 } },
    { kind: "fill", data: { type: "water", x0: 10, y0: 68, x1: 100, y1: 110 } },

    // A small island out on the lake — no bridge, unreachable on foot by
    // design (see docs/WORLD.md mystery concept: observed, not visited).
    { kind: "fill", data: { type: "forest_floor", x0: 50, y0: 92, x1: 58, y1: 100 } },
    {
      kind: "scatter",
      data: { type: "tree", x0: 50, y0: 92, x1: 58, y1: 100, density: 0.12, seed: 99 },
    },

    // A second, smaller uninhabited islet nearby — purely scenic.
    { kind: "fill", data: { type: "grass", x0: 70, y0: 85, x1: 74, y1: 89 } },
  ],
};
