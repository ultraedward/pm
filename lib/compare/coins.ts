// The four bullion coins we compare in v1. Kept intentionally tight —
// these are the products stackers actually price-shop across dealers.
//
// `slug` is the per-dealer product-URL slug. It gets interpolated into
// the dealer's `url` template (see dealers.ts). Only fill in slugs we've
// verified; leave blanks (empty string) and the UI will skip that row.

import type { Dealer } from "./dealers";

export type CompareCoin = {
  id: "silver-eagle" | "gold-eagle" | "silver-maple" | "gold-maple";
  label: string;
  metal: "gold" | "silver";
  oz: number;
  // Per-dealer product slug. Empty string = we don't have a link yet.
  slugs: Record<Dealer["id"], string>;
};

export const COMPARE_COINS: CompareCoin[] = [
  {
    id: "silver-eagle",
    label: "American Silver Eagle",
    metal: "silver",
    oz: 1.0,
    slugs: {
      apmex: "23331/1-oz-american-silver-eagle-coin-bu-random-year",
      jmbullion: "american-silver-eagle-varied-year",
      sdbullion: "1-oz-american-silver-eagle-coins-random-year",
      moneymetals: "1-oz-american-silver-eagle-random-year/262",
    },
  },
  {
    id: "gold-eagle",
    label: "American Gold Eagle",
    metal: "gold",
    oz: 1.0,
    slugs: {
      apmex: "1/1-oz-american-gold-eagle-coin-bu-random-year",
      jmbullion: "1-oz-american-gold-eagle",
      sdbullion: "1-oz-american-gold-eagle-coin-random-year-bu",
      moneymetals: "1-oz-american-gold-eagle-coin/7",
    },
  },
  {
    id: "silver-maple",
    label: "Canadian Silver Maple",
    metal: "silver",
    oz: 1.0,
    slugs: {
      apmex: "1090/1-oz-canadian-silver-maple-leaf-coin-bu-random-year",
      jmbullion: "canadian-silver-maple-leaf-varied-year",
      sdbullion: "canadian-silver-maple-leaf-coin-random-year",
      moneymetals: "1-oz-canadian-silver-maple-leaf-coin/16",
    },
  },
  {
    id: "gold-maple",
    label: "Canadian Gold Maple",
    metal: "gold",
    oz: 1.0,
    slugs: {
      // APMEX does not carry a standard .9999 random-year Gold Maple — their
      // only random-year SKU is a .99999 + assay card product, which is a
      // different (premium) item not comparable to what JM/SD/MM sell.
      // Leaving blank so the UI skips the APMEX row on this coin tab rather
      // than showing a misleading apples-to-oranges comparison.
      apmex: "",
      jmbullion: "1-oz-canadian-gold-maple-leaf-any-year",
      sdbullion: "1-oz-canadian-gold-maple-leaf-coin-random-year",
      // MM currently only lists the KC3 1 oz Gold Maple, no "random year" SKU.
      // Since all current RCM production is KC3, this is the right pick — but
      // worth revisiting if MM adds a mixed-year listing.
      moneymetals: "canadian-maple-leaf-king-charles-iii-1-troy-ounce-gold-9999-pure/1017",
    },
  },
];

export function coinById(id: string): CompareCoin | undefined {
  return COMPARE_COINS.find((c) => c.id === id);
}
