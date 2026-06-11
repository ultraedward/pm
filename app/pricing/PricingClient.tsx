"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  isPro: boolean;
  isLoggedIn: boolean;
};

const FREE_FEATURES = [
  "Live spot prices — gold, silver, platinum & palladium",
  "Coin melt calculator — all metals, all coin types",
  "Gram calculator — jewelry & scrap, any karat",
  "Portfolio tracker — holdings & P&L",
  "30-day price charts",
  "Weekly Monday digest — spot prices in your inbox",
  "Unlimited price alerts",
];

const PRO_FEATURES = [
  "Unlimited price alerts — set targets across any metal",
  "Everything in Free",
];

export function PricingClient({ isPro, isLoggedIn }: Props) {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="space-y-10">

      {/* Toggle */}
      <div className="flex items-center justify-center gap-4">
        {/* role="switch" is the correct ARIA pattern for binary on/off controls.
            aria-checked communicates the current state to screen readers. */}
        <span
          id="billing-monthly-label"
          className={`text-sm font-medium transition-colors ${!annual ? "text-white" : "text-gray-500"}`}
        >
          Monthly
        </span>
        <button
          role="switch"
          aria-checked={annual}
          aria-label="Annual billing"
          aria-describedby="billing-monthly-label billing-annual-label"
          onClick={() => setAnnual((v) => !v)}
          className="relative h-6 w-11 transition-colors duration-200"
          style={{ backgroundColor: annual ? "var(--gold)" : "rgba(255,255,255,0.15)" }}
        >
          <span
            aria-hidden="true"
            className={`absolute top-0.5 left-0.5 h-5 w-5 bg-white shadow transition-transform duration-200 ${annual ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
        <span
          id="billing-annual-label"
          className={`text-sm font-medium transition-colors ${annual ? "text-white" : "text-gray-500"}`}
        >
          Annual
          <span aria-hidden="true" className="ml-2 px-2 py-0.5 text-xs font-semibold" style={{ background: "var(--gold-dim)", color: "var(--gold)" }}>
            Save $11
          </span>
        </span>
      </div>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* Free */}
        <div className="border p-8 space-y-8" style={{ borderColor: "var(--border)" }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Free</p>
            <div className="flex items-end gap-1">
              <span className="text-5xl font-black">$0</span>
              <span className="text-gray-500 mb-1">/month</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Free forever.</p>
          </div>

          <ul className="space-y-3 text-sm text-gray-300">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span style={{ color: "var(--gold)" }}>✓</span> {f}
              </li>
            ))}
          </ul>

          <div>
            {isLoggedIn ? (
              isPro ? (
                <div className="border py-2.5 text-center text-sm" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                  Not your plan
                </div>
              ) : (
                <div className="border py-2.5 text-center text-sm" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                  Current plan
                </div>
              )
            ) : (
              <Link
                href="/login"
                className="block btn-ghost py-2.5 text-center text-sm"
              >
                Get started
              </Link>
            )}
          </div>
        </div>

        {/* Pro */}
        <div className="relative border p-8 space-y-8 overflow-hidden" style={{ borderColor: "var(--gold-glow)" }}>
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl" style={{ background: "var(--gold-dim)" }} />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--gold)" }}>Pro</p>
            <div className="flex items-end gap-1">
              {annual ? (
                <>
                  <span className="text-5xl font-black">$25</span>
                  <span className="text-gray-500 mb-1">/year</span>
                </>
              ) : (
                <>
                  <span className="text-5xl font-black">$3</span>
                  <span className="text-gray-500 mb-1">/month</span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-2">For serious stackers watching the market.</p>
            {annual && (
              <p className="text-xs text-gray-600 mt-1">~$2.08 / month</p>
            )}
          </div>

          <ul className="relative space-y-3 text-sm text-gray-300">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: "var(--gold)" }}>✓</span> {f}
              </li>
            ))}
          </ul>

          <div className="relative">
            {isPro ? (
              <div className="py-2.5 text-center text-sm font-bold" style={{ background: "var(--gold-dim)", color: "var(--gold)" }}>
                Active plan
              </div>
            ) : isLoggedIn ? (
              <form action="/api/billing/checkout" method="POST">
                <input type="hidden" name="interval" value={annual ? "year" : "month"} />
                <button type="submit" className="btn-gold w-full py-2.5 text-[10px]">
                  Upgrade to Pro
                </button>
              </form>
            ) : (
              <Link href="/login" className="btn-gold block text-center py-2.5 text-[10px]">
                Start with Pro
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t mt-16 px-6 py-8" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <Link href="/" className="font-bold text-gray-400 tracking-widest uppercase hover:text-white transition-colors">Lode</Link>
          <div className="flex gap-8">
            <Link href="/"        className="hover:text-gray-300 transition-colors">Home</Link>
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link href="/terms"   className="hover:text-gray-300 transition-colors">Terms</Link>
            {isLoggedIn
              ? <Link href="/dashboard" className="hover:text-gray-300 transition-colors">Dashboard</Link>
              : <Link href="/login"     className="hover:text-gray-300 transition-colors">Sign in</Link>
            }
          </div>
          <span>© {new Date().getFullYear()} Lode</span>
        </div>
      </footer>
    </div>
  );
}
