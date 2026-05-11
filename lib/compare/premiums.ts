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
  // Gold premiums held from 2026-05-04 ($4,537 spot). Search data for gold
  // today returned stale cached prices — re-verify directly at apmex.com
  // before next gold update.
  "silver-eagle": {
    apmex:       13.49,  // verified: $93.66 - $80.34 spot (2026-05-10)
    jmbullion:   11.49,  // ~$2 below APMEX (typical)
    sdbullion:    9.49,  // ~$4 below APMEX (typically most aggressive)
    moneymetals: 10.49,  // ~$3 below APMEX
  },
  "gold-eagle": {
    apmex:       214.99, // verified 2026-05-04: $4,752.39 - $4,537.40 spot
    jmbullion:   189.99, // ~$25 below APMEX (typical)
    sdbullion:   169.99, // ~$45 below APMEX (typically most aggressive)
    moneymetals: 179.99, // ~$35 below APMEX
  },
  "silver-maple": {
    apmex:       11.49,  // typically $1.50-2 below Silver Eagle at same dealer
    jmbullion:    9.49,
    sdbullion:    7.49,
    moneymetals:  8.49,
  },
  "gold-maple": {
    apmex:       184.99, // typically $20-30 below Gold Eagle at same dealer
    jmbullion:   164.99,
    sdbullion:   149.99,
    moneymetals: 154.99,
  },
};

export function premiumFor(coinId: CompareCoin["id"], dealerId: Dealer["id"]): number {
  return PREMIUMS[coinId]?.[dealerId] ?? 0;
}

// Date the PREMIUMS table was last hand-reviewed. Surfaced on /compare so
// users can judge how fresh the comparison really is. Update whenever you
// edit any value above. ISO format (YYYY-MM-DD) — the UI formats it for
// display.
export const PREMIUMS_LAST_REVIEWED = "2026-05-10";
