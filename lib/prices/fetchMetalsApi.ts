/**
 * True spot prices via metals-api.com (XAU/XAG/XPT/XPD vs USD).
 *
 * This is the accurate LBMA-style spot feed. It's distinct from — and should
 * be preferred over — the Yahoo Finance futures fallback (GC=F, SI=F, etc.)
 * in fetchYahooFinance.ts, which tracks COMEX futures contracts and can run
 * meaningfully above/below true spot due to contango/backwardation (observed
 * ~$40-50/oz high on gold in Sept 2026 — see reddit-campaign-log discussion).
 *
 * Requires METALS_API_KEY. If it's not set, callers should fall back to the
 * Yahoo Finance futures source.
 */

export type MetalsApiRates = {
  USDXAU?: number;
  USDXAG?: number;
  USDXPT?: number;
  USDXPD?: number;
};

let _metalsApiCache: { data: MetalsApiRates; ts: number } | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes — matches getLivePrices()' cache

export async function fetchMetalsApiPrices(): Promise<MetalsApiRates | null> {
  const apiKey = process.env.METALS_API_KEY;
  if (!apiKey) return null;

  const now = Date.now();
  if (_metalsApiCache && now - _metalsApiCache.ts < CACHE_TTL_MS) {
    return _metalsApiCache.data;
  }

  try {
    const url =
      `https://metals-api.com/api/latest?access_key=${apiKey}` +
      `&base=USD&symbols=XAU,XAG,XPT,XPD`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      success?: boolean;
      rates?: MetalsApiRates;
    };

    if (!data.success || !data.rates) return null;

    _metalsApiCache = { data: data.rates, ts: now };
    return data.rates;
  } catch {
    return null;
  }
}
