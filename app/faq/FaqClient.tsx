"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Accordion primitive ───────────────────────────────────────────────────────

type FaqItem = {
  q: string;
  a: React.ReactNode;
};

function Accordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y" style={{ borderColor: "var(--border)" }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-start justify-between gap-4 py-5 text-left group"
            >
              <h3
                className={`text-sm font-bold transition-colors duration-150 group-hover:text-amber-400 ${
                  isOpen ? "text-amber-400" : "text-white"
                }`}
              >
                {item.q}
              </h3>
              <span
                className="mt-0.5 flex-shrink-0 text-gray-500 text-lg leading-none select-none transition-transform duration-200"
                style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="pb-6 text-sm text-gray-400 leading-relaxed space-y-3">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── FAQ data ──────────────────────────────────────────────────────────────────

const metalsFaq: FaqItem[] = [
  {
    q: "What is spot price?",
    a: (
      <p>
        The current market price to buy or sell one troy ounce of a metal for immediate delivery. It is set
        continuously by futures markets — primarily COMEX in New York — based on the nearest active futures
        contract. The price you see on Lode comes from Yahoo Finance futures data and is{" "}
        <strong className="text-white">not a dealer price</strong>. Dealers add a premium above spot to cover
        minting, shipping, and margin.
      </p>
    ),
  },
  {
    q: "What is a troy ounce?",
    a: (
      <p>
        The unit of weight used for precious metals worldwide. One troy ounce ={" "}
        <strong className="text-white">31.1035 grams</strong>. A standard avoirdupois ounce (food, everyday
        items) is only 28.3495 g — about 9.7% lighter. When any dealer or price quote says "per ounce" for
        gold or silver, they always mean a troy ounce.
      </p>
    ),
  },
  {
    q: "How is the gold price determined?",
    a: (
      <p>
        Gold&rsquo;s spot price is driven by COMEX futures trading and the twice-daily LBMA benchmark in
        London. On the supply side: mine output, central bank sales. On the demand side: jewelry, ETF flows,
        industrial use, and financial hedging. Macro factors — real interest rates, US dollar strength, and
        geopolitical risk — move the price significantly day to day.
      </p>
    ),
  },
  {
    q: "What is the difference between spot price and melt value?",
    a: (
      <p>
        Spot price is the per-troy-ounce price for pure metal. Melt value is what a specific coin or item is
        worth based on its actual silver or gold content. A pre-1965 quarter contains 0.18084 troy oz of
        silver — its melt value is <em>0.18084 × spot price</em>. Coins with numismatic (collector) value
        may sell above melt; scrap silver typically fetches 90–97% of melt from dealers.
      </p>
    ),
  },
  {
    q: "What is junk silver?",
    a: (
      <p>
        Pre-1965 US dimes, quarters, and half dollars that are 90% silver. &ldquo;Junk&rdquo; means no
        collector premium — they trade purely on silver content.{" "}
        <strong className="text-white">$1 face value</strong> in 90% coins contains roughly 0.715 troy oz
        of silver (industry standard, adjusted for wear). Use the{" "}
        <Link href="/junk-silver-calculator" className="text-amber-500 hover:text-amber-400 transition-colors">
          junk silver calculator
        </Link>{" "}
        to find melt value by face amount or individual coin count.
      </p>
    ),
  },
  {
    q: "What is the gold-to-silver ratio?",
    a: (
      <p>
        How many ounces of silver it takes to buy one ounce of gold. If gold is $3,000 and silver is $30,
        the ratio is 100. Historically it has ranged from about 15:1 (bimetallic standard era) to over 120:1
        (COVID-era spike). Investors use the ratio to gauge whether gold or silver looks relatively cheap or
        expensive against the other.
      </p>
    ),
  },
  {
    q: "What is premium over spot?",
    a: (
      <p>
        The markup a dealer charges above the spot price. If silver spot is $30/ozt and an American Silver
        Eagle sells for $35, the premium is $5 (≈ 16.7%). Premiums cover fabrication, distribution, and
        dealer margin. Generic rounds carry lower premiums than government-minted coins. The{" "}
        <Link href="/compare" className="text-amber-500 hover:text-amber-400 transition-colors">
          compare page
        </Link>{" "}
        tracks premiums across dealers in real time.
      </p>
    ),
  },
  {
    q: "What is the difference between bullion and numismatic coins?",
    a: (
      <p>
        Bullion coins (Gold Eagles, Maple Leafs, Krugerrands) are bought for their metal content and price
        near spot plus a modest premium. Numismatic coins are valued for rarity and condition — a key-date
        Morgan dollar in top grade can be worth many times its silver melt value. For most buyers focused on
        the metal, bullion is simpler: pricing is transparent and selling back is straightforward.
      </p>
    ),
  },
];

