"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Shown on first dashboard visit when the user has no alerts yet.
 * Dismissed by clicking X — persisted in localStorage so it doesn't reappear.
 */
export function OnboardingBanner() {
  const [dismissed, setDismissed] = useState(false);

  function dismiss() {
    try { localStorage.setItem("lode_onboarding_dismissed", "1"); } catch {}
    setDismissed(true);
  }

  if (dismissed) return null;

  return (
    <div
      className="flex items-start justify-between gap-4 border px-5 py-4 animate-fade-up"
      style={{ borderColor: "var(--gold-glow)", background: "var(--gold-dim)" }}
      role="status"
      aria-label="Getting started"
    >
      <div className="flex items-start gap-3 min-w-0">
        {/* Gold dot accent */}
        <span
          className="mt-1 h-2 w-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: "var(--gold)" }}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="text-sm font-bold" style={{ color: "var(--gold)" }}>
            Set your first price alert
          </p>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Tell us a target price and we'll send one email when gold or silver hits it — no noise, no daily digests.
          </p>
          <Link
            href="/alerts/new"
            className="inline-block mt-3 btn-gold text-xs px-4 py-2"
          >
            Set alert →
          </Link>
        </div>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="flex-shrink-0 text-gray-600 hover:text-gray-400 transition-colors mt-0.5"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
