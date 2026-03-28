import { fetchYahooFinancePrice } from "@/lib/prices/fetchYahooFinance";

type PriceMap = {
  Gold: number;
  Silver: number;
  Platinum: number;
  Palladium: number;
};

const SYMBOL_MAP: Record<keyof PriceMap, string> = {
  Gold: "XAU",
  Silver: "XAG",
  Platinum: "XPT",
  Palladium: "XPD",
};

// Last-resort fallback — only shown if both metals.dev and Yahoo Finance fail
const FALLBACK_PRICES: PriceMap = {
  Gold: 2042.35,
  Silver: 24.88,
  Platinum: 921.12,
  Palladium: 1012.44,
};

export async function getLivePrices(): Promise<PriceMap> {
  // 1️⃣ Try metals.dev (reliable, uses METALS_API_KEY while subscription is active)
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
        return {
          Gold: gold,
          Silver: silver,
          Platinum: data.metals?.[SYMBOL_MAP.Platinum] ?? FALLBACK_PRICES.Platinum,
          Palladium: data.metals?.[SYMBOL_MAP.Palladium] ?? FALLBACK_PRICES.Palladium,
        };
      }
    } catch {
      // fall through to Yahoo Finance
    }
  }

  // 2️⃣ Fall back to Yahoo Finance (free, no key — works server-side without CORS)
  try {
    const [gold, silver, platinum, palladium] = await Promise.all([
      fetchYahooFinancePrice("gold"),
      fetchYahooFinancePrice("silver"),
      fetchYahooFinancePrice("platinum"),
      fetchYahooFinancePrice("palladium"),
    ]);

    if (typeof gold === "number" && typeof silver === "number" && gold > 0 && silver > 0) {
      return {
        Gold: gold,
        Silver: silver,
        Platinum: platinum ?? FALLBACK_PRICES.Platinum,
        Palladium: palladium ?? FALLBACK_PRICES.Palladium,
      };
    }
  } catch {
    // fall through to hardcoded fallback
  }

  // 3️⃣ Last resort: stale hardcoded prices (better than $0)
  return FALLBACK_PRICES;
}