const lodeFaq: FaqItem[] = [
  {
    q: "Is Lode legit?",
    a: (
      <>
        <p>
          Yes, and we understand why you&rsquo;re asking — the precious-metals space has a lot of dodgy
          sites. Here&rsquo;s how to verify us yourself:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            Our data sources are published openly on the{" "}
            <Link href="/methodology" className="text-amber-500 hover:text-amber-400 transition-colors">
              Methodology
            </Link>{" "}
            page. Cross-check any spot price shown on Lode against Kitco or a broker terminal — the numbers
            should match within a few cents.
          </li>
          <li>
            We do not buy, sell, or broker metal. No funds ever move through Lode. See{" "}
            <Link href="/about" className="text-amber-500 hover:text-amber-400 transition-colors">
              About
            </Link>
            .
          </li>
          <li>
            What we collect and how we handle it is in our{" "}
            <Link href="/privacy" className="text-amber-500 hover:text-amber-400 transition-colors">
              Privacy Policy
            </Link>
            .
          </li>
          <li>
            You can reach a human at{" "}
            <a href="mailto:hello@lode.rocks" className="text-amber-500 hover:text-amber-400 transition-colors">
              hello@lode.rocks
            </a>
            .
          </li>
        </ul>
        <p>
          Third-party scanners like Gridinsoft and Scamadviser give newer sites cautious scores by default
          because domain age is weighted heavily. That&rsquo;s a signal about time-in-market, not a finding
          of wrongdoing.
        </p>
      </>
    ),
  },
  {
    q: "How does Lode make money?",
    a: (
      <p>
        Affiliate commissions on dealer outbound clicks from the{" "}
        <Link href="/compare" className="text-amber-500 hover:text-amber-400 transition-colors">
          compare
        </Link>{" "}
        page. When you click through to APMEX, JM Bullion, SD Bullion, or Money Metals and buy, Lode may
        earn a referral fee at no cost to you. Commissions do not affect rankings — the compare page sorts
        by estimated total cost.
      </p>
    ),
  },
  {
    q: "Where does the price data come from?",
    a: (
      <p>
        Live spot prices come from{" "}
        <a
          href="https://finance.yahoo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-500 hover:text-amber-400 transition-colors"
        >
          Yahoo Finance
        </a>{" "}
        futures data (GC=F, SI=F, PL=F, PA=F), routed through a Cloudflare Worker. Full detail is on the{" "}
        <Link href="/methodology" className="text-amber-500 hover:text-amber-400 transition-colors">
          Methodology
        </Link>{" "}
        page.
      </p>
    ),
  },
  {
    q: "How fresh are the prices?",
    a: (
      <p>
        Fetched live on page load, cached for up to 10 minutes, then refetched. During market hours
        you&rsquo;ll see a price that&rsquo;s at most a few minutes old. On weekends and holidays the price
        reflects the last traded value — markets are closed.
      </p>
    ),
  },
  {
    q: "Why don't the sparklines move during the day?",
    a: (
      <p>
        The sparklines are built from daily close snapshots in our database, not intraday ticks. Intraday
        history from paid data APIs gets expensive quickly, and daily closes are enough to see the meaningful
        trend. The live price on the tile is fresh; the chart shows the last 30 days of daily closes.
      </p>
    ),
  },
  {
    q: "Do you sell my data or show ads?",
    a: (
      <p>
        No. No advertising, no third-party tracking cookies, no data broker relationships. The only
        third-party services we use are the ones operationally required to run the site, listed in the{" "}
        <Link href="/privacy" className="text-amber-500 hover:text-amber-400 transition-colors">
          Privacy Policy
        </Link>
        .
      </p>
    ),
  },
  {
    q: "Do you sell precious metals?",
    a: (
      <p>
        No. Lode is not a dealer, broker, or exchange. We don&rsquo;t hold metal, we don&rsquo;t sell metal,
        we don&rsquo;t take commissions from dealers. If you want to buy physical metal, use a reputable
        dealer (APMEX, JM Bullion, SD Bullion, your local coin shop).
      </p>
    ),
  },
  {
    q: "How do price alerts work?",
    a: (
      <p>
        Set a target (e.g. &ldquo;alert me when gold goes above $2,400/ozt&rdquo;) and when the spot price
        we fetch crosses that threshold, we send one email to the address on your account. Alerts are checked
        once per day. Email is the only channel — no SMS, no push, no calls.
      </p>
    ),
  },
  {
    q: "Can I use Lode without creating an account?",
    a: (
      <p>
        Yes. The price dashboard, coin melt calculator, gram converter, and portfolio tracker all work without
        signing in. If you use the portfolio tracker anonymously, your holdings are stored only in your
        browser&rsquo;s localStorage and never leave your device. An account is only required for email
        alerts or cross-device portfolio sync.
      </p>
    ),
  },
  {
    q: "How do I delete my account and data?",
    a: (
      <p>
        Email us at{" "}
        <a href="mailto:hello@lode.rocks" className="text-amber-500 hover:text-amber-400 transition-colors">
          hello@lode.rocks
        </a>{" "}
        from the address on your account, or use the account page when signed in. We process deletion
        requests within 30 days as described in the{" "}
        <Link href="/privacy" className="text-amber-500 hover:text-amber-400 transition-colors">
          Privacy Policy
        </Link>
        .
      </p>
    ),
  },
  {
    q: "Is this financial advice?",
    a: (
      <p>
        No. Everything on Lode is informational. Spot prices, calculations, and alerts are tools to help you
        see what&rsquo;s happening in the market — not recommendations to buy, sell, or hold anything.
        Decisions about your portfolio are yours to make, ideally with input from a qualified financial or
        tax professional if the stakes are meaningful.
      </p>
    ),
  },
];

// ─── Page component ────────────────────────────────────────────────────────────

export function FaqClient() {
  return (
    <main className="min-h-screen bg-surface px-6 py-24 text-white">
      <div className="mx-auto max-w-2xl space-y-16">

        {/* Page header */}
        <div>
          <p className="label mb-2">Questions</p>
          <h1 className="text-4xl font-black tracking-tight">Frequently Asked Questions</h1>
          <p className="mt-3 text-sm text-gray-500">
            Precious metals basics and answers to common questions about Lode.
          </p>
        </div>

        {/* Section 1: Precious metals */}
        <div className="space-y-6">
          <div>
            <p className="label mb-1">Precious metals</p>
            <h2 className="text-lg font-black tracking-tight">How spot prices, troy ounces &amp; coins work</h2>
          </div>
          <Accordion items={metalsFaq} />
        </div>

        {/* Divider */}
        <div className="border-t" style={{ borderColor: "var(--border)" }} />

        {/* Section 2: About Lode */}
        <div className="space-y-6">
          <div>
            <p className="label mb-1">About Lode</p>
            <h2 className="text-lg font-black tracking-tight">How the site works</h2>
          </div>
          <Accordion items={lodeFaq} />
        </div>

        {/* Still have questions */}
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
    </main>
  );
}
