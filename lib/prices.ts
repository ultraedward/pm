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

const FALLBACK_PRICES: PriceMap = {
  Gold: 2042.35,
  Silver: 24.88,
  Platinum: 921.12,
  Palladium: 1012.44,
};

export async function getLivePrices(): Promise<PriceMap> {
  if (!process.env.METALS_API_KEY) {
    return FALLBACK_PRICES;
  }

  try {
    const res = await fetch(
      `https://api.metals.dev/v1/latest?api_key=${process.env.METALS_API_KEY}&currency=USD`
    );

    if (!res.ok) throw new Error("Price fetch failed");

    const data = await res.json();

    return {
      Gold: data.metals[SYMBOL_MAP.Gold],
      Silver: data.metals[SYMBOL_MAP.Silver],
      Platinum: data.metals[SYMBOL_MAP.Platinum],
      Palladium: data.metals[SYMBOL_MAP.Palladium],
    };
  } catch {
    return FALLBACK_PRICES;
  }
}
