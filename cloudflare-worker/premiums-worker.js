/**
 * Lode Premiums Worker
 * =============================================================================
 * Scrapes dealer buy prices for 4 coins × 4 dealers, computes premiums over
 * live spot, and stores them in KV so lode.rocks /compare always shows fresh
 * data without a manual weekly update pass.
 *
 * Routes:
 *   GET /premiums         → current premiums JSON (reads KV)
 *   GET /premiums/refresh → trigger a manual refresh (same as cron, returns result)
 *
 * Cron: every Tuesday at 09:00 local (configure in wrangler.toml)
 *
 * =============================================================================
 * SETUP (one-time)
 * =============================================================================
 *
 * 1. Enable Browser Rendering on your Cloudflare account (Workers > Browser
 *    Rendering). Requires a paid Workers plan.
 *
 * 2. Create a KV namespace:
 *      wrangler kv:namespace create PREMIUMS_KV
 *    Copy the returned id into wrangler.toml (see below).
 *
 * 3. Add to wrangler.toml (create if missing in this directory):
 *
 *      name = "lode-premiums-worker"
 *      main = "premiums-worker.js"
 *      compatibility_date = "2024-09-23"
 *
 *      [[browser]]
 *      binding = "BROWSER"
 *
 *      [[kv_namespaces]]
 *      binding = "PREMIUMS_KV"
 *      id = "<paste-your-kv-id-here>"
 *
 *      [triggers]
 *      crons = ["0 9 * * 2"]   # Every Tuesday at 09:00 UTC
 *
 * 4. Deploy:
 *      cd cloudflare-worker && wrangler deploy premiums-worker.js
 *
 * 5. In lode.rocks, update lib/compare/premiums.ts to call
 *    GET https://lode-premiums-worker.<your-subdomain>.workers.dev/premiums
 *    and fall back to the static PREMIUMS table if the fetch fails.
 *    (See lib/compare/getPremiums.ts scaffold at the bottom of this file.)
 *
 * =============================================================================
 * HOW IT WORKS
 * =============================================================================
 *
 * SD Bullion — plain fetch (SSR). Their HTML includes a meta-product:price:amount
 * tag with the current check/wire qty-1 price. Fast and reliable.
 *
 * APMEX / JM Bullion / Money Metals — Browser Rendering (Puppeteer). These
 * sites are fully client-rendered; prices only appear after JS executes.
 * The worker launches a headless browser, navigates to each product page,
 * waits for the price element, and reads the text.
 *
 * DOM SELECTORS: The selectors below were written from knowledge of each
 * site's structure as of May 2026. If a dealer redesigns their product page
 * the selector will break silently (the premium stays at its last known value
 * from KV). Check the SELECTOR_NOTES comments and update as needed.
 */

import puppeteer from "@cloudflare/puppeteer";

// ---------------------------------------------------------------------------
// Product page URLs — qty-1 check/wire (ACH) prices
// ---------------------------------------------------------------------------
const PAGES = {
  "silver-eagle": {
    sdbullion:   "https://sdbullion.com/1-oz-american-silver-eagle-coin-random-year-bu",
    apmex:       "https://www.apmex.com/product/23331/1-oz-american-silver-eagle-coin-bu-random-year",
    jmbullion:   "https://www.jmbullion.com/american-silver-eagle-varied-year/",
    moneymetals: "https://www.moneymetals.com/1-oz-american-silver-eagle-random-year/262",
  },
  "gold-eagle": {
    sdbullion:   "https://sdbullion.com/1-oz-american-gold-eagle-coin-random-year-bu",
    apmex:       "https://www.apmex.com/product/1/1-oz-american-gold-eagle-coin-bu-random-year",
    jmbullion:   "https://www.jmbullion.com/1-oz-american-gold-eagle/",
    moneymetals: "https://www.moneymetals.com/1-oz-gold-eagle-coins/252",
  },
  "silver-maple": {
    sdbullion:   "https://sdbullion.com/canadian-silver-maple-leaf-coin-random-year",
    apmex:       "https://www.apmex.com/product/1090/1-oz-canadian-silver-maple-leaf-coin-bu-random-year",
    jmbullion:   "https://www.jmbullion.com/canadian-silver-maple-leaf-varied-year/",
    moneymetals: "https://www.moneymetals.com/1-oz-silver-maple-leaf/251",
  },
  "gold-maple": {
    sdbullion:   "https://sdbullion.com/1-oz-canadian-gold-maple-leaf-coin-random-year",
    // apmex: skipped — APMEX only carries a .99999 assay-card SKU, not standard .9999 random-year
    jmbullion:   "https://www.jmbullion.com/1-oz-canadian-gold-maple-leaf/",
    moneymetals: "https://www.moneymetals.com/1-oz-gold-maple-leaf/253",
  },
};

