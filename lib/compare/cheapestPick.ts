// Shared helper for "cheapest dealer right now" CTA blocks in transactional
// emails. Used by:
//   - the alert email (gold/silver alerts only — pt/pd are not in the
//     /compare catalog yet)
//   - the Monday digest (always shows gold + silver picks)
//
// Lives next to the dealer / coin / premium catalogs so the same source of
// truth that drives /compare also drives the email surfaces. When the
// catalog grows, both surfaces get the new picks for free.
//
// Output is intentionally aligned with /compare semantics: rank dealers by
// total cost (melt + premium), pick the lowest, link out via /api/track/click
// so the click is logged with a `source` attribution and a sub-ID gets
// threaded through to the affiliate network.

import { COMPARE_COINS, type CompareCoin } from "./coins";
import { DEALERS } from "./dealers";
import { PREMIUMS } from "./premiums";

export type CheapestPick = {
  coin: CompareCoin;
  dealerId: string;
  dealerName: string;
  spot: number;       // metal spot price used for the melt computation
  premium: number;    // dealer premium over spot, USD
  total: number;      // melt + premium — total cost of one coin today
  trackedUrl: string; // absolute /api/track/click URL with `source` attached
};

export type CheapestSource = "compare" | "alert-email" | "digest";

/**
 * Find the cheapest dealer for a coin at the supplied spot price. Returns
 * null when the coin isn't in the catalog, no dealer has a verified slug,
 * or the spot is missing/zero (we'd rather render no CTA than a $0 one).
 *
 * `spot` is single-metal (USD per troy oz) — caller passes the right one
 * for the coin's metal. The alert engine already has it as `currentPrice`;
 * the digest can pull it from its spots map.
 */
export function findCheapest(
  coinId: CompareCoin["id"],
  spot: number,
  baseUrl: string,
  source: CheapestSource,
): CheapestPick | null {
  const coin = COMPARE_COINS.find((c) => c.id === coinId);
  if (!coin) return null;
  if (!spot || spot <= 0) return null;

  const melt = coin.oz * spot;

  const ranked = DEALERS
    .filter((d) => !!coin.slugs[d.id])
    .map((d) => {
      const premium = PREMIUMS[coin.id]?.[d.id] ?? 0;
      return { d, premium, total: melt + premium };
    })
    .sort((a, b) => a.total - b.total);

  if (ranked.length === 0) return null;
  const best = ranked[0];

  // Trim trailing slash so we never emit `https://lode.rocks//api/...`
  const base = baseUrl.replace(/\/+$/, "");
  const trackedUrl =
    `${base}/api/track/click?coin=${encodeURIComponent(coin.id)}` +
    `&dealer=${encodeURIComponent(best.d.id)}` +
    `&source=${encodeURIComponent(source)}`;

  return {
    coin,
    dealerId: best.d.id,
    dealerName: best.d.name,
    spot,
    premium: best.premium,
    total: best.total,
    trackedUrl,
  };
}

/**
 * Map an alert's metal to the compare coin we'd surface in its email CTA.
 * Returns null for metals not in the catalog so callers can omit the block
 * cleanly rather than rendering an empty box.
 */
export function defaultCoinForMetal(metal: string): CompareCoin["id"] | null {
  switch (metal) {
    case "gold":   return "gold-eagle";
    case "silver": return "silver-eagle";
    default:       return null;
  }
}

function fmtUSD(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Render a single cheapest-dealer CTA block as inline HTML suitable for a
 * transactional email. Tables + inline styles only — no external CSS, no
 * web fonts, no images. Survives Gmail/Outlook stripping.
 */
export function renderCheapestBlock(pick: CheapestPick): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0e0c08;border:1px solid rgba(212,175,55,0.20);border-radius:10px;margin:8px 0;">
      <tr>
        <td style="padding:18px 20px;">
          <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#888;">
            Cheapest right now
          </p>
          <p style="margin:0;font-size:15px;color:#fff;line-height:1.4;">
            <strong style="color:#fff;">${pick.coin.label}</strong> at <strong style="color:#fff;">${pick.dealerName}</strong>
          </p>
          <p style="margin:6px 0 14px;font-size:18px;color:#D4AF37;font-weight:800;font-variant-numeric:tabular-nums;">
            ${fmtUSD(pick.total)}
            <span style="color:#666;font-size:12px;font-weight:500;"> · spot + ${fmtUSD(pick.premium)}</span>
          </p>
          <a href="${pick.trackedUrl}"
             style="display:inline-block;padding:10px 18px;background:#D4AF37;color:#000;font-weight:800;text-decoration:none;border-radius:999px;font-size:13px;letter-spacing:0.01em;">
            View at ${pick.dealerName} →
          </a>
        </td>
      </tr>
    </table>
  `;
}

/**
 * FTC-required affiliate disclosure for any email that contains tracked
 * dealer CTAs. Wording is aligned with the /compare page disclosure so
 * users see a consistent statement across surfaces.
 */
export function renderAffiliateDisclosure(): string {
  return `
    <p style="margin:16px 0 0;font-size:11px;color:#555;line-height:1.6;">
      Dealer links above are affiliate links. Lode may earn a commission if you buy — at no extra cost to you. Rankings sort by estimated total cost and are not influenced by affiliate relationships.
    </p>
  `;
}
