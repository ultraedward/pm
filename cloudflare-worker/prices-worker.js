/**
 * Lode Prices Worker
 * Deploy at: Cloudflare Dashboard → Workers & Pages → Create Worker → paste this
 * Route:     prices.lode.rocks/* (or any subdomain you choose)
 *
 * GET /          → live spot prices for all 4 metals (cached 5 min)
 * GET /history   → 30-day daily closing prices for all 4 metals (one-time backfill use)
 *
 * Runs on Cloudflare's edge network — not AWS, so Yahoo Finance isn't blocked.
 */

const SYMBOLS = {
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
          Object.entries(SYMBOLS).map(async ([metal, symbol]) => {
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
      const entries = await Promise.all(
        Object.entries(SYMBOLS).map(async ([metal, symbol]) => {
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

      const prices = Object.fromEntries(entries);

      if (!prices.gold || !prices.silver) {
        return Response.json(
          { ok: false, error: "fetch_failed" },
          { status: 503, headers: CORS_HEADERS }
        );
      }

      return Response.json(
        { ok: true, ...prices, fetchedAt: new Date().toISOString() },
        { headers: { ...CORS_HEADERS, "Cache-Control": "public, max-age=300, s-maxage=300" } }
      );
    } catch (err) {
      return Response.json({ ok: false, error: String(err) }, { status: 500, headers: CORS_HEADERS });
    }
  },
};
