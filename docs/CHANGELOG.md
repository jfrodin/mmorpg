# CHANGELOG.md

## 2026-09-16

- Projektet initierat. Vision, produktionsregler och v0.1-scope diskuterade och beslutade med PO.
- Grunddokumentation skapad: CLAUDE.md, GAME_DESIGN.md, ARCHITECTURE.md, WORLD.md, CONTENT_GUIDE.md, ROADMAP.md.
- Beslut: inget permadeath, PvP ej implementerat i v0.1 (arkitekturen stänger inte dörren), ingen monetization, lokal/närhetsbaserad chat, tech-stack godkänd som arbetsstack (TS/Vite/Canvas/Node/WebSocket/Postgres/Drizzle).
- Hosting: kollegans server (Kubernetes + självhostat Gitea/CI, se ARCHITECTURE.md) — exakt deploy-metod avgörs senare, bygger portabelt med Docker under tiden.
- Geografikoncept ("Ö-staden"), mysteriekoncept ("Ljusen ute på ön") och visuell riktning ("nordisk vektor" + noise) godkända av PO och flyttade till CANON i WORLD.md.
- M0 implementerat och committat: Vite/TS-klient, parametrisk karaktär, procedurellt texturerat golv, WASD-rörelse.

## 2026-09-16 (M1)

- M1 implementerat: `server`-paket (Express + TS), `shared`-paket för delade typer (`AppearanceDescriptor`, `Character`).
- Databas: Neon (cloud Postgres, region Frankfurt/eu-central), schema via Drizzle ORM (`accounts`, `characters`), migrationer körda.
- Auth: enkel username/password-registrering och inloggning, session via httpOnly JWT-cookie, lösenord hashat med bcrypt.
- Endpoints: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/character/me`, `/api/character` (skapa), `/api/character/position` (spara).
- Klient: login/registrerings-overlay, karaktärsskapande (namn), position laddas vid start och sparas periodiskt (var 3:e sekund vid rörelse) samt vid stängning (`sendBeacon`).
- Säkerhetsval: drizzle-orm uppgraderad direkt vid install pga en SQL-injection-advisory (GHSA-gpj5-g38j-94v9) i äldre version.
- Känt: serverns produktions-build är inte löst än (körs via tsx, inte kompilerad dist) — se ARCHITECTURE.md.

## 2026-09-16 (uppdatering)

- PO godkände Ö-staden-konceptet, mysteriet och visuell riktning i sin helhet.
- Beslut: ortnamn, sjönamn och spelets titel ska INTE fastställas i förväg utan växa fram organiskt under utvecklingen. Generiska platshållare (`staden`, `sjön`, `ön`) används i kod/content tills dess — se WORLD.md.