// ---------------------------------------------------------------------------
// CSS selectors for price extraction on JS-rendered dealer pages
// SELECTOR_NOTES: Update these if a dealer redesigns their page.
// ---------------------------------------------------------------------------
const SELECTORS = {
  apmex: {
    // APMEX product page: price appears in a span inside .product-price or
    // data-testid="product-buy-price". The ACH/wire price is the base price.
    // SELECTOR_NOTE: Inspect network tab for XHR to /api/product/pricing if
    // the DOM selector is unstable — an API call may be more reliable.
    price: '[data-testid="product-buy-price"], .product-price .price, [class*="ProductPrice"] .price',
    waitFor: '[data-testid="product-buy-price"], .product-price',
  },
  jmbullion: {
    // JM Bullion: price in .product-page-price .text or #ajax_price span.
    // SELECTOR_NOTE: JM loads prices via AJAX into #ajax_price. The data-price
    // attribute on that element is often more parseable than the formatted text.
    price: '#ajax_price [data-price], #ajax_price, .product-page-price .price',
    waitFor: '#ajax_price',
  },
  moneymetals: {
    // Money Metals: price in .buy-price or .product-price span.
    // SELECTOR_NOTE: MM uses a Vue/React app; the price renders into
    // [class*="price"] after a brief load. The ACH price is the first price shown.
    price: '[class*="ach-price"], [class*="buyPrice"], .product-price span.price',
    waitFor: '[class*="price"]',
  },
};

// ---------------------------------------------------------------------------
// Spot prices — from Yahoo Finance (same approach as prices-worker.js)
// ---------------------------------------------------------------------------
const SPOT_SYMBOLS = { gold: "GC=F", silver: "SI=F" };
const YF_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  Accept: "application/json",
};

