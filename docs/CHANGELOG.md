# CHANGELOG.md

## 2026-09-16 (världsutbyggnad efter v0.1)

- Kartan utökad österut (120→170 rutor bred): vägen från torget fortsätter till en liten lantlig korsning med en gård (bostadshus + lada) och en ny NPC, Ingvar (lantbrukare) — matchar "landsbygd/gårdar" i den godkända geografin (§8), inget nytt PO-beslut krävt eftersom det bara fyller i redan godkänt konceptutrymme.
- Fortsätter på PO:s stående instruktion att självständigt bygga vidare på världen.

## 2026-09-16 (M10 — v0.1 vertical slice klar)

- M10 implementerat: ljud helt genererat via Web Audio API (`client/src/audio/SoundEngine.ts`) — inga ljudfiler. Fotsteg (varierad brusbaserad), UI-ljud vid chattmeddelande/dialog/skörd, och en tyst genererad vind-ambience som startar vid första användarinteraktion (krävs av webbläsarnas autoplay-policy).
- Balans/konsekvens-fix: dimmans siktbegränsning gäller nu även NPC:er och resursnoder, inte bara andra spelare — annars kunde man se en NPC 400 enheter bort i dimma men inte en spelare på samma avstånd.
- Full regressionskörning (multiplayer, chat, foraging) bekräftad grön efter alla M8–M10-ändringar.
- **v0.1 vertical slice är därmed komplett** — hela ursprungsscopet i GAME_DESIGN.md (M0–M10) implementerat, testat och pushat.

## 2026-09-16 (M9 + världsutbyggnad)

- M9 implementerat: mysteriet "Ljusen ute på ön" (redan CANON-godkänt koncept i WORLD.md). Kartan utökad (90→110 rutor hög) med en liten obebodd ö ute på sjön (ingen bro — avsiktligt oåtkomlig till fots) plus en mindre rent visuell holme.
- Ljuset syns bara vid mörker + klart väder, och även då bara ~50% av nätterna — beräknat deterministiskt av varje klient från den redan delade dygns-/väderstaten (`shared/src/mystery.ts`), så alla spelare online ser exakt samma natt utan någon extra serverkommunikation.
- Inget UI pekar ut ljuset. Ingen quest, ingen markör. Precis vad §25 efterfrågar: en möjlig-att-missa iakttagelse spelare kan jämföra sinsemellan.
- PO gav generellt godkännande att fortsätta expandera världen självständigt utan att fråga för varje steg.

## 2026-09-16 (M8)

- M8 implementerat: server-auktoritativ dygnscykel (20 min/varv) och väder (clear/fog, växlar var 3-8:e minut). Alla klienter delar samma tid/väder — servern skickar bara en referenspunkt, klienten räknar tid lokalt för mjuk animation.
- Ljus-overlay mörknar/ljusnar canvasen genom dygnet. Dimma har en faktisk spelmässig effekt, inte bara visuell: siktavståndet för andra spelare begränsas (`FOG_VISIBILITY_RADIUS`), de visas som kant-pilar istället för synliga karaktärer utanför den radien.
- Verifierat: `world_snapshot` innehåller `dayStartedAt`/`dayLengthMs`/`weather` korrekt vid anslutning.

## 2026-09-16 (M7)

- M7 implementerat: Foraging-skill + inventory, helt server-auktoritativt. Sex resursnoder i skogen (blåbär/kantareller/lingon, `shared/src/resources.ts`), plockbara med **E** inom räckhåll.
- Nya DB-tabeller: `inventory_items`, `character_skills` (migration `0001_lyrical_unus.sql`).
- Server validerar avstånd och cooldown per nod, upsertar mängd/xp i DB, broadcastar `node_depleted`/`node_respawned` till alla klienter så tillståndet syns lika för alla. Nya anslutningar får aktuellt depleted-state i `world_snapshot`.
- Klient: ny väska-panel uppe till höger (items + Foraging-nivå), resursnoder ritas gröna/bruna beroende på om de är plockade eller ej.
- Verifierat end-to-end mot den riktiga servern: lyckad skörd, blockerad omskörd på tömd nod, blockerad skörd utanför räckhåll, och att inventory/xp faktiskt persisteras.

## 2026-09-16 (M6)

- M6 implementerat: tre statiska NPC:er (`client/src/world/npcs.ts`) — Birgitta på torget, Sten vid skogsbrynet, Rune vid stranden. Tryck **E** inom räckhåll för att prata; dialogrutan cyklar igenom NPC:ns repliker vid upprepade tryck.
- Ingen quest-marker-logik — replikerna är bara vardaglig småprat, i linje med CONTENT_GUIDE.md. Runes rad om "ett ljus ute på ön om nätterna" är en avsiktlig, lågmäld koppling till det redan godkända mysteriekonceptet i WORLD.md (§25: skrönor, inte en quest).

## 2026-09-16 (M5)

- M5 implementerat: enkel närhetsbaserad textchatt. Server broadcastar bara ett meddelande till spelare inom 500 world units (`CHAT_RADIUS`) från avsändaren, inte globalt — matchar GAME_DESIGN.md-beslutet om lokal chat.
- Klient: tryck Enter för att öppna chattraden, Enter skickar, Esc avbryter. Meddelanden visas i en tonande logg nere till vänster.
- Server sanerar chattext (kontrolltecken bort, trim, 240 tecken-gräns).
- Tangentbordsrörelse pausas nu automatiskt medan man skriver i ett inputfält (chat eller annat), och nedtryckta tangenter nollställs vid fönster-blur för att undvika "fastnade" rörelsetangenter.
- Verifierat med ett tvåspelar-testskript: spelare inom radien fick meddelandet, spelare utanför fick det inte, avsändaren ser sitt eget meddelande.

## 2026-09-16 (M4)

- M4 implementerat: ersatte den oändliga procedurella gräsytan med en riktig tile-karta (`client/src/world/starting-area.ts`) — litet torg (kullersten) med fem byggnader runt om, väg österut, skogsområde västerut med strödda träd, sjöstrand (sand+vatten) söderut.
- Kollision tillagd (byggnader/träd/vatten blockerar, axel-separerad så spelaren glider längs väggar istället för att fastna).
- Nya karaktärer spawnar nu på torget (`SPAWN_POINT`, delad mellan klient och server via `shared/src/world.ts`) istället för (0,0).
- Dokumenterat i WORLD.md: detta är en liten del av den godkända Ö-stads-geografin, inte hela den — halvön/bron/öarna är kvar för senare.

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
