/**
 * Single source of truth for how each metal's price is sourced — provider,
 * ticker, and whether it's true spot or a futures proxy.
 *
 * WHY THIS FILE EXISTS: prior to Sep 2026, every page described gold/silver/
 * platinum/palladium as coming from "Yahoo Finance futures data" — hardcoded
 * separately in ~9 files (methodology, 4 price pages' JSON-LD, the FAQ page's
 * schema + visible text, compare, privacy). When gold/silver moved to a true
 * spot feed (goldprice.org), those 9 copies of the same fact didn't update
 * with it, and the site kept claiming futures pricing for metals that no
 * longer used it. Import from here instead of hardcoding the fact anywhere
 * else, so the next source change only needs one edit.
 *
 * Keep this in sync with cloudflare-worker/prices-worker.js, which is the
 * actual runtime source of truth for what gets fetched.
 */

export type Metal = "gold" | "silver" | "platinum" | "palladium";

export type PriceSourceInfo = {
  /** Provider name, for prose (e.g. "goldprice.org", "Yahoo Finance"). */
  provider: string;
  /** Provider homepage, for linking. */
  providerUrl: string;
  /** Ticker symbol used, if the provider is futures-based (e.g. "PL=F"). Undefined for true-spot sources. */
  ticker?: string;
  /** True spot (LBMA-style) vs. a futures proxy. */
  isTrueSpot: boolean;
};

export const PRICE_SOURCES: Record<Metal, PriceSourceInfo> = {
  gold: {
    provider: "goldprice.org",
    providerUrl: "https://goldprice.org",
    isTrueSpot: true,
  },
  silver: {
    provider: "goldprice.org",
    providerUrl: "https://goldprice.org",
    isTrueSpot: true,
  },
  platinum: {
    provider: "Yahoo Finance",
    providerUrl: "https://finance.yahoo.com",
    ticker: "PL=F",
    isTrueSpot: false,
  },
  palladium: {
    provider: "Yahoo Finance",
    providerUrl: "https://finance.yahoo.com",
    ticker: "PA=F",
    isTrueSpot: false,
  },
};

/** Standard wording for the gap between a futures proxy and true spot. Used anywhere a non-spot metal's price is described. */
export const FUTURES_GAP_NOTE =
  "can run roughly 1-2% above or below true spot depending on market conditions (contango/backwardation)";

/** True if every futures-sourced metal has since been moved to true spot (i.e. nothing left to fix). Lets copy avoid overclaiming "some metals" once none are left. */
export const ANY_METAL_STILL_ON_FUTURES = Object.values(PRICE_SOURCES).some(
  (s) => !s.isTrueSpot
);
