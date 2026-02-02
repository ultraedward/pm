import { NextRequest } from "next/server";

/**
 * Verifies Authorization header for cron endpoints.
 *
 * Expected header:
 *   Authorization: Bearer <CRON_SECRET>
 */
export function requireCronAuth(req: NextRequest): {
  ok: boolean;
  error?: string;
} {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { ok: false, error: "missing_authorization" };
  }

  const token = authHeader.replace("Bearer ", "").trim();

  if (!process.env.CRON_SECRET) {
    console.error("❌ CRON_SECRET is not set");
    return { ok: false, error: "server_misconfigured" };
  }

  if (token !== process.env.CRON_SECRET) {
    return { ok: false, error: "unauthorized" };
  }

  return { ok: true };
}