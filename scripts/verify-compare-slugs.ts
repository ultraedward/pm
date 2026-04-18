/**
 * scripts/verify-compare-slugs.ts
 *
 * Hits every dealer × coin URL in the /compare catalog and reports whether
 * each slug resolves to a real product page.
 *
 *   npm run verify-slugs          # check only
 *   npm run verify-slugs:open     # check + open actionable URLs in browser
 *
 * Output legend:
 *   ✓  200 — slug verified
 *   ⚠  403 / network blocked — likely dealer bot-protection; verify manually
 *      by opening the URL in your browser.
 *   ✗  404 or redirect to home/search — slug is wrong, fix in coins.ts.
 *
 * With --open (macOS/Linux), opens each actionable row in your default
 * browser: the product URL for ⚠ rows and the dealer search page for ✗ rows.
 *
 * Notes:
 *   - Dealers like APMEX and Money Metals sit behind Akamai / Cloudflare and
 *     will 403 most programmatic clients regardless of headers. Don't waste
 *     time trying to spoof past this — just verify those rows by hand.
 */

import { execSync } from "node:child_process";
import { COMPARE_COINS } from "../lib/compare/coins";
import { DEALERS, type Dealer } from "../lib/compare/dealers";

const OPEN_MODE = process.argv.includes("--open");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// Extra headers that make our request look more like a real browser hit.
// Helps a bit with less-strict bot filters; does not defeat Akamai.
const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent": UA,
  "Accept":
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
};

// Per-dealer path fragments that indicate a bad slug after redirects.
const SUSPECT_PATHS: Record<Dealer["id"], RegExp[]> = {
  apmex:       [/\/404/, /\/search\//, /\/not-found/, /\/product-not-found/, /^https?:\/\/www\.apmex\.com\/?$/],
  jmbullion:   [/\/404/, /\/search/, /\/not-found/, /^https?:\/\/www\.jmbullion\.com\/?$/],
  sdbullion:   [/\/404/, /\/search/, /\/not-found/, /^https?:\/\/sdbullion\.com\/?$/],
  moneymetals: [/\/404/, /\/search/, /\/not-found/, /^https?:\/\/www\.moneymetals\.com\/?$/],
};

// Per-dealer search URL template — used when `--open` is set on ✗ rows so we
// open the dealer's site search for that coin instead of the broken 404 URL.
const SEARCH_URL: Record<Dealer["id"], (q: string) => string> = {
  apmex:       (q) => `https://www.apmex.com/search?q=${encodeURIComponent(q)}`,
  jmbullion:   (q) => `https://www.jmbullion.com/search/?q=${encodeURIComponent(q)}`,
  sdbullion:   (q) => `https://sdbullion.com/search?q=${encodeURIComponent(q)}`,
  moneymetals: (q) => `https://www.moneymetals.com/search?q=${encodeURIComponent(q)}`,
};

type Verdict = "ok" | "manual" | "bad" | "skip";

type Result = {
  coinId: string;
  coinLabel: string;
  dealerId: Dealer["id"];
  dealerName: string;
  slug: string;
  url: string;
  finalUrl: string | null;
  status: number | null;
  verdict: Verdict;
  reason: string;
};

async function get(url: string): Promise<{ status: number; finalUrl: string } | null> {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: BROWSER_HEADERS,
    });
    await res.text().catch(() => undefined);
    return { status: res.status, finalUrl: res.url };
  } catch {
    return null;
  }
}

function isSuspectFinalUrl(dealerId: Dealer["id"], finalUrl: string): boolean {
  return SUSPECT_PATHS[dealerId].some((re) => re.test(finalUrl));
}

