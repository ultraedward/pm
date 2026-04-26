"use client";

import Link from "next/link";

/**
 * Consistent site-wide footer used on every page.
 *
 * Top strip is a four-item commitment line — re-anchors the trust
 * positioning on every page (not just /about and /faq, which most
 * visitors never visit). Each item is a verifiable fact, not a vague
 * brand claim, so the strip survives skeptical reading.
 *
 * Bottom strip: nav links + copyright (the pre-existing footer).
 */
export function SiteFooter() {
  return (
    <footer className="border-t px-6 pt-7 pb-8" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-6xl">

        {/* Trust strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-gray-600 pb-6 border-b" style={{ borderColor: "var(--border)" }}>
          <span className="inline-flex items-center gap-1.5 text-gray-500">
            <span aria-hidden className="text-emerald-500">✓</span>
            No tracking cookies
          </span>
          <span aria-hidden className="text-gray-800">·</span>
          <span className="inline-flex items-center gap-1.5 text-gray-500">
            <span aria-hidden className="text-emerald-500">✓</span>
            No ad networks
          </span>
          <span aria-hidden className="text-gray-800">·</span>
          <span className="inline-flex items-center gap-1.5 text-gray-500">
            <span aria-hidden className="text-emerald-500">✓</span>
            No data sales
          </span>
          <span aria-hidden className="text-gray-800">·</span>
          <Link
            href="/methodology"
            className="text-gray-500 hover:text-gray-300 transition-colors underline underline-offset-2 decoration-gray-800 hover:decoration-gray-500"
          >
            Methodology open at /methodology
          </Link>
        </div>

        {/* Nav strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600 pt-6">
          <Link
            href="/"
            className="font-bold text-gray-400 tracking-widest uppercase hover:text-white transition-colors"
          >
            Lode
          </Link>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/"            className="hidden sm:block hover:text-gray-300 transition-colors">Home</Link>
            <Link href="/about"                className="hover:text-gray-300 transition-colors">About</Link>
            <Link href="/coin-melt-calculator" className="hover:text-gray-300 transition-colors">Melt Calculator</Link>
            <Link href="/gram"                 className="hover:text-gray-300 transition-colors">Gram Calculator</Link>
            <Link href="/faq"                  className="hover:text-gray-300 transition-colors">FAQ</Link>
            <Link href="/contact"     className="hover:text-gray-300 transition-colors">Contact</Link>
            <Link href="/privacy"     className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link href="/terms"       className="hover:text-gray-300 transition-colors">Terms</Link>
          </div>
          <span className="hidden sm:block">© {new Date().getFullYear()} Lode</span>
        </div>

      </div>
    </footer>
  );
}
