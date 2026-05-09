import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import { RevealObserver } from "@/components/RevealObserver";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import ThemeScript from "@/components/ThemeScript";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lode.rocks"),
  title: {
    default: "Lode — Gold & Silver Spot Prices, Alerts & Portfolio Tracker",
    template: "%s | Lode",
  },
  description:
    "Live gold, silver, platinum, and palladium spot prices. Track your precious metals portfolio, set email price alerts, and calculate coin melt values.",
  keywords: [
    "gold spot price",
    "silver spot price",
    "platinum price today",
    "palladium price",
    "precious metals tracker",
    "gold price alert",
    "silver price alert",
    "coin melt value calculator",
    "gold portfolio tracker",
    "precious metals portfolio",
    "XAU price",
    "XAG price",
  ],
  openGraph: {
    title: "Lode — Gold & Silver Spot Prices, Alerts & Portfolio Tracker",
    description:
      "Live gold, silver, platinum, and palladium spot prices. Track your precious metals portfolio, set email price alerts, and calculate coin melt values.",
    type: "website",
    url: "https://lode.rocks",
    siteName: "Lode",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lode — Gold & Silver Spot Prices, Alerts & Portfolio Tracker",
    description:
      "Live gold, silver, platinum, and palladium spot prices. Track your precious metals portfolio, set email price alerts, and calculate coin melt values.",
  },
  verification: {
    google: "9e0574274bbeb821",
    other: {
      "fo-verify": "d5b8f40c-f451-48b9-a17b-7e60dadabc2b",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Site-wide JSON-LD. Emitted once in the root layout so every page inherits
// the Organization/WebSite graph — enables Google's sitelinks search box and
// knowledge-panel signals without repeating boilerplate on every route.
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://lode.rocks/#org",
      "name": "Lode",
      "url": "https://lode.rocks",
      "email": "hello@lode.rocks",
      "description":
        "Live gold, silver, platinum, and palladium spot prices. Precious metals portfolio tracker, email price alerts, and dealer-pricing comparison.",
    },
    {
      "@type": "WebSite",
      "@id": "https://lode.rocks/#site",
      "url": "https://lode.rocks",
      "name": "Lode",
      "publisher": { "@id": "https://lode.rocks/#org" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://lode.rocks/?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen antialiased font-sans" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        {/* Skip-to-main — visually hidden until focused by keyboard, lets users
            bypass the navigation bar and jump straight to page content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:uppercase focus:tracking-widest"
          style={{ background: "var(--gold)", color: "#000" }}
        >
          Skip to main content
        </a>

        <Navbar />
        <div id="main-content" className="sm:pb-0 pb-20">
          {children}
        </div>
        <BottomNav />
        <AnalyticsProvider />
        <RevealObserver />
      </body>
    </html>
  );
}
