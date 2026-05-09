import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SiteFooter } from "@/components/SiteFooter";
import LocalPortfolioTracker from "@/components/LocalPortfolioTracker";

// /portfolio-tracker is the no-account, localStorage-backed tracker — its
// purpose is to give anonymous visitors a useful tool without asking for
// signup. Once a user is logged in, they have a real DB-backed tracker at
// /dashboard with cross-device sync; landing them here would be confusing
// (their dashboard holdings wouldn't show up). Redirect for them.
export const dynamic = "force-dynamic";

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
            "text": "No. The portfolio tracker works without any account. Your holdings are saved in your browser and never sent to our servers. If you want to sync across multiple devices, you can optionally create an account.",
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
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Private by default",
    body: "Holdings live in your browser — not our servers. Nothing is transmitted unless you choose to create an account.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    title: "Live P&L at spot",
    body: "Log your cost basis and see your gain or loss at today's live spot price, refreshed on every page load.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
    title: "All four metals",
    body: "Track gold, silver, platinum, and palladium. Log any form — coins, bars, or rounds — in troy ounces.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    ),
    title: "No account required",
    body: "Start tracking immediately. Create an account only if you want to sync your holdings across devices.",
  },
];

export default async function PortfolioTrackerPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    redirect("/dashboard");
  }

  return (
    <>
    <main className="overflow-x-hidden" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
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
                className="rounded-2xl border p-6 space-y-3"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--gold-dim)", color: "var(--gold)" }}
                >
                  {icon}
                </div>
                <p className="font-bold" style={{ color: "var(--text)" }}>{title}</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{body}</p>
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
            {(jsonLd["@graph"][2] as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] }).mainEntity.map((qa) => (
              <div key={qa.name} className="space-y-2">
                <p className="font-bold" style={{ color: "var(--text)" }}>{qa.name}</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{qa.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="border-t px-6 py-16 text-center space-y-5" style={{ borderColor: "var(--border)" }}>
        <p className="text-2xl font-black tracking-tight">Sync your stack across devices</p>
        <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
          Create a free account to save your holdings to the cloud and access them from anywhere.
        </p>
        <Link href="/login" className="btn-gold px-10 inline-block">
          Save your stack
        </Link>
      </section>

      <SiteFooter />
      </main>
  </>
  );
}
