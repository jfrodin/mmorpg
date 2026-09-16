# ARCHITECTURE.md — Tekniska beslut och systemarkitektur

## Stack

| Lager | Val |
|---|---|
| Client runtime | TypeScript + Vite |
| Rendering | HTML5 Canvas 2D (WebGL/shaders läggs till senare, bara om ett konkret effektbehov motiverar det) |
| UI-overlay | DOM + CSS ovanpå canvas (inventory, chat, dialog) |
| Ljud | Web Audio API, syntes-/noise-baserade generatorer — inga ljudfiler |
| Server | Node.js + TypeScript |
| Realtime | WebSocket (Socket.IO — inbyggd reconnect-hantering) |
| Auth | Sessionsbaserad (enkelt, inga osäkra genvägar) |
| Databas | PostgreSQL |
| ORM | Drizzle ORM |
| Repo | Monorepo, npm workspaces |
| Deploy-target | Docker (portabelt — fungerar mot docker-compose såväl som ev. framtida Kubernetes-deploy hos kollegans server, se nedan) |

## Monorepo-layout

```
client/    Vite + TS + Canvas-rendering + UI-overlay + audio + net
server/    Node + TS: game loop, websocket-handlers, auth, db
shared/    Delade typer + protokoll (character, item, skill, world event, websocket-meddelanden)
world/     Data-driven content (regions, locations, npcs, items, encounters, mysteries, events)
docs/      Se CLAUDE.md för listan
```

`shared/` importeras av både `client` och `server` så att protokoll och domänmodeller aldrig kan divergera.

## Client-arkitektur

- Canvas-baserad scene graph: world tiles → entities → partiklar → väder-overlay, i den ordningen
- Parametrisk karaktärsgenerator: rena funktioner som tar en `AppearanceDescriptor` (JSON) och ritar lager-för-lager (kropp → kläder → hår → utrustning)
- Client-side movement prediction med server-reconciliation (inte fullt lockstep — omotiverat för 5–50 spelare)
- Klientens state är alltid en spegling av serverns auktoritativa state, aldrig källan

## Server-arkitektur

- Auktoritativ tick-baserad game loop (positions-sync ~10–20 Hz, world state lägre frekvens)
- WebSocket-lager: rörelse, chat, interaktioner
- HTTP-lager: login, karaktärsskapande, ev. admin-tooling
- Alla skrivningar till inventory/currency/skills går via server-validerade actions. Klienten skickar aldrig direkta DB-mutationer.

## Databas

Tabeller (enligt speccens §22-uppdelning): `accounts`, `characters`, `inventories`, `item_definitions` (referens till content, inte källan), `character_skills`, `world_state`, `npc_definitions` (referens), `locations` (referens), `events`, `discoveries`.

**Content vs. instans-data:** statiskt innehåll (item-definitioner, NPC-definitioner, location-metadata, mystery-steg) lever som TS/JSON-filer i `world/` och laddas in i minnet vid serverstart — inte som handredigerade DB-rader. Databasen lagrar bara spelarnas state och dynamiska instanser (vem äger vad, vad har hänt, vad är upptäckt).

## Procedural graphics

- **Karaktärer:** parametrisk lagerkomposition, se ovan
- **Miljö:** tile-baserad karta + procedurell dekoration (träd/stenar/gräs) genererad från en seed per region — deterministiskt, inte slumpmässigt vid varje render
- **Väder/ljus:** canvas-overlay-lager (dimma = alpha-gradient, regn = partikelsystem, dag/natt = färgton-overlay)

## Audio-arkitektur

Central `SoundEngine` som bygger oscillator-/noise-grafer per effekttyp med parametrar (pitch, duration, filter) istället för samples.

## Hosting / deploy

Kollegans server (drift av "Ruben") kör i praktiken **Kubernetes** med ett självhostat Gitea (`gitea.madnuss.com`) för både git och CI (Gitea Actions bygger Docker-images, pushar till Gitea:s registry, triggar pod-restart). Ett tidigare projekt (FotbollsTipset) hade även en enklare docker-compose-fallback dokumenterad separat.

**Beslut för MMORPG v0.1:** bygg och paketera som en portabel Docker-container (samma mönster som FotbollsTipset: multi-stage Dockerfile, migrationer körs vid uppstart). Exakt deploy-väg (docker-compose vs. Gitea CI → Kubernetes) avgörs när vi når deploy-steget — ingen kod låses till den ena eller andra. Öppna frågor att stämma av med Ruben då: WebSocket-stöd i klustrets ingress (sticky sessions/upgrade-headers), samt om databasen ska köra i klustret eller externt (t.ex. Neon, som i FotbollsTipset).

## Säkerhetsprinciper

Ingen client-authoritative inventory/currency, ingen osanitiserad chat, inga secrets i frontend-kod, ingen godtycklig DB-access från klienten. Ingen enterprise-nivå-överdesign för en prototyp av den här storleken.
