import crypto from "crypto";
import { parse, serialize } from "cookie";

const SESSION_COOKIE = "session_id";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const SECRET = process.env.AUTH_SECRET || "dev-secret-change-me";

function sign(value) {
  return crypto
    .createHmac("sha256", SECRET)
    .update(value)
    .digest("hex");
}

export function createSession(res, userId) {
  const payload = `${userId}.${sign(userId)}`;

  const cookie = serialize(SESSION_COOKIE, payload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  res.setHeader("Set-Cookie", cookie);
}

export function clearSession(req, res) {
  const cookie = serialize(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  res.setHeader("Set-Cookie", cookie);
}

export function getSession(req) {
  const cookies = parse(req.headers.cookie || "");
  const raw = cookies[SESSION_COOKIE];

  if (!raw) return null;

  const [userId, signature] = raw.split(".");
  if (!userId || !signature) return null;

  if (sign(userId) !== signature) return null;

  return {
    user: { id: userId },
  };
}
