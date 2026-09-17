# GAME_DESIGN.md — Aktuell gameplay-design

Status: v0.1-planering. Uppdateras löpande i takt med implementation.

## Kärnkänsla

bekant → avvikande → mystiskt → okänt

Spelet ska initialt kunna misstas för att vara helt normalt: svensk nutid, mobiltelefoner, bilar, vanliga jobb. Ingen fantasy-signalering.

## Spelaridentitet

Spelare börjar som vanliga invånare, inte hjältar/klasser/magiker. Identitet växer fram ur vad spelaren faktiskt gör (fiskar mycket → blir skicklig fiskare, osv).

## Sessionslängd

Spelet ska fungera i 2–10 minuters sessioner (öppna → göra något meningsfullt → få progression/information → stänga) men också stödja längre sessioner. Detta styr UX-beslut som chat-scope, hur snabbt man kommer in i spelet, och att progression sker i små, tydliga steg.

## Progression: skill-based

Inga traditionella klasser. Skills (exakt lista beslutas efter hand, kandidater):
Exploration, Fishing, Foraging, Hunting, Survival, Crafting, Cooking, Trading, Investigation, Knowledge, Combat.

**v0.1 implementerar endast: Foraging** (plocka bär/svamp/växter i skogen). Övriga skills läggs till i senare versioner.

Foraging är fullt server-auktoritativt: resursnoder (`shared/src/resources.ts`) har fast position, item-typ och respawn-tid; klienten kan bara begära skörd via `harvest`-eventet, servern validerar avstånd och cooldown, uppdaterar inventory/xp i databasen och broadcastar nodens depleted/respawned-state till alla anslutna. Nivå visas som `xp / 25 + 1` (rent kosmetisk formel, kan justeras fritt utan protokolländring).

## Exploration-filosofi

Ingen quest-marker-design. Information ges via dialog, miljö, föremålsbeskrivningar, rykten — spelaren väljer själv att agera på ledtrådar eller inte. Se CONTENT_GUIDE.md för konkreta riktlinjer.

## Multiplayer-scope (v0.1)

- Flera spelare i samma world-instans, ser varandras position/appearance i realtid
- **Chat: lokal/närhetsbaserad**, inte global — förstärker känslan av en delad, fysisk värld snarare än en Discord-kanal. Global chat kan läggas till senare om behov uppstår.
- Persistent karaktär (position, namn, appearance, inventory, skills) i databasen
- Disconnect/reconnect ska fungera utan att spelaren tappar state

## Combat & död

- **Permadeath: uteslutet helt.** Passar inte tonen eller sessionslängden.
- **Combat-modell: inte beslutad, inte implementerad i v0.1.** Hot i spelet hanteras initialt genom undvikande/miljö snarare än strid. Designas separat när/om behovet uppstår.
- **PvP: inte implementerat i v0.1.** Möjligen aktuellt senare (oklart, ej beslutat) — arkitekturen ska inte aktivt stänga dörren, men inget PvP-specifikt byggs i förväg.

## Monetization

Inte relevant för projektet (privat spel för en mindre grupp). Ingen design eller kod ägnas åt detta.

## Tid och väder

Servern är enda auktoritet för dygnscykel och väder — alla spelare upplever samma tid/väder samtidigt (delad värld, §16/§18).

- **Dygnscykel:** 8 minuter per fullt varv (`DAY_LENGTH_MS`), stiliserad (en topp/en dal, inte en realistisk 24-timmarskurva). Servern skickar bara en referenspunkt (`dayStartedAt` + `dayLengthMs`) vid anslutning — klienten räknar ut aktuell tid lokalt varje frame för mjuk animation utan konstant nätverkstrafik. En tydlig UI-indikator (uppe till vänster: 🌙/🌆/☀️ + väder) visar alltid aktuellt läge, utöver den visuella ljussättningen.
- **Väder:** växlar slumpmässigt mellan `clear` och `fog` var 3:e–8:e minut (`weather_changed`-event, broadcastat direkt vid ändring, inte bara periodiskt).
- **Dimma är inte bara kosmetisk:** den sänker faktiskt siktavståndet för andra spelare (`FOG_VISIBILITY_RADIUS`) — spelare utanför den radien visas som kant-pilar istället för synliga karaktärer, även om de tekniskt skulle rymmas inom skärmen. Matchar §18-kravet att väder ska påverka spelbarheten, inte bara se ut på ett visst sätt.

## v0.1 vertical slice — scope

Se ROADMAP.md för milestones. Sammanfattat innehåll:

- Litet stadsområde + väg ut + litet skogsområde + del av sjöstrand
- Karaktärsskapande (parametrisk appearance), rörelse, persistent position
- Multiplayer: position-sync, synliga spelare, lokal chat
- 2–4 NPC:er, 3–5 interagerbara föremål, enkel inventory
- Skill: Foraging
- Dag/natt-cykel, enkel väder (klart ↔ dimma)
- Ett litet mysterium (se WORLD.md, PROPOSAL tills godkänt)

## Uttryckligen INTE i v0.1

Stor värld, avancerad combat, guilds, raids, hundratals items, avancerad crafting, housing, auction house, vehicles, stora quest chains, avancerad character creator, full ekonomi, komplett lore, mobilapp.