async function check(coinId: string, coinLabel: string, dealer: Dealer, slug: string): Promise<Result> {
  const url = slug ? dealer.product.replace("{slug}", slug) : "";
  const base = {
    coinId, coinLabel,
    dealerId: dealer.id, dealerName: dealer.name,
    slug, url,
  };

  if (!slug) {
    // Empty slug is intentional — the UI filters these rows out. Don't block
    // CI on them; flag as skip so partial launches stay green.
    return { ...base, finalUrl: null, status: null, verdict: "skip", reason: "no slug yet — row hidden in UI" };
  }

  const r = await get(url);
  if (!r) {
    return { ...base, finalUrl: null, status: null, verdict: "manual", reason: "network error — verify manually" };
  }

  // 200 + suspect redirect = bad
  if (r.status === 200 && isSuspectFinalUrl(dealer.id, r.finalUrl)) {
    return { ...base, finalUrl: r.finalUrl, status: r.status, verdict: "bad", reason: "redirected to search/home/404" };
  }
  // 200 with no redirect = ok
  if (r.status === 200) {
    return { ...base, finalUrl: r.finalUrl, status: r.status, verdict: "ok", reason: "ok" };
  }
  // 403 / 429 / 503 = bot protection, probably
  if (r.status === 403 || r.status === 429 || r.status === 503) {
    return { ...base, finalUrl: r.finalUrl, status: r.status, verdict: "manual", reason: `status ${r.status} — likely bot-blocked, verify manually` };
  }
  // 404 / 410 / 301-to-home = wrong slug
  if (r.status === 404 || r.status === 410) {
    return { ...base, finalUrl: r.finalUrl, status: r.status, verdict: "bad", reason: `status ${r.status}` };
  }
  // anything else — treat as manual review
  return { ...base, finalUrl: r.finalUrl, status: r.status, verdict: "manual", reason: `status ${r.status} — verify manually` };
}

function pad(s: string, n: number) {
  return s.length >= n ? s : s + " ".repeat(n - s.length);
}

const MARK: Record<Verdict, string> = { ok: "✓", manual: "⚠", bad: "✗", skip: "·" };

async function main() {
  const tasks: Promise<Result>[] = [];
  for (const coin of COMPARE_COINS) {
    for (const d of DEALERS) {
      tasks.push(check(coin.id, coin.label, d, coin.slugs[d.id]));
    }
  }

  console.log(`\nVerifying ${tasks.length} dealer × coin URLs...\n`);
  const results = await Promise.all(tasks);

  for (const r of results) {
    const statusCol = r.status === null ? "---" : String(r.status);
    console.log(
      `${MARK[r.verdict]} ${pad(r.coinLabel, 26)} ${pad(r.dealerName, 14)} ${pad(statusCol, 4)} ${r.reason}`
    );
  }

  const ok     = results.filter((r) => r.verdict === "ok");
  const manual = results.filter((r) => r.verdict === "manual");
  const bad    = results.filter((r) => r.verdict === "bad");
  const skip   = results.filter((r) => r.verdict === "skip");

  console.log(
    `\n${ok.length} verified · ${manual.length} need manual check · ${bad.length} wrong slug · ${skip.length} pending (hidden in UI) · ${results.length} total`
  );

  if (bad.length) {
    console.log(`\n✗ Fix these in lib/compare/coins.ts:`);
    for (const r of bad) {
      console.log(`   ${r.dealerName.padEnd(14)} ${r.coinLabel.padEnd(26)} → ${r.url || "(no slug)"}`);
    }
  }

  if (manual.length) {
    console.log(`\n⚠ Open these in your browser (cmd-click or paste):`);
    for (const r of manual) {
      console.log(`   ${r.url}`);
    }
    console.log(`\n   If a page loads the product, the slug is good — leave it alone.`);
    console.log(`   If it 404s or redirects to search/home, fix it in coins.ts.`);
  }

  // --open: launch browser tabs for everything actionable. Search URLs for ✗,
  // direct product URLs for ⚠. Uses the platform's default-browser opener.
  if (OPEN_MODE && (bad.length || manual.length)) {
    const urls = [
      ...manual.map((r) => r.url),
      ...bad.map((r) => SEARCH_URL[r.dealerId](r.coinLabel)),
    ];
    console.log(`\nOpening ${urls.length} tab(s) in your default browser...`);
    const opener = process.platform === "darwin" ? "open" : "xdg-open";
    for (const u of urls) {
      try {
        execSync(`${opener} ${JSON.stringify(u)}`, { stdio: "ignore" });
      } catch {
        console.log(`   (could not open ${u})`);
      }
    }
  } else if (bad.length || manual.length) {
    console.log(`\nTip: re-run with 'npm run verify-slugs:open' to open all actionable URLs in browser tabs.`);
  }

  console.log("");

  // Exit non-zero only on definitely-bad rows. 'manual' is informational.
  process.exit(bad.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
