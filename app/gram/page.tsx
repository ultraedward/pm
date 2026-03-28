export const revalidate = 0;
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { fetchAllSpotPrices } from "@/lib/prices/fetchSpotPrices";
import { GramCalculator } from "@/components/GramCalculator";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Gold & Silver Price Per Gram Calculator — Lode",
  description:
    "Calculate the melt value of gold or silver jewelry and scrap by weight. Supports grams, pennyweights, and troy oz. Covers 24k, 22k, 18k, 14k, 10k, 9k gold and 999, 925 sterling, 800 silver — live spot prices.",
  alternates: {
    canonical: "https://lode.rocks/gram",
  },
  openGraph: {
    title: "Gold & Silver Price Per Gram Calculator",
    description:
      "Enter a weight and karat to instantly calculate the melt value of gold or silver jewelry and scrap at today's live spot price.",
    url: "https://lode.rocks/gram",
  },
};

export default async function GramPage() {
  const spots = await fetchAllSpotPrices();

  const goldSpot   = spots.gold   ?? 0;
  const silverSpot = spots.silver ?? 0;

  const fmtSpot = (n: number) =>
    n > 0
      ? n.toLocaleString("en-US", { style: "currency", currency: "USD" })
      : "—";

  // Pre-computed reference table rows
  const GOLD_KARATS = [
    { label: "24k (99.9%)", purity: 1.0      },
    { label: "22k (91.7%)", purity: 22 / 24  },
    { label: "18k (75.0%)", purity: 18 / 24  },
    { label: "14k (58.3%)", purity: 14 / 24  },
    { label: "10k (41.7%)", purity: 10 / 24  },
    { label: "9k (37.5%)",  purity:  9 / 24  },
  ];

  const SILVER_PURITIES = [
    { label: "Fine .999",     purity: 0.999 },
    { label: "Britannia .958",purity: 0.958 },
    { label: "Sterling 925",  purity: 0.925 },
    { label: "Coin 900",      purity: 0.900 },
    { label: "European 800",  purity: 0.800 },
  ];

  const TROY_PER_GRAM = 1 / 31.1035;

  return (
    <main className="min-h-screen bg-surface text-white overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 pt-14 pb-8 sm:pt-20 sm:pb-12">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-1/2 top-0 h-96 w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-tight">
            Gold & Silver<br />
            <span style={{ color: "var(--gold-bright)" }}>Price Per Gram</span>
          </h1>
          <p className="text-base text-gray-400 max-w-md mx-auto">
            Calculate the melt value of jewelry, coins, or scrap — by gram, pennyweight, or troy oz.
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-gray-600 pt-1">
            <span>Gold spot: <span className="text-gray-400 tabular-nums font-semibold">{fmtSpot(goldSpot)} / ozt</span></span>
            <span>Silver spot: <span className="text-gray-400 tabular-nums font-semibold">{fmtSpot(silverSpot)} / ozt</span></span>
          </div>
        </div>
      </section>

      {/* ── Calculator + Reference tables ────────────────────────── */}
      <section className="px-4 sm:px-6 pb-12">
        <div className="mx-auto max-w-2xl">
          <GramCalculator spots={{ gold: goldSpot, silver: silverSpot }} />
        </div>

        <div className="mx-auto max-w-4xl space-y-6 mt-12">
          <h2 className="text-xl font-black tracking-tight text-center">Price per gram — today&apos;s rates</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Gold table */}
            {goldSpot > 0 && (
              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Gold</p>
                </div>
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {GOLD_KARATS.map(({ label, purity }) => {
                    const perGram = goldSpot * TROY_PER_GRAM * purity;
                    return (
                      <div key={label} className="flex items-center justify-between px-5 py-3">
                        <span className="text-sm text-gray-400">{label}</span>
                        <span className="text-sm font-bold tabular-nums text-white">
                          {perGram.toLocaleString("en-US", { style: "currency", currency: "USD" })}/g
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Silver table */}
            {silverSpot > 0 && (
              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
                  <span className="h-2 w-2 rounded-full bg-gray-400" />
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Silver</p>
                </div>
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {SILVER_PURITIES.map(({ label, purity }) => {
                    const perGram = silverSpot * TROY_PER_GRAM * purity;
                    return (
                      <div key={label} className="flex items-center justify-between px-5 py-3">
                        <span className="text-sm text-gray-400">{label}</span>
                        <span className="text-sm font-bold tabular-nums text-white">
                          {perGram.toLocaleString("en-US", { style: "currency", currency: "USD" })}/g
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="border-t px-6 py-16 text-center space-y-5" style={{ borderColor: "var(--border)" }}>
        <p className="text-2xl font-black tracking-tight">Track your full stack on Lode</p>
        <Link href="/login" className="btn-gold px-10 inline-block">
          Sign in to track
        </Link>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <SiteFooter />
    </main>
  );
}
