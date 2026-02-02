/**
 * Verifies Authorization header for cron endpoints.
 *
 * Works with both:
 * - Request (App Router route handlers)
 * - NextRequest (middleware / edge)
 */
export function requireCronAuth(
  req: Request
): { ok: boolean; error?: string } {
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