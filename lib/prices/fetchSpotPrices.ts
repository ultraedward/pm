/**
 * Spot price fetching — routes through getLivePrices() which tries
 * Yahoo Finance first, metals.dev as emergency fallback.
 */

import { getLivePrices } from "@/lib/prices";

export async function fetchAllSpotPrices(): Promise<{
  gold:      number | null;
  silver:    number | null;
  platinum:  number | null;
  palladium: number | null;
  fetchedAt: string;
}> {
  const prices = await getLivePrices();
  return {
    gold:      prices.Gold,
    silver:    prices.Silver,
    platinum:  prices.Platinum,
    palladium: prices.Palladium,
    fetchedAt: new Date().toISOString(),
  };
}
