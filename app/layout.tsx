import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lode — Spot Prices, Alerts & Portfolio Tracker",
  description:
    "Daily spot prices for gold, silver, platinum, and palladium. Set price alerts and track your holdings in one place. Free to start.",
  openGraph: {
    title: "Lode — Spot Prices, Alerts & Portfolio Tracker",
    description:
      "Daily spot prices for gold, silver, platinum, and palladium. Set price alerts and track your holdings in one place. Free to start.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lode — Spot Prices, Alerts & Portfolio Tracker",
    description:
      "Daily spot prices for gold, silver, platinum, and palladium. Set price alerts and track your holdings in one place. Free to start.",
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
      </body>
    </html>
  );
}
