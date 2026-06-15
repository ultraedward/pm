/**
 * @deprecated — Not called by anything. The real cron runs via
 * /api/update-prices which calls lib/alerts/engine.ts directly.
 * Kept to avoid breaking any future imports; safe to delete.
 */
export async function runCronJob() {
  return { ok: true };
}
