/**
 * Spot price fetching — routes through getLivePrices() which tries
 * metals.dev first, then the CF Worker / Yahoo Finance as fallback.
 */

import { getLivePrices, type PriceSource } from "@/lib/prices";

export async function fetchAllSpotPrices(): Promise<{
  gold:      number | null;
  silver:    number | null;
  platinum:  number | null;
  palladium: number | null;
  source:    PriceSource;
  fetchedAt: string;
}> {
  const prices = await getLivePrices();
  return {
    gold:      prices.Gold,
    silver:    prices.Silver,
    platinum:  prices.Platinum,
    palladium: prices.Palladium,
    source:    prices.source,
    fetchedAt: new Date().toISOString(),
  };
}
