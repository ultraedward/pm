import crypto from "crypto";
import { serialize } from "cookie";

/**
 * Generate secure random token
 */
export function randomToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Create a session token
 */
export function createSession() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Set session cookie
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
 * Clear session cookie
 */
export function clearSession(res) {
  const cookie = serialize("session", "", {
    path: "/",
    maxAge: -1,
  });

  res.setHeader("Set-Cookie", cookie);
}

/**
 * Get session from request cookies
 */
export function getSession(req) {
  const cookies = req.headers.cookie;
  if (!cookies) return null;

  const match = cookies.match(/session=([^;]+)/);
  return match ? match[1] : null;
}

/**
 * Alias for backward compatibility
 */
export function getSessionFromReq(req) {
  return getSession(req);
}
