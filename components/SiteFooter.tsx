"use client";

import Link from "next/link";

/**
 * Consistent site-wide footer used on every page.
 * Links: Home | About | Melt Calculator | Gram Calculator | FAQ | Contact | Privacy | Terms
 */
export function SiteFooter() {
  return (
    <footer className="border-t px-6 py-8" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
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
    </footer>
  );
}
