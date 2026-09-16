import { Router } from "express";
import { eq } from "drizzle-orm";
import type { AppearanceDescriptor } from "shared";
import { db } from "../db/client";
import { characters } from "../db/schema";
import { requireAuth, type AuthedRequest } from "../auth/session";

export const characterRouter = Router();
characterRouter.use(requireAuth);

function isValidName(name: unknown): name is string {
  return typeof name === "string" && /^[a-zA-ZåäöÅÄÖ0-9 _-]{2,20}$/.test(name);
}

function isValidAppearance(appearance: unknown): appearance is AppearanceDescriptor {
  if (typeof appearance !== "object" || appearance === null) return false;
  const a = appearance as Record<string, unknown>;
  return (
    typeof a.jacketColor === "string" &&
    typeof a.pantsColor === "string" &&
    typeof a.skinColor === "string" &&
    typeof a.hairColor === "string"
  );
}

characterRouter.get("/me", async (req: AuthedRequest, res) => {
  const character = await db.query.characters.findFirst({
    where: eq(characters.accountId, req.accountId!),
  });
  if (!character) {
    res.status(404).json({ error: "no character" });
    return;
  }
  res.json(character);
});

characterRouter.post("/", async (req: AuthedRequest, res) => {
  const { name, appearance } = req.body ?? {};

  if (!isValidName(name)) {
    res.status(400).json({ error: "Namnet måste vara 2-20 tecken." });
    return;
  }
  if (!isValidAppearance(appearance)) {
    res.status(400).json({ error: "Ogiltigt utseende." });
    return;
  }

  const existing = await db.query.characters.findFirst({
    where: eq(characters.accountId, req.accountId!),
  });
  if (existing) {
    res.status(409).json({ error: "character already exists" });
    return;
  }

  const id = crypto.randomUUID();
  await db.insert(characters).values({
    id,
    accountId: req.accountId!,
    name,
    x: 0,
    y: 0,
    appearance,
  });

  const character = await db.query.characters.findFirst({
    where: eq(characters.id, id),
  });
  res.status(201).json(character);
});

characterRouter.patch("/position", async (req: AuthedRequest, res) => {
  const { x, y } = req.body ?? {};

  if (typeof x !== "number" || typeof y !== "number" || !Number.isFinite(x) || !Number.isFinite(y)) {
    res.status(400).json({ error: "invalid position" });
    return;
  }

  const result = await db
    .update(characters)
    .set({ x, y, updatedAt: new Date() })
    .where(eq(characters.accountId, req.accountId!))
    .returning({ id: characters.id });

  if (result.length === 0) {
    res.status(404).json({ error: "no character" });
    return;
  }

  res.status(204).send();
});
