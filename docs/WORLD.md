# WORLD.md — Worldbuilding

Detta dokument innehåller ENDAST etablerad lore (CANON) och tydligt märkta förslag (PROPOSAL). Ingen ny canon skapas här utan att vara dokumenterad som sådan. Se CLAUDE.md för canon-regeln.

## CANON

- Världen utspelar sig i en helt fiktiv svensk stad och dess omgivningar, inspirerad av (men inte en kopia av) Östersund/Jämtland.
- Utgångsläge: svensk nutid — mobiltelefoner, bilar, internet, modern sjukvård, vanliga jobb. Ingen omedelbar fantasy-signalering.
- Grundgeografi ska kunna innehålla: staden, en stor sjö, skogar, öar, mindre samhällen, glesbygd, fjällterräng.
- Det finns något märkligt i världen. Den yttersta sanningen är INTE fastställd och ska inte improviseras fram (§10/§31).
- Övernaturliga fenomen, om de förekommer, ska vara sällsynta och betydelsefulla — inte generisk fantasy (goblins/orcher/mana/etc. är uteslutet).

### Geografikoncept (godkänt av PO 2026-09-16)

Staden ligger delvis på en halvö/liten ö ut i sjön, förbunden med fastlandet via en bro. Fiske är en central del av vardagen, hamnen är stadens naturliga centrum. Fler öar i sjön (obebodda eller glesbefolkade) fungerar som naturliga, tidiga explorationsmål.

### Mysterium (koncept godkänt av PO 2026-09-16)

Nattetid syns ibland ett svagt ljus på en av de obebodda öarna i sjön — inte varje natt, bara vid vissa förhållanden (tid + väder). En NPC vid hamnen nämner det som skrönor. Inget UI-quest-tracking; spelare upptäcker mönstret själva och jämför iakttagelser.

Uppfyller kraven i §25: börjar vardagligt, går att missa, kräver observation, involverar miljön, går att diskutera spelare emellan, förklarar INTE det stora mysteriet, ingen combat.

### Visuell riktning (godkänt av PO 2026-09-16)

"Nordisk vektor" som bas (rena geometriska former, mjuka gradienter, tydliga silhuetter, begränsad palett) med procedurell noise-textur på terräng/vegetation för organisk känsla. Se ARCHITECTURE.md för teknisk implementation. Detta är startpunkten för iteration, inte ett i sten huggen slutgiltig stil — kan förfinas löpande.

## Namn — medvetet olösta

PO vill att ortnamn, sjönamn och spelets titel **växer fram organiskt** snarare än fastställs i förväg. Inga namnförslag ska betraktas som ens preliminärt beslutade.

Tills namn finns används generiska platshållare i kod och content: `staden`, `sjön`, `ön`/`öarna`, `hamnen`. Dessa är tekniska placeholders, inte canon-namn — döp aldrig om dem till ett påhittat namn utan att PO uttryckligen fört in det. Namn kan väckas till liv senare av vad som helst i processen (en NPC som råkar nämna det, ett kartfynd, ett beslut PO tar rakt av) — när det händer dokumenteras det här under CANON och koden uppdateras i en egen commit.

## IMPLEMENTED

- **v0.1 startområde** (klient-sida tile-karta, `client/src/world/starting-area.ts`, 170×110 rutor): ett litet torg (kullersten, möblerat med brunn/lyktstolpar/bänkar) med fem byggnader runt om, skog västerut med ett par stigar som går en bit in bland träden, en bit sjöstrand söderut med en brygga vid fiskaren, och ute på sjön en liten obebodd ö (mysteriet) och en mindre visuell holme.
- **Halvön/bron är nu byggd**, inte bara sjöstrand söderut som i den första v0.1-versionen: sjön omsluter torget/skogen på syd- OCH östsidan, och vägen österut korsar en bro (ny `bridge`-tiletyp, `client/src/world/types.ts`) för att nå den lantliga korsningen på andra sidan — realiserar den godkända halvö-geografin ovan, inte bara en platshållare. Fjärran landsbygd/fjäll utanför detta är fortfarande inte byggt.
- Nya karaktärer spawnar på torget (`SPAWN_POINT` i `shared/src/world.ts`).
- **Mysteriet "Ljusen ute på ön" är implementerat** (`shared/src/mystery.ts`): ön är avsiktligt oåtkomlig till fots (ingen bro, vatten blockerar) — ljuset kan bara *observeras* på håll, aldrig besökas, precis som konceptet kräver. Villkor: mörker (natt) + klart väder (inte dimma), och även då bara ~50% av nätterna (deterministiskt beräknat från den delade dygnscykeln, så alla spelare online ser exakt samma sak samma natt — ingen server-roundtrip, ingen extra nätverkstrafik). Ingen UI-markering, inget quest-tracking — bara en svag glöd man kan råka se eller missa, exakt som §25 kräver.
