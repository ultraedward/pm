/**
 * Fetches current spot prices from Stooq.
 * Free, no API key required. Stooq data is typically ~15 min delayed.
 */

const STOOQ_SYMBOLS: Record<string, string> = {
  gold:      "xauusd",
  silver:    "xagusd",
  platinum:  "xptusd",
  palladium: "xpdusd",
};

function toStooqDate(d: Date): string {
  return d.toISOString().split("T")[0].replace(/-/g, "");
}

export async function fetchStooqSpotPrice(metal: string): Promise<number | null> {
  const symbol = STOOQ_SYMBOLS[metal];
  if (!symbol) return null;

  // Request 3-day window so weekends / holidays still return the most recent close
  const end   = new Date();
  const start = new Date();
  start.setUTCDate(start.getUTCDate() - 3);

  const url =
    `https://stooq.com/q/d/l/?s=${symbol}` +
    `&d1=${toStooqDate(start)}&d2=${toStooqDate(end)}&i=d`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });
    if (!res.ok) return null;

    const text = await res.text();
    if (!text || text.trim().startsWith("No data")) return null;

    // CSV: Date,Open,High,Low,Close,Volume — use the last row's close
    const lines = text.trim().split("\n").slice(1).filter(Boolean);
    if (lines.length === 0) return null;

    const cols  = lines[lines.length - 1].split(",");
    const close = parseFloat(cols[4]);
    return isNaN(close) || close <= 0 ? null : Number(close.toFixed(2));
  } catch {
    return null;
  }
}

export async function fetchAllSpotPrices(): Promise<{
  gold:      number | null;
  silver:    number | null;
  platinum:  number | null;
  palladium: number | null;
  fetchedAt: string;
}> {
  const [gold, silver, platinum, palladium] = await Promise.all([
    fetchStooqSpotPrice("gold"),
    fetchStooqSpotPrice("silver"),
    fetchStooqSpotPrice("platinum"),
    fetchStooqSpotPrice("palladium"),
  ]);

  return { gold, silver, platinum, palladium, fetchedAt: new Date().toISOString() };
}
