/**
 * getPremiums — server-side helper for /compare
 *
 * Fetches live dealer premiums from the Cloudflare premiums worker (KV-backed,
 * updated weekly by the cron scraper). Falls back to the hand-maintained static
 * PREMIUMS table if the worker is unreachable or not yet deployed.
 *
 * Call this from the /compare server component only — never import on the
 * client, since it reads an env var and does a server-side fetch.
 */

import { PREMIUMS, PREMIUMS_LAST_REVIEWED } from "./premiums";
import type { CompareCoin } from "./coins";
import type { Dealer } from "./dealers";

export type PremiumTable = Record<CompareCoin["id"], Record<Dealer["id"], number>>;

export type PremiumsResult = {
  premiums: PremiumTable;
  lastReviewed: string; // ISO date string or ISO timestamp
  source: "worker" | "static";
};

/**
 * Merges worker-scraped premiums with the static table.
 * Worker value wins when non-zero; static fallback fills any 0 or missing entry.
 * This means the page never shows a broken $0.00 premium even when browser-render
 * scrapes fail (bot protection, first run, etc.).
 */
function mergeWithStatic(workerPremiums: PremiumTable): PremiumTable {
  const merged: PremiumTable = {} as PremiumTable;
  for (const coinId of Object.keys(PREMIUMS) as (keyof typeof PREMIUMS)[]) {
    merged[coinId] = {} as Record<string, number>;
    for (const dealerId of Object.keys(PREMIUMS[coinId])) {
      const live = (workerPremiums[coinId] as Record<string, number> | undefined)?.[dealerId];
      const fallback = (PREMIUMS[coinId] as Record<string, number>)[dealerId];
      merged[coinId][dealerId] = live && live > 0 ? live : fallback;
    }
  }
  return merged;
}

export async function getLivePremiums(): Promise<PremiumsResult> {
  const workerUrl = process.env.PREMIUMS_WORKER_URL;

  if (workerUrl) {
    try {
      const res = await fetch(`${workerUrl}/premiums`, {
        // ISR: Next.js revalidates this fetch at most once per hour so the
        // compare page doesn't hammer the worker on every request.
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.premiums) {
          // Merge: worker value wins when > 0, static fallback fills any
          // zero/missing entries (e.g. first run before browser-render warms up,
          // or a dealer's page was unreachable during the last cron).
          const merged = mergeWithStatic(data.premiums as PremiumTable);
          return {
            premiums: merged,
            lastReviewed: data.scrapedAt ?? new Date().toISOString(),
            source: "worker",
          };
        }
      }
    } catch {
      // Worker unreachable — fall through to static
    }
  }

  return {
    premiums: PREMIUMS as PremiumTable,
    lastReviewed: PREMIUMS_LAST_REVIEWED,
    source: "static",
  };
}
