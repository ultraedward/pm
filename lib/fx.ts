/**
 * FX rate layer — converts USD metal prices to the user's preferred currency.
 *
 * Source: frankfurter.app (ECB data, free, no API key required)
 * Cache:  1-hour in-memory cache — FX rates don't need to be live
 *
 * All metal prices in the DB are stored in USD. This module is the single
 * place where USD → local currency conversion happens. Never store converted
 * prices; always convert at display/comparison time.
 */

export const SUPPORTED_CURRENCIES = ["USD", "AUD", "CAD", "GBP", "EUR"] as const;
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export const CURRENCY_LABELS: Record<SupportedCurrency, string> = {
  USD: "US Dollar",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
  GBP: "British Pound",
  EUR: "Euro",
};

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  USD: "$",
  AUD: "A$",
  CAD: "C$",
  GBP: "£",
  EUR: "€",
};

// ─── Cache ────────────────────────────────────────────────────────────────────

type FxCache = { rates: Record<string, number>; ts: number };
let _cache: FxCache | null = null;
const TTL_MS = 60 * 60 * 1000; // 1 hour

// Fallback rates (approximate, May 2026) — used if frankfurter.app is unreachable
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  AUD: 1.55,
  CAD: 1.37,
  GBP: 0.79,
  EUR: 0.92,
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns a map of USD → each supported currency.
 * e.g. { USD: 1, AUD: 1.55, CAD: 1.37, GBP: 0.79, EUR: 0.92 }
 */
export async function getFxRates(): Promise<Record<string, number>> {
  const now = Date.now();
  if (_cache && now - _cache.ts < TTL_MS) return _cache.rates;

  try {
    const symbols = SUPPORTED_CURRENCIES.filter((c) => c !== "USD").join(",");
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=USD&to=${symbols}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`frankfurter.app ${res.status}`);
    const data = await res.json();
    const rates: Record<string, number> = { USD: 1, ...data.rates };
    _cache = { rates, ts: now };
    return rates;
  } catch (err) {
    console.warn("[fx] FX fetch failed — using fallback rates:", err);
    return FALLBACK_RATES;
  }
}

/**
 * Converts a USD amount to the target currency.
 * Returns the USD amount unchanged if currency is USD or unsupported.
 */
export async function convertFromUSD(
  usdAmount: number,
  toCurrency: string
): Promise<number> {
  if (toCurrency === "USD") return usdAmount;
  const rates = await getFxRates();
  const rate = rates[toCurrency];
  if (!rate) {
    console.warn(`[fx] No rate for ${toCurrency} — returning USD amount`);
    return usdAmount;
  }
  return usdAmount * rate;
}

/**
 * Converts a local-currency amount back to USD.
 * Used when reading alert thresholds stored in local currency.
 */
export async function convertToUSD(
  localAmount: number,
  fromCurrency: string
): Promise<number> {
  if (fromCurrency === "USD") return localAmount;
  const rates = await getFxRates();
  const rate = rates[fromCurrency];
  if (!rate) return localAmount;
  return localAmount / rate;
}

/**
 * Converts an entire price map from USD to the target currency in one call.
 * Useful for converting all four metals at once on a page load.
 */
export async function convertPricesFromUSD(
  prices: { Gold: number; Silver: number; Platinum: number; Palladium: number },
  toCurrency: string
): Promise<{ Gold: number; Silver: number; Platinum: number; Palladium: number }> {
  if (toCurrency === "USD") return prices;
  const rates = await getFxRates();
  const rate = rates[toCurrency] ?? 1;
  return {
    Gold:      prices.Gold      * rate,
    Silver:    prices.Silver    * rate,
    Platinum:  prices.Platinum  * rate,
    Palladium: prices.Palladium * rate,
  };
}
