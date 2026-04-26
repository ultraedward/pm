// Dealer premiums over spot, in USD, per single coin (qty 1).
//
// These are hand-tuned baseline values — the single thing to edit when
// premiums shift. All comparison prices on /compare are computed as:
//
//   dealer price = (oz × spot) + premium
//
// so the ordering stays accurate as spot moves; only the absolute
// premiums need periodic maintenance.
//
// IMPORTANT: When you adjust any premium below, update PREMIUMS_LAST_REVIEWED
// to today's date (YYYY-MM-DD). The /compare page surfaces this date as a
// freshness signal — claiming a freshness date and then not honoring it is
// worse for trust than not claiming one at all.
//
// NOTE: These default to reasonable 2026 single-piece premiums. A later
// iteration can swap this for a small DB table or a scheduled scraper
// without touching the UI — just export the same shape from this file
// plus a per-row verifiedAt date.

import type { CompareCoin } from "./coins";
import type { Dealer } from "./dealers";

type PremiumTable = Record<CompareCoin["id"], Record<Dealer["id"], number>>;

export const PREMIUMS: PremiumTable = {
  "silver-eagle": {
    apmex:       6.49,
    jmbullion:   5.99,
    sdbullion:   4.99,
    moneymetals: 5.49,
  },
  "gold-eagle": {
    apmex:       149.99,
    jmbullion:   139.99,
    sdbullion:   119.99,
    moneymetals: 129.99,
  },
  "silver-maple": {
    apmex:       5.49,
    jmbullion:   4.99,
    sdbullion:   4.29,
    moneymetals: 4.79,
  },
  "gold-maple": {
    apmex:       119.99,
    jmbullion:   109.99,
    sdbullion:    99.99,
    moneymetals: 104.99,
  },
};

export function premiumFor(coinId: CompareCoin["id"], dealerId: Dealer["id"]): number {
  return PREMIUMS[coinId]?.[dealerId] ?? 0;
}

// Date the PREMIUMS table was last hand-reviewed. Surfaced on /compare so
// users can judge how fresh the comparison really is. Update whenever you
// edit any value above. ISO format (YYYY-MM-DD) — the UI formats it for
// display.
export const PREMIUMS_LAST_REVIEWED = "2026-04-25";
