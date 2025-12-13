import crypto from "crypto";
import { prisma } from "./prisma.js";

const SESSION_COOKIE = "pm_session";

export function sessionCookieName() {
  return SESSION_COOKIE;
}

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

export async function getSessionFromReq(req) {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  const token = match?.[1];
  if (!token) return null;

  const session = await prisma.session.findUnique({ where: { token }, include: { user: true } });
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() < Date.now()) return null;

  return session;
}

export function setSessionCookie(res, token) {
  // 30 days
  const maxAge = 60 * 60 * 24 * 30;
  res.setHeader("Set-Cookie", `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax`);
}

export function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
}
