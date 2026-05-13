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
  // Noindex: thin marketing/feature-list page — not a search landing page.
  // Google crawled but chose not to index it; we confirm that intent here.
  robots: {
    index: false,
    follow: true,
  },
};

const FEATURES = [
  { label: "Live spot prices",      body: "Gold, silver, platinum & palladium — updated continuously." },
  { label: "Unlimited price alerts", body: "Set targets across any metal. One email when it hits." },
  { label: "Coin melt calculator",  body: "All metals, all major coin types. Live values." },
  { label: "Gram calculator",       body: "Jewelry & scrap — any karat, any weight." },
  { label: "Portfolio tracker",     body: "Holdings & P&L against live spot." },
  { label: "30-day price charts",   body: "Visual history for all four metals." },
  { label: "Weekly digest",         body: "Spot prices in your inbox every Monday." },
];

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user?.email;

  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="px-6 pt-20 pb-16 sm:pt-36 sm:pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="label mb-6 animate-fade-up">Pricing</p>
          <h1
            className="font-black text-white animate-fade-up animate-delay-100"
            style={{
              fontSize: "clamp(3.5rem, 10vw, 7.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: "0.90",
            }}
          >
            Free.<br />Forever.
          </h1>
          <p
            className="mt-8 text-base leading-relaxed max-w-sm mx-auto animate-fade-up animate-delay-200"
            style={{ color: "var(--text-muted)" }}
          >
            No trials. No paywalls. No credit card.
            Every feature, every stacker, always free.
          </p>
        </div>
      </section>

      {/* ── PRICE STATEMENT ─────────────────────────────────────── */}
      <section
        className="border-t border-b reveal"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div>
            <p className="label mb-3">Monthly cost</p>
            <div className="flex items-baseline gap-3">
              <span
                className="font-black text-white tabular-nums"
                style={{ fontSize: "clamp(4rem, 12vw, 8rem)", letterSpacing: "-0.05em", lineHeight: 1 }}
              >
                $0
              </span>
              <span className="text-lg font-medium" style={{ color: "var(--text-muted)" }}>/ mo</span>
            </div>
          </div>
          <div className="sm:text-right">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="btn-ghost inline-flex"
              >
                Go to dashboard
              </Link>
            ) : (
              <Link href="/login" className="btn-gold">
                Get started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── FEATURE LIST ─────────────────────────────────────────── */}
      <section className="px-6 py-14 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="reveal space-y-2 mb-10">
            <p className="label">Everything included</p>
            <h2
              className="font-black text-white"
              style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)", letterSpacing: "-0.04em", lineHeight: "0.95" }}
            >
              The full toolkit. No upgrade required.
            </h2>
          </div>

          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {FEATURES.map(({ label, body }, i) => (
              <div
                key={label}
                className={`reveal reveal-delay-${Math.min(i + 1, 6)} flex items-start sm:items-center justify-between gap-6 py-5`}
              >
                <div className="flex items-start sm:items-center gap-4">
                  {/* Gold checkmark */}
                  <span
                    className="mt-0.5 sm:mt-0 flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: "var(--gold-dim)", color: "var(--gold)" }}
                    aria-hidden="true"
                  >
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">{label}</p>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--text-dim)" }}>{body}</p>
                  </div>
                </div>
                <span
                  className="flex-shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: "var(--gold-dim)", color: "var(--gold)" }}
                >
                  Free
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────── */}
      {!isLoggedIn && (
        <section
          className="border-t px-6 py-20 sm:py-28 reveal"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="mx-auto max-w-4xl text-center space-y-7">
            <p className="label">Ready?</p>
            <p
              className="font-black text-white"
              style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)", letterSpacing: "-0.04em", lineHeight: "0.93" }}
            >
              Start tracking your stack.
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No card. No setup. 30 seconds.
            </p>
            <div className="flex justify-center">
              <Link href="/login" className="btn-gold">
                Create free account
              </Link>
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
