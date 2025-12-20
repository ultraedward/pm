import crypto from "crypto";
import { serialize } from "cookie";

export function randomToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function createSession() {
  return crypto.randomBytes(32).toString("hex");
}

export function setSessionCookie(res, token) {
  const cookie = serialize("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  res.setHeader("Set-Cookie", cookie);
}

export function clearSession(res) {
  const cookie = serialize("session", "", {
    path: "/",
    maxAge: -1,
  });

  res.setHeader("Set-Cookie", cookie);
}

export function getSession(req) {
  const cookies = req.headers.cookie;
  if (!cookies) return null;

  const match = cookies.match(/session=([^;]+)/);
  return match ? match[1] : null;
}

export function getSessionFromReq(req) {
  return getSession(req);
}
