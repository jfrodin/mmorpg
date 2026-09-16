# ROADMAP.md — Utvecklingsplan v0.1

Varje milestone ska vara spelbar/testbar av PO innan nästa påbörjas.

**Status: v0.1 vertical slice klar (M0–M10), 2026-09-16.** Se CHANGELOG.md för detaljer per milstolpe.

- [x] **M0 — Skeleton**: repo, build-pipeline, tom canvas som renderar en spelare som kan flyttas med tangentbord (ingen server än)
- [x] **M1 — Server + persistence**: Node-server, Postgres (Neon), login/karaktärsskapande, position sparas och laddas
- [x] **M2 — Multiplayer core**: WebSocket-synk (Socket.IO), flera klienter ser varandra röra sig, disconnect/reconnect
- [x] **M3 — Parametrisk appearance**: karaktärsgenerator, val vid skapande, renderas korrekt för alla spelare
- [x] **M4 — Världsyta**: stadstorg + väg + skog + strand som tile-baserad karta, kollision, kamera
- [x] **M5 — Chat**: enkel lokal/närhetsbaserad textchatt
- [x] **M6 — NPC + dialog**: statiska NPC:er, enkel dialogruta
- [x] **M7 — Foraging + inventory**: gatherable resurser, inventory-UI, server-validerad pickup
- [x] **M8 — Dag/natt + väder**: tidscykel, ljus-overlay, ett väderläge (dimma)
- [x] **M9 — Mystery-implementation**: "Ljusen ute på ön" implementerat (koncept redan godkänt i WORLD.md)
- [x] **M10 — Polish-pass**: ljud (footsteps, ambience, UI), buggfixar, grundläggande balansering

## Efter v0.1 (ej detaljplanerat)

Fler skills, större värld (landsbygd, fjäll, fler öar), fler mysterier, ev. handel/ekonomi, ev. crafting, exakt deploy-lösning (docker-compose vs. Gitea CI → Kubernetes hos kollegans server, se ARCHITECTURE.md).
