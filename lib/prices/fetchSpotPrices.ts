/**
 * Spot price reads — since prices are an input to Lode's tools (melt
 * calculator, portfolio tracker, dealer comparison) rather than a live
 * ticker in themselves, pages read the latest snapshot the daily cron
 * already wrote to the database instead of each independently hitting the
 * Cloudflare Worker / Yahoo Finance / goldprice.org on every pageview.
 *
 * Before this, every one of the ~14 pages that call fetchAllSpotPrices()
 * fetched live, on every request — up to 4 Worker calls per pageview, each
 * potentially cascading into up to 5 upstream calls (Yahoo x4 + goldprice.org)
 * on a cold cache. That's more load on free/undocumented sources than a
 * supporting-input feature justifies, and it bypassed the source-tagging and
 * health monitoring in lib/monitoring/priceHealth.ts entirely, since that
 * only ever ran inside the cron's write path. Reading from the same table
 * the cron writes and health-checks means every page now benefits from that
 * monitoring instead of just the once-daily write.
 *
 * lib/prices.ts's getLivePrices() (the actual live-fetch implementation) is
 * now only called from lib/priceEngine.ts, i.e. only from the
 * /api/update-prices cron. Nothing else should import it directly.
 */

import { prisma } from "@/lib/prisma";
import type { PriceSource } from "@/lib/prices";

// If the freshest row we have is older than this, treat it as stale enough
// to warrant the "prices unavailable" banner even if it wasn't explicitly
// tagged "fallback" — most likely explanation is the cron stopped running.
const STALE_AFTER_MS = 30 * 60 * 60 * 1000; // 30h — a bit more than one day's slack

type Metal = "gold" | "silver" | "platinum" | "palladium";
const METALS: Metal[] = ["gold", "silver", "platinum", "palladium"];

export async function fetchAllSpotPrices(): Promise<{
  gold:      number | null;
  silver:    number | null;
  platinum:  number | null;
  palladium: number | null;
  source:    PriceSource;
  fetchedAt: string;
}> {
  const rows = await prisma.price.findMany({
    where: { metal: { in: METALS } },
    orderBy: { timestamp: "desc" },
    distinct: ["metal"],
  });

  const byMetal: Partial<Record<Metal, (typeof rows)[number]>> = Object.fromEntries(
    rows.map((r) => [r.metal, r])
  );

  const gold      = byMetal.gold?.price      ?? null;
  const silver    = byMetal.silver?.price    ?? null;
  const platinum  = byMetal.platinum?.price  ?? null;
  const palladium = byMetal.palladium?.price ?? null;

  const timestamps = METALS.map((m) => byMetal[m]?.timestamp).filter((t): t is Date => !!t);
  const newest = timestamps.length ? new Date(Math.max(...timestamps.map((t) => t.getTime()))) : null;
  const isStale = !newest || Date.now() - newest.getTime() > STALE_AFTER_MS;

  // Backward-compatible with the old live-fetch "yahoo" | "fallback" flag
  // the "prices unavailable" banner checks: fire it if every metal we have
  // is either missing or explicitly tagged "fallback" (the hardcoded
  // emergency values), or if the freshest row is too old to trust.
  const allFallbackOrMissing = METALS.every((m) => {
    const row = byMetal[m];
    // `source` is on the Price model (migration 20260916190000) but the
    // local sandbox's Prisma client predates it (can't regenerate without
    // network access to fetch the engine binary — see prior commits' notes).
    // The real build runs `prisma generate` against the current schema, so
    // this resolves itself in production; the cast is just to unblock local
    // typecheck.
    return !row || (row as { source?: string | null }).source === "fallback";
  });

  const source: PriceSource = allFallbackOrMissing || isStale ? "fallback" : "yahoo";

  return {
    gold,
    silver,
    platinum,
    palladium,
    source,
    fetchedAt: (newest ?? new Date()).toISOString(),
  };
}
