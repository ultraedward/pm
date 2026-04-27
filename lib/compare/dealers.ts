// Dealer catalog for the /compare view.
//
// Each dealer has two URL templates:
//
//   product     — the canonical product page URL, with `{slug}` interpolated
//                 from coins.ts per dealer.
//   affiliate   — optional tracking URL that wraps or augments `product` once
//                 an affiliate program approves us. Supports three tokens:
//                   {url}    — URL-encoded product URL (for redirect-style links)
//                   {id}     — the affiliate ID from the corresponding env var
//                   {subid}  — per-click sub-ID we mint in /api/track/click and
//                              persist on the DealerClick row. The affiliate
//                              network passes it back in their click reports
//                              so we can join their conversions against our
//                              click table. Awin: clickref. FlexOffers: fos.
//                 If `affiliate` is undefined, `product` is used as-is.
//
// Affiliate IDs come from env vars (see `.env.example`) so secrets never land
// in source control. When a program approves us, set the env var in Vercel and
// uncomment the `affiliate` template here — the /compare UI needs no other
// changes; clicks already route through /api/track/click which calls
// buildDealerUrl with a freshly minted subId.
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
    // APMEX is on FlexOffers — enable once approved. {id} is the FlexOffers
    // foid (publisher offer id), {subid} maps to fos (sub-ID) so click
    // reports come back tagged with our DealerClick.subId.
    // affiliate: "https://track.flexlinkspro.com/a.ashx?foid={id}&foc=1&fot=9999&fos={subid}&url={url}",
    affiliateId: AFF_IDS.apmex,
  },
  {
    id: "jmbullion",
    name: "JM Bullion",
    short: "JM",
    product: "https://www.jmbullion.com/{slug}/",
    // JM Bullion via Awin (merchant ID 22685). awinaffid is our Awin publisher
    // ID; clickref is Awin's sub-ID slot, which round-trips DealerClick.subId
    // back in their commission reports. Awin gates each merchant relationship
    // separately — the wrapper only kicks in when AFFILIATE_JMBULLION_ID is set.
    affiliate: "https://www.awin1.com/cread.php?awinmid=22685&awinaffid={id}&ued={url}&clickref={subid}",
    affiliateId: AFF_IDS.jmbullion,
  },
  {
    id: "sdbullion",
    name: "SD Bullion",
    short: "SD",
    product: "https://sdbullion.com/{slug}",
    // SD Bullion via Awin (merchant ID 78598). Same Awin publisher account as
    // JM Bullion + Money Metals — one ID covers all three. Wrapper kicks in
    // only when AFFILIATE_SDBULLION_ID is set.
    affiliate: "https://www.awin1.com/cread.php?awinmid=78598&awinaffid={id}&ued={url}&clickref={subid}",
    affiliateId: AFF_IDS.sdbullion,
  },
  {
    id: "moneymetals",
    name: "Money Metals",
    short: "MM",
    product: "https://www.moneymetals.com/{slug}",
    // Money Metals via Awin (merchant ID 88985). Same Awin publisher account
    // as JM + SD. Wrapper kicks in only when AFFILIATE_MONEYMETALS_ID is set.
    affiliate: "https://www.awin1.com/cread.php?awinmid=88985&awinaffid={id}&ued={url}&clickref={subid}",
    affiliateId: AFF_IDS.moneymetals,
  },
];

/**
 * Build the outbound URL for a dealer and product slug, using the affiliate
 * wrapper when both `affiliate` and `affiliateId` are set, otherwise falling
 * back to the raw product URL. An empty slug returns "" (caller should hide
 * the row or no-op the click).
 *
 * `subId` is the per-click identifier minted in /api/track/click. It gets
 * threaded into the affiliate template's {subid} slot (Awin clickref,
 * FlexOffers fos), so when commission reports come back from the network
 * we can join them against the DealerClick table by subId. Pre-affiliate-
 * approval (no `affiliate` template), the subId has nowhere to land and is
 * silently ignored — the click is still logged, the bare product URL still
 * works, and when affiliate goes live the subId reconciliation just starts
 * working without a UI change.
 */
export function buildDealerUrl(dealer: Dealer, slug: string, subId: string = ""): string {
  if (!slug) return "";
  const productUrl = dealer.product.replace("{slug}", slug);

  if (dealer.affiliate && dealer.affiliateId) {
    return dealer.affiliate
      .replace("{slug}", slug)
      .replace("{id}", dealer.affiliateId)
      .replace("{subid}", encodeURIComponent(subId))
      .replace("{url}", encodeURIComponent(productUrl));
  }

  return productUrl;
}

export function dealerById(id: string): Dealer | undefined {
  return DEALERS.find((d) => d.id === id);
}
