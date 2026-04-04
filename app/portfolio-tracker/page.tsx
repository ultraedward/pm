import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Precious Metals Portfolio Tracker — Track Gold & Silver Holdings | Lode",
  description:
    "Track your gold, silver, platinum, and palladium holdings at live spot prices. See total portfolio value, P&L, and allocation — updated every 15 minutes. No spreadsheets needed.",
  keywords: [
    "precious metals portfolio tracker",
    "gold portfolio tracker",
    "silver portfolio tracker",
    "gold holdings tracker",
    "precious metals tracker",
    "track gold and silver",
    "gold silver portfolio value",
    "metals portfolio app",
    "track precious metals holdings",
    "gold investment tracker",
  ],
  alternates: {
    canonical: "https://lode.rocks/portfolio-tracker",
  },
  openGraph: {
    title: "Precious Metals Portfolio Tracker — Track Gold & Silver at Live Spot",
    description:
      "Log your oz, see your total value and P&L at current spot prices. Covers gold, silver, platinum, and palladium. Always up to date — no manual price lookups.",
    url: "https://lode.rocks/portfolio-tracker",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://lode.rocks/portfolio-tracker#app",
      "name": "Precious Metals Portfolio Tracker — Lode",
      "url": "https://lode.rocks/portfolio-tracker",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "description":
        "Track gold, silver, platinum, and palladium holdings at live spot prices. See total value, P&L, and allocation without manual lookups.",
      "featureList": [
        "Gold portfolio tracker",
        "Silver holdings tracker",
        "Live spot price valuation",
        "P&L at current prices",
        "Multi-metal portfolio",
        "Platinum and palladium support",
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does the precious metals portfolio tracker work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Log your holdings — ounces of gold, silver, platinum, or palladium — and Lode values them at live spot prices updated every 15 minutes. You see your total portfolio value, P&L since purchase, and allocation across metals, without ever doing a manual price lookup.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I track both coins and bars in the portfolio tracker?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. You can log any holding by troy ounce weight. Whether you hold American Eagles, Maple Leafs, generic silver rounds, or gold bars — as long as you know the total weight in troy ounces, Lode will value them at spot.",
          },
        },
        {
          "@type": "Question",
          "name": "Does the portfolio tracker update automatically?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Spot prices are refreshed every 15 minutes. Every time you visit your dashboard, your portfolio value reflects the latest market prices — no manual updates needed.",
          },
        },
        {
          "@type": "Question",
          "name": "Which metals does the portfolio tracker support?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Lode tracks gold (XAU), silver (XAG), platinum (XPT), and palladium (XPD) holdings at live spot prices. You can hold positions in any or all four metals.",
          },
        },
      ],
    },
  ],
};

const FEATURES = [
  {
    icon: "💼",
    title: "Total value at a glance",
    body: "See your full stack valued at live spot — gold, silver, platinum, palladium combined into one number.",
  },
  {
    icon: "📈",
    title: "P&L at current spot",
    body: "Log your cost basis and see exactly how much your holdings are up or down at today's prices.",
  },
  {
    icon: "🔄",
    title: "Auto-updated every 15 minutes",
    body: "No refreshing, no manual price lookups. Spot prices update in the background while you get on with your day.",
  },
  {
    icon: "🥇",
    title: "Four metals, one dashboard",
    body: "Gold, silver, platinum, and palladium — log oz in any combination and see your total allocation at a glance.",
  },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Sign in", body: "Create a free account in 30 seconds using Google or email." },
  { step: "2", title: "Log your holdings", body: "Enter your troy ounce position for each metal you hold." },
  { step: "3", title: "See live portfolio value", body: "Your dashboard shows total value, P&L, and allocation — updated every 15 minutes." },
];

export default function PortfolioTrackerPage() {
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
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">Portfolio Tracker · Gold · Silver · Platinum · Palladium</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-tight">
            Precious Metals<br />
            <span style={{ color: "var(--gold-bright)" }}>Portfolio Tracker</span>
          </h1>
          <p className="text-base text-gray-400 max-w-lg mx-auto leading-relaxed">
            Log your gold, silver, platinum, and palladium holdings. See total value and P&L at live spot prices —
            updated every 15 minutes, no spreadsheets required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/login" className="btn-gold px-10">
              Track my stack
            </Link>
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              View live spot prices →
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section className="border-t px-4 sm:px-6 py-14" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-3xl space-y-10">
          <h2 className="text-2xl font-black tracking-tight text-center">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(({ step, title, body }) => (
              <div key={step} className="flex flex-col gap-3">
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-black"
                  style={{ background: "rgba(212,175,55,0.15)", color: "var(--gold-bright)" }}
                >
                  {step}
                </div>
                <p className="font-bold text-white">{title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="border-t px-4 sm:px-6 py-14" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-4xl space-y-10">
          <h2 className="text-2xl font-black tracking-tight text-center">What you get</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map(({ icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border p-6 space-y-2"
                style={{ borderColor: "var(--border)" }}
              >
                <p className="text-2xl">{icon}</p>
                <p className="font-bold text-white">{title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
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
        <p className="text-2xl font-black tracking-tight">Know exactly what your stack is worth — right now</p>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Free account, live spot prices, no spreadsheets. Takes 30 seconds to set up.
        </p>
        <Link href="/login" className="btn-gold px-10 inline-block">
          Track my stack
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
