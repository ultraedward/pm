import { fetchYahooFinancePrice } from "@/lib/prices/fetchYahooFinance";

type PriceMap = {
  Gold: number;
  Silver: number;
  Platinum: number;
  Palladium: number;
};

export type PriceSource = "yahoo" | "fallback";

export type PriceResult = PriceMap & { source: PriceSource };

// Last-resort fallback — only used if the CF Worker / Yahoo Finance fails.
// Updated April 2026. If you see these values in production, the live source is down.
const FALLBACK_PRICES: PriceMap = {
  Gold: 4830.00,
  Silver: 80.40,
  Platinum: 2102.00,
  Palladium: 1580.00,
};

// ─── In-memory cache ──────────────────────────────────────────────────────────
// Shared across the server process so concurrent page loads don't each hit
// Yahoo Finance. Prices from the CF Worker are already cached 5 min on
// Cloudflare's edge; this cache covers the Vercel → Yahoo leg.
type CachedResult = { result: PriceResult; ts: number };
let _priceCache: CachedResult | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function getLivePrices(): Promise<PriceResult> {
  const now = Date.now();

  // Return cached result if still fresh
  if (_priceCache && now - _priceCache.ts < CACHE_TTL_MS) {
    return _priceCache.result;
  }

  // 1️⃣ CF Worker / Yahoo Finance — primary price source
  try {
    const [gold, silver, platinum, palladium] = await Promise.all([
      fetchYahooFinancePrice("gold"),
      fetchYahooFinancePrice("silver"),
      fetchYahooFinancePrice("platinum"),
      fetchYahooFinancePrice("palladium"),
    ]);

    if (typeof gold === "number" && typeof silver === "number" && gold > 0 && silver > 0) {
      const result: PriceResult = {
        Gold: gold,
        Silver: silver,
        Platinum: platinum ?? FALLBACK_PRICES.Platinum,
        Palladium: palladium ?? FALLBACK_PRICES.Palladium,
        source: "yahoo",
      };
      _priceCache = { result, ts: now };
      return result;
    }
  } catch {
    // fall through to hardcoded fallback
  }

  // 2️⃣ Last resort: hardcoded prices (accurate as of April 2026).
  // Do NOT cache this so the next request retries live sources immediately.
  console.error("[prices] Live source failed — returning hardcoded fallback prices");
  return { ...FALLBACK_PRICES, source: "fallback" };
}
