import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "The Complete Guide to Buying Junk Silver Coins (2026)",
  description:
    "Everything you need to know about junk silver: what it is, which coins qualify, how to calculate melt value, where to buy it, and what premiums to expect. Updated for 2026.",
  keywords: [
    "junk silver guide",
    "buying junk silver",
    "what is junk silver",
    "junk silver coins",
    "90% silver coins",
    "pre-1965 silver coins",
    "junk silver premiums",
    "junk silver melt value",
    "how to buy junk silver",
    "junk silver vs silver eagles",
    "best junk silver coins to buy",
    "junk silver for beginners",
  ],
  alternates: {
    canonical: "https://lode.rocks/blog/junk-silver-guide",
  },
  openGraph: {
    title: "The Complete Guide to Buying Junk Silver Coins (2026)",
    description:
      "What is junk silver, which coins count, how to calculate melt value, where to buy it, and what premiums to pay. The definitive reference for stackers.",
    url: "https://lode.rocks/blog/junk-silver-guide",
    type: "article",
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
        { "@type": "ListItem", "position": 3, "name": "Junk Silver Guide", "item": "https://lode.rocks/blog/junk-silver-guide" },
      ],
    },
    {
      "@type": "Article",
      "@id": "https://lode.rocks/blog/junk-silver-guide#article",
      "headline": "The Complete Guide to Buying Junk Silver Coins (2026)",
      "description": "Everything you need to know about junk silver: what it is, which coins qualify, how to calculate melt value, where to buy it, and what premiums to expect.",
      "url": "https://lode.rocks/blog/junk-silver-guide",
      "datePublished": "2026-05-01",
      "dateModified": "2026-05-01",
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
      "mainEntityOfPage": "https://lode.rocks/blog/junk-silver-guide",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is junk silver?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Junk silver refers to pre-1965 US dimes, quarters, and half dollars made of 90% silver. The word 'junk' signals no numismatic premium — these coins trade purely on their metal content. One dollar of face value contains approximately 0.715 troy ounces of silver.",
          },
        },
        {
          "@type": "Question",
          "name": "How much silver is in a junk silver dime?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A pre-1965 US dime (Mercury or Roosevelt) contains 0.07234 troy ounces of silver. Ten dimes ($1 face value) therefore contain approximately 0.7234 troy ounces — commonly rounded to 0.715 ozt to account for wear.",
          },
        },
        {
          "@type": "Question",
          "name": "Is junk silver a good investment?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Junk silver offers the lowest premium over spot of any silver bullion format, making it efficient for large-scale stacking. It is also highly divisible, widely recognizable, and liquid — dealers and coin shops buy it readily. The main trade-off vs. silver rounds or bars is lower aesthetics and some variation in wear. For investors who prioritize silver content per dollar, junk silver is often the best option.",
          },
        },
        {
          "@type": "Question",
          "name": "Where can I buy junk silver?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Junk silver is available from major online dealers (APMEX, JM Bullion, SD Bullion), local coin shops (LCS), estate sales, and coin shows. Online dealers offer the widest selection but charge shipping; local coin shops are best for smaller quantities and negotiating on price.",
          },
        },
      ],
    },
  ],
};

// Silver content data for coins
const coinData = [
  { coin: "Roosevelt / Mercury Dime", years: "1916–1964", fineness: "90%", troyOz: "0.07234", faceValue: "$0.10" },
  { coin: "Washington Quarter", years: "1932–1964", fineness: "90%", troyOz: "0.18084", faceValue: "$0.25" },
  { coin: "Walking Liberty Half Dollar", years: "1916–1947", fineness: "90%", troyOz: "0.36169", faceValue: "$0.50" },
  { coin: "Franklin Half Dollar", years: "1948–1963", fineness: "90%", troyOz: "0.36169", faceValue: "$0.50" },
  { coin: "Kennedy Half Dollar", years: "1964", fineness: "90%", troyOz: "0.36169", faceValue: "$0.50" },
  { coin: "Kennedy Half Dollar", years: "1965–1970", fineness: "40%", troyOz: "0.14792", faceValue: "$0.50" },
  { coin: "Morgan Dollar", years: "1878–1921", fineness: "90%", troyOz: "0.77344", faceValue: "$1.00" },
  { coin: "Peace Dollar", years: "1921–1935", fineness: "90%", troyOz: "0.77344", faceValue: "$1.00" },
];

