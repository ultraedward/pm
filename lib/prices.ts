import { fetchYahooFinancePrice } from "@/lib/prices/fetchYahooFinance";

type PriceMap = {
  Gold: number;
  Silver: number;
  Platinum: number;
  Palladium: number;
};

export type PriceSource = "metals.dev" | "yahoo" | "fallback";

export type PriceResult = PriceMap & { source: PriceSource };

const SYMBOL_MAP: Record<keyof PriceMap, string> = {
  Gold: "XAU",
  Silver: "XAG",
  Platinum: "XPT",
  Palladium: "XPD",
};

// Last-resort fallback — only used if both metals.dev and the CF Worker/Yahoo Finance fail.
// Updated April 2026. If you see these values in production, all live sources are down.
const FALLBACK_PRICES: PriceMap = {
  Gold: 4830.00,
  Silver: 80.40,
  Platinum: 2102.00,
  Palladium: 1580.00,
};

// ─── In-memory cache ──────────────────────────────────────────────────────────
// Shared across the server process so concurrent page loads don't each burn a
// metals.dev API call. Prices from the CF Worker are already cached 5 min on
// Cloudflare's edge; this cache covers the Vercel → metals.dev leg.
type CachedResult = { result: PriceResult; ts: number };
let _priceCache: CachedResult | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function getLivePrices(): Promise<PriceResult> {
  const now = Date.now();

  // Return cached result if still fresh
  if (_priceCache && now - _priceCache.ts < CACHE_TTL_MS) {
    return _priceCache.result;
  }

  // 1️⃣ metals.dev — 200 calls/month quota
  if (process.env.METALS_API_KEY) {
    try {
      const res = await fetch(
        `https://api.metals.dev/v1/latest?api_key=${process.env.METALS_API_KEY}&currency=USD`
      );

      if (!res.ok) throw new Error(`metals.dev ${res.status}`);

      const data = await res.json();
      const gold = data.metals?.[SYMBOL_MAP.Gold];
      const silver = data.metals?.[SYMBOL_MAP.Silver];

      if (typeof gold === "number" && typeof silver === "number" && gold > 0 && silver > 0) {
        const result: PriceResult = {
          Gold: gold,
          Silver: silver,
          Platinum: data.metals?.[SYMBOL_MAP.Platinum] ?? FALLBACK_PRICES.Platinum,
          Palladium: data.metals?.[SYMBOL_MAP.Palladium] ?? FALLBACK_PRICES.Palladium,
          source: "metals.dev",
        };
        _priceCache = { result, ts: now };
        return result;
      }
    } catch {
      // fall through to CF Worker / Yahoo Finance
    }
  }

  // 2️⃣ CF Worker / Yahoo Finance — primary source when metals.dev is unavailable
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
  console.error("[prices] All live sources failed — returning hardcoded fallback prices");
  return { ...FALLBACK_PRICES, source: "fallback" };
}
