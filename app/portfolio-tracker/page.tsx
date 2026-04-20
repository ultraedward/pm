import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import LocalPortfolioTracker from "@/components/LocalPortfolioTracker";

export const metadata: Metadata = {
  title: "Precious Metals Portfolio Tracker — Track Gold & Silver Holdings",
  description:
    "Track your gold, silver, platinum, and palladium holdings at live spot prices. See total portfolio value, P&L, and allocation — no account needed. Your data stays on your device.",
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
      "Log your oz, see your total value and P&L at current spot prices. No account needed — your data stays on your device.",
    url: "https://lode.rocks/portfolio-tracker",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home",               "item": "https://lode.rocks" },
        { "@type": "ListItem", "position": 2, "name": "Portfolio Tracker",  "item": "https://lode.rocks/portfolio-tracker" },
      ],
    },
    {
      "@type": "WebApplication",
      "@id": "https://lode.rocks/portfolio-tracker#app",
      "name": "Precious Metals Portfolio Tracker — Lode",
      "url": "https://lode.rocks/portfolio-tracker",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "description":
        "Track gold, silver, platinum, and palladium holdings at live spot prices. See total value, P&L, and allocation. No account needed — data stays on your device.",
      "featureList": [
        "Gold portfolio tracker",
        "Silver holdings tracker",
        "Live spot price valuation",
        "P&L at current prices",
        "Multi-metal portfolio",
        "Platinum and palladium support",
        "No account required",
        "Private — data stays on your device",
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Do I need an account to use the portfolio tracker?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. The portfolio tracker works without any account. Your holdings are saved in your browser and never sent to our servers. If you want to sync across multiple devices, you can optionally create a free account.",
          },
        },
        {
          "@type": "Question",
          "name": "Where is my holdings data stored?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Your holdings are stored locally in your browser using localStorage. Nothing is transmitted to Lode's servers unless you choose to create an account. This means your stack is completely private by default.",
          },
        },
        {
          "@type": "Question",
          "name": "How does the precious metals portfolio tracker work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Log your holdings — ounces of gold, silver, platinum, or palladium and the price you paid — and Lode values them at live spot prices. You see your total portfolio value, P&L since purchase, and allocation across metals, without ever doing a manual price lookup. Whether you hold American Eagles, Maple Leafs, generic rounds, or bars, log them by troy ounce weight.",
          },
        },
      ],
    },
  ],
};

const FEATURES = [
  {
    icon: "🔒",
    title: "Private by default",
    body: "Holdings live in your browser — not our servers. No account required.",
  },
  {
    icon: "📈",
    title: "Live P&L at spot",
    body: "Log your cost basis and see your gain or loss at today's live spot price.",
  },
];

export default function PortfolioTrackerPage() {
  return (
    <main className="min-h-screen bg-surface text-white overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 pt-14 pb-10 sm:pt-20 sm:pb-14">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-1/2 top-0 h-96 w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">Portfolio Tracker · Gold · Silver · Platinum · Palladium</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-tight">
            Precious Metals<br />
            <span style={{ color: "var(--gold-bright)" }}>Portfolio Tracker</span>
          </h1>
          <p className="text-base text-gray-400 max-w-lg mx-auto leading-relaxed">
            Log your holdings, see total value and P&L at live spot prices.
            No account needed — your data stays on your device.
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              View live spot prices →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Live tracker ──────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pb-14">
        <div className="mx-auto max-w-2xl">
          <LocalPortfolioTracker />
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
          No account, no spreadsheets. Your holdings stay on your device.
        </p>
        <Link href="/login" className="btn-gold px-10 inline-block">
          Create free account
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
