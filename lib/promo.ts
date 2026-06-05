/**
 * America 250 Silver Round Promo — Birch Gold Group
 * Active: June 8 – July 10, 2026
 * One free America 250-themed silver round per $10,000 purchased.
 * Applies to both Precious Metals IRAs and physical purchases.
 */

export const AMERICA_250_PROMO = {
  start:    new Date("2026-06-08T00:00:00-05:00"),
  end:      new Date("2026-07-10T23:59:59-05:00"),
  headline: "America 250 Silver Promo",
  body:     "Free America 250 silver round with every $10,000 purchase — IRAs and physical. While supplies last.",
  badge:    "Limited offer · ends Jul 10",
} as const;

/** Returns true when the current server time is within the promo window. */
export function isPromoActive(): boolean {
  const now = new Date();
  return now >= AMERICA_250_PROMO.start && now <= AMERICA_250_PROMO.end;
}
