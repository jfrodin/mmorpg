import type { RegionDefinition } from "./types";

// CANON geography (Ö-staden, docs/WORLD.md): the town sits on a small
// peninsula, water wrapping it on the south and east, with a bridge
// carrying the one road out to the rest of the map. Place names are
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

    // A couple of foot trails wandering a short way into the forest.
    { kind: "fill", data: { type: "path", x0: 24, y0: 46, x1: 30, y1: 49 } },
    { kind: "fill", data: { type: "path", x0: 14, y0: 44, x1: 25, y1: 47 } },
    { kind: "fill", data: { type: "path", x0: 6, y0: 40, x1: 15, y1: 45 } },
    { kind: "fill", data: { type: "path", x0: 24, y0: 19, x1: 30, y1: 22 } },
    { kind: "fill", data: { type: "path", x0: 13, y0: 15, x1: 25, y1: 20 } },

    // Town square.
    { kind: "fill", data: { type: "cobble", x0: 34, y0: 34, x1: 58, y1: 52 } },

    // Buildings bordering the square.
    { kind: "fill", data: { type: "building", x0: 36, y0: 28, x1: 41, y1: 33 } },
    { kind: "fill", data: { type: "building", x0: 51, y0: 28, x1: 56, y1: 33 } },
    { kind: "fill", data: { type: "building", x0: 29, y0: 37, x1: 33, y1: 43 } },
    { kind: "fill", data: { type: "building", x0: 60, y0: 37, x1: 64, y1: 43 } },
    { kind: "fill", data: { type: "building", x0: 41, y0: 53, x1: 47, y1: 57 } },

    // Road out of town, east — leads to a small rural crossroads.
    { kind: "fill", data: { type: "path", x0: 58, y0: 46, x1: 170, y1: 50 } },
    { kind: "fill", data: { type: "path", x0: 148, y0: 20, x1: 152, y1: 90 } },

    // Lake arm separating the peninsula from the mainland to the east —
    // the road crosses it on a bridge, per the approved geography.
    { kind: "fill", data: { type: "water", x0: 75, y0: 15, x1: 110, y1: 95 } },
    { kind: "fill", data: { type: "bridge", x0: 75, y0: 46, x1: 110, y1: 50 } },

    // A farm at the crossroads — one of the "landsbygd/gårdar" landmarks
    // from the approved geography concept, not yet named (see WORLD.md).
    { kind: "fill", data: { type: "building", x0: 139, y0: 37, x1: 145, y1: 43 } },
    { kind: "fill", data: { type: "building", x0: 157, y0: 53, x1: 165, y1: 59 } },
    {
      kind: "scatter",
      data: { type: "tree", x0: 130, y0: 15, x1: 147, y1: 30, density: 0.1, seed: 41 },
    },
    {
      kind: "scatter",
      data: { type: "tree", x0: 153, y0: 15, x1: 170, y1: 30, density: 0.1, seed: 42 },
    },

    // Lake shore, south of the peninsula.
    { kind: "fill", data: { type: "sand", x0: 18, y0: 60, x1: 88, y1: 68 } },
    { kind: "fill", data: { type: "water", x0: 14, y0: 68, x1: 92, y1: 104 } },

    // A small jetty reaching out from the shore near the fisherman.
    { kind: "fill", data: { type: "bridge", x0: 48, y0: 65, x1: 52, y1: 76 } },

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