async function fetchSpot() {
  const entries = await Promise.all(
    Object.entries(SPOT_SYMBOLS).map(async ([metal, symbol]) => {
      const res = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`,
        { headers: YF_HEADERS }
      );
      const data = await res.json();
      const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
      return [metal, typeof price === "number" ? Number(price.toFixed(2)) : null];
    })
  );
  return Object.fromEntries(entries); // { gold: 4457.50, silver: 74.77 }
}

// ---------------------------------------------------------------------------
// SD Bullion — plain fetch, grab meta-product:price:amount from SSR HTML
// ---------------------------------------------------------------------------
async function fetchSDBullionPrice(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; lode-premiums-bot/1.0)",
        Accept: "text/html",
      },
    });
    const html = await res.text();

    // <meta property="product:price:amount" content="85.63" />
    const match = html.match(/meta-product:price:amount[^>]*content="([0-9.,]+)"/i)
      || html.match(/property="product:price:amount"[^>]*content="([0-9.,]+)"/i)
      || html.match(/content="([0-9.,]+)"[^>]*property="product:price:amount"/i);

    if (match) {
      return parseFloat(match[1].replace(",", ""));
    }

    // Fallback: look for the price table row (check/wire, qty 1)
    // "| 1 - 4        | $4,745.27    |" or similar markdown-rendered table
    const tableMatch = html.match(/1\s*[-–]\s*[49]\s*[|,]\s*\$([0-9,]+\.[0-9]{2})/);
    if (tableMatch) {
      return parseFloat(tableMatch[1].replace(",", ""));
    }

    return null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// APMEX / JM Bullion / Money Metals — Browser Rendering (Puppeteer)
// ---------------------------------------------------------------------------
async function fetchBrowserPrice(env, url, dealerId) {
  const sel = SELECTORS[dealerId];
  if (!sel) return null;

  let browser;
  try {
    browser = await puppeteer.launch(env.BROWSER);
    const page = await browser.newPage();

    // @cloudflare/puppeteer does not support setRequestInterception —
    // navigate directly and rely on the selector timeout to bound wait time.
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25_000 });

    // Wait for price element to appear
    await page.waitForSelector(sel.waitFor, { timeout: 8_000 }).catch(() => {});

    // Try each selector in the comma-separated list
    const selectors = sel.price.split(",").map((s) => s.trim());
    for (const selector of selectors) {
      try {
        const text = await page.$eval(selector, (el) => {
          // Prefer data-price attribute (numeric, no formatting) over text
          return el.getAttribute("data-price") || el.textContent;
        });
        if (text) {
          const cleaned = text.replace(/[^0-9.]/g, "");
          const val = parseFloat(cleaned);
          if (!isNaN(val) && val > 0) return val;
        }
      } catch {
        continue;
      }
    }
    return null;
  } catch (err) {
    console.error(`Browser fetch failed for ${dealerId} ${url}:`, err.message);
    return null;
  } finally {
    await browser?.close();
  }
}

// ---------------------------------------------------------------------------
// Main scrape — returns full premiums table
// ---------------------------------------------------------------------------
async function scrapePremiums(env) {
  const [spot, previousRaw] = await Promise.all([
    fetchSpot(),
    env.PREMIUMS_KV.get("premiums", { type: "json" }),
  ]);

  const previous = previousRaw?.premiums ?? {};
  const results = {};
  const log = [];

  for (const [coinId, dealers] of Object.entries(PAGES)) {
    results[coinId] = {};
    const metalKey = coinId.includes("gold") ? "gold" : "silver";
    const spotPrice = spot[metalKey];

    for (const [dealerId, url] of Object.entries(dealers)) {
      let pagePrice = null;
      let method = "unknown";

      if (dealerId === "sdbullion") {
        pagePrice = await fetchSDBullionPrice(url);
        method = "ssr-fetch";
      } else {
        pagePrice = await fetchBrowserPrice(env, url, dealerId);
        method = "browser-render";
      }

      let premium = null;
      if (pagePrice !== null && spotPrice !== null) {
        premium = Number((pagePrice - spotPrice).toFixed(2));
      }

      // Fall back to previous value if scrape failed
      const prevPremium = previous[coinId]?.[dealerId] ?? null;
      const finalPremium = premium !== null ? premium : prevPremium;

      results[coinId][dealerId] = finalPremium ?? 0;

      log.push({
        coin: coinId,
        dealer: dealerId,
        pagePrice,
        spotPrice,
        premium,
        prevPremium,
        used: finalPremium,
        method,
        ok: premium !== null,
      });
    }

    // APMEX gold-maple is always 0 (they don't carry standard .9999 random-year)
    if (coinId === "gold-maple") {
      results[coinId].apmex = 0;
    }
  }

  const payload = {
    premiums: results,
    spot,
    scrapedAt: new Date().toISOString(),
    log,
  };

  await env.PREMIUMS_KV.put("premiums", JSON.stringify(payload), {
    expirationTtl: 60 * 60 * 24 * 14, // keep for 14 days
  });

  return payload;
}

// ---------------------------------------------------------------------------
// Worker entrypoint
// ---------------------------------------------------------------------------
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export default {
  // Cron trigger (wrangler.toml: crons = ["0 9 * * 2"])
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(scrapePremiums(env));
  },

  // HTTP handler
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);

    // GET /premiums — return cached KV value
    if (url.pathname === "/premiums" && request.method === "GET") {
      const cached = await env.PREMIUMS_KV.get("premiums", { type: "json" });
      if (!cached) {
        return Response.json(
          { ok: false, error: "no_data", hint: "Call /premiums/refresh first" },
          { status: 404, headers: CORS }
        );
      }
      return Response.json(
        { ok: true, ...cached },
        { headers: { ...CORS, "Cache-Control": "public, max-age=3600, s-maxage=3600" } }
      );
    }

    // GET /premiums/refresh — manual trigger, returns result inline
    if (url.pathname === "/premiums/refresh" && request.method === "GET") {
      try {
        const result = await scrapePremiums(env);
        return Response.json({ ok: true, ...result }, { headers: CORS });
      } catch (err) {
        return Response.json({ ok: false, error: String(err) }, { status: 500, headers: CORS });
      }
    }

    return new Response("Not found", { status: 404, headers: CORS });
  },
};

/**
 * =============================================================================
 * lib/compare/getPremiums.ts  — drop this alongside premiums.ts in Next.js
 * =============================================================================
 *
 * import { PREMIUMS, PREMIUMS_LAST_REVIEWED } from "./premiums";
 * import type { CompareCoin } from "./coins";
 * import type { Dealer } from "./dealers";
 *
 * type PremiumTable = Record<CompareCoin["id"], Record<Dealer["id"], number>>;
 *
 * let _cache: { premiums: PremiumTable; scrapedAt: string } | null = null;
 *
 * export async function getLivePremiums(): Promise<{
 *   premiums: PremiumTable;
 *   lastReviewed: string;
 * }> {
 *   // Re-use in-process cache for the lifetime of this server instance
 *   if (_cache) return { premiums: _cache.premiums, lastReviewed: _cache.scrapedAt };
 *
 *   try {
 *     const res = await fetch(
 *       process.env.PREMIUMS_WORKER_URL + "/premiums",
 *       { next: { revalidate: 3600 } }   // ISR: refresh every hour
 *     );
 *     if (!res.ok) throw new Error(`status ${res.status}`);
 *     const data = await res.json();
 *     _cache = { premiums: data.premiums, scrapedAt: data.scrapedAt };
 *     return { premiums: data.premiums, lastReviewed: data.scrapedAt };
 *   } catch {
 *     // Fall back to hand-maintained static values
 *     return { premiums: PREMIUMS, lastReviewed: PREMIUMS_LAST_REVIEWED };
 *   }
 * }
 *
 * Add to .env.local:
 *   PREMIUMS_WORKER_URL=https://lode-premiums-worker.<your-subdomain>.workers.dev
 *
 * =============================================================================
 */
