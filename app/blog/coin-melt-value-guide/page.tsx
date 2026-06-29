import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Coin Melt Value: What Your Gold & Silver Coins Are Really Worth (2026)",
  description:
    "How to calculate the melt value of gold and silver coins — exact metal content for Gold Eagles, Silver Eagles, Krugerrands, Maples, Morgan Dollars, and more, plus how melt value differs from market price.",
  keywords: [
    "coin melt value",
    "how to calculate melt value",
    "gold eagle melt value",
    "silver eagle melt value",
    "krugerrand melt value",
    "morgan dollar melt value",
    "gold maple leaf melt value",
    "melt value calculator",
    "melt value vs market price",
    "how much gold is in a coin",
    "numismatic value vs melt value",
    "bullion coin metal content",
  ],
  alternates: {
    canonical: "https://lode.rocks/blog/coin-melt-value-guide",
  },
  openGraph: {
    title: "Coin Melt Value: What Your Gold & Silver Coins Are Really Worth (2026)",
    description:
      "Exact metal content for the most popular bullion and collector coins, how to calculate melt value yourself, and why melt value isn't the same as market price.",
    url: "https://lode.rocks/blog/coin-melt-value-guide",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coin Melt Value: What Your Gold & Silver Coins Are Really Worth (2026)",
    description:
      "Exact metal content for the most popular bullion and collector coins, how to calculate melt value yourself, and why melt value isn't the same as market price.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://lode.rocks" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://lode.rocks/blog" },
        { "@type": "ListItem", "position": 3, "name": "Coin Melt Value Guide", "item": "https://lode.rocks/blog/coin-melt-value-guide" },
      ],
    },
    {
      "@type": "Article",
      "@id": "https://lode.rocks/blog/coin-melt-value-guide#article",
      "headline": "Coin Melt Value: What Your Gold & Silver Coins Are Really Worth",
      "description": "How to calculate the melt value of gold and silver coins, exact metal content for popular bullion and collector coins, and why melt value differs from market price.",
      "url": "https://lode.rocks/blog/coin-melt-value-guide",
      "image": {
        "@type": "ImageObject",
        "url": "https://lode.rocks/blog/coin-melt-value-guide/opengraph-image",
        "width": 1200,
        "height": 630,
      },
      "datePublished": "2026-06-29",
      "dateModified": "2026-06-29",
      "author": {
        "@type": "Organization",
        "name": "Lode",
        "url": "https://lode.rocks",
      },
      "publisher": {
        "@type": "Organization",
        "name": "Lode",
        "url": "https://lode.rocks",
      },
      "mainEntityOfPage": "https://lode.rocks/blog/coin-melt-value-guide",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is melt value?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Melt value is the value of the precious metal contained in a coin, calculated by multiplying its fine (pure) metal weight in troy ounces by the current spot price. It ignores any collector, rarity, or numismatic premium — it's purely the raw metal worth.",
          },
        },
        {
          "@type": "Question",
          "name": "How much gold is in an American Gold Eagle?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A 1 oz American Gold Eagle contains exactly 1.000 troy ounce of pure gold, alloyed with silver and copper to a gross weight of 1.0909 troy ounces (33.93 grams) at 91.67% (22-karat) fineness. The coin's face value and total weight are higher than its pure gold content, but the gold content itself is always exactly 1 oz.",
          },
        },
        {
          "@type": "Question",
          "name": "Is melt value the same as what a dealer will pay me?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Dealers buy below melt value (a buy-back spread, typically 1-5% under spot for common bullion coins) to cover their margin, and they sell above melt value (a markup, typically 3-10% over spot). Melt value is a reference point, not a transaction price in either direction.",
          },
        },
        {
          "@type": "Question",
          "name": "Should I melt down a rare or old coin for its metal value?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Almost never without checking numismatic value first. Many older or low-mintage coins are worth significantly more to collectors than their melt value — sometimes 10-100x more. Always check a coin's date, mintmark, and condition against a numismatic price guide before assuming melt value is its ceiling.",
          },
        },
        {
          "@type": "Question",
          "name": "How do I check if a gold coin is real?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The fastest at-home checks are weight and dimensions on a precise digital scale and calipers — genuine bullion coins are minted to tight tolerances, so even small deviations are a red flag. Gold is also non-magnetic, so a coin that's strongly attracted to a magnet is not solid gold. For higher-value purchases, a precious metals testing service or XRF analysis at a coin shop gives certainty.",
          },
        },
      ],
    },
  ],
};

