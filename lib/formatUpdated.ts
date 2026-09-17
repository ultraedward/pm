/**
 * Relative "how stale is this" label, shared by every page that shows a
 * price. Since prices now come from the once-daily cron snapshot rather
 * than a live fetch per pageview (see lib/prices/fetchSpotPrices.ts), a
 * bare clock time ("Updated 3:42 PM") is misleading — it implies "just
 * now" with no way to tell if it's from today or yesterday. Relative
 * phrasing stays honest at whatever cadence the cron actually runs.
 */
export function formatUpdated(date: Date | string | null): string {
  if (!date) return "Updating…";
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const diffH  = diffMs / 1000 / 60 / 60;
  if (diffH < 1)  return "Updated just now";
  if (diffH < 24) return `Updated ${Math.floor(diffH)}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "Updated yesterday";
  return `Updated ${diffD}d ago`;
}
