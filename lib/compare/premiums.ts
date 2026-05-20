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
  // Silver Eagle re-verified 2026-05-19 via FindBullionPrices.com hourly data
  // at ~$74.34 spot and moneymetals.com (MM states premium explicitly).
  // Note: premiums widened vs. May 10 as spot fell ~$6 — dealers protect margin.
  // FBP single-piece ACH/cash prices: APMEX $90.77, JM $91.32, SD $82.92.
  // MM: $11.49 single-unit premium listed explicitly on product page.
  "silver-eagle": {
    apmex:       16.43,  // verified: $90.77 - $74.34 spot (2026-05-19)
    jmbullion:   16.98,  // verified: $91.32 - $74.34 spot (2026-05-19)
    sdbullion:    8.58,  // verified: $82.92 - $74.34 spot (2026-05-19)
    moneymetals: 11.49,  // verified: explicit on moneymetals.com (2026-05-19)
  },
  "gold-eagle": {
    // Re-verified 2026-05-19 via FindBullionPrices.com at ~$4,491.71 spot.
    // Single-piece ACH/cash: SD $4,678.07, APMEX $4,692.89, JM $4,706.89.
    // MM: $219.00 single-unit premium listed explicitly on product page.
    apmex:       201.18,  // verified: $4,692.89 - $4,491.71 spot (2026-05-19)
    jmbullion:   215.18,  // verified: $4,706.89 - $4,491.71 spot (2026-05-19)
    sdbullion:   186.36,  // verified: $4,678.07 - $4,491.71 spot (2026-05-19)
    moneymetals: 219.00,  // verified: explicit on moneymetals.com (2026-05-19)
  },
  // Silver Maple re-verified 2026-05-19 via FindBullionPrices.com hourly data
  // at ~$74.37 spot. SD notably aggressive on random-year Maples right now.
  // FBP single-piece ACH/cash: SD $77.42, MM $81.25, APMEX $85.71, JM $87.74.
  "silver-maple": {
    apmex:       11.34,  // verified: $85.71 - $74.37 spot (2026-05-19)
    jmbullion:   13.37,  // verified: $87.74 - $74.37 spot (2026-05-19)
    sdbullion:    3.05,  // verified: $77.42 - $74.37 spot (2026-05-19)
    moneymetals:  6.88,  // verified: $81.25 - $74.37 spot (2026-05-19)
  },
  "gold-maple": {
    // Re-verified 2026-05-19 via FindBullionPrices.com at ~$4,493.90 spot.
    // Single-piece ACH/cash: SD $4,553.07, APMEX $4,571.59 (hidden), MM $4,645.65, JM $4,647.28.
    // APMEX row is hidden (empty slug in coins.ts) — they only carry a
    // .99999 + assay card SKU, not a standard .9999 random-year Maple.
    apmex:         0,    // unused — row hidden by empty slug in coins.ts
    jmbullion:   153.38,  // verified: $4,647.28 - $4,493.90 spot (2026-05-19)
    sdbullion:    59.17,  // verified: $4,553.07 - $4,493.90 spot (2026-05-19)
    moneymetals: 151.75,  // verified: $4,645.65 - $4,493.90 spot (2026-05-19)
  },
};

export function premiumFor(coinId: CompareCoin["id"], dealerId: Dealer["id"]): number {
  return PREMIUMS[coinId]?.[dealerId] ?? 0;
}

// Date the PREMIUMS table was last hand-reviewed. Surfaced on /compare so
// users can judge how fresh the comparison really is. Update whenever you
// edit any value above. ISO format (YYYY-MM-DD) — the UI formats it for
// display.
export const PREMIUMS_LAST_REVIEWED = "2026-05-19";