type CoinRow = {
  coin: string;
  metal: string;
  fineness: string;
  grossWeight: string;
  pureContent: string;
};

const bullionCoins: CoinRow[] = [
  { coin: "American Gold Eagle (1 oz)", metal: "Gold", fineness: "91.67%", grossWeight: "1.0909 ozt", pureContent: "1.000 ozt" },
  { coin: "Canadian Gold Maple Leaf (1 oz)", metal: "Gold", fineness: "99.99%", grossWeight: "1.0000 ozt", pureContent: "1.000 ozt" },
  { coin: "South African Krugerrand (1 oz)", metal: "Gold", fineness: "91.67%", grossWeight: "1.0909 ozt", pureContent: "1.000 ozt" },
  { coin: "Austrian Gold Philharmonic (1 oz)", metal: "Gold", fineness: "99.99%", grossWeight: "1.0000 ozt", pureContent: "1.000 ozt" },
  { coin: "British Gold Sovereign", metal: "Gold", fineness: "91.67%", grossWeight: "0.2569 ozt", pureContent: "0.2354 ozt" },
  { coin: "American Silver Eagle (1 oz)", metal: "Silver", fineness: "99.9%", grossWeight: "1.0000 ozt", pureContent: "0.999 ozt" },
  { coin: "Canadian Silver Maple Leaf (1 oz)", metal: "Silver", fineness: "99.99%", grossWeight: "1.0000 ozt", pureContent: "1.000 ozt" },
  { coin: "Mexican Silver Libertad (1 oz)", metal: "Silver", fineness: "99.9%", grossWeight: "1.0000 ozt", pureContent: "0.999 ozt" },
];

const collectorCoins: CoinRow[] = [
  { coin: "Morgan Dollar (1878–1921)", metal: "Silver", fineness: "90%", grossWeight: "0.8594 ozt", pureContent: "0.7734 ozt" },
  { coin: "Peace Dollar (1921–1935)", metal: "Silver", fineness: "90%", grossWeight: "0.8594 ozt", pureContent: "0.7734 ozt" },
  { coin: "Walking Liberty / Franklin Half (pre-1965)", metal: "Silver", fineness: "90%", grossWeight: "0.4019 ozt", pureContent: "0.3617 ozt" },
  { coin: "Washington Quarter (pre-1965)", metal: "Silver", fineness: "90%", grossWeight: "0.2009 ozt", pureContent: "0.1808 ozt" },
];

