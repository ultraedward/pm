"use client";

import Link from "next/link";

/**
 * Consistent site-wide footer used on every page.
 * Links: Home | Pricing | Contact | Privacy | Terms
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
        <div className="flex gap-6">
          <Link href="/"        className="hidden sm:block hover:text-gray-300 transition-colors">Home</Link>
          <Link href="/pricing" className="hidden sm:block hover:text-gray-300 transition-colors">Pricing</Link>
          <Link href="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
          <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
          <Link href="/terms"   className="hover:text-gray-300 transition-colors">Terms</Link>
        </div>
        <span className="hidden sm:block">© {new Date().getFullYear()} Lode</span>
      </div>
    </footer>
  );
}
