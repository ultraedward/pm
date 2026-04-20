import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "FAQ — Lode",
  description:
    "Frequently asked questions about Lode: is it legit, where the price data comes from, how to verify it, what happens to your data, and how alerts work.",
  alternates: {
    canonical: "https://lode.rocks/faq",
  },
  openGraph: {
    title: "FAQ | Lode",
    description:
      "Is Lode legit? Where does the data come from? How do alerts work? Direct answers to common questions.",
    url: "https://lode.rocks/faq",
  },
};

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-surface px-6 py-24 text-white">
      <div className="mx-auto max-w-2xl space-y-12">

        <div>
          <p className="label mb-2">Questions</p>
          <h1 className="text-4xl font-black tracking-tight">FAQ</h1>
          <p className="mt-3 text-sm text-gray-500">
            Direct answers to the things people actually ask us.
          </p>
        </div>

        <div className="space-y-8 text-sm text-gray-400 leading-relaxed">

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Is Lode legit?</h2>
            <p>
              Yes, and we understand why you&rsquo;re asking — the precious-metals space has a lot of dodgy sites. Here&rsquo;s how to verify us yourself:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Our data sources are published openly on the <a href="/methodology" className="text-amber-500 hover:text-amber-400 transition-colors">Methodology</a> page. Cross-check any spot price shown on Lode against Kitco or a broker terminal — the numbers should match within a few cents.</li>
              <li>We do not buy, sell, or broker metal. No funds ever move through Lode. We don&rsquo;t take custody of anything. See <a href="/about" className="text-amber-500 hover:text-amber-400 transition-colors">About</a>.</li>
              <li>What we collect and how we handle it is documented in our <a href="/privacy" className="text-amber-500 hover:text-amber-400 transition-colors">Privacy Policy</a>.</li>
              <li>You can reach a human at <a href="mailto:hello@lode.rocks" className="text-amber-500 hover:text-amber-400 transition-colors">hello@lode.rocks</a>.</li>
            </ul>
            <p>
              Third-party scanners like Gridinsoft and Scamadviser give newer sites cautious scores by default, because domain age and third-party footprint are weighted heavily. That&rsquo;s a signal about time-in-market, not a finding of wrongdoing — the same scanners score sites like Kitco highly because they&rsquo;ve existed since the 1990s. As our public footprint grows, those scores catch up.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Who runs Lode?</h2>
            <p>
              Lode is an independent project, self-funded, with no investors and not owned by a dealer. We&rsquo;re keeping the operator&rsquo;s identity private for now — not because there&rsquo;s anything to hide, but because we&rsquo;d rather be judged on the product than on anyone&rsquo;s resume. Every piece of the tool that matters — the data sources, the calculations, what we collect, how we use it — is published publicly on this site so you can evaluate it directly.
            </p>
            <p>
              If that&rsquo;s a dealbreaker for you, we understand. The data and methodology pages should still let you sanity-check whether the tool is doing what it claims.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">How does Lode make money?</h2>
            <p>
              Affiliate commissions on dealer outbound clicks from the <a href="/compare" className="text-amber-500 hover:text-amber-400 transition-colors">compare</a> page. When you click through to APMEX, JM Bullion, SD Bullion, or Money Metals and buy something, Lode may earn a referral fee at no cost to you. That&rsquo;s disclosed on the page itself (FTC requires it) and is currently our only revenue stream.
            </p>
            <p>
              Commissions do not affect rankings. The compare page sorts by estimated total cost — live spot × coin weight + hand-maintained dealer premium. A cheaper dealer that pays us nothing still ranks ahead of a more expensive dealer that pays us.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Where does the price data come from?</h2>
            <p>
              Live spot prices come from <a href="https://metals.dev" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 transition-colors">metals.dev</a>, with Yahoo Finance futures (GC=F, SI=F, PL=F, PA=F) as an automatic fallback if the primary source is unavailable. Full detail is on the <a href="/methodology" className="text-amber-500 hover:text-amber-400 transition-colors">Methodology</a> page.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">How fresh are the prices?</h2>
            <p>
              Prices are fetched live when you load a page, cached on our servers for up to 5 minutes, then refetched. During active market hours you&rsquo;ll see a number that&rsquo;s at most a few minutes old. Markets are closed on weekends and certain holidays — during those windows the displayed price reflects the last traded value.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Why don&rsquo;t the sparklines move during the day?</h2>
            <p>
              The sparklines are built from daily close snapshots we record to our own database, not intraday ticks. That&rsquo;s a cost/quality tradeoff — intraday history from paid APIs gets expensive quickly, and daily closes are enough to see the meaningful trend. The current <em>live</em> price shown on the tile is fresh; the chart behind it summarizes the last 30 days of daily closes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Do you sell my data or show ads?</h2>
            <p>
              No. No advertising, no third-party tracking cookies, no data broker relationships. The only third-party services we use are the ones operationally required to run the site, listed in the <a href="/privacy" className="text-amber-500 hover:text-amber-400 transition-colors">Privacy Policy</a>. We don&rsquo;t monetize your data because we don&rsquo;t want to — it would change how we build the product.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Do you sell precious metals?</h2>
            <p>
              No. Lode is not a dealer, broker, or exchange. We don&rsquo;t hold metal, we don&rsquo;t sell metal, we don&rsquo;t take commissions from dealers. If you want to buy physical metal, use a reputable dealer (APMEX, JM Bullion, SD Bullion, Hero Bullion, your local coin shop, etc.) — we don&rsquo;t have a recommendation because we don&rsquo;t want the incentive of having one.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">How do price alerts work?</h2>
            <p>
              You set a target (e.g. &ldquo;alert me when gold goes above $2,400/ozt&rdquo;), and when the spot price we fetch crosses that threshold, we send one email to the address on your account. Alerts are checked once per day at the time of our daily price snapshot. Emails are the only channel — no SMS, no push, no calls.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Can I use Lode without creating an account?</h2>
            <p>
              Yes. The price dashboard, coin melt calculator, gram converter, and portfolio tracker all work without signing in. If you use the portfolio tracker anonymously, your holdings are stored only in your browser&rsquo;s localStorage and never leave your device. An account is only required if you want to set email alerts or sync your portfolio across devices.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">How do I delete my account and data?</h2>
            <p>
              Email us at <a href="mailto:hello@lode.rocks" className="text-amber-500 hover:text-amber-400 transition-colors">hello@lode.rocks</a> from the address on your account, or use the account page when signed in. We process deletion requests within 30 days as described in the <a href="/privacy" className="text-amber-500 hover:text-amber-400 transition-colors">Privacy Policy</a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Is this financial advice?</h2>
            <p>
              No. Everything on Lode is informational. Spot prices, calculations, and alerts are tools to help you see what&rsquo;s happening in the market — they are not recommendations to buy, sell, or hold anything. Decisions about your portfolio are yours to make, ideally with input from a qualified financial or tax professional if the stakes are meaningful.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Still have questions?</h2>
            <p>
              <a href="mailto:hello@lode.rocks" className="text-amber-500 hover:text-amber-400 transition-colors">
                hello@lode.rocks
              </a>{" "}
              — a human reads every message.
            </p>
          </section>

        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
