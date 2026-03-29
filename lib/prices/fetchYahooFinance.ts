/**
 * Fetches precious metals prices via the Cloudflare Worker proxy (PRICE_WORKER_URL),
 * or directly from Yahoo Finance if the worker isn't configured yet.
 *
 * The Worker runs on Cloudflare's network so Yahoo Finance isn't blocked.
 * Direct Yahoo Finance calls fail from Vercel's AWS Lambda IPs.
 */

const YAHOO_SYMBOLS: Record<string, string> = {
  gold:      "GC=F",
  silver:    "SI=F",
  platinum:  "PL=F",
  palladium: "PA=F",
};

/** Fetch all 4 metals at once via the CF Worker. Returns null if unavailable. */
async function fetchAllViaWorker(): Promise<Record<string, number | null> | null> {
  const workerUrl = process.env.PRICE_WORKER_URL;
  if (!workerUrl) return null;

  try {
    const res = await fetch(workerUrl, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json() as Record<string, unknown>;
    if (!data.ok) return null;
    return data as Record<string, number | null>;
  } catch {
    return null;
  }
}

// Worker result cache so we don't call it 4× per price refresh
let _workerCache: { data: Record<string, number | null>; ts: number } | null = null;

export async function fetchYahooFinancePrice(metal: string): Promise<number | null> {
  // Try CF Worker first (all metals in one call, cached for this invocation)
  const now = Date.now();
  if (!_workerCache || now - _workerCache.ts > 5000) {
    const result = await fetchAllViaWorker();
    if (result) _workerCache = { data: result, ts: now };
  }
  if (_workerCache) {
    const price = _workerCache.data[metal];
    return typeof price === "number" && price > 0 ? price : null;
  }

  // Direct Yahoo Finance fallback (only works if not on AWS Lambda)
  const symbol = YAHOO_SYMBOLS[metal];
  if (!symbol) return null;

  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
    `?interval=1d&range=5d`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json() as Record<string, unknown>;
    const result = (data as Record<string, Record<string, Array<Record<string, Record<string, number>>>>>)
      ?.chart?.result?.[0]?.meta?.regularMarketPrice;

    return typeof result === "number" && result > 0 ? Number(result.toFixed(2)) : null;
  } catch {
    return null;
  }
}
