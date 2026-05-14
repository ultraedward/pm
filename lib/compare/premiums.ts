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
  // Silver premiums re-verified 2026-05-10 against apmex.com at $80.34 spot.
  // APMEX Silver Eagle MintDirect single: $93.66 → ~$13.32 premium (compressed
  // from $16.99 on May 4 as spot rose ~$7). JM/SD/MM estimated from typical
  // spreads vs. APMEX. Silver Maple adjusted proportionally (~$2 below Eagle).
  //
  "silver-eagle": {
    apmex:       13.49,  // verified: $93.66 - $80.34 spot (2026-05-10)
    jmbullion:   11.49,  // ~$2 below APMEX (typical)
    sdbullion:    9.49,  // ~$4 below APMEX (typically most aggressive)
    moneymetals: 10.49,  // ~$3 below APMEX
  },
  "gold-eagle": {
    // Re-verified 2026-05-14 at ~$4,681 spot (JM Bullion live ticker).
    // Single-piece check/wire prices: APMEX $4,902.59, JM $4,893.24,
    // SD $4,863.97, MM $4,898.70 (MM lists $219 premium explicitly).
    apmex:       221.99,
    jmbullion:   211.99,
    sdbullion:   182.99,
    moneymetals: 219.00,
  },
  "silver-maple": {
    apmex:       11.49,  // re-verified 2026-05-10 (silver premiums stable)
    jmbullion:    9.49,
    sdbullion:    7.49,
    moneymetals:  8.49,
  },
  "gold-maple": {
    // Re-verified 2026-05-14 at ~$4,681 spot (JM Bullion live ticker).
    // Single-piece check/wire: JM $4,833.77, SD $4,738.84,
    // MM $4,846.70 ($166 premium listed explicitly).
    // APMEX row is hidden (empty slug in coins.ts) — they only carry a
    // .99999 + assay card SKU, not a standard .9999 random-year Maple.
    apmex:         0,    // unused — row hidden by empty slug in coins.ts
    jmbullion:   152.99,
    sdbullion:    57.99,
    moneymetals: 166.00,
  },
};

export function premiumFor(coinId: CompareCoin["id"], dealerId: Dealer["id"]): number {
  return PREMIUMS[coinId]?.[dealerId] ?? 0;
}

// Date the PREMIUMS table was last hand-reviewed. Surfaced on /compare so
// users can judge how fresh the comparison really is. Update whenever you
// edit any value above. ISO format (YYYY-MM-DD) — the UI formats it for
// display.
export const PREMIUMS_LAST_REVIEWED = "2026-05-14";
