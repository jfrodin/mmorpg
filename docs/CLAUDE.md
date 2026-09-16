# CLAUDE.md — Produktionsregler

Detta dokument beskriver de permanenta produktionsreglerna för projektet.
Regler här ändras sällan och bara efter explicit beslut av Product Owner (PO).

## Roller

- **PO (människan):** product owner, game director, testare, beslutsfattare. Skriver ingen kod, ritar ingen grafik, spelar in inget ljud.
- **Claude:** ansvarar för all produktion — kod, arkitektur, databas, multiplayer, gameplay-system, UI, grafik, animation, VFX, ljud, procedural generation, tooling, tester, dokumentation.

## Asset-regel (absolut)

Projektet får INTE bero på manuellt producerade eller köpta externa assets (PNG/JPG/spritesheets/3D-modeller/ljudfiler/asset packs). All visuell och auditiv produktion sker programmatiskt (Canvas/SVG/CSS/WebGL vid behov, Web Audio API).

## Server-auktoritet (absolut)

Klienten är aldrig betrodd källa för inventory, currency, XP, item ownership eller world state. Server validerar alla sådana förändringar.

## Canon-regel

Allt world-innehåll delas i tre kategorier, och det ska alltid framgå vilken:

- **CANON** — godkända fakta om världen (godkända av PO).
- **PROPOSAL** — idéer som ännu inte godkänts.
- **IMPLEMENTED** — funktioner/content som faktiskt finns i spelet just nu.

Claude får inte improvisera fram ny lore som om den vore etablerad fakta. Ny lore föreslås alltid som PROPOSAL i WORLD.md och väntar på PO-godkännande innan den blir CANON.

## Beslut som kräver PO-godkännande

Följande fastställs ALDRIG permanent utan explicit PO-beslut:
spelets namn, stadens namn, sjöns namn, den yttersta sanningen bakom mysteriet, supernatural mythology, stora factions, combatmodell, död/permadeath, PvP, monetization, slutlig grafisk stil, större förändringar av kärnvisionen.

## Arbetsmetod för större features

1. Förstå problemet
2. Kontrollera befintlig arkitektur och dokumentation
3. Föreslå lösning
4. Identifiera konsekvenser
5. Implementera
6. Testa
7. Uppdatera relevant dokumentation

Skriv inte om fungerande system utan anledning. Introducera inte nya frameworks/dependencies utan tydlig, motiverad nytta.

## Tekniska principer

Prioritetsordning: enkelhet → maintainability → snabb iteration → tydlig client/server-separation → data-driven content → låg driftkostnad. Varje större tekniskt val ska kunna motiveras av spelets faktiska behov — inte byggas i förväg "för säkerhets skull" (se t.ex. beslutet att INTE bygga PvP-specifik kod i v0.1 trots att PvP kan bli aktuellt senare).

## Övriga permanenta dokument

- **GAME_DESIGN.md** — aktuell gameplay-design
- **ARCHITECTURE.md** — tekniska beslut och systemarkitektur
- **WORLD.md** — CANON/PROPOSAL worldbuilding
- **CONTENT_GUIDE.md** — regler för tonalitet, namn, NPC:er, mysterier
- **ROADMAP.md** — nuvarande utvecklingsplan
- **CHANGELOG.md** — betydande implementerade förändringar
