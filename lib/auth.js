import crypto from "crypto";
import { serialize } from "cookie";

/**
 * Generate a secure random token
 */
export function randomToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Set session cookie after auth
 */
export function setSessionCookie(res, sessionToken) {
  const cookie = serialize("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  res.setHeader("Set-Cookie", cookie);
}

/**
 * Read session from request
 */
export function getSessionFromReq(req) {
  const cookies = req.headers.cookie;
  if (!cookies) return null;

  const match = cookies.match(/session=([^;]+)/);
  return match ? match[1] : null;
}
