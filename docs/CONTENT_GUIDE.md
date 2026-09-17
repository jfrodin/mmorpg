# CONTENT_GUIDE.md — Regler för tonalitet, namn, NPC:er, mysterier

## Grundton

Svensk/nordisk vardag. Trovärdigt, igenkännbart, lätt underdrivet — inte dramatiskt eller högtravande. Humor får finnas, men torr/vardaglig, inte parodisk.

## Språk

All text spelaren faktiskt ser (UI, dialog, felmeddelanden, knapptexter, skill-/föremålsnamn) ska vara på svenska — inga engelska kvarlevor från design-/spec-terminologi (t.ex. fick skillen "Foraging" internt engelskt kod-namn men visas som "Insamling" i UI, se GAME_DESIGN.md). Engelska är okej i kod, variabelnamn och interna nycklar, aldrig i det spelaren läser.

## Namnkonventioner

- Ortnamn: sammansatta, plausibla svenska mönster (kvarn-, björn-, tjärn-, -vik, -sund, -fors, -åsen, -by). Kopiera aldrig verkliga specifika ortnamn i Jämtland/Östersund rakt av.
- Personnamn: vanliga svenska för- och efternamn för NPC:er, inga symboliska/betydelsebärande namn ("Mr. Shadow" osv.) — det bryter genast den vardagliga tonen.

## Explicit förbjudet (utan senare, separat PO-beslut)

Goblins, orcher, traditionella fantasy-troll, elves, fireballs, mana, fantasy-rustningar, traditionella RPG-klasser, fantasy taverns, "kill 10 wolves"-quests.

## Informationsdesign

- Inga quest-markers, inga stora utropstecken, ingen minimap-objectives-lista, inga glowing objects, inga exakta "gå hit och gör X"-instruktioner.
- Information ges via: dialog, miljö, föremålsbeskrivningar, tidningar/anteckningar, ljud, visuella ledtrådar, rykten, andra spelare.
- Mystiska företeelser ska initialt kunna ha BÅDE naturliga och övernaturliga förklaringar. Lås aldrig tolkningen i tidig content.

## Quest-design

Undvik traditionell "QUEST STARTED / 0/1"-struktur helt. En NPC-kommentar är en ledtråd, inte en uppgift. Spelaren väljer själv att agera, ignorera, återvända senare, eller berätta för andra.

## NPC-design

NPC:er ska kännas som människor med eget liv, inte quest-dispensers. Dialog ska kunna innehålla information som inte är direkt "användbar" — vardagsprat, lokala referenser, åsikter — för att bygga trovärdighet.

## Mysterier — checklista innan implementation

Ett nytt mysterium ska:
- kunna börja vardagligt
- vara möjligt att missa helt
- kräva någon form av aktiv observation av spelaren
- involvera miljön (inte bara dialog)
- gå att diskutera mellan spelare utan spoilers av hela systemet
- INTE förklara världens övergripande mysterium
- INTE kräva avancerad combat

Nya mysterier föreslås alltid som PROPOSAL i WORLD.md och diskuteras med PO innan implementation (se §25).
