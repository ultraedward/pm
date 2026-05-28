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
  // Silver Eagle re-verified 2026-05-27 at ~$74.77 silver ask (Kitco).
  // SD: confirmed via SSR page price $85.63 (sdbullion.com product page).
  // JM: confirmed "as low as $15.99/oz over spot" from jmbullion.com listing.
  // APMEX: estimated from historical spread (~$0.50 below JM).
  // MM: estimated from historical spread (~$2 above SD).
  // Note: spot fell ~$2.32 today (-3.02%) vs prior week; premiums widened.
  "silver-eagle": {
    apmex:       15.49,  // est. (APMEX historically ~$0.50 below JM)
    jmbullion:   15.99,  // confirmed: "$15.99/oz over spot" on jmbullion.com (2026-05-27)
    sdbullion:   10.86,  // confirmed: $85.63 page - $74.77 spot (2026-05-27)
    moneymetals: 13.00,  // est. (historically ~$2 above SD)
  },
  "gold-eagle": {
    // Re-verified 2026-05-27 at ~$4,457.50 gold ask (Kitco).
    // SD: confirmed via SSR page price $4,745.27 (sdbullion.com product page).
    // APMEX: confirmed random-year BU at $4,700.49 check/wire (from apmex.com listing).
    // JM/MM: estimated from historical spread vs APMEX ($14 and $18 respectively).
    // Note: gold fell ~$50.90 today (-1.13%); SSR-cached page prices may lag JS live prices.
    apmex:       242.99,  // confirmed: $4,700.49 - $4,457.50 spot (2026-05-27)
    jmbullion:   256.99,  // est. (historically ~$14 above APMEX)
    sdbullion:   287.77,  // confirmed: $4,745.27 page - $4,457.50 spot (2026-05-27)
    moneymetals: 261.99,  // est. (historically ~$18 above APMEX)
  },
  // Silver Maple re-verified 2026-05-27 at ~$74.77 silver ask (Kitco).
  // APMEX: confirmed "as low as $9.99/oz over spot" from apmex.com listing.
  // JM: estimated (historically ~$2 above APMEX).
  // SD: estimated (proportionally widened from May 19's $3.05, tracking Silver Eagle spread).
  // MM: estimated mid-range between SD and APMEX.
  "silver-maple": {
    apmex:        9.99,  // confirmed: "as low as $9.99/oz over spot" on apmex.com (2026-05-27)
    jmbullion:   12.00,  // est. (historically ~$2 above APMEX)
    sdbullion:    5.00,  // est. (widened from $3.05 on May 19, tracking Eagle spread)
    moneymetals:  7.50,  // est. (mid-range between SD and APMEX)
  },
  "gold-maple": {
    // Re-verified 2026-05-27 at ~$4,457.50 gold ask (Kitco).
    // APMEX row is hidden (empty slug in coins.ts) — they only carry a
    // .99999 + assay card SKU, not a standard .9999 random-year Maple.
    // JM/SD/MM: estimated from May 19 baselines, scaled with Gold Eagle premium widening.
    apmex:         0,    // unused — row hidden by empty slug in coins.ts
    jmbullion:   195.00,  // est. (widened from $153.38 on May 19, tracking Gold Eagle spread)
    sdbullion:   161.00,  // est. (widened from $59.17 on May 19, tracking Gold Eagle spread)
    moneymetals: 193.00,  // est. (widened from $151.75 on May 19, tracking Gold Eagle spread)
  },
};

export function premiumFor(coinId: CompareCoin["id"], dealerId: Dealer["id"]): number {
  return PREMIUMS[coinId]?.[dealerId] ?? 0;
}

// Date the PREMIUMS table was last hand-reviewed. Surfaced on /compare so
// users can judge how fresh the comparison really is. Update whenever you
// edit any value above. ISO format (YYYY-MM-DD) — the UI formats it for
// display.
export const PREMIUMS_LAST_REVIEWED = "2026-05-27";
