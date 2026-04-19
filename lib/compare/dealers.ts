// Dealer catalog for the /compare view.
//
// Each dealer has two URL templates:
//
//   product     — the canonical product page URL, with `{slug}` interpolated
//                 from coins.ts per dealer.
//   affiliate   — optional tracking URL that wraps or augments `product` once
//                 an affiliate program approves us. Supports two tokens:
//                   {url}  — URL-encoded product URL (for redirect-style links)
//                   {id}   — the affiliate ID from the corresponding env var
//                 If `affiliate` is undefined, `product` is used as-is.
//
// Affiliate IDs come from env vars (see `.env.example`) so secrets never land
// in source control. When a program approves us, set the env var in Vercel and
// set the `affiliate` template here — the /compare UI needs no other changes.
//
// Keep this list short on purpose — the /compare page is a focused view, not
// a directory. Four dealers is enough to make a price floor visible without
// overwhelming the user.

export type Dealer = {
  id: "apmex" | "jmbullion" | "sdbullion" | "moneymetals";
  name: string;
  short: string;
  product: string;
  affiliate?: string;
  affiliateId?: string;
};

// Read affiliate IDs at module load. Undefined when the program isn't live.
const AFF_IDS: Record<Dealer["id"], string | undefined> = {
  apmex:       process.env.AFFILIATE_APMEX_ID,
  jmbullion:   process.env.AFFILIATE_JMBULLION_ID,
  sdbullion:   process.env.AFFILIATE_SDBULLION_ID,
  moneymetals: process.env.AFFILIATE_MONEYMETALS_ID,
};

export const DEALERS: Dealer[] = [
  {
    id: "apmex",
    name: "APMEX",
    short: "APMEX",
    product: "https://www.apmex.com/product/{slug}",
    // APMEX is on FlexOffers — enable once approved.
    // affiliate: "https://track.flexlinkspro.com/a.ashx?foid=XXXXX&foc=1&fot=9999&fos=1&url={url}",
    affiliateId: AFF_IDS.apmex,
  },
  {
    id: "jmbullion",
    name: "JM Bullion",
    short: "JM",
    product: "https://www.jmbullion.com/{slug}/",
    // JM Bullion is on Awin (merchant ID 22685) — enable once approved.
    // affiliate: "https://www.awin1.com/cread.php?awinmid=22685&awinaffid={id}&ued={url}",
    affiliateId: AFF_IDS.jmbullion,
  },
  {
    id: "sdbullion",
    name: "SD Bullion",
    short: "SD",
    product: "https://sdbullion.com/{slug}",
    // SD Bullion is on Awin (merchant ID 78598) — same account as JM Bullion + Money Metals.
    // affiliate: "https://www.awin1.com/cread.php?awinmid=78598&awinaffid={id}&ued={url}",
    affiliateId: AFF_IDS.sdbullion,
  },
  {
    id: "moneymetals",
    name: "Money Metals",
    short: "MM",
    product: "https://www.moneymetals.com/{slug}",
    // Money Metals is on Awin (same account as JM Bullion) — enable once approved.
    // affiliate: "https://www.awin1.com/cread.php?awinmid=XXXXX&awinaffid={id}&ued={url}",
    affiliateId: AFF_IDS.moneymetals,
  },
];

/**
 * Build the outbound URL for a dealer and product slug, using the affiliate
 * wrapper when both `affiliate` and `affiliateId` are set, otherwise falling
 * back to the raw product URL. An empty slug returns "" (caller should hide
 * the row or no-op the click).
 */
export function buildDealerUrl(dealer: Dealer, slug: string): string {
  if (!slug) return "";
  const productUrl = dealer.product.replace("{slug}", slug);

  if (dealer.affiliate && dealer.affiliateId) {
    return dealer.affiliate
      .replace("{slug}", slug)
      .replace("{id}", dealer.affiliateId)
      .replace("{url}", encodeURIComponent(productUrl));
  }

  return productUrl;
}

export function dealerById(id: string): Dealer | undefined {
  return DEALERS.find((d) => d.id === id);
}
