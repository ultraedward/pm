import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Coin Melt Value Calculator — Silver Eagles, Junk Silver & More",
  description:
    "Calculate the melt value of silver and gold coins at live spot prices. Covers American Silver Eagles, Maple Leafs, pre-1965 junk silver (dimes, quarters, halves), Morgan dollars, and gold Eagles.",
  keywords: [
    "coin melt value calculator",
    "silver coin melt value",
    "junk silver melt value",
    "silver eagle melt value",
    "gold coin melt value",
    "pre-1965 silver melt value",
    "morgan dollar melt value",
    "gold eagle melt value",
    "silver dollar melt value calculator",
    "precious metals melt calculator",
  ],
  alternates: {
    canonical: "https://lode.rocks/coin-melt-calculator",
  },
  openGraph: {
    title: "Coin Melt Value Calculator — Silver Eagles, Junk Silver & More",
    description:
      "Instantly calculate the melt value of silver and gold coins at live spot prices. Eagles, Maple Leafs, junk silver, Morgan dollars, and more.",
    url: "https://lode.rocks/coin-melt-calculator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://lode.rocks/coin-melt-calculator#app",
      "name": "Coin Melt Value Calculator — Lode",
      "url": "https://lode.rocks/coin-melt-calculator",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "description":
        "Calculate the melt value of silver and gold coins at live spot prices. Covers American Silver Eagles, Maple Leafs, pre-1965 junk silver, Morgan dollars, and gold coins.",
      "featureList": [
        "American Silver Eagle melt value",
        "Junk silver melt value (pre-1965 dimes, quarters, halves)",
        "Morgan and Peace dollar melt value",
        "Gold Eagle melt value",
        "Canadian Maple Leaf melt value",
        "Live spot price updates every 15 minutes",
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the melt value of a silver dollar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Morgan and Peace silver dollars contain 0.7734 troy ounces of silver (90% silver, 10% copper, 26.73g total weight). To find the melt value, multiply 0.7734 by the current silver spot price. Use the calculator on lode.rocks for an up-to-date figure.",
          },
        },
        {
          "@type": "Question",
          "name": "How much silver is in pre-1965 junk silver coins?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pre-1965 US dimes, quarters, and half dollars are 90% silver. A single dime contains 0.0723 troy oz of silver, a quarter contains 0.1808 troy oz, and a half dollar contains 0.3617 troy oz. A $1 face value in 90% silver coins contains approximately 0.715 troy oz of silver.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the melt value of an American Silver Eagle?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An American Silver Eagle contains exactly 1 troy ounce of fine (.999) silver. Its melt value equals the current silver spot price. Use the Lode calculator for the live figure updated every 15 minutes.",
          },
        },
      ],
    },
  ],
};

const COINS = [
  { name: "American Silver Eagle", content: "1.000 troy oz fine silver (.999)", note: "Most popular silver bullion coin" },
  { name: "Canadian Silver Maple Leaf", content: "1.000 troy oz fine silver (.9999)", note: "Highest purity standard silver coin" },
  { name: "Morgan / Peace Dollar (1878–1935)", content: "0.7734 troy oz silver (90% pure)", note: "Classic US 90% silver dollar" },
  { name: "Pre-1965 Dime", content: "0.0723 troy oz silver (90% pure)", note: "Roosevelt or Mercury dime" },
  { name: "Pre-1965 Quarter", content: "0.1808 troy oz silver (90% pure)", note: "Washington quarter" },
  { name: "Pre-1965 Half Dollar", content: "0.3617 troy oz silver (90% pure)", note: "Franklin or Walking Liberty" },
  { name: "American Gold Eagle (1 oz)", content: "1.000 troy oz pure gold (22k)", note: "Contains exactly 1 ozt pure gold" },
  { name: "Canadian Gold Maple Leaf (1 oz)", content: "1.000 troy oz gold (.9999 fine)", note: "99.99% pure gold" },
];

export default function CoinMeltCalculatorPage() {
  return (
    <main className="min-h-screen bg-surface text-white overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 pt-14 pb-12 sm:pt-20 sm:pb-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-1/2 top-0 h-96 w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl text-center space-y-5">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-tight">
            Coin Melt Value<br />
            <span style={{ color: "var(--gold-bright)" }}>Calculator</span>
          </h1>
          <p className="text-base text-gray-400 max-w-lg mx-auto leading-relaxed">
            Melt value for common silver and gold coins at live spot prices.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/#calculator" className="btn-gold px-10">
              Open the calculator
            </Link>
            <Link href="/gram" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Calculate by gram weight →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Coin reference table ───────────────────────────────── */}
      <section className="border-t px-4 sm:px-6 py-14" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black tracking-tight">Silver content reference</h2>
            <p className="text-sm text-gray-500">Troy oz of precious metal per coin — multiply by spot price for melt value.</p>
          </div>
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {COINS.map(({ name, content, note }) => (
                <div key={name} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <p className="text-sm font-bold text-white">{name}</p>
                    <p className="text-xs text-gray-600">{note}</p>
                  </div>
                  <p className="text-sm text-amber-400 font-mono tabular-nums sm:text-right whitespace-nowrap">{content}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-700 text-center">
            Melt value = troy oz content × current spot price.{" "}
            <Link href="/#calculator" className="underline hover:text-gray-500 transition-colors">Use the calculator →</Link>
          </p>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="border-t px-4 sm:px-6 py-14" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-2xl space-y-8">
          <h2 className="text-2xl font-black tracking-tight text-center">Common questions</h2>
          <div className="space-y-6">
            {(jsonLd["@graph"][1] as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] }).mainEntity.map((qa) => (
              <div key={qa.name} className="space-y-2">
                <p className="font-bold text-white">{qa.name}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{qa.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="border-t px-6 py-16 text-center space-y-5" style={{ borderColor: "var(--border)" }}>
        <p className="text-2xl font-black tracking-tight">Know what your stack is worth — right now</p>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Live spot prices, coin melt calculator, portfolio tracker, and price alerts.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/#calculator" className="btn-gold px-10">
            Calculate melt value
          </Link>
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
            Track your full portfolio →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
