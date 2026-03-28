/**
 * Fetches current precious metals prices from Yahoo Finance.
 * Uses commodity futures tickers — free, no API key required.
 * GC=F (Gold), SI=F (Silver), PL=F (Platinum), PA=F (Palladium)
 * All prices are USD per troy ounce.
 */

const YAHOO_SYMBOLS: Record<string, string> = {
  gold:      "GC=F",
  silver:    "SI=F",
  platinum:  "PL=F",
  palladium: "PA=F",
};

export async function fetchYahooFinancePrice(metal: string): Promise<number | null> {
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

    const data = await res.json();
    const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;

    return typeof price === "number" && price > 0 ? Number(price.toFixed(2)) : null;
  } catch {
    return null;
  }
}
