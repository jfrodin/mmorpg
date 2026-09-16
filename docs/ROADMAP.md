# ROADMAP.md — Utvecklingsplan v0.1

Varje milestone ska vara spelbar/testbar av PO innan nästa påbörjas.

- [ ] **M0 — Skeleton**: repo, build-pipeline, tom canvas som renderar en spelare som kan flyttas med tangentbord (ingen server än)
- [x] **M1 — Server + persistence**: Node-server, Postgres (Neon), login/karaktärsskapande, position sparas och laddas
- [x] **M2 — Multiplayer core**: WebSocket-synk (Socket.IO), flera klienter ser varandra röra sig, disconnect/reconnect
- [x] **M3 — Parametrisk appearance**: karaktärsgenerator, val vid skapande, renderas korrekt för alla spelare
- [x] **M4 — Världsyta**: stadstorg + väg + skog + strand som tile-baserad karta, kollision, kamera
- [x] **M5 — Chat**: enkel lokal/närhetsbaserad textchatt
- [x] **M6 — NPC + dialog**: statiska NPC:er, enkel dialogruta
- [ ] **M7 — Foraging + inventory**: gatherable resurser, inventory-UI, server-validerad pickup
- [ ] **M8 — Dag/natt + väder**: tidscykel, ljus-overlay, ett väderläge (dimma)
- [ ] **M9 — Mystery-implementation**: efter PO-godkännande av koncept (se WORLD.md PROPOSAL), bygg observations-/ledtrådselement
- [ ] **M10 — Polish-pass**: ljud (footsteps, ambience, UI), buggfixar, grundläggande balansering

## Efter v0.1 (ej detaljplanerat)

Fler skills, större värld (landsbygd, fjäll, fler öar), fler mysterier, ev. handel/ekonomi, ev. crafting, exakt deploy-lösning (docker-compose vs. Gitea CI → Kubernetes hos kollegans server, se ARCHITECTURE.md).
