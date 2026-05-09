import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Consistent site-wide footer used on every page.
 *
 * Trust strip (top): a four-item commitment line shown ONLY to logged-out
 * visitors. Trust signals exist to convert skeptics — once a user has
 * signed in they've already crossed the trust threshold, so the strip
 * becomes noise rather than signal. Same logic applies elsewhere, e.g.
 * /faq's "Is Lode legit?" entry, which we leave in place because logged-in
 * users rarely land there anyway.
 *
 * Nav strip (bottom): links + copyright. Shown to everyone — logged-in
 * users still need access to legal pages, contact, and the calculators.
 *
 * Server component (was "use client"); needs to read session to gate the
 * trust strip and nothing on the page actually requires client behavior.
 */
export async function SiteFooter() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user?.email;

  return (
    /*
     * On mobile, logged-in users get BottomNav for all navigation needs —
     * showing the footer too creates visual clutter and can cause layout bugs
     * (flex-row triggering at ~640px on some viewports pushes links sideways).
     * Hide it entirely on mobile for logged-in users; always show on desktop.
     * Logged-out users keep the footer visible at all sizes since they have
     * no BottomNav and need these links.
     */
    <footer
      className={`border-t px-6 pt-7 pb-8 ${isLoggedIn ? "hidden sm:block" : "block"}`}
      style={{ borderColor: "var(--border)" }}
    >
      <div className="mx-auto max-w-6xl">

        {/* Trust strip — logged-out only */}
        {!isLoggedIn && (
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
        )}

        {/* Nav strip */}
        <nav
          aria-label="Footer navigation"
          className={`flex flex-col items-center gap-3 text-xs text-gray-600 sm:flex-row sm:justify-between sm:gap-4 ${!isLoggedIn ? "pt-6" : ""}`}
        >
          <Link
            href="/"
            className="font-bold text-gray-400 tracking-widest uppercase hover:text-white transition-colors"
          >
            Lode
          </Link>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <Link href="/"                     className="hidden sm:block hover:text-gray-300 transition-colors">Home</Link>
            <Link href="/compare"              className="hover:text-gray-300 transition-colors">Compare</Link>
            <Link href="/coin-melt-calculator" className="hover:text-gray-300 transition-colors">Melt Calculator</Link>
            <Link href="/gram"                 className="hover:text-gray-300 transition-colors">Gram Calculator</Link>
            <Link href="/about"                className="hidden sm:block hover:text-gray-300 transition-colors">About</Link>
            <Link href="/faq"                  className="hover:text-gray-300 transition-colors">FAQ</Link>
            <Link href="/contact"              className="hidden sm:block hover:text-gray-300 transition-colors">Contact</Link>
            <Link href="/privacy"              className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link href="/terms"                className="hover:text-gray-300 transition-colors">Terms</Link>
          </div>
          <span className="hidden sm:block">© {new Date().getFullYear()} Lode</span>
        </nav>

      </div>
    </footer>
  );
}
