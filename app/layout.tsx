import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

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
    "Gold, silver, platinum, and palladium spot prices — updated every 15 minutes. Track your precious metals portfolio, set price alerts, and calculate coin melt values.",
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
      "Gold, silver, platinum, and palladium spot prices — updated every 15 minutes. Track your precious metals portfolio, set price alerts, and calculate coin melt values.",
    type: "website",
    url: "https://lode.rocks",
    siteName: "Lode",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lode — Gold & Silver Spot Prices, Alerts & Portfolio Tracker",
    description:
      "Gold, silver, platinum, and palladium spot prices — updated every 15 minutes. Track your precious metals portfolio, set price alerts, and calculate coin melt values.",
  },
  verification: {
    google: "9e0574274bbeb821",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`bg-surface text-white ${inter.variable}`}>
      <body className="min-h-screen bg-surface text-white antialiased font-sans">
        <Navbar />
        <div className="sm:pb-0 pb-20">
          {children}
        </div>
        <BottomNav />
        <AnalyticsProvider />
      </body>
    </html>
  );
}
