import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Precious Metals FAQ — Spot Prices, Troy Ounces, Junk Silver & More",
  description:
    "Answers to common questions about precious metals and about Lode: what spot price means, how gold prices are set, troy oz vs regular oz, what junk silver is, how price alerts work, and more.",
  alternates: {
    canonical: "https://lode.rocks/faq",
  },
  openGraph: {
    title: "Precious Metals FAQ — Spot Prices, Troy Ounces, Junk Silver & More",
    description:
      "What is spot price? How is the gold price set? What's a troy ounce? What is junk silver? Direct answers to common precious metals questions.",
    url: "https://lode.rocks/faq",
  },
};

// FAQ structured data — enables Google FAQ rich results (expandable Q&As in SERP)
const faqJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://lode.rocks" },
        { "@type": "ListItem", "position": 2, "name": "FAQ",  "item": "https://lode.rocks/faq" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        // ── Precious metals basics ──
        {
          "@type": "Question",
          "name": "What is spot price?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Spot price is the current market price to buy or sell one troy ounce of a metal for immediate delivery. It is set continuously by futures markets (primarily COMEX in the US) based on supply, demand, and the nearest active futures contract. The 'spot price' you see on Lode reflects the front-month futures price from Yahoo Finance — it is not a dealer price. Dealers add a premium above spot to cover minting, shipping, and profit margin.",
          },
        },
        {
          "@type": "Question",
          "name": "What is a troy ounce?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A troy ounce (ozt) is the unit of weight used for precious metals worldwide. It equals 31.1035 grams. A standard avoirdupois ounce (the one used for food and everyday items) is 28.3495 grams — about 9.7% lighter. When a dealer or price quote says 'per ounce' for gold or silver, they always mean a troy ounce.",
          },
        },
        {
          "@type": "Question",
          "name": "How is the gold price determined?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Gold's spot price is driven primarily by COMEX futures trading in New York and the London Bullion Market Association (LBMA) benchmark set twice daily in London. The price reflects supply and demand across physical gold (mining output, central bank buying and selling, jewelry demand) and financial gold (ETFs, futures contracts, options). Macroeconomic factors — inflation expectations, real interest rates, the US dollar's strength, and geopolitical uncertainty — also move the price significantly.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the difference between spot price and melt value?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Spot price is the per-troy-ounce market price for pure (.999+) metal. Melt value is what a specific coin or bar is intrinsically worth based on its actual metal content. A pre-1965 US quarter contains 0.18084 troy oz of silver — its melt value is 0.18084 × the silver spot price. If a coin has numismatic (collector) value, it may sell for more than melt. Dealers typically buy scrap silver at 90–97% of melt value.",
          },
        },
        {
          "@type": "Question",
          "name": "What is junk silver?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Junk silver refers to pre-1965 US dimes, quarters, and half dollars that are 90% silver. 'Junk' does not mean low quality — it means no numismatic premium. These coins trade purely on their silver content. One dollar of face value in 90% silver coins contains approximately 0.715 troy ounces of silver (adjusted for average coin wear). The Lode junk silver calculator at lode.rocks/junk-silver-calculator lets you calculate melt value by face value or by individual coin count.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the gold-to-silver ratio?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The gold-to-silver ratio is how many troy ounces of silver it takes to buy one troy ounce of gold. If gold is $3,000/ozt and silver is $30/ozt, the ratio is 100. Historically the ratio has ranged from about 15:1 (bimetallic standard era) to over 120:1 (COVID-era spike). Precious metals investors use the ratio to decide whether gold or silver appears relatively cheap or expensive versus the other.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the premium over spot?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Premium over spot is the markup dealers charge above the spot price. For example, if silver spot is $30/ozt and an American Silver Eagle sells for $35, the premium is $5 (about 16.7%). Premiums cover fabrication, distribution, dealer margin, and market liquidity. Generic rounds carry lower premiums than government-minted coins. The Lode compare page at lode.rocks/compare tracks dealer premiums in real time.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the difference between gold bullion and numismatic coins?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Bullion coins (American Gold Eagles, Canadian Maple Leafs, Krugerrands) are purchased primarily for their gold content and trade near spot price plus a modest premium. Numismatic coins are valued for rarity, condition, and collector demand — a rare date Morgan dollar in top grade may sell for many times its silver melt value. Most first-time precious metals buyers stick to bullion because the pricing is transparent and the exit market is straightforward.",
          },
        },
        // ── About Lode ──
        {
          "@type": "Question",
          "name": "Is Lode legit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Lode is an independent precious metals price tracker. It does not buy, sell, or broker metal — no funds ever move through the site. Spot prices come from Yahoo Finance futures data, routed through a Cloudflare Worker, and can be cross-checked against Kitco or any broker terminal. Data collection and usage are documented in the Privacy Policy at lode.rocks/privacy.",
          },
        },
        {
          "@type": "Question",
          "name": "Where does the spot price data come from?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Live spot prices come from Yahoo Finance futures data (GC=F, SI=F, PL=F, PA=F), routed through a Cloudflare Worker. Full methodology is published at lode.rocks/methodology.",
          },
        },
        {
          "@type": "Question",
          "name": "How fresh are the precious metals prices?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Prices are fetched live when you load a page, cached on Lode's servers for up to 10 minutes, then refetched. During active market hours the displayed price is at most a few minutes old. On weekends and holidays the price reflects the last traded value — markets are closed.",
          },
        },
        {
          "@type": "Question",
          "name": "How do gold and silver price alerts work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You set a target price (e.g. 'alert me when gold goes above $2,400/ozt'). When the spot price Lode fetches crosses that threshold, one email is sent to your account address. Alerts are checked once per day. Email is the only notification channel — no SMS, no push notifications.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I use Lode without creating an account?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The price dashboard, coin melt calculator, gram converter, and portfolio tracker all work without signing in. If you use the portfolio tracker anonymously, holdings are stored only in your browser's localStorage and never sent to Lode's servers. An account is only required for email price alerts or cross-device portfolio sync.",
          },
        },
        {
          "@type": "Question",
          "name": "Does Lode sell precious metals?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Lode is not a dealer, broker, or exchange. It does not hold metal, sell metal, or take commissions from dealers. It is a price tracking and comparison tool only.",
          },
        },
        {
          "@type": "Question",
          "name": "Does Lode sell user data or show ads?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Lode does not run advertising, sell user data, or use third-party tracking cookies. The only third-party services used are those operationally required to run the site (Google OAuth, Resend, Neon, Vercel), documented in the Privacy Policy.",
          },
        },
        {
          "@type": "Question",
          "name": "How does Lode make money?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Affiliate commissions on dealer outbound clicks from the compare page at lode.rocks/compare. When you click through to APMEX, JM Bullion, SD Bullion, or Money Metals and buy, Lode may earn a referral fee at no cost to you. Commissions do not affect rankings — the compare page sorts by estimated total cost.",
          },
        },
        {
          "@type": "Question",
          "name": "Is the information on Lode financial advice?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Everything on Lode is informational — spot prices, calculations, and alerts are tools to help you see market data, not recommendations to buy, sell, or hold anything. Consult a qualified financial professional for investment decisions.",
          },
        },
      ],
    },
  ],
};

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-surface px-6 py-24 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-2xl space-y-16">

        {/* ── Page header ─────────────────────────────────────────── */}
        <div>
          <p className="label mb-2">Questions</p>
          <h1 className="text-4xl font-black tracking-tight">Frequently Asked Questions</h1>
          <p className="mt-3 text-sm text-gray-500">
            Precious metals basics and answers to common questions about Lode.
          </p>
        </div>

        {/* ── Section 1: Precious metals basics ───────────────────── */}
        <div className="space-y-10">
          <div>
            <p className="label mb-1">Precious metals</p>
            <h2 className="text-lg font-black tracking-tight">How spot prices, troy ounces &amp; coins work</h2>
          </div>

          <div className="space-y-8 text-sm text-gray-400 leading-relaxed">

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">What is spot price?</h3>
              <p>
                The current market price to buy or sell one troy ounce of a metal for immediate delivery.
                It is set continuously by futures markets — primarily COMEX in New York — based on the nearest
                active futures contract. The price you see on Lode comes from Yahoo Finance futures data and
                is <strong className="text-white">not a dealer price</strong>. Dealers add a premium above
                spot to cover minting, shipping, and margin.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">What is a troy ounce?</h3>
              <p>
                The unit of weight used for precious metals worldwide. One troy ounce =&nbsp;
                <strong className="text-white">31.1035 grams</strong>. A standard avoirdupois ounce (food,
                everyday items) is only 28.3495 g — about 9.7% lighter. When any dealer or price quote says
                "per ounce" for gold or silver, they always mean a troy ounce.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">How is the gold price determined?</h3>
              <p>
                Gold&rsquo;s spot price is driven by COMEX futures trading and the twice-daily LBMA benchmark
                in London. On the supply side: mine output, central bank sales. On the demand side: jewelry,
                ETF flows, industrial use, and financial hedging. Macro factors — real interest rates, US dollar
                strength, and geopolitical risk — move the price significantly day to day.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">What is the difference between spot price and melt value?</h3>
              <p>
                Spot price is the per-troy-ounce price for pure metal. Melt value is what a specific coin or
                item is worth based on its actual silver or gold content. A pre-1965 quarter contains 0.18084
                troy oz of silver — its melt value is <em>0.18084 × spot price</em>. Coins with numismatic
                (collector) value may sell above melt; scrap silver typically fetches 90–97% of melt from dealers.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">What is junk silver?</h3>
              <p>
                Pre-1965 US dimes, quarters, and half dollars that are 90% silver. "Junk" means no collector
                premium — they trade purely on silver content.{" "}
                <strong className="text-white">$1 face value</strong> in 90% coins contains roughly 0.715 troy
                oz of silver (industry standard, adjusted for wear). Use the{" "}
                <a href="/junk-silver-calculator" className="text-amber-500 hover:text-amber-400 transition-colors">
                  junk silver calculator
                </a>{" "}
                to find melt value by face amount or individual coin count.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">What is the gold-to-silver ratio?</h3>
              <p>
                How many ounces of silver it takes to buy one ounce of gold. If gold is $3,000 and silver is
                $30, the ratio is 100. Historically it has ranged from about 15:1 (bimetallic standard era) to
                over 120:1 (COVID-era spike). Investors use the ratio to gauge whether gold or silver looks
                relatively cheap or expensive against the other.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">What is premium over spot?</h3>
              <p>
                The markup a dealer charges above the spot price. If silver spot is $30/ozt and an American
                Silver Eagle sells for $35, the premium is $5 (≈ 16.7%). Premiums cover fabrication,
                distribution, and dealer margin. Generic rounds carry lower premiums than government-minted
                coins. The{" "}
                <a href="/compare" className="text-amber-500 hover:text-amber-400 transition-colors">
                  compare page
                </a>{" "}
                tracks premiums across dealers in real time.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">What is the difference between bullion and numismatic coins?</h3>
              <p>
                Bullion coins (Gold Eagles, Maple Leafs, Krugerrands) are bought for their metal content and
                price near spot plus a modest premium. Numismatic coins are valued for rarity and condition —
                a key-date Morgan dollar in top grade can be worth many times its silver melt value. For most
                buyers focused on the metal, bullion is simpler: pricing is transparent and selling back is
                straightforward.
              </p>
            </section>

          </div>
        </div>

        {/* ── Divider ─────────────────────────────────────────────── */}
        <div className="border-t" style={{ borderColor: "var(--border)" }} />

        {/* ── Section 2: About Lode ───────────────────────────────── */}
        <div className="space-y-10">
          <div>
            <p className="label mb-1">About Lode</p>
            <h2 className="text-lg font-black tracking-tight">How the site works</h2>
          </div>

          <div className="space-y-8 text-sm text-gray-400 leading-relaxed">

            <section className="space-y-3">
              <h3 className="text-base font-bold text-white">Is Lode legit?</h3>
              <p>
                Yes, and we understand why you&rsquo;re asking — the precious-metals space has a lot of dodgy
                sites. Here&rsquo;s how to verify us yourself:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Our data sources are published openly on the <a href="/methodology" className="text-amber-500 hover:text-amber-400 transition-colors">Methodology</a> page. Cross-check any spot price shown on Lode against Kitco or a broker terminal — the numbers should match within a few cents.</li>
                <li>We do not buy, sell, or broker metal. No funds ever move through Lode. See <a href="/about" className="text-amber-500 hover:text-amber-400 transition-colors">About</a>.</li>
                <li>What we collect and how we handle it is in our <a href="/privacy" className="text-amber-500 hover:text-amber-400 transition-colors">Privacy Policy</a>.</li>
                <li>You can reach a human at <a href="mailto:hello@lode.rocks" className="text-amber-500 hover:text-amber-400 transition-colors">hello@lode.rocks</a>.</li>
              </ul>
              <p>
                Third-party scanners like Gridinsoft and Scamadviser give newer sites cautious scores by default
                because domain age is weighted heavily. That&rsquo;s a signal about time-in-market, not a finding
                of wrongdoing. As our public footprint grows, those scores catch up.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">How does Lode make money?</h3>
              <p>
                Affiliate commissions on dealer outbound clicks from the{" "}
                <a href="/compare" className="text-amber-500 hover:text-amber-400 transition-colors">compare</a>{" "}
                page. When you click through to APMEX, JM Bullion, SD Bullion, or Money Metals and buy,
                Lode may earn a referral fee at no cost to you. Commissions do not affect rankings — the
                compare page sorts by estimated total cost.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">Where does the price data come from?</h3>
              <p>
                Live spot prices come from{" "}
                <a href="https://finance.yahoo.com" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 transition-colors">Yahoo Finance</a>{" "}
                futures data (GC=F, SI=F, PL=F, PA=F), routed through a Cloudflare Worker.
                Full detail is on the{" "}
                <a href="/methodology" className="text-amber-500 hover:text-amber-400 transition-colors">Methodology</a> page.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">How fresh are the prices?</h3>
              <p>
                Fetched live on page load, cached for up to 10 minutes, then refetched. During market hours
                you&rsquo;ll see a price that&rsquo;s at most a few minutes old. On weekends and holidays the
                price reflects the last traded value — markets are closed.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">Why don&rsquo;t the sparklines move during the day?</h3>
              <p>
                The sparklines are built from daily close snapshots in our database, not intraday ticks. Intraday
                history from paid data APIs gets expensive quickly, and daily closes are enough to see the
                meaningful trend. The live price on the tile is fresh; the chart shows the last 30 days of
                daily closes.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">Do you sell my data or show ads?</h3>
              <p>
                No. No advertising, no third-party tracking cookies, no data broker relationships. The only
                third-party services we use are the ones operationally required to run the site, listed in
                the{" "}
                <a href="/privacy" className="text-amber-500 hover:text-amber-400 transition-colors">Privacy Policy</a>.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">Do you sell precious metals?</h3>
              <p>
                No. Lode is not a dealer, broker, or exchange. We don&rsquo;t hold metal, we don&rsquo;t sell
                metal, we don&rsquo;t take commissions from dealers. If you want to buy physical metal, use a
                reputable dealer (APMEX, JM Bullion, SD Bullion, your local coin shop).
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">How do price alerts work?</h3>
              <p>
                Set a target (e.g. &ldquo;alert me when gold goes above $2,400/ozt&rdquo;) and when the spot
                price we fetch crosses that threshold, we send one email to the address on your account. Alerts
                are checked once per day. Email is the only channel — no SMS, no push, no calls.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">Can I use Lode without creating an account?</h3>
              <p>
                Yes. The price dashboard, coin melt calculator, gram converter, and portfolio tracker all work
                without signing in. If you use the portfolio tracker anonymously, your holdings are stored only
                in your browser&rsquo;s localStorage and never leave your device. An account is only required
                for email alerts or cross-device portfolio sync.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">How do I delete my account and data?</h3>
              <p>
                Email us at{" "}
                <a href="mailto:hello@lode.rocks" className="text-amber-500 hover:text-amber-400 transition-colors">hello@lode.rocks</a>{" "}
                from the address on your account, or use the account page when signed in. We process deletion
                requests within 30 days as described in the{" "}
                <a href="/privacy" className="text-amber-500 hover:text-amber-400 transition-colors">Privacy Policy</a>.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">Is this financial advice?</h3>
              <p>
                No. Everything on Lode is informational. Spot prices, calculations, and alerts are tools to
                help you see what&rsquo;s happening in the market — not recommendations to buy, sell, or hold
                anything. Decisions about your portfolio are yours to make, ideally with input from a qualified
                financial or tax professional if the stakes are meaningful.
              </p>
            </section>

          </div>
        </div>

        {/* ── Still have questions ────────────────────────────────── */}
        <section className="space-y-2 text-sm text-gray-400">
          <h2 className="text-base font-bold text-white">Still have questions?</h2>
          <p>
            <a href="mailto:hello@lode.rocks" className="text-amber-500 hover:text-amber-400 transition-colors">
              hello@lode.rocks
            </a>{" "}
            — a human reads every message.
          </p>
        </section>

      </div>
      <SiteFooter />
    </main>
  );
}
