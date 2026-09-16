import { Router } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { accounts } from "../db/schema";
import { issueSession, clearSession } from "../auth/session";

export const authRouter = Router();

function isValidUsername(username: unknown): username is string {
  return typeof username === "string" && /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

function isValidPassword(password: unknown): password is string {
  return typeof password === "string" && password.length >= 8 && password.length <= 200;
}

authRouter.post("/register", async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!isValidUsername(username)) {
    res.status(400).json({
      error: "Användarnamn måste vara 3-20 tecken (bokstäver, siffror, understreck).",
    });
    return;
  }
  if (!isValidPassword(password)) {
    res.status(400).json({ error: "Lösenordet måste vara minst 8 tecken." });
    return;
  }

  const existing = await db.query.accounts.findFirst({
    where: eq(accounts.username, username),
  });
  if (existing) {
    res.status(409).json({ error: "Användarnamnet är upptaget." });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const id = crypto.randomUUID();

  await db.insert(accounts).values({ id, username, passwordHash });

  issueSession(res, { accountId: id });
  res.status(201).json({ accountId: id, username });
});

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!isValidUsername(username) || !isValidPassword(password)) {
    res.status(400).json({ error: "Fel användarnamn eller lösenord." });
    return;
  }

  const account = await db.query.accounts.findFirst({
    where: eq(accounts.username, username),
  });
  if (!account) {
    res.status(401).json({ error: "Fel användarnamn eller lösenord." });
    return;
  }

  const valid = await bcrypt.compare(password, account.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Fel användarnamn eller lösenord." });
    return;
  }

  issueSession(res, { accountId: account.id });
  res.json({ accountId: account.id, username: account.username });
});

authRouter.post("/logout", (_req, res) => {
  clearSession(res);
  res.status(204).send();
});
