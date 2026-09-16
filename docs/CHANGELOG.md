# CHANGELOG.md

## 2026-09-16 (M3)

- M3 implementerat: karaktärsskapande har nu en färgväljare (jacka/byxor/hy/hår) med live-förhandsvisning på en liten canvas, istället för att alla karaktärer fick samma standardutseende.
- Även fixat under samma spårning: canvas z-index-krock som gjorde inloggningsformuläret oklickbart i en andra browser-session, tydligare/svenska felmeddelanden vid registrering/inloggning, samt en kant-pil som pekar mot spelare utanför synhåll (ingen orientering fanns annars i den öppna, landmärkeslösa världen).

## 2026-09-16 (M2)

- M2 implementerat: realtids-multiplayer via Socket.IO. Delat protokoll i `shared/src/protocol.ts` (`move`/`world_snapshot`/`player_joined`/`player_moved`/`player_left`).
- Server: socket-autentisering återanvänder samma session-cookie som REST-API:t (verifierar JWT, slår upp karaktär). In-memory register över anslutna spelare (`Map<accountId, RemotePlayerState>`), broadcastar join/move/leave till övriga klienter.
- Klient: renderar andra spelares karaktärer och namnbrickor (nu även för den egna spelaren — "namn visas ovanför karaktären" från M0-kravet). Rörelse broadcastas throttlat (~10 Hz) medan spelaren rör sig.
- Verifierat med ett tvåspelar-testskript mot den riktiga servern: anslutning, world-snapshot (inkl. redan anslutna spelare), join-, move- och leave-events bekräftade end-to-end.

## 2026-09-16 (bugfix)

- Fixade en renderingsbugg där marken bara målades i nedre högra delen av skärmen (tile-uträkningen tog inte hänsyn till att spelaren ritas i skärmens mitt). Bekräftat åtgärdat av PO.

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
