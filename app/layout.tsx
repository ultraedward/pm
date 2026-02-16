import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Precious Metals Prices & Alerts",
  description: "Track gold and silver prices. Set alerts. Move when it matters.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black text-white">
      <body className="min-h-screen bg-black text-white antialiased">
        {/* NAVBAR */}
        <header className="border-b border-gray-800 bg-black">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            {/* Logo */}
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight hover:opacity-80"
            >
              Precious Metals
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-6 text-sm text-gray-300">
              <Link
                href="/"
                className="hover:text-white transition-colors"
              >
                Dashboard
              </Link>

              <Link
                href="/alerts"
                className="hover:text-white transition-colors"
              >
                Alerts
              </Link>

              <Link
                href="/pricing"
                className="hover:text-white transition-colors"
              >
                Pricing
              </Link>

              <Link
                href="/account"
                className="rounded border border-gray-700 px-3 py-1 text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Account
              </Link>
            </nav>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main>{children}</main>
      </body>
    </html>
  );
}