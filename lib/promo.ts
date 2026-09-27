/**
 * Promotional offer registry for Birch Gold Group affiliate campaigns.
 * Each promo is date-gated — add new entries here; nothing else needs to change.
 */

export type Promo = {
  id:       string;
  start:    Date;
  end:      Date;
  headline: string;
  body:     string;
  badge:    string;
  emoji:    string;
  dateLabel: string; // human-readable window shown in banner
};

export const AMERICA_250_PROMO: Promo = {
  id:        "america250",
  start:     new Date("2026-06-08T00:00:00-05:00"),
  end:       new Date("2026-07-10T23:59:59-05:00"),
  headline:  "America 250 Silver Promo",
  body:      "Free America 250 silver round with every $10,000 purchase — IRAs and physical. While supplies last.",
  badge:     "Limited offer · ends Jul 10",
  emoji:     "🇺🇸",
  dateLabel: "Jun 8 – Jul 10",
};

export const VETERANS_DAY_PROMO: Promo = {
  id:        "veterans_day",
  start:     new Date("2026-10-14T00:00:00-05:00"),
  end:       new Date("2026-10-30T23:59:59-05:00"),
  headline:  "Veterans Day Silver Promotion",
  body:      "Free 1 oz custom silver round with every $10,000 in qualifying precious metals — IRAs and physical purchases both qualify.",
  badge:     "Limited offer · ends Oct 30",
  emoji:     "🎖️",
  dateLabel: "Oct 14 – Oct 30",
};

/** All promos in priority order — first active one wins. */
const ALL_PROMOS: Promo[] = [VETERANS_DAY_PROMO, AMERICA_250_PROMO];

/** Returns the currently active promo, or null if none is running. */
export function activePromo(): Promo | null {
  const now = new Date();
  return ALL_PROMOS.find(p => now >= p.start && now <= p.end) ?? null;
}

/** Returns true when any promo is currently active. */
export function isPromoActive(): boolean {
  return activePromo() !== null;
}
