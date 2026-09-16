import { fetchYahooFinancePrice } from "@/lib/prices/fetchYahooFinance";
import { fetchMetalsApiPrices } from "@/lib/prices/fetchMetalsApi";

type PriceMap = {
  Gold: number;
  Silver: number;
  Platinum: number;
  Palladium: number;
};

export type PriceSource = "metals-api" | "yahoo" | "fallback";

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

  // 1️⃣ metals-api.com — true spot (LBMA-style), primary price source
  try {
    const rates = await fetchMetalsApiPrices();
    if (
      rates &&
      typeof rates.USDXAU === "number" &&
      typeof rates.USDXAG === "number" &&
      rates.USDXAU > 0 &&
      rates.USDXAG > 0
    ) {
      const result: PriceResult = {
        Gold: rates.USDXAU,
        Silver: rates.USDXAG,
        Platinum: rates.USDXPT ?? FALLBACK_PRICES.Platinum,
        Palladium: rates.USDXPD ?? FALLBACK_PRICES.Palladium,
        source: "metals-api",
      };
      _priceCache = { result, ts: now };
      return result;
    }
  } catch {
    // fall through to Yahoo futures
  }

  // 2️⃣ CF Worker / Yahoo Finance futures — secondary source. NOTE: these are
  // COMEX futures (GC=F, SI=F, ...), not true spot — they can run ~1-2% off
  // real spot due to contango/backwardation. Only used if metals-api.com is
  // unavailable or METALS_API_KEY isn't set.
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

  // 3️⃣ Last resort: hardcoded prices (accurate as of April 2026).
  // Do NOT cache this so the next request retries live sources immediately.
  console.error("[prices] Live source failed — returning hardcoded fallback prices");
  return { ...FALLBACK_PRICES, source: "fallback" };
}