export default function JunkSilverGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-gray-950 text-gray-100">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-3xl mx-auto px-4 py-10">
            <nav className="text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-amber-400 transition-colors">Lode</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-400">Junk Silver Guide</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">
              The Complete Guide to Buying Junk Silver Coins
            </h1>
            <p className="text-gray-400 text-base">
              Updated May 2026 · 8 min read
            </p>
          </div>
        </div>

        {/* Article body */}
        <article className="max-w-3xl mx-auto px-4 py-10 space-y-10">

          {/* Intro */}
          <section>
            <p className="text-gray-300 text-lg leading-relaxed">
              If you&apos;ve spent any time in precious metals forums or walked through a coin show,
              you&apos;ve heard the term <em>junk silver</em>. It sounds like something to avoid. It
              isn&apos;t. Junk silver is one of the most efficient ways to buy physical silver — low
              premiums, instant liquidity, and a format any dealer in the country will recognize. This
              guide covers everything you need to know before you buy your first bag.
            </p>
          </section>

          {/* What is junk silver */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">What Is Junk Silver?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Junk silver is a collector and dealer shorthand for pre-1965 US dimes, quarters, and
              half dollars that contain 90% silver. The word &ldquo;junk&rdquo; has nothing to do with
              quality — it signals that these coins carry <em>no numismatic premium</em>. They are
              worth exactly their silver content, nothing more.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              The cutoff year is 1964. In 1965 the US Mint switched dimes and quarters to a
              copper-nickel clad composition, removing silver entirely. Half dollars went to 40%
              silver from 1965–1970, then clad after that. Anything from 1964 and earlier — with a
              few exceptions — is the real deal.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Morgan and Peace dollars (minted 1878–1935) are technically junk silver too — 90%
              silver, sometimes sold at melt — but they often carry collector premiums, so they sit in
              a gray zone. Pre-1965 dimes, quarters, and halves are the cleanest junk silver play.
            </p>
          </section>

          {/* Why stackers love it */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Why Stackers Buy Junk Silver</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Three things set junk silver apart from silver rounds, bars, and ETFs:
            </p>

            <div className="space-y-5">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-amber-400 mb-2">Low premiums over spot</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Generic silver rounds typically sell at $2–4 over spot. American Silver Eagles
                  command $5–10 or more. Junk silver — especially in bulk &ldquo;$1,000 face&rdquo; bags —
                  often trades within $1–2 of spot, sometimes below spot at local coin shops when the
                  seller needs cash. Over time that gap compounds into a meaningful difference in how
                  much actual silver you own per dollar spent.
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-amber-400 mb-2">Divisibility</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  A 100 oz silver bar is efficient to store but awkward to spend or sell partially.
                  Junk silver naturally breaks down into small, convenient denominations — a single
                  dime holds about $1.60 worth of silver at $22/ozt, a quarter around $4. For people
                  who own silver partly as a &ldquo;just in case&rdquo; hedge, the divisibility of junk silver
                  is a practical feature, not a novelty.
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-amber-400 mb-2">Universal recognition</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Every coin shop, pawn shop, and precious metals dealer in the US immediately
                  recognizes a Washington quarter or Roosevelt dime. There&apos;s no need to assay or
                  authenticate — the US government already certified the silver content when it was
                  minted. That familiarity translates into frictionless buying and selling.
                </p>
              </div>
            </div>
          </section>

          {/* Coin reference table */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Silver Content by Coin</h2>
            <p className="text-gray-300 leading-relaxed mb-5">
              These are the exact silver weights used by dealers and melt-value calculators. Figures
              are for uncirculated coins; circulated coins average about 1% lighter due to wear —
              which is why the standard industry factor for &ldquo;$1 face value of 90% silver&rdquo; is
              0.715 troy oz rather than the theoretical 0.7234 ozt.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-800 text-gray-400 text-left">
                    <th className="px-4 py-3 font-medium">Coin</th>
                    <th className="px-4 py-3 font-medium">Years</th>
                    <th className="px-4 py-3 font-medium">Fineness</th>
                    <th className="px-4 py-3 font-medium text-right">Troy oz silver</th>
                    <th className="px-4 py-3 font-medium text-right">Face value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {coinData.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-900" : "bg-gray-900/50"}>
                      <td className="px-4 py-3 text-white font-medium">{row.coin}</td>
                      <td className="px-4 py-3 text-gray-400">{row.years}</td>
                      <td className="px-4 py-3 text-gray-400">{row.fineness}</td>
                      <td className="px-4 py-3 text-amber-400 text-right font-mono">{row.troyOz}</td>
                      <td className="px-4 py-3 text-gray-400 text-right">{row.faceValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-500 text-xs mt-2">
              * 1965–1970 Kennedy halves are 40% silver and priced differently from 90% coins.
            </p>
          </section>

          {/* Calculating melt value */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How to Calculate Junk Silver Melt Value</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              The math is straightforward. Multiply the silver content in troy ounces by the current
              spot price. For a bag of quarters:
            </p>
            <div className="bg-gray-900 border border-amber-900/40 rounded-xl p-5 font-mono text-sm text-gray-300 space-y-2">
              <p><span className="text-amber-400">Face value</span> × 0.715 = troy ounces of silver</p>
              <p><span className="text-amber-400">Troy ounces</span> × spot price = melt value</p>
              <p className="text-gray-500 pt-2 font-sans text-xs">
                Example: $100 face value of quarters × 0.715 = 71.5 ozt · 71.5 × $30/ozt = $2,145 melt value
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed mt-4">
              You don&apos;t need to do this manually. The{" "}
              <Link href="/junk-silver-calculator" className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors">
                Lode junk silver calculator
              </Link>{" "}
              pulls live spot prices and lets you enter either a face value amount or count coins
              individually — useful if you have a mixed bag with both 90% and 40% halves.
            </p>
          </section>

          {/* Where to buy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Where to Buy Junk Silver</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You have four main options, each with real trade-offs:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Online dealers (APMEX, JM Bullion, SD Bullion)</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Best selection and competitive pricing, especially on larger quantities ($100+ face
                  value). Premiums are clearly posted. Downsides: shipping costs eat into small orders,
                  and you pay sales tax in most states unless you hit minimum order thresholds. Check
                  our{" "}
                  <Link href="/compare" className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors">
                    dealer comparison page
                  </Link>{" "}
                  to see current premiums side-by-side.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Local coin shops (LCS)</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  The underrated option. No shipping fees, no minimum order, and you can negotiate —
                  especially on worn or mixed lots. LCS owners often price to move, particularly on
                  dimes and quarters. The downside is inconsistent inventory and hours. Call ahead.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Coin shows and estate sales</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  The best deals in precious metals often happen at estate sales and local coin shows,
                  where sellers don&apos;t always know spot price and just want to clear inventory. This
                  takes legwork but can yield junk silver at or below melt, especially for dimes (less
                  collector appeal than Morgan dollars).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-1">eBay and peer-to-peer</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Liquid but noisy. eBay prices for junk silver track fairly close to dealer prices
                  once you factor in shipping and fees. The advantage is accessibility; the
                  disadvantage is counterfeits. Stick to sellers with 100+ feedback and return policies
                  until you can authenticate by weight.
                </p>
              </div>
            </div>
          </section>

          {/* What to watch out for */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">What to Watch Out For</h2>

            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">40% Kennedy halves mixed into 90% lots</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  1965–1970 Kennedy halves look nearly identical to the 1964 90% version, but contain
                  only 40% silver (0.148 ozt vs. 0.362 ozt). A 1965 half is worth less than half of a
                  1964. Always check dates if you&apos;re buying loose halves. Reputable dealers sort
                  these; less reputable ones don&apos;t.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Counterfeit coins</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Junk silver is a relatively low-value target for counterfeiters compared to Morgan
                  dollars or ASEs, but fakes exist. The simplest test: weight. A genuine Roosevelt
                  dime weighs exactly 2.50g. A quarter weighs 6.25g. A half weighs 12.50g. A $10
                  digital postal scale catches most fakes immediately.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Paying too much premium</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Junk silver&apos;s main advantage is low premium. If you&apos;re paying more than 5–8%
                  over spot on a large lot, you&apos;ve lost the key benefit. Know spot before you buy —
                  the{" "}
                  <Link href="/silver-price" className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors">
                    live silver price
                  </Link>{" "}
                  is one click away. On small retail quantities, 10–15% over melt is normal; on $100+
                  face bags, push back if a dealer quotes higher than 5%.
                </p>
              </div>
            </div>
          </section>

          {/* Junk silver vs alternatives */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Junk Silver vs. Other Silver Formats</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-800 text-gray-400 text-left">
                    <th className="px-4 py-3 font-medium">Format</th>
                    <th className="px-4 py-3 font-medium">Typical premium</th>
                    <th className="px-4 py-3 font-medium">Divisibility</th>
                    <th className="px-4 py-3 font-medium">Liquidity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {[
                    { format: "Junk silver (90%)", premium: "2–5% over spot", div: "High", liq: "Very high" },
                    { format: "Generic silver rounds", premium: "3–6% over spot", div: "Low (1 ozt)", liq: "High" },
                    { format: "American Silver Eagles", premium: "8–15% over spot", div: "Low (1 ozt)", liq: "Very high" },
                    { format: "Silver bars (10 oz)", premium: "2–4% over spot", div: "Very low", liq: "Medium" },
                    { format: "Silver ETFs (SLV)", premium: "~0% + expense ratio", div: "N/A", liq: "Instant" },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-900" : "bg-gray-900/50"}>
                      <td className="px-4 py-3 text-white font-medium">{row.format}</td>
                      <td className="px-4 py-3 text-gray-400">{row.premium}</td>
                      <td className="px-4 py-3 text-gray-400">{row.div}</td>
                      <td className="px-4 py-3 text-gray-400">{row.liq}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: "Is junk silver a good investment?",
                  a: "Junk silver is one of the most cost-efficient ways to own physical silver. The low premium over spot means you capture almost all of silver's price movement. It also doubles as a tangible, divisible asset. The main limitation is storage: a $1,000 face-value bag of 90% silver weighs roughly 55 lbs and contains about 715 troy ounces — significant bulk at scale.",
                },
                {
                  q: "What does '$1,000 face value' mean?",
                  a: "It means the nominal face value of the coins adds up to $1,000 in legal-tender dollars — for example, 10,000 dimes or 4,000 quarters. At the 0.715 ozt/dollar standard, a $1,000 face bag contains roughly 715 troy ounces of silver. This is the standard trading unit for dealers; smaller lots are sold in $100 and $500 face increments.",
                },
                {
                  q: "Do I pay sales tax on junk silver?",
                  a: "It depends on your state. Most states exempt precious metals from sales tax, but a handful (California, for example) tax coins and bullion below certain thresholds. Online dealers typically charge tax automatically by state. Local coin shop transactions are cash-friendly and may be handled differently — check your state's rules.",
                },
                {
                  q: "How do I store junk silver?",
                  a: "Most stackers use canvas or cloth bank bags (the classic 'junk silver bag'), an airtight container, or a safe. Silver does tarnish over time — especially dimes — but tarnish doesn't affect melt value. Avoid PVC plastic flips for long-term storage, as PVC can cause a green residue. Dry storage at room temperature is sufficient.",
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
          <section className="bg-gray-900 border border-amber-900/40 rounded-2xl p-6 sm:p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Ready to calculate your melt value?</h2>
            <p className="text-gray-400 text-sm mb-5">
              Enter your face value or count coins individually. Spot prices update on every page load.
            </p>
            <Link
              href="/junk-silver-calculator"
              className="inline-block bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Open Junk Silver Calculator →
            </Link>
          </section>

        </article>

        <SiteFooter />
      </main>
    </>
  );
}
