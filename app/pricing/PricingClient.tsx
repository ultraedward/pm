"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  isPro: boolean;
  isLoggedIn: boolean;
};

const FREE_FEATURES = [
  "Live spot prices — gold, silver, platinum & palladium",
  "Portfolio tracker — track your holdings & P&L",
  "Price charts — 30-day history per metal",
  "3 price alerts with email notifications",
  "Gold coin value calculator",
];

const PRO_EXCLUSIVE = [
  "Unlimited price alerts — never miss a target price",
  "Full coin value calculator — silver, platinum & palladium",
];

export function PricingClient({ isPro, isLoggedIn }: Props) {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="space-y-10">

      {/* Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm font-medium transition-colors ${!annual ? "text-white" : "text-gray-500"}`}>
          Monthly
        </span>
        <button
          onClick={() => setAnnual((v) => !v)}
          className={`relative h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none ${annual ? "bg-amber-500" : "bg-white/15"}`}
          aria-label="Toggle annual billing"
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${annual ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
        <span className={`text-sm font-medium transition-colors ${annual ? "text-white" : "text-gray-500"}`}>
          Annual
          <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-400">
            Save $11
          </span>
        </span>
      </div>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* Free */}
        <div className="rounded-2xl border border-white/10 p-8 space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Free</p>
            <div className="flex items-end gap-1">
              <span className="text-5xl font-black">$0</span>
              <span className="text-gray-500 mb-1">/month</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">No credit card required.</p>
          </div>

          <ul className="space-y-3 text-sm text-gray-300">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-amber-500">✓</span> {f}
              </li>
            ))}
          </ul>

          <div>
            {isLoggedIn ? (
              isPro ? (
                <div className="rounded-full border border-white/10 py-2.5 text-center text-sm text-gray-500">
                  Not your plan
                </div>
              ) : (
                <div className="rounded-full border border-white/10 py-2.5 text-center text-sm text-gray-400">
                  Current plan
                </div>
              )
            ) : (
              <Link
                href="/login"
                className="block rounded-full border border-white/10 py-2.5 text-center text-sm text-white hover:bg-white/5 transition-colors"
              >
                Get started free
              </Link>
            )}
          </div>
        </div>

        {/* Pro */}
        <div className="relative rounded-2xl border border-amber-500/40 p-8 space-y-8 overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-2">Pro</p>
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
            {annual && (
              <p className="text-sm text-gray-500 mt-2">~$2.08 / month</p>
            )}
          </div>

          <ul className="relative space-y-3 text-sm text-gray-300">
            {PRO_EXCLUSIVE.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-amber-500">✓</span> {f}
              </li>
            ))}
          </ul>

          <div className="relative">
            {isPro ? (
              <div className="rounded-full bg-amber-500/20 py-2.5 text-center text-sm font-semibold text-amber-400">
                Active plan
              </div>
            ) : isLoggedIn ? (
              <form action="/api/billing/checkout" method="POST">
                <input type="hidden" name="interval" value={annual ? "year" : "month"} />
                <button
                  type="submit"
                  className="w-full rounded-full bg-amber-500 py-2.5 text-sm font-bold text-black hover:bg-amber-400 transition-colors"
                >
                  Upgrade to Pro
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="block rounded-full bg-amber-500 py-2.5 text-center text-sm font-bold text-black hover:bg-amber-400 transition-colors"
              >
                Start with Pro
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
