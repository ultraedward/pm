/**
 * Lode Prices Worker
 * Deploy at: Cloudflare Dashboard → Workers & Pages → Create Worker → paste this
 * Route:     prices.lode.rocks/* (or any subdomain you choose)
 *
 * GET /          → live spot prices for all 4 metals (cached 5 min)
 * GET /history   → 30-day daily closing prices for all 4 metals (one-time backfill use)
 *
 * Runs on Cloudflare's edge network — not AWS, so Yahoo Finance isn't blocked.
 *
 * ── Gold/silver price source (updated Sep 2026) ──────────────────────────────
 * Previously this worker used Yahoo Finance futures (GC=F, SI=F) for gold and
 * silver, which are COMEX contracts, not true spot — they ran ~$40/oz
 * (~1%) above real spot due to contango. A Reddit user flagged the gap
 * independently; verified against Kitco.
 *
 * Gold/silver now come from goldprice.org's public live-rate feed
 * (data-asg.goldprice.org), which is free, keyless, and matches Kitco within
 * normal bid/ask noise. It requires a Referer/Origin header matching their
 * own site or it returns 403 — browsers can't spoof that header, but a
 * Worker's server-side fetch() can, which is what GOLDPRICE_HEADERS below
 * does. If goldprice.org ever changes that check and starts rejecting this,
 * gold/silver fall back to the Yahoo futures path automatically (source
 * field will say "yahoo-futures" instead of "goldprice-spot" — check that
 * if numbers look off again).
 *
 * Platinum/palladium have no free spot feed as good as goldprice.org's, so
 * they still use Yahoo futures (PL=F, PA=F) — same caveat applies to them,
 * just not fixed here since they get far less scrutiny/traffic.
 */

const FUTURES_SYMBOLS = {
  gold:      "GC=F",
  silver:    "SI=F",
  platinum:  "PL=F",
  palladium: "PA=F",
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const YF_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  "Accept":     "application/json",
};

// goldprice.org checks Referer/Origin and 403s without it — spoof both to
// match their own site. This only works from a server (Worker), not a browser.
const GOLDPRICE_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  "Accept":     "application/json",
  "Referer":    "https://goldprice.org/",
  "Origin":     "https://goldprice.org",
};

/** True spot gold+silver (USD/oz) from goldprice.org. Returns null on any failure. */
async function fetchGoldpriceOrgSpot() {
  try {
    const res = await fetch("https://data-asg.goldprice.org/dbXRates/USD", {
      headers: GOLDPRICE_HEADERS,
    });
    if (!res.ok) return null;

    const data = await res.json();
    const item = data?.items?.find((i) => i.curr === "USD") ?? data?.items?.[0];
    const gold = item?.xauPrice;
    const silver = item?.xagPrice;

    if (typeof gold === "number" && gold > 0 && typeof silver === "number" && silver > 0) {
      return { gold: Number(gold.toFixed(2)), silver: Number(silver.toFixed(2)) };
    }
    return null;
  } catch {
    return null;
  }
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    // ── /history — 30-day daily closing prices ──────────────────────────────
    if (url.pathname === "/history") {
      try {
        const entries = await Promise.all(
          Object.entries(FUTURES_SYMBOLS).map(async ([metal, symbol]) => {
            try {
              const res = await fetch(
                `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1mo`,
                { headers: YF_HEADERS }
              );
              const data = await res.json();
              const result = data?.chart?.result?.[0];
              if (!result) return [metal, []];

              const timestamps = result.timestamp ?? [];
              const closes     = result.indicators?.quote?.[0]?.close ?? [];

              const points = timestamps
                .map((ts, i) => {
                  const price = closes[i];
                  if (typeof price !== "number" || price <= 0) return null;
                  return { timestamp: new Date(ts * 1000).toISOString(), price: Number(price.toFixed(2)) };
                })
                .filter(Boolean);

              return [metal, points];
            } catch {
              return [metal, []];
            }
          })
        );

        const history = Object.fromEntries(entries);

        return Response.json(
          { ok: true, history },
          { headers: { ...CORS_HEADERS, "Cache-Control": "no-store" } }
        );
      } catch (err) {
        return Response.json({ ok: false, error: String(err) }, { status: 500, headers: CORS_HEADERS });
      }
    }

    // ── / — live spot prices ─────────────────────────────────────────────────
    try {
      // Platinum/palladium always come from Yahoo futures (no free spot feed for these).
      // Gold/silver also fetched here so we have a fallback if goldprice.org fails.
      const futuresEntries = await Promise.all(
        Object.entries(FUTURES_SYMBOLS).map(async ([metal, symbol]) => {
          try {
            const res = await fetch(
              `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`,
              { headers: YF_HEADERS }
            );
            const data = await res.json();
            const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
            return [metal, typeof price === "number" && price > 0 ? Number(price.toFixed(2)) : null];
          } catch {
            return [metal, null];
          }
        })
      );
      const futuresPrices = Object.fromEntries(futuresEntries);

      let prices;
      let source = "yahoo-futures";

      const spot = await fetchGoldpriceOrgSpot();
      if (spot) {
        prices = {
          gold: spot.gold,
          silver: spot.silver,
          platinum: futuresPrices.platinum,
          palladium: futuresPrices.palladium,
        };
        source = "goldprice-spot";
      } else {
        prices = futuresPrices;
      }

      if (!prices.gold || !prices.silver) {
        return Response.json(
          { ok: false, error: "fetch_failed" },
          { status: 503, headers: CORS_HEADERS }
        );
      }

      return Response.json(
        { ok: true, ...prices, source, fetchedAt: new Date().toISOString() },
        { headers: { ...CORS_HEADERS, "Cache-Control": "public, max-age=300, s-maxage=300" } }
      );
    } catch (err) {
      return Response.json({ ok: false, error: String(err) }, { status: 500, headers: CORS_HEADERS });
    }
  },
};
