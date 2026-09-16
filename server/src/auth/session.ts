import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const SESSION_COOKIE = "session";
const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function getJwtSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return secret;
}

export interface SessionPayload {
  accountId: string;
}

export function issueSession(res: Response, payload: SessionPayload): void {
  const token = jwt.sign(payload, getJwtSecret(), { expiresIn: "30d" });
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_MS,
  });
}

export function clearSession(res: Response): void {
  res.clearCookie(SESSION_COOKIE);
}

export interface AuthedRequest extends Request {
  accountId?: string;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) {
    res.status(401).json({ error: "not authenticated" });
    return;
  }
  try {
    const payload = jwt.verify(token, getJwtSecret()) as SessionPayload;
    req.accountId = payload.accountId;
    next();
  } catch {
    res.status(401).json({ error: "invalid session" });
  }
}
