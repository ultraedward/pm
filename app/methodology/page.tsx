import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Methodology & Data Sources",
  description:
    "Where Lode's precious metals price data comes from, how often it refreshes, and how our calculators work. Full transparency on sources, formulas, and limitations.",
  alternates: {
    canonical: "https://lode.rocks/methodology",
  },
  openGraph: {
    title: "Methodology & Data Sources | Lode",
    description:
      "Full transparency on where Lode's spot price data comes from and how every calculation is done.",
    url: "https://lode.rocks/methodology",
  },
};

const methodologyJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home",        "item": "https://lode.rocks" },
    { "@type": "ListItem", "position": 2, "name": "Methodology", "item": "https://lode.rocks/methodology" },
  ],
};

export default function MethodologyPage() {
  return (
    <main className="min-h-screen px-6 py-24" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(methodologyJsonLd) }}
      />
      <div className="mx-auto max-w-2xl space-y-12">

        <div>
          <p className="label mb-2">How it works</p>
          <h1 className="text-4xl font-black tracking-tight">Methodology</h1>
          <p className="mt-3 text-sm text-gray-500">
            Where our data comes from, how every calculation is done, and what this tool is not good for. No black boxes.
          </p>
        </div>

        {/* Verification callout — lead with the invitation to audit us */}
        <section
          className="rounded-2xl border p-6 space-y-3 text-sm"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">Verify us in 30 seconds</p>
          <p className="text-gray-300">
            Don&rsquo;t take our word for anything. Pick any metal, pull the live price from Lode, and cross-check it against{" "}
            <a href="https://www.kitco.com/charts/livegold.html" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 transition-colors">Kitco</a>,{" "}
            <a href="https://www.bullionvault.com/gold-price-chart.do" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 transition-colors">BullionVault</a>, or your broker during market hours. The numbers should match within pennies. If they don&rsquo;t, please tell us — we&rsquo;ll fix it.
          </p>
        </section>

        <div className="space-y-8 text-sm text-gray-400 leading-relaxed">

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Spot price sources</h2>
            <p>
              Live spot prices come from <a href="https://finance.yahoo.com" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 transition-colors">Yahoo Finance</a> futures data (GC=F, SI=F, PL=F, PA=F), routed through a Cloudflare Worker. Yahoo Finance blocks direct requests from server infrastructure, so the Worker proxies the request from Cloudflare&rsquo;s edge network before returning prices to the app.
            </p>
            <p>
              Prices are quoted in USD per troy ounce, consistent with COMEX and LBMA conventions. We do not modify, smooth, or adjust prices before displaying them — the number you see is what the provider returned.
            </p>
            <p>
              If the price source is unreachable, the site returns the last cached value rather than showing a $0 price. Over-the-weekend and holiday prices reflect the last traded value.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Refresh cadence</h2>
            <p>
              Live prices are fetched on demand when you load a page, cached for up to 10 minutes on our servers to avoid exhausting upstream API quotas, then refetched. During active market hours you&rsquo;ll see prices updated within that 10-minute window on any new page load.
            </p>
            <p>
              Historical sparklines, 52-week high/low, and 24-hour percent change are computed from daily snapshots we record to our own database at 00:00 UTC. Over time this gives us an independent history series we can plot without depending on a paid history API.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Coin melt calculator</h2>
            <p>
              Melt value = <span className="text-gray-300">fine weight (troy oz) × live spot price per troy oz</span>. Fine weight is derived from the coin&rsquo;s gross weight and fineness — e.g. a pre-1965 US 90% silver quarter is 6.25 g × 0.900 ÷ 31.1034768 g/ozt = 0.18084 troy oz of pure silver.
            </p>
            <p>
              We use standard mint specifications sourced from the issuing mint&rsquo;s published specs (US Mint, Royal Canadian Mint, Perth Mint, etc.). Melt value is theoretical — actual sale prices include a premium over melt that varies by dealer, coin, and market conditions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Gram / ounce converter</h2>
            <p>
              We use the troy ounce (31.1034768 grams) exclusively, as is standard for precious metals. We do <em>not</em> use the avoirdupois ounce (28.3495 grams), which is used for everyday weight but never for bullion. If another site gives you a different answer to a gold conversion, check which ounce they&rsquo;re using first.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Portfolio tracker</h2>
            <p>
              Holdings are valued at <span className="text-gray-300">quantity (troy oz) × current spot price</span>. The tracker does not estimate dealer premium, numismatic value, or resale spread — the figure is a clean spot-value floor, useful for checking how your stack has moved with the market.
            </p>
            <p>
              Signed out, holdings are stored only in your browser&rsquo;s localStorage and never leave your device. Signed in, they&rsquo;re saved to our database solely to sync across devices. See the <a href="/privacy" className="text-amber-500 hover:text-amber-400 transition-colors">Privacy Policy</a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Price alerts</h2>
            <p>
              Alerts are evaluated once per day at the same time as the daily price snapshot, against the spot price we just fetched. When a threshold is crossed (e.g. gold above $2,400/ozt), we send one email to the address on your account and mark the alert as triggered to prevent re-firing until you reset it. Email is the only channel — no SMS, no push, no phone calls.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Dealer compare page</h2>
            <p>
              The <a href="/compare" className="text-amber-500 hover:text-amber-400 transition-colors">compare</a> page shows an <em>estimated</em> total cost per coin, computed as <span className="text-gray-300">live spot × coin fine weight + dealer premium</span>. Dealer premiums are maintained by hand based on each dealer&rsquo;s typical over-spot pricing for 1–9 unit quantities; they are not scraped live from dealer sites.
            </p>
            <p>
              That means a dealer&rsquo;s real checkout price on any given day may differ from ours — especially during promotions, volume-tier discounts, or payment-method-specific pricing. Treat our number as a &ldquo;what you&rsquo;d typically pay here right now&rdquo; estimate, not a locked quote. We revisit the premiums regularly and when market conditions shift materially.
            </p>
            <p>
              Rankings sort strictly by estimated total cost. Outbound dealer links are affiliate-tagged (disclosed on the page, per FTC) and commissions do not affect rank.
            </p>
          </section>

          <section
            className="rounded-2xl border p-6 space-y-3 text-sm"
            style={{ borderColor: "var(--border)" }}
          >
            <h2 className="text-base font-bold text-white">What this tool is not good for</h2>
            <p className="text-gray-400">
              We&rsquo;d rather tell you up front:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
              <li><span className="text-white font-semibold">Day trading.</span> Prices are not tick-by-tick. If you need sub-second quotes, use a broker terminal.</li>
              <li><span className="text-white font-semibold">Intraday alerts.</span> Alerts fire on a daily cadence. Fast intraday moves can happen between checks.</li>
              <li><span className="text-white font-semibold">Live dealer quotes.</span> The compare page estimates dealer totals from live spot plus our hand-maintained premiums — it is not a scraped checkout price. Click through to confirm before buying.</li>
              <li><span className="text-white font-semibold">Intraday charts.</span> Sparklines use daily close snapshots, not intraday candles.</li>
              <li><span className="text-white font-semibold">Numismatic value.</span> We value coins at melt / spot only. Collectible premiums are out of scope.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Corrections and feedback</h2>
            <p>
              If you spot a number that looks wrong, a coin spec that&rsquo;s off, or a calculation that disagrees with another source, please tell us:{" "}
              <a href="mailto:hello@lode.rocks" className="text-amber-500 hover:text-amber-400 transition-colors">
                hello@lode.rocks
              </a>
              . We&rsquo;d rather fix it than have it linger.
            </p>
          </section>

        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
