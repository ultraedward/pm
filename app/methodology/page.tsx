import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Methodology & Data Sources — Lode",
  description:
    "Where Lode's precious metals price data comes from, how often it refreshes, and how our calculators work. Full transparency on sources and methodology.",
  alternates: {
    canonical: "https://lode.rocks/methodology",
  },
  openGraph: {
    title: "Methodology & Data Sources | Lode",
    description:
      "Full transparency on where Lode's spot price data comes from and how our calculators work.",
    url: "https://lode.rocks/methodology",
  },
};

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-surface px-6 py-24 text-white">
      <div className="mx-auto max-w-2xl space-y-12">

        <div>
          <p className="label mb-2">How it works</p>
          <h1 className="text-4xl font-black tracking-tight">Methodology</h1>
          <p className="mt-3 text-sm text-gray-500">
            Where our data comes from, how often it refreshes, and how every calculation is done. No black boxes.
          </p>
        </div>

        <div className="space-y-8 text-sm text-gray-400 leading-relaxed">

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Spot price sources</h2>
            <p>
              Live spot prices are sourced from <a href="https://metals.dev" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 transition-colors">metals.dev</a> as the primary provider, with <a href="https://finance.yahoo.com" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 transition-colors">Yahoo Finance</a> futures data (GC=F, SI=F, PL=F, PA=F) as an automatic fallback if the primary source is unavailable.
            </p>
            <p>
              Prices are quoted in USD per troy ounce, consistent with COMEX and LBMA conventions. We do not modify, smooth, or adjust prices before displaying them — the number you see is what the provider returned.
            </p>
            <p>
              If both providers are unreachable, the site will either return the last cached value or fall back to a clearly-stale default rather than showing a $0 price. You can always cross-check a spot price against{" "}
              <a href="https://www.kitco.com/charts/livegold.html" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 transition-colors">Kitco</a>,{" "}
              <a href="https://www.bullionvault.com/gold-price-chart.do" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 transition-colors">BullionVault</a>, or any broker terminal — the numbers should match within a few cents.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Refresh cadence</h2>
            <p>
              Live prices are fetched on demand when you load a page, cached for up to 5 minutes on our servers to avoid hammering the upstream provider, then refetched. During active market hours you&rsquo;ll see prices updated within that 5-minute window on any new page load.
            </p>
            <p>
              Historical sparklines, 52-week high/low, and 24-hour percent change are computed from daily snapshots we record to our own database. Those snapshots are captured once per day at 00:00 UTC. Over time this gives us an independent history series we can plot without depending on a paid history API.
            </p>
            <p>
              Precious-metals markets are closed on weekends and on certain holidays. Prices during those windows reflect the last traded value, not a live tick.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Coin melt calculator</h2>
            <p>
              The melt value of a coin is computed as <span className="text-gray-300">(fine weight in troy ounces) × (live spot price per troy ounce)</span>. Fine weight is derived from the coin&rsquo;s gross weight and its fineness — for example, a pre-1965 US 90% silver quarter is 6.25 g gross × 0.900 fineness ÷ 31.1034768 g/ozt = 0.18084 troy ounces of pure silver.
            </p>
            <p>
              We use standard mint specifications for each coin, sourced from the issuing mint&rsquo;s published specifications (US Mint, Royal Canadian Mint, Perth Mint, etc.). Melt value is a theoretical figure — actual sale prices typically include a premium over melt that varies by dealer, coin, and market conditions.
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
              Holdings are valued at <span className="text-gray-300">(quantity of troy ounces) × (current spot price)</span>. The tracker does not attempt to estimate dealer premium, numismatic value, or resale spread — the figure is a clean spot-value floor, useful for checking how your stack has moved with the market.
            </p>
            <p>
              If you use the tracker without signing in, your holdings are stored only in your browser&rsquo;s localStorage and never leave your device. If you sign in, they&rsquo;re saved to our database solely to sync across devices. Full detail is in our <a href="/privacy" className="text-amber-500 hover:text-amber-400 transition-colors">Privacy Policy</a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Price alerts</h2>
            <p>
              Alerts are evaluated once per day at the same time as the daily price snapshot, against the spot price we just fetched. When an alert&rsquo;s condition is met (e.g. gold crosses $2,400/ozt upward), we send one email to the address on your account and mark the alert as triggered to prevent re-firing until you reset it.
            </p>
            <p>
              We do not send push notifications, SMS, or phone calls. Email is the only alert channel.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Known limitations</h2>
            <p>
              We&rsquo;re upfront about what this tool does and doesn&rsquo;t do well:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Prices are not tick-by-tick. If you need sub-second quotes for day trading, use a broker terminal.</li>
              <li>Alerts fire on a daily cadence, not continuously. Fast intraday moves can happen between checks.</li>
              <li>We show spot prices only. We do not quote retail dealer prices, premium-over-spot, or bid/ask spreads.</li>
              <li>Our sparklines reflect daily close snapshots, not intraday candles.</li>
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