export default function CoinMeltValueGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="bg-gray-950 text-gray-100">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-3xl mx-auto px-4 py-10">
            <nav className="text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-amber-400 transition-colors">Lode</Link>
              <span className="mx-2">›</span>
              <Link href="/blog" className="hover:text-amber-400 transition-colors">Blog</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-400">Coin Melt Value Guide</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">
              Coin Melt Value: What Your Gold &amp; Silver Coins Are Really Worth
            </h1>
            <p className="text-gray-400 text-base">
              Updated June 2026 · 11 min read
            </p>
          </div>
        </div>

        {/* Article body */}
        <article className="max-w-3xl mx-auto px-4 py-10 space-y-10">

          {/* Intro */}
          <section>
            <p className="text-gray-300 text-lg leading-relaxed">
              Every gold or silver coin has two prices: what it&apos;s worth as raw metal, and what
              someone will actually pay for it. The first is <em>melt value</em> — fixed, calculable,
              and the same for everyone. The second depends on premiums, condition, rarity, and demand.
              Confusing the two is the most common mistake new buyers and sellers make. This guide
              shows you exactly how melt value is calculated and what it is for the coins people ask
              about most.
            </p>
          </section>

          {/* What is melt value */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">What Is Melt Value?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Melt value is the worth of the precious metal physically contained in a coin — nothing
              else. It&apos;s calculated with one formula:
            </p>
            <div className="bg-gray-900 border border-amber-900/40 rounded-xl p-5 font-mono text-sm text-gray-300 space-y-2">
              <p><span className="text-amber-400">Pure metal content (troy oz)</span> × spot price = melt value</p>
              <p className="text-gray-500 pt-2 font-sans text-xs">
                Example: 1 American Gold Eagle = 1.000 ozt gold × $3,300/ozt spot = $3,300 melt value
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed mt-4">
              Note the phrase &ldquo;pure metal content,&rdquo; not total coin weight. Most bullion gold
              coins are alloyed with copper or silver for durability, so the coin&apos;s gross weight is
              higher than its actual gold content. The table below distinguishes the two for every
              major coin.
            </p>
          </section>

          {/* Bullion coin table */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Melt Value Reference: Modern Bullion Coins</h2>
            <p className="text-gray-300 leading-relaxed mb-5">
              These are minted to fixed, government-certified specifications — the numbers below never
              change regardless of the coin&apos;s year or condition.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-800 text-gray-400 text-left">
                    <th className="px-4 py-3 font-medium">Coin</th>
                    <th className="px-4 py-3 font-medium">Metal</th>
                    <th className="px-4 py-3 font-medium">Fineness</th>
                    <th className="px-4 py-3 font-medium text-right">Gross weight</th>
                    <th className="px-4 py-3 font-medium text-right">Pure content</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {bullionCoins.map((row, i) => (
                    <tr key={row.coin} className={i % 2 === 0 ? "bg-gray-900" : "bg-gray-900/50"}>
                      <td className="px-4 py-3 text-white font-medium">{row.coin}</td>
                      <td className="px-4 py-3 text-gray-400">{row.metal}</td>
                      <td className="px-4 py-3 text-gray-400">{row.fineness}</td>
                      <td className="px-4 py-3 text-gray-400 text-right">{row.grossWeight}</td>
                      <td className="px-4 py-3 text-amber-400 text-right font-mono">{row.pureContent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Collector coin table */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Melt Value Reference: Pre-1965 US Silver Coins</h2>
            <p className="text-gray-300 leading-relaxed mb-5">
              These older coins are 90% silver alloyed with copper. They&apos;re covered in detail in our{" "}
              <Link href="/blog/junk-silver-guide" className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors">
                junk silver guide
              </Link>{" "}
              — included here for quick reference alongside modern bullion.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-800 text-gray-400 text-left">
                    <th className="px-4 py-3 font-medium">Coin</th>
                    <th className="px-4 py-3 font-medium">Metal</th>
                    <th className="px-4 py-3 font-medium">Fineness</th>
                    <th className="px-4 py-3 font-medium text-right">Gross weight</th>
                    <th className="px-4 py-3 font-medium text-right">Pure content</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {collectorCoins.map((row, i) => (
                    <tr key={row.coin} className={i % 2 === 0 ? "bg-gray-900" : "bg-gray-900/50"}>
                      <td className="px-4 py-3 text-white font-medium">{row.coin}</td>
                      <td className="px-4 py-3 text-gray-400">{row.metal}</td>
                      <td className="px-4 py-3 text-gray-400">{row.fineness}</td>
                      <td className="px-4 py-3 text-gray-400 text-right">{row.grossWeight}</td>
                      <td className="px-4 py-3 text-amber-400 text-right font-mono">{row.pureContent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-500 text-xs mt-2">
              Morgan and Peace Dollars often carry collector premiums well above melt — check
              numismatic value before treating them as bullion. See the section below.
            </p>
          </section>

          {/* Melt value vs market price */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Melt Value Is Not a Transaction Price</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Melt value tells you the floor — what the metal is worth with zero markup in either
              direction. In practice, you never buy at melt value and you rarely sell at it either:
            </p>
            <div className="space-y-5">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-amber-400 mb-2">When you buy</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Dealers add a premium over melt to cover minting costs, shipping, and margin.
                  Premiums range from 2–5% on common bullion coins to 10%+ on fractional sizes or
                  scarcer mints. Our{" "}
                  <Link href="/compare" className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors">
                    dealer comparison page
                  </Link>{" "}
                  tracks current premiums across major dealers for popular coins.
                </p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-amber-400 mb-2">When you sell</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Dealers buy back below melt value — typically a 1–5% spread on common bullion — to
                  cover their own margin and resale risk. A coin shop offering a price slightly under
                  spot for a Silver Eagle isn&apos;t lowballing you; that&apos;s the normal buy-sell spread
                  every dealer operates on.
                </p>
              </div>
            </div>
          </section>

          {/* Numismatic vs melt */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Numismatic Value Can Dwarf Melt Value</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Melt value is a <em>floor</em>, not a ceiling. Rarity, mintage, condition, and historical
              demand can push a coin&apos;s actual worth far above its raw metal content — sometimes by
              orders of magnitude. A common-date Morgan Dollar in worn condition might trade close to
              its $0.77 ozt of silver melt value plus a modest premium. The same coin in a low-mintage
              year and uncirculated condition can sell for hundreds or thousands of dollars to
              collectors, with the silver content being almost irrelevant to the price.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Before assuming any coin is worth only its melt value, check its date, mintmark, and
              condition against a numismatic price guide (PCGS and NGC both publish free price guides
              online) or get it appraised by a reputable dealer. This matters most for pre-1965 US
              silver coins, classic gold coins (pre-1933), and any coin with a mintage under roughly
              one million.
            </p>
          </section>

          {/* Authenticity */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Quick Checks Before You Trust a Melt Value</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Melt value calculations assume the coin is genuine. A few fast checks catch most
              counterfeits and platings before you do any math:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Weigh it precisely</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Government mints hold extremely tight weight tolerances. A digital scale accurate to
                  0.01g will catch almost any counterfeit — gold-plated tungsten fakes, for example,
                  are typically off by a noticeable margin once you know the genuine spec.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Check the diameter and thickness</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Calipers are cheap and reliable. Mints publish exact diameter and thickness specs for
                  every coin; deviations of even a fraction of a millimeter are a red flag.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Try a magnet</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Gold and silver are both non-magnetic. A coin that&apos;s noticeably attracted to a
                  strong magnet is not solid precious metal — though the converse isn&apos;t proof of
                  authenticity, since some fake alloys are also non-magnetic.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: "What is melt value?",
                  a: "Melt value is the value of the precious metal physically contained in a coin, calculated by multiplying its fine metal weight in troy ounces by the current spot price. It excludes any collector or numismatic premium.",
                },
                {
                  q: "How much gold is in an American Gold Eagle?",
                  a: "A 1 oz American Gold Eagle contains exactly 1.000 troy ounce of pure gold, with a gross coin weight of 1.0909 troy ounces at 91.67% fineness — the extra weight is the copper and silver alloy added for durability.",
                },
                {
                  q: "Is melt value the same as what a dealer will pay me?",
                  a: "No. Dealers buy below melt value to cover their margin and sell above melt value to cover minting and overhead costs. Melt value is a reference point, not a real transaction price in either direction.",
                },
                {
                  q: "Should I melt down a rare or old coin for its metal value?",
                  a: "Check numismatic value first. Many older or low-mintage coins are worth significantly more to collectors than their melt value — sometimes far more. Always verify date, mintmark, and condition before treating a coin as pure bullion.",
                },
                {
                  q: "How do I check if a gold coin is real?",
                  a: "Weigh it on a precise scale and measure it with calipers against the mint's published specs, and try a magnet test (gold is non-magnetic). For larger purchases, a coin shop's XRF testing gives certainty.",
                },
              ].map((item, i) => (
                <div key={i} className="border-b border-gray-800 pb-6 last:border-0 last:pb-0">
                  <h3 className="text-lg font-semibold text-white mb-2">{item.q}</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="border p-6 sm:p-8 text-center" style={{ borderColor: "rgba(212,175,55,0.25)", background: "var(--surface-2)" }}>
            <h2 className="text-xl font-bold text-white mb-2">Calculate your coins&apos; exact melt value</h2>
            <p className="text-gray-400 text-sm mb-5">
              Enter your coin and quantity — Lode pulls live spot prices automatically.
            </p>
            <Link
              href="/coin-melt-calculator"
              className="inline-block bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Open Coin Melt Calculator →
            </Link>
          </section>

        </article>

      <SiteFooter />
      </main>
    </>
  );
}
