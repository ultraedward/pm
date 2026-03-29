/**
 * Lode Prices Worker
 * Deploy at: Cloudflare Dashboard → Workers & Pages → Create Worker → paste this
 * Route:     prices.lode.rocks/* (or any subdomain you choose)
 *
 * Fetches precious metals spot prices from Yahoo Finance.
 * Runs on Cloudflare's edge network — not AWS, so Yahoo Finance isn't blocked.
 * Returns all 4 metals in one call. Edge cache: 5 minutes.
 */

const SYMBOLS = {
  gold:      "GC=F",
  silver:    "SI=F",
  platinum:  "PL=F",
  palladium: "PA=F",
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "https://lode.rocks",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    try {
      // Fetch all 4 metals from Yahoo Finance in parallel
      const entries = await Promise.all(
        Object.entries(SYMBOLS).map(async ([metal, symbol]) => {
          try {
            const res = await fetch(
              `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`,
              {
                headers: {
                  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                  "Accept":     "application/json",
                },
              }
            );
            const data = await res.json();
            const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
            return [metal, typeof price === "number" && price > 0 ? Number(price.toFixed(2)) : null];
          } catch {
            return [metal, null];
          }
        })
      );

      const prices = Object.fromEntries(entries);

      if (!prices.gold || !prices.silver) {
        return Response.json(
          { ok: false, error: "fetch_failed" },
          { status: 503, headers: CORS_HEADERS }
        );
      }

      return Response.json(
        { ok: true, ...prices, fetchedAt: new Date().toISOString() },
        {
          headers: {
            ...CORS_HEADERS,
            "Cache-Control": "public, max-age=300, s-maxage=300", // 5-min edge cache
          },
        }
      );
    } catch (err) {
      return Response.json(
        { ok: false, error: String(err) },
        { status: 500, headers: CORS_HEADERS }
      );
    }
  },
};
