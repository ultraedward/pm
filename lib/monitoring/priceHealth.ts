import { sendOpsAlert } from "@/lib/monitoring/alert";
import type { PriceResult } from "@/lib/prices";

// Metals essentially never move more than this in a single cron interval
// (10 min in normal operation, up to ~1 day if the app has been idle).
// A bigger jump usually means bad/corrupted data, not a real market move.
const SANITY_JUMP_PCT = 8;

type PreviousPrices = {
  gold?: number | null;
  silver?: number | null;
  platinum?: number | null;
  palladium?: number | null;
};

/**
 * Runs after every live price fetch to catch, within the hour, the kind of
 * silent degradation that took ~4 months to notice last time (gold/silver
 * quietly serving Yahoo futures instead of true spot). Never throws —
 * called from lib/priceEngine.ts, and a monitoring bug must never block a
 * price update.
 */
export async function checkPriceHealth(live: PriceResult, previous: PreviousPrices) {
  try {
    const issues: string[] = [];

    // 1) Gold/silver silently fell off the true-spot path.
    if (live.source !== "fallback" && live.goldSilverSource !== "goldprice-spot") {
      issues.push(
        `Gold/silver are not coming from goldprice.org true-spot right now ` +
          `(source: ${live.goldSilverSource ?? "worker unreachable"}). They've fallen back ` +
          `to the pre-fix Yahoo futures path, which runs ~1-2% off real spot.`
      );
    }

    // 2) Everything is on the hardcoded emergency fallback (April 2026 prices).
    if (live.source === "fallback") {
      issues.push(
        `All 4 metals are serving the hardcoded emergency fallback prices ` +
          `(last updated April 2026) — both the CF Worker and direct Yahoo Finance are unreachable.`
      );
    }

    // 3) Day-over-day sanity check per metal — catches bad data/unit errors
    //    even when the source itself reports as healthy.
    const pairs: [string, number, number | null | undefined][] = [
      ["gold", live.Gold, previous.gold],
      ["silver", live.Silver, previous.silver],
      ["platinum", live.Platinum, previous.platinum],
      ["palladium", live.Palladium, previous.palladium],
    ];

    for (const [metal, current, prior] of pairs) {
      if (typeof prior !== "number" || prior <= 0 || typeof current !== "number") continue;
      const pctChange = Math.abs((current - prior) / prior) * 100;
      if (pctChange > SANITY_JUMP_PCT) {
        issues.push(
          `${metal} moved ${pctChange.toFixed(1)}% since the last reading ` +
            `($${prior} → $${current}) — larger than metals typically move this fast; ` +
            `could be a bad reading rather than a real market move.`
        );
      }
    }

    if (issues.length === 0) return { healthy: true as const };

    await sendOpsAlert(
      "price-health",
      `Lode price data issue: ${issues.length} issue(s) detected`,
      issues.map((i) => `• ${i}`).join("<br>")
    );

    return { healthy: false as const, issues };
  } catch (err) {
    console.error("[price-health] check itself failed:", err);
    return { healthy: true as const };
  }
}
