import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Pricing — Free Forever",
  description:
    "Lode is free forever: live spot prices, melt calculators, portfolio tracker, unlimited price alerts, and a weekly digest.",
  alternates: {
    canonical: "https://lode.rocks/pricing",
  },
  openGraph: {
    title: "Pricing — Free Forever | Lode",
    description:
      "Lode is free forever: live prices, calculators, portfolio tracker, unlimited alerts, and a weekly Monday digest.",
    url: "https://lode.rocks/pricing",
  },
};

const FEATURES = [
  "Live spot prices — gold, silver, platinum & palladium",
  "Coin melt calculator — all metals, all coin types",
  "Gram calculator — jewelry & scrap, any karat",
  "Portfolio tracker — holdings & P&L",
  "30-day price charts",
  "Unlimited price alerts — set targets across any metal",
  "Weekly Monday digest — spot prices in your inbox",
];

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user?.email;

  return (
    <>
    <main className="px-6 py-12 sm:py-24" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto max-w-lg space-y-12">

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black tracking-tight">Free forever.</h1>
          <p className="text-gray-400">
            Everything Lode offers is free — no trials, no paywalls, no credit card.
          </p>
        </div>

        {/* Feature card */}
        <div className="rounded-2xl border border-white/10 p-8 space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Included</p>
            <span className="text-4xl font-black">$0</span>
            <span className="text-gray-500 ml-1">/month</span>
          </div>

          <ul className="space-y-3 text-sm text-gray-300">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-amber-500">✓</span> {f}
              </li>
            ))}
          </ul>

          <div>
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="block rounded-full border border-white/10 py-2.5 text-center text-sm text-gray-400 hover:bg-white/5 transition-colors"
              >
                Go to dashboard →
              </Link>
            ) : (
              <Link href="/login" className="btn-gold w-full">
                Get started
              </Link>
            )}
          </div>
        </div>

      </div>
      </main>
    <SiteFooter />
  </>
  );
}
